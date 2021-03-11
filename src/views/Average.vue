<template>
   <div>
      <v-snackbar
         v-model="snackbar"
         :multi-line="multiLine"
         shaped
         :color="snackColor"
      >
         {{ message }}

         <template v-slot:action="{ attrs }">
            <v-btn
               color="background"
               text
               v-bind="attrs"
               @click="snackbar = false"
            >
               اغلاق
            </v-btn>
         </template>
      </v-snackbar>

      <div class="title-section">
         <h2>المعدلات</h2>
      </div>
      <div>
         <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="3">
               <v-progress-circular
                  :active="loadingBTN"
                  :size="40"
                  :width="5"
                  v-if="loadingBTN"
                  :indeterminate="loadingBTN"
                  color="teal"
               ></v-progress-circular>
               <v-btn
                  color="success"
                  @click="saveAllAverages"
                  v-if="!loadingBTN"
                  :disabled="!foundAverage"
               >
                  حفظ المعدلات
               </v-btn>
            </v-col>
            <v-col cols="3">
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
            <v-col cols="1"></v-col>
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
                     findAverageForFourthLevel(
                        student.college_number,
                        fourthStudentDegree
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
                        findAverageForFourthLevel(
                           student.college_number,
                           fourthStudentDegree
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
import studentDocumentVue from "./studentDocument.vue";
const Excel = require("exceljs");
export default {
   data: () => ({
      fourthStudents: [],
      snackColor: "",
      snackbar: false,
      message: "",
      multiLine: true,
      firstStudents: [],
      secondStudents: [],
      thirdStudents: [],
      originalStudent: [],
      studyType: "",
      typeOfStudy: ["صباحي", "مسائي"],
      fifthStudents: [],
      loadingBar: true,
      loadingBTN: false,
      fourthStudentDegree: [],
      invalidSummerTraining: [],
      fourthLessons: [],
      backupMarks: [],
      foundAverage: null,
      showTable: false,
      login: "",
      totalUnitsFirst: 0,
      totalUnitsSecond: 0,
      totalUnitsThird: 0,
      totalUnitsFourth: 0,
      user: "",
   }),
   created() {
      let self = this;
      self.user = this.$store.state.user;
      let baseUrl = this.$store.state.apiUrl;
      let oldUrl = this.$store.state.oldUrl;
      let studentInfo = `${oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=4&status=1&page=1&limit=1000`;

      let firstClass = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=1`;
      let secondClass = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=2`;
      let thirdClass = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=3`;
      let fourthBackupMarks = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=4`;

      let fourthClass = `${oldUrl}/averageMarks?sectionId=${this.$store.state.user.perv}&level=4`;
      let lessonsForFourth = `${oldUrl}/sectionLessonsForDocument?sectionId=${this.$store.state.user.perv}&level=4`;

      let summerTraining = `${this.$store.state.apiUrl}/summerTrainings/${this.$store.state.user.perv}`;
      let studentAverages = `${this.$store.state.apiUrl}/averageBySection/${this.$store.state.user.perv}`;

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

      function requestFourthLessons() {
         return self.$http.get(lessonsForFourth);
      }

      function requestFourthBackupMarks() {
         return self.$http.get(fourthBackupMarks);
      }

      function requestSummerTraining() {
         return self.$http.get(summerTraining);
      }
      function requestStudentAverages() {
         return self.$http.get(studentAverages);
      }

      Promise.allSettled([
         requestStudentInfo(),
         requestFirstClass(),
         requestSecondClass(),
         requestThirdClass(),
         requestFourthClass(),
         requestFourthLessons(),
         requestFourthBackupMarks(),
         requestSummerTraining(),
         requestStudentAverages(),
      ])
         .then((responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responseThree = responses[2];
            const responseFour = responses[3];
            const responseFive = responses[4];

            const responseSeven = responses[5];
            const responseNine = responses[6];
            const responseTen = responses[7];
            const responseEleven = responses[8];

            self.fourthStudents =
               responseOne.status == "fulfilled" ? responseOne.value.data : [];
            self.originalStudent =
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

            self.fourthLessons =
               responseSeven.status == "fulfilled"
                  ? responseSeven.value.data
                  : [];

            self.backupMarks =
               responseNine.status == "fulfilled"
                  ? responseNine.value.data
                  : [];

            self.invalidSummerTraining =
               responseTen.status == "fulfilled" ? responseTen.value.data : [];

            self.foundAverage =
               responseEleven.status == "fulfilled"
                  ? responseEleven.value.data.length > 0
                     ? false
                     : true
                  : true;

            self.loadingBar = false;
            self.showTable = true;

            console.log(self.backupMarks);
         })
         .catch((errors) => {
            console.log(errors);
         });

      //lessons api

      this.$http
         .get(
            `${oldUrl}/findAverageLessons?sectionId=${this.$store.state.user.perv}&level=4`
         )
         .then((res) => {
            this.totalUnitsFourth = res.data[0].total;
         })
         .catch((e) => {
            console.log(e);
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
               // console.log(degreeForStudent);
               return ((average * 100) / 100 / self.totalUnitsFourth).toFixed(
                  3
               );
            } else {
               console.log(foundStudent);
               return self.findStudentLevel(
                  collageNumber,
                  self.backupMarks,
                  4,
                  "صباحي"
               );
            }
         } else {
            if (
               self.backupMarks.find(
                  (student) => student.collageNumber == collageNumber
               )
            ) {
               return self.findStudentLevel(
                  collageNumber,
                  self.backupMarks,
                  4,
                  "صباحي"
               );
            } else {
               return 0;
            }
         }
      },
      checkForSummerTraining(summerTrainingStudents, collegeNumber) {
         let foundStudent = summerTrainingStudents.filter((student) => {
            return student.collageNumber == collegeNumber;
         });

         if (foundStudent.length > 0) {
            return true;
         } else {
            return false;
         }
      },
      saveAllAverages() {
         let self = this;
         self.loadingBTN = true;

         let filteredStudent = self.fourthStudents.map((student) => {
            if (
               self.findTotalDegree(
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
                  self.findAverageForFourthLevel(
                     student.college_number,
                     self.fourthStudentDegree
                  )
               ) > 50 &&
               !self.checkForSummerTraining(
                  self.invalidSummerTraining,
                  student.college_number
               )
            ) {
               return {
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
                     self.findAverageForFourthLevel(
                        student.college_number,
                        self.fourthStudentDegree
                     )
                  ),
                  collegeNumber: student.college_number,
                  sectionId: self.$store.state.user.perv,
                  studyType: student.type == "صباحي" ? 1 : 2,
               };
            } else {
            }
         });

         self.$http
            .post(
               `${self.$store.state.apiUrl}/addMultiAverages`,
               filteredStudent.filter((student) => student != undefined)
            )
            .then((res) => {
               console.log(res);
               self.loadingBTN = false;
               self.message = "تم خزن البيانات";
               self.snackColor = "green";
               self.snackbar = true;
            })
            .catch((e) => {
               console.log(e);
               self.loadingBTN = false;
               self.message = "حدث خطأ تأكد من الاتصال";
               self.snackColor = "error";
               self.snackbar = true;
            });
      },
      findTotalDegree(first, second, third, fourth) {
         return (
            first * 0.1 +
            second * 0.2 +
            third * 0.3 +
            fourth * 0.4
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
      },
      async createExcelFile() {
         let self = this;
         const workbook = new Excel.Workbook();
         const worksheet = workbook.addWorksheet("My Sheet");
         worksheet.views = [{ rightToLeft: true }];

         if (this.$store.state.user.perv == 30) {
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
         } else {
            worksheet.columns = [
               { header: "Id", key: "id", width: 10 },
               { header: "اسم الطالب", key: "name", width: 55 },
               { header: "الرقم الاحصائي", key: "collageNumber", width: 55 },
               { header: "المرحلة الاولى", key: "levelOne", width: 55 },
               { header: "المرحلة الثانية	", key: "levelTwo", width: 55 },
               { header: "المرحلة الثالثة", key: "levelThree", width: 55 },
               { header: "المرحلة الرابعة", key: "levelFour", width: 55 },
               { header: "	المعدل التراكمي", key: "average", width: 55 },
            ];
         }

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
               levelFour: self.findAverageForFourthLevel(
                  student.college_number,
                  self.fourthStudentDegree
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
                  self.findAverageForFourthLevel(
                     student.college_number,
                     self.fourthStudentDegree
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
