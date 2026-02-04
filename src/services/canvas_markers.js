let loaded = false;
let promise;

export function CanvasMarkersLoader(){
    if(loaded) return Promise.resolve();

    if(!promise){
        promise = import('leaflet-markers-canvas')
            .then((mod) =>{
                loaded = true                
            }).catch(({err})=>{
                console.log('Erro ao carregar lib de canvas markers');
                loaded = false
            })
    }

    return promise
}
