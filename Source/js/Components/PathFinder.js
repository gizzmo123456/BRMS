
function PathNode(parent=null, position={x: 0, y: 0}, estimate=999, cellCost = 1)
{
    
    this.parent = parent;
    this.position = position;

    this.cellCost = cellCost;
    this.pathCost = parent ? parent.f + this.cellCost : 0           // g
    this.estimate = estimate;                                       // h

    this.GetScore = function()  // f = g + h
    {
        return this.pathCost + this.estimate;   
    }

    this.SetPathCost = function( cost ){
        this.pathCost = cost;
    }

    this.SetCellCost = function( cost )
    {
        this.cellCost = cost;
    }

    this.Compare = function( otherNode )
    {
        return this.position.x == otherNode.position.x && this.position.y == otherNode.position.y;
    }

    this.CompareScore = function( otherNode )
    {
        /** compares this score with otherNode, returning true if this node has a better score that the other */
        return this.GetScore() < otherNode.GetScore();
    }

}

class PathFinder
{
    constructor( gameManager )
    {

        this.gameManager = gameManager;
        
        this.open = [];
        this.closed = [];
        this.currentNode = null;

    }

    FindPath( startPosition, endPosition )
    {
        // TODO: i really need to do somthink about this offset.
        var startPos = {
            x: startPosition.x - 1,
            y: startPosition.y - 2
        }
        
        var endPos = {
            x: endPosition.x - 1,
            y: endPosition.y - 2
        }

        this.open = [];
        this.closed = [];
        this.currentNode = new PathNode(null, startPos);
        var foundEnd = false;

        do{

            var adjacentCellsData = this.GetAdjacentCells( this.currentNode, endPos);
            var adjacentCells = adjacentCellsData.items;

            var bestId = adjacentCellsData.best;
            var bestScore = 0;

            // add the current cell the the closed list.
            this.closed.push( this.currentNode );


            // add the addjacent cells to the open list accordingly.
            // if its in the closed list ignore it.
            // if its not in the open list add it
            // otherwise if its in the open list, re-caculate its score and switch to it if it is better then the current, updateing the parent ect....

            for ( var i = 0; i < adjacentCells.length; i++ )
            { 
                
                if ( this.closed.findIndex( (elem) => elem.Compare( adjacentCells[i] ) ) > -1)
                {
                    if (bestId == i) bestId = -1;
                    continue;
                }
                else
                {
                    var openIndex = this.open.findIndex( (elem) => elem.Compare( adjacentCells[i] ) );

                    if ( openIndex == -1 )
                    {
                        if (bestId == i) bestId = this.open.length;
                        this.open.push( adjacentCells[i] );
                    }
                    else if ( adjacentCells[i].CompareScore( this.open[ openIndex ] ) )
                    {
                        if (bestId == i) bestId = openIndex;
                        this.open[ openIndex ] = adjacentCells[i]
                    }
                }
            }

            // set the current to the best est and remove it form the list of items
            if ( bestId == -1 )
            {
                // find the next best
                for ( var i = 0; i < this.open.length; i++ )
                {
                    var score = this.open[i].GetScore();
                    if ( bestId == -1 || score < bestScore )
                    {
                        bestId = i;
                        bestScore = score;
                    }
                }
            }

            this.currentNode = this.open[ bestId ];

            this.open.splice( bestId, 1 );

            if ( this.currentNode.position.x == endPos.x && this.currentNode.position.y == endPos.y )
            {
                Debug.Print("end", "Found End!")
                foundEnd = true;
                break;  // we have the end
            }

        }while( this.open.length > 0 );

        if ( !foundEnd )
        {
            Debug.Print("end", "Failed To Find End!")
            return []; // TODO: return the path with the lowest est.
        }
        var path = [];

        var p = 0;
        while ( this.currentNode.parent )
        {
            path.push( this.currentNode.position );
            this.currentNode = this.currentNode.parent;
            Debug.Print( "bob", "fff " + (p++) );

        }

        path.reverse();
        return path;

    }

    GetAdjacentCells( parent, endPosition )
    {
        
        var position = parent.position;
        var mapSize = this.gameManager.mapSize;
        var adjacentCells = []
        
        var bestEst = 0
        var bestId = -1   // -1 == None Found.

        // get the four adjacent cells
        var adjCellPositions = [ 
            {x: position.x - 1, y: position.y}, // left
            {x: position.x + 1, y: position.y}, // right
            {x: position.x, y: position.y - 1}, // up
            {x: position.x, y: position.y + 1}, // down
        ]

        for ( var i = 0; i < adjCellPositions.length; i++ )
        {
               
            var cellId = this.gameManager.GetCellId( adjCellPositions[i].x, adjCellPositions[i].y );

            if ( cellId > -1 && !this.gameManager.cover[ cellId ] )
            {

                var est = this.GetEstimate(adjCellPositions[i], endPosition)

                if ( bestId == -1 || est < bestEst)
                {
                    bestEst = est;
                    bestId = adjacentCells.length;
                }

                var adjCell = new PathNode(parent, adjCellPositions[i], est, 1) ;
                adjacentCells.push( adjCell );
                
            }
        }

        return {
            best: bestId,
            items: adjacentCells
        }

    }       

    GetEstimate( fromPos, toPos )
    {
        /* Gets an estimated value based on the Manhattan distance method (aka city block distance) */

        var dif = {
            x: Math.abs( toPos.x - fromPos.x ),
            y: Math.abs( toPos.y - fromPos.y )
        };

        return dif.x + dif.y;
    }

}