<template>
   <div
      id="divDocument"
      style="margin:0px;
      
      background-position-x: center;
      background-position-y: center;
      background-repeat: no-repeat !important;"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
   >
      <v-row
         align="center"
         justify="space-around"
         style="margin:10px 0px"
         class="not-printable"
      >
         <h1>تأييد الطالب</h1>
      </v-row>

      <div
         id="content-div"
         style="text-align:right;padding-right:60px;color:#000;font-weight:bold;font-size:12px"
      >
         : العدد
      </div>
      <div
         style="text-align:right;padding-right:60px;color:#000;font-weight:bold;font-size:12px"
      >
         التاريخ : <span style="padding-left:10px"></span> /
         <span style="padding-left:10px"></span>/ ٢٠٢١
      </div>
      <div style="padding-top:50px"></div>
      <div style="text-align:center">
         <span
            style="color:#000;font-weight:bold;display: inline-block;font-size:24px"
            contenteditable
         >
            الى /
         </span>
      </div>
      <div style="padding-top:10px"></div>
      <div style="text-align:center">
         <h2
            style="color:#000;font-weight:bold;border-bottom:2px solid #000;display: inline-block;"
         >
            م / تأييد تخرج
         </h2>
      </div>
      <div style="padding-top:10px"></div>
      <div
         style="border:3px solid #f4d58d;margin:20px;border-radius:10px;"
         class="shadow-text"
      >
         <div style="direction:rtl">
            <p
               id="document-content"
               style="font-size:26px;text-align:right;line-height: 2;direction:rtl;padding:10px;color:#000 ; text-align: justify;text-justify: inter-word;"
            >
               نؤيد لكم بأن
               <span style="font-weight:bold" contenteditable>{{
                  student.studentName
               }}</span>
               الملصقة {{ checkGender("صورته", student.gender) }} اعلاه قد
               {{ checkGender("تخرج", student.gender) }} في كليتنا للعام الدراسي
               <span style="font-weight:bold" contenteditable>٢٠٢٠/٢٠١٩</span>
               في
               <span style="font-weight:bold" contenteditable>{{
                  setPhaseAndDate(student.phase).phaseText
               }}</span>
               بتاريخ
               <span style="font-weight:bold" contenteditable>{{
                  setPhaseAndDate(student.phase).date
               }}</span>
               للدراسة
               <span style="font-weight:bold" contenteditable>{{
                  checkStudy(student.studyType)
               }}</span>
               و {{ checkGender("حصل", student.gender) }} على شهادة بكالوريوس في
               <span
                  style="font-weight:bold;width:160px;min-width:120px;max-width: 3000px"
                  class="input-bold"
                  contenteditable
                  >{{ student.sectionName }}</span
               >
               بمعدل
               <span style="font-weight:bold" contenteditable>
                  {{ toIndiaDigits(student.average) }}
               </span>
               بتقدير
               <span style="font-weight:bold" contenteditable>
                  {{ student.averageWrite }}
               </span>
               <span style="font-weight : bold" contenteditable>
                  {{
                     setSequence(
                        student.sequenceType,
                        student.sequence,
                        student.totalStudent
                     )
                  }}
               </span>
               ، وبناءً على {{ checkGender("طلبه", student.gender) }}
               {{ checkGender("زود", student.gender) }} بهذا التأييد
            </p>
         </div>
      </div>
      <div style="margin:20px;">
         <span
            type="text"
            style="width:100%;text-decoration: underline;color:#000"
            contenteditable
         >
            الملاحظات</span
         >
      </div>

      <div style="padding-top:140px"></div>

      <div id="footer-section">
         <v-row no-gutters style="text-align:center">
            <v-col cols="6">
               <p
                  style="color:#000;font-weight:bold;font-size:16px"
                  contenteditable
               >
                  د. سيف محمد علي
               </p>
               <p style="color:#000;font-weight:bold;font-size:16px">
                  مدير التسجيل و شؤون الطلبة
               </p>
            </v-col>

            <v-col cols="6">
               <p
                  style="color:#000;font-weight:bold;font-size:16px"
                  contenteditable
               >
                  أ.د. أبراهيم سعيد كاطع
               </p>
               <p style="color:#000;font-weight:bold;font-size:16px">
                  معاون العميد للشؤون العلمية
               </p>
            </v-col>
         </v-row>
      </div>
      <v-row
         align="center"
         justify="space-around"
         style="margin:100px 0px;padding:0px 0px"
         class="not-printable"
      >
         <v-btn color="success" @click="print">
            <v-icon left small>
               fa-print
            </v-icon>
            بدون معدل
         </v-btn>

         <v-btn color="success" @click="printWithAverage">
            <v-icon left small>
               fa-print
            </v-icon>
            بمعدل
         </v-btn>
      </v-row>
   </div>
</template>

<script>
const ipcRenderer = window.require("electron").ipcRenderer;
const path = window.require("path");
import * as fs from "fs";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

export default {
   data() {
      return {
         imagePath: "",
         image: { backgroundImage: "url(../assets/logo.png)" },
         forDocument: "",
         studentDate: "     /      / ٢٠٢١   ",
         documentNumber: "",
         student: "",
         phaseData: "",
         backgroundImage: require("../assets/1.png"),
         dialog: false,
      };
   },
   created() {
      this.imagePath = path.join(__static, "1.png");
      this.student = this.$store.state.printStudent;
      console.log(this.student);
      // ipcRenderer.send("testMain", "hi there");
   },
   mounted() {
      // let divImage = document.getElementById("divDocument");
      // console.log(divImage);
      // divImage.style.backgroundImage = `url(${this.imagePath})`;
      let phaseDate = localStorage.getItem("phaseDate");
      this.phaseData = JSON.parse(phaseDate);
   },
   methods: {
      printWithAverage() {
         fs.readFile(
            path.join(__static, "withAverage.docx"),
            "binary",
            (error, content) => {
               if (error) {
                  throw error;
               }

               var zip = new PizZip(content);
               var doc = new Docxtemplater(zip);

               doc.setData({
                  studentName: this.student.studentName,
                  sectionName: this.student.sectionName,
                  phase: this.setPhaseAndDate(this.student.phase).phaseText,
                  date: this.setPhaseAndDate(this.student.phase).date,
                  studyType: this.checkStudy(this.student.studyType),
                  average: this.toIndiaDigits(this.student.average),
                  write: this.student.averageWrite,
                  seq: this.student.sequence,
                  total: this.student.totalStudent,
                  type: this.checkStudy(this.student.studyType),
               });
               try {
                  // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                  doc.render();
               } catch (error) {
                  // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
                  function replaceErrors(key, value) {
                     if (value instanceof Error) {
                        return Object.getOwnPropertyNames(value).reduce(
                           function(error, key) {
                              error[key] = value[key];
                              return error;
                           },
                           {}
                        );
                     }
                     return value;
                  }
                  console.log(JSON.stringify({ error: error }, replaceErrors));

                  if (
                     error.properties &&
                     error.properties.errors instanceof Array
                  ) {
                     const errorMessages = error.properties.errors
                        .map(function(error) {
                           return error.properties.explanation;
                        })
                        .join("\n");
                     console.log("errorMessages", errorMessages);
                     // errorMessages is a humanly readable message looking like this :
                     // 'The tag beginning with "foobar" is unopened'
                  }
                  throw error;
               }
               var out = doc.getZip().generate({
                  type: "blob",
                  mimeType:
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
               }); //Output the document using Data-URI
               saveAs(out, `${this.student.studentName}.docx`);
            }
         );
      },
      renderDoc() {
         fs.readFile(
            path.join(__static, "withoutAverage.docx"),
            "binary",
            (error, content) => {
               if (error) {
                  throw error;
               }

               var zip = new PizZip(content);
               var doc = new Docxtemplater(zip);
               doc.setData({
                  studentName: this.student.studentName,
                  sectionName: this.student.sectionName,
                  phase: this.setPhaseAndDate(this.student.phase).phaseText,
                  date: this.setPhaseAndDate(this.student.phase).date,
                  studyType: this.checkStudy(this.student.studyType),
               });
               try {
                  // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                  doc.render();
               } catch (error) {
                  // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
                  function replaceErrors(key, value) {
                     if (value instanceof Error) {
                        return Object.getOwnPropertyNames(value).reduce(
                           function(error, key) {
                              error[key] = value[key];
                              return error;
                           },
                           {}
                        );
                     }
                     return value;
                  }
                  console.log(JSON.stringify({ error: error }, replaceErrors));

                  if (
                     error.properties &&
                     error.properties.errors instanceof Array
                  ) {
                     const errorMessages = error.properties.errors
                        .map(function(error) {
                           return error.properties.explanation;
                        })
                        .join("\n");
                     console.log("errorMessages", errorMessages);
                     // errorMessages is a humanly readable message looking like this :
                     // 'The tag beginning with "foobar" is unopened'
                  }
                  throw error;
               }
               var out = doc.getZip().generate({
                  type: "blob",
                  mimeType:
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
               }); //Output the document using Data-URI
               saveAs(out, `${this.student.studentName}.docx`);
            }
         );
      },

      print() {
         // console.log(
         //    `date ${this.studentDate} and number is ${this.documentNumber} and for ${this.forDocument}`
         // );
         // setTimeout(function() {
         //    window.print();
         // }, 100);

         this.renderDoc();
      },
      openNew() {
         let self = this;

         let divToPrint = document.getElementById("divDocument").outerHTML;

         let stylesHtml = "";
         for (const node of [
            ...document.querySelectorAll('link[rel="stylesheet"], style'),
         ]) {
            stylesHtml += node.outerHTML;
         }

         let PrintWin = window.open(
            "",
            "",
            "left=0,top=0,width=600,height=1754,toolbar=0,scrollbars=0,status=0"
         );
         PrintWin.document.write(`<!DOCTYPE html>
                  <html>
                  <head>
                  ${stylesHtml}
                    <style type="text/css">
                        #footer-section {
                           position: absolute;
                           width: 100%;
                           bottom: 90px;
                        }
                        p{
                           font-size:18px !important
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
                        #document-content {
                           padding: 10px !important;
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
                    </style>

                  </head>
                  <body>
                     ${divToPrint}
                  </body>
                  </html>`);
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
            if (word == "طلبه") {
               return "طلبها";
            }
            if (word == "زود") {
               return "زودت";
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
            )} خريجاً للدورين الاول والثاني وللدراستين الصباحية والمسائية`;
         } else {
            return `وبتسلسل ${self.toIndiaDigits(
               sequence
            )} من مجموع ${self.toIndiaDigits(
               totalStudents
            )} خريجاً للدورين الاول والثاني`;
         }
      },
      setPhaseAndDate(phase) {
         if (phase == 1) {
            return {
               phaseText: " الاول",
               date: this.phaseData.phaseOne,
            };
         } else {
            return {
               phaseText: " الثاني",
               date: this.phaseData.phaseTwo,
            };
         }
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
@media print {
   * {
      -webkit-print-color-adjust: exact !important;
   }
   #footer-section {
      position: absolute;
      width: 100%;
      bottom: 90px;
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
   #document-content {
      padding: 10px !important;
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
