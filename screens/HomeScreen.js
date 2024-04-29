import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à página Home!</Text>
      <Button
        title="Inserir Gastos"
        onPress={() => navigation.navigate('InsertExpense')}
      />
      <Button
        title="Inserir Ganhos"
        onPress={() => navigation.navigate('InsertEarning')}
      />
      <Button
        title="Extrato"
        onPress={() => navigation.navigate('Transactions')}
      />
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
});
