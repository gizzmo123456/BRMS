
function PathNode(parent=null, position={x: 0, y: 0}, estimate=999, cellCost = 1)
{
    
    this.parent = parent;
    this.position = position;

    this.cellCost = cellCost;
    this.pathCost = parent ? parent.GetScore() + this.cellCost : 0           // g
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

class PathFinder // TODO: Sometimes it fails to find a path, Fix it. 
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

        this.open = [ new PathNode(null, startPos, this.GetEstimate( startPos, endPos)) ];
        this.closed = [];
        this.currentNode = null;
        var foundEnd = false;

        var bestId = -1;
        var bestScore = 0;

        while( this.open.length > 0 )
        {

            bestScore = 0;

            // Find the node with the best estimate
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

            // set the best to the current node, removing it from the open list and moving it into the closed list.
            this.currentNode = this.open[ bestId ];
            this.open.splice( bestId, 1 );
            this.closed.push( this.currentNode );

            // Get the adjacent cells of the current node
            var adjacentCellsData = this.GetAdjacentCells( this.currentNode, endPos);
            var adjacentCells = adjacentCellsData.items;

            var adjBestId = adjacentCellsData.best;
            bestId = -1;

            // add the addjacent cells to the open list accordingly.
            // if its in the closed list ignore it.
            // if its not in the open list add it
            // otherwise if its in the open list, re-caculate its score and switch to it if it is better then the current, updateing the parent ect....

            for ( var i = 0; i < adjacentCells.length; i++ )
            { 
                
                if ( this.closed.findIndex( (elem) => elem.Compare( adjacentCells[i] ) ) > -1)
                {
                    Debug.Print( "Ship", "Skip in closed! " + this.currentNode.position.x +", "+ this.currentNode.position.y );
                    continue;
                }
                else
                {
                    var openIndex = this.open.findIndex( (elem) => elem.Compare( adjacentCells[i] ) );

                    if ( openIndex == -1 )
                    {
                        Debug.Print( "Ship", "Not in Open" );

                        //if (adjBestId == i) bestId = this.open.length;  // this makes it a little faster but its also less accurate
                        this.open.push( adjacentCells[i] );
                    }
                    else{

                        Debug.Print( "Ship", "In open" );

                        //if (adjBestId == i) bestId = openIndex;        // this makes it a little faster but its also less accurate
                        if ( adjacentCells[i].CompareScore( this.open[ openIndex ] ) )
                            this.open[ openIndex ] = adjacentCells[i]

                    }
                    
                }
            }

            if ( this.currentNode.position.x == endPos.x && this.currentNode.position.y == endPos.y )
            {
                Debug.Print("end", "Found End!")
                foundEnd = true;
                break;  // we have the end
            }

        }

        if ( !foundEnd )
        {
            Debug.Print("end", "Failed To Find End! ( opn: "+ this.open.length+" cl: "+ this.closed.length +")")
            var lowestEst = 0;
            var estId = -1;

            // find the cloest node.
            for ( var i = 0; i < this.closed.length; i++)
            {
                var est = this.closed[i].estimate;
                if ( estId == -1 || est < lowestEst)
                {
                    lowestEst = est
                    estId = i;
                }
            }

            Debug.Print("endest", `End Est Id ${estId}`);
            if (estId == -1) return [];

            this.currentNode = this.closed[estId];

        }

        // Compile the list of cords down, 
        // so we only have the points when it changes direction
        var path = [];
        var p = 0;

        var lastDirection = { x: 0, y: 0 }
        var lastNode = this.currentNode;

        path.push( this.currentNode.position ); // add the end point

        this.currentNode = lastNode.parent;
        
        while ( this.currentNode.parent )
        {
            var difX = this.currentNode.position.x - lastNode.position.x;
            var difY = this.currentNode.position.y - lastNode.position.y;
            
            var currentDirection = {
                x:  difX == 0 ? 0 : ( difX > 0 ? 1 : -1),
                y:  difY == 0 ? 0 : ( difY > 0 ? 1 : -1)
            };

            if ( lastDirection.x != currentDirection.x && lastDirection.y != currentDirection.y)
                path.push( lastNode.position );     // add the points inbetween

            lastNode = this.currentNode;
            lastDirection = currentDirection;
            this.currentNode = this.currentNode.parent;
            Debug.Print( "bob", "fff " + (p++) );
        }

        path.push( this.currentNode.position ); // add the start point

        path.reverse();
        return path;

    }

    GetAdjacentCells( parent, endPosition )
    {
        
        var position = parent.position;
        var mapSize = this.gameManager.mapSize;
        var adjacentCells = []
        
        var bestScore = 0
        var bestId = -1   // -1 == None Found.

        // get the four adjacent cells
        var adjCellPositions = [ 
            {x: position.x, y: position.y - 1}, // up
            {x: position.x + 1, y: position.y}, // right
            {x: position.x, y: position.y + 1}, // down
            {x: position.x - 1, y: position.y}, // left
        ]

        for ( var i = 0; i < adjCellPositions.length; i++ )
        {
               
            var cellId = this.gameManager.GetCellId( adjCellPositions[i].x, adjCellPositions[i].y );

            if ( cellId > -1 && !this.gameManager.cover[ cellId ] )
            {
                var cellCost = 1;
                ///** this is slow AF, TODO: ill see if i can make it async :) 
                var cellCost = this.gameManager.map[ cellId ] + 1;
                if ( cellCost == 0 ) // Mine. avoid
                    cellCost = 1000;
                //*/

                var est = this.GetEstimate(adjCellPositions[i], endPosition)
                var adjCell = new PathNode(parent, adjCellPositions[i], est, cellCost) ;
                var score = adjCell.GetScore();

                if ( bestId == -1 || score < bestScore)
                {
                    bestScore = score;
                    bestId = adjacentCells.length;
                }

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