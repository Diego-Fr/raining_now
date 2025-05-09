import { useEffect, useRef, useState } from "react"
import styles from './Select.module.scss'

const Select = options =>{
    const {list,onchange, field_id} = options
    const [show, setShow] = useState(false)
    const [selectOptions, setSelectOptions] = useState([])
    const listContainerRef = useRef()
    const selectRef = useRef()
    const containerRef = useRef()
    const [inputValue, setInputValue] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [listCopy, setListCopy] = useState([]) //helper para ter uma cópia da lista original



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
        if(listCopy.length === 0){
            setListCopy([...list])
        }
    },[list])

    useEffect(_=>{
        let copy = list.filter(x=>  x.label.toLowerCase().includes(searchValue))
        setListCopy([...copy])
    }, [searchValue])


    useEffect(_=>{
        setInputValue(selectOptions.length > 2 ? `${selectOptions.length} selecionados` : selectOptions.length > 0 ? selectOptions.map(y=> list.filter(x=>x.value === y)[0].label): 'Nenhum selecionado')
        onchange({field: field_id, values: selectOptions})
    },[selectOptions])
    
    return (
        <div ref={containerRef} className={styles.container}>
            <input value={inputValue} readOnly ref={selectRef} className={styles.select} onFocus={_=>setShow(true)} onBlur={handleBlur}/>
            <div ref={listContainerRef} className={styles.optionsContainer}  tabIndex={-1} >
                    
                {show ? 
                    <>
                        <div className={styles.inputSearchWrapper}>
                            <input type={'text'} value={searchValue} onChange={e=>setSearchValue(e.target.value)} placeholder="Buscar" className={styles.inputSearch} onFocus={_=>setShow(true)}/>
                        </div>
                        <div 
                            className={styles.itemsContainer} 
                            onMouseDown={e=>{
                                e.preventDefault()  
                            }}>

                        { listCopy.map((item, index)=>( 
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