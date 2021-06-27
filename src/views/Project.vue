<template>
        <div class="view">
            <router-view v-slot="{ Component }">
                <keep-alive>
                <component :is="Component" />
                </keep-alive>
            </router-view>
        </div>
    <panel-run v-show="panelRun"/>
    
</template>
<script>
import PanelRun from "@/components/PanelRun.vue"
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
    components: {PanelRun},
    setup() {
        const store = useStore()
        const route = useRoute()
        const panelRun = computed(() => store.state.run.panelRun)
        store.commit("setProjectName", route.params.name)
        store.dispatch("initialize")
        document.title = route.params.name.replace("-"," ") + " | Flood Ladder"
        return{panelRun}
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