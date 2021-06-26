import { createRouter, createWebHistory } from 'vue-router'
import Project from "@/views/Project.vue"
import Ladder from "@/views/project/Ladder.vue"
import SymbolTable from "@/views/project/SymbolTable.vue"
import Home from "@/views/Home.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/proyectos/:name",
    component: Project,
    children: [
      {
        name: "ladder",
        path: "",
        component: Ladder
      },
      {
        name: "symbol",
        path: "",
        component: SymbolTable
      },
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    redirect: {name: "home"},
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
