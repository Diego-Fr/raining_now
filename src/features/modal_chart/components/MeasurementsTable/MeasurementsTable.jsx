import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef } from 'react';
import {useSelector} from 'react-redux'
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import FilterInput from './FilterInput';
import ClassificationButton from './ClassificationButtons';
import { isLogged,hasAnyOfRoles } from "@utils/authUtils"
import { MdOutlineCheckBox,MdOutlineCheckBoxOutlineBlank,MdOutlineIndeterminateCheckBox } from "react-icons/md";






const MeasurementsTable = ({measurements, chartContainerSize}) =>{
    const [rows, setRows] = useState([])
    const [filterText, setFilterText] = useState('');
    
    const authOptions = useSelector(state=>state.auth)
    const modalChartOptions = useSelector(state=>state.modalchart)

    const filteredRows = useMemo(_=>rows.filter(row=> (filterText === '' || row.date.toLowerCase().includes(filterText.toLowerCase()))),[rows, filterText]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(0)    
    
    const canEdit = useMemo(_=> isLogged(authOptions) && hasAnyOfRoles(authOptions, ['dev', 'admin']) && modalChartOptions.groupType === 'minute', [authOptions,modalChartOptions.groupType])

    useEffect(_=>{
      if(selectAll === 1){
        setSelectedRows(filteredRows);
      } else if(selectAll === 2 || selectAll === 0) {
        setSelectedRows([]);
      }
      
    }, [selectAll])


    const columns = [
      ...(canEdit ? [{
        name: (
          <div
            onClick={() => setSelectAll(selectAll === 0 ? 1 : 0)}
            style={{
              cursor: 'pointer',
              // padding: "4px 8px",
              fontSize: 18,
              textAlign:'left'
              // border:'1px solid gray'
            }}
          >
            {selectAll === 0 ? <MdOutlineCheckBoxOutlineBlank/> : <MdOutlineCheckBox/> }
          </div>
        ),
        cell: () => null,
        // width: "72px",
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        sortable: false,
      }] :[]),
      {
        name: 'Data',
        selector: row => row.date,
        sortable: true
      },
      {
        name: 'Value (mm)',
        selector: row => row.value,
        sortable: true
      },
      {
        name: 'Classificação do dado',
        selector: row => row.classification,
        sortable: true
      }
    ];

    const subHeader = () =>{
      return <div style={{display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'center'}}><FilterInput filterText={filterText} onFilterTextChange={setFilterText}/><ClassificationButton selectedRows={selectedRows}/></div>
    }

    useEffect(_=>{
        if(measurements){          

            const formattedRows = measurements.map((measurement, index) => ({
                id: index + 1,
                measurement_id: measurement.measurement_id,
                date: measurement.date,
                value: measurement.value.toFixed(2).replace('.',','),
                classification: getClassificationType(measurement.measurement_classification_type_id?.toString())
            }));
            setRows(formattedRows);
        }
    },[measurements])

    const handleRowClick = row =>{
      if(!canEdit) return;

      const isSelected = selectedRows.some(r => r.id === row.id);
      
      
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
              selectableRows={canEdit} //habilitar seleção de linhas
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
              pointerOnHover={canEdit} //mouse pointer on hover
              highlightOnHover={canEdit} //highlight row on hover
              selectableRowSelected={row => //override na seleção da linha para a variavel de estado
                selectedRows.some(r => r.id === row.id)
              }
              selectableRowsNoSelectAll
            />
        </div>
    )
}

const getClassificationType = (typeId) => {
  switch(typeId) {
    case '2':
      return 'pré-consistido';
    case '3':
      return 'bruto';
    case '4':
      return 'suspeito'
    default:
      return typeId;
  }
}

export default MeasurementsTable