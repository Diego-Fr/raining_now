import { createContext, useContext, useEffect, useState } from "react"
import { CanvasMarkersLoader } from "../services/canvas_markers"

const CanvasMarkerContext = createContext(null)

export function CanvasMarkerProvider({children}){

    const [state, setState] = useState({
        canvasMarkersReady: false,
        error: null
    })

    useEffect(_=>{
        CanvasMarkersLoader()
            .then(_=> setState({canvasMarkersReady: true, error:null}))
            .catch(e=> setState({canvasMarkersReady:false, error:e}));
    },[])

    return (
        <CanvasMarkerContext.Provider value={state}>
            {children}
        </CanvasMarkerContext.Provider>
    )

}

export function useCanvasMarkerReady(){
    return useContext(CanvasMarkerContext)
}