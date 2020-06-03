
class Debug
{
    static inst;

    constructor( debugHoldName="debug" )
    {
        Debug.inst = this;
        this.holdElement = document.getElementById( debugHoldName );
        this.debugsElements = { };
    }

    static Print(id, message, add=false)
    {
        var elem;

        if ( !(id in Debug.inst.debugsElements) )
        {
            elem = document.createElement("div")
            elem.id = id;
            Debug.inst.holdElement.appendChild( elem );
            Debug.inst.debugsElements[id] = elem;
        }
        else
        {
            elem = Debug.inst.debugsElements[id];
        }

        if ( add )
            elem.innerHTML += "<br />" + message;
        else
            elem.innerHTML = message
    }

    static Clear( id )
    {
        if ( id in Debug.inst.debugsElements )
            Debug.inst.debugsElements[id].innerHTML = "";
        
    }
}