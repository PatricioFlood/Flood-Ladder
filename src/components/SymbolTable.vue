<template>
    <div class="symbol-table">
        <div class="titles">
            <div class="titles-content">
                <h3 class="title-symbol">Símbolo</h3>
                <h3 class="title-direction">Dirección</h3>
                <h3 class="title-comment">Comentario</h3>
            </div>
            <button @click="deleteTable()" class="delete"><span class="material-icons">delete_sweep</span></button>
        </div>
        
        <row v-for="(i, row) in symbolTable.length" :key="row" :row="row"/>
        <button @click="addRow" class="add"><span class="material-icons">add</span></button>
        <alert v-if="alert" @close="alert = false" @check="deleteTable(true)">¿Desea vaciar la tabla de símbolos?</alert>
    </div>
</template>
<script>
import { computed, ref } from '@vue/runtime-core'
import {useStore} from "vuex"
import Row from "./symbolTable/Row.vue"
import Alert from "./alert/alert.vue"
export default {
    components: {Row, Alert},
    setup() {
        const store = useStore()
        const alert = ref(false)
        const symbolTable = computed(() => store.state.symbolTable)
        const addRow = () => {
            store.commit("addRowToSymbolTable")
        }
        const deleteTable = (confirm = false) => {
            if(!confirm){
                alert.value = true;
            } else {
                alert.value = false;
                store.commit("resetSymbolTable")
            }
        }
        return{symbolTable, addRow, deleteTable, alert}
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
        margin-top: 3px;
        display: flex;
        text-align: center;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        background: rgb(175, 226, 216);
    }
    .titles-content{
        display: flex;
        width: calc(100% - 28px);
    }
    h3{
        padding: 3px;
    }
    .title-symbol{
        width: 65px;
        flex-grow: 1;
        border-right: 1px solid rgba(0, 0, 0, 0.5);
    }
    .title-direction{
        flex-grow: 0.1;
        width: 78px;
        border-right: 1px solid rgba(0, 0, 0, 0.5);
    }
    .title-comment{
        width: 90px;
        flex-grow: 2;
    }
    .add{
        margin-top: 10px;
    }
    .delete{
        color: rgb(172, 51, 51);
        border: none;
        background: rgba(0, 0, 0, 0.1);
        padding: 3px;
    }
</style>