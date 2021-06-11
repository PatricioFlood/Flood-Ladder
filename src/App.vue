<template>
    <div class="container">
        <div class="panel-left"></div>
        <div class="principal">
            <panel-top />
            <ladder />
        </div>
    </div>
</template>
<script>
import PanelTop from "./components/PanelTop.vue"
import Ladder from "./components/Ladder.vue"
import {useStore} from "vuex"
export default {
    name: "App",
    components: {PanelTop, Ladder},
    setup(){
        const store = useStore()
        store.dispatch("initialize")

        //VH para CSS
        const setVH = () => {
            const vh = window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        setVH()
        window.addEventListener("resize", setVH)
    }
}
</script>
<style scoped>
.container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}
    .panel-left {
        width: 150px;
        flex-shrink: 0;
        height: var(--vh);
        background-color: blue;
    }
    .principal {
        height: var(--vh);
        display: flex;
        flex-direction: column;
        width: 300px;
        flex-shrink: 0;
        flex-grow: 1;
    }      
    .panel-rigth{
        width: 300px;
        flex-shrink: 0;
        height: var(--vh);
        background-color: red;
    }

@media screen and (max-width: 425px) {
    .panel-left{
        display: none;
    }
    .panel-rigth{
        display:none;
    }
}
</style>