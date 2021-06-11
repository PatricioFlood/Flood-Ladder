<template>
    <div class="panel-top">
                <button @click="putSymbol('top', 'connect')" :disabled="!canPutTop||!canPut"><span class="iconl-arrow-top"></span></button>
                <button @click="putSymbol('bottom', 'connect')" :disabled="!canPut"><span class="iconl-arrow-bottom"></span></button>
                <button @click="putSymbol('line', 'connect')" :disabled="!canPut"><span class="iconl-arrow-rigth"></span></button>
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
    <button @click="deleteSymbol"><span class="material-icons trash">delete</span></button>
    </div>
</template>
<script>
import { computed, reactive } from '@vue/runtime-core'
import {useStore} from "vuex"
export default {
    setup() {
        const store = useStore()
        const menu = reactive({
            contact: false,
            coil: false,
            blocks: false,
        })
        const closeMenu = () => menu.contact = menu.coil = menu.blocks = false
        
        const putSymbol = (symbol, type) => {
            closeMenu() 
            store.dispatch("putSymbol", {symbol, type})
        }
        const deleteSymbol = () => {
            store.dispatch("deleteSymbol")
        }
        const selected = computed(() => store.state.selected)

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

        return{putSymbol, deleteSymbol, menu, closeMenu, selected, canPut, canPutFinal, canPutTop}
    },
}
</script>
<style scoped>
.panel-top {
    width: 100%;
    flex-grow: 1;
    height: 50px;
    background-color: rgb(117, 117, 19);
    display: flex;
    align-items: center;
    padding-left: 10px;
}
.panel-top button{
    padding: 3px;
    font-size: 25px;
    color: rgb(41, 41, 41);
    margin-right: 5px;
    cursor: pointer
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
</style>