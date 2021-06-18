<template>
    <div class="panel-left">
        <ul>
            <li @click="changeView('symbol-table')"><span class="material-icons">backup_table</span>Tabla de Símbolos</li>
            <li @click="changeView('ladder')"><span class="material-icons">description</span>Bloque de Programa</li>
        </ul>
    </div>
</template>
<script>
import {computed} from '@vue/runtime-core'
import {useStore} from "vuex"
export default {
    setup() {
        const view = computed(() => store.state.currentView)
        const store = useStore()
        const changeView = (view) => {
            store.commit("setView", view)
        }
        return{changeView, view}
    }
}
</script>
<style scoped>
.panel-left {
        width: 150px;
        flex-shrink: 0;
        height: var(--vh);
        background-color: rgb(24, 121, 121);
    }

@media screen and (max-width: 768px) {
    .panel-left{
        display: none;
    }
}
</style>