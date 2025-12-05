import { useRef } from "react";

const FilterInput = ({filterText, onFilterTextChange}) => {
    const inputRef = useRef(null);

    return (
        <div>
            <input
                ref={inputRef}
                style={{width: '150px', height:'100%', borderRadius: 5, border: '1px solid #c7c7c7', paddingLeft: 5, paddingRight:5, height: 25, outline:'none'}}
                value={filterText}
                onChange={_ => onFilterTextChange(inputRef.current.value)}
            />
        </div>
    );
}

export default FilterInput