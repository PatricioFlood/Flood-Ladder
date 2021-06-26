<template>
    <div class="home">
        <div class="project" @click="newProject">Nuevo Proyecto</div>
        <div v-show="localProjects.length>0">
            <h2 class="scratchs">Borradores</h2>
            <div class="localProjects">
                <div class="project" v-for="project of localProjects" :key="project.date" @click="openProject(project.name)">{{project.name.replace("-", " ")}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup() {
        const router = useRouter()
        const store = useStore()
        const localProjects = store.getters.localProjects
        const newProject = async () => {
            const name = "Proyecto-"
            var num = 1
            while(localProjects.find(obj => obj.name == name + num)){
                num++
            }
            await router.push({name: "ladder", params: {name: name + num}})
        }
        const openProject = async (name) => {
            router.push({name: "ladder", params: {name}})
        }
        document.title = "Flood Ladder"
        return { localProjects, newProject, openProject}
    },
}
</script>
<style scoped>
    .home{
        padding: 10px;
    }
    .project{
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(211, 211, 211);
        border-radius: 15%;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    .project:hover, .project:active{
        opacity: 0.8;
    }
    .localProjects{
        display: flex;
    }
    .localProjects .project{
        margin-right: 10px;
    }
    .scratchs{
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>