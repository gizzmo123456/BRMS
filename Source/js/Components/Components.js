
class Rect{

    constructor(posX, posY, scaleX, scaleY){
        
        this.position = {
            x: posX,
            y: posY
        };

        this.scale = {
            x: scaleX,
            y: scaleY
        };

    }

    contains( position )
    {
        return  this.position.x <= position.x && position.x < (this.position.x + this.scale.x) && 
                this.position.y <= position.y && position.y < (this.position.y + this.scale.y);
    
    }

}

class Transform extends Rect{

    constructor(posX, posY, scaleX, scaleY, rotation)
    {
        /**
         *  Params:
         *  posX / PosY :   position in units
         *  scaleX/ScaleY : scale multiplier
         *  rotation:       rotation in deg
         */
        
        super(posX, posY, scaleX, scaleY);

        this.rotation = rotation;

    }

    SetTransform(posX, posY, scaleX, scaleY, rotation)
    {

        this.SetPosition( posX, posY );
        this.SetScale( scaleX, scaleY );
        this.SetRotation( rotation );
        
    }

    SetPosition( x, y )
    {
        this.position = { x: x, y: y }
    }

    SetScale( x, y )
    {
        this.scale = { x: x, y: y }
    }

    SetRotation( deg )
    {
        this.rotation = deg;
    }

    Update( inputs )
    { }

    Render( canvasRenderer )
    {
        /**
         * Render should not be overriden. override DrawObject insted.
         */

        // set the position, rotation and scale in world space.

        if ( !this.CanRender() )
            return;

        var position = canvasRenderer.canvasSettings.GetPixels( this.position );
        
        // TODO:
        // we need to do the whole sin coz thing here :)
        // See. https://www.w3resource.com/html5-canvas/html5-canvas-matrix-transforms.php
        // Example one.
        canvasRenderer.canvas.setTransform( this.scale.x, 0, 0, this.scale.y, position.x, position.y );

        if (this.rotation != 0)
            canvasRenderer.canvas.rotate( Transform.DegToRad( this.rotation ) );

        // render the object
        this.DrawObject( canvasRenderer );

    }

    DrawObject( canvasRenderer )
    {
        /**
         * Object definition in local space.
         */

        // example: draws Rect with the pivit in the center
        canvasRenderer.DrawRect( new Rect(-0.5, -0.5, 1, 1) )

    }

    CanRender()
    {
        return true;
    }

    ToLocal( position )
    {
        return {
            x: position.x - this.position.x,
            y: position.y - this.position.y
        }
    }
    
    static DegToRad(deg)
    {
        return deg * Math.PI / 180.0;
    }

    static RadToDeg(rad)
    {
        return rad * 180.0 / Math.PI;
    }

}
