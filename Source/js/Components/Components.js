
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
