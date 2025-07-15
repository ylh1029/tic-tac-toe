let game = (function() {
    let turn;
    const dimension = window.prompt("Input the number of grid on each side.");
    const numPlayer = window.prompt("Input the nuhmber of players (1 or 2)");

    function start(){
        turn = 0;
        let board = createBoard(numPlayer, dimension);
        let end = false;

        while(!end){
            board.printGrid();
            let input;
            if(board.playerGetIndex(turn).getType() === "player"){
                input = window.prompt("Input index of your choice", "");                
            }
            
            else{
                input = "--";
            }

            input = board.playerGetIndex(turn).choose(input[0], input[1]);
            end = hasWon(board.playerGetIndex(turn), input, board);
            nextTurn();
        }

        board.printGrid();
    }
    
    function nextTurn(){
        turn++;
        turn = turn % 2;
    }

    function hasWon(player, index, board){
        let ydir = [1, 1, 0, -1];
        let xdir = [0, 1, 1, 1];
        const xindex = Number(index[0]);
        const yindex = Number(index[1]);
        const id = player.getID();

        for(let i = 0; i < 4; i++){
            let direction = 1;
            //This index is for looping through the main array. 
            for(let j = 0; j < 2; j++){
                //This loop is for swapping directions to check for both. 
                xtemp = (xdir[i]*direction + xindex);
                ytemp = (ydir[i]*direction + yindex);

                console.log(xtemp);
                console.log(ytemp);
                if(xtemp < 0 || xtemp >= dimension || ytemp < 0 || ytemp >= dimension){
                    //checking for out of bounds
                    direction = -1;
                    continue;
                }

                else if(board.getGrid(xtemp, ytemp) === id){
                    console.log(`xindex: ${ytemp}`);
                    console.log(`yindex: ${xtemp}`);

                    if((xdir[i]*2*direction + xindex) >= 0 && (xdir[i]*2*direction + xindex) < dimension && 
                        (ydir[i]*2*direction + yindex) >= 0 && (ydir[i]*2*direction + yindex) < dimension &&
                        (board.getGrid(xdir[i]*2*direction + xindex, ydir[i]*2*direction + yindex) === id)){
                        //Go one more beyond to check that
                        return true;
                    }

                    else if((xdir[i] * -1 * direction + xindex) >= 0 && (xdir[i] * -1 * direction + xindex) < dimension && 
                            (ydir[i]*-1 * direction + yindex) >= 0 && (ydir[i]*-1 * direction+ yindex) < dimension
                            && (board.getGrid(xdir[i]*-1*direction + xindex, ydir[i]*-1*direction + yindex) === id)){
                        //Go back one to check that
                        console.log(`xindex (next): ${xdir[i]*-1*direction + xindex}`);
                        console.log(`yindex (next): ${ydir[i]*-1*direction + yindex}`);
                        return true;
                    }

                    else{
                        direction = -1;
                        continue;
                    }
                }

                else{
                    direction = -1;
                    continue;
                }
            }
        }

        return false;
    }

    function createBoard(numPlayer, dimension){
        let arrPlayer = [];
        let boardArr = [];

        function createGrid(dimension){
            for(let i = 0; i < dimension; i++){
                let temp = [];
                for(let j = 0; j < dimension; j++){
                    temp.push(-1);
                }
                boardArr.push(temp);
            }
        }

        function player(id){
            const type = "player";

            function choose(xindex, yindex){
                return changeGrid(xindex, yindex, id);
            }

            function getID(){
                return id;
            }

            function getType(){
                return type;
            }

            return{
                choose,
                getID,
                getType,
            }
        }

        function cp(id){
            const type = "cp";

            function choose(xindex, yindex){
                //let changed = false;
                const available = getAvailable();
                // available.forEach(element => {
                //     if(hasWon(arrPlayer[1], element, board)){
                //         xindex = element[0];
                //         yindex = element[1];
                //         changed = true;
                //     }
                // });

                // if(!changed){
                console.log(available[0][1]);
                xindex = available[0][0];
                yindex = available[0][1];
                // }

                return changeGrid(xindex, yindex, id);
            }

            function getID(){
                return id;
            }

            function getType(){
                return type;
            }
            
            return{
                choose,
                getID,
                getType,
            }
        }

        function playerGetIndex(index){
            return arrPlayer[index];
        }

        function changeGrid(xindex, yindex, id){
            if(boardArr[xindex][yindex] === -1){
                boardArr[xindex][yindex] = id;
            }

            else{
                console.log("This grid is taken. Choose another one.");
            }

            return xindex.toString()+yindex.toString();
        }

        function printGrid(){
            console.log(boardArr);
        }

        function getGrid(xindex, yindex){
            return boardArr[xindex][yindex];
        }

        function getAvailable(){
            let result = [];
            for(let i = 0; i < dimension; i++){
                for(let j = 0; j < dimension; j++){
                    if(boardArr[i][j] === -1){
                        result.push(`${i}${j}`);
                    }
                }
            }
            return result;
        }

        function declarePlayers(numPlayer){
            for(let i = 0; i < numPlayer; i++){
                arrPlayer.push(player(i));
            }

            if(numPlayer == 1){
                arrPlayer.push(cp(1));
            }
        }

        createGrid(dimension);
        declarePlayers(numPlayer);

        console.log(`Player: ${arrPlayer}`);
        console.log(`Player 1: ${arrPlayer[0]}`);
        console.log(`Player 2: ${arrPlayer[1]}`);


        return{
            playerGetIndex,
            printGrid,
            getGrid,
        }
    }

    return{
        start,
    }
})();

game.start();




