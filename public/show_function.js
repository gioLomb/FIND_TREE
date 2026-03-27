// Recupera tutti gli alberi dal server
function loadTrees() {
  return fetch('/get_all_trees').then(res => res.json());
}

// Rimuove i marker esistenti e li ridisegna con i dati aggiornati
function printTreesMarkers() {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker && layer !== userMarker) {
      map.removeLayer(layer);
    }
  });

  loadTrees().then(trees => {
    trees.forEach(tree => {
      L.marker([tree.lat, tree.lng]).addTo(map).bindPopup(`${tree.tree}`);
    });
  }).catch(err => alert('errore nella stampa dei marker ' + err));
}

// Popola il dropdown con gli alberi salvati
function printTreesSelect() {
  loadTrees().then(trees => {
    let select = document.getElementById('sel_tree');
    select.innerHTML = '';
    trees.forEach(tree => {
      let option = document.createElement('option');
      option.value = tree['_id'];
      option.text = tree['tree'];
      select.appendChild(option);
    });
  }).catch(err => alert('errore nella richiesta per gli alberi ' + err));
}

// Aggiorna in una sola fetch sia i marker sulla mappa che le opzioni del dropdown
function refreshTrees() {
  loadTrees().then(trees => {
    // Aggiorna marker
    map.eachLayer(layer => {
      if (layer instanceof L.Marker && layer !== userMarker) {
        map.removeLayer(layer);
      }
    });
    trees.forEach(tree => {
      L.marker([tree.lat, tree.lng]).addTo(map).bindPopup(`${tree.tree}`);
    });

    // Aggiorna select
    let select = document.getElementById('sel_tree');
    select.innerHTML = '';
    trees.forEach(tree => {
      let option = document.createElement('option');
      option.value = tree['_id'];
      option.text = tree['tree'];
      select.appendChild(option);
    });
  }).catch(err => alert('errore nel refresh ' + err));
}