const locale = {
    lang: 'pt-BR',
    items: {
        'pt-BR': {
            attention: 'atenção',
            alert: 'alerta',
            emergency: 'emergência',
            extravasation: 'extravasamento'
        }
    },
    t:function(text){
        return this.items[this.lang][text] || `Tradução não encrontrada para "${text}"`
    }
}


export {
    locale
}