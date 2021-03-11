<template>
   <div :key="keyComponent">
      <div v-if="showAllPage">
         <v-app id="inspire">
            <v-navigation-drawer
               class="pt-4 side-menu"
               mini-variant
               app
               right
               v-if="this.$store.state.user"
            >
               <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9 "
                        :class="homeRoute ? 'avatar-route' : ''"
                        v-bind="attrs"
                        style="margin-top:10px"
                        v-on="on"
                        @click="gotoHome()"
                     >
                        <!-- <v-icon>fa-home</v-icon> -->

                        <img src="./assets/home.svg" />
                     </v-avatar>
                  </template>
                  <span>الرئيسية</span>
               </v-tooltip>

               <v-tooltip left v-if="user.perv != -1">
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        :class="aboutRoute ? 'avatar-route' : ''"
                        v-bind="attrs"
                        v-on="on"
                        @click="gotoAbout()"
                     >
                        <!-- <v-icon>fa-user-graduate</v-icon> -->

                        <img src="./assets/certificate.svg" />
                     </v-avatar>
                  </template>
                  <span>انشاء وثيقة</span>
               </v-tooltip>

               <v-tooltip left v-if="user.perv == -1">
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        :class="aboutRoute ? 'avatar-route' : ''"
                        v-bind="attrs"
                        v-on="on"
                        @click="gotoAbout()"
                     >
                        <!-- <v-icon>fa-user-graduate</v-icon> -->

                        <img src="./assets/certificate.svg" />
                     </v-avatar>
                  </template>
                  <span>توليد تأييد</span>
               </v-tooltip>

               <v-tooltip left v-if="user.perv == -1">
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        :class="grad ? 'avatar-route' : ''"
                        v-bind="attrs"
                        v-on="on"
                        @click="gotoGra()"
                     >
                        <!-- <v-icon>fa-user-graduate</v-icon> -->

                        <img src="./assets/cir.svg" />
                     </v-avatar>
                  </template>
                  <span>توليد وثيقة</span>
               </v-tooltip>

               <v-tooltip left v-if="user.perv != -1">
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        :class="addMarks ? 'avatar-route' : ''"
                        v-bind="attrs"
                        v-on="on"
                        @click="gotoAddMaster()"
                     >
                        <!-- <v-icon>fa-home</v-icon> -->
                        <img src="./assets/pencil.svg" />
                     </v-avatar>
                  </template>
                  <span>درجات الطلبة</span>
               </v-tooltip>

               <v-tooltip left v-if="user.perv != -1">
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        :class="summer ? 'avatar-route' : ''"
                        v-bind="attrs"
                        v-on="on"
                        @click="gotoSummer()"
                     >
                        <!-- <v-icon>fa-home</v-icon> -->
                        <img src="./assets/cir.svg" />
                     </v-avatar>
                  </template>
                  <span>التدريب الصيفي</span>
               </v-tooltip>

               <v-tooltip left v-if="user.perv != -1">
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        :class="compare ? 'avatar-route' : ''"
                        v-bind="attrs"
                        v-on="on"
                        @click="gotoCompare()"
                     >
                        <!-- <v-icon>fa-home</v-icon> -->
                        <img src="./assets/browser-2.svg" />
                     </v-avatar>
                  </template>
                  <span>مقارنة المراحل</span>
               </v-tooltip>

               <v-tooltip left v-if="user.perv != -1">
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        :class="average ? 'avatar-route' : ''"
                        v-bind="attrs"
                        v-on="on"
                        @click="gotoAverage()"
                     >
                        <!-- <v-icon>fa-home</v-icon> -->
                        <img src="./assets/meeting.svg" />
                     </v-avatar>
                  </template>
                  <span>المعدلات</span>
               </v-tooltip>
               <v-divider></v-divider>
               <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        v-bind="attrs"
                        style="margin-top:10px"
                        v-on="on"
                        @click="checkForLocation()"
                     >
                        <img src="./assets/homeLocation.svg" v-if="fromHome" />
                        <img src="./assets/uni.svg" v-else />
                     </v-avatar>
                     <h5
                        style="text-align:center;color:#1F80D3"
                        v-if="fromHome"
                     >
                        منزل
                     </h5>
                     <h5 style="text-align:center;color:#1F80D3" v-else>
                        جامعة
                     </h5>
                  </template>

                  <span>من المنزل / من الجامعة</span>
               </v-tooltip>
               <v-divider></v-divider>
               <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                     <v-avatar
                        :size="36"
                        class="d-block text-center mx-auto mb-9"
                        v-bind="attrs"
                        style="margin-top:10px"
                        v-on="on"
                        @click="logOut()"
                     >
                        <img src="./assets/logout.svg" />
                     </v-avatar>
                  </template>
                  <span>تسجيل خروج</span>
               </v-tooltip>
            </v-navigation-drawer>

            <v-main>
               <router-view></router-view>
            </v-main>
         </v-app>
      </div>
      <div v-else>
         <v-app style="text-align:center;padding-top:50px">
            <h2>تم ايقاف عمل البرنامج</h2>
            <h2>الرجاء التأكد من تحديث البرنامج او التأكد من اتصال الانترنت</h2>
            <h3>
               الاصدار الحالي : {{ VersionOfApp.appVersion }} - الاصدار المنصب
               على الحاسبة {{ currentVersion }}
            </h3>
         </v-app>
      </div>
   </div>
</template>

<script>
export default {
   name: "App",
   data: () => ({
      homeRoute: false,
      average: false,
      aboutRoute: false,
      addMarks: false,
      keyComponent: 1,
      summer: false,
      compare: false,
      grad: false,
      user: {},
      userLogin: null,
      showAllPage: false,
      currentVersion: "1.3.7",
      VersionOfApp: "",
      fromHome: true,
   }),
   created() {
      let self = this;

      this.$store.dispatch("fromHomeUpdate", this.fromHome).then(() => {});

      this.$store.dispatch("getUserDate").then(() => {
         this.showAllPage = false;

         if (this.$store.state.user != null) {
            this.user = this.$store.state.user;

            this.$router.push("/").catch((e) => {});
            this.$http
               .get(`${this.$store.state.apiUrl}/appName/document`)
               .then((res) => {
                  console.log(res.data);

                  if (res.data.appVersion == this.currentVersion) {
                     this.showAllPage = true;
                  } else {
                     this.VersionOfApp = res.data;
                     this.showAllPage = false;
                  }
               });
         } else {
            this.showAllPage = true;
            this.$router.push("/login").catch((e) => {});
         }
      });
      this.homeRoute = true;
      this.average = false;
      this.aboutRoute = false;
      this.addMarks = false;
      this.grad = false;
      this.compare = false;
      let phaseData = {
         phaseOne: "٢٠٢٠/١٠/٢٢",
         phaseTwo: "٢٠٢٠/١١/٢٦",
      };

      localStorage.setItem("phaseDate", JSON.stringify(phaseData));
   },
   methods: {
      checkForLocation() {
         this.fromHome = !this.fromHome;
         this.$store.dispatch("fromHomeUpdate", this.fromHome).then(() => {
            this.keyComponent += 1;
            console.log(this.$store.state.apiUrl);
         });
      },
      gotoHome() {
         this.homeRoute = true;
         this.aboutRoute = false;
         this.addMarks = false;
         this.average = false;
         this.grad = false;
         this.compare = false;
         this.summer = false;
         this.$router.push("/").catch((e) => {});
      },
      gotoSummer() {
         this.homeRoute = false;
         this.aboutRoute = false;
         this.addMarks = false;
         this.average = false;
         this.grad = false;
         this.compare = false;
         this.summer = true;
         this.$router.push("/summer").catch((e) => {});
      },
      gotoAverage() {
         let self = this;
         this.homeRoute = false;
         this.aboutRoute = false;
         this.addMarks = false;
         this.average = true;
         this.grad = false;
         this.compare = false;
         this.summer = false;
         if (self.$store.state.user.perv == 30) {
            this.$router.push("/average-dental").catch((e) => {});
         } else {
            this.$router.push("/average").catch((e) => {});
         }
      },
      gotoAbout() {
         let self = this;
         if (self.$store.state.user.perv != -1) {
            this.homeRoute = false;
            this.aboutRoute = true;
            this.average = false;
            this.addMarks = false;
            this.grad = false;
            this.compare = false;
            this.summer = false;
            if (self.$store.state.user.perv == 30) {
               this.$router.push("/student-dent").catch((e) => {});
            } else {
               this.$router.push("/student-document").catch((e) => {});
            }
         } else {
            this.homeRoute = false;
            this.aboutRoute = true;
            this.average = false;
            this.grad = false;
            this.addMarks = false;
            this.summer = false;
            this.compare = false;
            this.$router.push("/register-document").catch((e) => {});
         }
      },
      gotoGra() {
         let self = this;
         if (self.$store.state.user.perv == -1) {
            this.homeRoute = false;
            this.aboutRoute = false;
            this.average = false;
            this.addMarks = false;
            this.grad = true;
            this.summer = false;
            this.compare = false;
            this.$router.push("/graduation").catch((e) => {});
         }
      },
      gotoAddMaster() {
         let self = this;
         if (self.$store.state.user.perv != -1) {
            this.homeRoute = false;
            this.aboutRoute = false;
            this.average = false;
            this.grad = false;
            this.addMarks = true;
            this.summer = false;
            this.compare = false;
            this.$router.push("/add-master").catch((e) => {});
         }
      },
      gotoCompare() {
         let self = this;
         if (self.$store.state.user.perv != -1) {
            this.homeRoute = false;
            this.aboutRoute = false;
            this.addMarks = false;
            this.average = false;
            this.grad = false;
            this.compare = true;
            this.summer = false;
            if (self.$store.state.user.perv == 30) {
               this.$router.push("/compare-dental").catch((e) => {});
            } else {
               this.$router.push("/compare").catch((e) => {});
            }
         }
      },
      logOut() {
         this.$store.dispatch("logout");
      },
   },
};
</script>
<style lang="scss">
#inspire {
   background: none;
}

h1,
h2,
h3,
h4,
h5,
p,
strong,
div {
   color: var(--v-accent-base);
}

.v-main__wrap {
   margin: 10px;
}
.side-menu {
   border-radius: 0px;
   background: var(--v-background-base) !important;
   box-shadow: -2px -2px 3px var(--v-secondary-base),
      2px 2px 3px var(--v-background-base);
}
.avatar-route {
   border-radius: 3px !important;
   background: var(--v-background-base);
   box-shadow: inset 2px 2px 3px var(--v-secondary-base),
      inset -2px -2px 3px var(--v-secondary-base);
}

.v-application--is-rtl .v-stepper--vertical .v-stepper__content {
   margin: 0px 0px -18px 0px !important;
}
.v-text-field.v-text-field--enclosed {
   margin: 5px !important;
}
.v-stepper--vertical .v-stepper__content {
   padding: 10px 20px 18px 20px !important;
}
.v-stepper__header {
   box-shadow: none !important;
}
.theme--light.v-stepper {
   background: var(--v-background-base) !important;
}
.v-stepper {
   box-shadow: 5px 5px 20px #d9d9d9, -5px -5px 20px #ffffff !important;
   border-radius: 20px !important;
}
.v-snack__content {
   color: var(--v-background-base) !important;
}

@media print {
   @page {
      margin: 0px !important;
   }
   body {
      -webkit-print-color-adjust: exact !important;
      -webkit-filter: opacity(1) !important;
   }
   table {
      page-break-inside: auto;
   }
   .v-main {
      padding: 0px !important;
   }
   .v-main__wrap {
      margin: 0 !important;
      padding: 0px !important;
      width: 100vw !important;
   }
   tr {
      page-break-inside: auto;
   }
   table {
      display: table !important;
      border-spacing: 2px;
      margin: 0 !important;
      font-size: 12 !important;
   }
   table th {
      position: relative !important;

      z-index: 5;
      background: #fff !important;
   }
   .theme--light.v-navigation-drawer {
      display: none !important;
   }
   .title-section h2 {
      padding: 3px !important;
      border-radius: 10px !important;
      background: #ffffff !important;
      box-shadow: none !important;
   }
   .not-print,
   .side-menu {
      display: none !important;
   }
}
</style>
