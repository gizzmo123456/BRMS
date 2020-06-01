
class Charactor extends Transform
{
    constructor(posX, posY, scaleX, scaleY, rotation, canvasSettings)
    {
        /**
         *  Params:
         *  posX / PosY :   position in units
         *  scaleX/ScaleY : scale multiplier
         *  rotation:       rotation in deg
         */
        
        super(posX, posY, scaleX, scaleY, rotation);
        this.renderOffset = {x: -0.5, y: -0.5};
        this.canvasSettings = canvasSettings;

        this.moveToLocation = {x: 0, y: 0}
        this.isMoving = false;

        this.moveSpeed = 1;     // units a second
        this.rotateSpeed = 90;  // units a second
    }

    Update( deltaTime, inputs )
    { 
        if ( !this.isMoving ) return;

        var moveVector = { 
            x: this.moveToLocation.x - this.position.x,
            y: this.moveToLocation.y - this.position.y
        }
        //var mvSum = Math.abs(moveVector.x + moveVector.y);
        var mag = Math.sqrt( ( moveVector.x * moveVector.x ) + (moveVector.y * moveVector.y) );

        var targetRotAmount = (180.0 / Math.PI * Math.atan2(-moveVector.x, moveVector.y)) - this.rotation;
        var rotation = Math.min(targetRotAmount, (targetRotAmount > 0 ? this.rotateSpeed : (targetRotAmount < 0 ? -this.rotateSpeed : 0))) * deltaTime;

        moveVector = { 
            x: (this.moveToLocation.x - this.position.x) / mag,
            y: (this.moveToLocation.y - this.position.y) / mag
        }

        this.position.x += moveVector.x * this.moveSpeed * deltaTime;
        this.position.y += moveVector.y * this.moveSpeed * deltaTime;
        this.rotation += rotation;

        if (mag < 0.1)
        {
            this.isMoving = false;
            this.position.x = this.moveToLocation.x;
            this.position.y = this.moveToLocation.y;
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
            var pos = this.canvasSettings.GetUnits(position);
            this.moveToLocation.x = Math.ceil(pos.x);
            this.moveToLocation.y = Math.ceil(pos.y);
            Debug.Print("MT", "mt x: "+this.moveToLocation.x+" y: "+this.moveToLocation.y);
            this.isMoving = true;
        }

    }

}