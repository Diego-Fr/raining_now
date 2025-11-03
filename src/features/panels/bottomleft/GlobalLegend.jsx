import { useEffect, useMemo, useState } from 'react';
import styles from './GlobalLegend.module.scss'
import { FiChevronUp } from "react-icons/fi";
import { useSelector } from 'react-redux'


const GlobalLegend = _ => {

    const lightningOptions = useSelector(state => state.lightning)

    const [legendsList, setLegendsList] = useState({
        lighthing: {title: 'lighthing', open: true, show:false, list: [{label:'Recentes (<=30min)', color:'#FF0000'},{label:'Anteriores(>30min)', color:'#e6f700ff'}]},
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
            <div className={styles.container}>
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