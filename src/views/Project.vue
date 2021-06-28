<template>
        <div class="view">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component"/>
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
    name: "project",
    components: {PanelRun},
    setup() {
        const store = useStore()
        const route = useRoute()
        const panelRun = computed(() => store.state.run.panelRun)
        store.commit("setProjectName", route.params.name)
        store.dispatch("initialize")
        document.title = route.params.name.replaceAll("-"," ") + " | Flood Ladder"
        return{panelRun, store}
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