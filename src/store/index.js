import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

// apiUrl: "http://10.0.0.254:5555/api",
//oldUrl: "http://10.0.0.254:8000/api",

// apiUrl: "http://176.105.237.86:5555/api",
//oldUrl: "http://176.105.237.86:8000/api",

// apiUrl: "http://localhost:5555/api",
//oldUrl: "http://localhost:8000/api",

export default new Vuex.Store({
   state: {
      apiUrl: null,
      oldUrl: null,
      fromHome: true,
      studentsMaster: [],
      printStudent: null,
      printStudentDoc: null,
      levelType: 0,
      masterDetails: null,
      user: null,
   },
   mutations: {
      SET_STUDENTS(state, students) {
         state.studentsMaster = students;
      },
      SET_USER_DATA(state, userData) {
         state.user = userData;
         localStorage.setItem("user", JSON.stringify(userData));
      },
      SET_FROM_HOME(state, apis) {
         state.apiUrl = apis.apiUrl;
         state.oldUrl = apis.oldUrl;
      },
      MASTER_DETAILS(state, masterDetail) {
         state.masterDetails = masterDetail;
      },
      GET_USER_DATA(state, userData) {
         state.user = userData;
         localStorage.setItem("user", JSON.stringify(userData));
      },
      STUDENT_FOR_PRINT(state, student) {
         state.printStudent = student;
      },
      STUDENT_FOR_PRINT_DOC(state, student) {
         state.printStudentDoc = student;
      },
      CLEAR_DATA(state) {
         localStorage.removeItem("user");
         location.reload();
      },
   },
   actions: {
      loadStudentMaster({ commit }, masterId) {
         axios
            .get(`${this.state.apiUrl}/studentMaster/${masterId}`)
            .then((response) => {
               console.log(response.data);
               commit("SET_STUDENTS", response.data);
            });
      },
      fromHomeUpdate({ commit }, fromHome) {
         console.log(fromHome);
         if (fromHome) {
            let apis = {
               apiUrl: "http://176.105.237.86:5555/api",
               oldUrl: "http://176.105.237.86:8000/api",
            };
            commit("SET_FROM_HOME", apis);
         } else {
            let apis = {
               apiUrl: "http://10.0.0.254:5555/api",
               oldUrl: "http://10.0.0.254:8000/api",
            };
            commit("SET_FROM_HOME", apis);
         }
      },
      setStudentForPrint({ commit }, student) {
         commit("STUDENT_FOR_PRINT", student);
      },
      setStudentForPrintDoc({ commit }, student) {
         commit("STUDENT_FOR_PRINT_DOC", student);
      },
      login({ commit }, credentials) {
         return axios
            .post(`${this.state.oldUrl}/login`, credentials)
            .then((response) => {
               console.log(response.data);
               commit("SET_USER_DATA", {
                  password: credentials.password,
                  ...response.data,
               });
            });
      },
      getUserDate({ commit }) {
         let user = localStorage.getItem("user");
         if (user) {
            let data = JSON.parse(user);
            return axios
               .post(`${this.state.oldUrl}/login`, {
                  name: data.name,
                  password: data.password,
               })
               .then((response) => {
                  console.log(response.data);
                  commit("GET_USER_DATA", {
                     password: data.password,
                     ...response.data,
                  });
               });
         }
      },
      getMasterDetailsById({ commit }, master) {
         return axios
            .get(`${this.state.apiUrl}/masterInformation/${master.idMaster}`)
            .then((response) => {
               console.log(response.data);
               commit("MASTER_DETAILS", {
                  ...response.data,
                  ...master,
               });
            });
      },
      logout({ commit }) {
         commit("CLEAR_DATA");
      },
   },
   modules: {},
   getters: {
      studentsMaster: (state) => {
         return state.studentsMaster;
      },
   },
});
