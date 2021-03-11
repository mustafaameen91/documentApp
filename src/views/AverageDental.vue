<template>
   <div>
      <div class="title-section">
         <h2>المعدلات</h2>
      </div>
      <div>
         <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6">
               <v-btn color="success" @click="createExcelFile">
                  تصدير Excel
               </v-btn>
            </v-col>
            <v-col cols="2">
               <v-select
                  v-model="studyType"
                  :items="typeOfStudy"
                  label="الدراسة"
                  @change="checkForClass"
                  dense
                  outlined
               ></v-select>
            </v-col>
         </v-row>
      </div>

      <v-row>
         <v-col align-self="center" style="text-align:center">
            <v-progress-circular
               :active="loadingBar"
               :size="70"
               :width="7"
               v-if="loadingBar"
               :indeterminate="loadingBar"
               color="teal"
            ></v-progress-circular>
         </v-col>
      </v-row>

      <table border="1" style="margin:10px auto" v-if="!loadingBar">
         <tr>
            <th>التسلسل</th>
            <th>اسم الطالب</th>
            <th>المرحلة الاولى</th>
            <th>المرحلة الثانية</th>
            <th>المرحلة الثالثة</th>
            <th>المرحلة الرابعة</th>
            <th>المرحلة الخامسة</th>
            <th>المعدل التراكمي</th>
         </tr>
         <tr
            v-for="(student, index) in fourthStudents"
            :key="index"
            v-if="showTable"
         >
            <td>
               <p style="text-align:center">{{ index + 1 }}</p>
            </td>
            <td>
               <p style="text-align:center">{{ student.name }}</p>
               <p style="text-align:center">{{ student.college_number }}</p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{
                     findStudentLevel(
                        student.college_number,
                        firstStudents,
                        1,
                        student.type
                     )
                  }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{
                     findStudentLevel(
                        student.college_number,
                        secondStudents,
                        2,
                        student.type
                     )
                  }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{
                     findStudentLevel(
                        student.college_number,
                        thirdStudents,
                        3,
                        student.type
                     )
                  }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{
                     findStudentLevel(
                        student.college_number,
                        fourthStudentDegree,
                        4,
                        student.type
                     )
                  }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{
                     findAverageForFourthLevel(
                        student.college_number,
                        fifthStudents
                     )
                  }}
               </p>
            </td>

            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{
                     findTotalDegree(
                        findStudentLevel(
                           student.college_number,
                           firstStudents,
                           1,
                           student.type
                        ),
                        findStudentLevel(
                           student.college_number,
                           secondStudents,
                           2,
                           student.type
                        ),
                        findStudentLevel(
                           student.college_number,
                           thirdStudents,
                           3,
                           student.type
                        ),
                        findStudentLevel(
                           student.college_number,
                           fourthStudentDegree,
                           4,
                           student.type
                        ),
                        findAverageForFourthLevel(
                           student.college_number,
                           fifthStudents
                        )
                     )
                  }}
               </p>
            </td>
         </tr>
      </table>
   </div>
</template>

<script>
const Excel = require("exceljs");
export default {
   data: () => ({
      fourthStudents: [],
      firstStudents: [],
      secondStudents: [],
      thirdStudents: [],
      fifthStudents: [],
      fourthStudentDegree: [],
      originalStudent: [],
      fourthLessons: [],
      studyType: "",
      typeOfStudy: ["صباحي", "مسائي"],
      showTable: false,
      login: "",
      loadingBar: true,
      totalUnitsFirst: 0,
      totalUnitsSecond: 0,
      totalUnitsThird: 0,
      totalUnitsFourth: 0,
      totalUnitsFifth: 0,
      user: "",
   }),
   created() {
      let self = this;
      self.user = this.$store.state.user;
      let baseUrl = this.$store.state.apiUrl;
      let oldUrl = this.$store.state.oldUrl;
      let studentInfo = `${oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=5&status=1&page=1&limit=1000`;

      let firstClass = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=1`;
      let secondClass = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=2`;
      let thirdClass = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=3`;
      let fourthClass = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=4`;
      let fifthClass = `${oldUrl}/averageMarks?sectionId=${this.$store.state.user.perv}&level=5`;
      let lessonsForFourth = `${oldUrl}/sectionLessonsForDocument?sectionId=${this.$store.state.user.perv}&level=5`;

      function requestStudentInfo() {
         return self.$http.get(studentInfo);
      }

      function requestFirstClass() {
         return self.$http.get(firstClass);
      }

      function requestSecondClass() {
         return self.$http.get(secondClass);
      }

      function requestThirdClass() {
         return self.$http.get(thirdClass);
      }

      function requestFourthClass() {
         return self.$http.get(fourthClass);
      }
      function requestFifthClass() {
         return self.$http.get(fifthClass);
      }
      function requestFourthLessons() {
         return self.$http.get(lessonsForFourth);
      }

      Promise.allSettled([
         requestStudentInfo(),
         requestFirstClass(),
         requestSecondClass(),
         requestThirdClass(),
         requestFourthClass(),
         requestFifthClass(),
         requestFourthLessons(),
      ])
         .then((responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responseThree = responses[2];
            const responseFour = responses[3];
            const responseFive = responses[4];
            const responseSix = responses[5];
            const responseSeven = responses[6];

            self.fourthStudents =
               responseOne.status == "fulfilled" ? responseOne.value.data : [];
            self.firstStudents =
               responseTwo.status == "fulfilled" ? responseTwo.value.data : [];
            self.secondStudents =
               responseThree.status == "fulfilled"
                  ? responseThree.value.data
                  : [];
            self.thirdStudents =
               responseFour.status == "fulfilled"
                  ? responseFour.value.data
                  : [];
            self.fourthStudentDegree =
               responseFive.status == "fulfilled"
                  ? responseFive.value.data
                  : [];
            self.fifthStudents =
               responseSix.status == "fulfilled" ? responseSix.value.data : [];
            self.originalStudent =
               responseSix.status == "fulfilled" ? responseSix.value.data : [];
            self.fourthLessons =
               responseSeven.status == "fulfilled"
                  ? responseSeven.value.data
                  : [];
            self.loadingBar = false;
            self.showTable = true;
         })
         .catch((errors) => {
            console.log(errors);
         });

      //lessons api

      this.$http
         .get(
            `${baseUrl}/totalLessonsUnits?sectionId=${this.$store.state.user.perv}&level=3&studyType="صباحي"`
         )
         .then((res) => {
            this.totalUnitsThird = res.data[0].total;
         });

      this.$http
         .get(
            `${baseUrl}/totalLessonsUnits?sectionId=${this.$store.state.user.perv}&level=2&studyType="صباحي"`
         )
         .then((res) => {
            this.totalUnitsSecond = res.data[0].total;
         });

      this.$http
         .get(
            `${baseUrl}/totalLessonsUnits?sectionId=${this.$store.state.user.perv}&level=1&studyType="صباحي"`
         )
         .then((res) => {
            this.totalUnitsFirst = res.data[0].total;
         });

      this.$http
         .get(
            `${baseUrl}/totalLessonsUnits?sectionId=${this.$store.state.user.perv}&level=4&studyType="صباحي"`
         )
         .then((res) => {
            this.totalUnitsFourth = res.data[0].total;
         });

      this.$http
         .get(
            `${oldUrl}/findAverageLessons?sectionId=${this.$store.state.user.perv}&level=5`
         )
         .then((res) => {
            this.totalUnitsFifth = res.data[0].total;
         });
   },
   methods: {
      findStudentLevel(collageNumber, arrayOfStudent, level, type) {
         let self = this;
         let studentAverage = 0;
         let totalLessonAverage = 0;

         let foundStudent = arrayOfStudent.filter((student) => {
            if (
               (student.collageNumber == collageNumber ||
                  "0" + student.collageNumber == collageNumber) &&
               student.level == level &&
               student.studyType == type
            ) {
               studentAverage += student.mark * student.units;
               totalLessonAverage += student.units;
            }
         });

         if (studentAverage > 0) {
            if (level == 1) {
               return (
                  (studentAverage * 100) /
                  100 /
                  totalLessonAverage
               ).toFixed(3);
            } else if (level == 2) {
               return (
                  (studentAverage * 100) /
                  100 /
                  totalLessonAverage
               ).toFixed(3);
            } else {
               return (
                  (studentAverage * 100) /
                  100 /
                  totalLessonAverage
               ).toFixed(3);
            }
         } else {
            return 0;
         }
      },
      checkForClass() {
         let self = this;
         self.fourthStudents = self.originalStudent;
         let matchNumber;
         console.log(self.studyType);
         matchNumber = self.fourthStudents.filter((student) => {
            return student.type == self.studyType;
         });
         console.log(matchNumber);
         if (matchNumber.length > 0) {
            self.fourthStudents = matchNumber;
         } else {
            self.fourthStudents = self.originalStudent;
         }
      },

      getLastYearMarks(lesson, levelType) {
         let self = this;
         let firstExam = lesson.find((degree) => degree.markType == "custom");

         let secondExam = lesson.find((degree) => degree.markType == "custom2");

         if (firstExam != undefined) {
            let total = firstExam.degree * firstExam.credit;
            return total;
         } else if (secondExam != undefined) {
            let total = secondExam.degree * secondExam.credit;
            return total;
         }

         if (levelType == 1) {
            let secondFinal = lesson.find(
               (degree) => degree.markType == "final2"
            );

            if (secondFinal != undefined) {
               let average = lesson.filter((mark) => {
                  return (
                     mark.markType != "final1" &&
                     mark.markType != "practicalFinal"
                  );
               });

               let allAverage = average.reduce(function(
                  accumulator,
                  currentValue
               ) {
                  return (
                     accumulator + currentValue.degree * currentValue.credit
                  );
               },
               0);

               return allAverage;
            } else {
               let allAverage = lesson.reduce(function(
                  accumulator,
                  currentValue
               ) {
                  return (
                     accumulator + currentValue.degree * currentValue.credit
                  );
               },
               0);

               return allAverage;
            }
         } else if (levelType == 2) {
            let secondFinal = lesson.find(
               (degree) => degree.markType == "final2"
            );

            if (secondFinal != undefined) {
               let average = lesson.filter((mark) => {
                  return (
                     mark.markType != "final1" &&
                     mark.markType != "th2" &&
                     mark.markType != "pr2" &&
                     mark.markType != "practicalFinal"
                  );
               });

               let allAverage = average.reduce(function(
                  accumulator,
                  currentValue
               ) {
                  return (
                     accumulator + currentValue.degree * currentValue.credit
                  );
               },
               0);

               return allAverage;
            } else {
               let average = lesson.filter((mark) => {
                  return mark.markType != "th2" && mark.markType != "pr2";
               });

               let allAverage = average.reduce(function(
                  accumulator,
                  currentValue
               ) {
                  return (
                     accumulator + currentValue.degree * currentValue.credit
                  );
               },
               0);

               return allAverage;
            }
         }
      },

      findAverageForFourthLevel(collageNumber, arrayOfStudents) {
         let self = this;

         let foundStudent = arrayOfStudents.filter((student) => {
            return (
               student.college_number == collageNumber ||
               "0" + student.college_number == collageNumber
            );
         });

         if (foundStudent.length > 0) {
            let degreeForStudent = [];

            let studentLesson = self.fourthLessons.map((lesson) => {
               let newDegree = foundStudent.filter((student) => {
                  return student.lessonId == lesson.id;
               });

               if (newDegree.length > 0) {
                  let average = self.getLastYearMarks(
                     newDegree,
                     self.$store.state.levelType
                  );

                  degreeForStudent.push(average);
               }
            });

            if (degreeForStudent.length > 0) {
               let average = degreeForStudent.reduce(function(
                  accumulator,
                  currentValue
               ) {
                  return accumulator + currentValue;
               },
               0);
               return ((average * 100) / 100 / self.totalUnitsFifth).toFixed(3);
            }
         } else {
            return 0;
         }
      },
      findTotalDegree(first, second, third, fourth, fifth) {
         return (
            first * 0.05 +
            second * 0.1 +
            third * 0.15 +
            fourth * 0.3 +
            fifth * 0.4
         ).toFixed(3);
      },
      findStudentName(collageNumber, arrayOfStudent) {
         let foundStudent = arrayOfStudent.filter((student) => {
            if (
               student.collageNumber == collageNumber ||
               "0" + student.collageNumber == collageNumber
            ) {
               return student;
            }
         });

         if (foundStudent.length > 0) {
            return `${foundStudent[0].studentName}`;
         } else {
            return ` لايوجد`;
         }
         //theoretical + practical + yearWorkTh + yearWorkPh + practicalFinal +  final1  || If less than 50 try final2
      },
      async createExcelFile() {
         let self = this;
         const workbook = new Excel.Workbook();
         const worksheet = workbook.addWorksheet("My Sheet");
         worksheet.views = [{ rightToLeft: true }];

         worksheet.columns = [
            { header: "Id", key: "id", width: 10 },
            { header: "اسم الطالب", key: "name", width: 55 },
            { header: "الرقم الاحصائي", key: "collageNumber", width: 55 },
            { header: "المرحلة الاولى", key: "levelOne", width: 55 },
            { header: "المرحلة الثانية	", key: "levelTwo", width: 55 },
            { header: "المرحلة الثالثة", key: "levelThree", width: 55 },
            { header: "المرحلة الرابعة", key: "levelFour", width: 55 },
            { header: "المرحلة الخامسة", key: "levelFive", width: 55 },
            { header: "	المعدل التراكمي", key: "average", width: 55 },
         ];

         this.fourthStudents.forEach((student) => {
            worksheet.addRow({
               id: student.id,
               name: student.name,
               collageNumber: student.college_number,
               levelOne: self.findStudentLevel(
                  student.college_number,
                  self.firstStudents,
                  1,
                  student.type
               ),
               levelTwo: self.findStudentLevel(
                  student.college_number,
                  self.secondStudents,
                  2,
                  student.type
               ),
               levelThree: self.findStudentLevel(
                  student.college_number,
                  self.thirdStudents,
                  3,
                  student.type
               ),
               levelFour: self.findStudentLevel(
                  student.college_number,
                  self.fourthStudentDegree,
                  1,
                  student.type
               ),
               levelFive: self.findAverageForFourthLevel(
                  student.college_number,
                  self.fifthStudents
               ),
               average: self.findTotalDegree(
                  self.findStudentLevel(
                     student.college_number,
                     self.firstStudents,
                     1,
                     student.type
                  ),
                  self.findStudentLevel(
                     student.college_number,
                     self.secondStudents,
                     2,
                     student.type
                  ),
                  self.findStudentLevel(
                     student.college_number,
                     self.thirdStudents,
                     3,
                     student.type
                  ),
                  self.findStudentLevel(
                     student.college_number,
                     self.fourthStudentDegree,
                     4,
                     student.type
                  ),
                  self.findAverageForFourthLevel(
                     student.college_number,
                     self.fifthStudents
                  )
               ),
            });
         });
         worksheet.getColumn(1).hidden = true;

         // worksheet.getColumn(1).eachCell((cell) => {
         //    console.log(cell);
         // });

         worksheet.eachRow(function(row, rowNumber) {
            row.eachCell((cell) => {
               cell.alignment = { vertical: "middle", horizontal: "center" };
               if (cell.value == "غ") {
                  cell.font = { bold: true };
                  cell.alignment = { vertical: "middle", horizontal: "center" };
                  cell.fill = {
                     type: "pattern",
                     pattern: "darkTrellis",
                     fgColor: { argb: "FFFF0000" },
                     bgColor: { argb: "FF0000FF" },
                  };
               }
            });
         });

         worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.fill = {
               type: "pattern",
               pattern: "darkTrellis",
               fgColor: { argb: "FFFFFF00" },
               bgColor: { argb: "FF0000FF" },
            };
         });

         workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {
               type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute("style", "display: none");
            a.href = url;
            a.download = `studentAverage.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
         });
      },
   },
};
</script>

<style lang="scss" scoped>
.title-section {
   text-align: center;
   width: 300px;
   margin: 20px auto;
}
.title-section h2 {
   padding: 10px;
   border-radius: 10px;
   background: #ffffff;
   box-shadow: 5px 5px 10px #e0e0e0, -5px -5px 10px #e0e0e0;
}
table th {
   position: sticky;
   padding: 10px;
   top: 0;
   z-index: 5;
   background: #fff;
}
</style>
