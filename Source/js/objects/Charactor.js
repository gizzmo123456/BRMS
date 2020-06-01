
class Charactor extends Transform
{
    constructor(posX, posY, scaleX, scaleY, rotation)
    {
        /**
         *  Params:
         *  posX / PosY :   position in units
         *  scaleX/ScaleY : scale multiplier
         *  rotation:       rotation in deg
         */
        
        super(posX, posY, scaleX, scaleY, rotation);

    }

    Update( inputs )
    { }

    DrawObject( canvasRenderer )
    {
        /**
         * Object definition in local space.
         */

        
       canvasRenderer.DrawEllipes(new Rect(-0.5, -0.5, 0.7, 0.7), 0, "red" );
       canvasRenderer.DrawLine( {x: -0.5, y: -0.5}, {x: -0.5, y: -0.15}, "black", "3" );

    }
    
}