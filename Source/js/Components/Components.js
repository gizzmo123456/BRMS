
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

    constructor(posX, posY, scaleX, scaleY){
        
        super(posX, posY, scaleX, scaleY);

    }
}

class CanvasRenderer {

    constructor( canvas, canvasSettings ){
        
        this.canvasSettings = canvasSettings;
        this.canvas = canvas;

    }

    DrawRect(rect, fillColor="white", borderWidth="1", borderColor="black")
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
        var scale = this.canvasSettings.GetPixels( rect.scale );
        var position = this.canvasSettings.GetPixels( rect.position );
        //position.y += this.canvasSettings.pixelsToUnits; 

        this.canvas.fillStyle = color;
        this.canvas.font = fontSize + " " + font;
        this.canvas.fillText( text, position.x, position.y, scale.x );
    }

}