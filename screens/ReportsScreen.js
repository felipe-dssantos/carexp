import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';

const categories = ['Manutenção', 'Combustível', 'Multas', 'Impostos'];

const ReportsScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('lastMonth');
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalFuel, setTotalFuel] = useState(0);
  const [totalOther, setTotalOther] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});
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
    let filteredExpenses = [...expenses];
    switch (filter) {
      case 'lastMonth':
        filteredExpenses = filteredExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return expenseDate >= lastMonth;
        });
        break;
      case 'currentMonth':
        filteredExpenses = filteredExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const currentMonth = new Date();
          const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
          return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
        });
        break;
      case 'last3Months':
        filteredExpenses = filteredExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const last3Months = new Date();
          last3Months.setMonth(last3Months.getMonth() - 3);
          return expenseDate >= last3Months;
        });
        break;
      case 'last6Months':
        filteredExpenses = filteredExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const last6Months = new Date();
          last6Months.setMonth(last6Months.getMonth() - 6);
          return expenseDate >= last6Months;
        });
        break;
      case 'lastYear':
        filteredExpenses = filteredExpenses.filter(expense => {
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
    calculateTotals(filteredExpenses);
  };

  const calculateTotals = (filteredExpenses) => {
    let totalMonth = 0;
    let totalFuel = 0;
    let totalOther = 0;

    const categoryTotals = {};

    filteredExpenses.forEach(expense => {
      totalMonth += parseFloat(expense.amount);
      if (expense.category === 'Combustível') {
        totalFuel += parseFloat(expense.amount);
      } else {
        totalOther += parseFloat(expense.amount);
      }

      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += parseFloat(expense.amount);
      } else {
        categoryTotals[expense.category] = parseFloat(expense.amount);
      }
    });

    setTotalMonth(totalMonth);
    setTotalFuel(totalFuel);
    setTotalOther(totalOther);
    setCategoryTotals(categoryTotals);
  };

  const renderReport = () => {
    const chartData = Object.keys(categoryTotals).map(category => ({
      name: category,
      amount: categoryTotals[category],
      color: getCategoryColor(category),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));

    return (
      <View style={styles.reportContainer}>
        <Text style={styles.reportTitle}>Monthly Expenses Report</Text>
        <Text>Total Expenses: ${totalMonth.toFixed(2)}</Text>
        <Text>Total Fuel Expenses: ${totalFuel.toFixed(2)}</Text>
        <Text>Total Other Expenses: ${totalOther.toFixed(2)}</Text>
        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#1E2923',
            backgroundGradientTo: '#08130D',
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Combustível':
        return '#FF6347'; // Vermelho
      case 'Manutenção':
        return '#FFD700'; // Amarelo
      case 'Multas':
        return '#87CEEB'; // Azul claro
      case 'Impostos':
        return '#808080'; // Cinza
      default:
        return '#000000'; // Preto
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Filter: {filter}</Text>
      </TouchableOpacity>
      {renderReport()}
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
            <Button
              title="Last Month"
              onPress={() => {
                setFilter('lastMonth');
                setModalVisible(false);
              }}
            />
            <Button
              title="Last 3 Months"
              onPress={() => {
                setFilter('last3Months');
                setModalVisible(false);
              }}
            />
            <Button
              title="Last 6 Months"
              onPress={() => {
                setFilter('last6Months');
                setModalVisible(false);
              }}
            />
            <Button
              title="Last Year"
              onPress={() => {
                setFilter('lastYear');
                setModalVisible(false);
              }}
            />
            <Button
              title="All"
              onPress={() => {
                setFilter('all');
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  filterButton: {
    backgroundColor: '#00CED1',
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
    marginTop: 20,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ReportsScreen;
