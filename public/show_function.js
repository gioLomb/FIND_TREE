function printTreesMarkers(){
      //rimuovi marker precedenti
      map.eachLayer(layer => {
    if (layer instanceof L.Marker && layer !== userMarker) {
      map.removeLayer(layer);
    }
  });

      fetch('/get_all_trees')
      .then(res=>res.json())
      .then(trees=>{  
        //attraversamento array json
        trees.forEach((tree)=>{ 
          L.marker([tree.lat,tree.lng]).addTo(map).bindPopup(`${tree.tree}`)
        })
      }).catch(err=>alert('errore nella stampa dei marker '+err))
 }
  
  function printTreesSelect(){
    fetch('/get_all_trees')
  .then(res => res.json())
  .then(trees => {
    let select=document.getElementById('sel_tree')
    select.innerHTML=''      //svuotiamo select prima di ristampare
    trees.forEach(tree=>{
      let option=document.createElement('option')
      option.value=tree['_id']
      option.text=tree['tree']
      select.appendChild(option)})}) // o console.log(data)
  .catch(err => alert('errore nella richiesta per gli alberi '+err));
  }