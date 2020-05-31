
class GameWindow extends Transform
{

    constructor(posX, posY, scaleX, scaleY, rotation, gameManager, canvasSettings, inputs)
    {
        /**
         *  Params:
         *  posX / PosY :   position in units
         *  scaleX/ScaleY : scale multiplier
         *  rotation:       rotation in deg
         */
        
        super(posX, posY, scaleX, scaleY, rotation);

        this.gameManager = gameManager;
        this.canvasSettings = canvasSettings;
        this.inputs = inputs;

    }

    Update()
    {

    }

    DrawObject( renderer )
    {

        var levelRect = new Rect(0, 0, this.gameManager.mapSize.x, this.gameManager.mapSize.y);

        renderer.DrawRect( levelRect, "white", "black", "3" );

        // Draw Game
        for (var i = 0; i < this.gameManager.map.length; i++)
        {
            
            // draw covers over each cell 
            
            var cords = this.gameManager.GetCords(i);
            
            var cellRect = new Rect(cords.x, cords.y, 1, 1);
            var cellColor = "rgb(180, 180, 180)";

            var mouseCurrentCell = this.canvasSettings.GetUnits( this.inputs.GetMousePosition(), true );
            mouseCurrentCell.x -= this.position.x;
            mouseCurrentCell.y -= this.position.y;

            document.getElementById("debug2").innerHTML = "Mouse Current Cell X: "+ mouseCurrentCell.x +" Y: "+ mouseCurrentCell.y ;

            if ( cellRect.contains( mouseCurrentCell ) )
                cellColor = "rgb(220, 220, 220)";

            if ( this.gameManager.cover[i] > 0 )
            {
                color = this.gameManager.cover[i] == 1 ? cellColor : this.gameManager.cover[i] == 2 ? "orange" : "red";
                renderer.DrawRect( cellRect, color, "black", "2");
            }
            else
            {
                var mineCount = this.gameManager.map[i]; // -1 == BOOM!

                if ( mineCount == 0) continue;

                var maxMineCount = 8;
                var minePrecentage = mineCount / maxMineCount;

                var r, g, b;
                var color;

                r = Math.floor(255 * minePrecentage);
                g = Math.floor(125 - (125 * minePrecentage));
                b = Math.floor(255 - (255 * minePrecentage));
                
                color = `rgb(${r}, ${g}, ${b})`; 
                document.getElementById("debug5").innerHTML = mineCount +" / "+ maxMineCount +" = "+ minePrecentage +" || "+ color;
                if ( mineCount < 0 ) mineCount = "*";
                renderer.DrawText( cellRect, mineCount, color, "18px");

            } 

        }
    }

}