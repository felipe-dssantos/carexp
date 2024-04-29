import * as SQLite from 'expo-sqlite';

// Conexão com o banco de dados SQLite
const db = SQLite.openDatabase('carxp.db');

// Função para criar as tabelas no banco de dados
export const createTables = () => {
  db.transaction(tx => {
    // Tabela 'car'
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS car (id INTEGER PRIMARY KEY NOT NULL, model TEXT NOT NULL, plate TEXT, year INTEGER)',
      [],
      (tx, result) => {
        console.log('Tabela "car" criada com sucesso');
      },
      (tx, error) => {
        console.error('Erro ao criar tabela "car": ', error);
      }
    );

    // Tabela 'category'
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY NOT NULL, description TEXT NOT NULL, type INTEGER NOT NULL)',
      [],
      (tx, result) => {
        console.log('Tabela "category" criada com sucesso');
      },
      (tx, error) => {
        console.error('Erro ao criar tabela "category": ', error);
      }
    );

    // Tabela 'expense'
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS expense (id INTEGER PRIMARY KEY NOT NULL, description TEXT NOT NULL, date TEXT NOT NULL, category_id INTEGER, car_id INTEGER, FOREIGN KEY(category_id) REFERENCES category(id), FOREIGN KEY(car_id) REFERENCES car(id))',
      [],
      (tx, result) => {
        console.log('Tabela "expense" criada com sucesso');
      },
      (tx, error) => {
        console.error('Erro ao criar tabela "expense": ', error);
      }
    );

    // Tabela 'earning'
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS earning (id INTEGER PRIMARY KEY NOT NULL, description TEXT NOT NULL, date TEXT NOT NULL, category_id INTEGER, car_id INTEGER, FOREIGN KEY(category_id) REFERENCES category(id), FOREIGN KEY(car_id) REFERENCES car(id))',
      [],
      (tx, result) => {
        console.log('Tabela "earning" criada com sucesso');
      },
      (tx, error) => {
        console.error('Erro ao criar tabela "earning": ', error);
      }
    );
  });
};



// Função para cadastrar um carro na tabela 'car'
export const insertCar = (model, plate, year) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO car (model, plate, year) VALUES (?, ?, ?)',
        [model, plate, year],
        (tx, result) => {
          console.log('Carro cadastrado com sucesso');
        },
        (tx, error) => {
          console.error('Erro ao cadastrar carro: ', error);
        }
      );
    });
  };
  
  // Exemplo de inserção de um carro
 // insertCar('Toyota Corolla', 'ABC123', 2022);
  
  // Função para cadastrar uma categoria na tabela 'category'
 export const insertCategory = (description, type) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO category (description, type) VALUES (?, ?)',
        [description, type],
        (tx, result) => {
          console.log('Categoria cadastrada com sucesso');
        },
        (tx, error) => {
          console.error('Erro ao cadastrar categoria: ', error);
        }
      );
    });
  };
  
  // Exemplo de inserção de uma categoria
 // insertCategory('Combustível', 0); // Supondo que '0' representa despesa
  
  // Função para cadastrar uma despesa na tabela 'expense'
 export const insertExpense = (description, date, categoryId, carId) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO expense (description, date, category_id, car_id) VALUES (?, ?, ?, ?)',
        [description, date, categoryId, carId],
        (tx, result) => {
          console.log('Despesa cadastrada com sucesso');
        },
        (tx, error) => {
          console.error('Erro ao cadastrar despesa: ', error);
        }
      );
    });
  };
  
  // Exemplo de inserção de uma despesa
 // insertExpense('Troca de óleo', '2024-04-28', 1, 1); // Supondo que '1' é o ID da categoria e do carro correspondentes
  
  // Função para cadastrar uma receita na tabela 'earning'
 export const insertEarning = (description, date, categoryId, carId) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO earning (description, date, category_id, car_id) VALUES (?, ?, ?, ?)',
        [description, date, categoryId, carId],
        (tx, result) => {
          console.log('Receita cadastrada com sucesso');
        },
        (tx, error) => {
          console.error('Erro ao cadastrar receita: ', error);
        }
      );
    });
  };
  
  // Exemplo de inserção de uma receita
 // insertEarning('Venda de peças', '2024-04-27', 2, 1); // Supondo que '2' é o ID da categoria e '1' é o ID do carro correspondentes

 
 // Função para recuperar todas as categorias do banco de dados
 export const getCategories = () => {
   return new Promise((resolve, reject) => {
     db.transaction(tx => {
       tx.executeSql(
         'SELECT * FROM category',
         [],
         (_, { rows }) => {
           const categories = rows._array;
           resolve(categories);
         },
         (_, error) => {
           console.error('Erro ao recuperar as categorias do banco de dados:', error);
           reject(error);
         }
       );
     });
   });
 };
 
 // Função para recuperar todos os carros do banco de dados
 export const getCars = () => {
   return new Promise((resolve, reject) => {
     db.transaction(tx => {
       tx.executeSql(
         'SELECT * FROM car',
         [],
         (_, { rows }) => {
           const cars = rows._array;
           resolve(cars);
         },
         (_, error) => {
           console.error('Erro ao recuperar os carros do banco de dados:', error);
           reject(error);
         }
       );
     });
   });
 };
 
 // Função para inserir carros padrão no banco de dados
export const insertDefaultCars = () => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO car (model) VALUES (?)',
      ['gol'],
      (_, { insertId }) => {
        console.log(`Carro padrão inserido com ID: ${insertId}`);
      },
      (_, error) => {
        console.error('Erro ao inserir carro padrão:', error);
      }
    );
  });
};

// Função para inserir categorias padrão no banco de dados
export const insertDefaultCategories = () => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO category (description, type) VALUES (?, ?)',
      ['combustivel', 1], // 1 para despesa
      (_, { insertId }) => {
        console.log(`Categoria padrão de despesa inserida com ID: ${insertId}`);
      },
      (_, error) => {
        console.error('Erro ao inserir categoria padrão de despesa:', error);
      }
    );
  });
};
