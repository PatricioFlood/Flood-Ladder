export default{
    initializeStateTableNormalType(state, {bytes, type}){
        for(let byte = 0; byte<bytes; byte++){
            state.stateTable[type].push([])
            for(let bit = 0; bit < 7; bit++){
                state.stateTable[type][byte].push(false)
            }
        }
    },
    initializeStateTableBlockType(state, {bytes, type}){
        for(let byte = 0; byte<bytes; byte++){
            state.stateTable[type].push({state: false, count: 0})
        }
    },

    resetStateTable(state){
        const resetNormal = (bytes, type) => {
            for(let byte = 0; byte<bytes; byte++){
                for(let bit = 0; bit < 7; bit++){
                    if(state.stateTable[type][byte][bit] != 0)
                        state.stateTable[type][byte][bit] = 0
                }
            }
        }
        const resetBlock = (bytes, type) => {
            for(let byte = 0; byte<bytes; byte++){
                if(state.stateTable[type][byte] != {state: false, count: 0})
                    state.stateTable[type][byte] = {state: false, count: 0}
            }
        }
        resetNormal(1,"Q")
        resetNormal(5,"I")
        resetNormal(1024,"V")
        resetBlock(26,"T")
        resetBlock(64,"C")
    },

    setI(state,{byte, bit, value}){
        state.stateTable.I[byte][bit] = value
    },

    setType(state, {type, byte, bit, value}){
        state.stateTable[type][byte][bit] = value
    },

    imageToStateTable(state, image){
        const inputs = JSON.parse(JSON.stringify(state.stateTable.I))
        state.stateTable = image
        state.stateTable.I = inputs
    },
    setRun(state, value){
        state.run = value
    },
    setPanelRun(state, value){
        state.panelRun = value
    }
}