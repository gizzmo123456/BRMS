
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

    DrawRect(rect, borderColor="black", borderWidth="1", fillColor="white")
    {

        var position = gameSettings.GetPixels( rect.position );
        var scale = gameSettings.GetPixels( rect.scale );

        canvas.beginPath();
        canvas.lineWidth = borderWidth;

        // draw filled rect
        canvas.fillStyle = fillColor;
        canvas.rect(position.x, position.y, scale.x, scale.y);
        canvas.fill();
        
        // add a boarder to the rect
        canvas.strokeStyle = borderColor;
        canvas.stroke();

    }

    DrawEllipes(rect, rotation=0, borderColor="black", borderWidth="1", fillColor="white")
    {
        /**
         * Renders a Circel/oval to fill the rect
         */

        //

        // find the x/y radius based on the rect supplied
        var xRadius, yRadius;

        var xRadius = rect.scale.x / 2.0;
        var yRadius = rect.scale.y / 2.0;

        // draw and fill the ellipes.
        this.canvas.beginPath();

        this.canvas.lineWidth = borderWidth;
        this.canvas.fillStyle = fillColor;

        this.canvas.ellipse( rect.position.x, rect.position.y, xRadius, yRadius, rotation, 0, 2*Math.PI )
        this.canvas.fill();
        
        this.canvas.strokeStyle = borderColor;
        this.canvas.stroke();

    }

    DrawText(rect, text, color="black", fontSize="24px", font="Arial")
    {

    }

}