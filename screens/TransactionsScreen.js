import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getExpenses, getEarnings } from '../src/database/Db';

export default function TransactionsScreen() {
  const [expenses, setExpenses] = useState([]);
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    // Recupera despesas do banco de dados
    getExpenses().then(expenses => {
      setExpenses(expenses);
    });

    // Recupera ganhos do banco de dados
    getEarnings().then(earnings => {
      setEarnings(earnings);
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text>{item.description}</Text>
      <Text>{formatDate(item.date)}</Text>
      <Text>R$ {item.amount}</Text>
    </View>
  );

  // Função para formatar a data para exibição amigável
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato</Text>
      <Text style={styles.subtitle}>Despesas</Text>
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.subtitle}>Ganhos</Text>
      <FlatList
        data={earnings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
