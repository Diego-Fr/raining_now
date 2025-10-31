const GlobalLegend = _ => {
    return (
        <div className={styles.container}>
            <div className="legend-title">Legenda Global</div>
            <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#00FF00'}}></span>
                <span className="legend-label">Chuva Leve</span>
            </div>
            <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#FFFF00'}}></span>
                <span className="legend-label">Chuva Moderada</span>
            </div>
            <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#FF0000'}}></span>
                <span className="legend-label">Chuva Forte</span>
            </div>
        </div>
    )
}
export default GlobalLegend;