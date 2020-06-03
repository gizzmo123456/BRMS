// main.js


main = function(canvasId, fps = 60){  
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
        canvasWidth: 0,
        canvasHeight: 0,
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

    // set up the main game compoents
    var debug = new Debug(); 
    var gameManager = new GameManager();
    var frameSync = new FrameSync( fps );
    var renderer = new CanvasRenderer( ctx, canvasSettings );
    var inputs = new Input( cav );

    // setup game objects
    var hud = new HUD( 1, 0, 1, 1, 0, gameManager);
    var gameWindow = new GameWindow(1, 2, 1, 1, 0, gameManager, canvasSettings, inputs);
    var charactor = new Charactor( 2, 3, 1, 1, 0, canvasSettings);

    // TODO: Add Time Class
    var lastUpdateTime = 0;

    var frameCount = 0;
    var fpsIntervals = 1000.00;
    var currentFpsInterval = 0;

    // update lists
    var updateCallbacks = [
        gameWindow,
        charactor
    ]

    var renderCallbacks = [
        hud,
        gameWindow,
        charactor
    ]

    // TEMP
    var findPath = document.getElementById("PathFind");
    var pathFinder = new PathFinder( gameManager );
    var path = [];

    Update = function()
    {

        var updateTime = Date.now();
        var timeDelta = updateTime - lastUpdateTime;
        var timeDeltaSec = timeDelta / 1000.0;
        lastUpdateTime = updateTime;

        inputs.TickInputs()

        updateCallbacks.forEach( ucb => ucb.Update( timeDeltaSec, inputs ) );

        ctx.clearRect(0, 0, cav.width, cav.height);    // clear the canvas 
        
        renderCallbacks.forEach( rcb => rcb.Render( renderer ) )

        if ( path.length > 0 )
        {
            ctx.setTransform( 1, 0, 0, 1, 0, 0 )
            var start = path[0];
            var end;

            // draw path :)
            for (var p = 1; p < path.length; p++)
            {
                end = path[p];

                renderer.DrawLine(start, end, "blue", 2);

                start = end;
            }
        }

        frameSync.Invoke( this.Update );

        // find the current fps
        currentFpsInterval += timeDelta;
        ++frameCount;
        if ( currentFpsInterval >= fpsIntervals)
        {
            var fps = frameCount / (currentFpsInterval / 1000.0);

            Debug.Print("FPS counter", 
                        "FPS" + frameCount +" / "+ currentFpsInterval +" = " + fps
                       )

            currentFpsInterval = frameCount = 0.00;
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
            break;
            case "start":
            break;
        }
    }

    MousePressed = function( pressed, button, position )
    {
        gameWindow.MousePressed( pressed, button, position );
        charactor.MousePressed( pressed, button, position );

        // TEMP
        if ( findPath.checked == true && button == 0 && pressed)
        {
            var endPos = canvasSettings.GetUnits( position, true );
            //endPos.x -= 1;
            //endPos.y -= 2;

            path = pathFinder.FindPath( { x:1, y:2 }, endPos );

            for (var i = 0; i < path.length; i++)
            {
                path[i].x += 1.5;
                path[i].y += 2.5;
            }

            Debug.Print( "HasPath: ", "Has Path? " + (path.length > 0) +" len "+ path.length)

        }
    }

    ResizeWindow = function()
    {
        
        canvasSettings.canvasWidth = window.innerWidth - 20;
        canvasSettings.canvasHeight = window.innerHeight - 200;

        cav.width = canvasSettings.canvasWidth;
        cav.height = canvasSettings.canvasHeight;
    }

    ClearUpdate = function()
    {

        frameSync.Cancel();

    }

    // register callbacks
    inputs.resizeCallbacks.push( this.ResizeWindow );
    gameManager.stateChangeCallback.push( this.GameStateChanged );
    inputs.mousePressedCallback.push( this.MousePressed );

    this.ResizeWindow();
    frameSync.Invoke( this.Update );

    gameManager.NewGame(80, {x: 30, y: 18});

}

