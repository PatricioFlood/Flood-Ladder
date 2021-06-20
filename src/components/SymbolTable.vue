<template>
    <div class="symbol-table">
        <div class="titles">
            <h3 class="title-symbol">Símbolo</h3>
            <h3 class="title-direction">Dirección</h3>
            <h3 class="title-comment">Comentario</h3>
        </div>
        <row v-for="(i, row) in symbolTable.length" :key="row" :row="row"/>
        <button @click="addRow"><span class="material-icons">add</span></button>
    </div>
</template>
<script>
import { computed } from '@vue/runtime-core'
import {useStore} from "vuex"
import Row from "./symbolTable/Row.vue"
export default {
    components: {Row},
    setup() {
        const store = useStore()
        const symbolTable = computed(() => store.state.symbolTable)
        const addRow = () => {
            store.commit("addRowToSymbolTable")
        }
        return{symbolTable, addRow}
    },
}
</script>
<style scoped>
    .symbol-table{
        background: rgb(216, 253, 246);
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
    .titles{
        display: flex;
        width: 100%;
        text-align: center;
        border: 1px solid black;
        background: rgb(195, 247, 237);
    }
    h3{
        padding: 5px;
    }
    .row{
        display: flex;
        width: 100%;
        text-align: center;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
    }
    .row input{
        background: none;
        border: none;
        text-align: center;
        padding: 5px;
    }
    .row input:focus{
        outline: none;
    }
    .title-symbol{
        width: 65px;
        flex-grow: 1;
        border-right: 1px solid black;
    }
    .title-direction{
        flex-grow: 0.4;
        width: 75px;
        border-right: 1px solid black;
    }
    .title-comment{
        width: 90px;
        flex-grow: 2;
        margin-right: 28px;
    }
</style>