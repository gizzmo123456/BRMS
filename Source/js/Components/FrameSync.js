
class FrameSync
{

    constructor( fps )
    {
        this.active = true;
        this.fps = fps;
        this.frameLength = 1000.0/fps;
        this.lastFrame = 0; //ms

        this.renderTime = 0;
        this.deltaTime = 0;

        this.timerHandle;
    }

    NextFrame()
    {
        return this.lastFrame + this.frameLength;
    }

    GetSyncTime()
    {
        return this.NextFrame() - Date.now();
    }

    Invoke( funct ) // TODO: improve the accracy.
    {

        if (this.lastFrame == 0)
            this.lastFrame = Date.now();

        // This should be in a time class? we cant do it 100% here
        this.renderTime = Date.now() - this.lastFrame;
        this.deltaTime = this.NextFrame() - this.lastFrame; 

        var syncTime = this.GetSyncTime();
        this.lastFrame = this.NextFrame();
        
        if ( syncTime < 0 )
        {
            this.Invoke( funct );   // if the frame was missed skip it.
            return;
        }

        this.timerHandle = setTimeout( funct, syncTime );

        Debug.Print("RenderTime", 
                     this.renderTime.toFixed(2) + " of " + this.deltaTime.toFixed(2)
                    )

    }

    Cancel()
    {
        this.active = false;

        if (this.timerHandle)
            clearTimeout( this.timerHandle )
    }
}