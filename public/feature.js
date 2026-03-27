function addTreeWithPosition(){
    console.log('adding ',document.getElementById('tree').value)
    if(document.getElementById('tree').value.trim()=='') {alert('vuoto');return} //controllo testo in input
    if(!navigator.geolocation){alert('no bro,niente posizione');return }
    document.getElementById('loading-overlay').style.display = 'flex'; //attivare caricamento
    navigator.geolocation.getCurrentPosition(position=>{
      let tree=document.getElementById('tree').value
      let lat=position.coords.latitude
      let lng=position.coords.longitude
      fetch('/add_tree',{
        method:'POST',
        headers: {
    'Content-Type': 'application/json'
  },
        body:JSON.stringify({tree,lat,lng})  //passaggio come stringa poichè viene utilizzato il metodo json() per leggere
      }).then(res=>res.json()).then(data=>{
        console.log(data);
        //aggiornamento marker e select con una fetch sola
        refreshTrees()
        document.getElementById('tree').value=''  //svuotiamo l'input
        document.getElementById('loading-overlay').style.display = 'none'; //disattiviamo caricamento
        }).catch(err=>alert('errore per aggiunta albero '+err))

    })
  }
   function reachTree(){
    //elimino la linea precedente
    map.eachLayer(layer=>{
      if((layer instanceof L.Polyline && !(layer instanceof L.Polygon))){
        map.removeLayer(layer)
      }
    })
    let idTree=document.getElementById('sel_tree').value
    fetch(`/get_tree?id=${idTree}`).then(res=>res.json()).then(data=>{
      console.log('vuoi raggiungere ',data)
      L.polyline([[userMarker.getLatLng().lat,userMarker.getLatLng().lng],[data.lat,data.lng]],{color:'red'}).addTo(map)
    }).catch(err=>alert('errore nelle indicazioni '+err))
  }
  function deleteTree(){
    let idTree=document.getElementById('sel_tree').value
    fetch('/delete_tree',{
      method:'POST', headers: {
    'Content-Type': 'application/json'
  },
      body:JSON.stringify({idTree})
    }).then(res=>res.json()).then(data=>{
      console.log('record eliminati:',data)
      //aggiornamento select e marker con una fetch sola
       refreshTrees()
    }).catch(err=>alert('errore nell\'eliminazione '+err))
  }
  function playDangerAlert(){
    fetch('/danger_alert')
    .then(res=>res.text())
    .then(data=>alert(data))
    .catch(err=>alert('errore nell\'avviso '+err))
  }