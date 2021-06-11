export default{
    box: (state) => ({property, n, r, b}) => {
        if(n == undefined){
            if(state.selected.r > -1)
                return state.network[state.selected.n].row[state.selected.r].box[state.selected.b][property]
            else
                return ""
        }
        return state.network[n].row[r].box[b][property]
    },
    row: (state) => ({property, n, r}) => {
        return state.network[n].row[r][property]
    },
    connection: (state) => ({pos, n, r, b}) => {
        const connection = state.network[n].row[r].box[b].connection
        if(pos == "all")
            return connection
        else
            return connection[pos]
    },
    selectedFinal: (state) => { 
        return state.selected.r>-1?state.network[state.selected.n].row[state.selected.r].final:null
    },
    selectedLast: (state) => {
        return state.selected.r>-1?state.network[state.selected.n].row[state.selected.r].last:null
    }
}