<template>
   <div>
      <div class="title-section">
         <v-row>
            <v-col cols="11">
               <div class="title"><h3>تعديلات الرقم الاحصائي</h3></div>
            </v-col>
            <v-col cols="1">
               <v-btn icon color="accent" @click="goBack">
                  <v-icon>fa-arrow-left</v-icon>
               </v-btn>
            </v-col>
         </v-row>
      </div>

      <table style="margin: 40px auto">
         <tr>
            <th>التسلسل</th>
            <th>اسم الطالب</th>
            <th>الرقم الاحصائي</th>
         </tr>
         <tr
            v-for="(student, index) in studentsMaster"
            :key="student.collageNumber"
         >
            <td>
               <div style="margin-right:20px">
                  {{ index + 1 }}
               </div>
            </td>
            <td>
               <div style="margin-right:20px">
                  {{ student.studentName }}
               </div>
            </td>
            <td>
               <div style="margin-top:20px">
                  <v-text-field
                     label="الرقم الاحصائي"
                     :value="student.collageNumber"
                     outlined
                     dense
                  ></v-text-field>
               </div>
            </td>
         </tr>
      </table>
   </div>
</template>

<script>
import { mapState } from "vuex";
export default {
   data: () => ({}),
   created() {
      console.log(this.$store.state.studentsMaster);
   },
   methods: {
      goBack() {
         this.$router.go(-1);
      },
   },
   computed: { ...mapState(["studentsMaster"]) },
};
</script>

<style lang="scss" scoped>
.title-section {
   text-align: center;

   margin: 20px auto;
}
.title-section h3 {
   padding: 10px;
   border-radius: 10px;
   background: #ffffff;
   box-shadow: 5px 5px 10px #e0e0e0, -5px -5px 10px #e0e0e0;
}
table tr td {
   border: 1px solid #c5c5c5;
}
.title {
   width: 300px;
   text-align: center;
   margin: 0 auto;
}
</style>
