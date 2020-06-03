
class Charactor extends Transform
{
    constructor(posX, posY, scaleX, scaleY, rotation, canvasSettings, gameManager)
    {
        /**
         *  Params:
         *  posX / PosY :   position in units
         *  scaleX/ScaleY : scale multiplier
         *  rotation:       rotation in deg
         */
        
        super(posX, posY, scaleX, scaleY, rotation);
        this.renderOffset = {x: -0.5, y: -0.5};
        this.gameManager = gameManager
        this.canvasSettings = canvasSettings;

        this.moveSpeed = 1;     // units a second
        this.rotateSpeed = 90;  // units a second

        this.pathFinder = new PathFinder( gameManager );
        this.path = [];

    }

    Update( deltaTime, inputs )
    { 
        if ( this.path.length == 0 ) return;

        var moveVector = { 
            x: this.path[0].x - this.position.x,
            y: this.path[0].y - this.position.y
        }
        //var mvSum = Math.abs(moveVector.x + moveVector.y);
        var mag = Math.sqrt( ( moveVector.x * moveVector.x ) + (moveVector.y * moveVector.y) );

        var targetRotAmount = (180.0 / Math.PI * Math.atan2(-moveVector.x, moveVector.y)) - this.rotation;
        var rotation = Math.min(targetRotAmount, (targetRotAmount > 0 ? this.rotateSpeed : (targetRotAmount < 0 ? -this.rotateSpeed : 0))) * deltaTime;

        moveVector = { 
            x: (this.path[0].x - this.position.x) / mag,
            y: (this.path[0].y - this.position.y) / mag
        }

        this.position.x += moveVector.x * this.moveSpeed * deltaTime;
        this.position.y += moveVector.y * this.moveSpeed * deltaTime;
        this.rotation += rotation;

        if (mag < 0.05)
        {
            this.position.x = this.path[0].x;
            this.position.y = this.path[0].y;
            this.path.shift();
        }
    }

    DrawObject( canvasRenderer )
    {
        /**
         * Object definition in local space.
         */

        
       canvasRenderer.DrawEllipes(new Rect(0, 0, 0.7, 0.7), 0, "red" );
       canvasRenderer.DrawLine( {x: 0, y: 0}, {x: 0, y: 0.35}, "black", "3" );

    }
    
    MousePressed( pressed, button, position )
    {
        if ( pressed ) return;  // mouse down

        if ( button == 0 )
        {
            
            var endPos = this.canvasSettings.GetUnits( position, true );
            this.path = this.pathFinder.FindPath( { x: Math.floor(this.position.x), y:Math.floor(this.position.y) }, endPos );

            for (var i = 0; i < path.length; i++)
            {
                this.path[i].x += 1;
                this.path[i].y += 2;
            }
    
            Debug.Print( "HasPath: ", "Has Path? " + (path.length > 0) +" len "+ path.length)
    
        }

    }

}