export default{
    box: (state) => ({property, n, r, b}) => {
        if(n == undefined){
            if(state.selected.type == 'box')
                return state.network[state.selected.n].row[state.selected.r].box[state.selected.b][property]
            else
                return ""
        }
        if(property == undefined)
            return state.network[n].row[r].box[b]
        return state.network[n].row[r].box[b][property]
    },
    row: (state) => ({property, n, r}) => {
        return state.network[n].row[r][property]
    },
    connection: (state) => ({pos, n, r, b}) => {
        const connection = {
            top: state.network[n].row[r].box[b].connectionTop,
            bottom: state.network[n].row[r].box[b].connectionBottom
        }
        if(pos == "all")
            return connection
        else
            return connection[pos]
    },
    selectedFinal: (state) => { 
        return state.selected.type=='box'?state.network[state.selected.n].row[state.selected.r].final:undefined
    },
    selectedLast: (state) => {
        return state.selected.type=='box'?state.network[state.selected.n].row[state.selected.r].last:undefined
    },

    searchSymbolTable: (state) => (symbol) => {
        for(let row of state.symbolTable){
            if(row.symbol.toLowerCase() == symbol.toLowerCase() )
                return {direction: row.direction, symbol: row.symbol}
        }
        return ""
    },
    searchSymbolTableByDirection: (state) => (direction) => {
        for(let row of state.symbolTable){
            if(row.direction == direction)
                return row.symbol||direction
        }
        return ""
    },
    localProjects: () => {
        const localP = localStorage.getItem("localProjects")
        return localP?JSON.parse(localP):[]
    }
 }