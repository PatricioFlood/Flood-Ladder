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
        })
    },
    deleteNetwork(state){
        const l = state.network.length
        if(l < 2)
            return
        const n = state.selected.n
        state.network.splice(n,1)
        state.auxRow.splice(n,1)

        const newN = n==l-1?n-1:n
        state.selected = {n: newN, type:"network"}
        state.network[newN]["selected"] = true
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
    addAuxRow(state){
        const l = state.auxRow.push([]) - 1
        for(var i = 0; i<10; i++){
            state.auxRow[l].push({})
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
            delete state.auxRow[n][ab][property]
        else
            state.auxRow[n][ab][property] = value
    },

    resetAuxBox(state){
        state.auxBox = []
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
    },

    resetSymbolTable(state){
        state.symbolTable = []
    },

    deleteRowSymbolTable(state, row){
        state.symbolTable.splice(row,1)
    },

    setSymbolTableFromLocal(state,value){
        state.symbolTable = value
    },
    
    orderSymbolTable(state){
        state.symbolTable.sort(
            (a,b) => {
                const indexA = [0,0,0]
                const indexB = [0,0,0]
                const setIndex = (val, index) =>{
                    if(!val){
                        index[0] = 9999
                        return
                    } 
                    switch(val[0]){
                        case "T":
                            index[0] = 3
                            break
                        case "V":
                            index[0] = 2
                            break
                        case "Q":
                            index[0] = 1
                            break
                        case "I":
                            index[0] = 0
                            break
                    }
                    const split = val.substring(1).split(".")
                    index[1] = split[0]?parseInt(split[0]):9999
                    index[2] = split[1]?parseInt(split[1]):9999
                }
                setIndex(a.direction, indexA)
                setIndex(b.direction, indexB)
                return  indexA[0] < indexB[0] ? -1 : indexA[0] > indexB[0] ? 1 : 
                        indexA[1] < indexB[1] ? -1 : indexA[1] > indexB[1] ? 1 : 
                        indexA[2] < indexB[2] ? -1 : indexA[2] > indexB[2] ? 1 : 0
            }
        )
    },

    setNetwork(state,value){
        state.network = value
    },

    insertNetwork(state, {copyIndex, insertIndex}){
        const copyNetwork = JSON.parse(JSON.stringify(state.network[copyIndex]))
        delete copyNetwork["selected"]
        state.network.splice(insertIndex+1, 0, copyNetwork)
    },

    setProjectName(state, value){
        state.name = value
    }
}