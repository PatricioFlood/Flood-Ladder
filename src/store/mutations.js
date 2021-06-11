export default{
    //General adds
    addEmptyNetwork(state){
        state.network.push({
            row: [],
            auxRow: []
        })
    },
    addEmptyRow(state, n){
        state.network[n].row.push({
            final: null, 
            last: null, 
            box: []
    })
    },
    addAuxRow(state, n){
        for(var i = 0; i<10; i++){
            state.network[n].auxRow.push({
                selected: false
            })
    }
    },
    addEmptyBox(state, {n, r}){
        state.network[n].row[r].box.push({
            symbol: "",
            data: "???", 
            cssClass: "", 
            input: false, 
            selected: false, 
            blockData1: "",
            blockData2: "",
            connection: {
                top: false,
                right: false,
                bottom: false,
            }
        })
    },

    //Select
    setSelected(state, selected){
        state.selected = selected
    },

    //Row Setters
    setRow(state, {property, value, n, r}){
        state.network[n].row[r][property] = value
    },

    //Box setters
    setBox(state, {property, value, n, r, b}){
        state.network[n].row[r].box[b][property] = value
    },

    setAuxBox(state, {property, value, n, ab}){
        state.network[n].auxRow[ab][property] = value
    },

    setConnection(state, {top, right, bottom, all, n, r, b}){
        if(all != undefined)
            bottom = top = right = all
        if(top != undefined)
            state.network[n].row[r].box[b].conecction.top = top
        if(right != undefined)
            state.network[n].row[r].box[b].conecction.right = right
        if(bottom != undefined)
            state.network[n].row[r].box[b].conecction.top = bottom
    },
    
}