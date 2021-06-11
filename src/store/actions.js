export default{

    initialize({dispatch, commit}){
        for(var i = 0; i<10; i++){
            dispatch("addNetwork")
        }
        commit("setBox", {property: "selected", value: true, n: 0, r: 0, b: 0})
    },

    addNetwork({commit, state, dispatch}){
        commit("addEmptyNetwork")

        var actualNetwork = state.network.length-1

        dispatch("addRow", actualNetwork)
        commit("addAuxRow", actualNetwork)
    },

    addRow({commit,state}, n){

        commit("addEmptyRow", n)
        
        var actualRow = state.network[n].row.length-1

        for(var i = 0; i<10; i++){
            commit("addEmptyBox", {n: n, r: actualRow})
        }
        commit("setBox", {property: "symbol", value: "start", n, r: 0, b: 0})
        commit("setBox", {property: "cssClass", value: "symbol-start", n, r: 0, b: 0})

        // if(!row){
        //   console.log("no hay row")
        // }
        // if(row==undefined){
        //     if(state.selected.r == row)
        //         this.network[this.selected.n].row[this.selected.r].box[this.selected.b].selected = false
                
        //     var whiteRow = this.network[n].row[actualRow]
        //     for(i = actualRow; i>row; i--){
        //         this.network[n].row.splice(i,1,this.network[n].row[i-1])
        //     }
        //     this.network[n].row.splice(row,1,whiteRow)

        //     for(i = 0; i<this.network[n].row[row].boxs.length; i++){
        //         if(this.getClass(n,row+1,i).includes("top"))
        //             this.setClass(n,row,i,"simbolo-top simbolo-bottom")
        //     }
    },

    select({state, commit}, {n, r, b, ab}){

        if(state.select == {n, r, b} || state.select == {n: n, r: -1, b: ab}) 
            return

        if(state.selected.r == -1)
            commit("setAuxBox", {property: "selected", value: false, n: state.selected.n, ab: state.selected.b})
        else
            commit("setBox", {property: "selected", value: false, n: state.selected.n, r: state.selected.r, b: state.selected.b})
            
        if(ab == undefined){
            commit("setSelected", {n, r, b})
            commit("setBox", {property: "selected", value: true, n, r, b})
        }
        else{
            commit("setSelected", {n, r: -1, b: ab})
            commit("setAuxBox", {property: "selected", value: true, n, ab})
        }
            
    },

    putBottom({getters},n,r,b){
        if(this.getRowsTot(n)==r+1) //Si la fila de abajo es una fila auxiliar agrega una fila real
            this.addRow(n)
        
        this.addClass(n,r+1,b,"simbolo-top")

        if((b==0 || this.getClass(n,r+1,b-1)=="") && this.getClass(n,r+1,b+1)=="")
            this.setClass(n,r+1,b+1,"simbolo-continuar")

        if(this.isReplaceable(getters.box({property: "symbol", n, r, b})))
            this.putSymbol("linea",n,r,b)

        this.addClass(n,r,b,"simbolo-bottom")
        this.select(n,r+1,b+1)
    },

    putTop({getters},n,r,b){
        this.addClass(n,r-1,b,"simbolo-bottom")

        if(this.getClass(n,r,b+1)=="simbolo-continuar")
            this.setClass(n,r,b+1,"") 
            
        if(this.isReplaceable(getters.box({property: "symbol", n, r, b})))
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

    setLast({getters, commit}, {n, r, b, force=false}){
        if(force || (getters.row({property: "last", n, r}) < b && isReplaceable(getters.box({property: "symbol", n, r ,b})) ))
            commit("setRow", {property: "last", value: b, n, r})
    },

    resetConnection({commit}, {add, pos, n, r, b}){
        var rTop = r
        var rBottom = r-1
        if(pos == "bottom"){
            rTop = r+1 
            rBottom = r
        }
        commit("setConnection", {top: add?true:false, n, r: rTop , b})
        commit("setConnection", {bottom: add?true:false, n, r: rBottom, b})
    },

    setSymbol({commit}, {symbol, type, n, r, b}){
        var cssClass = ""
        var blockData1 = ""
        var blockData2 = ""
        var input = false
        commit("setBox", {property: "symbol", value: symbol, n, r, b})
        switch(type){
            case "contact":
                cssClass = "symbol-contact"
                switch(symbol){
                    case "cnc":
                        input = true
                        blockData1 = "/"
                        break
                    case "n":
                        blockData1 = "N"
                        break
                    case "p":
                        blockData1 = "P"
                        break
                    default:
                        input = true
                }
                break
            case "coil":
                cssClass = "symbol-coil"
                input = true
                switch(symbol){
                    case "set":
                        blockData1 = "S"
                        break
                    case "reset":
                        blockData1 = "R"
                        break
                }
                break
            case "connect":
                switch(symbol){
                    case "line":
                        cssClass = "symbol-line"
                        break
                    case "continue":
                        cssClass = "symbol-continue"
                        break
                    case "start":
                        cssClass = "symbol-start"
                        break
                }
                break
        }
        commit("setBox", {property: "cssClass", value: cssClass, n, r, b})
        commit("setBox", {property: "blockData1", value: blockData1, n, r, b})
        commit("setBox", {property: "blockData2", value: blockData2, n, r, b})
        commit("setBox", {property: "input", value: input, n, r, b})
    },
    resetSymbol({commit}, {n,r,b}){
        commit("setBox", {property: "symbol", value: "", n, r, b})
        commit("setBox", {property: "cssClass", value: "", n, r, b})
        commit("setBox", {property: "blockData1", value: "", n, r, b})
        commit("setBox", {property: "blockData2", value: "", n, r, b})
        commit("setBox", {property: "input", value: false, n, r, b})
        commit("setBox", {property: "data", value: "???", n, r, b})
    },

    putSymbol({state, dispatch, commit, getters}, {symbol, type, n, r, b}){

        if(n == undefined){
            n = state.selected.n
            r = state.selected.r
            b = state.selected.b
        }

        // Si es una fila auxiliar agrega una fila.
        if(r == -1){
            dispatch("addRow", n)
            r = state.network[n].row.length-1
        }

        const previousSymbol = getters.box({property: "symbol", n, r, b})

        //Retornar si el simbolo ya está agregado
        if(symbol == previousSymbol)
            return

        switch(symbol){
            case "bottom":
                dispatch("putBottom", {n, r, b})
                return
            case "top":
                dispatch("putTop", {n, r, b})
                return
            case "ton":
                dispatch("putTon", {n, r, b})
                return
            case "ctu":
                dispatch("putCtu", {n, r, b})
                return
        }

        // Completa la primer linea
        if(r==0){
            for(var i = b-1; i>=0; i--){
                if(isContinue(getters.box({property: "symbol", n, r, b: i})) || getters.box({property: "symbol", n, r, b: i}) == "")
                    dispatch("setSymbol", {symbol: "line", type: "connect", n, r, b: i})
                else
                    break
            }
        }

        //Setea el simbolo
        dispatch("setSymbol", {symbol, type, n, r, b})

        //Setea el last
        if(b > getters.row({property: "last", n, r}))
            commit("setRow", {property: "last", value: b, n, r})
        
            

        // Determina el final o agrega un simbolo-continuar
        if(isFinal(symbol))
            commit("setRow", {property: "final", value: b, n, r})
        else if(!getters.connection({pos: "top", n, r, b}) && !getters.connection({pos: "bottom", n, r, b}) && getters.box({property: "symbol", n, r, b: b+1})==""){
            commit("setRow", {property: "final", value: null, n, r})
            dispatch("setSymbol", {symbol: "continue", type: "connect", n, r, b: b+1})
            dispatch("select", {n, r, b: b+1})   
        }

    },

    deleteSymbol({state, commit, dispatch, getters}){
        const n = state.selected.n
        const r = state.selected.r
        const b = state.selected.b
        const symbol = getters.box({property: "symbol", n, r, b})
        const symbolBefore = b>0?getters.box({property: "symbol", n, r, b: b-1}):""
        const connection = getters.connection("all", n, r, b)


        if(isContinue(getters.box({property: "symbol", n, r, b})) || symbol == "pt-input")
            return

        commit("setBox", {property: "input", value: "false", n, r, b})
        commit("setBox", {property: "symbol", value: "", n, r, b})

        if(connection.top)
            dispatch("resetConnection", {pos: "top", n, r, b})
        if(connection.bottom)
            dispatch("resetConnection", {pos: "bottom", n, r, b})

        if(b>0 && symbolBefore != "" && symbolBefore != "continue" && symbolBefore != "start" && symbol != ""){
            dispatch("setSymbol", {symbol: "continue", type: "connect", n, r, b})
        }
        else if(b==0 && r==0)
            dispatch("setSymbol", {symbol: "start", type: "connect", n, r, b})
        else
            dispatch("resetSymbol", {n, r, b})


        if(getters.box({property: "symbol",n ,r , b:b+1}) == "simbolo-continuar")
            dispatch("resetSymbol", {n, r, b: b+1})

        if(dispatch("isFinal", symbol))
            commit("setRow", {property: "final", value: null, n, r})

        if(getters.row({property: "last", n, r}) == b){
            var i = b-1
            for(i; i>=0; i--){
                if(isReplaceable(symbol))
                    break
            }
            this.setLast(n,r,i)
        }
        if(b== 0 && r>0 && getters.row({property: "last", n, r} == -1))
            commit("deleteRow", {n, r})
    },
}

const isFinal = (symbol) => {
    return /coil|reset|set|ton|ctu/.test(symbol)
}

const isReplaceable = (symbol) => {
    return /(continue|start|line)?/.test(symbol)
}

const isContinue = (symbol) => {
    return /continue|start/.test(symbol)
}