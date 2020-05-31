
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

    }

    DrawObject( canvasRenderer )
    {
        /**
         * Object definition in local space.
         */

        // Note: +1 x
        var uiRect = new Rect(0, 0, this.gameManager.mapSize.x, 2);
        var uiRectTime = new Rect(this.gameManager.mapSize.x - 4 , -0.25, this.gameManager.mapSize.x, 2);
        var uiRectMines = new Rect(0.5, -0.25, this.gameManager.mapSize.x, 2);
        var uiRectCells = new Rect(0.5, 0.5, this.gameManager.mapSize.x, 2);

        canvasRenderer.DrawRect( uiRect, "white", "black", "3" );

        canvasRenderer.DrawText( uiRectTime, `Time: ${this.gameManager.GetTimeString()}`, "black", "16px");
        canvasRenderer.DrawText( uiRectMines, `Mines: ${this.gameManager.mineCount}` , "black", "16px");
        canvasRenderer.DrawText( uiRectCells, `Remaining cells: ${this.gameManager.remainingTiles}`, "black", "16px");

    }

}