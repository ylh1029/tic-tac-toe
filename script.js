let game = (function() {
    let turn;

    function start(numPlayer, dimension){
        turn = 0;
        domControl.createBox(numPlayer, dimension);
        let board = createBoard(numPlayer, dimension);
        let end = false;

        while(!end){
            // board.printGrid();
            let input;
            if(board.playerGetIndex(turn).getType() === "player"){
                const available = board.getAvailable();
                available.forEach(element => {
                    domControl.clickEvent(element);
                });
            }
            
            else{
                input = "--";
            }

            input = board.playerGetIndex(turn).choose(input[0], input[1]);
            domControl.applyChange(turn, input[0], input[1], dimension);
            end = hasWon(board.playerGetIndex(turn), input, board, dimension);
            nextTurn();
        }

        // board.printGrid();
    }
    
    function nextTurn(){
        turn++;
        turn = turn % 2;
    }

    function hasWon(player, index, board, dimension){
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

                // console.log(`Before checking xtemp: ${xtemp}`);
                // console.log(`Before checking ytemp: ${ytemp}`);
                // console.log(`Before checking dimension: ${dimension}`);


                if(xtemp < 0 || xtemp >= dimension || ytemp < 0 || ytemp >= dimension){
                    //checking for out of bounds
                    direction = -1;
                    continue;
                }

                else if(board.getGrid(xtemp, ytemp) === id){
                    // console.log(`xindex: ${ytemp}`);
                    // console.log(`yindex: ${xtemp}`);

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
                        // console.log(`xindex (next): ${xdir[i]*-1*direction + xindex}`);
                        // console.log(`yindex (next): ${ydir[i]*-1*direction + yindex}`);
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

        // function printGrid(){
        //     console.log(boardArr);
        // }

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

        declarePlayers(numPlayer);
        createGrid(dimension);

        return{
            playerGetIndex,
            getGrid,
            createGrid,
            getAvailable, 
        }
    }

    return{
        start,
    }
})();

let domControl = (function() {
    function getGrid(){
        return document.querySelectorAll(".box");
    }

    function getButton(){
        return document.querySelector("button");
    }

    function getID(id){
        return document.querySelector(`#${id}`);
    }

    function getDialog(){
        return document.querySelector("dialog");
    }

    function getGameStatus(){
        return document.querySelectorAll(".gameStatus");
    }

    function modal(){
        const dialog = getDialog();
        const button = getButton();
        const close = getID("close");
        const newGame = getID("new");
        const getDimension = getID("dimension");
        const radio = document.querySelectorAll("#players");
        button.addEventListener("click", () => {
            dialog.showModal();
        });

        close.addEventListener("click", () => {
            closeModal();
            getDimension.value = "";
        });

        newGame.addEventListener("click", () => {
            const dimension = getDimension.value;
            let numPlayer = -1;
            radio.forEach(button => {
                if(button.checked){
                    numPlayer = button.value;
                }
            });

            if(dimension < 3){
                alert("Please input a dimension larger than 2.");
                return;
            }

            if(numPlayer === -1){
                alert("Please select the number of player.");
                return;
            }
            
            closeModal();
            game.start(Number(numPlayer), Number(dimension));
        });

        function closeModal(){
            dialog.close();
            getDimension.value = "";
            radio.forEach(button => {
                button.checked = false;
            });
        };
    }

    function createBox(numPlayer, dimension){
        const status = getGameStatus();
        console.log(status);
        if(numPlayer == 1){
            status[0].textContent = "Player's turn";
            status[1].textContent = "Computer's turn";
        }

        else{
            status[0].textContent = "Player 1's turn";
            status[1].textContent = "Player 2's turn";
        }

        status[0].style.display = "none";
        status[1].style.display = "none";

        let boxes = document.querySelectorAll(".box");
        console.log(boxes[0]);
        while(boxes[0] != undefined){
            console.log("hello");
            boxes[0].remove();
            boxes = document.querySelectorAll(".box");
        }

        const board = getID("board");
        board.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
        for(let i = 0; i < dimension; i++){
            for(let j = 0; j < dimension; j++){
                const box = document.createElement("div");
                box.classList.add("box");
                if(i === 0){
                    box.classList.add("top");
                }

                if(i === dimension-1){
                    box.classList.add("bottom");
                }

                if (j === 0){
                    box.classList.add("left");
                }

                if(j === dimension-1){
                    box.classList.add("right");
                }
                box.style.width = `${(628-28)/dimension}px`;
                box.style.height = `${(628-28)/dimension}px`;
                board.append(box);
            }
        }
    };

    function applyChange(turn, xindex, yindex, dimension){
        const box = document.querySelectorAll(".box");
        const side = (628-28)/dimension;
        let image = document.createElement("img");
        if(turn == 1){
            image.src = ("images/Ellipse_1.png");
        }

        else{
            image.src = ("images/Rectangle_1.png");
        }

        image.style.height = `${side-50}px`;
        image.style.width = `${side-50}px`;

        console.log(`xindex: ${Number(xindex)}`);
        console.log(`yindex: ${Number(yindex)}`);
        console.log(`dimension: ${Number(dimension)}`);

        console.log((Number(xindex)*Number(dimension)+Number(yindex)));
        console.log(box[(Number(xindex)*Number(dimension)+Number(yindex))]);
        box[(Number(xindex)*Number(dimension)+Number(yindex))].append(image);
    }

    function clickEvent(index){
        
    }

    function load(){
        modal();
    }

    return{
        load,
        createBox,
        getID,
        applyChange,
        clickEvent
    }
})();

domControl.load();