import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const HistoryScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState({});

  const loadExpenses = useCallback(async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('@expenses');
      if (storedExpenses !== null) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
        calculateMonthlyTotals(parsedExpenses);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const calculateMonthlyTotals = (expenses) => {
    const totals = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += parseFloat(expense.amount);
      return acc;
    }, {});
    setMonthlyTotals(totals);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  const deleteExpense = async (id) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem('@expenses', JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
      calculateMonthlyTotals(updatedExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

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

  const renderSeparator = (prevItem, currItem) => {
    const prevDate = new Date(prevItem.date);
    const currDate = new Date(currItem.date);

    if (prevDate.getMonth() !== currDate.getMonth() || prevDate.getFullYear() !== currDate.getFullYear()) {
      const monthYear = `${currDate.getMonth() + 1}/${currDate.getFullYear()}`;
      const total = monthlyTotals[monthYear] || 0;
      return (
        <View style={styles.separator}>
          <Text style={styles.separatorText}>
            {monthYear} - Total: ${total.toFixed(2)}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderExpenses = () => {
    const expensesWithSeparators = [];

    expenses.forEach((expense, index) => {
      if (index === 0 || renderSeparator(expenses[index - 1], expense)) {
        expensesWithSeparators.push({
          isSeparator: true,
          date: expense.date,
        });
      }
      expensesWithSeparators.push(expense);
    });

    return expensesWithSeparators;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={loadExpenses}>
        <MaterialIcons name="refresh" size={24} color="white" />
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
      <FlatList
        data={renderExpenses()}
        renderItem={({ item }) => item.isSeparator ? (
          <View style={styles.separator}>
            <Text style={styles.separatorText}>
              {`${new Date(item.date).getMonth() + 1}/${new Date(item.date).getFullYear()}`}   $ - {monthlyTotals[`${new Date(item.date).getMonth() + 1}/${new Date(item.date).getFullYear()}`]?.toFixed(2) || '0.00'}
            </Text>
          </View>
        ) : renderExpenseItem({ item })}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        style={styles.historyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    padding: 20,
  },
  refreshButton: {
    backgroundColor: '#00A86B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  expenseItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFF',
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
  historyList: {
    width: '100%',
  },
  separator: {
    padding: 10,
    backgroundColor: '#00A86B',
    marginBottom: 10,
    borderRadius: 5,
  },
  separatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'red',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
