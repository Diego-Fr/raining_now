import { useEffect, useRef, useState } from "react"
import styles from './Select.module.scss'

const Select = options =>{
    const {list,onchange, field_id, searchable=true, minWidth=200, selected, multiple=true, allowEmpty=true, label} = options
    const [show, setShow] = useState(false)
    const [selectOptions, setSelectOptions] = useState([])
    const listContainerRef = useRef()
    const selectRef = useRef()
    const containerRef = useRef()
    const [inputValue, setInputValue] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [listCopy, setListCopy] = useState([]) //helper para ter uma cópia da lista original


    //fechar caixa no click fora
    const handleBlur = (force=false) =>{
        setTimeout(() => {
            if (!listContainerRef.current.contains(document.activeElement) || force) {
                setShow(false);
            }
          }, 0);
    }

    //select item click
    const itemClick = (value) =>{
        
        let index = selectOptions.indexOf(value)
        if(index === -1){
            setSelectOptions([...(multiple ? selectOptions : []), value])
            
        } else if(!allowEmpty && selectOptions.length === 1) {
            //chill
        } else { 
            let copy = [...selectOptions]
            copy.splice(index, 1)
            setSelectOptions([...copy])
        }

        //remover o focus quando não é multiplo
        if(!multiple){  
            selectRef.current.blur()
        }
    }

    //criando cópia da lista quando a lista é definida/alterada
    useEffect(_=>{
        if(listCopy.length === 0){
            setListCopy([...list])
        }
    },[list])

    //filtrando quando valor do search muda
    useEffect(_=>{
        let copy = list.filter(x=>  x.label.toLowerCase().includes(searchValue))
        setListCopy([...copy])
    }, [searchValue])


    //alterando o valor da caixa na seleção
    //disparando onchange do pai
    useEffect(_=>{
        
        if(list?.length > 0){            
            setInputValue(selectOptions.length > 2 ? `${selectOptions.length} selecionados` : selectOptions.length > 0 ? selectOptions.map(y=> list.filter(x=>x.value === y)[0].label): 'Nenhum selecionado')
            if(onchange){
                onchange({field: field_id, values: selectOptions})
            }
        }
        
    },[selectOptions])

    //alterando posicionamento do select list container dinamicamente
    useEffect(_=>{       

        let {left, right, top, bottom} = selectRef.current.getBoundingClientRect()

        if(left && right && top && bottom){
            if(window.innerWidth < left + minWidth){
                // console.log('nao cabe');
                listContainerRef.current.style.right = 0
            }
        }

    },[show])

    //definindo seleção padrão caso passada
    useEffect(_=>{
        if(selected != undefined){
            if(Array.isArray(selected)){
                setSelectOptions(selected)
            } else {
                setSelectOptions([selected])
            }
            
        }
    }, [])
    
    return (
        <div ref={containerRef} className={styles.container}>
            {label && <label>{label}</label>}
            <input value={inputValue} readOnly ref={selectRef} className={styles.select} onFocus={_=>setShow(true)} onBlur={handleBlur}/>
            <div ref={listContainerRef} className={styles.optionsContainer} style={{minWidth: minWidth}} tabIndex={-1} >
                    
                {show ? 
                    <>
                        {searchable && <div className={styles.inputSearchWrapper}>
                            <input type={'text'} value={searchValue} onChange={e=>setSearchValue(e.target.value)} placeholder="Buscar" className={styles.inputSearch} onFocus={_=>setShow(true)}/>
                        </div>}
                        
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