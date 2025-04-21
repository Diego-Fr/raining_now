const Select = options =>{
    const {list,onChange, name} = options


    const handleOnChange = (event) =>{
        let value = event.target.value
        onChange(value, name)
    }
    
    return (
        <>
            <select onChange={handleOnChange}>
                {list.map(item=>( 
                    <option key={item.id} value={item.id}>
                        {item.value}
                    </option>
                ))}
            </select>
        </>
    )
}

export default Select