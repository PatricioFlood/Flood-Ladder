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
.ladder {
    height: calc(var(--vh) - 50px);
    display: flex;
    flex-grow: 1;
    width: 100%;
}
    .spreader-bar {
        width: 10px;
        flex-shrink: 0;
        height: 100%;
        background-color: grey;
    }
    .networks {
        width: 280px;
        flex-grow: 1;
        flex-shrink: 0;
        height: calc(var(--vh) - 50px);
        display: flex;
        flex-direction: column;
        background-color: rgb(237, 238, 232);
        overflow: auto;
    }
</style>