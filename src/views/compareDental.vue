<template>
   <div>
      <div class="title-section">
         <h2>مقارنة المراحل</h2>
      </div>

      <div class="not-print">
         <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6">
               <v-btn color="success" @click="createExcelFile">
                  طباعة
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

      <table border="1" style="margin:10px auto">
         <tr>
            <th>اسم الطالب</th>
            <th>المرحلة الاولى</th>
            <th>المرحلة الثانية</th>
            <th>المرحلة الثالثة</th>
            <th>المرحلة الرابعة</th>
            <th>المرحلة الخامسة</th>
         </tr>
         <tr v-for="(student, index) in fifthStudents" :key="index">
            <td>
               <p style="text-align:center">{{ student.name }}</p>
               <p style="text-align:center">{{ student.college_number }}</p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentName(student.college_number, firstStudents) }}
               </p>

               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentLevel(student.college_number, firstStudents) }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentName(student.college_number, secondStudents) }}
               </p>
               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentLevel(student.college_number, secondStudents) }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentName(student.college_number, thirdStudents) }}
               </p>
               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentLevel(student.college_number, thirdStudents) }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentName(student.college_number, fourthStudents) }}
               </p>
               <p style="text-align:center;margin:3px 10px">
                  {{ findStudentLevel(student.college_number, fourthStudents) }}
               </p>
            </td>
            <td>
               <p style="text-align:center;margin:3px 10px">
                  {{ student.name }}
               </p>
               <p style="text-align:center;margin:3px 10px">
                  {{ student.college_number }} - {{ login.currentYear }}
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
      typeOfStudy: ["صباحي", "مسائي"],
      studyType: "",
      thirdStudents: [],
      originalStudent: [],
      fifthStudents: [],
      login: "",
   }),
   created() {
      this.login = this.$store.state.user;
      let baseUrl = this.$store.state.apiUrl;
      let oldUrl = this.$store.state.oldUrl;
      this.$http
         .get(
            `${oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=5&status=1&page=1&limit=1000`
         )
         .then((res) => {
            this.fifthStudents = res.data;
            this.originalStudent = res.data;
         }).catch(e =>{
               console.log(e)
            })

      this.$http
         .get(
            `${baseUrl}/masterInfo?sectionId=${this.$store.state.user.perv}&level=1`
         )
         .then((res) => {
            this.firstStudents = res.data;
         }).catch(e =>{
               console.log(e)
            })

      this.$http
         .get(
            `${baseUrl}/masterInfo?sectionId=${this.$store.state.user.perv}&level=4`
         )
         .then((res) => {
            this.fourthStudents = res.data;
         }).catch(e =>{
               console.log(e)
            })

      this.$http
         .get(
            `${baseUrl}/masterInfo?sectionId=${this.$store.state.user.perv}&level=2`
         )
         .then((res) => {
            this.secondStudents = res.data;
         }).catch(e =>{
               console.log(e)
            })

      this.$http
         .get(
            `${baseUrl}/masterInfo?sectionId=${this.$store.state.user.perv}&level=3`
         )
         .then((res) => {
            this.thirdStudents = res.data;
         }).catch(e =>{
               console.log(e)
            })
   },
   methods: {
      findStudentLevel(collageNumber, arrayOfStudent) {
         let foundStudent = arrayOfStudent.filter((student) => {
            if (
               student.collageNumber == collageNumber ||
               "0" + student.collageNumber == collageNumber
            ) {
               return student;
            }
         });

         if (foundStudent.length > 0) {
            return `${foundStudent[0].collageNumber} - ${foundStudent[0].year} `;
         } else {
            return ` لايوجد`;
         }
      },
      checkForClass() {
         let self = this;
         self.fifthStudents = self.originalStudent;
         let matchNumber;
         console.log(self.studyType);
         matchNumber = self.fifthStudents.filter((student) => {
            return student.type == self.studyType;
         });
         // console.log(matchNumber);
         if (matchNumber.length > 0) {
            self.fifthStudents = matchNumber;
         } else {
            self.fifthStudents = self.originalStudent;
         }
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

         worksheet.columns = [
            { header: "اسم الطالب", key: "name", width: 55 },
            { header: "المرحلة الاولى", key: "levelOne", width: 55 },
            { header: "المرحلة الثانية	", key: "levelTwo", width: 55 },
            { header: "المرحلة الثالثة", key: "levelThree", width: 55 },
            { header: "المرحلة الرابعة", key: "levelFour", width: 55 },
            { header: "المرحلة الخامسة", key: "levelFive", width: 55 },
         ];

         this.fifthStudents.forEach((student) => {
            worksheet.addRow({
               name: `${student.name} \n ${student.college_number}`,
               levelOne: `${self.findStudentName(
                  student.college_number,
                  self.firstStudents
               )} \n ${self.findStudentLevel(
                  student.college_number,
                  self.firstStudents
               )}`,
               levelTwo: `${self.findStudentName(
                  student.college_number,
                  self.secondStudents
               )} \n ${self.findStudentLevel(
                  student.college_number,
                  self.secondStudents
               )}`,
               levelThree: `${self.findStudentName(
                  student.college_number,
                  self.thirdStudents
               )} \n ${self.findStudentLevel(
                  student.college_number,
                  self.thirdStudents
               )}`,
               levelFour: `${self.findStudentName(
                  student.college_number,
                  self.fourthStudents
               )} \n ${self.findStudentLevel(
                  student.college_number,
                  self.fourthStudents
               )}`,
               levelFive: `${self.findStudentName(
                  student.college_number,
                  self.fifthStudents
               )} \n ${self.findStudentLevel(
                  student.college_number,
                  self.fifthStudents
               )}`,
            });
         });

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
            a.download = `مقارنة-المراحل.xlsx`;
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
table th {
   position: sticky;
   top: 0;
   z-index: 5;
   background: #fff;
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
