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

    imageToStateTable({rootState, state, commit}, image){
        for(let row of rootState.symbolTable){
            const direction = row.direction
            if(direction && direction[0] != "I"){
                var type = direction[0]
                var bytebit = direction.substring(1).split(".")
                if(bytebit.length == 2 && state.stateTable[type][bytebit[0]][bytebit[1]] != image[type][bytebit[0]][bytebit[1]])
                    commit("setType", {type, byte: bytebit[0], bit: bytebit[1], value: image[type][bytebit[0]][bytebit[1]]})
                else if (type == "T" && (state.stateTable[type][bytebit[0] - 37].count != image[type][bytebit[0] - 37].count || 
                state.stateTable[type][bytebit[0] - 37].init != image[type][bytebit[0] - 37].init)) {
                    commit("setType", {type, byte: bytebit[0] -37, value: image[type][bytebit[0] - 37]})
                }
            }
        }
    },

    precompile({rootState, dispatch}){

        const precompiler1 = (n, r, boxEnd) => {
            for(let b = 0; b<=boxEnd; b++){
                const box = rootState.network[n].row[r].box[b]
                if(box.input && (!box.data || box.data == "???"))
                    return {n,r,b, message: "Nombre o Dirección Incorrectos"}
                if(box.symbol == "continue")
                    return {n,r,b, message: "Fila Incompleta"}

                if(box.symbol == "line" && b == 0 && (box.connectionBottom || box.connectionTop))
                    return {n,r,b, message: "Error de linea vacia"}
                

                if(b == boxEnd && (b.symbol == "cnc" || box.symbol == "cno") && !box.connectionTop 
                    && !box.connectionBottom )
                        return {n,r,b, message: "Fila Incompleta"}
                    
                //Invertir simbolos continue
                if(box.symbol == "line" && !box.connectionTop 
                && !box.connectionBottom && b!=boxEnd && rootState.network[n].row[r].final != b+1 
                && rootState.network[n].row[r].box[b+1].symbol != "line"){
                    
                    rootState.network[n].row[r].box[b].symbol = rootState.network[n].row[r].box[b+1].symbol
                    rootState.network[n].row[r].box[b].data = rootState.network[n].row[r].box[b+1].data
                    rootState.network[n].row[r].box[b].name = rootState.network[n].row[r].box[b+1].name
                    rootState.network[n].row[r].box[b].input = rootState.network[n].row[r].box[b+1].input
                    rootState.network[n].row[r].box[b].cssClass = rootState.network[n].row[r].box[b+1].cssClass

                    rootState.network[n].row[r].box[b+1].symbol = "line"
                    delete rootState.network[n].row[r].box[b+1]["data"]
                    delete rootState.network[n].row[r].box[b+1]["name"]
                    delete rootState.network[n].row[r].box[b+1]["input"]
                    rootState.network[n].row[r].box[b+1].cssClass = "symbol-line"
                    b--
                }
            }
        }

        const precompiler2 = (n, boxEnd) => {
            for(let b = 0; b<=boxEnd; b++){
                if(rootState.network[n].row[0].box[b].symbol == "line"){
                    var compress = true;
                    for(let row = 1; rootState.network[n].row[row]; row++){
                        if(rootState.network[n].row[row].box[b].symbol != "line"){
                            compress = false;
                            break
                        }
                    }
                    if(compress){
                        for(let row = 0; rootState.network[n].row[row]; row++){
                            if(b>0){
                                rootState.network[n].row[row].box[b-1].connectionBottom = rootState.network[n].row[row].box[b].connectionBottom
                                rootState.network[n].row[row].box[b-1].connectionTop = rootState.network[n].row[row].box[b].connectionTop
                            }
                            for(let bAux = b+1; bAux<=boxEnd; bAux++){
                                rootState.network[n].row[row].box[bAux-1] = {...rootState.network[n].row[row].box[bAux]}
                            }
                            rootState.network[n].row[row].box[boxEnd] = {}
                            if(rootState.network[n].row[row].final)
                                rootState.network[n].row[row].final--
                            rootState.network[n].row[row].last--
                        }
                        boxEnd--
                    }
                }
            }
        }

        for(let n = 0; n < rootState.network.length; n++){
            for(let r = 0; r < rootState.network[n].row.length; r++){
                if(rootState.network[n].row[r].box[0].symbol != "start"){

                    if(rootState.network[n].row[r].last == undefined)
                        return {n,r:r,b:0, message: "Error"}

                    let error = precompiler1(n,r,rootState.network[n].row[r].last)

                    if(error) return error

                } else {
                    break
                }
            }
        }
        for(let n = 0; n < rootState.network.length; n++){
            if(rootState.network[n].row[0].box[0].symbol != "start"){

                let error = precompiler2(n,rootState.network[n].row[0].last)

                if(error) return error

            } else {
                break
            }
        }
        dispatch("saveInLocal")

    },

    S7Compiler({rootState}){

        const line = []
        const error = []

        const checkBottomBefore = (n,r,b) => {
            if(rootState.network[n].row[r].box[b].symbol){
                var newBoxInit = b;
                while(newBoxInit > 0 && !rootState.network[n].row[r].box[newBoxInit-1].connectionTop){
                    if(!rootState.network[n].row[r].box[newBoxInit-1].symbol){
                        error.push({n,r,b: newBoxInit-1})
                        return false
                    }
                    newBoxInit--
                }
                if(b == newBoxInit){
                    line.push("O" + (rootState.network[n].row[r].box[b].symbol=="cnc"?"N ":" ") + rootState.network[n].row[r].box[newBoxInit].data)
                    if(rootState.network[n].row[r].box[b].connectionBottom)
                        checkBottomBefore(n,r+1,b)
                }
                else{
                    S7compiler(n, r, newBoxInit, b)
                    line.push("OLD")
                }
            }
            return true
        }

        const S7compiler = (n, row, boxInit, boxEnd, init = true) => {
            for(let b = boxInit; b<=boxEnd; b++){
                const symbol = rootState.network[n].row[row].box[b].symbol
                const data = rootState.network[n].row[row].box[b].data

                if(symbol == "continue"){
                    error.push({n,r: row,b: b, message: "Fila sin terminar"})
                    return
                }
                    
                if(b != boxInit && b != boxEnd && rootState.network[n].row[row].box[b-1].connectionBottom && rootState.network[n].row[row+1].box[b].symbol){
                    let hasTop = false
                    let newBoxEnd = b
                    while(rootState.network[n].row[row+1].box[newBoxEnd].symbol){
                        if(rootState.network[n].row[row+1].box[newBoxEnd].connectionTop){
                            hasTop = true
                            break
                        } 
                        newBoxEnd++
                    }
                    if(hasTop){
                        S7compiler(n, row, b, newBoxEnd)
                        line.push("ALD")
                        b = newBoxEnd
                    } else {
                        line.push("LPS")
                        S7compiler(n, row, b, boxEnd, false)
                        line.push("LPP")
                        b = b - 1
                        row = row + 1 
                        boxEnd = rootState.network[n].row[row].last
                    } 
                    continue    
                }
                if(symbol == "cnc" || symbol == "cno"){
                    line.push(((b==boxInit && init)?"LD":"A") + (symbol=="cnc"?"N ":" ") + data)

                } else {
                    if(symbol == "coil" || symbol == "set" || symbol == "reset"){
                    line.push((symbol=="coil"?"= ":symbol=="set"?"S ":"R ") + data + (symbol=="coil"?"":", 1"))
                    } else if(symbol == "ton-top"){
                    line.push("TON " + data + ", " + rootState.network[n].row[row+1].box[b-1].data)
                    }
                    if(b> 0 && rootState.network[n].row[row].box[b-1].connectionBottom){
                        row = row+1
                        b = b-1
                        boxEnd = rootState.network[n].row[row].last
                    }
                }

                if(rootState.network[n].row[row].box[b].connectionBottom){
                    if(!checkBottomBefore(n,row+1,b)) return
                }
                
            }
        }

        for(let n = 0; n < rootState.network.length; n++){
            if(rootState.network[n].row[0].box[0].symbol != "start"){
                line.push("Network " + (n+1))
                S7compiler(n,0,0,rootState.network[n].row[0].last)
            } else {
                break
            }
        }
        return {line, error}

    },

    async runLadder2({dispatch, state, commit}){

        if(state.run)
            return

        commit("setRun", true)

        const S7Compile = await dispatch("S7Compiler")

        if((S7Compile.error).length > 0)
            return {error: S7Compile.error}

        const line = S7Compile.line

        var stack = []
        var stackElse = []
        const logic = []

        const getTableImage = (dir) => {
            var image = "tableImage." + dir[0]
            if(dir[0] == "Q" || dir[0] == "I" || dir[0] == "V"){
                const bytebit = dir.substring(1).split(".")
                image += "[" + bytebit[0] + "][" + bytebit[1] + "]"
            }
            else if(dir[0] == "T"){
                const byte = (parseInt(dir.substring(1)) - 37).toString()
                image += "[" + byte + "]"
            } 
            else if(dir[0] == "C"){
                const byte = dir.substring(1)
                image += "[" + byte + "]"
            }
            return image
        }

        const stackContact = (dir, n = false) => {
            var image = (n?"!":"") + getTableImage(dir)
            if(dir[0] == "T" || dir[0] == "C")
                image += ".state"
            stack[stack.length-1] += image
        }

        const pushLogic = (funct, dir, param) => {
            dir = dir.replace(",","")
            var image = getTableImage(dir)
            var sentence = ""
            const last = stack[stack.length-1][stack[stack.length-1].length-1]
            if(last != ";"){
                stackElse.push("")
                sentence += "){"
            }
            if(funct == "S" || funct == "R" || funct == "="){
                if(dir[0] == "T" || dir[0] == "C")
                    image += ".state"
                sentence += image + "="
                sentence += funct=="R"?"false":"true"
                if(funct == "=")
                    stackElse[stackElse.length-1] += image + "=false;"
            }
            if(funct == "TON"){
                sentence += "if(!" + image + ".init){"+ image +".init = Date.now()}"
                sentence += image + ".count = Math.round((Date.now() - "+ image + ".init)/100);"
                sentence += image + ".state =" + image + ".count >=" + (parseInt(param)-1).toString() + ";"
                stackElse[stackElse.length-1] += image + ".count = 0;" + image + ".init = 0;" + image + ".state = false;"
            }
            stack[stack.length-1] += sentence + ";"
        }

        const getElse = () => {
            var sentenceElse = "}"
            var popElse = stackElse.pop()
            if(popElse){
                sentenceElse += "else{" + popElse + "}"
            } 
            return sentenceElse + ";"
        }

        const getAllElse = () => {
            var sentenceElse = ""
            while(stackElse.length > 0){
                sentenceElse += getElse()
            }
            return sentenceElse
        }

        for(let l of line){
            if(l.includes("Network")){
                if(stack.length > 0){
                    logic.push("if(" + stack[0] + getAllElse())
                }
                stack = []
                stackElse = []
            } else {
                const split = l.split(" ")
                const func = split[0]
                const dir = split[1]
                const param = split[2]

                if(func == "LD" || func == "LDN"){
                    stack.push("")
                    stackContact(dir, func == "LDN")
                }
                else if(func == "A" || func == "AN"){
                    const last = stack[stack.length-1][stack[stack.length-1].length-1]
                    if(last == undefined ||last == "{" || last == ";")
                        stack[stack.length-1] += "if("
                    else
                        stack[stack.length-1] += "&&"
                    stackContact(dir, func == "AN")
                }
                else if(func == "O" || func == "ON"){
                    stack[stack.length-1] += "||"
                    stackContact(dir, func == "ON")
                }
                else if(func == "ALD" || func == "OLD"){
                    const second = stack.pop()
                    const first = stack.pop()
                    const last = first[first.length-1]
                    if(func == "ALD" && last == ";"){
                        stack.push( first + "if(" + second + getElse())
                    }
                    else
                        stack.push("(" + first + ")" + (func == "ALD"?"&&":"||") + "(" + second + ")")
                }
                else if(func == "LPS"){
                    stack.push("")
                }
                else if(func == "LPP"){
                    const second = stack.pop() + getElse()
                    const first = stack.pop()
                    if(first[first.length-1] == ";"){
                        stack.push(first + second)
                    } else {
                        stack.push(first + "){" + second)
                        stackElse.push("")
                    }
                }
                else if(func == "S" || func == "R" || func == "=" || func == "TON" || func == "CTU"){
                    pushLogic(func, dir, param)
                }
            }
        }

        logic.push("if(" + stack[0] + getAllElse())

        while(state.run){
            const tableImage = JSON.parse(JSON.stringify(state.stateTable))

            for(let sentence of logic)
                eval(sentence)

            dispatch("imageToStateTable", tableImage)
            await delay(50)
        }

    },
    async generateS7File({dispatch}){
        const S7Compile = await dispatch("S7Compiler")

        if((S7Compile.error).length > 0)
            return {error: S7Compile.error}

        const line = S7Compile.line

        var awl = "ORGANIZATION_BLOCK MAIN:OB1" + "\n"
        awl += "BEGIN" + "\n"
        for(let l of line){
            awl += l + "\n"
        }
        awl += "END_ORGANIZATION_BLOCK"

        var title = prompt("Nombre del archivo");
        if(!title)
            return
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(awl));
        element.setAttribute('download', title + ".awl");
        element.click();
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));