<template>
    <div class="box" @click="select" :class="[{'selected' : box.selected}, box.class]">
        <input type="text" v-model="boxInput" v-if="box.input" 
        :class="box.inputClass">
        <div class="block-data1">{{box.blockData1}}</div>
        <div class="block-data2">{{box.blockData2}}</div>
        <div class="box-background"></div>
    </div>
</template>
<script>
import useStore from "vuex"
export default {
    props: {n: Number, r: Number, b: Number, box: Array},
    setup(props){
        const store = useStore()
        const boxInput = null
        const select = () => {
            store.dispatch("boxSelect", {n: props.n, r: props.r, b: props.b})
        }
        return {boxInput,select}
    }
}
</script>
<style scoped>
.box{
    width: 100px;
    height: 60px;
    flex-shrink: 0;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
    .top-input, .center-input{
        width: 100%;
        text-align: center;
        background-color: rgba(255, 255, 255, 0);
        border: none;
        font-weight: 400;
        font-size: 15px;
        height: 20px;
        position: relative;
        top: -1px;
        color: rgb(24, 24, 24);
    }
    .top-input:focus, .center-input:focus{
        outline: none;
    }
    .center-input{
        top: 19px;
        padding-right: 2px;
        text-align: right;
    }
    .box-background{
        width: 100%;
        height: 60px;
        background-image:   url("~@/assets/v-line.jpg"),
                            url("~@/assets/ladder.png");
        background-position-x: 100px,0;
        --position-y-one: 0;
        --position-y-two: 60px;
        background-position-y: var(--position-y-one),var(--position-y-two);
        background-repeat: no-repeat,no-repeat;
        background-origin: border-box;
    }
    .box:hover,.aux-box:hover{
        outline: 1px solid rgb(226, 226, 226);
        outline-offset: -1px;
    }
    .box.selected, .aux-box.selected{
        outline: 1px solid black;
        outline-offset: -1px;
    }
    
    .symbol-block-top .box-background{
        --position-y-two: 22px;
    }
    .symbol-block-middle .box-background{
        --position-y-two: -38px;
    }
    .symbol-block-bottom .box-background{
        --position-y-two:-98px;
    }
    .symbol-coil .box-background{
        --position-y-two:-136px;
    }
    .sybol-contact .box-background{
        --position-y-two:-178px;
    }
    .symbol-continue .box-background{
        --position-y-two:-218px;
    }
    .symbol-start .box-background{
        --position-y-two: -258px;
    }
    .symbol-line .box-background{
        --position-y-two: -298px;
    }
    .symbol-bottom .box-background{
        background-position-x: 98px, 0;
        --position-y-one: 30px;
    }
    .siymbol-top .box-background{
        background-position-x: 98px, 0;
        --position-y-one: -29px;
    }
    .symbol-top.symbol-bottom .box-background{
        --position-y-one: 0px;
    }
    .symbol-vertical .box-background{
        background-position-x: 98px, 0;
    }
</style>