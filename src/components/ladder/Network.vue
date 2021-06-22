<template>
    <div class="network" :class="{'selected': network.selected}">
        <p @click="selectNetwork(n)">Network {{n+1}}</p>
        <div class="row" v-for="(i,r) in  row.length" :key="r">
            <box v-for="(i,b) in row[r].box.length" :key="b" :n="n" :r="r" :b="b" :box="row[r].box[b]"/>
        </div>
        <div class="aux-row">
            <div class="aux-box" v-for="(i,ab) in auxRow.length" :key="ab"
            @click="selectAux(n,ab)" 
            :class="{'selected' : auxRow[ab].selected}"></div>
        </div>
    </div>
</template>
<script>
import Box from "@/components/ladder/Box.vue"
import {useStore} from "vuex"
import { computed } from '@vue/runtime-core'
export default{
    props: {n: Number, row: Array, auxRow: Array},
    components: {Box},
    setup(props){
        const store = useStore()
        const selectAux = (n,b) => {
            store.dispatch("select", {n, b, type:"aux"})
        }
        const selectNetwork = (n) => {
            store.dispatch("select", {n, type:"network"})
        }
        const network = computed(() => store.state.network[props.n])

        return{selectAux, selectNetwork, network}
    }
}
</script>
<style scoped>
    .network {
        min-width: fit-content;
        flex-shrink: 0;
        background-color: rgb(171, 223, 223);
    }
        .network p{
            padding: 0;
            margin: 0;
            padding-left: 10px;
            padding-top: 10px;
            padding-bottom: 10px;
            cursor: pointer;
            position: relative;
            z-index: 1
        }
            .row{
                height: 60px;
                background-color: white;
                display: flex;
            }
            .aux-row{
                height: 25px;
                background-color: white;
                display: flex;
            }
                .aux-box{
                    width: 100px;
                    height: 25px;
                    flex-shrink: 0;
                    cursor: pointer;
                }
                .aux-box:hover{
                    outline: 1px solid rgb(226, 226, 226);
                    outline-offset: -1px;
                }
                .aux-box.selected{
                    outline: 1px solid black;
                    outline-offset: -1px;
                }
    .network p:hover{
        outline: 1px solid rgba(0, 0, 0, 0.2);
    }
    .network.selected{
        border: 1px solid black;
    }
</style>