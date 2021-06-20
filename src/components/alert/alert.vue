<template>
    <div class="alert-background" @click="$emit('close')"></div>
    <div class="alert">
        <div class="slot"><slot/></div>
        <div class="buttons">
            <button class="no" @click="$emit('close')"><span class="material-icons">clear</span></button>
            <button class="yes" @click="$emit('check')"><span class="material-icons">done</span></button>
        </div>
    </div>
</template>
<script>
export default {
    emits: ['close', 'check'],
}
</script>
<style scoped>
    .alert-background{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--vh);
        z-index: 50;
        background: black;
        opacity: 0.4;
    }
    .alert{
        position: absolute;
        top: calc(50% - 50px);
        left: calc(50% - 100px);
        width: 200px;
        height: 100px;
        z-index: 60;
        background: rgb(225, 243, 237);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .slot{
        margin: 10px;
        text-align: center;
        font-size: 18px;
        line-height: 1.4;
    }
    .buttons{
        width: 100%;
        display: flex;
    }
    button{
        flex-grow: 1;
        border:none;
        color: rgb(199, 199, 199);
        cursor: pointer;
    }
    button:hover{
        opacity: 0.9;
    }
    .no{
        background: rgb(141, 21, 21);
    }
    .yes{
        background: green;
    }
</style>