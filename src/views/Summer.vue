<template>
   <div v-if="show">
      <div class="title-section">
         <h2>التدريب الصيفي</h2>
      </div>
      <v-card>
         <v-card-title>
            الطلبة
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
            :search="search"
            :items="desserts"
            item-key="name"
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

      <v-snackbar
         v-model="snackbar"
         :multi-line="multiLine"
         shaped
         :color="alertColor"
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

      <v-dialog v-model="dialog" scrollable max-width="500px" persistent>
         <v-card>
            <v-card-title>الطلبة الغير مستوفيين</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px;">
               <v-divider></v-divider>
               <p>
                  مجموع الطلبة الغير مستوفيين هو : {{ selected.length }} طالب
               </p>

               <ul>
                  <li
                     v-for="(student, index) in selected"
                     :key="index"
                     style="list-style: none"
                  >
                     <v-row no-gutters>
                        <v-col cols="1"> {{ index + 1 }} -</v-col>
                        <v-col cols="6"> {{ student.name }} </v-col>
                        <v-col cols="4" style="font-weight:bold;color:red">
                           {{ student.type }}
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

               <v-btn color="blue darken-1" text @click="dialog = false">
                  الغاء
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>
<script>
export default {
   data() {
      return {
         singleSelect: false,
         search: "",
         snackbar: false,
         multiLine: true,
         show: false,
         keyComponent: 0,
         alertColor: "",
         message: "",
         selected: [],
         dialog: false,
         headers: [
            {
               text: "اسم الطالب",
               align: "start",
               sortable: false,
               value: "name",
            },
            { text: "الرقم الاحصائي", value: "college_number" },
            { text: "الدراسة", value: "type" },
         ],
         desserts: [],
      };
   },
   created() {
      let self = this;
      self.initialData();
   },
   methods: {
      initialData() {
         let self = this;

         let students = `${this.$store.state.oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=4&status=1&page=1&limit=1000`;
         let summerTraining = `${this.$store.state.apiUrl}/summerTrainings/${this.$store.state.user.perv}`;

         function requestStudents() {
            return self.$http.get(students);
         }

         function requestSummerTraining() {
            return self.$http.get(summerTraining);
         }

         Promise.allSettled([requestStudents(), requestSummerTraining()])
            .then((responses) => {
               const responseStudents = responses[0];
               const responseSummer = responses[1];

               console.log(responseSummer.value.data);

               self.desserts =
                  responseStudents.status == "fulfilled"
                     ? responseStudents.value.data
                     : [];

               self.selected =
                  responseSummer.status == "fulfilled"
                     ? responseSummer.value.data.map((student) => {
                          return {
                             name: student.studentName,
                             college_number: student.collegeNumber,
                             type: student.studyType,
                          };
                       })
                     : [];

               self.show = true;
            })
            .catch((e) => {
               console.log(e);
            });
      },
      addSummer() {
         let self = this;
         self.dialog = true;
      },
      saveTheResult() {
         let self = this;
         this.$http
            .post(`${this.$store.state.apiUrl}/addMultiSummer`, self.selected)
            .then((res) => {
               self.message = "تم حفظ البيانات";
               self.alertColor = "green";
               self.snackbar = true;
               self.dialog = false;
               self.selected = [];
               console.log(res);
            })
            .catch((e) => {
               console.log(e);
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
</style>
