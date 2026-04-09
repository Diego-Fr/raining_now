import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GlobalLegend.module.scss'
import { FiChevronUp } from "react-icons/fi";
import { useSelector } from 'react-redux'


const GlobalLegend = _ => {

    const lightningOptions = useSelector(state => state.lightning)
    const radarOptions = useSelector(state =>state.radar)
    const legendContainerRef = useRef(null)

    const [legendsList, setLegendsList] = useState({
        lighthing: {title: 'lighthing', open: true, show:false, list: [{label:'Recentes (<=30min)', color:'#FF0000'},{label:'Anteriores(>30min)', color:'#e6f700ff'}]},
        radar: {title: 'radar', open: true, show:false, list: [
            {label: '0 <> 0.5 mm/h', color: 'rgb(200, 200, 200)'},
            {label: '0.5 <> 1 mm/h', color: 'rgba(213, 255, 255)'},
            {label: '1 <> 2 mm/h', color: 'rgba(0, 213, 255)'},
            {label: '2 <> 3 mm/h', color: 'rgba(0, 128, 170)'},
            {label: '3 <> 5 mm/h', color: 'rgba(0, 0, 179)'},
            {label: '5 <> 7 mm/h', color: 'rgba(128, 255, 85)'},
            {label: '7 <> 10 mm/h', color: 'rgba(0, 204, 127)'},
            {label: '10 <> 15 mm/h', color: 'rgba(85, 128, 0)'},
            {label: '15 <> 20 mm/h', color: 'rgba(0, 85, 0)'},
            {label: '20 <> 25 mm/h', color: 'rgba(255, 255, 0)'},
            {label: '25 <> 30 mm/h', color: 'rgba(255, 204, 0)'},
            {label: '30 <> 40 mm/h', color: 'rgba(255, 153, 0)'},
            {label: '40 <> 50 mm/h', color: 'rgba(213, 85, 0)'},
            {label: '50 <> 75 mm/h', color: 'rgba(255, 187, 255)'},
            {label: '75 <> 100 mm/h', color: 'rgba(255, 43, 128)'},
            {label: '100 <> 250 mm/h', color: 'rgba(128, 0, 170)'}
        ]}
    })

    const [legendsOptions, setLegendsOptions] = useState({
        open:true
    })

    const legendsListValues = useMemo(_=> Object.values(legendsList).filter(x=>x.show), [legendsList])

    useEffect(_=>{
        setLegendsList(state=>({
            ...state,
            'lighthing': {...legendsList['lighthing'], open:true, show: lightningOptions.show}
        }))
    },[lightningOptions.show])

    useEffect(_=>{
        setLegendsList(state=>({
            ...state,
            'radar': {...legendsList['radar'], open:true, show: radarOptions.show}
        }))
    },[radarOptions.show])

    useEffect(_=>{
        
        setContainerSize()
        
    },[])

    useEffect(_=>{
        setContainerSize()
    }, [legendsList])

    const setContainerSize = () =>{
        const interval = setInterval(_=>{
            const el = document.getElementById('context_menu')
            
            if(el && legendContainerRef.current){
                let height = el.getBoundingClientRect().bottom
                let screenSize = window.innerHeight
                legendContainerRef.current.style.maxHeight = `${(screenSize - height - 15)}px`
                clearInterval(interval)
            }

        }, 500)

        return () => clearInterval(interval)
    }

    const toggleClick = title =>{
        let value = legendsList[title].open

        setLegendsList(state=>({
            ...state,
            [title]: {...legendsList[title], open: !value}
        }))
        
    }

    const toggleLegends = () =>{
        setLegendsOptions(state=>({
            ...state,
            open: !state.open
        }))
    }
    

    return (
        legendsListValues.length > 0 &&
            <div className={styles.container} ref={legendContainerRef}>
                <div className={styles.mainTitleContainer} style={{marginBottom: legendsOptions.open ? 10 : 0}} ><div>Legendas</div><div className={styles.toggle} style={{transform: !legendsOptions.open ?'rotate(180deg)' : ''}}  onClickCapture={toggleLegends}><FiChevronUp/></div></div>
                <div style={{ overflow: 'hidden', height: legendsOptions.open ? 'fit-content' : 0 }}>
                {legendsListValues.map((legend,index)=>(
                    <div key={index}>
                        <div className={styles.titleContainer}><div className={styles.title}>{legend.title}</div><div className={styles.toggle} style={{transform: !legend.open ?'rotate(180deg)' : ''}} onClickCapture={_=>toggleClick(legend.title)}><FiChevronUp/></div></div>
                        <div style={{ overflow: 'hidden', height: legend.open ? 'fit-content' : 0 }}>
                        {legend.list.map((item, index)=>(
                            <div className={styles.legendItem} key={index}>
                                <div className={styles.legendColor} style={{backgroundColor: item.color}}></div>
                                <span className="legend-label">{item.label}</span>
                            </div>
                        ))}
                        </div>
                        
                    </div>
                ))}
                </div>
            </div>        
    )
}
export default GlobalLegend;