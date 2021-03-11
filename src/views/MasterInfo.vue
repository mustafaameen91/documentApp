<template>
   <div :key="keyComponent">
      <div>
         <div class="title-section">
            <h2>معلومات الماستر</h2>
         </div>

         <div class="info-section">
            <v-row no-gutters>
               <v-col cols="3">
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     نوع الدراسة :
                  </p>

                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     {{ masterDetails.studyType }}
                  </p>
               </v-col>
               <v-col cols="3">
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     نظام الدراسة :
                  </p>
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     {{ masterDetails.typeName }}
                  </p>
               </v-col>
               <v-col cols="3">
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     السنة :
                  </p>
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     {{ masterDetails.year }}
                  </p>
               </v-col>
               <v-col cols="3">
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     المرحلة :
                  </p>
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     {{ masterDetails.level | levelName }}
                  </p>
               </v-col>
            </v-row>
         </div>
         <div>
            <v-row>
               <v-col cols="6" style="padding:10px;text-align:center">
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                  >
                     الشعب التي تم رفعها :
                  </p>
                  <p
                     style="margin-bottom:0px;display: inline-block;padding:5px"
                     v-for="name in masterDetails.classes"
                     :key="name.idMasterClass"
                  >
                     <span
                        style="padding:10px"
                        v-if="masterDetails.classes.length > 0"
                        >{{ name.className }}</span
                     >
                  </p>
               </v-col>
               <v-col cols="6" style="text-align:center">
                  <div
                     style="display:inline-block"
                     class="mx-2"
                     v-if="!hasALessons"
                  >
                     <v-btn
                        color="primary"
                        class="text-none"
                        depressed
                        :loading="isSelecting"
                        @click="onButtonClick(masterDetails)"
                     >
                        رفع مواد الشيت
                     </v-btn>
                     <input
                        ref="uploader"
                        class="d-none"
                        type="file"
                        @change="onFileChanged"
                     />
                  </div>
                  <div style="display:inline-block" class="mx-2" v-else>
                     المواد مرفوعه مسبقا
                  </div>
               </v-col>
            </v-row>
         </div>
         <div>
            <v-row>
               <v-col cols="2" style="padding:10px;text-align:center">
                  <v-select
                     v-model="masterClassName"
                     :items="className"
                     label="الشعبة"
                     @change="checkForClass"
                     dense
                     outlined
                  ></v-select>
               </v-col>
               <v-col cols="2" style="padding:10px;text-align:center">
                  <v-file-input
                     label="ادخال درجات الطلبة"
                     outlined
                     dense
                     color="success"
                     @change="checkForFail"
                     @click:clear="clear"
                  ></v-file-input>
               </v-col>
               <v-col cols="8" style="padding:15px;text-align:right">
                  <v-btn
                     color="success"
                     @click="saveMarks"
                     :loading="storeLoading"
                  >
                     حفظ
                  </v-btn>
               </v-col>
            </v-row>
         </div>
         <div>
            <v-row>
               <v-col v-if="$store.state.masterDetails.masterTypeId != 2">
                  <v-card>
                     <v-card-title>
                        اختر المواد للكورس الاول
                        <v-spacer></v-spacer>
                        <v-text-field
                           v-model="search"
                           append-icon="fa-search"
                           label="بحث"
                           single-line
                           hide-details
                        ></v-text-field>
                     </v-card-title>
                     <v-data-table
                        v-model="selected"
                        :headers="headers"
                        indeterminate="true"
                        :search="search"
                        :items="allLessons"
                        item-key="idLesson"
                        show-select
                        class="elevation-1"
                     >
                     </v-data-table>
                  </v-card>
                  <div style="text-align:center;margin-top:20px">
                     <v-btn color="accent" @click="addSummer">
                        حفظ
                     </v-btn>
                  </div>
               </v-col>
            </v-row>
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

         <v-dialog
            v-model="addSingleStudent"
            scrollable
            max-width="500px"
            persistent
         >
            <v-card>
               <v-card-title style="text-algin:center"
                  >اضافة طالب يدويا</v-card-title
               >
               <v-divider></v-divider>
               <v-card-text style="height: 300px;">
                  <h4></h4>
                  <v-divider></v-divider>
                  <div v-for="(lesson, index) in allLessons" :key="index">
                     <span>{{ lesson.lessonName }}</span>
                     <v-text-field
                        label="الدرجة"
                        outlined
                        @change="setValue"
                        dense
                     ></v-text-field>
                     <v-text-field
                        label="الدرجة كتابة"
                        outlined
                        @change="setValueWriting"
                        dense
                     ></v-text-field>
                  </div>
               </v-card-text>
               <v-divider></v-divider>
               <v-card-actions>
                  <v-btn
                     color="blue darken-1"
                     text
                     @click="addNewSingleStudent()"
                  >
                     موافق
                  </v-btn>

                  <v-btn
                     color="blue darken-1"
                     text
                     @click="addSingleStudent = false"
                  >
                     الغاء
                  </v-btn>
               </v-card-actions>
            </v-card>
         </v-dialog>

         <v-dialog v-model="dialogTwo" scrollable max-width="500px" persistent>
            <v-card>
               <v-card-title>الكورس الاول</v-card-title>
               <v-divider></v-divider>
               <v-card-text style="height: 300px;">
                  <v-divider></v-divider>
                  <p>مجموع مواد الكورس الاول هو : {{ selected.length }}</p>

                  <ul>
                     <li
                        v-for="(lesson, index) in selected"
                        :key="index"
                        style="list-style: none"
                     >
                        <v-row no-gutters>
                           <v-col cols="1"> {{ index + 1 }} -</v-col>
                           <v-col cols="6"> {{ lesson.lessonName }} </v-col>
                           <v-col cols="4" style="font-weight:bold;color:blue">
                              {{ lesson.units }}
                           </v-col>
                        </v-row>
                     </li>
                  </ul>
               </v-card-text>
               <v-divider></v-divider>
               <v-card-actions>
                  <v-btn color="blue darken-1" text @click="saveTheResult">
                     موافق
                  </v-btn>

                  <v-btn color="blue darken-1" text @click="dialogTwo = false">
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
                     مما يتطلب تعديل درجاتهم واعادة احتساب معدلاتهم التراكمية
                     قبل اعتماد الشيت .
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
                  <v-btn
                     color="blue darken-1"
                     text
                     @click="handleUpload(sheet)"
                  >
                     موافق
                  </v-btn>

                  <v-btn color="blue darken-1" text @click="dialog = false">
                     الغاء
                  </v-btn>
               </v-card-actions>
            </v-card>
         </v-dialog>
      </div>
   </div>
</template>

<script>
const Excel = require("exceljs");
export default {
   data: () => ({
      masterDetails: {},
      selectedFile: null,
      isSelecting: false,
      masterClassName: "",
      dialogTwo: false,
      className: [
         "A",
         "B",
         "C",
         "D",
         "F",
         "G",
         "E",
         "L",
         "H",
         "I",
         "M",
         "J",
         "K",
         "O",
         "P",
         "Q",
         "R",
      ],
      addSingleStudent: false,
      apiUrl: "",
      search: "",
      storeLoading: false,
      hasALessons: false,
      failStudents: [],
      headers: [
         {
            text: "المادة",
            align: "start",
            sortable: false,
            value: "lessonName",
         },
         { text: "الاسم بالانكليزي", value: "enName" },
         { text: "الوحدات", value: "units" },
      ],
      snackbar: false,
      materials: [],
      selected: [],
      keyComponent: 0,
      allLessons: [],
      message: "",
      multiLine: true,
      dialog2: false,
      dialog: false,
      snackbarSuccess: false,
   }),

   created() {
      this.hasALessons = this.$store.state.masterDetails.lessons;
      this.getMasterDetails();
   },

   methods: {
      getMasterDetails() {
         let self = this;
         this.masterDetails = this.$store.state.masterDetails;

         this.apiUrl = this.$store.state.apiUrl;
         this.$http
            .get(`${this.apiUrl}/lessons/${this.masterDetails.idMaster}`)
            .then((res) => {
               console.log(res.data);
               this.allLessons = res.data;
            })
            .catch((e) => {
               console.log(e);
            });

         this.$http
            .get(`${this.apiUrl}/courseMaster/${this.masterDetails.idMaster}`)
            .then((res) => {
               console.log(res.data);
               self.selected = res.data;
            })
            .catch((e) => {
               if (e.response.status == 404) {
                  self.selected = [];
               }
            });
      },

      clear() {
         console.log("clear");
      },

      onButtonClick(master) {
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

               this.$refs.uploader.click();
            })
            .catch((e) => {
               self.message = "حدث خطأ في جلب البيانات";
               self.snackbar = true;
               self.storeLoading = false;
            });
      },
      addSummer() {
         let self = this;
         self.dialogTwo = true;
      },
      onFileChanged(e) {
         this.selectedFile = e.target.files[0];
         this.getMaterial(this.selectedFile);
      },

      addNewSingleStudent() {
         let self = this;

         let doc = document.querySelectorAll(`.${self.allLessons[0].enName}`);

         console.log(doc);
      },

      checkForSelectedLesson(arrayOfSelectedLessons, lesson) {
         let x = arrayOfSelectedLessons.includes(lesson);
         return x;
      },

      saveTheResult() {
         let self = this;
         let courseTwoLessons = self.allLessons.filter((lesson) => {
            if (!self.checkForSelectedLesson(self.selected, lesson)) {
               return lesson;
            }
         });

         let courseTwo = {
            lessons: courseTwoLessons,
            masterId: this.$store.state.masterDetails.idMaster,
            course: 2,
         };

         let courseOne = {
            lessons: self.selected,
            masterId: this.$store.state.masterDetails.idMaster,
            course: 1,
         };

         self.$http
            .post(`${self.$store.state.apiUrl}/addMultiCourseSplit`, courseOne)
            .then((res) => {
               self.$http
                  .post(
                     `${self.$store.state.apiUrl}/addMultiCourseSplit`,
                     courseTwo
                  )
                  .then((res) => {
                     console.log(res);
                     self.dialogTwo = false;
                  })
                  .catch((e) => {});
            })
            .catch((e) => {
               console.log(e);
            });
      },

      checkForClass() {
         let self = this;
         console.log(this.masterClassName);
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

      setValue(e) {
         console.log(e);
      },

      setValueWriting(e) {
         console.log(e);
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
                     console.log(subjectIndex);
                     worksheet.eachRow((row, rowIndex) => {
                        let dataS = subjectIndex.map((sub) => {
                           if (
                              (!isNaN(row.values[sub.index]) ||
                                 row.values[sub.index] == "مؤجل") &&
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
                                    (row.values[sub.index] < 50 ||
                                       row.values[sub.index] == "مؤجل") &&
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
                                    (row.values[sub.index] < 50 ||
                                       row.values[sub.index] == "مؤجل") &&
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
                     console.log(studentDegree);
                     let filteredMarks = studentDegree.filter((stu) => {
                        if (stu.includes(undefined)) {
                           // console.log(stu);
                        } else {
                           console.log(stu);
                           stu.forEach((mark) => {
                              finalMarks.push(mark);
                           });
                        }
                     });
                     self.allStudentMarks = finalMarks;
                     console.log(finalMarks);
                     self.dialog = false;
                  })
                  .catch((e) => {
                     console.log(e);
                  });
            };
         }
      },
      saveMarks() {
         let self = this;
         console.log(self.allLessons);
         self.storeLoading = false;

         if (self.allStudentMarks.length > 0) {
            self.$http
               .get(
                  `${self.apiUrl}/className?className=${self.masterClassName}&masterId=${self.masterDetails.idMaster}`
               )
               .then((res) => {
                  if (res.data.length == 0) {
                     self.$http
                        .post(`${self.apiUrl}/addMasterClass`, {
                           masterId: self.masterDetails.idMaster,
                           className: self.masterClassName,
                        })
                        .then((res) => {
                           let allDegrees = self.allStudentMarks.map((mark) => {
                              return {
                                 collageNumber: mark.studentId,
                                 mark: mark.degree,
                                 numberWriting: mark.numberWriting,
                                 lessonId:
                                    self.checkForLessonId(
                                       self.allLessons,
                                       mark.subject
                                    ) != -1
                                       ? self.checkForLessonId(
                                            self.allLessons,
                                            mark.subject
                                         )
                                       : undefined,
                                 phase: mark.phase,
                                 rule: mark.rule,
                                 studentName: mark.studentName,
                              };
                           });

                           let chunk = [];

                           while (allDegrees.length > 0) {
                              let markChunk = allDegrees.splice(0, 30);
                              chunk.push(markChunk);
                           }
                           console.log(chunk);

                           if (allDegrees.length == 0) {
                              // self.$http.post(`${self.apiUrl}/addMultiDegrees`);
                              Promise.all(
                                 chunk.map((pice) =>
                                    self.$http.post(
                                       `${self.apiUrl}/addMultiDegrees`,
                                       pice
                                    )
                                 )
                              )
                                 .then((result) => {
                                    console.log(result);
                                    self.storeLoading = false;
                                    self.masterLevel = 0;
                                    self.masterYear = "";
                                    self.studyType = "";
                                    self.masterTypeId = 0;
                                    self.keyComponent += 1;
                                    self.masterClassName = "";
                                    self.e1 = 1;

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
                        });
                  } else {
                     self.message = "هذا الشيت مرفوع مسبقا";
                     self.snackbar = true;
                  }
               });
         }
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
                     self.materials.push(materialData);
                  }
               });
               console.log(self.materials);
               this.addMaterial();
            });
         };
      },
      addMaterial() {
         let self = this;
         console.log(self.materials);
         self.storeLoading = true;

         if (self.materials.length > 0 && self.masterDetails.idMaster > 0) {
            let newLessons = {
               lessons: self.materials,
               masterId: self.masterDetails.idMaster,
            };

            self.$http
               .post(`${self.apiUrl}/addMultiLessons`, newLessons)
               .then((res) => {
                  console.log(res.data);
                  self.$http
                     .get(
                        `${self.apiUrl}/lessons/${self.masterDetails.idMaster}`
                     )
                     .then((res) => {
                        console.log(res.data);
                        console.log(self.masterDetails);
                        self.$store
                           .dispatch("getMasterDetailsById", self.masterDetails)
                           .then(() => {
                              self.materials = [];
                              self.message = "تم تخزين البيانات";
                              self.snackbarSuccess = true;
                              self.hasALessons = true;
                              self.keyComponent += 1;
                              self.allLessons = res.data;
                              self.storeLoading = false;
                           });
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
.info-section {
   padding: 20px;
   margin: 10px;
   border-radius: 10px;
   background: #ffffff;
   box-shadow: 5px 5px 10px #e0e0e0, -5px -5px 10px #e0e0e0;
}
</style>
