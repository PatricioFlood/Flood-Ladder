<template>
    <div class="panel-top">
        <div v-show="view == 'ladder'" class="ladder-menu">
            <button @click="putSymbol('top', 'connect')" :disabled="!canPutTop||!canPut" class="arrow-top"><span class="iconl-arrow-top"></span></button>
            <button @click="putSymbol('bottom', 'connect')" :disabled="!canPut"><span class="iconl-arrow-bottom"></span></button>
            <button @click="putSymbol('line', 'connect')" :disabled="!canPut" class="line"><span class="iconl-arrow-rigth"></span></button>
            <div class="contact">
                <button @click="menu.contact = !menu.contact" :disabled="!canPut"><span class="iconl-contact"></span></button>
                <ul v-show="menu.contact">
                    <li @click="putSymbol('cno','contact')">NO</li>
                    <li @click="putSymbol('cnc','contact')">NC</li>
                    <li @click="putSymbol('n','contact')">N</li>
                    <li @click="putSymbol('p','contact')">P</li>
                </ul>
            </div>
            <div class="coil">
            <button @click="menu.coil = !menu.coil" :disabled="!canPut||!canPutFinal"><span class="iconl-coil" ></span></button>
                <ul v-show="menu.coil">
                    <li @click="putSymbol('coil','coil')">-( )</li>
                    <li @click="putSymbol('reset','coil')">R</li>
                    <li @click="putSymbol('set','coil')">S</li>
                </ul>
            </div>
            <div class="blocks">
                <button @click="menu.blocks = !menu.blocks" :disabled="!canPut||!canPutFinal"><span class="iconl-blocks"></span></button>
                <ul v-show="menu.blocks">
                    <li @click="putSymbol('ton', 'block')">TON</li>
                    <li @click="putSymbol('ctu', 'block')">CTU</li>
                </ul>
            </div>
            <button @click="deleteSymbol" :disabled="!canDelete"><span class="material-icons trash">delete</span></button>
        </div>
        <div v-show="view == 'symbol-table'"><button @click="deleteTable()"><span class="material-icons trash">delete</span></button></div>
        <alert v-if="alert" @close="alert = false" @check="deleteTable(true)">¿Desea vaciar la tabla de símbolos?</alert>
        <div class="menu">
            <button @click="menu.principal = !menu.principal"><span class="material-icons">menu</span></button>
            <ul v-show="menu.principal" class="menu-items">
                    <li @click="changeView('symbol-table')" v-show="view != 'symbol-table'"><span class="material-icons">backup_table</span>Tabla de Símbolos</li>
                    <li @click="changeView('ladder')" v-show="view != 'ladder'"><span class="material-icons">description</span>Bloque de Programa</li>
                    <li @click="openPanelRun()"><span class="material-icons">play_arrow</span>RUN</li>
            </ul>
        </div>
    </div>
</template>
<script>
import { computed, reactive, ref } from '@vue/runtime-core'
import {useStore} from "vuex"
import Alert from "./alert/alert.vue"
export default {
    components: {Alert},
    setup() {
        const store = useStore()
        const menu = reactive({
            contact: false,
            coil: false,
            blocks: false,
            principal: false,
        })
        const alert = ref(false)

        const closeMenu = () => menu.contact = menu.coil = menu.blocks = false
        
        const putSymbol = (symbol, type) => {
            closeMenu() 
            store.dispatch("putSymbol", {symbol, type})
        }
        const deleteSymbol = () => {
            store.dispatch("deleteSymbol")
        }
        const selected = computed(() => store.state.selected)
        const view = computed(() => store.state.currentView)

        const canPut = computed(() => {
            if(store.getters.box({property: "symbol"}) == "center-input")
                return false
            return store.getters.selectedFinal !== null ? (selected.value.b <= store.getters.selectedFinal) : true
        })
        const canPutFinal = computed(() => {
            return selected.value.b > 0 ? (store.getters.selectedLast ? (selected.value.b >= store.getters.selectedLast) : true) : false
        })
        const canPutTop = computed(() => {
            var r = selected.value.r
            if(r == -1) 
                r = store.state.network[selected.value.n].row.length
            if(r > 0){
                const final = store.getters.row({property: "final", n: selected.value.n, r: r-1})
                return final ? (selected.value.b < final) : true 
            }
            else
                return false
        })
        const canDelete = computed(() => {
            var symbol = store.getters.box({property: "symbol"})
            return (selected.value.r != -1 && symbol != "center-input" && symbol != "start" && symbol != "continue")
        })

        const changeView = (view) => {
            menu.principal = false
            store.commit("setView", view)
        }

        const openPanelRun = () => {
            menu.principal = false
            store.commit("setPanelRun", true)
        }

        const deleteTable = (confirm = false) => {
            if(!confirm){
                alert.value = true;
            } else {
                alert.value = false;
                store.commit("resetSymbolTable")
            }
        }

        return{putSymbol, deleteSymbol, menu, closeMenu, selected, canPut, canPutFinal, canPutTop, canDelete, view, changeView, openPanelRun, deleteTable, alert}
    },
}
</script>
<style scoped>
.panel-top {
    width: 100%;
    height: 50px;
    background-color: rgb(24, 99, 99);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 5px;
}
.panel-top .ladder-menu{
    display: flex;
}
.panel-top button{
    padding: 3px;
    font-size: 25px;
    margin-right: 5px;
    color: rgb(41, 41, 41);
    cursor: pointer
}
.menu{
    display: none;
    margin-left: auto;
}
.panel-top .menu button{   
    background: none;
    border: none;
    margin-right: 5px;
}
.panel-top .menu button:hover{
    background: rgba(0, 0, 0, 0.062);
}
.panel-top .menu button span{
    color: rgb(202, 202, 202);
}
.panel-top .trash{
    color: rgb(187, 65, 65);
}
.panel-top ul{
    width: 34px; 
    position: absolute;
    background-color: rgb(193, 243, 224);
    list-style:none;
    border-left: 1px solid rgba(0, 0, 0, 0.137);
    border-right: 1px solid rgba(0, 0, 0, 0.137);
    border-top: 1px solid rgba(0, 0, 0, 0.137);
    z-index: 10;
}
.panel-top li{
    padding-top: 5px;
    padding-bottom: 5px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.137);
}
.panel-top li:hover{
    background-color: rgb(151, 202, 182);
}

.panel-top .menu ul{
    width: 200px;
    right: 0;
    top: 50px;
    background: rgb(24, 99, 99);

}

.panel-top .menu li{
   color: rgb(202, 202, 202);
}

@media screen and (max-width: 768px) {
    .menu{
        display: block;
    }
}
@media screen and (max-width: 330px) {
    .line, .arrow-top{
        display: none;
    }
}
</style>