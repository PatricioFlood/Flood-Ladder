<template>
    <div class="container">
        <panel-left />
        <div class="principal">
            <router-view/>
        </div>
    </div>
</template>
<script>
import PanelLeft from "./components/PanelLeft.vue"
export default {
    name: "App",
    components: {PanelLeft},
    setup(){
        //VH para CSS
        const setVH = () => {
            const vh = window.innerHeight;
            document.getElementById("app").style.setProperty('--vh', `${vh}px`);
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
    background-color: rgb(24, 121, 121);
}
    .principal {
        height: var(--vh);
        display: flex;
        flex-direction: column;
        width: 300px;
        flex-shrink: 0;
        flex-grow: 1;
    }
</style>