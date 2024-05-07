import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { getExpenses, getEarnings, getAllTransactions } from '../src/database/Db';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showYearModal, setShowYearModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [showCarModal, setShowCarModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, selectedYear, selectedDay, selectedCar, selectedCategory]);

  const loadTransactions = async () => {
    let transactions = [];

    if (selectedMonth || selectedYear || selectedDay || selectedCar || selectedCategory) {
      // Filtros aplicados
      const allExpenses = await getExpenses();
      const allEarnings = await getEarnings();
      transactions = [...allExpenses, ...allEarnings];

      if (selectedMonth) {
        transactions = transactions.filter(t => new Date(t.date).getMonth() + 1 === parseInt(selectedMonth));
      }
      if (selectedYear) {
        transactions = transactions.filter(t => new Date(t.date).getFullYear() === parseInt(selectedYear));
      }
      if (selectedDay) {
        transactions = transactions.filter(t => new Date(t.date).getDate() === parseInt(selectedDay));
      }
      if (selectedCar) {
        transactions = transactions.filter(t => t.car_id === selectedCar);
      }
      if (selectedCategory) {
        transactions = transactions.filter(t => t.category_id === selectedCategory);
      }
    } else {
      // Sem filtros, carrega todas as transações
      transactions = await getAllTransactions(); // Essa função precisa ser implementada
    }

    setTransactions(transactions);
  };

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.transaction}>
        <Text>{new Date(item.date).toLocaleDateString()}</Text>
        <Text>{item.description}</Text>
        {/* Aqui você pode substituir o ID do carro e da categoria pela descrição */}
        <Text>{item.category_id}</Text>
        <Text>{item.amount}</Text>
        <Text>{item.car_id}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <Button title="Selecione o mês" onPress={() => setShowMonthModal(true)} />
        {/* Adicione mais botões para os outros filtros aqui */}
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Modal para seleção de mês */}
      <Modal visible={showMonthModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Selecione o mês</Text>
            <Button title="Fechar" onPress={() => setShowMonthModal(false)} />
          </View>
        </View>
      </Modal>
      {/* Adicione mais modals para os outros filtros aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});
