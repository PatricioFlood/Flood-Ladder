<template>
    <div class="box" @click="selectBox" :class="[{'selected' : box.selected}, box.cssClass, {'symbol-top' : box.connectionTop}, {'symbol-bottom' : box.connectionBottom}]">
        <input type="text" @focus="$event.target.select()" v-model="boxInput" v-if="box.input" @blur="sendData" @keyup.enter="sendData" :class="inputValid" spellcheck="false">
        <div class="block-data1" v-show="box.blockData1">{{box.blockData1}}</div>
        <div class="block-data2" v-show="box.blockData2">{{box.blockData2}}</div>
        <div class="box-background"></div>
        <div class="boxActive" v-if="active"></div>
        <div class="boxActiveAfter" v-if="activeAfter"></div>
        <div class="boxActiveBefore" v-if="activeBefore"></div>
        <div class="boxActiveBottom" v-if="activeAfter && box.connectionBottom"></div>
        <div class="boxActiveTop" v-if="activeAfter && box.connectionTop"></div>
        <div class="boxTimer" v-if="timerT">{{timerT}}</div>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import {useStore} from "vuex"
import { computed, watch } from '@vue/runtime-core'

export default {
    props: {n: Number, r: Number, b: Number},
    setup(props){
        const store = useStore()
        var box = computed(() => store.state.network[props.n]?
        (store.state.network[props.n].row[props.r]?store.state.network[props.n].row[props.r].box[props.b]:{}):{})
        var boxInput = ref(box.value.name||"???")
        var inputValid = ref("error")
        var data = ref(box.value.data)
        const sendData = () => {
            if(!boxInput.value){
                boxInput.value = "???"
                inputValid.value = "error"
            } else {
                if(box.value.symbol == "center-input"){
                    if(/^[1-9][0-9]{0,}$/.test(boxInput.value)){
                        data.value = boxInput.value
                        inputValid.value = "correct"
                    }
                    else {
                        inputValid.value = "error"
                    }
                } else {
                    var regex = /^(([QqIiVv][0-7]\.[0-7])|([tT]((3[7-9])|([4-5][0-9])|(6[0-3])))|([cC](([1-5][0-9])|(6[0-3])|([1-9]))))$/
                    
                    if(regex.test(boxInput.value)){
                        data.value = boxInput.value[0].toUpperCase() + boxInput.value.slice(1);
                        let symbol = store.getters.searchSymbolTableByDirection(data.value)
                        if(symbol){
                            boxInput.value = symbol
                        } else if (/^[QITVC]/.test(boxInput.value)){
                            store.commit("addRowToSymbolTable")
                            store.commit("setSymbolTable", {property: "direction", value: data.value, row: store.state.symbolTable.length-1})
                            store.commit("orderSymbolTable")
                        } else {
                            boxInput.value = data.value
                        }
                        inputValid.value = "correct"
                    } else {
                        data.value = store.getters.searchSymbolTable(boxInput.value)
                        if(!data.value){
                            if(box.value.symbol == "ton-top")
                                store.commit("setBox", {property: "blockData2", value: "??? ms", n: props.n, r: props.r+1, b: props.b})
                            inputValid.value = "error"
                        }
                        else
                            inputValid.value = "correct"
                    }
                }
            }

            if(box.value.symbol == "ton-top" && data.value[0] == "T")
                    store.commit("setBox", {property: "blockData2", value: "100 ms", n: props.n, r: props.r+1, b: props.b})
            
            store.commit("setBox", {property: "data", value: data.value, n: props.n, r: props.r, b: props.b})
            store.commit("setBox", {property: "name", value: boxInput.value, n: props.n, r: props.r, b: props.b})
            store.dispatch("saveInLocal") 
        }

        const actualizeData = () => {
                let symbol = store.getters.searchSymbolTableByDirection(data.value)
                if(symbol){
                    boxInput.value = symbol
                } else {
                    boxInput.value = data.value||"???"
                    if (/^[QITVC]/.test(boxInput.value)){
                        store.commit("addRowToSymbolTable")
                        store.commit("setSymbolTable", {property: "direction", value: data.value, row: store.state.symbolTable.length-1})
                        store.commit("orderSymbolTable")
                    }
                }
                store.dispatch("saveInLocal")
        }

        sendData()

        const selectBox = () => {
            store.dispatch("select", {n: props.n, r: props.r, b: props.b, type:"box"})
        }

        watch(() => box.value.name, () => {
            if(store.state.network[props.n] && (store.state.network[props.n].row[props.r])){
                boxInput.value = store.getters.box({property: "name", n: props.n, r: props.r, b: props.b})
                sendData()
            }
        })

        watch(() => store.state.symbolTable, () => {
            if(box.value.input){
                if(data.value)
                    inputValid.value = "correct"
                if(box.value.symbol != "center-input")
                    actualizeData()
            }
        }, {deep: true, })

        var timerT = computed(() => {
            if(store.state.run.run && data.value[0] == "T" && box.value.symbol == "ton-top"){
                return store.state.run.stateTable[data.value[0]][data.value.substring(1) - 37].count
            }
            return 0
        })

        var active = computed(() => {
            if(data.value && store.state.run.run && /(cnc|cno)/.test(box.value.symbol)){
                var state = false
                if(data.value[0] == "T")
                    state = store.state.run.stateTable[data.value[0]][data.value.substring(1) - 37].state
                else
                    state = store.state.run.stateTable[data.value[0]][data.value.substring(1).split('.')[0]][data.value.substring(1).split('.')[1]]

                if(box.value.symbol == "cnc")
                    state = !state
                return state
                
            }
            return false
        })

        var activeBefore = computed(() => {
            var state = false
            if((data.value || box.value.symbol == "line") && store.state.run.run){
                if(props.b == 0)
                    state = true
                else 
                    state = store.getters.box({property: "activeAfter", n: props.n, r: props.r, b: props.b-1})
            }
            return state
        })
        var activeAfter = computed(() => {
            var state = false
            if(store.state.run.run){
                if(activeBefore.value)
                    state = active.value
                if(!state && box.value.connectionTop)
                    state = store.getters.box({property: "activeAfter", n: props.n, r: props.r-1, b: props.b})
                if(!state && box.value.connectionBottom)
                    state = store.getters.box({property: "activeAfter", n: props.n, r: props.r+1, b: props.b}) 
                if(!state && box.value.symbol == "line")
                    state = activeBefore.value
            }
            store.commit("setBox", {property: "activeAfter", value: state, n: props.n, r: props.r, b: props.b})
            state = store.getters.box({property: "activeAfter", n: props.n, r: props.r, b: props.b})
            return state
        })

        watch([active, activeBefore], () => {
            if(!(active.value && activeBefore.value)){
                store.commit("setBox", {property: "activeAfter", value: false, n: props.n, r: props.r, b: props.b})
                var r = props.r;
                while(store.getters.box({property: "connectionTop", n: props.n, r, b: props.b})){
                    store.commit("setBox", {property: "activeAfter", value: false, n: props.n, r: r-1, b: props.b})
                    r--
                }
                r = props.r;
                while(store.getters.box({property: "connectionBottom", n: props.n, r, b: props.b})){
                    store.commit("setBox", {property: "activeAfter", value: false, n: props.n, r: r+1, b: props.b})
                    r++
                }
            }
        })

        return {boxInput,selectBox,sendData,inputValid, active, activeAfter, activeBefore, box, timerT}
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
    .boxActive{
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(58, 171, 224, 0.445);
        top: 20px;
        left: 40px;
    }
    .boxActiveBefore, .boxActiveAfter{
        position: absolute;
        background: rgb(58, 171, 224);
        top: 28px;
        left: 0;
        height: 4px;
    }

    .boxTimer{
        position: absolute;
        color: rgb(58, 171, 224);
        left: 0;
        width: 100%;
        text-align: center;
        top: 47px;
        font-size: 20px;
        z-index: 10;
    }

    .symbol-contact .boxActiveBefore{
        width: 34px;
    }
    .symbol-coil .boxActiveBefore{
        width: 28px;
    }
    .symbol-block-top .boxActiveBefore{
        width: 4px;
    }
    .symbol-coil .boxActiveBefore::after{
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(58, 171, 224, 0.445);
        top: -9px;
        left: 40px;
    }
    .boxActiveAfter{
        left: 66px;
    }

    .symbol-line .boxActiveAfter, .symbol-line .boxActiveBefore{
        left: 0;
        width: 100px
    }

    .boxActiveTop{
        position: absolute;
        background: rgb(58, 171, 224);
        top: 0;
        right: 0;
        height: 32px;
        width: 4px;
    }
    .boxActiveBottom{
        position: absolute;
        background: rgb(58, 171, 224);
        bottom: 0;
        right: 0;
        height: 32px;
        width: 4px;
    }
    .symbol-contact .boxActiveAfter{
        width: 34px;
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