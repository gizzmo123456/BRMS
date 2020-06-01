
class GameWindow extends Transform
{

    constructor(posX, posY, scaleX, scaleY, rotation, gameManager, canvasSettings)
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
        this.mouseCurrentCell = {x: 0, y: 0}

    }

    Update( inputs )
    {

        this.mouseCurrentCell = this.ToLocal( this.canvasSettings.GetUnits( inputs.GetMousePosition(), true ) );

    }

    DrawObject( renderer )  // This needs performance improvments!
    {

        var levelRect = new Rect(0, 0, this.gameManager.mapSize.x, this.gameManager.mapSize.y);

        renderer.DrawRect( levelRect, "white", 3, "black" );

        // Draw Game
        for (var i = 0; i < this.gameManager.map.length; i++)
        {
            
            // draw covers over each cell 
            
            var cords = this.gameManager.GetCords(i);
            
            var cellRect = new Rect(cords.x, cords.y, 1, 1);
            var cellColor = "rgb(180, 180, 180)";

            if ( cellRect.contains( this.mouseCurrentCell ) )
                cellColor = "rgb(220, 220, 220)";

            if ( this.gameManager.cover[i] > 0 )
            {
                color = this.gameManager.cover[i] == 1 ? cellColor : this.gameManager.cover[i] == 2 ? "orange" : "red";
                renderer.DrawRect( cellRect, color );
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

                if ( mineCount < 0 ) mineCount = "*";
                renderer.DrawText( cellRect, mineCount, color, "18px");

            } 

        }
    }

    MousePressed( pressed, button, position )
    {
        if (!pressed)
        {
            var currentLevelCell =  {
                x: this.mouseCurrentCell.x,
                y: this.mouseCurrentCell.y
            };

            if (button == 0)
            {
                Debug.Print("MousePressedPosition",
                            "Mouse Pressed Level Cell X: "+ currentLevelCell.x +" Y: "+ currentLevelCell.y
                           )
                

                if ( currentLevelCell.x >= 0 && currentLevelCell.y >= 0 )
                    this.gameManager.ClearEmptyCells( {x: currentLevelCell.x, y: currentLevelCell.y} );

            }
            else if (button == 1 || button == 2)
            {
                
                this.gameManager.NextCoverState( currentLevelCell.x, currentLevelCell.y );

            }
        }
    }

}