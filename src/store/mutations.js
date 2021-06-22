export default{

    setView(state, view){
        state.currentView = view
    },

    //General adds
    replaceNetwork(state, value){
        state.network = value
    },
    addEmptyNetwork(state){
        state.network.push({
            row: [],
            auxRow: []
        })
    },
    deleteNetwork(state){
        if(state.network.length < 2)
            return
        const n = state.selected.n
        const newN = n>0?n-1:0
        state.selected = {n: newN, type:"network"}
        state.network[newN].selected = true
        state.network.splice(n,1)
        localStorage.setItem("network",JSON.stringify(state.network))
        localStorage.setItem("selected",JSON.stringify(state.selected))
    },

    addEmptyRow(state, n){
        state.network[n].row.push({
            box: []
        })
    },
    replaceRow(state, {n,r,row}){
        state.network[n].row.splice(r,1,row)
    },
    deleteRow(state, {n,r}){
        var rowsTot = state.network[n].row.length

        if(r == undefined)
            r = rowsTot-1
        
        for(var i = r; i<rowsTot-1; i++){
            state.network[n].row.splice(i,1,state.network[n].row[i+1])
        }
        state.network[n].row.pop()
        return 
    },
    addAuxRow(state, n){
        for(var i = 0; i<10; i++){
            state.network[n].auxRow.push({})
    }
    },
    addEmptyBox(state, {n, r}){
        state.network[n].row[r].box.push({})
    },

    //Select
    setSelected(state, selected){
        state.selected = selected
    },

    //Row Setters
    setRow(state, {property, value, n, r}){
        if(value !== 0 && !value)
            delete state.network[n].row[r][property]
        else
            state.network[n].row[r][property] = value
    },

    //Box setters
    setBox(state, {property, value, n, r, b}){
        if(value !== 0 && !value)
            delete state.network[n].row[r].box[b][property]
        else
            state.network[n].row[r].box[b][property] = value
    },

    setAuxBox(state, {property, value, n, ab}){
        if(value !== 0 && !value)
            delete state.network[n].auxRow[ab][property]
        else
            state.network[n].auxRow[ab][property] = value
    },

    setNetworkProperty(state, {property, value, n}){
        state.network[n][property] = value
    },

    setConnection(state, {top, bottom, all, n, r, b}){
        if(all != undefined)
            bottom = top = all
        if(top != undefined)
            state.network[n].row[r].box[b].connectionTop = top
        if(bottom != undefined)
            state.network[n].row[r].box[b].connectionBottom = bottom
    },

    //symbolTable
    addRowToSymbolTable(state){
        state.symbolTable.push({
            symbol: "",
            direction: "",
            comment: "",
        })
    },
    setSymbolTable(state, {property, value, row}){
        state.symbolTable[row][property] = value
        localStorage.setItem("symbolTable",JSON.stringify(state.symbolTable))
    },

    resetSymbolTable(state){
        state.symbolTable = []
        localStorage.setItem("symbolTable",JSON.stringify(state.symbolTable))
    },

    deleteRowSymbolTable(state, row){
        state.symbolTable.splice(row,1)
        localStorage.setItem("symbolTable",JSON.stringify(state.symbolTable))
    },

    setSymbolTableFromLocal(state,value){
        state.symbolTable = value
    },
    
    setNetwork(state,value){
        state.network = value
    }
}