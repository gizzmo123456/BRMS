
class GameManager {

    constructor(  )
    {
    
        this.stateChangeCallback = [];  // requires param string state
        this.started = false;
        this.startTime = 0;
        this.endTime = 0;
        this.safeStartArea = 4;

        this.mineCount = 50;
        this.mapSize = { x: 10, y: 15 }
        
        
        // create an arrays for map size x*y
        // and fill it with mines        
        this.map = [];  // -1 == mine; >= 0 == mine count
        this.cover = [];
        this.explored = [];
        this.remainingTiles = 0;

        this.NewGame( this.mineCount, this.mapSize )
    }

    NewGame( mineCount=10, mapSize={x: 10, y: 10} )
    {

        this.mapSize = mapSize

        // create an arrays for map size x*y
        // and fill it with mines        
        this.map = new Array(this.mapSize.x * this.mapSize.y).fill(0);  // -1 == mine; >= 0 == mine count
        this.cover = new Array( this.map.length ).fill(1);
        this.remainingTiles = this.map.length;

        this.mineCount = Math.min( mineCount, Math.floor(this.map.length * 0.9) ); // make sure that 10% of cells are empty
        var remainingMines = this.mineCount

        this.startTime = 0;
        this.endTime = 0;

        this.InvokeStateChange("new")

    }

    StartGame( cordX, cordY )
    {
        // ma
        var halfSafeArea = Math.floor( this.safeStartArea / 2 )
        var startArea = new Rect( cordX - halfSafeArea, cordY - halfSafeArea, this.safeStartArea, this.safeStartArea );

        var remainingMines = this.mineCount

        for (var i = 0; i < this.map.length; i++)
        {
            // dont spwan mines in the safe area.
            if ( startArea.contains( this.GetCords(i) ) )
                continue;

            var posibibility = remainingMines / (this.map.length - i);
            var rand = Math.random();

            if ( rand < posibibility )
            {
                // add a new mine.
                this.SetMine( i );
                remainingMines--;

                if (remainingMines <= 0)
                    break;
            }

        }

        this.mineCount -= remainingMines;

        this.startTime = Date.now();
        this.InvokeStateChange("start")

    }

    GetCords( cellId )
    {

        var x = cellId % this.mapSize.x;
        var y = Math.floor(cellId / this.mapSize.x);

        return { x: x, y: y };

    }

    GetCellId( x, y )
    {
        if (x < 0 || x >= this.mapSize.x || y < 0 || y >= this.mapSize.y)
            return -1;

        return y * this.mapSize.x + x;
    }

    GetCell( x, y )
    {
        return map[ this.GetCellId( x, y ) ];
    }

    SetMine( cellId )
    {

        // set the cell to be a mine
        this.map[ cellId ] = -1;

        var cords = this.GetCords( cellId );

        // count the mine in the surounding cells
        for ( var x = Math.max(0, cords.x - 1); x < Math.min( cords.x + 2, this.mapSize.x); x++)
        {
            for ( var y = Math.max(0, cords.y - 1); y < Math.min( cords.y + 2, this.mapSize.y); y++)
            {
                if ( this.map[ this.GetCellId(x, y) ] != -1 )
                {
                    ++this.map[ this.GetCellId(x, y) ];
                }
            }
        }

    }

    ClearEmptyCells( cords_, direction={x: 0, y: 0}, count=0 )
    {

        var cords = {
            x: cords_.x + direction.x,
            y: cords_.y + direction.y,
        }

        var cellId = this.GetCellId(cords.x, cords.y);

        if (cellId < 0 || cellId >= this.map.length) return;

        if ( direction.x ==  0 && direction.y == 0 )
        {
            if ( this.cover[cellId] == 0 ) return; // allready uncovered

            this.Uncover(cords.x, cords.y);
            this.explored = new Array( this.map.length ).fill(false);
            this.explored[cellId] = true;
            // explore in all directions
            if ( this.map[cellId] == 0)
            {
                this.ClearEmptyCells( cords, {x: 0, y: 1} );
                this.ClearEmptyCells( cords, {x: 0, y: -1} );
                this.ClearEmptyCells( cords, {x: 1, y: 0} );
                this.ClearEmptyCells( cords, {x: -1, y: 0} );
            }
        }
        else
        {
            if ( this.explored[ cellId ] || this.map[ cellId ] == -1 )      // stop exploring if already explorded
            {
                return;
            }
            else if (this.map[ cellId ] > 0 && count < 2)
            {   // Brach out, with a max depth of two map cells > 0
                count++;

                this.__BranchEmptyCells(cords, cellId, direction, count);

            }
            else if ( this.map[ cellId ] == 0)
            {   // Continue going forwards, branching out

                this.__BranchEmptyCells(cords, cellId, direction, 0)
                this.ClearEmptyCells( cords, direction );

            }
        }
    }

    __BranchEmptyCells(cords, cellId, direction, count)
    {

        this.Uncover(cords.x, cords.y);
        this.explored[cellId] = true;
        
        // explor in the direction that we have not came from
        if ( direction.x == 0)
        {
            this.ClearEmptyCells( cords, {x: 1, y: 0}, count );
            this.ClearEmptyCells( cords, {x: -1, y: 0}, count );
        }
        else
        {
            this.ClearEmptyCells( cords, {x: 0, y: 1}, count );
            this.ClearEmptyCells( cords, {x: 0, y: -1}, count );
        }

    }

    Uncover( cordX, cordY )
    {

        var cellId = this.GetCellId( cordX, cordY );

        if ( cellId >= 0 && cellId < this.cover.length && this.cover[cellId] != 0 )
        {

            if ( !this.GameHasStarted() )   // start the game when the first tile is uncoved
            {
                this.StartGame( cordX, cordY );
            }

            if ( this.cover[cellId] == 3 )  //if the cell is protected dont destroy
            {
                this.cover[cellId]--;
                return;
            }

            this.cover[cellId] = 0;
            this.remainingTiles--;

            if (this.remainingTiles == this.mineCount)
            {
                // Win.
                this.InvokeStateChange( "win" );
                this.endTime = Date.now();
            }
            else if ( this.map[ cellId ] == -1)
            {
                // lose
                this.InvokeStateChange( "lose" );
                this.endTime = Date.now();
            }
            
        }
    }

    NextCoverState( cordX, cordY )
    {

        var cellId = this.GetCellId( cordX, cordY );

        if ( cellId >= 0 && cellId < this.cover.length && this.cover[cellId] != 0 )
        {
            var nextState = this.cover[cellId] - 1;

            if ( nextState < 1)
                nextState = 3;

            this.cover[cellId] = nextState;
        }

    }

    InvokeStateChange( state )
    {
        for ( var i = 0; i < this.stateChangeCallback.length; i++ )
            this.stateChangeCallback[i]( state );
    }

    GetGameDuration()   // in seconds
    {
        if ( this.GameHasStarted() )
            return (( this.endTime > 0 ? this.endTime : Date.now() ) - this.startTime) / 1000.0;
        else
            return 0;
    }

    GetTimeString()
    {
        var durtation = this.GetGameDuration();

        var hours = Math.floor( durtation / 60.0 / 60.0 ).toString().padStart(2, "0");
        var mins = Math.floor ( (durtation - (hours * 60 * 60)) / 60 ).toString().padStart(2, "0");
        var secs = Math.floor(durtation % 60).toString().padStart(2, "0");

        if ( hours > 0 )
            return `${hours}:${mins}:${secs}`;
        else
            return `${mins}:${secs}`;

    }

    GameHasStarted()
    {
        return this.startTime > 0;
    }

    GameIsRunning()
    {
        return this.startTime > 0 && this.endTime == 0;
    }

}