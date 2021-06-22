<template>
    <div class="box" @click="selectBox" :class="[{'selected' : box.selected}, box.cssClass, {'symbol-top' : box.connectionTop}, {'symbol-bottom' : box.connectionBottom}]">
        <input type="text" v-model="boxInput" v-if="box.input" @blur="sendData" @keyup.enter="sendData" :class="inputValid" spellcheck="false">
        <div class="block-data1" v-show="box.blockData1">{{box.blockData1}}</div>
        <div class="block-data2" v-show="box.blockData2">{{box.blockData2}}</div>
        <div class="box-background"></div>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import {useStore} from "vuex"
import { watch } from '@vue/runtime-core'

export default {
    props: {n: Number, r: Number, b: Number, box: Object},
    setup(props){
        const store = useStore()
        var boxInput = ref(store.getters.box({property: "name", n: props.n, r: props.r, b: props.b}))
        var inputValid = ref("error")
        var data = ref(store.getters.box({property: "data", n: props.n, r: props.r, b: props.b}))
        const sendData = () => {

            if(!boxInput.value){
                boxInput.value = "???"
                inputValid.value = "error"
                return
            }

            if(props.box.symbol == "center-input"){
                if(/^[1-9][0-9]{0,}$/.test(boxInput.value))
                    data.value = boxInput.value
                else {
                    inputValid.value = "error"
                    return
                }
            } else {
                var regex = /^(([QqIiVv][0-7]\.[0-7])|([tT]((3[7-9])|([4-5][0-9])|(6[0-3])))|([cC](([1-5][0-9])|(6[0-3])|([1-9]))))$/
                
                if(regex.test(boxInput.value)){
                    data.value = boxInput.value[0].toUpperCase() + boxInput.value.slice(1);
                    let symbol = store.getters.searchSymbolTableByDirection(data.value)
                    if(symbol){
                        boxInput.value = symbol
                    } else if (boxInput.value[0] == "Q" || boxInput.value[0] == "I"){
                        store.commit("addRowToSymbolTable")
                        store.commit("setSymbolTable", {property: "direction", value: data.value, row: store.state.symbolTable.length-1})
                    } else {
                        boxInput.value = data.value
                    }
                } else {
                    data.value = store.getters.searchSymbolTable(boxInput.value)
                    if(!data.value){
                        if(props.box.symbol == "ton-top")
                            store.commit("setBox", {property: "blockData2", value: "??? ms", n: props.n, r: props.r+1, b: props.b})
                        inputValid.value = "error"
                        return
                    }
                }
            }

            if(props.box.symbol == "ton-top" && data.value[0] == "T")
                    store.commit("setBox", {property: "blockData2", value: "100 ms", n: props.n, r: props.r+1, b: props.b})
            inputValid.value = "correct"
            store.commit("setBox", {property: "data", value: data.value, n: props.n, r: props.r, b: props.b})
            store.commit("setBox", {property: "name", value: boxInput.value, n: props.n, r: props.r, b: props.b})
            localStorage.setItem("network",JSON.stringify(store.state.network))
            localStorage.setItem("selected",JSON.stringify(store.state.selected))
        }

        const actualizeData = () => {
                let symbol = store.getters.searchSymbolTableByDirection(data.value)
                if(symbol){
                    boxInput.value = symbol
                } else {
                    boxInput.value = data.value||"???"
                    if (boxInput.value[0] == "Q" || boxInput.value[0] == "I"){
                        store.commit("addRowToSymbolTable")
                        store.commit("setSymbolTable", {property: "direction", value: data.value, row: store.state.symbolTable.length-1})
                    }
                }
        }

        const selectBox = () => {
            store.dispatch("select", {n: props.n, r: props.r, b: props.b, type:"box"})
        }

        watch(() => props.box.input, () => {
            boxInput.value = "???"
            inputValid.value = ""
        })

        watch(() => store.state.symbolTable, () => {
            if(props.box.input){
                if(data.value)
                    inputValid.value = "correct"
                if(props.box.symbol != "center-input")
                    actualizeData()
            }
        }, {deep: true, })

        return {boxInput,selectBox,sendData,inputValid}
    }
}
</script>
<style scoped>
.box{
    width: 100px;
    height: 60px;
    flex-shrink: 0;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
    input{
        width: 100%;
        text-align: center;
        background: none;
        border: none;
        font-weight: 400;
        font-size: 15px;
        height: 20px;
        position: absolute;
        top: -1px;
        color: rgb(24, 24, 24);
    }
    input:focus, input:focus{
        outline: none;
    }
    .block-data1, .block-data2{
        width: 100%;
        text-align: center;
        border: none;
        font-weight: 400;
        font-size: 15px;
        height: 20px;
        position: absolute;
        top: 20px;
        color: rgb(24, 24, 24);
    }
    .box-background{
        width: 100%;
        height: 60px;
        background-image:   url("~@/assets/v-line.jpg"),
                            url("~@/assets/ladder.png");
        background-position-x: 100px,0;
        --position-y-one: 0;
        --position-y-two: 60px;
        background-position-y: var(--position-y-one),var(--position-y-two);
        background-repeat: no-repeat,no-repeat;
        background-origin: border-box;
    }
    .box:hover{
        outline: 1px solid rgb(226, 226, 226);
        outline-offset: -1px;
    }
    .box.selected{
        outline: 1px solid black;
        outline-offset: -1px;
    }
    
    .symbol-block-top .box-background{
        --position-y-two: 22px;
    }
    .symbol-block-middle .box-background{
        --position-y-two: -38px;
    }
    .symbol-block-bottom .box-background{
        --position-y-two:-98px;
    }
    .symbol-coil .box-background{
        --position-y-two:-138px;
    }
    .symbol-contact .box-background{
        --position-y-two:-178px;
    }
    .symbol-continue .box-background{
        --position-y-two:-218px;
    }
    .symbol-start .box-background{
        --position-y-two: -258px;
    }
    .symbol-line .box-background{
        --position-y-two: -298px;
    }
    .symbol-bottom .box-background{
        background-position-x: 98px, 0;
        --position-y-one: 30px;
    }
    .symbol-top .box-background{
        background-position-x: 98px, 0;
        --position-y-one: -29px;
    }
    .symbol-top.symbol-bottom .box-background{
        --position-y-one: 0px;
    }
    .symbol-vertical .box-background{
        background-position-x: 98px, 0;
    }
    .ton{
        height: 120px;
        z-index: 1
    }
    .ctu{
        height: 180px;
        z-index: 1
    }
    .symbol-block-top .block-data1{
        text-align: left;
        top: 23px;
        left: 8px;
    }
    .symbol-block-top .block-data2{
        text-align: right;
        right: 8px;
        top: 23px;
    }
    .symbol-block-middle .block-data1{
        text-align: left;
        left: 8px;
        top: 18px;
    }
    .symbol-block-bottom .block-data1{
        text-align: left;
        left: 8px;
        top: 18px;
    }
    .symbol-block-bottom .block-data2{
        text-align: right;
        right: 8px;
        top: 18px;
    }
    .center-input input{
        top: -2px;
        text-align: right;
        padding-right: 3px;
        height: 60px
    }
    .error{
        color: rgb(223, 31, 31);
    }
    .correct{
        color: green
    }
</style>