<template>
    <div class="home" @contextmenu.prevent>
        <div class="project" @click="newProject">Nuevo Proyecto</div>
        <div v-show="localProjects.length>0">
            <h2 class="scratchs">Borradores</h2>
            <div class="localProjects"  id="localProjects">
                <div class="project" v-for="project of localProjects" :key="project.date" @click="openProject(project.name)"
                @contextmenu="openSubMenu($event, project.name)">{{project.name.replace("-", " ")}}
                <p class="date">{{getDate(project.date)}}</p>
                </div>
                <div class="subMenu" v-if="subMenu">
                    <ul>
                        <li @click="deleteProject()"><span class="material-icons" style="color: #D44242">delete</span>Eliminar</li>
                        <li @click="renameProject()"><span class="material-icons" style="color: #88867D">edit</span>Renombrar</li>
                    </ul>
                </div>
                <div class="subMenuBack" v-if="subMenu" @click="subMenu = false" @contextmenu="subMenu = false"/>
                <alert v-if="alert" @close="alert = false" @check="deleteProject(true)">¿Eliminar el proyecto: "{{$store.state.name.replace('-', ' ')}}"?</alert>
                <prompt v-if="prompt.active" @close="prompt.active = false" @check="renameProject" :prevInput="$store.state.name.replace('-', ' ')">{{prompt.slot}}</prompt>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Alert from "@/components/alert/Alert.vue"
import Prompt from "@/components/alert/Prompt.vue"
export default {
    name: "home",
    components: {Alert, Prompt},
    setup() {
        const alert = ref(false)
        const prompt = reactive({
            slot: "Renombrar",
            active: false
        })
        const router = useRouter()
        const store = useStore()
        var localProjects = ref(store.getters.localProjects)
        const newProject = async () => {
            const name = "Proyecto-"
            var num = 1
            while(localProjects.value.find(obj => obj.name == name + num)){
                num++
            }
            await router.push({name: "ladder", params: {name: name + num}})
        }
        const openProject = async (name) => {
            router.push({name: "ladder", params: {name}})
        }
        const openSubMenu = (e, name) => {
            subMenu.value = true
            document.getElementById("localProjects").style.setProperty('--x', (e.clientX>30?e.clientX-30:e.clientX) + 'px'); 
            document.getElementById("localProjects").style.setProperty('--y', (e.clientY -30) + 'px');
            store.commit("setProjectName", name)
        }
        const deleteProject = (confirm = false) => {
            if(!confirm){
                alert.value = true
            } else {
                alert.value = false
                store.dispatch("removeProject")
                localProjects.value = store.getters.localProjects
            }
            subMenu.value = false
        }
        const renameProject = (name = "") => {
            if(!name){
                prompt.slot = "Renombrar"
                prompt.active = true
            } else {
                if(localProjects.value.find(obj => obj.name == name.replace(" ", "-")) == undefined){
                    prompt.active = false
                    store.dispatch("renameProject", name)
                    localProjects.value = store.getters.localProjects
                } else {
                    prompt.slot = "El nombre ya existe"
                }
            }
            subMenu.value = false
        }
        const getDate = (date) => {
            const dateNow = new Date()
            date = new Date(date)
            if(date.getDate() == dateNow.getDate() && date.getMonth() == dateNow.getMonth() && date.getFullYear() == dateNow.getFullYear())
                return (date.getHours()>9?"":"0") + date.getHours() + ":" + (date.getMinutes()>9?"":"0") + date.getMinutes() + "hs" 

                const day = date.getDate()
                const month = parseInt(date.getMonth())+1
                const year = date.getFullYear()
                
            return (day>9?"":"0") + day + "/" + (month>9?"":"0") + month + "/" + year
        }
        const subMenu = ref(false)
        document.title = "Flood Ladder"
        return { localProjects, newProject, openProject, subMenu, openSubMenu, deleteProject, alert, prompt, renameProject, getDate}
    },
}
</script>
<style scoped>
    .home{
        padding: 20px;
    }
    .project{
        width: 100px;
        height: 100px;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        background: rgb(211, 211, 211);
        border-radius: 15%;
        padding-top: 10px;
        padding-bottom: 10px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        position: relative;
    }
    .project .date{
        position: absolute;
        bottom: 5px;
        font-size: 12px;
        color: rgb(100, 100, 100);
        text-align: center;
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
        margin-top: 20px;
        margin-bottom: 20px;
        color: rgb(162, 207, 198);
        font-size: 20px;
        width: 100%;
        padding: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .subMenu{
        position: absolute;
        top: var(--y);
        left: var(--x);
        width: 150px;
        background: rgb(171, 221, 214);
        border-radius: 1%;
        box-shadow: 0 0 5px black;
        z-index: 10;
    }
    .subMenuBack{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0);
        z-index: 2
    }
    li{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        color: rgb(71, 71, 71);
        font-size: 18px;
        user-select: none;
        cursor: pointer
    }
    li:hover{
        background: rgb(88, 190, 190);
        color: rgb(211, 211, 211);
    }

    li span{
        font-size: 23px;
        margin-right: 4px;
    }
</style>