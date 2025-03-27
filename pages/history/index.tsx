import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '../../types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('timerHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory).reverse());
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const deleteHistoryItem = async (index: number) => {
    Alert.alert(
      'Delete History Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const newHistory = [...history];
              newHistory.splice(index, 1);
              setHistory(newHistory);
              await AsyncStorage.setItem('timerHistory', JSON.stringify(newHistory.reverse()));
            } catch (error) {
              console.error('Failed to delete history item', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const clearAllHistory = async () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all history items?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setHistory([]);
              await AsyncStorage.removeItem('timerHistory');
            } catch (error) {
              console.error('Failed to clear history', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed Timers</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearAllHistory}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {history.length === 0 ? (
        <Text style={styles.emptyText}>No completed timers yet</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.historyItem}>
              <View style={styles.itemContent}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyCategory}>{item.category}</Text>
                <Text style={styles.historyDate}>{formatDate(item.completedAt)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteHistoryItem(index)}
              >
                <MaterialCommunityIcons name="delete-outline" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearAllText: {
    color: '#ff4444',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 16,
    // marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  itemContent: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  historyCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default HistoryScreen;