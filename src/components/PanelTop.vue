<template>
    <div class="panel-top">
                <button @click="putSymbol('top')" :disabled="selected.r==0||canPut"><span class="iconl-arrow-top"></span></button>
                <button @click="putSymbol('bottom')" :disabled="canPut"><span class="iconl-arrow-bottom"></span></button>
                <button @click="putSymbol('linea')" :disabled="canPut"><span class="iconl-arrow-rigth"></span></button>
                <div class="contact">
                    <button @click="menu.contact = !menu.contact" :disabled="canPut"><span class="iconl-contact"></span></button>
                    <ul v-show="menu.contact">
                        <li @click="putSymbol('cna')">NO</li>
                        <li @click="putSymbol('cnc')">NC</li>
                        <li @click="putSymbol('n')">N</li>
                        <li @click="putSymbol('p')">P</li>
                    </ul>
                </div>
                <div class="coil">
                <button @click="menu.coil = !menu.coil" :disabled="selected.b==0||canPut"><span class="iconl-coil" ></span></button>
                    <ul v-show="menu.coil">
                        <li @click="putSymbol('bobina')">-( )</li>
                        <li @click="putSymbol('reset')">R</li>
                        <li @click="putSymbol('set')">S</li>
                    </ul>
                </div>
                <div class="blocks">
                    <button @click="menu.blocks = !menu.blocks" :disabled="selected.b==0||canPut"><span class="iconl-blocks"></span></button>
                    <ul v-show="menu.blocks">
                        <li @click="putSymbol('ton')">TON</li>
                        <li @click="putSymbol('ctu')">CTU</li>
                    </ul>
                </div>
    <button @click="deleteSymbol"><span class="material-icons trash">delete</span></button>
    </div>
</template>
<script>
import { computed } from '@vue/runtime-core'
import {useStore} from "vuex"
export default {
    setup() {
        const store = useStore()
        const putSymbol = (symbol) => {
            store.dispatch("putSymbol",symbol)
        }
        const menu = computed(() => store.state.menu)
        const selected = computed(() => store.state.selected)
        return{putSymbol, menu, selected}
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