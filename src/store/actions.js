export default{

    initialize({dispatch, commit, state}, force = false){
        const local = localStorage.getItem("network")
        if(local && !force){
            commit("setNetwork", JSON.parse(local))
            const selected = JSON.parse(localStorage.getItem("selected"))
            if(selected.type == 'aux')
                commit("setAuxBox", {property: "selected", value: false, n: selected.n, ab: selected.b})
            else if(selected.type == 'box')
                commit("setBox", {property: "selected", value: false, n: selected.n, r: selected.r, b: selected.b})
            else {
                commit("setNetworkProperty", {property: "selected", value: false, n: selected.n})
            }
        } 
        else {
            for(var i = 0; i<5; i++){
                dispatch("addNetwork")
            }
        }
        commit("setBox", {property: "selected", value: true, n: 0, r: 0, b: 0})
        if(force){
            localStorage.removeItem("network",JSON.stringify(state.network))
            localStorage.removeItem("selected",JSON.stringify(state.selected))
        }
    },

    resetNetworks({commit, dispatch}){
        commit("replaceNetwork", [])
        dispatch("initialize", true)
    },

    initializeSymbolTable({commit}){
        const local = localStorage.getItem("symbolTable")
        if(local)
            commit("setSymbolTableFromLocal", JSON.parse(local))
    },

    deleteRowByDirection({state, commit}, direction){
        var deleteRow = -1
        var i = 0
        for(let row of state.symbolTable){
            if(row.direction == direction){
                deleteRow = i
                break
            }
            i++
        }  
        if(deleteRow >= 0)
            commit("deleteRowSymbolTable", deleteRow)
    },

    addNetwork({commit, state, dispatch}){
        commit("addEmptyNetwork")

        var actualNetwork = state.network.length-1

        dispatch("addRow", {n: actualNetwork})
        commit("addAuxRow", actualNetwork)
    },

    addRow({commit,state,dispatch,getters}, {n, r}){

        commit("addEmptyRow", n)
        
        var actualRow = state.network[n].row.length-1

        for(var i = 0; i<10; i++){
            commit("addEmptyBox", {n: n, r: actualRow})
        }
        if(actualRow == 0){
            dispatch("setSymbol", {symbol: "start", type: "connect", n, r: 0, b: 0})
        }
       
        
        if(r != undefined){
            if(state.selected.r == r)
            commit("setBox",{property: "selected", value: false, n: state.selected.n, r: state.selected.r, b: state.selected.b})
                
            var whiteRow = state.network[n].row[actualRow]
            for(i = actualRow; i>r; i--){
                commit("replaceRow", {n, r: i, row: state.network[n].row[i-1]})
            }
            commit("replaceRow", {n, r, row: whiteRow})

            for(i = 0; i<state.network[n].row[r].box.length; i++){
                if(getters.connection({pos: "top", n, r: r+1, b: i})){
                    dispatch("putTop", {n, r, b: i})
                    dispatch("putBottom", {n, r, b: i})
                } 
            }
        }

    },

    select({state, commit}, {n, r, b, type}){
        if((type == "box" && state.select == {n, r, b, type}) || (type == "aux" && state.select == {n, b, type}) || (type == "network" && state.select == {n, type})) 
            return

        if(state.selected.type == 'aux')
            commit("setAuxBox", {property: "selected", value: false, n: state.selected.n, ab: state.selected.b})
        else if(state.selected.type == 'box')
            commit("setBox", {property: "selected", value: false, n: state.selected.n, r: state.selected.r, b: state.selected.b})
        else{
            commit("setNetworkProperty", {property: "selected", value: false, n: state.selected.n})
        }
            
        if(type == "box"){
            commit("setSelected", {n, r, b, type})
            commit("setBox", {property: "selected", value: true, n, r, b})
        }
        else if(type == "aux"){
            commit("setSelected", {n, b, type})
            commit("setAuxBox", {property: "selected", value: true, n, ab: b})
        }
        else{
            commit("setSelected", {n, type})
            commit("setNetworkProperty", {property: "selected", value: true, n})
        }
    },

    putBottom({state,dispatch,getters}, {n, r, b}){
        if(state.network[n].row.length == r+1) //Si la fila de abajo es una fila auxiliar agrega una fila real
            dispatch("addRow", {n})
        
        dispatch("resetConnection", {add: true, pos: "bottom", n, r, b})

        if((b==0 || !getters.box({property: "symbol", n, r: r+1, b})) && !getters.box({property: "symbol", n, r: r+1, b: b+1}))
            dispatch("setSymbol", {symbol: "continue", type: "connect", n, r: r+1, b: b+1})

        if(isReplaceable(getters.box({property: "symbol", n, r, b})) && !getters.connection({pos:"top", n, r, b}))
            dispatch("putSymbol", {symbol: "line", type: "connect", n, r, b})
        
            

        dispatch("select", {n, r: r+1, b: b+1, type: "box"})
        localStorage.setItem("network",JSON.stringify(state.network))
        localStorage.setItem("selected",JSON.stringify(state.selected))
    },

    putTop({getters, dispatch, state}, {n,r,b}){
        dispatch("resetConnection", {add: true, pos: "top", n, r, b})

        if(getters.box({property: "symbol", n, r: r, b: b+1}) == "continue")
            dispatch("resetSymbol", {n, r, b: b+1})

        if((b==0 || !getters.box({property: "symbol", n, r: r-1, b})) && !getters.box({property: "symbol", n, r: r-1, b: b+1}))
            dispatch("setSymbol", {symbol: "continue", type: "connect", n, r: r-1, b: b+1})
            
        if(isReplaceable(getters.box({property: "symbol", n, r, b})) && !getters.connection({pos:"bottom", n, r, b}))
            dispatch("putSymbol", {symbol: "line", type: "connect", n, r, b})

        dispatch("select", {n, r: r-1, b: b+1, type: "box"}) 
        localStorage.setItem("network",JSON.stringify(state.network))
        localStorage.setItem("selected",JSON.stringify(state.selected))
    },

    putTon({state, getters, commit, dispatch},{n,r,b}){
        var rowsTot = state.network[n].row.length;
        if(r == rowsTot-1)
           dispatch("addRow", {n})
        else if(getters.box({property: "symbol", n, r: r+1, b}) != "" || getters.box({property: "symbol", n, r: r+1, b: b+1}) != "" || getters.box({property: "symbol", n, r: r+1, b: b-1}) != "")
            dispatch("addRow", {n, r: r+1})
        
        dispatch("putSymbol", {symbol: "ton-top", type:"block", n, r, b})
        dispatch("setSymbol", {symbol: "ton-bottom", type:"block", n, r: r+1, b})
        dispatch("setSymbol", {symbol: "center-input", type:"block", n, r: r+1, b: b-1})

        commit("setRow", {property: "final", value: b, n, r})
        commit("setRow", {property: "last", value: b, n, r})
        commit("setRow", {property: "final", value: b-1, n, r: r+1})
        commit("setRow", {property: "last", value: b-1, n, r: r+1})
        localStorage.setItem("network",JSON.stringify(state.network))
        localStorage.setItem("selected",JSON.stringify(state.selected))
    },

    putCtu({state, getters, commit, dispatch},{n,r,b}){
        var rowsTot = state.network[n].row.length;
        if(r == rowsTot-1){
            dispatch("addRow", {n})
            dispatch("addRow", {n})
        }
        else{
            if(r == rowsTot-2)
                dispatch("addRow", {n})
            if(getters.box({property: "symbol", n, r: r+1, b}) != "" || getters.box({property: "symbol", n, r: r+1, b: b+1}) != "" || getters.box({property: "symbol", n, r: r+1, b: b-1}) != "")
                dispatch("addRow", {n, r: r+1})
            if(getters.box({property: "symbol", n, r: r+2, b}) != "" || getters.box({property: "symbol", n, r: r+2, b: b+1}) != "" || getters.box({property: "symbol", n, r: r+2, b: b-1}) != "")
                dispatch("addRow", {n, r: r+2})
        } 
        
        dispatch("putSymbol", {symbol: "ctu-top", type:"block", n, r, b})
        dispatch("setSymbol", {symbol: "ctu-middle", type:"block", n, r: r+1, b})
        dispatch("setSymbol", {symbol: "ctu-bottom", type:"block", n, r: r+2, b})
        dispatch("setSymbol", {symbol: "center-input", type:"block", n, r: r+2, b: b-1})


        commit("setRow", {property: "final", value: b, n, r})
        commit("setRow", {property: "last", value: b, n, r})
        commit("setRow", {property: "final", value: b, n, r: r+1})
        commit("setRow", {property: "last", value: b, n, r: r+1})
        commit("setRow", {property: "final", value: b-1, n, r: r+2})
        commit("setRow", {property: "last", value: b-1, n, r: r+2})    
        localStorage.setItem("network",JSON.stringify(state.network))
        localStorage.setItem("selected",JSON.stringify(state.selected))
    },

    // setLast({getters, commit}, {n, r, b, force=false}){
    //     if(force || (getters.row({property: "last", n, r}) < b && isReplaceable(getters.box({property: "symbol", n, r ,b})) ))
    //         commit("setRow", {property: "last", value: b, n, r})
    // },

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
            case "block":
                switch(symbol){
                    case "ton-top":
                        cssClass = "symbol-block-top ton"
                        blockData1 = "IN"
                        blockData2 = "TON"
                        input = true
                        break
                    case "ton-bottom":
                        blockData1 = "PT"
                        blockData2 = "??? ms"
                        cssClass = "symbol-block-bottom"
                        break
                    case "ctu-top":
                        input = true
                        blockData1 = "CU"
                        blockData2 = "CTU"
                        cssClass = "symbol-block-top ctu"
                        break
                    case "ctu-middle":
                        blockData1 = "R"
                        cssClass = "symbol-block-middle"
                        break
                    case "ctu-bottom":
                        blockData1 = "PV"
                        cssClass = "symbol-block-bottom"
                        break
                    case "center-input":
                        input = true
                        cssClass = "center-input"
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
        commit("setBox", {property: "data", value: "", n, r, b})
        commit("setBox", {property: "name", value: "", n, r, b})
    },

    putSymbol({state, dispatch, commit, getters}, {symbol, type, n, r, b}){

        if(n == undefined){
            n = state.selected.n
            r = state.selected.r
            b = state.selected.b
        }

        // Si es una fila auxiliar agrega una fila.
        if(r == undefined){
            dispatch("addRow", {n})
            r = state.network[n].row.length-1
        }

        const previousSymbol = getters.box({property: "symbol", n, r, b})

        //Retornar si el simbolo ya está agregado
        if(symbol == previousSymbol)
            return

        if(previousSymbol == "ton-top" || previousSymbol == "ctu-top")
            dispatch("deleteSymbol", {n, r, b})

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
                if(isContinue(getters.box({property: "symbol", n, r, b: i})) || !getters.box({property: "symbol", n, r, b: i}))
                    dispatch("setSymbol", {symbol: "line", type: "connect", n, r, b: i})
                else
                    break
            }
        }

        //Setea el simbolo
        dispatch("setSymbol", {symbol, type, n, r, b})

        //Setea el last
        if(getters.row({property: "last", n, r}) == undefined || b > getters.row({property: "last", n, r}))
            commit("setRow", {property: "last", value: b, n, r})
        
        // Determina el final o agrega un simbolo-continuar
        if(isFinal(symbol))
            commit("setRow", {property: "final", value: b, n, r})
        else if(!getters.connection({pos: "top", n, r, b}) && !getters.connection({pos: "bottom", n, r, b}) && !getters.box({property: "symbol", n, r, b: b+1})){
            commit("setRow", {property: "final", value: null, n, r})
            dispatch("setSymbol", {symbol: "continue", type: "connect", n, r, b: b+1})
            dispatch("select", {n, r, b: b+1, type: "box"})
        }

        localStorage.setItem("network",JSON.stringify(state.network))
        localStorage.setItem("selected",JSON.stringify(state.selected))
    },

    deleteSymbol({state, commit, dispatch, getters}, {n, r, b} = {n: state.selected.n, r: state.selected.r, b: state.selected.b}){

        const symbol = getters.box({property: "symbol", n, r, b})
        const symbolBefore = b>0 ? getters.box({property: "symbol", n, r, b: b-1}) : ""
        const connection = getters.connection({pos: "all", n, r, b})
        const data = getters.box({property: "data", n, r, b})

        if(isContinue(symbol) || symbol == "center-input" || symbol == "ton-bottom")
            return

        if(symbol == "ton-top"){
            commit("setBox", {property: "symbol", value: "deleteInput", n, r: r+1, b: b-1})
            dispatch("resetSymbol", {n, r: r+1, b})
            dispatch("deleteSymbol", {n, r: r+1, b: b-1})
        }

        if(symbol == "ctu-top"){
            commit("setBox", {property: "symbol", value: "deleteInput", n, r: r+2, b: b-1})
            dispatch("deleteSymbol", {n, r: r+1, b})
            dispatch("resetSymbol", {n, r: r+2, b})
            dispatch("deleteSymbol", {n, r: r+2, b: b-1})
        }

        if(data && getters.searchSymbolTableByDirection(data) == data)
            dispatch("deleteRowByDirection", data)
        
        
        dispatch("resetSymbol", {n, r, b})

        if(connection.top)
            dispatch("resetConnection", {pos: "top", n, r, b})
        if(connection.bottom)
            dispatch("resetConnection", {pos: "bottom", n, r, b})

        if(b>0 && symbolBefore != "" && symbolBefore != "continue" && symbolBefore != "start" && symbol != ""){
            dispatch("setSymbol", {symbol: "continue", type: "connect", n, r, b})
        }
        else if(b==0 && r==0)
            dispatch("setSymbol", {symbol: "start", type: "connect", n, r, b})
            
        // Si a la derecha tiene un continue, lo borra
        if(getters.box({property: "symbol",n ,r , b:b+1}) == "continue")
            dispatch("resetSymbol", {n, r, b: b+1})

        if(isFinal(symbol))
            commit("setRow", {property: "final", value: null, n, r})

        //busca el próximo last
        if(getters.row({property: "last", n, r}) == b){
            var i = b-1
            for(i; i>=0; i--){
                if(!isReplaceable(symbol))
                    break
            }
            if(i == -1)
                i = null
            commit("setRow", {property: "last", value: i, n, r})
        }

        //Si es una row secundaria y esta vacia y se borra el primer box, borra la row entera 
        if(b== 0 && r>0 && getters.row({property: "last", n, r}) == undefined){
            dispatch("select", {n, r: r-1, b: 0, type:"box"})
            commit("deleteRow", {n, r})
        }
            
        localStorage.setItem("network",JSON.stringify(state.network))
        localStorage.setItem("selected",JSON.stringify(state.selected))
    },
}

const isFinal = (symbol) => {
    return /coil|reset|set|ton-top|ctu-top|deleteInput/.test(symbol)
}

const isReplaceable = (symbol) => {
    return /continue|start|line/.test(symbol)
}

const isContinue = (symbol) => {
    return /continue|start/.test(symbol)
}