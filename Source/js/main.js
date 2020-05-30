// main.js


main = function(canvasId, intervals = 33.333){  
    /**
     * App Entry point
     * 
     * 
     * `args`            dict of arguments
     * `intervals`   time in milliseconds that the app should request data from the server
     * 
     * `returns`        Null
     */

    // Set up and config

    var gameSettings = {
        canvasWidth: window.innerWidth - 15,
        canvasHeight: window.innerHeight - 100,
        pixelsToUnits: 25,
        GetPixels: function(units){
            return {
                x: units.x * this.pixelsToUnits, 
                y: units.y * this.pixelsToUnits
            }
        },
        GetUnits: function(pixels, floor=false){
            return {
                x: floor ? Math.floor( pixels.x / this.pixelsToUnits ) : ( pixels.x / this.pixelsToUnits ),
                y: floor ? Math.floor( pixels.y / this.pixelsToUnits ) : ( pixels.y / this.pixelsToUnits )
            }
        }
    }

    var cav = document.getElementById( canvasId );
    var ctx = cav.getContext("2d");
    var updateTimer;

    var gameManager = new GameManager();
    var inputs = new Input( cav );

    cav.width = gameSettings.canvasWidth;
    cav.height = gameSettings.canvasHeight;

    // TODO: these should proberly be rects by for now.
    var uiRect = new Rect(1, 0, gameManager.mapSize.x, 2);
    var uiRectTime = new Rect(gameManager.mapSize.x - 3 , -0.25, gameManager.mapSize.x, 2);
    var uiRectMines = new Rect(1.5, -0.25, gameManager.mapSize.x, 2);
    var uiRectCells = new Rect(1.5, 0.5, gameManager.mapSize.x, 2);

    var levelRect = new Rect(1, 2, gameManager.mapSize.x, gameManager.mapSize.y);

    drawRect = function( canvas, rect, borderColor="black", borderWidth="1", fillColor="white" )
    {
        /**
         * draws rect
         * colour:      colour of rect
         * position:    position in units
         * scale:       scale in units
         */

        position = gameSettings.GetPixels( rect.position );
        scale = gameSettings.GetPixels( rect.scale );

        canvas.beginPath();
        canvas.lineWidth = borderWidth;

        // draw filled rect
        canvas.fillStyle = fillColor;
        canvas.rect(position.x, position.y, scale.x, scale.y);
        canvas.fill();
        
        // add a boarder to the rect
        canvas.strokeStyle = borderColor;
        canvas.stroke();
        
    }

    drawText = function( canvas, rect, text, color="black", fontSize="24px", font="Arial" )
    {

        var scale = gameSettings.GetPixels( rect.scale );
        var position = gameSettings.GetPixels( rect.position );
        position.y += gameSettings.GetPixels( {x: 0, y: 1} ).y;     // not sure why but text cells seem to be out by one cell on the y axis

        canvas.fillStyle = color;
        canvas.font = fontSize + " " + font;
        canvas.fillText( text, position.x, position.y, scale.x );

    }

    Update = function()
    {
        inputs.TickInputs()

        ctx.clearRect(0, 0, cav.width, cav.height);    // clear the canvas 
        
        drawRect(ctx, uiRect, "black", "3" );
        drawRect(ctx, levelRect, "black", "3" );

        drawText(ctx, uiRectTime, `Time: ${gameManager.GetTimeString()}`, "black", "16px");
        drawText(ctx, uiRectMines, `Mines: ${gameManager.mineCount}` , "black", "16px");
        drawText(ctx, uiRectCells, `Remaining cells: ${gameManager.remainingTiles}`, "black", "16px");
           
        for (var i = 0; i < gameManager.map.length; i++)
        {
            
            // draw covers over each cell 
            
            cords = gameManager.GetCords(i);
            posX = cords.x + levelRect.position.x;
            posY = cords.y + levelRect.position.y;
            
            var cellRect = new Rect(posX, posY, 1, 1);
            var cellColor = "rgb(180, 180, 180)";

            var mouseCurrentCell = gameSettings.GetUnits(inputs.GetMousePosition(), true);

            document.getElementById("debug2").innerHTML = "Mouse Current Cell X: "+ mouseCurrentCell.x +" Y: "+ mouseCurrentCell.y ;

            if ( cellRect.contains( mouseCurrentCell ) )
                cellColor = "rgb(220, 220, 220)";

            if ( gameManager.cover[i] > 0 )
            {
                color = gameManager.cover[i] == 1 ? cellColor : gameManager.cover[i] == 2 ? "orange" : "red";
                drawRect(ctx, cellRect, "black", "2", color);
            }
            else
            {
                var mineCount = gameManager.map[i]; // -1 == BOOM!

                if ( mineCount == 0) continue;

                var maxMineCount = 8;
                var minePrecentage = mineCount / maxMineCount;

                var r, g, b;
                var color;

                r = Math.floor(255 * minePrecentage);
                g = Math.floor(125 - (125 * minePrecentage));
                b = Math.floor(255 - (255 * minePrecentage));
                
                color = `rgb(${r}, ${g}, ${b})`; 
                document.getElementById("debug5").innerHTML = mineCount +" / "+ maxMineCount +" = "+ minePrecentage +" || "+ color;// minePrecentage;//color;
                if ( mineCount < 0 ) mineCount = "*";
                drawText(ctx, cellRect, mineCount, color, "18px");

            } 

        }

    }

    GameStateChanged = function( state )
    {
        switch( state )
        {
            case "lose":
                
            break;
            case "win":

            break;
            case "new":
                uiRect = new Rect(1, 0, gameManager.mapSize.x, 2);
                uiRectTime = new Rect(gameManager.mapSize.x - 3 , -0.25, gameManager.mapSize.x, 2);
                uiRectMines = new Rect(1.5, -0.25, gameManager.mapSize.x, 2);
                uiRectCells = new Rect(1.5, 0.5, gameManager.mapSize.x, 2);
                levelRect = new Rect(1, 2, gameManager.mapSize.x, gameManager.mapSize.y);
            break;
            case "start":
                
            break;
        }
    }

    MousePressed = function( pressed, button )
    {
        if ( !pressed )
        {
            var mouseCurrentCell = gameSettings.GetUnits(inputs.GetMousePosition(), true);
            var currentLevelCell = {
                x: mouseCurrentCell.x - levelRect.position.x,
                y: mouseCurrentCell.y - levelRect.position.y
            }

            if (button == 0)
            {
                
                document.getElementById("debug3").innerHTML = "Mouse Pressed Level Cell X: "+ currentLevelCell.x +" Y: "+ currentLevelCell.y ;

                if ( currentLevelCell.x >= 0 && currentLevelCell.y >= 0 )
                    gameManager.ClearEmptyCells( {x: currentLevelCell.x, y: currentLevelCell.y} );
                    //gameManager.Uncover( currentLevelCell.x, currentLevelCell.y );

            }
            else if (button == 1 || button == 2)
            {
                
                gameManager.NextCoverState( currentLevelCell.x, currentLevelCell.y );

            }
        }

    }

    ClearUpdate = function(intv)
    {

        if (updateTimer)
            clearInterval(updateTimer)

    }

    gameManager.stateChangeCallback.push( this.GameStateChanged );
    inputs.mousePressedCallback.push( this.MousePressed );
    updateTimer = setInterval( this.Update, intervals );
    gameManager.NewGame(800, {x: 40, y: 20});

}

