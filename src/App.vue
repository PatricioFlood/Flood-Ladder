<template>
    <div class="container">
        <principal-menu class="left-menu" :show="true"/>
        <div class="principal">
            <panel-top />
            <router-view v-slot="{ Component }">
                <keep-alive max="1" include="project">
                <component :is="Component" :key="$route.fullPath"/>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>
<script>
import PrincipalMenu from "./components/PrincipalMenu.vue"
import PanelTop from "./components/PanelTop.vue"
export default {
    name: "App",
    components: {PrincipalMenu, PanelTop},
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


@media screen and (max-width: 768px) {
    .left-menu{
        display: none;
    }
}

</style>