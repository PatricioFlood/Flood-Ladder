<template>
    <div class="home">
        <div class="file" @click="openLadder">
            Nuevo Proyecto
        </div>

    </div>
</template>
<script>
import { useStore } from 'vuex'
export default {
    setup() {
        const store = useStore()
        const openLadder = () => store.commit("setView", "ladder")
        return{openLadder}
    }
}
</script>
<style scoped>
    .home{
        padding: 20px;
    }
    .file{
        width: 100px;
        height: 100px;
        background-color: rgb(223, 223, 223);
        border-radius: 10%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer
    }
    .file:hover{
        opacity: 0.9;
    }
</style>