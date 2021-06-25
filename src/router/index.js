import { createRouter, createWebHistory } from 'vue-router'
import Project from "@/views/project/Project.vue"
const routes = [
  {
    patch: "/",
    name: "home",
    component: Project
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
