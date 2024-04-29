import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native'; // Importe o TextInput
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertExpense } from '../src/database/Db';
import { getCategories, getCars } from '../src/database/Db';

export default function InsertExpenseScreen() {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [carsLoaded, setCarsLoaded] = useState(false);

  useEffect(() => {
    if (!categoriesLoaded) {
      // Recupera as categorias do banco de dados
      getCategories().then(categories => {
        setCategories(categories);
        if (categories.length > 0) {
          setSelectedCategory(categories[0].id); // Seleciona a primeira categoria por padrão
        }
        setCategoriesLoaded(true);
      });
    }

    if (!carsLoaded) {
      // Recupera os carros do banco de dados
      getCars().then(cars => {
        setCars(cars);
        if (cars.length > 0) {
          setSelectedCar(cars[0].id); // Seleciona o primeiro carro por padrão
        }
        setCarsLoaded(true);
      });
    }
  }, [categoriesLoaded, carsLoaded]);

  const handleInsertExpense = () => {
    // Verifica se todos os campos foram preenchidos
    if (!description || !selectedCategory || !selectedCar) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Insere o gasto no banco de dados
    insertExpense(description, date.toISOString(), selectedCategory, selectedCar);

    // Limpa os campos após a inserção
    setDescription('');
    setDate(new Date());
    setSelectedCategory('');
    setSelectedCar('');

    // Exibe uma mensagem de sucesso
    alert('Gasto inserido com sucesso!');
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
      <Text style={styles.label}>Categoria:</Text>
      <Picker
        style={styles.picker}
        selectedValue={selectedCategory}
        onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
      >
        {categories.map(category => (
          <Picker.Item key={category.id} label={category.description} value={category.id} />
        ))}
      </Picker>
      <Text style={styles.label}>Carro:</Text>
      <Picker
        style={styles.picker}
        selectedValue={selectedCar}
        onValueChange={(itemValue, itemIndex) => setSelectedCar(itemValue)}
      >
        {cars.map(car => (
          <Picker.Item key={car.id} label={car.model} value={car.id} />
        ))}
      </Picker>
      <Button title="Inserir Gasto" onPress={handleInsertExpense} />
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
  picker: {
    width: '80%',
  },
  datePicker: {
    width: '80%',
    marginBottom: 10,
  },
});
