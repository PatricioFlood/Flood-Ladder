<template>
    <div class="network">
        <p>Network {{n+1}}</p>
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
export default{
    props: {n: Number, row: Array, auxRow: Array},
    components: {Box},
    setup(){
        const store = useStore()
        const selectAux = (n,ab) => {
            store.dispatch("select", {n, ab})
        }
        return{selectAux}
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
            margin-left: 10px;
            margin-top: 10px;
            margin-bottom: 10px;
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
</style>