class Input
{

    constructor( canvas )
    {
        this.mouseDown = false;
        this.mousePressedCallback = []  // function must have param bool down, int button id

        // mouse positions in pixels
        this.currentMousePosition = { x: 0, y: 0 };
        this.frameMousePosition =   { x: 0, y: 0 };
        this.deltaMousePosition =   { x: 0, y: 0 };

        console.log (canvas);

        canvas.addEventListener("mousemove", (e) => { this.__UpdateMousePosition(e);               } );
        canvas.addEventListener("mousedown", (e) => { this.__TriggerMouseDownCallback(e, true);     } );
        canvas.addEventListener("mouseup",   (e) => { this.__TriggerMouseDownCallback(e, false);   } );
        canvas.addEventListener("mouseout",  (e) => { this.__TriggerMouseDownCallback(e, false);   } );
    }

    TickInputs()
    {
        
        var lastMousePosition = this.frameMousePosition;
        this.frameMousePosition = this.currentMousePosition;
        this.deltaMousePosition = {
            x: this.frameMousePosition.x - lastMousePosition.x,
            y: this.frameMousePosition.y - lastMousePosition.y
        };

        var text = "MousePostion X: " + this.frameMousePosition.x +" Y: "+this.frameMousePosition.y+" Delta X: "+ this.deltaMousePosition.x +" Y: "+this.deltaMousePosition.y+" Down: "+this.mouseDown;
        document.getElementById("debug").innerHTML = text;
    
    }

    __UpdateMousePosition(event)
    {
        this.currentMousePosition = { x: event.offsetX, y: event.offsetY }
    }

    __TriggerMouseDownCallback( e, down )
    {

        this.mouseDown = down;

        for ( var i = 0; i < this.mousePressedCallback.length; i++ )
            this.mousePressedCallback[i]( down, e.button );

    }

    GetMousePosition()
    {
        return this.frameMousePosition;
    }

}