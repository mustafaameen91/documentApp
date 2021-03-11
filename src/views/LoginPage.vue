<template>
   <div>
      <v-row align-content="center">
         <v-col style="text-align:center">
            <img src="./../assets/logo.png" width="600px" />
         </v-col>
      </v-row>

      <v-row align-content="center">
         <v-col style="text-align:center">
            <h2>تسجيل الدخول</h2>
         </v-col>
      </v-row>

      <div style="width:400px;margin:50px auto">
         <v-text-field
            placeholder="اسم المستخدم"
            solo
            v-model="userName"
         ></v-text-field>
         <v-text-field
            v-on:keyup.enter="onEnterClick"
            placeholder="كلمة المرور"
            solo
            v-model="password"
         ></v-text-field>
         <div style="margin:0px auto;">
            <v-btn color="success" style="width:100%" @click="login">
               تسجيل
            </v-btn>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   data: () => ({
      userName: "",
      password: "",
   }),
   created() {},
   methods: {
      login() {
         this.$store
            .dispatch("login", {
               name: this.userName,
               password: this.password,
            })
            .then(() => {
               this.$router.push("/");
            })
            .catch(() => {});
      },
      onEnterClick() {
         this.login();
      },
   },
};
</script>

<style lang="scss" scoped></style>
