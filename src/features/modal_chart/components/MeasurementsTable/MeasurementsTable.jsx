import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import FilterInput from './FilterInput';


const columns = [
	{
		name: 'Date',
		selector: row => row.date,
    sortable: true
	},
	{
		name: 'Value',
		selector: row => row.value,
    sortable: true
	},
  {
    name: 'Classificação do dado',
    selector: row => row.classification,
    sortable: true
  }
];



const MeasurementsTable = ({measurements, chartContainerSize}) =>{
    const [rows, setRows] = useState([])
    const [filterText, setFilterText] = useState('');
    const filteredRows = useMemo(_=>rows.filter(row=> (filterText === '' || row.date.toLowerCase().includes(filterText.toLowerCase()))),[rows, filterText]);
    const [selectedRows, setSelectedRows] = useState([]);
    const inputFilterRef = useRef(null);

    const subHeader = () =>{
      return <div><FilterInput filterText={filterText} onFilterTextChange={setFilterText}/></div>
    }

    useEffect(_=>{
        if(measurements){          
            const formattedRows = measurements.map((measurement, index) => ({
                id: index + 1,
                date: measurement.date,
                value: measurement.value.toFixed(2).replace('.',','),
                classification: getClassificationType(measurement.measurement_classification_type_id?.toString())
            }));
            setRows(formattedRows);
        }
    },[measurements])

    const handleRowClick = row =>{
      const isSelected = selectedRows.some(r => r.id === row.id);
      console.log(row);
      
      if (isSelected) {
        setSelectedRows(selectedRows.filter(r => r.id !== row.id));
      } else {
        setSelectedRows([...selectedRows, row]);
      }
    }

    return (
        <div style={{ height: '100%', width: '100%'}}>
            <DataTable
              columns={columns}
              data={filteredRows}
              selectableRows //habilitar seleção de linhas
              pagination //paginação
              fixedHeader //header fixo
              fixedHeaderScrollHeight={chartContainerSize ? `${chartContainerSize - 150}px` : '400px'} //altura do header fixo
              paginationPerPage={20} //linhas por página
              paginationRowsPerPageOptions={[20, 50]} //opções de linhas por página
              onRowClicked={handleRowClick} //evento de clique na linha
              selectableRowsHighlight //highlight selected row
              dense={false} //modo compacto
              subHeader //ativar subheader
              subHeaderComponent={subHeader()} //componente do subheader
              pointerOnHover //mouse pointer on hover
              highlightOnHover //highlight row on hover
              selectableRowSelected={row => //override na seleção da linha para a variavel de estado
                selectedRows.some(r => r.id === row.id)
              }
            />
        </div>
    )
}

const getClassificationType = (typeId) => {
  switch(typeId) {
    case '3':
      return 'bruto';
    default:
      return typeId;
  }
}

export default MeasurementsTable