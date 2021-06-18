<template>
    <div class="container">
        <panel-left />
        <div class="principal">
            <panel-top />
            <keep-alive>
                <component :is="view" class="view"/>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import PanelLeft from "./components/PanelLeft.vue"
import PanelTop from "./components/PanelTop.vue"
import Ladder from "./components/Ladder.vue"
import SymbolTable from "./components/SymbolTable.vue"
import {useStore} from "vuex"
import {computed, onMounted} from '@vue/runtime-core'
export default {
    name: "App",
    components: {PanelLeft, PanelTop, Ladder, SymbolTable},
    setup(){
        const store = useStore()
        const view = computed(() => store.state.currentView)
        //VH para CSS
        const setVH = () => {
            const vh = window.innerHeight;
            document.getElementById("app").style.setProperty('--vh', `${vh}px`);
        }
        setVH()
        window.addEventListener("resize", setVH)

        store.dispatch("addNetwork")
        
        onMounted(() => {
            store.dispatch("initialize")
            store.commit("addRowToSymbolTable")
        })
        

        return{view}
    }
}
</script>
<style scoped>
.container {
    display: flex;
    width: 100%;
}
    .principal {
        height: var(--vh);
        display: flex;
        flex-direction: column;
        width: 300px;
        flex-shrink: 0;
        flex-grow: 1;
    }
        .view{
            height: calc(var(--vh) - 50px);
            display: flex;
            flex-grow: 1;
            width: 100%;
        }
</style>