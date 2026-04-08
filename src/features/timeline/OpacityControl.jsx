import { useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { setOpacity } from '@store/radarSlice'

export default function OpacityControl(){

    // const [opacity, setOpacity] = useState(.7)
    const opacity = useSelector(state=> state.radar.opacity)
    const dispatch = useDispatch()

    // console.log(setOpacity);
    

    return (
        <div style={{fontSize: 'x-small', fontWeight: 'bolder', display:'flex', alignItems: 'center'}}>
            Opacidade: <input type="range" value={opacity} style={{height: '2px'}} onChange={e=>dispatch(setOpacity(e.target.value))} step={.1} max={1} min={0}></input>
        </div>
    )
}