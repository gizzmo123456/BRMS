// main.js


main = function(canvasId, fps = 30){  
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

    var canvasSettings = {
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

    cav.width = canvasSettings.canvasWidth;
    cav.height = canvasSettings.canvasHeight;

    // set up the main game compoents 
    var gameManager = new GameManager();
    var frameSync = new FrameSync( fps );
    var renderer = new CanvasRenderer( ctx, canvasSettings );
    var inputs = new Input( cav );

    // setup game objects
    var hud = new HUD( 1, 0, 1, 1, 0, gameManager);

    var levelRect = new Rect(1, 2, gameManager.mapSize.x, gameManager.mapSize.y);

    Update = function()
    {
        inputs.TickInputs()

        ctx.clearRect(0, 0, cav.width, cav.height);    // clear the canvas 
        
        hud.Render( renderer );

        // reset the transfrom, just untill we have add the grid to its own class
        ctx.setTransform( 1, 0, 0, 1, 0, 0 );

        renderer.DrawRect( levelRect, "white", "black", "3" );

        // Draw Game
        for (var i = 0; i < gameManager.map.length; i++)
        {
            
            // draw covers over each cell 
            
            cords = gameManager.GetCords(i);
            posX = cords.x + levelRect.position.x;
            posY = cords.y + levelRect.position.y;
            
            var cellRect = new Rect(posX, posY, 1, 1);
            var cellColor = "rgb(180, 180, 180)";

            var mouseCurrentCell = canvasSettings.GetUnits(inputs.GetMousePosition(), true);

            document.getElementById("debug2").innerHTML = "Mouse Current Cell X: "+ mouseCurrentCell.x +" Y: "+ mouseCurrentCell.y ;

            if ( cellRect.contains( mouseCurrentCell ) )
                cellColor = "rgb(220, 220, 220)";

            if ( gameManager.cover[i] > 0 )
            {
                color = gameManager.cover[i] == 1 ? cellColor : gameManager.cover[i] == 2 ? "orange" : "red";
                renderer.DrawRect( cellRect, color, "black", "2");
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
                renderer.DrawText( cellRect, mineCount, color, "18px");

            } 

        }

        frameSync.Invoke( this.Update );

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
            var mouseCurrentCell = canvasSettings.GetUnits(inputs.GetMousePosition(), true);
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
    frameSync.Invoke( this.Update );
    gameManager.NewGame(80, {x: 40, y: 20});

}

