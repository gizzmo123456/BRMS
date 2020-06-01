class CanvasRenderer {

    constructor( canvas, canvasSettings ){
        
        this.canvasSettings = canvasSettings;
        this.canvas = canvas;

    }

    DrawRect(rect, fillColor="white", borderWidth=1, borderColor="black")
    {

        var position = this.canvasSettings.GetPixels( rect.position );
        var scale = this.canvasSettings.GetPixels( rect.scale );

        this.canvas.beginPath();
        this.canvas.lineWidth = borderWidth;

        // draw filled rect
        this.canvas.fillStyle = fillColor;
        this.canvas.rect(position.x, position.y, scale.x, scale.y);
        this.canvas.fill();
        
        // add a boarder to the rect
        this.canvas.strokeStyle = borderColor;
        this.canvas.stroke();

    }

    DrawEllipes(rect, rotation=0, fillColor="white", borderColor="black", borderWidth="1" )
    {
        /**
         * Renders a Circel/oval to fill the rect
         */

        //

        // find the x/y radius based on the rect supplied

        var position = this.canvasSettings.GetPixels( rect.position );
        var scale = this.canvasSettings.GetPixels( rect.scale );

        var xRadius, yRadius;

        var xRadius = scale.x / 2.0;
        var yRadius = scale.y / 2.0;

        // draw and fill the ellipes.
        this.canvas.beginPath();

        this.canvas.lineWidth = borderWidth;
        this.canvas.fillStyle = fillColor;

        this.canvas.ellipse( position.x, position.y, xRadius, yRadius, rotation, 0, 2*Math.PI )
        this.canvas.fill();
        
        this.canvas.strokeStyle = borderColor;
        this.canvas.stroke();

    }

    DrawText(rect, text, color="black", fontSize="24px", font="Arial")
    {
        var position = this.canvasSettings.GetPixels( rect.position );
        var scale = this.canvasSettings.GetPixels( rect.scale );

        position.y += this.canvasSettings.pixelsToUnits; // this alignes the text with the bottom of the cell.
        
        this.canvas.fillStyle = color;
        this.canvas.font = fontSize + " " + font;
        this.canvas.fillText( text, position.x, position.y, scale.x );
    }

    DrawLine( startPosition, endPosition, color="black", width="1" )
    {
        var sPos = this.canvasSettings.GetPixels( startPosition );
        var ePos = this.canvasSettings.GetPixels( endPosition );

        this.canvas.beginPath()
        this.canvas.strokeStyle = color;
        this.canvas.lineWidth = width;

        this.canvas.moveTo( sPos.x, sPos.y );
        this.canvas.lineTo( ePos.x, ePos.y);

        this.canvas.stroke();
    }

    DrawPolly( pointArray, color="white", borderColor="black", borderWidth="1" )
    {

        if ( pointArray.length < 3)
            return; // not enought points to draw polly

        this.canvas.beginPath()
        this.canvas.lineWidth = borderWidth;
        this.canvas.fillStyle = color;

        // move to the first point, then we can loop the rest :)
        var pos = this.canvasSettings.GetPixels( pointArray[0] );
        this.canvas.moveTo( pos.x, pos.y );

        for ( var i = 1; i < pointArray.length; i++ )
        {
            pos = this.canvasSettings.GetPixels( pointArray[i] );
            this.canvas.lineTo( pos.x, pos.y)
        }

        this.canvas.closePath();
        this.canvas.fill();

        this.canvas.strokeStyle = borderColor;
        this.canvas.stroke();


    }
}