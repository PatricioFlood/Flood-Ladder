<template>
    <div class="ladder">
        <div class="networks">
            <network v-for="(i,n) in network.length" :key="n" :n="n" :row="network[n].row" :auxRow="network[n].auxRow" />
            <button @click="addNetwork" class="add"><span class="material-icons">add</span></button>
        </div>
    </div>
</template>
<script>
import Network from "@/components/ladder/Network.vue"
import {useStore} from "vuex"
import { computed } from '@vue/runtime-core'
export default {
    components: {Network},
    setup(){
        const store = useStore()
        const network = computed(() => store.state.network)
        const addNetwork = () => {
            store.dispatch("addNetwork")
        }
        return{network, addNetwork}
    },
}
</script>
<style scoped>
    .ladder{
        background-color: rgb(24, 121, 121);
    }
    .networks {
        width: 270px;
        flex-grow: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        background-color: rgb(24, 121, 121);
        overflow: auto;
    }
</style>