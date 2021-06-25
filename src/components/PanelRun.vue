<template>
    <div class="panelRun">
        <div class="runstop">
            <button @click="runLadder" v-show="!run" class="run"><span class="material-icons">play_arrow</span></button>
            <button @click="stopLadder" v-show="run" class="stop"><span class="material-icons">stop</span></button>
            <button @click="closePanel" v-show="!run"><span class="material-icons">close</span></button>
        </div>
        <div class="content">
            <div class="buttons-ligths">
                <div class="buttons">
                    <div v-for="button of pushButtons" :key="button.direction" 
                    :class="[
                    'push-button', 
                    {'red': /([rR][oO][jJ][Oo])|([nN][cC])/.test(button.comment) && !/[vV][eE][rR][dD][eE]/.test(button.comment)},
                    {'yellow': /[aA][mM][aA][rR][iI][lL][lL][oO]/.test(button.comment)},
                    {'font16px': (button.symbol||button.direction).length > 8},
                    {'font14px': (button.symbol||button.direction).length > 11}
                    ]" 
                    @mousedown="setI(button)" @mouseup="resetI(button)" 
                    @touchstart.passive="setI(button)" @touchend.passive="resetI(button)">
                    <p>{{button.symbol||button.direction}}</p>
                    <div class="nc" v-show="/[nN][cC]/.test(button.comment)">NC</div>
                    </div>
                </div>
                <div class="ligths">
                    <div v-for="ligth of ligths" :key="ligth.direction"
                    :class="[
                    'pilot-ligth',
                    {'on': Q[ligth.direction.substring(1).split('.')[0]][ligth.direction.substring(1).split('.')[1]]},
                    {'red': /[rR][oO][jJ][OoaA]/.test(ligth.comment)},
                    {'yellow': /[aA][mM][aA][rR][iI][lL][lL][oOaA]/.test(ligth.comment)},
                    {'blue': /[aA][zZ][uU][lL]/.test(ligth.comment)},
                    {'font13px': (ligth.symbol||ligth.direction).length > 9}
                    ]">
                    <p>{{ligth.symbol||ligth.direction}}</p>
                    </div>
                </div>
            </div>
            <div class="table">
                <div class="variables" v-if="variables.length>0">
                    <div class="tableTitle">Variables</div>
                    <div>Direccion</div><div>Estado</div>
                    <template v-for="variable of variables" :key="variable.direction">
                        <div>{{variable.direction}}</div><div>{{V[variable.direction.substring(1).split('.')[0]][variable.direction.substring(1).split('.')[1]]?1:0}}</div>
                    </template>
                </div>
                <div class="timers" v-if="timers.length>0">
                    <div class="tableTitle2">Temporizadores</div>
                    <div>Direccion</div><div>Tiempo</div><div>Estado</div>
                    <template v-for="timer of timers" :key="timer.direction">
                        <div>{{timer.direction}}</div>
                        <div>{{T[parseInt(timer.direction.substring(1))-37].count}}</div>
                        <div>{{T[parseInt(timer.direction.substring(1))-37].state?1:0}}</div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

import { computed } from '@vue/runtime-core'

import {useStore} from "vuex"
export default {
    setup() {

        const store = useStore()

        

        const run = computed(() => store.state.run.run)

        const pushButtons = computed(() => store.state.symbolTable.filter(row => row.direction && row.direction[0] == "I"))
        const ligths = computed(() =>store.state.symbolTable.filter(row => row.direction && row.direction[0] == "Q"))
        const Q = computed(() => store.state.run.stateTable.Q)
        const timers = computed(() => store.state.symbolTable.filter(row => row.direction && row.direction[0] == "T"))
        const T = computed(() => store.state.run.stateTable.T)
        const variables = computed(() => store.state.symbolTable.filter(row => row.direction && row.direction[0] == "V"))
        const V = computed(() => store.state.run.stateTable.V)
        const counters = computed(() => store.state.symbolTable.filter(row => row.direction && row.direction[0] == "C"))
        const C = computed(() => store.state.run.stateTable.C)

        const runLadder = () => {
            for(let button of pushButtons.value){
                const value = /[nN][cC]/.test(button.comment)
                    store.commit("setI", {byte: button.direction[1], bit: button.direction[3], value})
            }
            store.dispatch("runLadder2")
        }

        const stopLadder = () => {
            store.dispatch("stopLadder")
        }

        const setI = (button) => {
            window.navigator.vibrate(30);
            const value = !/[nN][cC]/.test(button.comment)
            store.commit("setI", {byte: button.direction[1], bit: button.direction[3], value})
        }
        const resetI = async (button) => {
            window.navigator.vibrate(20);
            const value = /[nN][cC]/.test(button.comment)
            await delay(50)
            store.commit("setI", {byte: button.direction[1], bit: button.direction[3], value})
        }

        const closePanel = () => {
            store.commit("setPanelRun", false)
        }

        return{Q, setI, resetI, run, runLadder, stopLadder, closePanel, pushButtons, ligths, timers, T, counters, C, variables, V}
    },
}
</script>
<style scoped>
    .panelRun{
        width: 100%;
        display: flex;
        flex-direction: column;
        background: rgb(216, 253, 246);
        max-height: 50%;
        padding-top: 2px;
    }
    .table{
        display: flex;
        margin-top: 10px;
        align-items: center;
        justify-content: center;
        user-select: none;
        flex-grow: 0.3
    }
    .variables{
        display: grid;
        width: 200px;
        grid-template-columns: repeat(2, 1fr);
        text-align: center;
        border: 1px solid black;
    }
    .variables div{
        border: 1px solid black;
        padding: 2px;
    }
    .timers{
        margin-left: 10px;
        margin-right: 10px;
        display: grid;
        width: 200px;
        grid-template-columns: repeat(3, 1fr);
        text-align: center;
        border: 1px solid black;
    }
    .timers div{
        border: 1px solid black;
        padding: 2px;
    }
    .tableTitle{
        grid-column: 1 / 3;
    }
    .tableTitle2{
        grid-column: 1 / 4;
    }
    .runstop{
        display: flex;
        justify-content: space-between;
        padding: 5px 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.205);
    }
    .content{
        display: flex;
        overflow: auto;
        padding: 10px;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    .runstop span{
        font-size: 35px;
    }
    .runstop button{
        border: none;
        border-radius: 100%;
        padding: 1px;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    .runstop button:hover{
        opacity: 0.8;
    }
    .run{
        color: green;
        background: rgb(143, 189, 143);
    }
    .stop{
        color: rgb(119, 16, 16);
        background: rgb(206, 136, 136);
    }
    .buttons-ligths{
        flex-grow: 1;
    }
    .buttons, .ligths{
        display: flex;
        justify-content: space-around;
        align-items: center;
        align-content: center;
        flex-wrap: wrap;
        flex-grow: 1;
    }
    .push-button{
        height: 100px;
        width: 100px;
        border-radius: 100%;
        border: 5px solid rgb(170, 170, 170);
        background: rgb(48, 212, 48);
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        overflow: hidden;
        user-select: none;
        position: relative;
        padding: 5px;
    }
    .push-button p{
        text-align: center;
        width: 100%;
        word-wrap: break-word;
    }
    .push-button .nc{
        position: absolute;
        bottom: 8px;
        font-size: 15px;
    }
    .push-button:active{
        background: rgb(31, 129, 31);
    }

    .push-button.red{
        background: rgb(212, 48, 48);
    }
    .push-button.red:active{
        background: rgb(107, 26, 26);
    }
    .push-button.yellow{
        background: rgb(227, 230, 51);
    }
    .push-button.yellow:active{
        background: rgb(152, 155, 16);
    }

    .pilot-ligth{
        margin-top: 10px;
        height: 85px;
        width: 85px;
        border-radius: 100%;
        border: 10px solid rgb(10, 87, 10);
        background: rgb(5, 59, 5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(214, 214, 214);
        overflow: hidden;
        user-select: none;
        font-size: 14px;
        padding: 5px;
    }
    .pilot-ligth p{
        text-align: center;
        width: 100%;
        word-wrap: break-word;
    }

    .pilot-ligth.on{
        border: 10px solid rgb(42, 199, 42);
        background: rgb(30, 247, 30);
        color: black;
    }
    .pilot-ligth.red{
        border: 10px solid rgb(87, 10, 10);
        background: rgb(59, 5, 5);
    }
    .pilot-ligth.red.on{
        border: 10px solid rgb(199, 42, 42);
        background: rgb(247, 30, 30);
    }
    .pilot-ligth.yellow{
        border: 10px solid rgb(87, 86, 10);
        background: rgb(55, 59, 5);
    }
    .pilot-ligth.yellow.on{
        border: 10px solid rgb(196, 199, 42);
        background: rgb(233, 247, 30);
    }
    .pilot-ligth.blue{
        border: 10px solid rgb(18, 10, 87);
        background: rgb(5, 13, 59);
    }
    .pilot-ligth.blue.on{
        border: 10px solid rgb(42, 79, 199);
        background: rgb(30, 117, 247);
    }
    .font16px{
        font-size: 16px;
    }
    .font14px{
        font-size: 14px;
    }
    .font13px{
        font-size: 13px;
    }
</style>