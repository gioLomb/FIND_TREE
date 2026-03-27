const path = require('path');
const express = require('express');
const getLocalIp = require('./getIp');
const startTunnel = require('./ngrokTunnel');
const { exec } = require('child_process');
const {
  connectDb,
  addTreeInDb,
  getAllTreesFromDb,
  closeDb,
  getFilteredTree,
  deleteTreeFromDb
} = require('./db');

const app = express();
const port = 8080;
const localIp = getLocalIp();

app.use(express.json());

// Serve i file statici dalla cartella /public
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Pagina principale
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'DUX.HTML'));
});

// Restituisce un singolo albero per ID
app.get('/get_tree', async (req, res) => {
  try {
    const id = req.query.id;
    const filteredTree = await getFilteredTree(id);
    console.log(filteredTree);
    res.json(filteredTree);
  } catch (err) {
    res.status(500).send('Errore nel filtro');
  }
});

// Restituisce tutti gli alberi salvati
app.get('/get_all_trees', async (req, res) => {
  try {
    const result = await getAllTreesFromDb();
    res.json(result);
  } catch (err) {
    res.status(500).send('Errore nel recuperare gli alberi');
  }
});

// Riproduce alert.wav sulla macchina host tramite PowerShell
app.get('/danger_alert', (req, res) => {
  const soundPath = path.join(publicDir, 'alert.wav');
  const psCommand = `powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync();`;

  exec(psCommand, (err) => {
    if (err) {
      console.error("Errore nella riproduzione:", err);
      return res.status(500).send("Errore nel suono");
    }
    res.send("Allarme suonato!");
  });
});

// Elimina un albero per ID
app.post('/delete_tree', async (req, res) => {
  try {
    const idTree = req.body.idTree;
    const result = await deleteTreeFromDb(idTree);
    res.json(result);
  } catch (err) {
    res.status(500).send('Errore nell\'eliminazione: ' + err);
  }
});

// Aggiunge un nuovo albero con nome e coordinate GPS
app.post('/add_tree', async (req, res) => {
  try {
    const { tree, lat, lng } = req.body;
    if (!tree || typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).send('Dati mancanti o non validi');
    }
    const result = await addTreeInDb({ tree, lat, lng });
    console.log('risultato inserimento: ', result);
    res.json({ tree, lat, lng });
  } catch (err) {
    console.error('Errore nell\'inserimento:', err);
    res.status(500).send('Errore server aggiunta albero: ' + err);
  }
});

// Avvia il server Express, poi apre il tunnel ngrok
app.listen(port, async () => {
  console.log(`Server running at http://${localIp}:${port}/`);

  try {
    const url = await startTunnel();
    console.log('NGROK attivo su:', url);
  } catch (err) {
    console.error('Errore avvio tunnel NGROK:', err);
  }
});

// Chiude la connessione MongoDB all'uscita del processo
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, async () => {
    await closeDb();
    process.exit(0);
  });
});