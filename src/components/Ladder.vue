<template>
    <div class="ladder">
        <div class="spreader-bar"></div>
        <div class="networks">
            <network v-for="(i,n) in network.length" :key="n" :n="n" :row="network[n].row" :auxRow="network[n].auxRow" />
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
        return{network}
    },
}
</script>
<style scoped>
    .spreader-bar {
        width: 5px;
        flex-shrink: 0;
        background-color: grey;
    }
    .networks {
        width: 270px;
        flex-grow: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        background-color: rgb(237, 238, 232);
        overflow: auto;
    }
</style>