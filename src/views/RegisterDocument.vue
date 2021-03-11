<template>
   <div class="about" :key="keyComponent" lang="ar">
      <v-dialog v-model="dialog3" max-width="500px">
         <template v-slot:default="dialog">
            <v-card>
               <v-toolbar color="primary">
                  <h3 style="color:#fff">نوع التأييد</h3>
               </v-toolbar>
               <v-card-text>
                  <div class="text-h2 pa-12">
                     Hello world!
                  </div>
               </v-card-text>
               <v-card-actions class="justify-end">
                  <v-btn text @click="dialog.value = false">اغلاق</v-btn>
               </v-card-actions>
            </v-card>
         </template>
      </v-dialog>

      <div class="title-section">
         <h2>توليد التأييدات</h2>
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
                  اختر القسم
               </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
               <v-stepper-content step="1">
                  <v-row no-gutters>
                     <v-col cols="3">
                        <v-autocomplete
                           v-model="chosenSection"
                           :items="allSections"
                           item-text="name"
                           item-value="id"
                           outlined
                           dense
                           label="القسم"
                        >
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

      <div class="title-section">
         <h2>التأييدات</h2>
      </div>

      <div style="text-align:center">
         <v-row>
            <v-col cols="3" style="margin-right: 50px;">
               <v-autocomplete
                  v-model="foundStudent"
                  :items="sections"
                  @click:clear="clearStudents"
                  item-text="studentName"
                  item-value="studentName"
                  @change="findStudent"
                  outlined
                  dense
                  label="اسم الطالب"
               >
               </v-autocomplete>
            </v-col>
         </v-row>
      </div>

      <div v-for="(section, index) in filteredStudent" :key="index">
         <div class="masters-section">
            <div class="master-card">
               <v-row no-gutters align="center">
                  <v-col cols="1">{{ index + 1 }}</v-col>
                  <v-col cols="2">{{ section.studentName }}</v-col>
                  <v-col cols="1">الدور الاول</v-col>
                  <v-col cols="2"> نوع الدراسة : {{ section.studyType }}</v-col>
                  <v-col cols="1"> المعدل : {{ section.average }}</v-col>
                  <v-col cols="1">التقدير : {{ section.averageWrite }}</v-col>
                  <v-col cols="1" style="text-align:center"
                     >الجنس : {{ section.gender }}</v-col
                  >
                  <v-col cols="2" style="text-align:center"
                     >الدراسة : {{ section.sequenceType | studyType }}</v-col
                  >

                  <v-col cols="1" style="text-align:left">
                     <!-- <v-btn
                        class="mx-2"
                        fab
                        dark
                        small
                        depressed
                        color="primary"
                        @click="goToDocument(section)"
                     > -->

                     <v-btn
                        class="mx-2"
                        fab
                        dark
                        small
                        depressed
                        color="primary"
                        @click="goToDocument(section)"
                     >
                        <v-icon dark size="20">
                           fa-file-word
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
// import path from 'path';
const path = window.require("path");
const fs = window.require("fs");
import {
   Document,
   Packer,
   VerticalPositionAlign,
   HorizontalPositionAlign,
   HorizontalPositionRelativeFrom,
   VerticalPositionRelativeFrom,
   Paragraph,
   AlignmentType,
   HeadingLevel,
   TextRun,
   Media,
} from "docx";

export default {
   data: () => ({
      chosenSection: "",
      show: false,
      storeLoading: false,
      snackbarSuccess: false,
      snackbar: false,
      multiLine: true,
      imagePath: "",
      keyComponent: 0,
      message: "",
      allSections: [],
      dialog3: false,
      sections: [],
      foundStudent: "",
      fourthClass: 0,
      filteredStudent: [],
      lessonTotal: 0,
      e1: 1,
      phaseData: {},
   }),
   created() {
      this.getStudentInfo();
   },
   methods: {
      stepperChange() {
         console.log("stepper");
      },
      setPhaseAndDate(phase) {
         if (phase == 1) {
            return {
               phaseText: "الدور الاول",
               date: this.phaseData.phaseOne,
            };
         } else {
            return {
               phaseText: "الدور الثاني",
               date: this.phaseData.phaseTwo,
            };
         }
      },
      exportToDocx(student) {
         let self = this;

         let section = self.allSections.find(
            (section) => section.id == student.sectionId
         );
         console.log(section.registerName);

         this.imagePath = path.join(__static, "1.png");

         const doc = new Document({
            creator: "mustafa mohammed ameen",
            description: "student document",
            title: "Student Document",
         });

         const image1 = Media.addImage(
            doc,
            fs.readFileSync(this.imagePath),
            800,
            1350,
            {
               floating: {
                  behindDocument: true,
                  allowOverlap: true,
                  horizontalPosition: {
                     relative: HorizontalPositionRelativeFrom.PAGE,
                     align: HorizontalPositionAlign.CENTER,
                  },
                  verticalPosition: {
                     relative: VerticalPositionRelativeFrom.PAGE,
                     align: VerticalPositionAlign.CENTER,
                  },
               },
            }
         );

         doc.addSection({
            properties: {},
            children: [new Paragraph(image1)],
         });

         doc.addSection({
            properties: {},
            children: [
               new Paragraph({
                  children: [
                     new TextRun("     "),
                     new TextRun({
                        text: "\t\t\t\t\tGithub is the best",
                        bold: true,
                     }),
                  ],
               }),
               new Paragraph({
                  text: "Hello World",
                  heading: HeadingLevel.TITLE,
                  alignment: AlignmentType.RIGHT,
               }),
            ],
         });

         console.log(image1);

         // Packer.toBlob(doc).then((blob) => {
         // // saveAs from FileSaver will download the file
         // saveAs(blob, "example.docx");
         // });

         Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync("MyDocument.docx", buffer);
         });
      },
      getStudentInfo() {
         let oldUrl = this.$store.state.oldUrl;
         let phaseDate = localStorage.getItem("phaseDate");
         this.phaseData = JSON.parse(phaseDate);
         this.$http
            .get(`${oldUrl}/sections`)
            .then((res) => {
               this.allSections = res.data;
            })
            .catch((e) => {
               console.log(e);
            });
      },
      clearStudents() {
         let self = this;
         self.filteredStudent = self.sections;
         console.log(self.filteredStudent);
         self.keyComponent += 1;
      },
      findStudent() {
         let self = this;

         self.filteredStudent = self.sections;
         let filtered = self.filteredStudent.filter((student) => {
            return student.studentName == self.foundStudent;
         });

         self.filteredStudent = filtered;
         self.keyComponent += 1;
      },
      checkGender(word, gender) {
         if (gender == "ذكر") {
            return word;
         } else {
            if (word == "صورته") {
               return "صورتها";
            }
            if (word == "تخرج") {
               return "تخرجت";
            }
            if (word == "حصل") {
               return "حصلت";
            }
         }
      },
      checkStudy(study) {
         if (study == "صباحي") {
            return "الصباحية";
         } else {
            return "المسائية";
         }
      },
      searchForStudent() {
         let self = this;

         let baseUrl = this.$store.state.apiUrl;
         let oldUrl = this.$store.state.oldUrl;

         this.$http
            .get(`${baseUrl}/registerDocument/${self.chosenSection}`)
            .then((res) => {
               self.sections = res.data;
               self.filteredStudent = self.sections;
            })
            .catch((e) => {
               if (e.response.status == 404) {
                  self.message = "لا يوجد طلبة في هذا القسم";
                  self.snackbar = true;
               }
            });
      },
      toIndiaDigits(number) {
         let id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
         let stringNumber = number.toString();
         // return stringNumber.toLocaleString('ar-SU')
         let arabicNumber = stringNumber.replace(/[0-9]/g, function(w) {
            return id[+w];
         });
         return arabicNumber.replace(".", ",");
      },
      setSequence(sequenceType, sequence, totalStudents) {
         let self = this;
         if (sequenceType == 2) {
            return `وبتسلسل ${self.toIndiaDigits(
               sequence
            )} من مجموع ${self.toIndiaDigits(
               totalStudents
            )} خريجاً <span style="font-weight : bold">للدورين الاول والثاني وللدراستين الصباحية والمسائية</span>`;
         } else {
            return `وبتسلسل ${self.toIndiaDigits(
               sequence
            )} من مجموع ${self.toIndiaDigits(
               totalStudents
            )} خريجاً <span style="font-weight : bold">للدورين الاول والثاني</span>`;
         }
      },
      goToDocument(student) {
         let self = this;

         let section = self.allSections.find(
            (section) => section.id == student.sectionId
         );
         student.sectionName = section.registerName;
         console.log(student);
         self.$store.dispatch("setStudentForPrint", student).then(() => {
            self.$router.push("/document-info");
         });
      },
      printDocument(student) {
         let self = this;

         let imagePath = path.join(__static, "1.png");

         let section = self.allSections.find(
            (section) => section.id == student.sectionId
         );

         var header =
            `<html  xmlns:o='urn:schemas-microsoft-com:office:office' ` +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            `<head><meta charset='utf-8'><title>Word Document</title></head><body style="background:url(${imagePath});background-size : cover;width : 2480px ; height : 3508px">`;
         var footer = "</body></html>";
         let body = `<div>
                            <div style="text-align:right">
                                <p>العدد</p>
                                <p>التاريخ :  &emsp; / &emsp;  / ٢٠٢٠</p>
                            </div>

                            <div style="text-align:center">
                                <h2>&emsp; / الى </h2>
                                <h2>م / تأييد تخرج</h2>
                            </div>

                            <div style="direction:rtl">
                                <p style="font-size:24px;text-align:right;line-height: 2;word-spacing: 5px;direction:rtl">
                                    نؤيد لكم بأن <span style="font-weight:bold">${
                                       student.studentName
                                    }</span>
                                     الملصقة ${self.checkGender(
                                        "صورته",
                                        student.gender
                                     )} اعلاه قد 
                                     ${self.checkGender("تخرج", student.gender)}
                                      في كليتنا للعام الدراسي 
                                       <span style="font-weight:bold">٢٠٢٠/٢٠١٩</span>
                                       في
                                       <span style="font-weight:bold">${
                                          self.setPhaseAndDate(student.phase)
                                             .phaseText
                                       }</span>
                                        بتاريخ 
                                       <span style="font-weight:bold">${
                                          self.setPhaseAndDate(student.phase)
                                             .date
                                       }</span>
                                       للدراسة 
                                       <span style="font-weight:bold">${self.checkStudy(
                                          student.studyType
                                       )}</span>
                                       و
                                      ${self.checkGender(
                                         "حصل",
                                         student.gender
                                      )} على شهادة بكالوريوس في <span style="font-weight:bold">${
            section.name
         }</span>  بمعدل 
                                      <span style="font-weight:bold">${self.toIndiaDigits(
                                         student.average
                                      )}</span> بتقدير <span style="font-weight:bold"> ${
            student.averageWrite
         } </span> 
                                      <span> ${self.setSequence(
                                         student.sequenceType,
                                         student.sequence,
                                         student.totalStudent
                                      )} </span>
                                      ، وبناءً على طلبه زود بهذا التأييد
                                </p>
                            </div>

                            <div style="margin:100px 0px"></div>

                            <div style="display: grid;grid-template-columns: auto auto;">
                                
                                <span style="text-align:center;">
                                    <h4>أ.د. سعيد عبد الهادي المرهج</h4>
                                    <h4>معاون العميد للشؤون العلمية</h4>
                                </span>

                                <span style="text-align:center;">
                                    <h4>د. سيف محمد علي</h4>
                                    <h4>مدير التسجيل و شؤون الطلبة</h4>
                                </span>

                            </div>

                        </div>`;
         var sourceHTML = header + body + footer;

         var source =
            "data:application/vnd.ms-word;charset=utf-8," +
            encodeURIComponent(sourceHTML);
         var fileDownload = document.createElement("a");
         document.body.appendChild(fileDownload);
         fileDownload.href = source;
         fileDownload.download = `${student.studentName}.doc`;
         fileDownload.click();
         document.body.removeChild(fileDownload);
      },
   },
   filters: {
      studyType: function(value) {
         if (value == 2) {
            return "للدراستين الصباحية والمسائية";
         } else if (value == 1) {
            return "حسب دراسة الطالب";
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
