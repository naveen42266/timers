import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, StatusBar, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, Timer, HistoryItem } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import CategorySection from '../../components/Category';

type TimersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const TimersScreen: React.FC = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState('');
  const navigation = useNavigation<TimersScreenNavigationProp>();

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const savedTimers = await AsyncStorage.getItem('timers');
        if (savedTimers) {
          const parsedTimers: Timer[] = JSON.parse(savedTimers);
          setTimers(parsedTimers);

          const uniqueCategories = [...new Set(parsedTimers.map(timer => timer.category))];
          setCategories(uniqueCategories);

          const initialExpandedState: Record<string, boolean> = {};
          uniqueCategories.forEach(cat => {
            initialExpandedState[cat] = false;
          });
          setExpandedCategories(initialExpandedState);
        }
      } catch (error) {
        console.error('Failed to load timers', error);
      }
    };

    loadTimers();
  }, []);

  useEffect(() => {
    const saveTimers = async () => {
      try {
        await AsyncStorage.setItem('timers', JSON.stringify(timers));
      } catch (error) {
        console.error('Failed to save timers', error);
      }
    };

    saveTimers();
  }, [timers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const updatedTimers = prevTimers.map(timer => {
          if (timer.status === 'running' && timer.remainingTime > 0) {
            const newRemainingTime = timer.remainingTime - 1;

            if (timer.halfwayAlert && !timer.halfwayTriggered &&
              newRemainingTime <= timer.duration / 2) {
              // alert(`Halfway there for ${timer.name}!`);
              Alert.alert(
                `Halfway there for ${timer.name}!`, '', [
                { text: 'OK', onPress: () => console.log('OK Pressed') }  // No action
              ],
                { cancelable: false }
              );
              timer.halfwayTriggered = true;
            }

            if (newRemainingTime <= 0) {
              timer.status = 'completed';
              setCompletedTimerName(timer.name);
              setCompletedModalVisible(true);
              addToHistory(timer);
            }

            return { ...timer, remainingTime: newRemainingTime };
          }
          return timer;
        });
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addToHistory = async (timer: Timer) => {
    try {
      const historyItem: HistoryItem = {
        name: timer.name,
        category: timer.category,
        completedAt: new Date().toISOString(),
      };

      const existingHistory = await AsyncStorage.getItem('timerHistory');
      const newHistory = existingHistory
        ? [...JSON.parse(existingHistory), historyItem]
        : [historyItem];

      await AsyncStorage.setItem('timerHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save to history', error);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleTimerAction = (timerId: string, action: 'start' | 'pause' | 'reset') => {
    setTimers(prevTimers =>
      prevTimers.map(timer => {
        if (timer.id === timerId) {
          switch (action) {
            case 'start':
              return { ...timer, status: 'running' };
            case 'pause':
              return { ...timer, status: 'paused' };
            case 'reset':
              return {
                ...timer,
                status: 'paused',
                remainingTime: timer.duration,
                halfwayTriggered: false
              };
            default:
              return timer;
          }
        }
        return timer;
      })
    );
  };

  const handleBulkAction = (category: string, action: 'start' | 'pause' | 'reset') => {
    setTimers(prevTimers =>
      prevTimers.map(timer => {
        if (timer.category === category) {
          switch (action) {
            case 'start':
              return { ...timer, status: 'running' };
            case 'pause':
              return { ...timer, status: 'paused' };
            case 'reset':
              return {
                ...timer,
                status: 'paused',
                remainingTime: timer.duration,
                halfwayTriggered: false
              };
            default:
              return timer;
          }
        }
        return timer;
      })
    );
  };

  const deleteTimer = (timerId: string) => {
    setTimers(prevTimers => prevTimers.filter(timer => timer.id !== timerId));
  };

  const addNewTimer = (newTimer: Timer) => {
    setTimers(prevTimers => [...prevTimers, newTimer]);

    if (!categories.includes(newTimer.category)) {
      setCategories(prev => [...prev, newTimer.category]);
      setExpandedCategories(prev => ({ ...prev, [newTimer.category]: false }));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="white"
        barStyle={"dark-content"}
        showHideTransition={"fade"}
        hidden={false}
      />
      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTimer', { addNewTimer })}
      >
        <Text style={styles.addButtonText}>+ Add Timer</Text>
      </TouchableOpacity> */}
      {/* <MaterialCommunityIcons name="bell-outline" size={24} color="#5F6368" /> */}

      {/* <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity> */}
      <ScrollView style={styles.content}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => (
            <CategorySection
              category={category}
              isExpanded={expandedCategories[category]}
              onToggle={toggleCategory}
              timers={timers.filter(timer => timer.category === category)}
              onTimerAction={handleTimerAction}
              onBulkAction={handleBulkAction}
              onDelete={deleteTimer}
            />
          )}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={completedModalVisible}
          onRequestClose={() => setCompletedModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Timer Completed!</Text>
              <Text style={styles.modalTimerName}>{completedTimerName}</Text>
              <Button
                title="OK"
                onPress={() => setCompletedModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 16,
  //   backgroundColor: '#f5f5f5',
  // },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1, // Takes up all available space except for the bottom tabs
    padding: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  historyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTimerName: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default TimersScreen;