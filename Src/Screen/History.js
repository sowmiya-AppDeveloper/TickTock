import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Components/Header';

const HistoryScreen = ({route}) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem('history');
        if (historyData) {
          setHistory(JSON.parse(historyData));
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };

    loadHistory();

    if (route.params?.updatedHistory) {
      setHistory(route.params.updatedHistory);
    }
  }, [route.params?.updatedHistory]);

  return (
    <View style={styles.container}>
      <Header title="Timer History" />
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={({item}) => (
            <View style={styles.historyItem}>
              <Text>{item.name}</Text>
              <Text>{item.completionTime}</Text>
            </View>
          )}
          keyExtractor={index => index.toString()}
        />
      ) : (
        <Text>No history available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
});
export default HistoryScreen;
