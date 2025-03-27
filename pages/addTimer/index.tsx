import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, Timer } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';

type AddTimerScreenRouteProp = RouteProp<RootStackParamList, 'AddTimer'>;
type AddTimerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTimer'>;

const AddTimerScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('General');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  
  const route = useRoute<AddTimerScreenRouteProp>();
  const navigation = useNavigation<AddTimerScreenNavigationProp>();
  const { addNewTimer } = route.params;

  const handleSave = () => {
    if (!name || !duration) {
      // alert('Please fill in all fields');
      return;
    }

    const durationInSeconds = parseInt(duration, 10);
    if (isNaN(durationInSeconds)) {
      // alert('Please enter a valid number for duration');
      return;
    }

    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      duration: durationInSeconds,
      remainingTime: durationInSeconds,
      category: category || 'General',
      status: 'paused',
      halfwayAlert,
      halfwayTriggered: false,
    };

    addNewTimer(newTimer);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., Workout Timer"
      />
      
      <Text style={styles.label}>Duration (seconds)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g., 300 (for 5 minutes)"
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="e.g., Workout, Study, Break"
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Set halfway alert?</Text>
        <TouchableOpacity
          style={[styles.switch, halfwayAlert ? styles.switchOn : styles.switchOff]}
          onPress={() => setHalfwayAlert(!halfwayAlert)}
        >
          <Text style={styles.switchText}>{halfwayAlert ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switch: {
    width: 60,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchOn: {
    backgroundColor: '#4CAF50',
  },
  switchOff: {
    backgroundColor: '#ccc',
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#EB5B00',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddTimerScreen;