<template>
    <div>
        <transition>
            <div v-show="show" class="menu">  
                <ul v-show="$route.name != 'home'">
                    <li @click="openView('symbolTable')" v-show="$route.name != 'symbolTable'"><span class="material-icons" style="color: #2DACA1">backup_table</span>Tabla de Símbolos</li>
                    <li @click="openView('ladder')" v-show="$route.name != 'ladder'"><span class="material-icons" style="color: #2DACA1">description</span>Bloque de Programa</li>
                    <li @click="pushHome"><span class="material-icons" style="color: #2DACA1">home</span>Inicio</li>
                    <li @click="openPanelRun()" v-show="!run"><span class="material-icons" style="color: #6BB464">play_arrow</span>Simulación</li>
                    <li @click="resetNetworks()" v-show="$route.name == 'ladder'"><span class="material-icons" style="color: #A03C3C">delete</span>Vaciar Networks</li>
                    <li @click="generateFile()"><span class="material-icons" style="color: #428DD4">download</span>Descargar Archivo</li>
                </ul>
                <ul v-show="$route.name == 'home'">
                    <li><span class="material-icons" style="color: #2DACA1">login</span>Iniciar Sesión</li>
                </ul>
            </div>
        </transition>
        <alert v-if="alert" @close="alert = false" @check="resetNetworks(true)">¿Desea vaciar todos los networks?</alert>
    </div>
</template>
<script>
import { computed, ref } from '@vue/runtime-core'
import {useStore} from "vuex"
import Alert from "./alert/Alert.vue"
import { useRouter } from 'vue-router'
export default {
    props: {show: Boolean},
    components: {Alert},
    emits: ['close'],
    setup(props,{emit}) {
        const store = useStore()
        const router = useRouter()
        const alert = ref(false)
        const pushHome = () => {
            router.push({name: 'home'})
            emit("close")
        }

        const openView = (name) => {
            router.replace({name})
            emit("close")
        }

        const run = computed(() => store.state.run.panelRun)

        const openPanelRun = () => {
            emit("close")
            store.commit("setPanelRun", true)
        }

        const resetNetworks = (confirm = false) => {
            if(!confirm){
                alert.value = true
                emit("close")
            } else {
                alert.value = false
                store.dispatch("resetNetworks")
            }
        }

        const generateFile = () =>{
            store.dispatch("generateS7File")
        }

        return{openPanelRun, run, resetNetworks, generateFile, pushHome, openView, alert}
    }
}
</script>
<style scoped>

.menu{
    background-color: rgb(24, 99, 99);
    background: linear-gradient(to bottom, rgb(24, 99, 99) -20%, rgb(18, 71, 71) 100%);
    width: 200px;
    
}


.left-menu .menu{
    width: 150px;
    overflow: hidden;
}
.lateral-menu .menu{
    height: calc(var(--vh) - 50px);
    right: 0;
    top: 50px;
    position: fixed;
    z-index: 10;
}
.left-menu .menu{
    height: var(--vh);
}

.lateral-menu .v-enter-to.menu{
    right: 0;
}
.v-enter-active.menu{
    position: fixed;
    transition: all 0.2s;
    right: -200px;
}
.lateral-menu .v-leave-to.menu{
    right: -200px;
}
.v-enter-active.menu{
    transition: all 0.2s;
    right: -200px;
}
.v-leave-active{
    transition: all 0.2s;
    right: 0;
}

li{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    color: rgb(202, 202, 202);
    font-size: 20px;
    user-select: none;
    cursor: pointer;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}
li:hover{
    background: rgb(8, 88, 88);
}

li span{
    font-size: 30px;
    margin-right: 4px;
}

.left-menu li{
    flex-direction: column;
    padding: 10px;
    text-align: center;
    font-size: 17px;
    color: rgba(199, 214, 212, 0.897);
}
.left-menu li span{
    font-size: 50px;
    margin-bottom: 5px;
}
</style>