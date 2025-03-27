import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Timer } from '../types';

interface TimerItemProps {
  timer: Timer;
  onAction: (timerId: string, action: 'start' | 'pause' | 'reset') => void;
  onDelete: (timerId: string) => void;
}

const TimerItem: React.FC<TimerItemProps> = ({ timer, onAction, onDelete }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = (timer.remainingTime / timer.duration) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{timer.name}</Text>
        <Text style={styles.time}>{formatTime(timer.remainingTime)}</Text>
        <Text style={[styles.status, 
          timer.status === 'running' ? styles.running : 
          timer.status === 'paused' ? styles.paused : 
          styles.completed]}>
          {timer.status.toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.startButton]} 
          onPress={() => onAction(timer.id, 'start')}
          disabled={timer.status === 'running' || timer.status === 'completed'}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.pauseButton]} 
          onPress={() => onAction(timer.id, 'pause')}
          disabled={timer.status !== 'running'}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={() => onAction(timer.id, 'reset')}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={() => onDelete(timer.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 2,
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    padding: 4,
    borderRadius: 4,
    overflow: 'hidden',
    color: 'white',
    // fontWeight: '500',
    // fontSize: 14,
  },
  running: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  paused: {
    backgroundColor: '#FFC107',
    color: 'black',
  },
  completed: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 70,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  resetButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
});

export default TimerItem;