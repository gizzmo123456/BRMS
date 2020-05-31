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

    cav.width = canvasSettings.canvasWidth;
    cav.height = canvasSettings.canvasHeight;

    // set up the main game compoents 
    var gameManager = new GameManager();
    var frameSync = new FrameSync( fps );
    var renderer = new CanvasRenderer( ctx, canvasSettings );
    var inputs = new Input( cav );

    // setup game objects
    var hud = new HUD( 1, 0, 1, 1, 0, gameManager);
    var gameWindow = new GameWindow(1, 2, 1, 1, 0, gameManager, canvasSettings, inputs);

    var levelRect = new Rect(1, 2, gameManager.mapSize.x, gameManager.mapSize.y);

    Update = function()
    {
        inputs.TickInputs()

        ctx.clearRect(0, 0, cav.width, cav.height);    // clear the canvas 
        
        hud.Render( renderer );
        gameWindow.Render( renderer );

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

        frameSync.Cancel();

    }

    gameManager.stateChangeCallback.push( this.GameStateChanged );
    inputs.mousePressedCallback.push( this.MousePressed );
    frameSync.Invoke( this.Update );
    gameManager.NewGame(80, {x: 40, y: 20});

}

