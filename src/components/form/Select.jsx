import { useEffect, useRef, useState } from "react"
import styles from './Select.module.scss'

const Select = options =>{
    const {list,onChange, name} = options
    const [show, setShow] = useState(false)
    const [selectOptions, setSelectOptions] = useState([])
    const listContainerRef = useRef()
    const selectRef = useRef()
    const containerRef = useRef()
    const [inputValue, setInputValue] = useState('')
    const [listItems, setListItems] = useState()

    const clickHandler = (event) =>{
        console.log('click');
        
        // let value = event.target.value
        // onChange(value, name)
    }

    const handleBlur = () =>{
        setTimeout(() => {
            if (!listContainerRef.current.contains(document.activeElement)) {
                setShow(false);
            }
          }, 0);
    }

    const itemClick = (value) =>{
        let index = selectOptions.indexOf(value)
        if(index === -1){
            setSelectOptions([...selectOptions, value])
        } else {
            let copy = [...selectOptions]
            copy.splice(index, 1)
            setSelectOptions([...copy])
        }
    }

    useEffect(_=>{
        setInputValue(selectOptions.length > 2 ? `${selectOptions.length} selecionados` : selectOptions.length > 0 ? selectOptions.map(y=> list.filter(x=>x.value === y)[0].label): 'Nenhum selecionado')
    },[selectOptions])
    
    return (
        <div ref={containerRef} className={styles.container}>
            <input value={inputValue} readOnly ref={selectRef} className={styles.select} onFocus={_=>setShow(true)} onBlur={handleBlur}/>
            <div ref={listContainerRef} className={styles.optionsContainer}  tabIndex={-1} >
                    
                {show ? 
                    <>
                        <input type={'text'} className={styles.inputSearch} onFocus={_=>setShow(true)}/>
                        <div 
                            className={styles.itemsContainer} 
                            onMouseDown={e=>{
                                e.preventDefault()  
                            }}>

                        { list.map((item, index)=>( 
                            <div className={`${styles.item} ${selectOptions.includes(item.value) ? styles.active : ''}`} onClick={_=>itemClick(item.value)} key={index}>
                                {item.label}
                            </div> ))
                        } </div> </> : <></>
                }
            </div>
        </div>
    )
}

export default Select