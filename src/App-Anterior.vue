<template>
    <div class="container">
        <div class="panel-left"></div>
        <div class="principal">
            <div class="panel-top">
                <button @click="putSymbol('top')" :disabled="selected.r==0||canPut"><span class="iconl-arrow-top"></span></button>
                <button @click="putSymbol('bottom')" :disabled="canPut"><span class="iconl-arrow-bottom"></span></button>
                <button @click="putSymbol('linea')" :disabled="canPut"><span class="iconl-arrow-rigth"></span></button>
                <div class="contact">
                    <button @click="menu.contact = !menu.contact" :disabled="canPut"><span class="iconl-contact"></span></button>
                    <ul v-show="menu.contact">
                        <li @click="putSymbol('cna')">NO</li>
                        <li @click="putSymbol('cnc')">NC</li>
                        <li @click="putSymbol('n')">N</li>
                        <li @click="putSymbol('p')">P</li>
                    </ul>
                </div>
                <div class="coil">
                <button @click="menu.coil = !menu.coil" :disabled="selected.b==0||canPut"><span class="iconl-coil" ></span></button>
                    <ul v-show="menu.coil">
                        <li @click="putSymbol('bobina')">-( )</li>
                        <li @click="putSymbol('reset')">R</li>
                        <li @click="putSymbol('set')">S</li>
                    </ul>
                </div>
                <div class="blocks">
                    <button @click="menu.blocks = !menu.blocks" :disabled="selected.b==0||canPut"><span class="iconl-blocks"></span></button>
                    <ul v-show="menu.blocks">
                        <li @click="putSymbol('ton')">TON</li>
                        <li @click="putSymbol('ctu')">CTU</li>
                    </ul>
                </div>
                <button @click="deleteSymbol"><span class="material-icons trash">delete</span></button>
            </div>
            <div class="ladder">
                <div class="spreader-bar"></div>
                <div class="networks">
                    <div class="network" v-for="(i,n) in networksTot" :key="n">
                        <p>Network {{n+1}}</p>
                        <div class="row" v-for="(i,r) in  network[n].row.length" :key="r">
                            <div class="box" v-for="(i,b) in network[n].row[r].box.length" :key="b" @click="select(n,r,b)"
                                :class="[{'selected' : network[n].row[r].box[b].selected},network[n].row[r].box[b].class]">
                                <input type="text" v-model="network[n].row[r].box[b].data" v-if="network[n].row[r].box[b].input" 
                                :class="network[n].row[r].box[b].inputClass">
                                <div class="block-data1">{{network[n].row[r].box[b].blockData1}}</div>
                                <div class="block-data2">{{network[n].row[r].box[b].blockData2}}</div>
                                <div class="box-background"></div>
                            </div>
                        </div>
                        <div class="aux-row">
                            <div class="aux-box" v-for="(i,ab) in network[n].auxRow.length" :key="ab"
                            @click="select(n,-1,ab)" 
                            :class="{'selected' : network[n].auxRow[ab].selected}"></div>
                        </div>
                    </div>
                    <div @click="addNetwork">Agregar Network</div>
                </div>
            </div>
        </div>
        <div class="panel-rigth"></div>
    </div>
</template>
<script>
export default {
    name: "App",
    data() {
        return {
            selected: {n:0,r:0,b:0},
            network: [],
            menu: {
                contact: false,
                coil: false,
                blocks: false,
            },
        }
    },
    methods: {
        select(n,r,b){
            // Cierra todas las pestañas
            this.menu.contact = this.menu.coil = this.menu.blocks = false

            if(this.selected.r == -1)
                this.network[this.selected.n].auxRow[this.selected.b].selected = false
            else
                this.network[this.selected.n].row[this.selected.r].box[this.selected.b].selected = false

            this.selected.n = n
            this.selected.r = r
            this.selected.b = b

            if(r == -1)
                this.network[n].auxRow[b].selected = true
            else
                this.network[n].row[r].box[b].selected = true
        },

        addNetwork(){
            this.network.push({
                row: [],
                auxRow: []
            })

            var actualNetwork = this.networksTot-1

            this.addRow(actualNetwork)
            this.addAuxRow(actualNetwork)

            this.network[actualNetwork].row[0].box[0].symbol = "start"
            this.network[actualNetwork].row[0].box[0].class = "symbol-start"
        },

        addRow(n,row=-1){
            this.network[n].row.push({
                final: null, 
                last: -1, 
                box: []
            })

            var actualRow = this.network[n].row.length-1

            for(var i = 0; i<10; i++){
                this.addBox(n,actualRow)
            }

            if(row!=-1){
                if(this.selected.r == row)
                    this.network[this.selected.n].row[this.selected.r].box[this.selected.b].selected = false
                    
                var whiteRow = this.network[n].row[actualRow]
                for(i = actualRow; i>row; i--){
                    this.network[n].row.splice(i,1,this.network[n].row[i-1])
                }
                this.network[n].row.splice(row,1,whiteRow)

                for(i = 0; i<this.network[n].row[row].boxs.length; i++){
                    if(this.getClass(n,row+1,i).includes("top"))
                        this.setClass(n,row,i,"simbolo-top simbolo-bottom")
                }
            }
        },

        addAuxRow(n){
            for(var i = 0; i<10; i++){
                this.network[n].auxRow.push({
                    selected: false
                })
            }
        },

        addBox(n,r){
            this.network[n].row[r].box.push({
                    symbol: "",
                    data: "???", 
                    class:"", 
                    input: false, 
                    selected: false, 
                    blockData1: "",
                    blockData2: "",
                    conecction: {
                        top: false,
                        rigth: false,
                        bottom: false,
                    }
                })
        },

        deleteRow(n,r=-1){
            var rowsTot = this.network[n].row.length

            if(r== -1)
                r = rowsTot-1
            
            for(var i = r; i<rowsTot-1; i++){
                this.network[n].row.splice(i,1,this.network[n].row[i+1])
            }
            this.select(n, r-1, 0)
            this.network[n].rows.pop()
            return 
        },

        isFinal(symbol){
            return /bobina|reset|set|ton|ctu/.test(symbol)
        },

        isReplaceable(n,r,b){
            var symbol = this.getClass(n,r,b);
            return symbol == /(continuar|inicio|linea)?/.test(symbol)
        },
        isContinue(n,r,b){
            var symbol = this.getClass(n,r,b);
            return /continuar|inicio/.test(symbol)
        },
        getClass(n,r,b){
            return this.network[n].row[r].box[b].class
        },
        setClass(n,r,b,symbol){
            this.network[n].row[r].box[b].class = symbol
        },
        addClass(n,r,b,symbol){
            if(!this.getClass(n,r,b).includes(symbol))
                this.network[n].row[r].box[b].class += " " + symbol
        },
        deleteClass(n,r,b,symbol){
            this.network[n].row[r].box[b].class = this.getClass(n,r,b).replace(symbol,"")
        },
        getFinal(n,r){
            return this.network[n].row[r].final
        },
        setFinal(n,r,final){
            this.network[n].row[r].final = final
        },
        // getLast(n,r){
        //     return this.network[n].row[r].last
        // },
        getRowsTot(n){
            return this.network[n].rowsTot;
        },
        setInput(n,r,b,input){
            this.network[n].row[r].box[b].input = input
        },
        setData(n,r,b,data){
            this.network[n].row[r].box[b].data = data
        },
        setBlockData1(n,r,b,data1){
            this.network[n].row[r].box[b].blockData1 = data1
        },
        setBlockData2(n,r,b,data2){
            this.network[n].row[r].box[b].blockData2 = data2
        },
        getLast(n,r){
            return this.network[n].row[r].last
        },
        getSymbol(n,r,b){
            return this.network[n].row[r].box[b].symbol
        },
        setSymbol(n,r,b, symbol){
            this.network[n].row[r].box[b].symbol = symbol
        },
        // setLast(n,r,last){
        //     this.network[n].row[r].last = last
        // },

        putBottom(n,r,b){
            if(this.getRowsTot(n)==r+1) //Si la fila de abajo es una fila auxiliar agrega una fila real
                this.addRow(n)
            
            this.addClass(n,r+1,b,"simbolo-top")

            if((b==0 || this.getClass(n,r+1,b-1)=="") && this.getClass(n,r+1,b+1)=="")
                this.setClass(n,r+1,b+1,"simbolo-continuar")

            if(this.isReplaceable(n,r,b))
                this.putSymbol("linea",n,r,b)

            this.addClass(n,r,b,"simbolo-bottom")
            this.select(n,r+1,b+1)
        },
        putTop(n,r,b){
            this.addClass(n,r-1,b,"simbolo-bottom")

            if(this.getClass(n,r,b+1)=="simbolo-continuar")
                this.setClass(n,r,b+1,"") 
                
            if(this.isReplaceable(n,r,b))
                this.putSymbol("linea",n,r,b)

            this.addClass(n,r,b,"simbolo-top") 
            this.select(n,r-1,b+1)  
        },
        putTon(n,r,b){
            var rowsTot = this.network[n].rowsTot;
            if(r==rowsTot-1){
                this.addRow(n)
            } else if(this.getClass(n,r+1,b)!="" || this.getClass(n,r+1,b+1)!=""){
                    this.addRow(n,r+1)
            }
            this.setClass(n,r,b,"simbolo-ton")
            this.setInput(n,r,b,true)
            this.setInputClass(n,r,b,"top-input")
            this.setBlockData1(n,r,b,"100")

            this.setClass(n,r+1,b-1,"pt-input")
            this.setInput(n,r+1,b-1,true)
            this.setInputClass(n,r+1,b-1,"center-input")

            this.setFinal(n,r,b)
            this.setFinal(n,r+1,b)
        },
        setLast(n,r,b,force=false){
            if(force || (this.getLast(n,r) < b && !this.isReplaceable(n,r,b)))
                this.network[n].row[r].last = b
        },
        getConection(n,r,b){
            return this.network[n].row[r].box[b].conecction
        },

        putSymbol(symbol, n=this.selected.n, r=this.selected.r, b=this.selected.b){

            // Cierra todas las pestañas
            this.menu.contact = this.menu.coil = this.menu.blocks = false

            // Si es una fila auxiliar agrega una fila.
            if(r == -1){
                this.addRow(n)
                r = this.getRowsTot(n)-1
            }
            var previousSymbol = this.getSymbol(n,r,b)

            //Retornar si el simbolo ya está agregado
            if(symbol == previousSymbol)
                return

            var final = this.getFinal(n,r)

             // Retornar si se intenta poner un final antes que otro
            if(this.isFinal(symbol) && final && final != b)
                return

            switch(symbol){
                case "bottom":
                    this.putBottom(n,r,b)
                    return
                case "top":
                    this.putTop(n,r,b)
                    return
                case "ton":
                    this.putTon(n,r,b)
                    return
                case "ctu":
                    this.putCtu(n,r,b)
                    return
            }
    
            // Completa la primer linea
            if(r==0){
                for(var i = b-1; i>=0; i--){
                    if(this.isContinue(n,r,i) || this.getSymbol(n,r,i) == "")
                        this.setClass(n,r,i,"simbolo-linea")
                    else
                        break
                }
            }

            //Setea el simbolo
            this.setClass(n,r,b,symbol)
            
            //Setea el last
            this.setLast(n,r,b)

            //Si el simbolo anterior tenía un top o un bottom, se lo agrega
            if(previousSymbol.includes("simbolo-top"))
                this.addClass(n,r,b,"simbolo-top")
            if(previousSymbol.includes("simbolo-bottom"))
                this.addClass(n,r,b,"simbolo-bottom")
            
            // Agrega o quita un input superior
            if(/reset|set|bobina|ctu|cnc|cna|ton/.test(symbol))
                this.setInput(n,r,b,true)
            else{
                this.setInput(n,r,b,false)
                this.setData(n,r,b,"???")
            }
                

            // Determina el final o agrega un simbolo-continuar
            if(this.isFinal(symbol))
                this.setFinal(n,r,b)
            else if(!/.*(top|bottom).*/.test(this.getClass(n,r,b)) && this.getClass(n,r,b+1)==""){
                this.setFinal(n,r,null)
                this.setClass(n,r,b+1,"simbolo-continuar")
                this.select(n,r,b+1)   
            }

        },

        deleteSymbol(){
            const n = this.selected.n
            const r = this.selected.r
            const b = this.selected.b
            const symbol = this.getSymbol(n,r,b)
            const symbolBefore = b>0?this.getSymbol(n,r,b-1):""
            const conecction = this.getConection(n,r,b)
            console.log(conecction)


            if(this.isContinue(n,r,b) || symbol == "pt-input")
                return

            this.setInput(n,r,b,false)


                if(symbol.includes("simbolo-top"))
                    this.deleteClass(n,r-1,b,"simbolo-bottom")
                if(symbol.includes("simbolo-bottom"))
                    this.deleteClass(n,r+1,b,"simbolo-top")

            if(b>0 && symbolBefore != "" && symbolBefore != "simbolo-continuar" && symbolBefore != "simbolo-inicio" && symbol != "")
                this.setClass(n,r,b,"simbolo-continuar")

            else if(b==0 && r==0)
                this.setClass(n,r,b,"simbolo-inicio")
            else
                this.setClass(n,r,b,"")

            if(this.getClass(n,r,b+1) == "simbolo-continuar")
                this.setClass(n,r,b+1,"")

            if(this.isFinal(symbol))
                this.setFinal(n,r,null)
            

            if(this.getLast(n,r) == b){
                var i = b-1
                for(i; i>=0; i--){
                    if(!this.isReplaceable(n,r,i))
                        break
                }
                this.setLast(n,r,i)
            }
            if(b== 0 && r>0 && this.getLast(n,r) == -1)
                this.deleteRow(n,r)
        },
    },
    created(){
        //Inicializacion de networks

        for(var i = 0; i<10; i++){
            this.addNetwork()
        }
        this.network[0].row[0].box[0].selected = true

        //VH para CSS
        const vh = window.innerHeight;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
    computed: {
        canPut(){
            var r = this.selected.r
            if (r==-1) return false
            var n = this.selected.n
            var b = this.selected.b
            var final = this.getFinal(n,r)
            return final && b>final
        },
        networksTot(){
            return this.network.length
        }
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
            .panel-top {
                width: 100%;
                flex-grow: 1;
                height: 50px;
                background-color: rgb(117, 117, 19);
                display: flex;
                align-items: center;
                padding-left: 10px;
            }
            .panel-top button{
                padding: 3px;
                font-size: 25px;
                color: rgb(41, 41, 41);
                margin-right: 5px;
                cursor: pointer
            }
            .panel-top .trash{
                color: rgb(187, 65, 65);
            }
            .panel-top ul{
                width: 34px; 
                position: absolute;
                background-color: rgb(193, 243, 224);
                list-style:none;
                border-left: 1px solid rgba(0, 0, 0, 0.137);
                border-right: 1px solid rgba(0, 0, 0, 0.137);
                border-top: 1px solid rgba(0, 0, 0, 0.137);
                z-index: 10;
            }
            .panel-top li{
                padding-top: 5px;
                padding-bottom: 5px;
                width: 100%;
                text-align: center;
                cursor: pointer;
                border-bottom: 1px solid rgba(0, 0, 0, 0.137);
            }
            .panel-top li:hover{
                background-color: rgb(151, 202, 182);
            }
            .ladder {
                height: calc(var(--vh) - 50px);
                display: flex;
                flex-grow: 1;
                width: 100%;
            }
                .spreader-bar {
                    width: 10px;
                    flex-shrink: 0;
                    height: 100%;
                    background-color: grey;
                }
                .networks {
                    width: 280px;
                    flex-grow: 1;
                    flex-shrink: 0;
                    height: calc(var(--vh) - 50px);
                    display: flex;
                    flex-direction: column;
                    background-color: rgb(237, 238, 232);
                    overflow: auto;
                }
                    .network {
                        min-width: fit-content;
                        flex-shrink: 0;
                        background-color: rgb(171, 223, 223);
                    }
                        .network p{
                            padding: 0;
                            margin: 0;
                            margin-left: 10px;
                            margin-top: 10px;
                            margin-bottom: 10px;
                        }
                            .row{
                                height: 60px;
                                background-color: white;
                                display: flex;
                            }
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
                                
                                
                            .aux-row{
                                height: 25px;
                                background-color: white;
                                display: flex;
                            }
                                .aux-box{
                                    width: 100px;
                                    height: 25px;
                                    flex-shrink: 0;
                                    cursor: pointer;
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