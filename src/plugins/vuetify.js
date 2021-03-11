import Vue from "vue";
import Vuetify from "vuetify/lib";
import ar from "vuetify/es5/locale/ar";

Vue.use(Vuetify);

export default new Vuetify({
   theme: {
      dark: false,
      options: {
         customProperties: true,
      },
      themes: {
         light: {
            primary: "#145374",
            secondary: "#d6e0f0",
            background: "#fff",
            accent: "#006a71",
            error: "#ff6b6b",
            info: "#2196F3",
            stepper: "#ebffeb",
            success: "#1b998b",
            warning: "#ffe66d",
         },
         dark: {
            primary: "#246a73",
            secondary: "#368f8b",
            accent: "#f3dfc1",
            error: "#FF5252",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FFC107",
         },
      },
   },
   icons: {
      iconfont: "fa",
   },
   lang: {
      locales: { ar },
      current: "ar",
   },
   rtl: true,
});
