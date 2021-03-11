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
                           label="اسم االطالب"
                        >
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
                           label="التسلسل حسب..."
                        >
                        </v-autocomplete>
                     </v-col>

                     <v-col cols="3">
                        <v-autocomplete
                           v-model="chosenDocumentType"
                           :items="documentType"
                           item-text="name"
                           item-value="value"
                           outlined
                           dense
                           label="نوع المستند..."
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

      <v-row>
         <v-col style="text-align:center">
            <v-progress-circular
               :active="showLoadingStatus"
               :size="70"
               :width="7"
               v-if="showLoadingStatus"
               :indeterminate="showLoadingStatus"
               color="teal"
            ></v-progress-circular>
         </v-col>
      </v-row>

      <v-card
         elevation="3"
         v-if="showConfirm"
         style="padding:15px; margin:45px"
      >
         <!-- <h3>التدريب الصيفي :  {{checkTraining(findStudent.college_number , findStudent.type).summerStudent}}</h3> -->

         <v-row>
            <v-col cols="6">
               <h3>الاسم الكامل : {{ findStudent.name }}</h3>
               <h3>
                  محل وتاريخ الولادة : {{ findStudent.resident }} -
                  {{ findStudent.birthdate | convertDate }}
               </h3>
               <h3>الشهادة : بكالوريوس في {{ $store.state.user.fullName }}</h3>
               <h3>القسم : {{ $store.state.user.fullName }}</h3>
               <h3>سنة القبول : {{ toIndiaDigits(findStudent.enter_year) }}</h3>
               <h3>
                  ادناه المواد الدراسية والدرجات التي حصل عليها خلال سنوات
                  الدراسة .
               </h3>
            </v-col>
            <v-col cols="6" style="padding-right : 45px">
               <h3>الجنسية : عراقي</h3>
               <h3>
                  المعدل :
                  {{
                     toIndiaDigits(
                        getStudentAverage(
                           studentsAverage,
                           findStudent.college_number
                        )
                     )
                  }}
                  %
               </h3>
               <h3>
                  التقدير :
                  {{
                     findAverageWriting(
                        getStudentAverage(
                           studentsAverage,
                           findStudent.college_number
                        )
                     )
                  }}
               </h3>
               <h3>
                  الدراسة :
                  {{ findStudent.type == "صباحي" ? "الصباحية" : "المسائية" }}
               </h3>
               <h3>
                  التسلسل :
                  {{
                     toIndiaDigits(
                        getAllAverage(findStudent.college_number, findStudent) +
                           1
                     )
                  }}
                  من مجموع {{ toIndiaDigits(studentLength) }} خريجاً
               </h3>
               <h3>
                  علماً ان معدل الخريج الاول :
                  {{ toIndiaDigits(studentsAverage[0].average) }} %
               </h3>
            </v-col>
         </v-row>

         <!-- Courses One section -->
         <v-row v-if="firstClass[0].masterTypeId == 1">
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الاولى</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 firstYearMarks,
                                 1,
                                 findStudent.type
                              )[0].year
                           )
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
                     v-for="(mark, index) in getMasterSplit(firstClass)
                        .courseOne"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(firstClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(firstClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>

            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الاولى</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 firstYearMarks,
                                 1,
                                 findStudent.type
                              )[0].year
                           )
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
                     v-for="(mark, index) in getMasterSplit(firstClass)
                        .courseTwo"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(firstClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(firstClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>

         <v-row
            v-if="
               firstClass[0].masterTypeId == 2 &&
                  secondClass[0].masterTypeId == 1
            "
         >
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الاولى</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 firstYearMarks,
                                 1,
                                 findStudent.type
                              )[0].year
                           )
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
                  <tr v-for="(mark, index) in firstClass" :key="index">
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(firstClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(firstClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>

         <!-- END OF Courses One section -->

         <!-- Courses TWO section -->
         <v-row v-if="secondClass[0].masterTypeId == 1">
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثانية</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 secondYearMarks,
                                 2,
                                 findStudent.type
                              )[0].year
                           )
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
                     v-for="(mark, index) in getMasterSplit(secondClass)
                        .courseOne"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(secondClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(secondClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثانية</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 secondYearMarks,
                                 2,
                                 findStudent.type
                              )[0].year
                           )
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
                     v-for="(mark, index) in getMasterSplit(secondClass)
                        .courseTwo"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(secondClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(secondClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>
         <!-- END OF Courses TWO section -->

         <!-- Courses first section  AND second and third not course-->
         <v-row
            v-if="
               firstClass[0].masterTypeId == 1 &&
                  secondClass[0].masterTypeId == 2 &&
                  thirdClass[0].masterTypeId == 2
            "
         >
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثانية</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 secondYearMarks,
                                 2,
                                 findStudent.type
                              )[0].year
                           )
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
                  <tr v-for="(mark, index) in secondClass" :key="index">
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(secondClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(secondClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>

            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثالثة</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 thirdYearMarks,
                                 3,
                                 findStudent.type
                              )[0].year
                           )
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
                  <tr v-for="(mark, index) in thirdClass" :key="index">
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(thirdClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(thirdClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>

         <v-row
            v-if="
               firstClass[0].masterTypeId == 2 &&
                  secondClass[0].masterTypeId == 2
            "
         >
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الاولى</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 firstYearMarks,
                                 1,
                                 findStudent.type
                              )[0].year
                           )
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
                  <tr v-for="(mark, index) in firstClass" :key="index">
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(firstClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(firstClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>

            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثانية</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 secondYearMarks,
                                 2,
                                 findStudent.type
                              )[0].year
                           )
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
                  <tr v-for="(mark, index) in secondClass" :key="index">
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(secondClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(secondClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>

         <v-row v-if="thirdClass[0].masterTypeId == 2 && fourthType.type == 1">
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثالثة</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 thirdYearMarks,
                                 3,
                                 findStudent.type
                              )[0].year
                           )
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
                  <tr v-for="(mark, index) in thirdClass" :key="index">
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(thirdClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(thirdClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>

            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الرابعة</th>
                     <th colspan="3">{{ toIndiaDigits("2020 - 2019") }}</th>
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
                        findStudent.college_number,
                        fourthStudentsDegrees
                     )"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        {{ toIndiaDigits(mark.degree) }}
                     </td>
                     <td>{{ numberToWord(mark.degree) }}</td>
                     <td>{{ toIndiaDigits(mark.credit) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span
                           v-if="
                              checkRule(
                                 getLastYearLessonsMarks(
                                    findStudent.college_number,
                                    fourthStudentsDegrees
                                 )
                              )
                           "
                        >
                           بقرار
                        </span>
                        من
                     </td>
                     <!-- <h3>الدور : {{checkForSecondTerm(findStudent , fourthStudentsDegrees) | phaseRole}}</h3> -->
                     <td colspan="2">
                        {{
                           checkForSecondTerm(fourthStudentsDegrees) | phaseRole
                        }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>

         <!-- Courses THREE section -->
         <v-row v-if="thirdClass[0].masterTypeId == 1">
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثالثة</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 thirdYearMarks,
                                 3,
                                 findStudent.type
                              )[0].year
                           )
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
                     v-for="(mark, index) in getMasterSplit(thirdClass)
                        .courseOne"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(thirdClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(thirdClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>

            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الثالثة</th>
                     <th colspan="3">
                        {{
                           toIndiaDigits(
                              studentLessonMarks(
                                 findStudent.college_number,
                                 thirdYearMarks,
                                 3,
                                 findStudent.type
                              )[0].year
                           )
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
                     v-for="(mark, index) in getMasterSplit(thirdClass)
                        .courseTwo"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        <span v-if="mark.phase == 2" style="color:red">*</span
                        >{{ toIndiaDigits(mark.mark) }}
                     </td>
                     <td>{{ mark.numberWriting }}</td>
                     <td>{{ toIndiaDigits(mark.units) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span v-if="checkRule(thirdClass)"> بقرار </span>
                        من
                     </td>
                     <td colspan="2">
                        {{ checkForSecondTermsLevel(thirdClass) | phaseRole }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>
         <!-- END OF Courses THREE section -->

         <!-- Courses FOUR section -->
         <v-row v-if="fourthType.type == 2">
            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الرابعة</th>
                     <th colspan="3">{{ toIndiaDigits("2020 - 2019") }}</th>
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
                     v-for="(mark, index) in getMasterSplit(
                        getLastYearLessonsMarks(
                           findStudent.college_number,
                           fourthStudentsDegrees
                        )
                     ).courseOne"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        {{ toIndiaDigits(mark.degree) }}
                     </td>
                     <td>{{ numberToWord(mark.degree) }}</td>
                     <td>{{ toIndiaDigits(mark.credit) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span
                           v-if="
                              checkRule(
                                 getLastYearLessonsMarks(
                                    findStudent.college_number,
                                    fourthStudentsDegrees
                                 )
                              )
                           "
                        >
                           بقرار
                        </span>
                        من
                     </td>
                     <!-- <h3>الدور : {{checkForSecondTerm(findStudent , fourthStudentsDegrees) | phaseRole}}</h3> -->
                     <td colspan="2">
                        {{
                           checkForSecondTerm(fourthStudentsDegrees) | phaseRole
                        }}
                     </td>
                  </tfoot>
               </table>
            </v-col>

            <v-col cols="6">
               <table
                  border="1"
                  style="width:90%;border-spacing: 0px;text-align:center;margin: auto;"
               >
                  <tr>
                     <th>السنة الرابعة</th>
                     <th colspan="3">{{ toIndiaDigits("2020 - 2019") }}</th>
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
                     v-for="(mark, index) in getMasterSplit(
                        getLastYearLessonsMarks(
                           findStudent.college_number,
                           fourthStudentsDegrees
                        )
                     ).courseTwo"
                     :key="index"
                  >
                     <td>{{ mark.lessonName }}</td>
                     <td style="width:12% ">
                        {{ toIndiaDigits(mark.degree) }}
                     </td>
                     <td>{{ numberToWord(mark.degree) }}</td>
                     <td>{{ toIndiaDigits(mark.credit) }}</td>
                  </tr>
                  <tfoot>
                     <td colspan="2">
                        {{ findStudent.sex | genderCheck }}
                        <span
                           v-if="
                              checkRule(
                                 getLastYearLessonsMarks(
                                    findStudent.college_number,
                                    fourthStudentsDegrees
                                 )
                              )
                           "
                        >
                           بقرار
                        </span>
                        من
                     </td>
                     <!-- <h3>الدور : {{checkForSecondTerm(findStudent , fourthStudentsDegrees) | phaseRole}}</h3> -->
                     <td colspan="2">
                        {{
                           checkForSecondTerm(fourthStudentsDegrees) | phaseRole
                        }}
                     </td>
                  </tfoot>
               </table>
            </v-col>
         </v-row>
         <!-- END OF Courses FOUR section -->

         <v-row>
            <v-col cols="12">
               <h5>
                  التقديرات : مقبول ( ٥٠ - ٥٩ ) ، متوسط ( ٦٠ - ٦٩ ) ، جيد ( ٧٠ -
                  ٧٩ ) ، جيد جداً ( ٨٠ - ٨٩ ) ، امتياز ( ٩٠ - ١٠٠ ) .
               </h5>
               <h5 style="text-decoration : underline">الملاحظات:</h5>
               <pre style="display:inline-block"></pre>
               <h5 style="display:inline-block">
                  ١- المدة الاصغرية المطلوبة لنيل شهادة البكالوريوس هي اربع
                  سنوات .
               </h5>
               <br />
               <pre style="display:inline-block"></pre>
               <h5 style="display:inline-block">
                  ٢- ترمز العلامة * لدرجة النجاح بالدور الثاني .
               </h5>
               <br />
               <pre style="display:inline-block"></pre>
               <h5 style="display:inline-block">
                  ٣- سنوات الرسوب :<input
                     type="text"
                     placeholder="سنوات الرسوب"
                     v-model="failYears"
                  />
               </h5>
               <pre style="display:inline-block"></pre>
               <h5 style="display:inline-block">
                  سنوات التأجيل :
                  <input
                     type="text"
                     placeholder="سنوات التأجيل"
                     v-model="postponementYear"
                  />
               </h5>
               <br />
               <pre style="display:inline-block"></pre>
               <h5 style="display:inline-block">
                  ٤-
                  <input
                     style="width:300px"
                     type="text"
                     placeholder="نص استيفاء الطالب"
                     v-model="exception"
                  />
                  .
               </h5>
               <br />
               <h5 style="display:inline-block">
                  ٥-
                  <input
                     style="width:300px"
                     type="text"
                     placeholder="سنوات عدم رسوب الطالب"
                     v-model="yearsDelay"
                  />
                  .
               </h5>
            </v-col>
         </v-row>

         <v-row>
            <v-col>
               <v-btn
                  color="info"
                  @click="storeStudentDocument"
                  :loading="storeLoading"
               >
                  ارسال للتسجيل
               </v-btn>
            </v-col>
         </v-row>
      </v-card>

      <v-card elevation="3" v-if="show" style="padding:15px; margin:45px">
         <h3>الطالب : {{ findStudent.name }}</h3>
         <h3>
            المعدل :
            {{ getStudentAverage(studentsAverage, findStudent.college_number) }}
         </h3>
         <h3>
            التقدير :
            {{
               findAverageWriting(
                  getStudentAverage(studentsAverage, findStudent.college_number)
               )
            }}
         </h3>
         <h3>الجنس : {{ findStudent.sex }}</h3>
         <h3>الدراسة : {{ findStudent.type }}</h3>
         <h3>
            الدور :
            {{ checkForSecondTerm(fourthStudentsDegrees) | phaseRole }}
         </h3>
         <h3>
            التسلسل :
            {{ getAllAverage(findStudent.college_number, findStudent) + 1 }} من
            اصل {{ studentLength }}
         </h3>
         <h3>
            التدريب الصيفي :
            {{
               checkTraining(findStudent.college_number, findStudent.type)
                  .summerStudent
            }}
         </h3>

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
      headOfDepartment: "",
      multiLine: true,
      phase: 1,
      levelOneCourse: [],
      levelTwoCourse: [],
      levelThirdCourse: [],
      showConfirm: false,
      yearsDelay: "",
      message: "",
      fourthType: "",
      postponementYear: "",
      failYears: "",
      chosenStudyType: 0,
      allStudents: [],
      studentLength: 0,
      firstYearMarks: [],
      exception: "",
      secondYearMarks: [],
      thirdYearMarks: [],
      firstClass: [],
      studentsAverage: [],
      secondClass: [],
      thirdClass: [],
      showLoadingStatus: false,
      backupMarks: [],
      sequenceType: 0,
      summerTrainingStudents: [],
      findStudent: {},
      fourthStudentsDegrees: [],
      fourthLessons: [],
      totalUnitsFourth: 0,
      lessonTotal: 0,
      e1: 1,
   }),
   created() {
      this.getStudentInfo();
   },
   methods: {
      stepperChange() {
         console.log("stepper");
      },
      numberToWord(number) {
         let numbersWriting = [
            "احدى",
            "اثنتان",
            "ثلاث",
            "اربع",
            "خمس",
            "ست",
            "سبع",
            "ثمان",
            "تسع",
            "عشرة",
            "عشرون",
            "ثلاثون",
            "اربعون",
            "خمسون",
            "ستون",
            "سبعون",
            "ثمانون",
            "تسعون",
            "مئة",
         ];
         switch (number) {
            case 10:
               return numbersWriting[9];
            case 20:
               return numbersWriting[10];
            case 30:
               return numbersWriting[11];
            case 40:
               return numbersWriting[12];
            case 50:
               return numbersWriting[13];
            case 60:
               return numbersWriting[14];
            case 70:
               return numbersWriting[15];
            case 80:
               return numbersWriting[16];
            case 90:
               return numbersWriting[17];
            case 100:
               return numbersWriting[18];
         }

         let writingNumber = [];
         let num = number.toString().split("");
         switch (parseInt(num[1])) {
            case 1:
               writingNumber.push(numbersWriting[0]);
               break;
            case 2:
               writingNumber.push(numbersWriting[1]);
               break;
            case 3:
               writingNumber.push(numbersWriting[2]);
               break;
            case 4:
               writingNumber.push(numbersWriting[3]);
               break;
            case 5:
               writingNumber.push(numbersWriting[4]);
               break;
            case 6:
               writingNumber.push(numbersWriting[5]);
               break;
            case 7:
               writingNumber.push(numbersWriting[6]);
               break;
            case 8:
               writingNumber.push(numbersWriting[7]);
               break;
            case 9:
               writingNumber.push(numbersWriting[8]);
               break;
         }

         switch (parseInt(num[0])) {
            case 1:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[9]);
               break;
            case 2:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[10]);
               break;
            case 3:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[11]);
               break;
            case 4:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[12]);
               break;
            case 5:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[13]);
               break;
            case 6:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[14]);
               break;
            case 7:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[15]);
               break;
            case 8:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[16]);
               break;
            case 9:
               writingNumber.push("و");
               writingNumber.push(numbersWriting[17]);
               break;
         }

         if (writingNumber.length > 0) {
            return writingNumber.join(" ");
         }
      },
      getStudentInfo() {
         let oldUrl = this.$store.state.oldUrl;
         this.$http
            .get(
               `${oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=4&status=1&page=1&limit=1000`
            )
            .then((res) => {
               this.allStudents = res.data;
            })
            .catch((e) => {
               console.log(e);
            });
      },
      searchForStudent() {
         let self = this;
         self.showLoadingStatus = true;

         self.findStudent = self.allStudents.find((student) => {
            if (student.college_number == self.chosenStudent) {
               return student;
            }
         });

         let baseUrl = this.$store.state.apiUrl;
         let oldUrl = this.$store.state.oldUrl;

         let firstClass = `${baseUrl}/studentLevelDegree?sectionId=${
            this.$store.state.user.perv
         }&level=1&collageNumber=${parseInt(this.findStudent.college_number)}`;
         let secondClass = `${baseUrl}/studentLevelDegree?sectionId=${
            this.$store.state.user.perv
         }&level=2&collageNumber=${parseInt(this.findStudent.college_number)}`;
         let thirdClass = `${baseUrl}/studentLevelDegree?sectionId=${
            this.$store.state.user.perv
         }&level=3&collageNumber=${parseInt(this.findStudent.college_number)}`;

         let fourthClass = `${oldUrl}/studentAllMarks?sectionId=${
            this.$store.state.user.perv
         }&level=4&collegeNumber=${parseInt(this.findStudent.college_number)}`;
         let fourthAverage = `${oldUrl}/findAverageLessons?sectionId=${this.$store.state.user.perv}&level=4`;
         let lessonsForFourth = `${oldUrl}/sectionLessonsForDocument?sectionId=${this.$store.state.user.perv}&level=4`;
         let totalUnitsFourths = `${oldUrl}/findAverageLessons?sectionId=${this.$store.state.user.perv}&level=4`;

         let firstYear = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=1`;
         let secondYear = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=2`;
         let thirdYear = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=3`;
         let fourthBackupMarks = `${baseUrl}/sectionDegree?sectionId=${this.$store.state.user.perv}&level=4`;

         let summerTraining = `${baseUrl}/summerTrainings/${this.$store.state.user.perv}`;
         let studentAverages = `${this.$store.state.apiUrl}/averageBySection/${this.$store.state.user.perv}`;
         let levelFourthType = `${oldUrl}/sectionLevel?sectionId=${this.$store.state.user.perv}&level=4&year=2019-2020`;

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
         function requestStudentAverages() {
            return self.$http.get(studentAverages);
         }
         function requestFourthType() {
            return self.$http.get(levelFourthType);
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
            requestStudentAverages(),
            requestFourthType(),
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
               const responseStudentAverage = responses[12];
               const responseFourthType = responses[13];

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
               self.studentsAverage =
                  responseStudentAverage.status == "fulfilled"
                     ? responseStudentAverage.value.data
                     : [];

               self.fourthType =
                  responseFourthType.status == "fulfilled"
                     ? responseFourthType.value.data
                     : [];

               if (self.studentsAverage.length == 0) {
                  self.showLoadingStatus = false;
                  self.message = "الرجاء حفظ المعدلات قبل اصدار وثيقة او تأييد";
                  self.snackbar = true;
               } else {
                  self.showLoadingStatus = false;
               }

               if (self.chosenDocumentType == 2) {
                  self.showConfirm = true;
                  self.show = false;
               } else {
                  self.show = true;
                  self.showConfirm = false;
               }

               console.log(self.fourthType);
            })
            .catch((e) => {
               console.log(e);
            });
      },
      toIndiaDigits(number) {
         try {
            let id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
            let stringNumber = number.toString();
            // return stringNumber.toLocaleString('ar-SU')
            let arabicNumber = stringNumber.replace(/[0-9]/g, function(w) {
               return id[+w];
            });
            return arabicNumber.replace(".", ",");
         } catch (e) {
            self.showLoadingStatus = false;
            self.message = "الرجاء حفظ المعدلات قبل استخراج التأييدات والوثائق";
            self.snackbar = true;
         }
      },
      //start of export as docx
      printDocument() {
         fs.readFile(
            path.join(__static, "docS.docx"),
            "binary",
            (error, content) => {
               if (error) {
                  throw error;
               }

               var zip = new PizZip(content);
               var doc = new Docxtemplater(zip);

               doc.setData({
                  studentName: this.student.studentName,
                  department: this.student.sectionName,
                  locationAndBirth: this.setPhaseAndDate(this.student.phase)
                     .date,
                  write: this.student.averageWrite,
                  seq: this.student.sequence,
                  total: this.student.totalStudent,
                  average: this.toIndiaDigits(this.student.average),
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
      //end of export as docx
      saveForRegister() {
         let self = this;

         let studentCheck = self.checkTraining(
            self.findStudent.college_number,
            self.findStudent.type
         );

         if (studentCheck.summerStudent == "مستوف") {
            let averageDegree = self.getStudentAverage(
               self.studentsAverage,
               self.findStudent.college_number
            );
            let data = {
               studentName: self.findStudent.name,
               phase: self.checkForSecondTerm(self.fourthStudentsDegrees),
               studyType: self.findStudent.type,
               average: averageDegree,
               averageWrite: self.findAverageWriting(averageDegree),
               sectionId: self.$store.state.user.perv,
               gender: self.findStudent.sex,
               sequence:
                  self.getAllAverage(
                     self.findStudent.college_number,
                     self.findStudent
                  ) + 1,
               totalStudent: self.studentLength,
               sequenceType: self.sequenceType,
            };

            self.$http
               .post(`${self.$store.state.apiUrl}/addRegisterDocument`, data)
               .then((res) => {
                  console.log(res);
                  self.message = "تم ارسال البيانات للتسجيل";
                  self.snackbarSuccess = true;
                  self.show = false;
               })
               .catch((e) => {
                  console.log(e);
                  self.message =
                     "حدث خطا اثناء الارسال الرجاء التاكد من الاتصال";
                  self.snackbar = true;
                  self.show = false;
               });
         } else {
            self.message = "الطالب غير مستوف في التدريب الصيفي";
            self.snackbar = true;
            self.show = false;
         }
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
      getMasterSplit(arrayOfLesson) {
         return {
            courseOne: arrayOfLesson.filter((lesson) => lesson.course == 1),
            courseTwo: arrayOfLesson.filter((lesson) => lesson.course == 2),
         };
      },
      checkRule(arrayOfDegree) {
         if (
            arrayOfDegree.find((degree) => degree.rule == 1) ||
            arrayOfDegree.find((degree) => degree.examType == "qarar")
         ) {
            return true;
         } else {
            return false;
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
      getStudentAverage(allStudentsAverage, chosenCollageNumber) {
         let self = this;

         if (allStudentsAverage.length == 0) {
            self.showLoadingStatus = false;
            self.message = "الرجاء حفظ المعدلات قبل استخراج التأييدات والوثائق";
            self.snackbar = true;
            console.log("enter average");
         } else {
            try {
               return allStudentsAverage.find((student) => {
                  return student.collegeNumber == chosenCollageNumber;
               }).average;
            } catch (e) {
               self.showLoadingStatus = false;
               self.message =
                  "الرجاء حفظ المعدلات قبل استخراج التأييدات والوثائق";
               self.snackbar = true;

               console.log("found error");
            }
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
      getAllAverage(chosenCollageNumber, studyType) {
         let self = this;
         let studentStudyType = [];
         let chosenStudentStudyType = studyType.type == "صباحي" ? 1 : 2;
         let chosenx = 0;

         // sequenceType = 1 is for student studyType and 2 for all student sequence

         if (self.chosenStudyType != 0) {
            self.sequenceType = 1;

            studentStudyType = self.studentsAverage.filter((student) => {
               return student.studyType == chosenStudentStudyType;
            });
            chosenx = studentStudyType.findIndex((student) => {
               return (
                  student.collegeNumber == chosenCollageNumber ||
                  student.collegeNumber == `0${chosenCollageNumber}`
               );
            });
         } else {
            self.sequenceType = 2;

            studentStudyType = self.studentsAverage;
            chosenx = studentStudyType.findIndex((student) => {
               return (
                  student.collegeNumber == chosenCollageNumber ||
                  student.collegeNumber == `0${chosenCollageNumber}`
               );
            });

            console.log(chosenx);
         }
         if (studentStudyType.length > 0) {
            self.studentLength = studentStudyType.length;
            if (chosenx) {
               return chosenx;
            } else {
               return 0;
            }
         } else {
            console.log("not found students");
            self.studentLength = studentStudyType.length;
         }
      },
      storeStudentDocument() {
         let self = this;

         if (self.failYears && self.postponementYear && self.exception) {
            let studentData = {
               studentName: self.findStudent.name,
               studentNameEn: self.findStudent.english_name,
               collegeId: self.findStudent.college_number,
               studentId: self.findStudent.id,
               sectionId: self.findStudent.sectionid,
               sectionName: self.$store.state.user.sectionName,
               enterYear: self.findStudent.enter_year,
               dob: `${
                  self.findStudent.resident
               } - ${self.$options.filters.convertDateEN(
                  self.findStudent.birthdate
               )}`,
               average: self.getStudentAverage(
                  self.studentsAverage,
                  self.findStudent.college_number
               ),
               averageWriting: self.findAverageWriting(
                  self.getStudentAverage(
                     self.studentsAverage,
                     self.findStudent.college_number
                  )
               ),
               sequence:
                  self.getAllAverage(
                     self.findStudent.college_number,
                     self.findStudent
                  ) + 1,
               totalStudents: self.studentLength,
               firstAverage: self.studentsAverage[0].average,
               phase: self.checkForSecondTerm(self.fourthStudentsDegrees),
               failYears: self.failYears,
               postponementYear: self.postponementYear,
               exception: self.exception,
               type: self.findStudent.type,
               yearsDelay: self.yearsDelay,
            };
            self.$http
               .post(
                  `${self.$store.state.apiUrl}/addGraduationDocument`,
                  studentData
               )
               .then((res) => {
                  self.showConfirm = false;
                  self.show = false;
                  self.message = "تم حفظ البيانات";
                  self.snackbarSuccess = true;
               })
               .catch((e) => {
                  console.log(e);
                  self.message = "حدث خطأ في خزن البيانات";
                  self.snackbar = true;
               });
         } else {
            self.show = false;
            self.showConfirm = false;
            self.message = "حدث خطأ تأكد من المعلومات";
            self.snackbar = true;
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
                  course: lessonDetails.course,
               };
            }
         }
      },

      checkForSecondTerm(fourthMarks) {
         let secondExam = fourthMarks.find(
            (degree) =>
               degree.markType == "custom2" || degree.markType == "final2"
         );

         if (secondExam != undefined) {
            return 2;
         } else {
            return 1;
         }
      },

      checkForSecondTermsLevel(studentDegree) {
         let secondExam = studentDegree.find((degree) => degree.phase == 2);
         if (secondExam != undefined) {
            return 2;
         } else {
            return 1;
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
            console.log(self.backupMarks);
            if (
               self.backupMarks.find(
                  (mark) => mark.collageNumber == collageNumber
               )
            ) {
               let marks = self.backupMarks.map((mark) => {
                  return {
                     degree: mark.mark,
                     lessonName: mark.lessonName,
                     credit: mark.units,
                     markType: mark.phase == 1 ? "custom" : "custom2",
                  };
               });
               return marks;
            }

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
         return Chosendate.toLocaleDateString("ar-IQ");
      },
      convertDateEN: function(date) {
         let Chosendate = new Date(date);
         return Chosendate.toLocaleDateString("en-US");
      },
      genderCheck: function(gender) {
         if (gender == "ذكر") {
            return "ناجح";
         } else {
            return "ناجحة";
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
