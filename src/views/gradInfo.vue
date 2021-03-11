<template>
   <div v-if="showAll" class="document-doc">
      <v-row style="text-align:center">
         <v-col>
            <h4>الى /</h4>
            <h4>م / وثيقة تخرج بالدرجات</h4>
         </v-col>
      </v-row>
      <v-row>
         <v-col cols="6">
            <h3>الاسم الكامل : {{ findStudent.studentName }}</h3>
            <h3>محل وتاريخ الولادة : {{ findStudent.dob }}</h3>
            <h3>الشهادة : بكالوريوس</h3>
            <h3>القسم : {{ findStudent.sectionName }}</h3>
            <h3>سنة القبول : {{ findStudent.enterYear }}</h3>
            <h3>تاريخ التخرج : 22/10/2020</h3>
            <h3>
               ادناه المواد الدراسية والدرجات التي حصل عليها خلال سنوات الدراسة
               .
            </h3>
         </v-col>
         <v-col cols="6">
            <h3>
               المعدل :
               {{ findStudent.average }}
               %
            </h3>
            <h3>
               التقدير :
               {{ findStudent.averageWriting }}
            </h3>
            <h3>الجنسية : عراقي</h3>
            <h3>الدراسة : {{ findStudent.type }}</h3>
            <h3>
               التسلسل :
               {{ findStudent.sequence }}
               من مجموع {{ findStudent.totalStudents }} خريجاً
            </h3>
            <h3>
               علماً ان معدل الخريح الاول :
               {{ findStudent.firstAverage }}
               %
            </h3>
         </v-col>
      </v-row>

      <v-row>
         <v-col cols="6">
            <table
               border="1"
               style="width:95%;border-spacing: 0px;text-align:center;margin: auto;"
            >
               <tr>
                  <th>السنة الاولى</th>
                  <th colspan="3">
                     {{
                        studentLessonMarks(
                           findStudent.collegeId,
                           firstYearMarks,
                           1,
                           findStudent.type
                        )[0].year
                     }}
                  </th>
               </tr>
               <tr>
                  <th style="width:40%">الموضوع</th>
                  <th colspan="2">
                     <table style="width:100%;border-spacing: 0px">
                        <tr>
                           <td colspan="2" style="border-bottom: 2px solid;">
                              الدرجة
                           </td>
                        </tr>

                        <tr>
                           <td style="width:26% ;border-left: 1px solid;">
                              رقما
                           </td>
                           <td style="border-right: 1px solid;">كتابة</td>
                        </tr>
                     </table>
                  </th>
                  <th style="width : 15%">الوحدات</th>
               </tr>
               <tr
                  v-for="(mark, index) in studentLessonMarks(
                     findStudent.collegeId,
                     firstYearMarks,
                     1,
                     findStudent.type
                  )"
                  :key="index"
               >
                  <td>{{ mark.lessonName }}</td>
                  <td style="width:12% ">
                     <span v-if="mark.phase == 2" style="color:red">*</span
                     >{{ mark.mark }}
                  </td>
                  <td>{{ mark.numberWriting }}</td>
                  <td>{{ mark.units }}</td>
               </tr>
               <tfoot>
                  <td colspan="2">ناجح من</td>
                  <td colspan="2">الدور الاول</td>
               </tfoot>
            </table>
         </v-col>

         <v-col cols="6">
            <table
               border="1"
               style="width:95%;border-spacing: 0px;text-align:center;margin: auto;"
            >
               <tr>
                  <th>السنة الثانية</th>
                  <th colspan="3">
                     {{
                        studentLessonMarks(
                           findStudent.collegeId,
                           secondYearMarks,
                           2,
                           findStudent.type
                        )[0].year
                     }}
                  </th>
               </tr>
               <tr>
                  <th style="width:40%">الموضوع</th>
                  <th colspan="2">
                     <table style="width:100%;border-spacing: 0px">
                        <tr>
                           <td colspan="2" style="border-bottom: 2px solid;">
                              الدرجة
                           </td>
                        </tr>

                        <tr>
                           <td style="width:26% ;border-left: 1px solid;">
                              رقما
                           </td>
                           <td style="border-right: 1px solid;">كتابة</td>
                        </tr>
                     </table>
                  </th>
                  <th style="width : 15%">الوحدات</th>
               </tr>
               <tr
                  v-for="(mark, index) in studentLessonMarks(
                     findStudent.collegeId,
                     secondYearMarks,
                     2,
                     findStudent.type
                  )"
                  :key="index"
               >
                  <td>{{ mark.lessonName }}</td>
                  <td style="width:12% ">
                     <span v-if="mark.phase == 2" style="color:red">*</span
                     >{{ mark.mark }}
                  </td>
                  <td>{{ mark.numberWriting }}</td>
                  <td>{{ mark.units }}</td>
               </tr>
               <tfoot>
                  <td colspan="2">ناجح من</td>
                  <td colspan="2">الدور الاول</td>
               </tfoot>
            </table>
         </v-col>
      </v-row>

      <v-row>
         <v-col cols="6">
            <table
               border="1"
               style="width:95%;border-spacing: 0px;text-align:center;margin: auto;"
            >
               <tr>
                  <th>السنة الثالثة</th>
                  <th colspan="3">
                     {{
                        studentLessonMarks(
                           findStudent.collegeId,
                           thirdYearMarks,
                           3,
                           findStudent.type
                        )[0].year
                     }}
                  </th>
               </tr>
               <tr>
                  <th style="width:40%">الموضوع</th>
                  <th colspan="2">
                     <table style="width:100%;border-spacing: 0px">
                        <tr>
                           <td colspan="2" style="border-bottom: 2px solid;">
                              الدرجة
                           </td>
                        </tr>

                        <tr>
                           <td style="width:26% ;border-left: 1px solid;">
                              رقما
                           </td>
                           <td style="border-right: 1px solid;">كتابة</td>
                        </tr>
                     </table>
                  </th>
                  <th style="width : 15%">الوحدات</th>
               </tr>
               <tr
                  v-for="(mark, index) in studentLessonMarks(
                     findStudent.collegeId,
                     thirdYearMarks,
                     3,
                     findStudent.type
                  )"
                  :key="index"
               >
                  <td>{{ mark.lessonName }}</td>
                  <td style="width:12% ">
                     <span v-if="mark.phase == 2" style="color:red">*</span
                     >{{ mark.mark }}
                  </td>
                  <td>{{ mark.numberWriting }}</td>
                  <td>{{ mark.units }}</td>
               </tr>
               <tfoot>
                  <td colspan="2">ناجح من</td>
                  <td colspan="2">الدور الاول</td>
               </tfoot>
            </table>
         </v-col>

         <v-col cols="6">
            <table
               border="1"
               style="width:95%;border-spacing: 0px;text-align:center;margin: auto;"
            >
               <tr>
                  <th>السنة الرابعة</th>
                  <th colspan="3">
                     2019 - 2020
                  </th>
               </tr>
               <tr>
                  <th style="width:40%">الموضوع</th>
                  <th colspan="2">
                     <table style="width:100%;border-spacing: 0px">
                        <tr>
                           <td colspan="2" style="border-bottom: 2px solid;">
                              الدرجة
                           </td>
                        </tr>

                        <tr>
                           <td style="width:26% ;border-left: 1px solid;">
                              رقما
                           </td>
                           <td style="border-right: 1px solid;">كتابة</td>
                        </tr>
                     </table>
                  </th>
                  <th style="width : 15%">الوحدات</th>
               </tr>
               <tr
                  v-for="(mark, index) in getLastYearLessonsMarks(
                     findStudent.collegeId,
                     fourthStudentsDegrees
                  )"
                  :key="index"
               >
                  <td>{{ mark.lessonName }}</td>
                  <td style="width:12% ">{{ mark.degree }}</td>
                  <td>{{ numberToWord(mark.degree) }}</td>
                  <td>{{ mark.credit }}</td>
               </tr>
               <tfoot>
                  <td colspan="2">ناجح من</td>
                  <!-- <h3>الدور : {{checkForSecondTerm(findStudent , fourthStudentsDegrees) | phaseRole}}</h3> -->
                  <td colspan="2">
                     {{
                        checkForSecondTerm(findStudent, fourthStudentsDegrees)
                           | phaseRole
                     }}
                  </td>
               </tfoot>
            </table>
         </v-col>
      </v-row>

      <v-row>
         <v-col cols="12">
            <h5>
               التقديرات : مقبول ( ٥٠ - ٥٩ ) ، متوسط ( ٦٠ - ٦٩ ) ، جيد ( ٧٠ - ٧٩
               ) ، جيد جداً ( ٨٠ - ٨٩ ) ، امتياز ( ٩٠ - ١٠٠ ) .
            </h5>
            <h5 style="text-decoration : underline">الملاحظات:</h5>
            <pre style="display:inline-block"></pre>
            <h5 style="display:inline-block">
               ١- المدة الاصغرية المطلوبة لنيل شهادة البكالوريوس هي اربع سنوات .
            </h5>
            <br />
            <pre style="display:inline-block"></pre>
            <h5 style="display:inline-block">
               ٢- ترمز العلامة * لدرجة النجاح بالدور الثاني .
            </h5>
            <br />
            <pre style="display:inline-block"></pre>
            <h5 style="display:inline-block">
               ٣- سنوات الرسوب : {{ findStudent.failYears }}&nbsp;
            </h5>
            <pre style="display:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;</pre>
            <h5 style="display:inline-block">
               سنوات التأجيل :
               {{ findStudent.postponementYear }}
            </h5>
            <br />
            <pre style="display:inline-block"></pre>
            <h5 style="display:inline-block">
               ٤- اعتبار الطالب مستوف في التدريب الصيفي للمرحلة الثالثة .
            </h5>
            <br />
         </v-col>
      </v-row>

      <v-row class="not-printable">
         <v-col>
            <v-btn color="info" @click="print">
               طباعة
            </v-btn>
         </v-col>
      </v-row>
   </div>
</template>

<script>
const { convert } = require("pronumjs");
export default {
   data() {
      return {
         findStudent: this.$store.state.printStudentDoc,
         chosenStudent: "",
         show: false,
         storeLoading: false,
         chosenDocumentType: "",
         studyTypes: [
            { name: "الكل", value: 0 },
            { name: "حسب دراسة الطالب", value: 1 },
         ],
         documentType: [
            { name: "تأييد تخرج", value: 1 },
            { name: "وثيقة تخرج", value: 2 },
         ],
         snackbarSuccess: false,
         snackbar: false,
         showAll: false,
         multiLine: true,
         phase: 1,
         showConfirm: false,
         message: "",
         postponementYear: "",
         failYears: "",
         chosenStudyType: 0,
         allStudents: [],
         studentLength: 0,
         firstYearMarks: [],
         secondYearMarks: [],
         thirdYearMarks: [],
         firstClass: [],
         secondClass: [],
         thirdClass: [],
         backupMarks: [],
         sequenceType: 0,
         summerTrainingStudents: [],
         fourthStudentsDegrees: [],
         fourthLessons: [],
         totalUnitsFourth: 0,
         lessonTotal: 0,
         e1: 1,
      };
   },
   created() {
      console.log(this.$store.state.printStudentDoc);
      this.searchForStudent();
   },
   methods: {
      searchForStudent() {
         let self = this;

         this.$http
            .get(
               `${this.$store.state.oldUrl}/levels?sectionId=${this.$store.state.user.perv}&level=5&year=${this.$store.state.user.currentYear}`
            )
            .then((res) => {
               if (res.data.length == 0) {
                  this.$store.state.levelType = 1;
               } else {
                  this.$store.state.levelType = res.data[0].type * 1;
               }
            }).catch(e =>{
               console.log(e)
            })

         let baseUrl = this.$store.state.apiUrl;
         let oldUrl = this.$store.state.oldUrl;

         let firstClass = `${baseUrl}/studentLevelDegree?sectionId=${this.findStudent.sectionId}&level=1&collageNumber=${this.findStudent.collageNumber}`;
         let secondClass = `${baseUrl}/studentLevelDegree?sectionId=${this.findStudent.sectionId}&level=2&collageNumber=${this.findStudent.collageNumber}`;
         let thirdClass = `${baseUrl}/studentLevelDegree?sectionId=${this.findStudent.sectionId}&level=3&collageNumber=${this.findStudent.collageNumber}`;

         let fourthClass = `${oldUrl}/averageMarks?sectionId=${this.findStudent.sectionId}&level=4`;
         let fourthAverage = `${oldUrl}/findAverageLessons?sectionId=${this.findStudent.sectionId}&level=4`;
         let lessonsForFourth = `${oldUrl}/sectionLessonsForDocument?sectionId=${this.findStudent.sectionId}&level=4`;
         let totalUnitsFourths = `${oldUrl}/findAverageLessons?sectionId=${this.findStudent.sectionId}&level=4`;

         let firstYear = `${baseUrl}/sectionDegree?sectionId=${this.findStudent.sectionId}&level=1`;
         let secondYear = `${baseUrl}/sectionDegree?sectionId=${this.findStudent.sectionId}&level=2`;
         let thirdYear = `${baseUrl}/sectionDegree?sectionId=${this.findStudent.sectionId}&level=3`;
         let fourthBackupMarks = `${baseUrl}/sectionDegree?sectionId=${this.findStudent.sectionId}&level=4`;

         let summerTraining = `${baseUrl}/summerTrainings/${this.findStudent.sectionId}`;

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
         function requestFourthAverage() {
            return self.$http.get(fourthAverage);
         }

         function requestFourthLessons() {
            return self.$http.get(lessonsForFourth);
         }

         function requestFourthLessonsAverage() {
            return self.$http.get(totalUnitsFourths);
         }

         function requestFirstYear() {
            return self.$http.get(firstYear);
         }
         function requestSecondYear() {
            return self.$http.get(secondYear);
         }
         function requestThirdYear() {
            return self.$http.get(thirdYear);
         }

         function requestFourthBackupMarks() {
            return self.$http.get(fourthBackupMarks);
         }

         function requestSummerTraining() {
            return self.$http.get(summerTraining);
         }

         Promise.allSettled([
            requestFirstClass(),
            requestSecondClass(),
            requestThirdClass(),
            requestFourthClass(),
            requestFourthAverage(),
            requestFourthLessons(),
            requestFourthLessonsAverage(),
            requestFirstYear(),
            requestSecondYear(),
            requestThirdYear(),
            requestFourthBackupMarks(),
            requestSummerTraining(),
         ])
            .then((responses) => {
               const responseOne = responses[0];
               const responseTwo = responses[1];
               const responseThree = responses[2];
               const responseFourth = responses[3];
               const responseFourthAverage = responses[4];

               const responseSeven = responses[5];
               const responseNine = responses[6];

               const firstYear = responses[7];
               const secondYear = responses[8];
               const thirdYear = responses[9];
               const responseTen = responses[10];
               const responseSummerTraining = responses[11];

               self.firstClass =
                  responseOne.status == "fulfilled"
                     ? responseOne.value.data
                     : [];
               self.secondClass =
                  responseTwo.status == "fulfilled"
                     ? responseTwo.value.data
                     : [];
               self.thirdClass =
                  responseThree.status == "fulfilled"
                     ? responseThree.value.data
                     : [];
               self.fourthStudentsDegrees =
                  responseFourth.status == "fulfilled"
                     ? responseFourth.value.data
                     : [];
               self.lessonTotal =
                  responseFourthAverage.status == "fulfilled"
                     ? responseFourthAverage.value.data
                     : [];
               self.fourthLessons =
                  responseSeven.status == "fulfilled"
                     ? responseSeven.value.data
                     : [];
               self.totalUnitsFourth =
                  responseNine.status == "fulfilled"
                     ? responseNine.value.data[0].total
                     : 0;
               self.backupMarks =
                  responseTen.status == "fulfilled"
                     ? responseTen.value.data
                     : [];

               self.firstYearMarks =
                  firstYear.status == "fulfilled" ? firstYear.value.data : [];
               self.secondYearMarks =
                  secondYear.status == "fulfilled" ? secondYear.value.data : [];
               self.thirdYearMarks =
                  thirdYear.status == "fulfilled" ? thirdYear.value.data : [];
               self.summerTrainingStudents =
                  responseSummerTraining.status == "fulfilled"
                     ? responseSummerTraining.value.data
                     : [];

               self.showAll = true;

               if (self.chosenDocumentType == 2) {
                  self.showConfirm = true;
                  self.show = false;
               } else {
                  self.show = true;
                  self.showConfirm = false;
               }
            })
            .catch((e) => {
               console.log(e);
            });
      },
      findAverageWriting(average) {
         if (average >= 50 && average <= 59.999) {
            return "مقبول";
         } else if (average >= 60 && average <= 69.999) {
            return "متوسط";
         } else if (average >= 70 && average <= 79.999) {
            return "جيد";
         } else if (average >= 80 && average <= 89.999) {
            return "جيد جدا";
         } else if (average >= 90 && average <= 100) {
            return "امتياز";
         } else {
            return "راسب";
         }
      },
      print() {
         setTimeout(function() {
            window.print();
         }, 100);
      },
      numberToWord(number) {
         return convert(number);
      },
      findStudentLevel(collageNumber, arrayOfStudent, level, type) {
         let self = this;
         let studentAverage = 0;
         let totalLessonAverage = 0;

         let foundStudent = arrayOfStudent.filter((student) => {
            studentAverage += student.mark * student.units;
            totalLessonAverage += student.units;
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
      studentLessonMarks(collageNumber, arrayOfStudents, level, type) {
         let self = this;

         let foundStudent = arrayOfStudents.filter((student) => {
            if (
               student.collageNumber == collageNumber &&
               student.level == level &&
               student.studyType == type
            ) {
               return student;
            }
         });

         if (foundStudent.length > 0) {
            return foundStudent;
         } else if (foundStudent.length == 0) {
            let foundStudent = arrayOfStudents.filter((student) => {
               if (
                  "0" + student.collageNumber == collageNumber &&
                  student.level == level &&
                  student.studyType == type
               ) {
                  return student;
               }
            });
            if (foundStudent.length > 0) {
               return foundStudent;
            }
         } else {
            return [];
         }
      },

      // findStudentLevelRegister(collageNumber, arrayOfStudent, level, type) {},

      findStudentLevelRegister(collageNumber, arrayOfStudent, level, type) {
         let self = this;
         let studentAverage = 0;
         let totalLessonAverage = 0;

         arrayOfStudent.filter((student) => {
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
      checkTraining(chosenCollageNumber, studyType) {
         let self = this;

         let summer = self.summerTrainingStudents.filter((student) => {
            return (
               student.collageNumber == chosenCollageNumber ||
               student.collageNumber == `0${chosenCollageNumber}`
            );
         });

         if (summer.length > 0) {
            if (self.chosenStudyType != 0) {
               let study = self.summerTrainingStudents.filter((student) => {
                  return student.studyType == studyType;
               });
               return {
                  total: study.length > 0 ? study.length : 0,
                  summerStudent: "غير مستوف",
               };
            } else {
               return {
                  total: self.summerTrainingStudents.length,
                  summerStudent: "غير مستوف",
               };
            }
         } else {
            if (self.chosenStudyType != 0) {
               let study = self.summerTrainingStudents.filter((student) => {
                  return student.studyType == studyType;
               });
               return {
                  total: study.length > 0 ? study.length : 0,
                  summerStudent: "مستوف",
               };
            } else {
               return {
                  total: self.summerTrainingStudents.length,
                  summerStudent: "مستوف",
               };
            }
         }
      },

      checkForStudentCollageNumber(collageNumber, summerTraining) {
         let found = summerTraining.find(
            (student) => student.collageNumber == collageNumber
         );

         if (found != undefined) {
            return true;
         } else {
            return false;
         }
      },
      getAllAverage(students, chosenCollageNumber, studyType) {
         let self = this;
         let filteredTypeStudent = [];

         let allStudents = students.filter((student) => {
            if (
               self.checkForStudentCollageNumber(
                  student.collegeId,
                  self.summerTrainingStudents
               )
            ) {
            } else {
               return student;
            }
         });

         let x = allStudents.map((st) => {
            return st.name;
         });

         // sequenceType = 1 is for student studyType and 2 for all student sequence

         if (self.chosenStudyType != 0) {
            self.sequenceType = 1;
            filteredTypeStudent = allStudents.filter((student) => {
               return student.type == studyType;
            });
         } else {
            filteredTypeStudent = allStudents;
            self.sequenceType = 2;
         }

         if (filteredTypeStudent.length > 0) {
            let allStudentsAverage = filteredTypeStudent.map((student) => {
               return {
                  collageNumber: student.collegeId,
                  average: self.findTotalDegree(
                     self.findStudentLevelRegister(
                        student.collegeId,
                        self.firstYearMarks,
                        1,
                        student.type
                     ),
                     self.findStudentLevelRegister(
                        student.collegeId,
                        self.secondYearMarks,
                        2,
                        student.type
                     ),
                     self.findStudentLevelRegister(
                        student.collegeId,
                        self.thirdYearMarks,
                        3,
                        student.type
                     ),
                     self.findAverageForFourthLevel(
                        student.collegeId,
                        self.fourthStudentsDegrees
                     )
                  ),
               };
            });

            let filteredStudents = allStudentsAverage.filter((student) => {
               return student.average >= 50;
            });

            let sortedAverage = filteredStudents.sort(
               (a, b) => b.average - a.average
            );

            let chosen = sortedAverage.findIndex((student) => {
               return (
                  student.collageNumber == chosenCollageNumber ||
                  student.collageNumber == `0${chosenCollageNumber}`
               );
            });

            self.studentLength = sortedAverage.length;

            if (chosen) {
               return chosen;
            } else {
               return 0;
            }
         } else {
            self.studentLength = sortedAverage.length;
         }
      },

      getFirstAverageStudent(students, studyType) {
         let self = this;
         let filteredTypeStudent = [];

         let allStudents = students.filter((student) => {
            if (
               self.checkForStudentCollageNumber(
                  student.collegeId,
                  self.summerTrainingStudents
               )
            ) {
            } else {
               return student;
            }
         });

         let x = allStudents.map((st) => {
            return st.name;
         });

         // sequenceType = 1 is for student studyType and 2 for all student sequence

         if (self.chosenStudyType != 0) {
            self.sequenceType = 1;
            filteredTypeStudent = allStudents.filter((student) => {
               return student.type == studyType;
            });
         } else {
            filteredTypeStudent = allStudents;
            self.sequenceType = 2;
         }

         if (filteredTypeStudent.length > 0) {
            let allStudentsAverage = filteredTypeStudent.map((student) => {
               return {
                  collageNumber: student.collegeId,
                  average: self.findTotalDegree(
                     self.findStudentLevelRegister(
                        student.collegeId,
                        self.firstYearMarks,
                        1,
                        student.type
                     ),
                     self.findStudentLevelRegister(
                        student.collegeId,
                        self.secondYearMarks,
                        2,
                        student.type
                     ),
                     self.findStudentLevelRegister(
                        student.collegeId,
                        self.thirdYearMarks,
                        3,
                        student.type
                     ),
                     self.findAverageForFourthLevel(
                        student.collegeId,
                        self.fourthStudentsDegrees
                     )
                  ),
               };
            });

            let filteredStudents = allStudentsAverage.filter((student) => {
               return student.average >= 50;
            });

            let sortedAverage = filteredStudents.sort(
               (a, b) => b.average - a.average
            );

            if (sortedAverage) {
               return sortedAverage[0];
            } else {
               return 0;
            }
         } else {
            return 0;
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

      getLastYearMarksTwo(lesson, levelType, lessonDetails) {
         let self = this;

         let firstExam = lesson.find((degree) => degree.markType == "custom");

         let secondExam = lesson.find((degree) => degree.markType == "custom2");

         if (firstExam != undefined) {
            let total = firstExam.degree;

            return {
               degree: total,
               lessonName: lessonDetails.name,
               credit: lessonDetails.credit,
            };
         } else if (secondExam != undefined) {
            let total = secondExam.degree;
            return {
               degree: total,
               lessonName: lessonDetails.name,
               credit: lessonDetails.credit,
            };
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
                  return accumulator + currentValue.degree;
               },
               0);

               return {
                  degree: allAverage,
                  lessonName: lessonDetails.name,
                  credit: lessonDetails.credit,
               };
            } else {
               let allAverage = lesson.reduce(function(
                  accumulator,
                  currentValue
               ) {
                  return accumulator + currentValue.degree;
               },
               0);

               return {
                  degree: allAverage,
                  lessonName: lessonDetails.name,
                  credit: lessonDetails.credit,
               };
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
                  return accumulator + currentValue.degree;
               },
               0);

               return {
                  degree: allAverage,
                  lessonName: lessonDetails.name,
                  credit: lessonDetails.credit,
               };
            } else {
               let average = lesson.filter((mark) => {
                  return mark.markType != "th2" && mark.markType != "pr2";
               });

               let allAverage = average.reduce(function(
                  accumulator,
                  currentValue
               ) {
                  return accumulator + currentValue.degree;
               },
               0);

               return {
                  degree: allAverage,
                  lessonName: lessonDetails.name,
                  credit: lessonDetails.credit,
               };
            }
         }
      },

      checkForSecondTerm(student, fourthMarks) {
         let selectedStudent = fourthMarks.filter((mark) => {
            return (
               mark.college_number == student.collegeId ||
               mark.college_number == "0" + student.collegeId
            );
         });

         if (selectedStudent.length > 0) {
            let secondExam = selectedStudent.find(
               (degree) =>
                  degree.markType == "custom2" || degree.markType == "final2"
            );

            if (secondExam != undefined) {
               return 2;
            } else {
               return 1;
            }
         }
      },

      getLastYearLessonsMarks(collageNumber, arrayOfStudents) {
         let self = this;

         let foundStudent = arrayOfStudents.filter((student) => {
            if (
               student.college_number == collageNumber ||
               "0" + student.college_number == collageNumber
            ) {
               return student;
            }
         });

         if (foundStudent.length > 0) {
            let degreeForStudent = [];

            let studentLesson = self.fourthLessons.map((lesson) => {
               let newDegree = foundStudent.filter((student) => {
                  return student.lessonId == lesson.id;
               });

               if (newDegree.length > 0) {
                  let average = self.getLastYearMarksTwo(
                     newDegree,
                     self.$store.state.levelType,
                     lesson
                  );

                  degreeForStudent.push(average);
               }
            });

            return degreeForStudent;
         } else {
            return [];
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
               return ((average * 100) / 100 / self.totalUnitsFourth).toFixed(
                  3
               );
            } else {
               return self.findStudentLevel(
                  collageNumber,
                  self.backupMarks,
                  4,
                  "صباحي"
               );
            }
         } else {
            return 0;
         }
      },
      findTotalDegree(first, second, third, fourth) {
         return (
            first * 0.1 +
            second * 0.2 +
            third * 0.3 +
            fourth * 0.4
         ).toFixed(3);
      },
   },
   filters: {
      phaseRole: function(value) {
         if (value == 1) {
            return "الدور الاول";
         } else if (value == 2) {
            return "الدور الثاني";
         }
      },
      convertDate: function(date) {
         let Chosendate = new Date(date);
         return Chosendate.toLocaleDateString("en-US");
      },
   },
};
</script>

<style lang="scss" scoped>
@media print {
   * {
      -webkit-print-color-adjust: exact !important;
   }
   #divDocument {
      // background: url("../assets/1.png") !important;
      background-size: 100% 100% !important;
      background-position-x: center;
      background-position-y: center;
      background-repeat: no-repeat !important;
      height: 99vh;
      -webkit-print-color-adjust: exact !important;
   }
   .shadow-text {
      box-shadow: 1px 1px 1px 1px #b3b3b3 !important;
   }
   .v-main {
      padding: 20px !important;
   }
   .document-doc {
      padding: 10px !important;
   }
   .document-doc h3 {
      font-size: 12px;
   }
   .document-doc td,
   .document-doc h5 {
      font-size: 10px;
   }
   .document-doc th {
      font-size: 12px;
   }
   .input-bold {
      width: auto;
   }
   .not-printable {
      display: none !important;
   }
   #content-div {
      padding-top: 160px !important;
   }
}
</style>
