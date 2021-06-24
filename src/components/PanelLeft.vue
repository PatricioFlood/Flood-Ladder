<template>
    <div class="panel-left">
        <ul>
            <li @click="changeView('symbol-table')" v-show="view != 'symbol-table'"><span class="material-icons" style="color: #2DACA1">backup_table</span>Tabla de Símbolos</li>
            <li @click="changeView('ladder')" v-show="view != 'ladder'"><span class="material-icons" style="color: #2DACA1">description</span>Bloque de Programa</li>
            <li @click="openPanelRun()" v-show="!run"><span class="material-icons" style="color: #6BB464">play_arrow</span>Simulación</li>
            <li @click="resetNetworks()" v-show="view == 'ladder'"><span class="material-icons" style="color: #A03C3C">delete</span>Vaciar Networks</li>
            <li @click="generateFile()"><span class="material-icons" style="color: #428DD4">download</span>Descargar Archivo</li>
        </ul>
        <alert v-if="alert" @close="alert = false" @check="resetNetworks(true)">¿Desea vaciar todos los networks?</alert>
    </div>
</template>
<script>
import Alert from "./alert/alert.vue"
import {computed, ref} from '@vue/runtime-core'
import {useStore} from "vuex"
export default {
    components: {Alert},
    setup() {
        const alert = ref(false)
        const store = useStore()
        const view = computed(() => store.state.currentView)
        const run = computed(() => store.state.run.panelRun)
         const openPanelRun = () => {
            store.commit("setPanelRun", true)
        }
        const resetNetworks = (confirm = false) => {
            if(!confirm){
                alert.value = true
            } else {
                alert.value = false
                store.dispatch("resetNetworks")
            }
        }
        const changeView = (view) => {
            store.commit("setView", view)
        }

        const generateFile = () =>{
            store.dispatch("generateS7File")
        }

        return{changeView, view, run, openPanelRun, resetNetworks, alert, generateFile}
    }
}
</script>
<style scoped>
.panel-left {
        width: 150px;
        flex-shrink: 0;
        height: var(--vh);
        background-color: rgb(24, 121, 121);
        margin-right: 2px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }
li{
    display: flex;
    flex-direction: column;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    line-height: 1.3;
    color: rgb(203, 228, 226);
    align-items: center;
    font-size: 18px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    user-select: none;
}
li span{
    font-size: 50px;
}
li:hover{
    background: rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 768px) {
    .panel-left{
        display: none;
    }
}
</style>