const fs = require('fs');
const firebase = require('firebase');
const databasePath = "./utils/database/database.json";

if (!fs.existsSync(databasePath)) {
  console.error('Where the fuck is database.json');
  process.exit(1);
}

const firebaseConfig = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

/**
 * @param {string} id - ID del usuario o país (id del rol del país)
 * @param {string} dataName - Nombre del dato a modificar. (ej literacy)
 * @param {number|string} value - Valor a sumar al dato existente.
 */

async function addData(id, dataName, value) {
  if (!id || !dataName || value === undefined) {
    console.error('Failed parameters in addData');
    return;
  }

  const ref = db.ref(`data/players/${id}/${dataName}`);
  try {
    const snapshot = await ref.once('value');
    const currentValue = snapshot.val() || 0;
    await ref.set(currentValue + value);
    console.log(`[LOG] Database ${id} -> ${dataName} = ${currentValue + value}`);
  } catch (err) {
    console.error('Error updating in addData', err);
  }
}

/**
 * @param {string} id - ID del usuario o país (id del rol del país)
 * @param {string} dataName - Nombre del dato a modificar. (ej literacy)
 * @param {any} value - Valor a establecer
 */
async function setData(id, dataName, value) {
  if (!id || !dataName || value === undefined) {
    console.error('Failed parameters in setData');
    return;
  }

  const ref = db.ref(`data/players/${id}/${dataName}`);
  try {
    await ref.set(value);
    console.log(`[LOG] Database ${id} -> ${dataName} = ${value}`);
  } catch (err) {
    console.error('Error setting in setData', err);
  }
}

/**
 * @param {string} id - ID del usuario o país (id del rol del país)
 * @param {string} dataName - Nmbre del dato a obtener. (ej literacy)
 * @param {any} defaultValue - Valor por defecto si no existe el dato
 * @returns {Promise<any>} - Devuelve el valor obtenido o el valor por defecto
 */

async function getData(id, dataName, defaultValue = null) {
  if (!id || !dataName) {
    console.error('Failed parameters in getData');
    return defaultValue;
  }

  const ref = db.ref(`data/players/${id}/${dataName}`);
  try {
    const snapshot = await ref.once('value');
    return snapshot.exists() ? snapshot.val() : defaultValue;
  } catch (err) {
    console.error('Error getting in getData', err);
    return defaultValue;
  }
}

module.exports = { addData, setData, getData };
