import { useRef } from "react";

const FilterInput = ({filterText, onFilterTextChange}) => {
    const inputRef = useRef(null);

    return (
        <div>
            <input
                ref={inputRef}
                value={filterText}
                onChange={_ => onFilterTextChange(inputRef.current.value)}
            />
        </div>
    );
}

export default FilterInput