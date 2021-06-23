<template>
    <div class="panelRun">
        <div class="runstop">
            <button @click="runLadder" v-show="!run" class="run"><span class="material-icons">play_arrow</span></button>
            <button @click="stopLadder" v-show="run" class="stop"><span class="material-icons">stop</span></button>
            <button @click="closePanel" v-show="!run"><span class="material-icons">close</span></button>
        </div>
        <div class="content">
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
                {'on': Q[ligth.direction[1]][ligth.direction[3]]},
                {'red': /[rR][oO][jJ][OoaA]/.test(ligth.comment)},
                {'yellow': /[aA][mM][aA][rR][iI][lL][lL][oOaA]/.test(ligth.comment)},
                {'blue': /[aA][zZ][uU][lL]/.test(ligth.comment)},
                {'font13px': (ligth.symbol||ligth.direction).length > 9}
                ]">
                <p>{{ligth.symbol||ligth.direction}}</p>
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

        const Q = computed(() => store.state.run.stateTable.Q)

        const run = computed(() => store.state.run.run)

        const pushButtons = computed(() => {
            return store.state.symbolTable.filter(row => row.direction && row.direction[0] == "I").sort(((a, b) => a.direction > b.direction || -1))
        })

        const ligths = computed(() => {
            return store.state.symbolTable.filter(row => row.direction && row.direction[0] == "Q").sort(((a, b) => a.direction > b.direction || -1))
        })

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

        return{Q, setI, resetI, run, runLadder, stopLadder, closePanel, pushButtons, ligths}
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
    .runstop{
        display: flex;
        justify-content: space-between;
        padding: 5px 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.205);
    }
    .content{
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 10px;
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
    .buttons, .ligths{
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }
    .ligths{
        flex-grow: 1;
        align-content: center;
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