
class HUD extends Transform
{
    constructor(posX, posY, scaleX, scaleY, rotation, gameManager)
    {
        /**
         *  Params:
         *  posX / PosY :   position in units
         *  scaleX/ScaleY : scale multiplier
         *  rotation:       rotation in deg
         */
        
        super(posX, posY, scaleX, scaleY, rotation);
        this.gameManager = gameManager;

        this.uiRect = new Rect(0, 0, this.gameManager.mapSize.x, 2);
        this.uiRectTime = new Rect(this.gameManager.mapSize.x - 4 , -0.25, 5, 2);
        this.uiRectMines = new Rect(0.5, -0.25, 5, 2);
        this.uiRectCells = new Rect(0.5, 0.5, 5, 2);

    }

    ResizeWindow(width, height)
    {
        this.uiRect.scale.x =  width;
        this.uiRectTime.position.x = width.x;
    }

    DrawObject( canvasRenderer )
    {
        /**
         * Object definition in local space.
         */

        // TODO: this needs to go into its own function,
        
        canvasRenderer.DrawRect( this.uiRect, "white", 3, "black" );

        canvasRenderer.DrawText( this.uiRectTime, `Time: ${this.gameManager.GetTimeString()}`, "black", "16px");
        canvasRenderer.DrawText( this.uiRectMines, `Mines: ${this.gameManager.mineCount}` , "black", "16px");
        canvasRenderer.DrawText( this.uiRectCells, `Remaining cells: ${this.gameManager.remainingTiles}`, "black", "16px");

    }

}