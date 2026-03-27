// Acquisisce la posizione GPS corrente e salva l'albero nel database
function addTreeWithPosition() {
  console.log('adding ', document.getElementById('tree').value);

  if (document.getElementById('tree').value.trim() == '') { alert('vuoto'); return; }
  if (!navigator.geolocation) { alert('no bro,niente posizione'); return; }

  // Mostra lo spinner durante l'acquisizione GPS
  document.getElementById('loading-overlay').style.display = 'flex';

  navigator.geolocation.getCurrentPosition(position => {
    let tree = document.getElementById('tree').value;
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    fetch('/add_tree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tree, lat, lng })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        refreshTrees();
        document.getElementById('tree').value = '';
        document.getElementById('loading-overlay').style.display = 'none';
      })
      .catch(err => alert('errore per aggiunta albero ' + err));
  });
}

// Traccia una linea rossa dalla posizione attuale all'albero selezionato
function reachTree() {
  // Rimuove la linea di navigazione precedente, se presente
  map.eachLayer(layer => {
    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
      map.removeLayer(layer);
    }
  });

  let idTree = document.getElementById('sel_tree').value;

  fetch(`/get_tree?id=${idTree}`)
    .then(res => res.json())
    .then(data => {
      console.log('vuoi raggiungere ', data);
      L.polyline(
        [[userMarker.getLatLng().lat, userMarker.getLatLng().lng], [data.lat, data.lng]],
        { color: 'red' }
      ).addTo(map);
    })
    .catch(err => alert('errore nelle indicazioni ' + err));
}

// Elimina l'albero selezionato e aggiorna la mappa
function deleteTree() {
  let idTree = document.getElementById('sel_tree').value;

  fetch('/delete_tree', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idTree })
  })
    .then(res => res.json())
    .then(data => {
      console.log('record eliminati:', data);
      refreshTrees();
    })
    .catch(err => alert('errore nell\'eliminazione ' + err));
}

// Invia una richiesta al server per riprodurre l'alert sonoro
function playDangerAlert() {
  fetch('/danger_alert')
    .then(res => res.text())
    .then(data => alert(data))
    .catch(err => alert('errore nell\'avviso ' + err));
}