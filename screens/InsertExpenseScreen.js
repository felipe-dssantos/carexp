import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertExpense } from '../src/database/Db';
import { getCategories, getCars } from '../src/database/Db';

export default function InsertExpenseScreen() {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [value, setValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);

  useEffect(() => {
    // Recupera as categorias do banco de dados
    getCategories().then(categories => {
      setCategories(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id); // Seleciona a primeira categoria por padrão
      }
    });

    // Recupera os carros do banco de dados
    getCars().then(cars => {
      setCars(cars);
      if (cars.length > 0) {
        setSelectedCar(cars[0].id); // Seleciona o primeiro carro por padrão
      }
    });
  }, []);

  const handleInsertExpense = () => {
    // Verifica se todos os campos foram preenchidos
    if (!description || !selectedCategory || !selectedCar || !value) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Insere o gasto no banco de dados
    insertExpense(description, date.toISOString(), selectedCategory, selectedCar, parseFloat(value));

    // Limpa os campos após a inserção
    setDescription('');
    setDate(new Date());
    setSelectedCategory('');
    setSelectedCar('');
    setValue('');

    // Exibe uma mensagem de sucesso
    alert('Gasto inserido com sucesso!');
  };

  const renderCategoryModal = () => {
    return (
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCategory(category.id);
                  setShowCategoryModal(false);
                }}
              >
                <Text>{category.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  const renderCarModal = () => {
    return (
      <Modal
        visible={showCarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Carro</Text>
            {cars.map(car => (
              <TouchableOpacity
                key={car.id}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCar(car.id);
                  setShowCarModal(false);
                }}
              >
                <Text>{car.model}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inserir Gasto</Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={text => setDescription(text)}
      />
      <Text style={styles.label}>Data:</Text>
      <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="numeric"
        value={value}
        onChangeText={text => setValue(text)}
      />
      <Text style={styles.label}>Categoria:</Text>
      <Button title="Selecionar Categoria" onPress={() => setShowCategoryModal(true)} />
      <Text>{selectedCategory ? categories.find(cat => cat.id === selectedCategory)?.description : ''}</Text>
      <Text style={styles.label}>Carro:</Text>
      <Button title="Selecionar Carro" onPress={() => setShowCarModal(true)} />
      <Text>{selectedCar ? cars.find(car => car.id === selectedCar)?.model : ''}</Text>
      <Button title="Inserir Gasto" onPress={handleInsertExpense} />
      {renderCategoryModal()}
      {renderCarModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
