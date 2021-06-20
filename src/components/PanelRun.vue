<template>
    <div class="panelRun">
        <div class="runstop">
            <button @click="runLadder" v-show="!run" class="run"><span class="material-icons">play_arrow</span></button>
            <button @click="stopLadder" v-show="run" class="stop"><span class="material-icons">stop</span></button>
            <button @click="closePanel" v-show="!run"><span class="material-icons">close</span></button>
        </div>
        <div class="buttons">
            <div class="push-button" @mousedown="setI(0,0)" @mouseup="resetI(0,0)" @touchstart.passive="setI(0,0)" @touchend.passive="resetI(0,0)"></div>
            <div class="push-button red" @mousedown="setI(0,1)" @mouseup="resetI(0,1)" @touchstart.passive="setI(0,1)" @touchend.passive="resetI(0,1)"></div>
        </div>
        <div class="ligths">
            <div class="pilot-ligth" :class="{'on': Q[0][0]}">
                Q0.0
            </div>
            <div class="pilot-ligth" :class="{'on': Q[0][1]}">
                Q0.1
            </div>
            <div class="pilot-ligth" :class="{'on': Q[0][2]}">
                Q0.2
            </div>
            <div class="pilot-ligth" :class="{'on': Q[0][3]}">
                Q0.3
            </div>
            <div class="pilot-ligth" :class="{'on': Q[0][4]}">
                Q0.4
            </div>
        </div>
    </div>
</template>
<script>
import { computed } from '@vue/runtime-core'

import {useStore} from "vuex"
export default {
    setup() {

        const store = useStore()

        const Q = computed(() => store.state.run.stateTable.Q)

        const run = computed(() => store.state.run.run)

        const runLadder = () => {
            store.dispatch("runLadder")
        }

        const stopLadder = () => {
            store.dispatch("stopLadder")
        }

        const setI = (byte,bit) => {
            console.log("setting")
            store.commit("setI", {byte, bit, value: true})
        }
        const resetI = (byte,bit) => {
            store.commit("setI", {byte, bit, value: false})
        }

        const closePanel = () => {
            store.commit("setPanelRun", false)
        }

        return{Q, setI, resetI, run, runLadder, stopLadder, closePanel}
    },
}
</script>
<style scoped>
    .panelRun{
        height: 50%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: rgb(216, 253, 246);
    }
    .runstop{
        display: flex;
        justify-content: space-between;
        margin: 5px;
    }
    .runstop span{
        font-size: 35px;
    }
    .runstop button{
        border: none;
        border-radius: 100%;
        padding: 1px;
        cursor: pointer
    }
    .runstop button:hover{
        opacity: 80%;
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
    }
    .push-button:hover{
        background: rgb(42, 180, 42);
    }

    .push-button.red{
        background: rgb(212, 48, 48);
        cursor: pointer;
    }
    .push-button.red:hover{
        background: rgb(180, 42, 42);
    }

    .pilot-ligth{
        height: 65px;
        width: 65px;
        border-radius: 100%;
        border: 10px solid rgb(10, 87, 10);
        background: rgb(5, 59, 5);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(170, 169, 169);
    }

    .pilot-ligth.on{
        border: 10px solid rgb(42, 199, 42);
        background: rgb(30, 247, 30);
    }
</style>