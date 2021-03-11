import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AddMaster from "../views/AddMaster.vue";
import EditCollageId from "../views/editCollageId.vue";
import ComparePage from "../views/comparePage.vue";
import CompareDental from "../views/compareDental.vue";
import LoginPage from "../views/LoginPage.vue";
import Average from "../views/Average.vue";
import AverageDental from "../views/AverageDental.vue";
import MasterInfo from "../views/MasterInfo.vue";
import StudentDocument from "../views/studentDocument.vue";
import RegisterDocument from "../views/RegisterDocument.vue";
import StudentDocumentDent from "../views/StudentDocumentDent.vue";
import DocumentInfo from "../views/DocumentInfo.vue";
import Summer from "../views/Summer.vue";
import GraduationDocument from "../views/graduationDocument.vue";
import GradInfo from "../views/gradInfo.vue";

Vue.use(VueRouter);

const routes = [
   {
      path: "/",
      name: "Home",
      component: Home,
   },
   {
      path: "/add-master",
      name: "AddMaster",
      component: AddMaster,
   },
   {
      path: "/student-document",
      name: "StudentDocument",
      component: StudentDocument,
   },
   {
      path: "/graduation",
      name: "GraduationDocument",
      component: GraduationDocument,
   },
   {
      path: "/summer",
      name: "Summer",
      component: Summer,
   },
   {
      path: "/grad",
      name: "GradInfo",
      component: GradInfo,
   },
   {
      path: "/register-document",
      name: "RegisterDocument",
      component: RegisterDocument,
   },
   {
      path: "/document-info",
      name: "DocumentInfo",
      component: DocumentInfo,
   },
   {
      path: "/compare-dental",
      name: "CompareDental",
      component: CompareDental,
   },
   {
      path: "/student-dent",
      name: "StudentDocumentDent",
      component: StudentDocumentDent,
   },
   {
      path: "/average-dental",
      name: "AverageDental",
      component: AverageDental,
   },
   {
      path: "/edit-collage",
      name: "EditCollageId",
      component: EditCollageId,
   },
   {
      path: "/compare",
      name: "ComparePage",
      component: ComparePage,
   },
   {
      path: "/master-info",
      name: "MasterInfo",
      component: MasterInfo,
   },
   {
      path: "/average",
      name: "Average",
      component: Average,
   },
   {
      path: "/login",
      name: "LoginPage",
      component: LoginPage,
   },
   {
      path: "/about",
      name: "About",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
         import(/* webpackChunkName: "about" */ "../views/About.vue"),
   },
];

const router = new VueRouter({
   mode: process.env.IS_ELECTRON ? "hash" : "history",
   base: process.env.BASE_URL,
   routes,
});

export default router;
