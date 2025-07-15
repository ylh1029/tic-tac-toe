let game = (function() {
    let turn;
    let dimension = 3;
    let arr = [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
    ];

    function start(){
        let choice = -1;
        turn = 0;
        let board = createBoard(2);
        let end = false;

        while(!end){
            console.log(arr);
            const input = window.prompt("Input index of your choice", "");
            console.log(input[0]);
            console.log(input[1]);
            board.arrPlayer[turn].choose(input[0], input[1]);
            end = hasWon(board.arrPlayer[turn], input);
            nextTurn();
        }
    }
    
    function nextTurn(){
        turn++;
        turn = turn % 2;
        console.log(turn);
    }

    function hasWon(player, index){
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

                if(xtemp < 0 || xtemp >= 3 || ytemp < 0 || ytemp >= 3){
                    //checking for out of bounds
                    direction = -1;
                    continue;
                }

                else if(arr[xtemp][ytemp] === id){
                    if((xdir[i]*2*direction + xindex) >= 0 && (xdir[i]*2*direction + xindex) < 3 && 
                        (ydir[i]*2*direction + yindex) >= 0 && (ydir[i]*2*direction + yindex) < 3 &&
                        (arr[(xdir[i]*2*direction + xindex)][(ydir[i]*2*direction + yindex)] === id)){
                        //Go one more beyond to check that
                        return true;
                    }

                    else if((xdir[i] * -1 * direction + xindex) >= 0 && (xdir[i] * -1 * direction + xindex) < 3 && 
                            (ydir[i]*-1 * direction + yindex) >= 0 && (ydir[i]*-1 * direction+ yindex) < 3
                            && (arr[xdir[i]*-1*direction + xindex][ydir[i]*-1*direction + yindex]) === id){
                        //Go back one to check that
                        console.log((xdir[i]*-1 + xindex));
                        console.log(ydir[i]*-1 + yindex);
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

    function createBoard(numPlayer){
        let arrPlayer = [];

        function player(id){
            function choose(xindex, yindex){
                console.log(`Player id: ${id}`);
                arr[xindex][yindex] = id;
            }

            function getID(){
                return id;
            }

            return{
                choose,
                getID,
            }
        }

        for(let i = 0; i < numPlayer; i++){
            arrPlayer.push(player(i));
        }

        return{
            arrPlayer,
        }
    }

    function showResult(){
        console.log(arr);
    }
    return{
        start,
        showResult,
    }
})();

game.start();
game.showResult();




