<template>
   <div>
      <div class="title-section">
         <h2>توليد الوثائق</h2>
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
                            label="القسم">
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
         <h2>الوثائق</h2>
      </div>


      <div style="text-align:center">
         <v-row>
            <v-col cols="3" style="margin-right: 50px;">         
               <v-autocomplete
                  v-model="foundStudent"
                  :items="sections"
                  @click:clear = "clearStudents"
                  item-text="studentName"
                  item-value="studentName"
                  @change="findStudent"
                  outlined
                  dense
                  label="اسم الطالب">
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
                  <v-col cols="2"> محل وتاريخ الولادة: {{ section.dob }}</v-col>
                  <v-col cols="1"> المعدل : {{ section.average }}</v-col>
                  <v-col cols="1">التقدير : {{ section.averageWriting }}</v-col>
                  <v-col cols="2" style="text-align:center">سنة القبول : {{ section.enterYear }}</v-col>
                  <v-col cols="2" style="text-align:center">التسلسل : {{ section.sequence}}</v-col>

                  <v-col cols="1" style="text-align:left">
                     
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
export default {
    data(){
        return{
            chosenSection : '',
            show:false,
            storeLoading: false,
            snackbarSuccess: false,
            snackbar : false,
            multiLine: true,
            imagePath : '',
            keyComponent : 0,
            message : '',
            allSections : [],
            sections : [],
            foundStudent : '',
            fourthClass : 0,
            filteredStudent : [],
            lessonTotal : 0,
            e1 : 1,
            phaseData : {}
        }
    },
    created() {
      this.getStudentInfo();
   },
   methods:{
       stepperChange() {
         console.log("stepper");
      },
      setPhaseAndDate(phase){
         if(phase == 1){
            return {
               phaseText : "الدور الاول",
               date : this.phaseData.phaseOne
            }
         }else{
            return {
               phaseText : "الدور الثاني",
               date : this.phaseData.phaseTwo
            }
         }
      },
      getStudentInfo() {
         let oldUrl = this.$store.state.oldUrl;
         let phaseDate = localStorage.getItem("phaseDate")
         this.phaseData = JSON.parse(phaseDate)
         console.log(this.phaseData)
         this.$http
            .get(
               `${oldUrl}/sections`
            )
            .then((res) => {
                  this.allSections = res.data;
               console.log(res.data);
            }).catch(e =>{
               console.log(e)
            })
      },
      clearStudents(){
         let self = this;
         
         self.filteredStudent = self.sections;
         console.log(self.filteredStudent)
         self.keyComponent +=1;
      },
      findStudent(){
         let self = this;
         
         self.filteredStudent = self.sections
         let filtered = self.filteredStudent.filter(student => {
            return student.studentName == self.foundStudent
         })

         self.filteredStudent = filtered
         self.keyComponent +=1;
      },
      checkGender(word , gender){
          if(gender == 'ذكر'){
              return word
          }else{
              if(word == 'صورته'){return 'صورتها'}
              if(word == 'تخرج'){return 'تخرجت'}
              if(word == 'حصل'){return 'حصلت'}
          }
      },
      checkStudy(study){
          if(study == 'صباحي'){
              return 'الصباحية'
          }else{
               return 'المسائية'
          }
      },
      searchForStudent(){

         let self = this

         let baseUrl = this.$store.state.apiUrl;
         let oldUrl = this.$store.state.oldUrl;
         this.$http
            .get(
               `${baseUrl}/graduationSection/${self.chosenSection}`
            )
            .then((res) => {
                self.sections = res.data;
                self.filteredStudent = self.sections
               console.log(res.data);
            }).catch(e => {
               if(e.response.status == 404){
                  self.message = "لا يوجد طلبة في هذا القسم"
                  self.snackbar = true
               }
            })
      },
      toIndiaDigits(number){
         let id= ['۰','۱','۲','۳','٤','٥','٦','۷','۸','۹'];
         let stringNumber = number.toString()
         

         // return stringNumber.toLocaleString('ar-SU')
         let arabicNumber = stringNumber.replace(/[0-9]/g, function(w){
         return id[+w]
         });

         return arabicNumber.replace('.' , ',')
      },
      setSequence(sequenceType , sequence , totalStudents){
         let self = this;
         if(sequenceType == 2){
            return `وبتسلسل ${self.toIndiaDigits(sequence)} من مجموع ${self.toIndiaDigits(totalStudents)} خريجاً <span style="font-weight : bold">للدورين الاول والثاني وللدراستين الصباحية والمسائية</span>`
         }else{
            return `وبتسلسل ${self.toIndiaDigits(sequence)} من مجموع ${self.toIndiaDigits(totalStudents)} خريجاً <span style="font-weight : bold">للدورين الاول والثاني</span>`
         }
      },
      goToDocument(student){
         let self = this;
         console.log(student)
         self.$store.dispatch("setStudentForPrintDoc", student).then(() =>{
            self.$router.push("/grad")
         })
      },
   },
   filters: {
         studyType: function (value) {
            if(value == 2){
               return "للدراستين الصباحية والمسائية"
            }else if(value == 1){
               return "حسب دراسة الطالب"
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
