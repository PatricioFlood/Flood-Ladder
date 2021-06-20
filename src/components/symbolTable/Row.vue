<template>
    <div class="row">
            <input type="text" :class="['input-symbol', verify.symbol]" 
            v-model="table.symbol" @blur="setTable('symbol')" @keyup.enter="setTable('symbol')">
            <input type="text" :class="['input-direction', verify.direction]" 
            v-model="table.direction" @blur="setTable('direction')" @keyup.enter="setTable('direction')">
            <input type="text" :class="['input-comment']" 
            v-model="table.comment" @blur="setTable('comment')" @keyup.enter="setTable('comment')">
            <button><span class="material-icons">delete</span></button>
    </div>
</template>
<script>
import { reactive } from '@vue/reactivity'
import {useStore} from "vuex"
import { watch } from '@vue/runtime-core'
export default {
    props: {row: Number},
    setup(props) {
        const store = useStore()
        const table = reactive(
            {
                symbol: store.state.symbolTable[props.row].symbol,
                direction: store.state.symbolTable[props.row].direction,
                comment: store.state.symbolTable[props.row].comment,
            }
        )
        const verify = reactive(
            {
                symbol: "",
                direction: "",
            }
        )
        const setTable = (property) => {
            if(property == "direction"){
                verify.direction = ""
                const regex = /^([QqIiVv][0-7]\.[0-7])|([tT]((3[7-9])|([4-5][0-9])|(6[0-3])))|([cC](([1-5][0-9])|(6[0-3])|([1-9])))$/
                if(regex.test(table.direction)){
                    table.direction = table.direction[0].toUpperCase() + table.direction.slice(1);
                    for(let [i, row] of store.state.symbolTable.entries()){
                        if(i != props.row && row.direction == table.direction){
                            verify.direction = "repeat"
                        }
                    }
                    verify.direction = "correct"
                }
                else{
                    verify.direction = "error"
                }
                    
            } else if (property == "symbol"){
                verify.symbol = ""
                const regex = /^[A-Za-zÀ-ÿ][\w À-ÿ]*$/
                if(regex.test(table.symbol)){
                    table.symbol = table.symbol.replace(" ","_")
                    for(let [i, row] of store.state.symbolTable.entries()){
                        if(i != props.row && row.symbol == table.symbol){
                            verify.symbol = "repeat"
                            return 
                        }
                    }
                    verify.symbol = "correct"
                }
                else{
                    verify.symbol = "error"
                }
            }
            store.commit("setSymbolTable", {property, value: table[property], row: props.row})
        }
        
        watch(() => store.state.symbolTable[props.row], () => {
            if(store.state.symbolTable[props.row]){
                table.symbol = store.state.symbolTable[props.row].symbol
                table.direction = store.state.symbolTable[props.row].direction
                table.comment = store.state.symbolTable[props.row].comment
            }
        })

        return{table, setTable, verify}
    },
}
</script>
<style scoped>
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
    .row .input-symbol{
        width: 65px;
        flex-grow: 1;
        border-right: 1px solid black;
    }
    .row .input-direction{
        flex-grow: 0.4;
        width: 75px;
        border-right: 1px solid black;
    }
    .row .input-comment{
        width: 90px;
        flex-grow: 2;
    }
    .error{
        color: rgb(223, 31, 31);
    }
    .correct{
        color: green;
    }
    .repeat{
        color: rgb(189, 175, 51);
    }
</style>