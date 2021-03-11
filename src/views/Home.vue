<template>
   <div class="home">
      <v-row align-content="center">
         <v-col style="text-align:center">
            <img src="./../assets/logo.png" width="600px" />
         </v-col>
      </v-row>
      <v-row align-content="center">
         <v-col style="text-align:center;width:300px">
            <canvas id="bar-chart"></canvas>
         </v-col>
      </v-row>
   </div>
</template>

<script>
// @ is an alias to /src
const Chart = require("chart.js");
export default {
   name: "Home",
   data: () => ({
      students: [],
   }),
   created() {
      let self = this;
      let user = this.$store.state.user;
      console.log(user);
      if (user.perv != -1) {
         if (user.perv == 30) {
            this.$http
               .get(
                  `${this.$store.state.oldUrl}/levels?sectionId=${this.$store.state.user.perv}&level=5&year=${this.$store.state.user.currentYear}`
               )
               .then((res) => {
                  console.log(res.data);
                  if (res.data.length == 0) {
                     this.$store.state.levelType = 1;
                  } else {
                     this.$store.state.levelType = res.data[0].type * 1;
                  }
               })
               .catch((e) => {
                  console.log(e);
               });

            this.$http
               .get(
                  `${this.$store.state.oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=5&status=1&page=1&limit=1000`
               )
               .then((res) => {
                  this.students = res.data;
                  let female = (function() {
                     let data = res.data
                        .filter((student) => {
                           return student.sex == "انثى";
                        })
                        .catch((e) => {
                           console.log(e);
                        });

                     return data.length;
                  })();

                  let male = (function() {
                     let data = res.data.filter((student) => {
                        return student.sex == "ذكر";
                     });

                     return data.length;
                  })();

                  let firstClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.class == "A";
                     });

                     return data.length;
                  })();

                  let secondClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.class == "B";
                     });

                     return data.length;
                  })();

                  let thirdClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.type == "صباحي";
                     });

                     return data.length;
                  })();

                  let fourthClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.type == "مسائي";
                     });

                     return data.length;
                  })();

                  this.barChart(
                     document.getElementById("bar-chart"),
                     [
                        "اناث",
                        "ذكور",
                        "مجموع الطلبة",
                        "شعبة A",
                        "شعبة B",
                        "صباحي",
                        "مسائي",
                     ],
                     [
                        female,
                        male,
                        res.data.length,
                        firstClass,
                        secondClass,
                        thirdClass,
                        fourthClass,
                     ]
                  );
               });
         } else {
            this.$http
               .get(
                  `${this.$store.state.oldUrl}/levels?sectionId=${this.$store.state.user.perv}&level=4&year=${this.$store.state.user.currentYear}`
               )
               .then((res) => {
                  console.log(res.data);
                  if (res.data.length == 0) {
                     this.$store.state.levelType = 1;
                  } else {
                     this.$store.state.levelType = res.data[0].type * 1;
                  }
               })
               .catch((e) => {
                  console.log(e);
               });

            this.$http
               .get(
                  `${this.$store.state.oldUrl}/studentInfo?sectionId=${this.$store.state.user.perv}&level=4&status=1&page=1&limit=1000`
               )
               .then((res) => {
                  this.students = res.data;
                  let female = (function() {
                     let data = res.data.filter((student) => {
                        return student.sex == "انثى";
                     });

                     return data.length;
                  })();

                  let male = (function() {
                     let data = res.data.filter((student) => {
                        return student.sex == "ذكر";
                     });

                     return data.length;
                  })();

                  let firstClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.class == "A";
                     });

                     return data.length;
                  })();

                  let secondClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.class == "B";
                     });

                     return data.length;
                  })();

                  let thirdClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.type == "صباحي";
                     });

                     return data.length;
                  })();

                  let fourthClass = (function() {
                     let data = res.data.filter((student) => {
                        return student.type == "مسائي";
                     });

                     return data.length;
                  })();

                  this.barChart(
                     document.getElementById("bar-chart"),
                     [
                        "اناث",
                        "ذكور",
                        "مجموع الطلبة",
                        "شعبة A",
                        "شعبة B",
                        "صباحي",
                        "مسائي",
                     ],
                     [
                        female,
                        male,
                        res.data.length,
                        firstClass,
                        secondClass,
                        thirdClass,
                        fourthClass,
                     ]
                  );
               });
         }
      }
   },
   methods: {
      barChart(canvasId, labels, data) {
         canvasId.style.width = 300;
         new Chart(canvasId, {
            type: "bar",
            data: {
               labels: labels,
               datasets: [
                  {
                     label: "طالب",
                     backgroundColor: [
                        "#449DD1",
                        "#396581",
                        "#96BC0C",
                        "#0F3747",
                        "#B8D63A",
                        "#22C6FF",
                        "#96BC09",
                        "#c45850",
                     ],
                     data: data,
                  },
               ],
            },
            options: {
               legend: { display: false },
               title: {
                  display: true,
                  text: "احصائيات الطلبة",
               },
            },
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
#bar-chart {
   width: 100% !important;
   height: 600px !important;
   display: inline-block;
}
</style>
