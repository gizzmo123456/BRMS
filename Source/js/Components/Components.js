
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
        this.renderOffset = {x: 0, y: 0}
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

    Update( timeDeltaSeconds, inputs )
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
        var offset = canvasRenderer.canvasSettings.GetPixels( this.renderOffset );
        var renderPosition = { 
            x: offset.x + position.x,
            y: offset.y + position.y,
        }
        
        // TODO:
        // we need to do the whole sin coz thing here :)
        // See. https://www.w3resource.com/html5-canvas/html5-canvas-matrix-transforms.php
        // Example one.
        canvasRenderer.canvas.setTransform( this.scale.x, 0, 0, this.scale.y, renderPosition.x, renderPosition.y );

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

    ToLocalCell( position )
    {
        // Todo. make the max value available so we can clamp it! 
        var x = Math.min( 0, Math.ceil(position.x - this.position.x) );
        var y = Math.min( 0, Math.ceil(position.y - this.position.y) );

        return {
            x: x,
            y: y
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
