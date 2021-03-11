<template>
   <div :key="keyComponent">
      <v-dialog v-model="dialog2" persistent max-width="400">
         <v-card>
            <v-card-title
               class="headline"
               style="text-align:center;padding:0;margin-bottom:10px;background:#f57c7c"
            >
               <p style="text-align:center;margin: 10px auto;color:#fff">
                  تنبيه
               </p>
            </v-card-title>

            <v-card-text>
               <p style="text-align:center">
                  عند الموافقة على اعتماد الشيت فأنه لايمكن حذفه او التعديل عليه
                  ، هل انت متاكد من الموافقة ؟
               </p>
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="green darken-1" text @click="dialog2 = false">
                  موافق
               </v-btn>
               <v-btn color="red darken-1" text @click="dialog2 = false">
                  الغاء
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog v-model="dialog" scrollable max-width="500px" persistent>
         <v-card>
            <v-card-title>الطلبة الراسبين</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px;">
               <h4>
                  ملاحظة : يوجد عدد من الطلبة الراسبين في الشيت المعتمد يرجى
                  التأكد من حالة نجاح بعضهم بسبب نظام العبور في السنة اللاحقة
                  مما يتطلب تعديل درجاتهم واعادة احتساب معدلاتهم التراكمية قبل
                  اعتماد الشيت .
               </h4>
               <v-divider></v-divider>
               <p>مجموع الطلبة الراسبين : {{ failStudents.length }} طالب</p>

               <ul>
                  <li
                     v-for="(fail, index) in failStudents"
                     :key="index"
                     style="list-style: none"
                  >
                     <v-row no-gutters>
                        <v-col cols="1"> {{ index + 1 }} -</v-col>
                        <v-col cols="6"> {{ fail.studentName }} </v-col>
                        <v-col cols="4" style="font-weight:bold;color:red">
                           {{ fail.fail }}
                        </v-col>
                     </v-row>
                  </li>
               </ul>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
               <v-btn color="blue darken-1" text @click="handleUpload(sheet)">
                  موافق
               </v-btn>

               <v-btn color="blue darken-1" text @click="dialog = false">
                  الغاء
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

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

      <div class="title-section">
         <h2>الشيتات ودرجات الطلبة</h2>
      </div>
      
      <div class="sheet-wrapper">
         <v-stepper v-model="e1" @change="stepperChange" vertical>
            <v-stepper-header>
               <v-stepper-step color="accent" :complete="e1 > 1" step="1">
                  ادخال معلومات الشيت
               </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
               <v-stepper-content step="1">
                  <v-row no-gutters>
                     <v-col cols="3"
                        ><v-select
                           v-model="masterLevel"
                           :items="level"
                           item-text="name"
                           item-value="levelId"
                           label="المرحلة"
                           outlined
                           dense
                        ></v-select>
                     </v-col>
                     <v-col cols="3">
                        <v-select
                           v-model="masterYear"
                           :items="year"
                           label="السنة"
                           dense
                           outlined
                        ></v-select>
                     </v-col>
                     <v-col cols="2"
                        ><v-select
                           v-model="masterTypeId"
                           :items="course"
                           item-text="typeName"
                           item-value="idType"
                           label="نظام الدراسة"
                           dense
                           outlined
                        ></v-select>
                     </v-col>
                     <v-col cols="2"
                        ><v-select
                           v-model="studyType"
                           :items="items"
                           dense
                           label="نوع الدراسة"
                           outlined
                        ></v-select
                     ></v-col>

                     <v-col cols="2">
                        <v-text-field
                           :value="this.$store.state.user.sectionName"
                           label="القسم"
                           dense
                           outlined
                           readonly
                        ></v-text-field
                     ></v-col>
                  </v-row>
                  <v-btn
                     color="accent"
                     @click="addMaster"
                     :loading="storeLoading"
                  >
                     حفظ
                  </v-btn>
               </v-stepper-content>
            </v-stepper-items>
         </v-stepper>
      </div>
      <div class="title-section">
         <h2>الشيتات</h2>
      </div>
      <div v-for="(master, index) in allMasters" :key="index">
         <div class="masters-section">
            <div class="master-card">
               <v-row no-gutters align="center">
                  <v-col cols="2">{{ index + 1 }}</v-col>
                  <v-col cols="2">{{ master.level | levelName }}</v-col>
                  <v-col cols="2">{{ master.studyType }}</v-col>
                  <v-col cols="2">{{ master.typeName }}</v-col>
                  <v-col cols="2">{{ master.year }}</v-col>

                  <v-col cols="2" style="text-align:left">
                     <v-btn
                        class="mx-2"
                        fab
                        dark
                        small
                        depressed
                        color="error"
                        @click="deleteMaster(master)"
                     >
                        <v-icon dark size="20">
                           fa-trash
                        </v-icon>
                     </v-btn>
                     <v-btn
                        class="mx-2"
                        fab
                        dark
                        small
                        depressed
                        color="primary"
                        @click="goToMasterPage(master)"
                     >
                        <v-icon dark size="20">
                           fa-info
                        </v-icon>
                     </v-btn>

                     
                     
                  </v-col>
               </v-row>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
const Excel = require("exceljs");
export default {
   data: () => ({
      e1: 1,
      snackbar: false,
      multiLine: true,
      dialog2: false,
      message: "",
      dialog: false,
      apiUrl: "",
      defaultButtonText: "",
      selectedFile: null,
      isSelecting: false,
      failStudents: [],
      allMasters: [],
      masterLevel: 0,
      snackbarSuccess: false,
      storeLoading: false,
      masterYear: "",
      studyType: "",
      masterTypeId: "",
      materials: [],
      keyComponent: 1,
      storedMasterId: 0,
      sheet: "",
      allLessons: [],
      allStudentMarks: [],
      studentsDegree: [],
      items: ["صباحي", "مسائي"],
      year: [
         "2005-2006",
         "2006-2007",
         "2007-2008",
         "2008-2009",
         "2009-2010",
         "2010-2011",
         "2011-2012",
         "2012-2013",
         "2013-2014",
         "2014-2015",
         "2015-2016",
         "2016-2017",
         "2017-2018",
         "2018-2019",
         "2019-2020",
         "2020-2021",
      ],
      course: [],
      level: [
         { levelId: 1, name: "المرحلة الاولى" },
         { levelId: 2, name: "المرحلة الثانية" },
         { levelId: 3, name: "المرحلة الثالثة" },
         { levelId: 4, name: "المرحلة الرابعة" },
         { levelId: 5, name: "المرحلة الخامسة" },
      ],
      ex4: [
         "red",
         "indigo",
         "orange",
         "primary",
         "secondary",
         "success",
         "info",
         "warning",
         "error",
         "red darken-3",
         "indigo darken-3",
         "orange darken-3",
      ],
   }),
   created() {
      let self = this;
      self.apiUrl = this.$store.state.apiUrl;
      this.getInitialData();
   },
   methods: {
      getInitialData() {
         let self = this;
         self.$http.get(`${self.apiUrl}/masterTypes`).then((res) => {
            console.log(res.data);
            self.course = res.data;
         }).catch(e =>{
               console.log(e)
            })

         self.$http
            .get(`${self.apiUrl}/masters/${this.$store.state.user.perv}`)
            .then((res) => {
               console.log(res.data);
               self.allMasters = res.data;
            }).catch(e =>{
               console.log(e)
            })
      },
      checkForLessonId(lessons, lessonName) {
         let lessonId = lessons.filter((lesson) => {
            return lesson.lessonName == lessonName;
         });

         if (lessonId.length > 0) {
            return lessonId[0].idLesson;
         } else {
            return -1;
         }
      },
      deleteMaster(master){
         let self = this
         
      this.$http.delete(`${self.apiUrl}/masterAll/${master.idMaster}`).then(res =>{
         self.message = "تم حذف الشيت";
         self.snackbarSuccess = true;
         this.keyComponent += 1;
         this.getInitialData();
         console.log(res)
      }).catch(e =>{
         console.log(e)
         self.message = "حدث خطأ في حذف البيانات";
         self.snackbar = true;
      })
      },
      editCollageId(master) {
         console.log(master);
         this.$store.dispatch("loadStudentMaster", master.idMaster);

         this.$router.push("edit-collage");
      },
      goToMasterPage(master) {
         console.log(master);
         this.$store.dispatch("getMasterDetailsById", master).then(() => {
            this.$router.push("/master-info");
         });
      },
      saveMarks() {
         let self = this;
         console.log(self.allLessons);
         self.storeLoading = true;

         if (self.allStudentMarks.length > 0) {
            let allDegrees = self.allStudentMarks.map((mark) => {
               return {
                  collageNumber: mark.studentId,
                  mark: mark.degree,
                  numberWriting: mark.numberWriting,
                  lessonId:
                     self.checkForLessonId(self.allLessons, mark.subject) != -1
                        ? self.checkForLessonId(self.allLessons, mark.subject)
                        : undefined,
                  phase: mark.phase,
                  rule: mark.rule,
                  studentName: mark.studentName,
               };
            });

            let chunk = [];

            while (allDegrees.length > 0) {
               // chunk = allDegrees.splice(0, 30);
               // self.$http.post(`${self.apiUrl}/addMultiDegrees`);
               let markChunk = allDegrees.splice(0, 30);
               chunk.push(markChunk);

               // if (chunk.length < 30) {
               //    self.$http
               //       .post(`${self.apiUrl}/addMultiDegrees`, chunk)
               //       .then((res) => {
               //          console.log(res.data);
               //          self.storeLoading = false;
               //          self.masterLevel = 0;
               //          self.masterYear = "";
               //          self.studyType = "";
               //          self.masterTypeId = 0;
               //          self.keyComponent += 1;
               //          self.e1 = 1;
               //       })
               //       .catch((e) => {
               //          self.storeLoading = false;
               //          self.message = "حدث خطأ في تخزين البيانات";
               //          self.snackbar = true;
               //       });
               // } else {
               //    self.$http
               //       .post(`${self.apiUrl}/addMultiDegrees`, chunk)
               //       .then((res) => {
               //          console.log(res.data);
               //       })
               //       .catch((e) => {
               //          self.storeLoading = false;
               //          self.message = "حدث خطأ في تخزين البيانات";
               //          self.snackbar = true;
               //       });
               // }
            }

            if (allDegrees.length == 0) {
               // self.$http.post(`${self.apiUrl}/addMultiDegrees`);
               Promise.all(
                  chunk.map((pice) =>
                     self.$http.post(`${self.apiUrl}/addMultiDegrees`, pice)
                  )
               )
                  .then((result) => {
                     self.storeLoading = false;
                     self.masterLevel = 0;
                     self.masterYear = "";
                     self.studyType = "";
                     self.masterTypeId = 0;
                     self.keyComponent += 1;
                     self.e1 = 1;
                     console.log(result);
                     self.message = "تم تخزين البيانات";
                     self.snackbarSuccess = true;
                  })
                  .catch((e) => {
                     self.storeLoading = false;
                     self.message = "حدث خطأ في تخزين البيانات";
                     self.snackbar = true;
                  });
               console.log("end of array");
            }
         }
      },
      handleUpload(file) {
         let self = this;
         if (file) {
            const wb = new Excel.Workbook();
            const reader = new FileReader();

            reader.readAsArrayBuffer(file);

            reader.onload = () => {
               const buffer = reader.result;

               wb.xlsx
                  .load(buffer)
                  .then((workbook) => {
                     const worksheet = workbook.getWorksheet("Mini");

                     //get the header of master sheet
                     let headerRow = worksheet.getRow(6).values;
                     let subjectIndex = [];

                     let studentDegree = [];

                     headerRow.forEach((row, index) => {
                        if (
                           isNaN(row.result) &&
                           row.result != undefined &&
                           row.result != "التدريب الصيفي"
                        ) {
                           subjectIndex.push({
                              subjectName: row.result,
                              index: index,
                           });
                        }
                     });

                     let index = headerRow.indexOf("المعدل العام");

                     worksheet.eachRow((row, rowIndex) => {
                        let dataS = subjectIndex.map((sub) => {
                           if (
                              !isNaN(row.values[sub.index]) &&
                              (row.getCell(index).value != null ||
                                 worksheet.getRow(rowIndex + 1).getCell(index)
                                    .value != null)
                           ) {
                              return {
                                 studentName: row.getCell(2).result,
                                 studentId: !isNaN(row.getCell(2).result)
                                    ? row.getCell(2).result
                                    : worksheet.getRow(rowIndex + 1).getCell(2)
                                         .result,
                                 subject: sub.subjectName,
                                 degree:
                                    row.values[sub.index] < 50 &&
                                    sub.name != "التدريب الصيفي"
                                       ? worksheet
                                            .getRow(rowIndex + 1)
                                            .getCell(sub.index).value
                                       : row.values[sub.index],
                                 numberWriting:
                                    isNaN(row.values[sub.index + 1]) &&
                                    row.values[sub.index] > 49
                                       ? row.values[sub.index + 1]
                                       : worksheet
                                            .getRow(rowIndex + 1)
                                            .getCell(sub.index + 1).value,
                                 rule:
                                    (worksheet
                                       .getRow(rowIndex)
                                       .getCell(sub.index).fill.fgColor !=
                                       undefined &&
                                       worksheet
                                          .getRow(rowIndex)
                                          .getCell(sub.index).fill.fgColor
                                          .indexed == 13) ||
                                    (worksheet
                                       .getRow(rowIndex + 1)
                                       .getCell(sub.index).fill.fgColor !=
                                       undefined &&
                                       worksheet
                                          .getRow(rowIndex + 1)
                                          .getCell(sub.index).fill.fgColor
                                          .indexed == 13)
                                       ? 1
                                       : 0,
                                 phase:
                                    row.values[sub.index] < 50 &&
                                    worksheet
                                       .getRow(rowIndex + 1)
                                       .getCell(sub.index).value
                                       ? 2
                                       : 1,
                              };
                           }
                        });
                        studentDegree.push(dataS);
                     });
                     let finalMarks = [];

                     let filteredMarks = studentDegree.filter((stu) => {
                        if (stu.includes(undefined)) {
                           console.log();
                        } else {
                           stu.forEach((mark) => {
                              finalMarks.push(mark);
                           });
                        }
                     });
                     self.allStudentMarks = finalMarks;

                     self.dialog = false;
                     this.saveMarks();
                  })
                  .catch((e) => {
                     console.log(e);
                  });
            };
         }
      },
      getMaterial(file) {
         let self = this;
         const wb = new Excel.Workbook();
         const reader = new FileReader();

         reader.readAsArrayBuffer(file);

         reader.onload = () => {
            const buffer = reader.result;

            wb.xlsx.load(buffer).then((workbook) => {
               const worksheet = workbook.getWorksheet("MaterialsAndWeights");
               let headerRow = worksheet.getRow(7).values;

               let materialIndex = headerRow.indexOf("المادة");
               let unitIndex = headerRow.indexOf("عدد الوحدات");
               let englishIndex = headerRow.indexOf("Subject in English");
               console.log(materialIndex);
               console.log(unitIndex);
               console.log(englishIndex);

               worksheet.eachRow((row, rowIndex) => {
                  let materialData = {
                     arName: row.values[materialIndex],
                     units: row.values[unitIndex],
                     enName: row.values[englishIndex],
                  };
                  if (
                     !isNaN(materialData.units) &&
                     materialData.enName != undefined
                  ) {
                     console.log(materialData);
                     self.materials.push(materialData);
                  }
               });
            });
         };
      },
      addMaster() {
         let self = this;
         self.storeLoading = true;
         console.log(self.masterLevel);
         if (
            self.masterLevel > 0 &&
            self.masterYear &&
            self.masterTypeId &&
            self.studyType
         ) {
            let newMaster = {
               sectionId: self.$store.state.user.perv,
               level: self.masterLevel,
               year: self.masterYear,
               studyType: self.studyType,
               masterTypeId: self.masterTypeId,
            };
            console.log(newMaster);
            self.$http
               .post(`${self.apiUrl}/addMaster`, newMaster)
               .then((res) => {
                  console.log(res.data);
                  self.getInitialData();
                  self.storeLoading = false;
                  self.masterLevel = 0;
                  self.masterYear = "";
                  self.studyType = "";
                  self.masterTypeId = 0;
                  self.keyComponent += 1;
                  self.storedMasterId = res.data.id;
                  self.e1 = 1;
                  self.message = "تم تخزين البيانات";
                  self.snackbarSuccess = true;
                  self.storeLoading = false;
               })
               .catch((e) => {
                  self.message = "حدث خطأ في تخزين البيانات";
                  self.snackbar = true;
                  self.storeLoading = false;
               });
         } else {
            self.message = "الرجاء اختيار كافة الحقول ";
            self.snackbar = true;
            self.storeLoading = false;
         }
      },
      addMaterial() {
         let self = this;
         self.storeLoading = true;

         if (self.materials.length > 0 && self.storedMasterId > 0) {
            let newLessons = {
               lessons: self.materials,
               masterId: self.storedMasterId,
            };

            self.$http
               .post(`${self.apiUrl}/addMultiLessons`, newLessons)
               .then((res) => {
                  console.log(res.data);
                  self.$http
                     .get(`${self.apiUrl}/lessons/${self.storedMasterId}`)
                     .then((res) => {
                        console.log(res.data);
                        this.keyComponent += 1;
                        self.storeLoading = false;
                        self.e1 = 3;
                        self.allLessons = res.data;
                        self.materials = [];
                        self.message = "تم تخزين البيانات";
                        self.snackbarSuccess = true;
                     })
                     .catch((e) => {
                        self.storeLoading = false;
                        self.message = "حدث خطأ في تخزين البيانات";
                        self.snackbar = true;
                     });
               })
               .catch((e) => {
                  self.storeLoading = false;
                  self.message = "حدث خطأ في تخزين البيانات";
                  self.snackbar = true;
               });
         } else {
            self.message = "الرجاء اختيار الشيت";
            self.snackbar = true;
         }
      },

      clear() {
         console.log("clear");
      },
      stepperChange() {
         console.log("stepper");
      },
      checkForFail(file) {
         let self = this;

         const wb = new Excel.Workbook();
         const reader = new FileReader();

         reader.readAsArrayBuffer(file);

         reader.onload = () => {
            const buffer = reader.result;

            wb.xlsx.load(buffer).then((workbook) => {
               const worksheet = workbook.getWorksheet("Mini");

               let headerRow = worksheet.getRow(6).values;

               let index = headerRow.indexOf("النتيجة");

               let failStudent = [];

               worksheet.eachRow((row, rowIndex) => {
                  let studentData = {
                     studentName: isNaN(row.getCell(2).result)
                        ? row.getCell(2).result
                        : 0,
                     fail:
                        worksheet.getRow(rowIndex + 1).getCell(index).value ==
                        "راسب"
                           ? worksheet.getRow(rowIndex + 1).getCell(index).value
                           : "",
                  };

                  if (
                     studentData.fail != null &&
                     isNaN(studentData.fail) &&
                     studentData.studentName != 0
                  ) {
                     console.log(studentData);
                     failStudent.push(studentData);
                  }
               });

               self.failStudents = failStudent;
               self.sheet = file;

               self.dialog = true;
            });
         };
      },
      onButtonClick(index, master) {
         let self = this;
         self.$http
            .get(`${self.apiUrl}/lessons/${master.idMaster}`)
            .then((res) => {
               console.log(res.data);
               self.allLessons = res.data;
               this.isSelecting = true;
               window.addEventListener(
                  "focus",
                  () => {
                     this.isSelecting = false;
                  },
                  { once: true }
               );

               this.$refs.uploader[index].click();
            })
            .catch((e) => {
               self.message = "حدث خطأ في جلب البيانات";
               self.snackbar = true;
               self.storeLoading = false;
            });
      },
      onFileChanged(e) {
         this.selectedFile = e.target.files[0];
         this.checkForFail(this.selectedFile);
      },
   },
   filters: {
      levelName: function(level) {
         if (level == 1) {
            return "المرحلة الاولى";
         } else if (level == 2) {
            return "المرحلة الثانية";
         } else if (level == 3) {
            return "المرحلة الثالثة";
         } else if (level == 4) {
            return "المرحلة الرابعة";
         } else {
            return "المرحلة الخامسة";
         }
      },
      course: function(course) {
         if (course == 1) {
            return "الكورس الاول";
         } else if (course == 2) {
            return "الكورس الثاني";
         }
      },
   },
};
</script>

<style lang="scss" scoped>
.sheet-wrapper {
   padding: 10px;
   border-radius: 20px;
   margin: 0px 50px;
   background: #ffffff;
   box-shadow: inset 10px 10px 10px #b8b8b8, inset -10px -10px 10px #b8b8b8;
}
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
</style>
