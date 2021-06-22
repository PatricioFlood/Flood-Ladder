export default{
    initializeStateTable({commit}){
        commit("initializeStateTableNormalType", {bytes: 1, type: "Q"})
        commit("initializeStateTableNormalType", {bytes: 5, type: "I"})
        commit("initializeStateTableNormalType", {bytes: 1024, type: "V"})
        commit("initializeStateTableBlockType", {bytes: 26, type: "T"})
        commit("initializeStateTableBlockType", {bytes: 64, type: "C"})
    },

    stopLadder({commit}){
        commit("setRun", false)
        commit("resetStateTable")
    },

    async runLadder({rootState, state, commit}){ 

        if(state.run)
            return
            
        const logic = []

        commit("setRun", true)

        for(let n = 0; n<rootState.network.length; n++){

            if(rootState.network[n].row[0].box[0].symbol == "start")
                break

            const rowLength = rootState.network[n].row[0].box.length
            const stack = []
            var back = false

            const processStack = (symbol, data, data2) => {

                var sentence = "if("

                const processLoop = (stack, condition) => {

                    const reverse = condition == "&&"?"||":"&&"

                    sentence += "("
                    for(let i = 0; i < stack.length; i++){

                        if(i > 0)
                                sentence += condition

                        if(Array.isArray(stack[i]))
                            processLoop(stack[i], reverse)  
                        else 
                            sentence += stack[i]
                        
                    }
                    sentence += ")"
                }

                processLoop (stack, "&&")

                sentence += ")"

                if(symbol == "set" || symbol == "reset" || symbol == "coil"){
                    sentence += "tableImage." + data[0] + "[" + data[1] + "][" + data[3] + "] = "

                    if(symbol == "reset") sentence += "false"
                    else sentence += "true"

                    if(symbol == "coil")
                        sentence += "; else tableImage." + data[0] + "[" + data[1] + "][" + data[3] + "] = false"
                }
                if(symbol == "ton-top"){
                    sentence += "tableImage.T[" + data[1] + data[2] + "-37].count++; else tableImage.T[" + data[1] + data[2] + "-37].count = 0;"
                    sentence += "tableImage.T[" + data[1] + data[2] + "-37].state = tableImage.T[" + data[1] + data[2] + "-37].count-1>=" + data2
                }

                logic.push(sentence)
            }

            const addRow = (row, boxInit, boxEnd, stack) => {
                
                let box = boxInit
                
                while(!(back && stack.length == 0) && box < boxEnd){
                    const symbol = rootState.network[n].row[row].box[box].symbol
                    const data = rootState.network[n].row[row].box[box].data
                    const connection = rootState.network[n].row[row].box[box].connection

                    if(!back){
                        if(symbol == "line")
                            continue

                        if(symbol == "set" || symbol == "reset" || symbol == "ton-top" || symbol == "coil"){
                            processStack(symbol, data, symbol == "ton-top"?rootState.network[n].row[row+1].box[box-1].data:null)
                            back = true
                            box--
                            continue
                        }

                        stack.push([])
                        const actual = stack.length-1

                        var sentence = ""
                        
                        if(symbol == "cnc") 
                            sentence += "!"
                        
                        sentence += "tableImage." + data[0]

                        if(data[0] == "T")
                            sentence += "[" + data[1] + data[2] + "-37].state"
                        else
                            sentence += "[" + data[1] + "][" + data[3] + "]"

                        stack[actual].push(sentence)

                        if(connection.bottom){
                            if(rootState.network[n].row[row+1].box[box].symbol !== ""){
                                let b = box
                                while((b>0 && !rootState.network[n].row[row+1].box[b-1].connection.top)) b--
                                addRow(row+1,b,box+1, stack[actual])
                            }
                            
                        }
                        box++
                    } else {
                        if(connection.bottom && rootState.network[n].row[row+1].box[box+1].symbol != ""){
                            back = false
                            row++
                            box++
                        } else if (connection.bottom && rootState.network[n].row[row+1].box[box+1].connection.bottom){
                            row++
                        }
                        else {
                            if(symbol == "")
                                row--
                            box--
                            stack.pop()
                        }
                    }
                }
            }
            
            addRow(0, 0, rowLength, stack)
        }
        console.log(logic)
        while(state.run){
            const tableImage = JSON.parse(JSON.stringify(state.stateTable))

            for(let sentence of logic)
                eval(sentence)

            commit("imageToStateTable", tableImage)

            await delay(100)
        }

        
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));