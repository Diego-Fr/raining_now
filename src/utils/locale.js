const locale = {
    lang: 'pt-BR',
    items: {
        'pt-BR': {
            attention: 'atenção'
        }
    },
    t:function(text){
        return this.items[this.lang][text]
    }
}


export {
    locale
}