<template>
    <div class="panel-top" v-if="isReady">
        <div class="topTitle" v-show="$route.name != 'ladder'">
            <h1>{{title}}</h1>
        </div>
        <top-ladder v-if="$route.name == 'ladder'" />
        <div v-if="$route.name != 'home'" class="mobileMenu">
            <button @click="menu = !menu" class="menu-button"><span class="material-icons">{{menu?'close':'menu'}}</span></button>
            <principal-menu :show="menu" class="lateral-menu" @close="menu = false"/>
            <div class="backmenu" @click="menu = false" v-show="menu"></div>
        </div>
        
    </div>
</template>
<script>
import { useRoute, useRouter } from 'vue-router'
import TopLadder from "@/components/panelTop/TopLadder.vue"
import PrincipalMenu from "@/components/PrincipalMenu.vue"
import { ref } from '@vue/reactivity'
import { computed, watch } from '@vue/runtime-core'
export default {
    components: {TopLadder, PrincipalMenu},
    setup() {
        
        var isReady = ref(false)
        var menu = ref(false)
        const route = useRoute()
        const title = computed(() => route.name=="symbolTable"?"Tabla de Símbolos":"Flood Ladder")

        const router = useRouter()
        
        watch(() => route.name, () => {
            isReady.value = false
            router.isReady().then(() => {
                isReady.value = true
            })
        })

        return {title, menu, isReady}
    },
}
</script>
<style scoped>
    h1{
        font-size: 25px;
    }
    .panel-top {
        width: 100%;
        height: 50px;
        background-color: rgb(24, 99, 99);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 5px;
    }
    .topTitle{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        color: rgb(113, 199, 180);
    }
    .mobileMenu{
        display: none;
        margin-left: auto;
        height: 100%;
    }
    .menu-button{
        height: 100%;
        padding: 7px;
        background: none;
        border: none;
        margin: 0;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        user-select: none;
    }
    .menu-button span{
        font-size: 30px;
        color: rgb(202, 202, 202);
        cursor: pointer
    }
    .menu-button:active{
        background: rgba(0, 0, 0, 0.062);
    }
    .backmenu{
    position: absolute;
    width: 100%;
    height: calc(var(--vh) - 50px);
    z-index: 5;
    top: 50px;
    left: 0;
}
    @media screen and (max-width: 768px) {
    .mobileMenu{
        display: block;
    }
}
</style>