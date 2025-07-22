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

// Middleware per leggere JSON
app.use(express.json());
// Middleware per servire file statici
let publicDir=__dirname.split('\\').slice(0,(__dirname.split('\\')).length-1).join('\\')
console.log(publicDir)
app.use(express.static(path.join(publicDir, 'public')));

// 📄 Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'public', 'DUX.HTML'));
});

// 🌳 Ottieni albero filtrato per ID
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

// 🌳 Ottieni tutti gli alberi
app.get('/get_all_trees', async (req, res) => {
  try {
    const result = await getAllTreesFromDb();
    res.json(result);
  } catch (err) {
    res.status(500).send('Errore nel recuperare gli alberi');
  }
});

// 🚨 Allarme sonoro
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

// 🗑️ Elimina albero
app.post('/delete_tree', async (req, res) => {
  try {
    const idTree = req.body.idTree;
    const result = await deleteTreeFromDb(idTree);
    res.json(result);
  } catch (err) {
    res.status(500).send('Errore nell\'eliminazione: ' + err);
  }
});

// ➕ Aggiungi albero
app.post('/add_tree', async (req, res) => {
  try {
    const result = await addTreeInDb(req.body);
    console.log('risultato inserimento: ', result);
    res.json(req.body);
  } catch (err) {
    console.error('Errore nell\'inserimento:', err);
    res.status(500).send('Errore server aggiunta albero: ' + err);
  }
});

// ✅ Avvia server Express e poi Ngrok
app.listen(port, async () => {
  console.log(`Server running at http://${localIp}:${port}/`);

  try {
    const url = await startTunnel();
    console.log('NGROK attivo su:', url);
  } catch (err) {
    console.error('Errore avvio tunnel NGROK:', err);
  }
});

// 🔒 Chiudi connessione MongoDB in caso di interruzione
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, async () => {
    await closeDb();
    process.exit(0);
  });
});

