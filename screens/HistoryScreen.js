import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Modal, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const categories = ['Manutenção', 'Combustível', 'Multas', 'Impostos'];

const HistoryScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [filter, expenses]);

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

  const filterExpenses = () => {
    let filtered = [...expenses];
    switch (filter) {
      case 'lastMonth':
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return expenseDate >= lastMonth;
        });
        break;
      case 'last3Months':
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          const last3Months = new Date();
          last3Months.setMonth(last3Months.getMonth() - 3);
          return expenseDate >= last3Months;
        });
        break;
      case 'last6Months':
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          const last6Months = new Date();
          last6Months.setMonth(last6Months.getMonth() - 6);
          return expenseDate >= last6Months;
        });
        break;
      case 'lastYear':
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          const lastYear = new Date();
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          return expenseDate >= lastYear;
        });
        break;
      case 'all':
        // No filtering needed
        break;
      default:
        // Custom filter
        // Implement your custom filtering logic here if needed
        break;
    }
    setFilteredExpenses(filtered);
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Button title="All" onPress={() => setFilterAndCloseModal('all')} />
          <Button title="Last Year" onPress={() => setFilterAndCloseModal('lastYear')} />
          <Button title="Last 6 Months" onPress={() => setFilterAndCloseModal('last6Months')} />
          <Button title="Last 3 Months" onPress={() => setFilterAndCloseModal('last3Months')} />
          <Button title="Last Month" onPress={() => setFilterAndCloseModal('lastMonth')} />
        </View>
      </View>
    </Modal>
  );

  const setFilterAndCloseModal = (selectedFilter) => {
    setFilter(selectedFilter);
    setModalVisible(false);
  };

  const renderFilterButton = () => (
    <TouchableOpacity
      style={styles.filterButton}
      onPress={() => setModalVisible(true)}>
      <Text style={styles.buttonText}>Filter: {filter}</Text>
    </TouchableOpacity>
  );

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.item}>
        <MaterialIcons name="description" size={24} color="#FFD700" style={styles.itemIcon} />
        <Text style={styles.itemText}>Description: {item.expense}</Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="attach-money" size={24} color="#008000" style={styles.itemIcon} />
        <Text style={styles.itemText}>Amount: ${item.amount}</Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="category" size={24} color="#FF6347" style={styles.itemIcon} />
        <Text style={styles.itemText}>Category: {item.category}</Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="today" size={24} color="#0000FF" style={styles.itemIcon} />
        <Text style={styles.itemText}>Date: {formatDate(item.date)}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteExpense(item.id)} style={styles.deleteButton}>
        <MaterialIcons name="delete" size={24} color="red" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const deleteExpense = async (id) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem('@expenses', JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  const calculateTotal = () => {
    let total = 0;
    filteredExpenses.forEach(expense => {
      total += parseFloat(expense.amount);
    });
    return total.toFixed(2);
  };

  return (
    <View style={styles.container}>
      {renderFilterButton()}
      {renderFilterModal()}
      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        style={styles.historyList}
      />
      <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
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
  filterButton: {
    backgroundColor: '#00CED1', // Cor verde água
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'black',
    marginLeft: 5,
  },
  historyList: {
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
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HistoryScreen;
