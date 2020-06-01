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

    var updateCallbacks = [
        gameWindow
    ]

    var renderCallbacks = [
        hud,
        gameWindow
    ]

    Update = function()
    {
        inputs.TickInputs()

        updateCallbacks.forEach( ucb => ucb.Update( inputs ) );

        ctx.clearRect(0, 0, cav.width, cav.height);    // clear the canvas 
        
        renderCallbacks.forEach( rcb => rcb.Render( renderer ) )
        
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
            break;
            case "start":
            break;
        }
    }

    MousePressed = function( pressed, button )
    {
        gameWindow.MousePressed( pressed, button );
    }

    ClearUpdate = function()
    {

        frameSync.Cancel();

    }

    gameManager.stateChangeCallback.push( this.GameStateChanged );
    inputs.mousePressedCallback.push( this.MousePressed );
    frameSync.Invoke( this.Update );
    gameManager.NewGame(220, {x: 60, y: 30});

}

