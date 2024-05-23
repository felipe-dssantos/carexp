import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons'; // Importando ícones do Material Icons

const categories = ['Manutenção', 'Combustível', 'Multas', 'Impostos'];

const App = () => {
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date()); // Alterado para exibir a data atual
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([]);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterCurrentMonthExpenses();
  }, [expenses]);

  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('@expenses');
      if (storedExpenses !== null) {
        setExpenses(JSON.parse(storedExpenses));
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const saveExpense = async () => {
    try {
      const newExpense = { id: Date.now().toString(), expense, amount, category, date };
      const updatedExpenses = [...expenses, newExpense];
      await AsyncStorage.setItem('@expenses', JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
      setExpense('');
      setAmount('');
      setCategory('');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const filterCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const filteredExpenses = expenses.filter(expense => {
      const expenseMonth = new Date(expense.date).getMonth() + 1;
      const expenseYear = new Date(expense.date).getFullYear();
      return expenseMonth === currentMonth && expenseYear === currentYear;
    });
    setCurrentMonthExpenses(filteredExpenses);
    calculateCurrentMonthTotal(filteredExpenses);
  };

  const calculateCurrentMonthTotal = (filteredExpenses) => {
    let total = 0;
    filteredExpenses.forEach(expense => {
      total += parseFloat(expense.amount);
    });
    setCurrentMonthTotal(total);
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.item}>
        <MaterialIcons name="description" size={24} color="black" style={styles.itemIcon} />
        <Text style={styles.itemText}>Descrição: {item.expense}</Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="attach-money" size={24} color="black" style={styles.itemIcon} />
        <Text style={styles.itemText}>Amount: ${item.amount}</Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="category" size={24} color="black" style={styles.itemIcon} />
        <Text style={styles.itemText}>Category: {item.category}</Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="today" size={24} color="black" style={styles.itemIcon} />
        <Text style={styles.itemText}>Date: {formatDate(item.date)}</Text>
      </View>
    </View>
  );

  // Função para formatar a data no formato dd/mm/aaaa
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Expense"
          value={expense}
          onChangeText={text => setExpense(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={text => setAmount(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Select Category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCalendar(true)}>
          <MaterialIcons name="today" size={24} color="white" />
          <Text style={styles.buttonText}>Select Date</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {categories.map(cat => (
                <Button
                  key={cat}
                  title={cat}
                  onPress={() => {
                    setCategory(cat);
                    setModalVisible(false);
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCalendar}
          onRequestClose={() => {
            setShowCalendar(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Calendar
                current={date.toISOString()}
                onDayPress={(day) => {
                  setDate(new Date(day.dateString));
                  setShowCalendar(false);
                }}
              />
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.addButton} onPress={saveExpense}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.reportContainer}>
        <Text style={styles.reportTitle}>Total do Mês: ${currentMonthTotal.toFixed(2)}</Text>
      </View>
      <FlatList
        data={currentMonthExpenses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFFF', // Cor verde água
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#00CED1', // Cor verde água
    flexDirection: 'row',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    marginTop: 1
  },
  expenseItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
  list: {
    width: '100%',
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
  reportContainer: {
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginEnd: 10
  },
});

export default App;
