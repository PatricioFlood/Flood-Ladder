<template>
    <panel-top />
        <keep-alive>
            <component :is="view" class="view"/>
        </keep-alive>
    <panel-run v-show="panelRun"/>
</template>
<script>
import PanelTop from "@/components/PanelTop.vue"
import Ladder from "@/views/project/Ladder.vue"
import SymbolTable from "@/views/project/SymbolTable.vue"
import PanelRun from "@/components/PanelRun.vue"
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
    components: {PanelTop, Ladder, SymbolTable, PanelRun},
    setup() {
        const store = useStore()
        const view = computed(() => store.state.currentView)
        const panelRun = computed(() => store.state.run.panelRun)
        return{view, panelRun}
    },
}
</script>
<style scoped>
    .view{
            height: 100px;
            display: flex;
            flex-grow: 1;
            width: 100%;
        }
</style>