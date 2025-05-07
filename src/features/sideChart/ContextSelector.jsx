const ContextSelector = ({setExibitionType}) =>{
    
    
    return <div style={{display:'flex', justifyContent: 'space-between', padding:'1.5rem', paddingTop: '0.5rem', paddingBottom:'0rem'}}>
        <div onClick={_=>setExibitionType('chart')}>Gráfico</div>
        <div onClick={_=>setExibitionType('table')}>Tabela</div>
    </div>
}

export default ContextSelector