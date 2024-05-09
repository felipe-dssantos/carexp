import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('carxp.db');

export const createTables = async () => {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS car (
      id INTEGER PRIMARY KEY NOT NULL, 
      model TEXT NOT NULL, 
      plate TEXT, 
      year INTEGER
    )`
  );

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY NOT NULL, 
      description TEXT NOT NULL, 
      type INTEGER NOT NULL
    )`
  );

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS expense (
      id INTEGER PRIMARY KEY NOT NULL, 
      description TEXT NOT NULL, 
      date TEXT NOT NULL, 
      amount REAL NOT NULL, 
      category_id INTEGER NOT NULL, 
      car_id INTEGER NOT NULL, 
      FOREIGN KEY(category_id) REFERENCES category(id), 
      FOREIGN KEY(car_id) REFERENCES car(id)
    )`
  );

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS earning (
      id INTEGER PRIMARY KEY NOT NULL, 
      description TEXT NOT NULL, 
      date TEXT NOT NULL, 
      amount REAL NOT NULL, 
      category_id INTEGER NOT NULL, 
      car_id INTEGER NOT NULL, 
      FOREIGN KEY(category_id) REFERENCES category(id), 
      FOREIGN KEY(car_id) REFERENCES car(id)
    )`
  );

  await insertDefaultCars();
  await insertDefaultCategories();
};

const executeQuery = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertCar = async (model, plate, year) => {
  await executeQuery(
    'INSERT INTO car (model, plate, year) VALUES (?, ?, ?)',
    [model, plate, year]
  );
};

export const insertCategory = async (description, type) => {
  await executeQuery(
    'INSERT INTO category (description, type) VALUES (?, ?)',
    [description, type]
  );
};

export const insertExpense = async (description, date, amount, categoryId, carId) => {
  await executeQuery(
    'INSERT INTO expense (description, date, amount, category_id, car_id) VALUES (?, ?, ?, ?, ?)',
    [description, date, amount, categoryId, carId]
  );
};

export const insertEarning = async (description, date, amount, categoryId, carId) => {
  await executeQuery(
    'INSERT INTO earning (description, date, amount, category_id, car_id) VALUES (?, ?, ?, ?, ?)',
    [description, date, amount, categoryId, carId]
  );
};

export const getCategories = async () => {
  const result = await executeQuery('SELECT * FROM category');
  return result.rows._array;
};

export const getCars = async () => {
  const result = await executeQuery('SELECT * FROM car');
  return result.rows._array;
};

export const insertDefaultCars = async () => {
  const cars = await getCars();
  if (cars.length === 0) {
    await insertCar('gol', null, null);
  }
};

export const insertDefaultCategories = async () => {
  const categories = await getCategories();
  if (categories.length === 0) {
    await insertCategory('Combustivel', 1);
  }
};

export const getExpenses = async () => {
  const result = await executeQuery('SELECT * FROM expense');
  return result.rows._array;
};

export const getEarnings = async () => {
  const result = await executeQuery('SELECT * FROM earning');
  return result.rows._array;
};




export const getAllTransactions = async () => {
  // Consulta SQL para obter todas as transações com a descrição da categoria e do modelo do carro
  const query = `
    SELECT 
      t.*, 
      c.description AS category_description,
      car.model AS car_model 
    FROM 
      (
        SELECT id, description, date, amount, category_id, car_id FROM expense
        UNION ALL
        SELECT id, description, date, amount, category_id, car_id FROM earning
      ) AS t
    LEFT JOIN category AS c ON t.category_id = c.id
    LEFT JOIN car ON t.car_id = car.id
  `;
  
  const result = await executeQuery(query);
  console.log("Resultados da consulta:", result.rows._array); // Adicione esta linha
  return result.rows._array;
};

