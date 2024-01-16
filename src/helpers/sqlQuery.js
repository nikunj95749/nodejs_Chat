import SQLite from 'react-native-sqlite-storage';

function openCB() {}

function errorCB() {}

const PendingWorkOrdersResults = 'PENDINGWORKORDERSRESULTS';

const openDatabaseConnection = async () => {
  const db = SQLite.openDatabase(
    'fast.db',
    '1.0',
    'fast Database',
    200000,
    openCB,
    errorCB,
  );
  return db;
};

export const createTable = async (query = '') => {
  const db = await openDatabaseConnection();

  db.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      () => {},
      (error) => {},
    );
  });
};
// dispatch(setRefreshedOfflineData());

export const insertNewItemInPendingWorkOrdersResults = async (object = {}, itemId = '') => {
  await createTable(
    `CREATE TABLE IF NOT EXISTS ${PendingWorkOrdersResults} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT, itemId TEXT)`,
  );
  const db = await openDatabaseConnection();
  const foodString = JSON.stringify(object);

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO ${PendingWorkOrdersResults} (data,itemId) VALUES (?,?)`,
      [foodString, itemId],
      () => {},
      (error) => {
        console.log('insertNewItemInPendingWorkOrdersResults==== ', error);
      },
    );
  });
};

export const getpendingWorkOrdersResults = async () => {
  const db = await openDatabaseConnection();

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${PendingWorkOrdersResults}`,
        [],
        (_, result) => {
          const rows = result.rows;
          let foods = [];
          for (let i = 0; i < rows.length; i++) {
            
            foods = [...foods,rows.item(i)];
          }
          resolve(foods);
        },
        (_, error) => {
          console.log('error===error>> ', error);
          resolve([]);
        },
      );
    });
  });
};

export const updateAllDataFromPendingWO = async (newData) => {
  const db = await openDatabaseConnection();

  const newDataString = JSON.stringify(newData);

  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE ${PendingWorkOrdersResults} SET data = ?`,
      [newDataString],
      () => {},
      (error) => {},
    );
  });
};

export const deleteItemFromPendingWO = async (id = '') => {
  const db = await openDatabaseConnection();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${PendingWorkOrdersResults} WHERE itemId = ${id}`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const updateItemFromPendingWO = async (data = '',id = '') => {
  const db = await openDatabaseConnection();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${PendingWorkOrdersResults} set data=? WHERE itemId = ${id}`,
        [data],
        () => {
          console.log('updateItemFromPendingWO Success');
          resolve();
        },
        (_, error) => {
          console.log('updateItemFromPendingWO Failed');
          reject(error);
          return false;
        },
      );
    });
  });
};

export const clearPendingWoTbl = async () => {
  const db = await  openDatabaseConnection();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${PendingWorkOrdersResults}`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};
