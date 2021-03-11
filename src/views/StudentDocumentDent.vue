<template>
   <div class="about">
      <div class="title-section">
         <h2>انشاء الوثائق</h2>
      </div>

      <v-snackbar
         v-model="snackbar"
         :multi-line="multiLine"
         shaped
         color="error"
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

      <v-snackbar
         v-model="snackbarSuccess"
         :multi-line="multiLine"
         shaped
         color="green"
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


      <div class="sheet-wrapper">
         <v-stepper v-model="e1" @change="stepperChange" vertical>
            <v-stepper-header>
               <v-stepper-step color="accent" :complete="e1 > 1" step="1">
                    بحث عن طالب
               </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
               <v-stepper-content step="1">
                  <v-row no-gutters>
                     <v-col cols="3">         
                        <v-autocomplete
                            v-model="chosenStudent"
                            :items="allStudents"
                            item-text="name"
                            item-value="college_number"
                            outlined
                            dense
                            label="اسم االطالب">
                        </v-autocomplete>
                     </v-col>

                      <v-col cols="3">         
                        <v-autocomplete
                            v-model="chosenStudyType"
                            :items="studyTypes"
                            item-text="name"
                            item-value="value"
                            outlined
                            dense
                            label="التسلسل حسب...">
                        </v-autocomplete>
                     </v-col>
                     
                  </v-row>
                  <v-btn
                     color="accent"
                     @click="searchForStudent"
                     :loading="storeLoading"
                  >
                     بحث
                  </v-btn>
               </v-stepper-content>
            </v-stepper-items>
         </v-stepper>
      </div>

      <v-card
         elevation="3" v-if="show" style="padding:15px; margin:45px"
         >
         <h3>الطالب : {{findStudent.name}}</h3>
         <h3>المعدل : {{findTotalDegree(findStudentLevelRegister(findStudent.college_number,firstYearMarks,1,findStudent.type),findStudentLevelRegister(findStudent.college_number,secondYearMarks,2,findStudent.type),findStudentLevelRegister(findStudent.college_number,thirdYearMarks,3,findStudent.type),findStudentLevelRegister(findStudent.college_number,fourthYearMarks,4,findStudent.type),findAverageForFourthLevel(findStudent.college_number,fifthStudentsDegrees))}}</h3> 
         <h3>التقدير :  {{findAverageWriting(findTotalDegree(findStudentLevelRegister(findStudent.college_number,firstYearMarks,1,findStudent.type),findStudentLevelRegister(findStudent.college_number,secondYearMarks,2,findStudent.type),findStudentLevelRegister(findStudent.college_number,thirdYearMarks,3,findStudent.type),findStudentLevelRegister(findStudent.college_number,fourthYearMarks,4,findStudent.type),findAverageForFourthLevel(findStudent.college_number,fifthStudentsDegrees)))}}</h3> 
         <h3>الجنس : {{findStudent.sex}}</h3>
         <h3>الدراسة : {{findStudent.type}}</h3>
         <h3>الدور : {{checkForSecondTerm(findStudent , fifthStudentsDegrees) | phaseRole}}</h3>
         <h3> التسلسل :  {{getAllAverage(allStudents , findStudent.college_number , findStudent.type) + 1}} من اصل   {{studentLength}}</h3>
         <v-card-actions>
            <v-btn
            color="red lighten-2"
            text
            style="margin-top:20px"
            @click="saveForRegister"
            >
            ارسال للتسجيل
            </v-btn>
         </v-card-actions>
      </v-card>
   </div>
</template>

<script>
export default {
   data: () => ({
       chosenStudent : '',
       show:false,
       storeLoading: false,
       chosenStudyType : 0,
       studyTypes : [{name : "الكل" , value : 0}, {name : "حسب دراسة الطالب" , value : 1} ],
       snackbarSuccess: false,
       snackbar : false,
       multiLine: true,
       totalUnitsFourth : 0,
       message : '',
       phase : 1,
       firstYearMarks : [],
       studentLength : 0,
       secondYearMarks : [],
       thirdYearMarks : [],
       fourthYearMarks : [],
       allStudents : [],
       firstClass : [],
       fifthLessons : [],
       secondClass : [],
       thirdClass : [],
       fifthStudentsDegrees : [],
       findStudent : {},
       fourthClass : [],
       lessonTotal : 0,
       e1 : 1
   }),
   created() {
      this.getStudentInfo();
   },
   methods: {
       stepperChange() {
         console.log("stepper");
      },
      getStudentInfo() {
         let oldUrl = this.$store.state.oldUrl;
         this.$http
            .get(
               `${oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=5&status=1&page=1&limit=1000`
            )
            .then((res) => {
                  this.allStudents = res.data;
               
            }).catch(e =>{
               console.log(e)
            })
      },
      searchForStudent(){

         let self = this

         self.findStudent = self.allStudents.find(student => {
            if(student.college_number == self.chosenStudent){
               return student
            }
         })

         console.log(self.findStudent)

         let baseUrl = this.$store.state.apiUrl;
         let oldUrl = this.$store.state.oldUrl;
         

            let firstClass = `${baseUrl}/studentLevelDegree?sectionId=${this.$store.state.user.perv}&level=1&collageNumber=${this.chosenStudent * 1}`;
            let secondClass = `${baseUrl}/studentLevelDegree?sectionId=${this.$store.state.user.perv}&level=2&collageNumber=${this.chosenStudent * 1}`;
            let thirdClass = `${baseUrl}/studentLevelDegree?sectionId=${this.$store.state.user.perv}&level=3&collageNumber=${this.chosenStudent * 1}`;
            let fourthClass = `${baseUrl}/studentLevelDegree?sectionId=${this.$store.state.user.perv}&level=4&collageNumber=${this.chosenStudent * 1}`;


            let fifthClass = `${oldUrl}/averageMarks?sectionId=${this.$store.state.user.perv}&level=5`;
            let fourthAverage = `${oldUrl}/findAverageLessons?sectionId=${this.$store.state.user.perv}&level=5`;
            let lessonsForFifth = `${oldUrl}/sectionLessonsForDocument?sectionId=${this.$store.state.user.perv}&level=5`;

            let firstYear = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=1`;
            let secondYear = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=2`;
            let thirdYear = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=3`;
            let fourthYear = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=4`;

      function requestFirstClass() {
         return self.$http.get(firstClass);
      }

      function requestSecondClass() {
         return self.$http.get(secondClass);
      }

      function requestThirdClass() {
         return self.$http.get(thirdClass);
      }

      function requestFifthLessons() {
         return self.$http.get(lessonsForFifth);
      }

      function requestFourthClass() {
         return self.$http.get(fourthClass);
      }
      function requestFifthClass() {
         return self.$http.get(fifthClass);
      }
      function requestFourthAverage() {
         return self.$http.get(fourthAverage);
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

      function requestFourthYear() {
         return self.$http.get(fourthYear);
      }

      Promise.allSettled([
         
         requestFirstClass(),
         requestSecondClass(),
         requestThirdClass(),
         requestFourthClass(),
         requestFourthAverage(),
         requestFifthClass(),
         requestFifthLessons(),

         requestFirstYear(),
         requestSecondYear(),
         requestThirdYear(),
         requestFourthYear()
         
      ]).then((responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responseThree = responses[2];
            const responseFourth = responses[3];
            const responseFourthAverage = responses[4];
            const responseFifth = responses[5]
            const responseSix = responses[6]

            const firstYear = responses[7]
            const secondYear = responses[8]
            const thirdYear = responses[9]
            const fourthYear = responses[10]

            self.firstClass = responseOne.status == "fulfilled" ? responseOne.value.data : [];
            self.secondClass = responseTwo.status == "fulfilled" ? responseTwo.value.data : [];
            self.thirdClass = responseThree.status == "fulfilled" ? responseThree.value.data : [];
            self.fourthClass = responseFourth.status == "fulfilled" ? responseFourth.value.data : [];
            self.fifthStudentsDegrees = responseFifth.status == "fulfilled" ? responseFifth.value.data : [];
            self.totalUnitsFourth = responseFourthAverage.status == "fulfilled" ? responseFourthAverage.value.data[0].total : 0;
            self.fifthLessons = responseSix.status == "fulfilled"? responseSix.value.data: [];

            self.firstYearMarks = firstYear.status == "fulfilled"? firstYear.value.data: [];
            self.secondYearMarks = secondYear.status == "fulfilled"? secondYear.value.data: [];
            self.thirdYearMarks = thirdYear.status == "fulfilled"? thirdYear.value.data: [];
            self.fourthYearMarks = fourthYear.status == "fulfilled"? fourthYear.value.data: [];
            
            self.show = true
      }).catch(e =>{
         console.log(e)
      })
      },
      checkForSecondTerm(student , fifthMarks){
         let selectedStudent = fifthMarks.filter(mark => {
            return (mark.college_number == student.college_number || mark.college_number == "0"+student.college_number)
         })

         if(selectedStudent.length > 0){
            

            let secondExam = selectedStudent.find((degree) => degree.markType == "custom2" || degree.markType == "final2");

            if (secondExam != undefined) {
               return  2  
            }else{
               return 1
            }
         }

      },
      saveForRegister(){
         let self = this
         let averageDegree = self.findTotalDegree(self.findStudentLevelRegister(self.findStudent.college_number,self.firstYearMarks,1,self.findStudent.type),self.findStudentLevelRegister(self.findStudent.college_number,self.secondYearMarks,2,self.findStudent.type),self.findStudentLevelRegister(self.findStudent.college_number,self.thirdYearMarks,3,self.findStudent.type),self.findStudentLevelRegister(self.findStudent.college_number,self.fourthYearMarks,4,self.findStudent.type),(self.findAverageForFourthLevel(self.findStudent.college_number,self.fifthStudentsDegrees)))
         let data = {
            studentName: self.findStudent.name,
            phase: self.checkForSecondTerm(self.findStudent , self.fifthStudentsDegrees),
            studyType: self.findStudent.type,
            average: averageDegree,
            averageWrite: self.findAverageWriting(averageDegree),
            sectionId: self.$store.state.user.perv,
            gender: self.findStudent.sex,
            sequence : self.getAllAverage(self.allStudents , self.findStudent.college_number , self.findStudent.type) + 1,
            totalStudent : self.studentLength,
            sequenceType : self.sequenceType
         }

          self.$http.post(`${self.$store.state.apiUrl}/addRegisterDocument`,data).then(res =>{
             console.log(res)
             self.message = "تم ارسال البيانات للتسجيل"
             self.snackbarSuccess = true;
             self.show = false
          }).catch(e =>{
             console.log(e)
             self.message = "حدث خطا اثناء الارسال الرجاء التاكد من الاتصال"
             self.snackbar = true
             self.show = false
          })

      },
      getAllAverage(students , chosenCollageNumber, studyType){
         let self = this;
         let filteredTypeStudent = [];
         // sequenceType = 1 is for studyType and 2 for all student sequence
         if(self.chosenStudyType != 0){
            self.sequenceType = 1
            filteredTypeStudent = students.filter(student =>{
               return student.type == studyType
            })
         }else{
            filteredTypeStudent = students;
            self.sequenceType = 2
         }

         if(filteredTypeStudent.length > 0){

            let allStudentsAverage = filteredTypeStudent.map(student => {
               return {
                  collageNumber : student.college_number ,
                  average : self.findTotalDegree(self.findStudentLevelRegister(student.college_number,self.firstYearMarks,1,student.type),self.findStudentLevelRegister(student.college_number,self.secondYearMarks,2,student.type),self.findStudentLevelRegister(student.college_number,self.thirdYearMarks,3,student.type),self.findStudentLevelRegister(student.college_number,self.fourthYearMarks,4,student.type),(self.findAverageForFourthLevel(student.college_number,self.fifthStudentsDegrees)))
                  }
            })

            

            let filteredStudents = allStudentsAverage.filter(student => {
               return student.average >= 50
            })
            let sortedAverage = filteredStudents.sort((a, b) => b.average - a.average);
            console.log(sortedAverage)
            let chosen = sortedAverage.findIndex(student => {
               return student.collageNumber == chosenCollageNumber || student.collageNumber == `0${chosenCollageNumber}`
            })

            self.studentLength = filteredStudents.length
            

            if(chosen){
               return chosen;
            }else{
               return 0
            }

         }else{
            console.log("not found students")
         }
         
      },
      findStudentLevelRegister(collageNumber, arrayOfStudent, level, type) {
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
      findAverageWriting(average){
         if(average > 49 && average <= 59){
            return "مقبول"
         } else if(average > 59 && average <= 69){
            return "متوسط"
         }else if(average > 69 && average <= 79){
            return "جيد"
         }else if(average > 59 && average <= 89){
            return "جيد جدا"
         }else if(average > 59 && average <= 100){
            return "امتياز"
         }else{
            return "راسب"
         }
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

            let studentLesson = self.fifthLessons.map((lesson) => {
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
                  return (
                     accumulator + currentValue
                  );
               },
               0);
               return ((average * 100) / 100 / self.totalUnitsFourth).toFixed(
                  3
               );
            }
         } else {
            return 0;
         }
      },
      findTotalDegree(first, second, third, fourth,fifth) {
         return (
            first * 0.05 +
            second * 0.1 +
            third * 0.15 +
            fourth * 0.3 +
            fifth * 0.4
         ).toFixed(3);
      },
   },
   filters: {
         phaseRole: function (value) {
            if(value == 1){
               return "الدور الاول"
            }else if(value == 2){
               return "الدور الثاني"
            }
         }
      }
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
.masters-section {
   padding: 10px;
   border-radius: 10px;
   margin: 10px 50px;
   background: #ffffff;
   box-shadow: inset 5px 5px 5px #e6e6e6, inset -5px -5px 5px #e6e6e6;
}
.master-card {
   padding: 10px;
   box-shadow: 5px 5px 10px #e6e6e6, -5px -5px 10px #e6e6e6 !important;
   border-radius: 10px !important;
}
.master-card p {
   margin: 0;
}
.sheet-wrapper {
   padding: 10px;
   border-radius: 20px;
   margin: 0px 50px;
   background: #ffffff;
   box-shadow: inset 10px 10px 10px #b8b8b8, inset -10px -10px 10px #b8b8b8;
}
</style>
