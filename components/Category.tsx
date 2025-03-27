import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TimerItem from './TimerItem';
import { Timer } from '../types';

interface CategorySectionProps {
  category: string;
  isExpanded: boolean;
  onToggle: (category: string) => void;
  timers: Timer[];
  onTimerAction: (timerId: string, action: 'start' | 'pause' | 'reset') => void;
  onBulkAction: (category: string, action: 'start' | 'pause' | 'reset') => void;
  onDelete: (timerId: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  isExpanded, 
  onToggle, 
  timers, 
  onTimerAction, 
  onBulkAction,
  onDelete 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => onToggle(category)}
        activeOpacity={0.8}
      >
        <Text style={styles.categoryName}>{category}</Text>
        <Text style={styles.toggleIcon}>{isExpanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          {timers.length === 0 ? (
            <Text style={styles.emptyText}>No timers in this category</Text>
          ) : (
            <>
              <View style={styles.bulkActions}>
                <TouchableOpacity 
                  style={[styles.bulkButton, styles.startAllButton]}
                  onPress={() => onBulkAction(category, 'start')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.bulkButtonText}>Start All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.bulkButton, styles.pauseAllButton]}
                  onPress={() => onBulkAction(category, 'pause')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.bulkButtonText}>Pause All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.bulkButton, styles.resetAllButton]}
                  onPress={() => onBulkAction(category, 'reset')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.bulkButtonText}>Reset All</Text>
                </TouchableOpacity>
              </View>
              
              {timers.map(timer => (
                <TimerItem
                  key={timer.id}
                  timer={timer}
                  onAction={onTimerAction}
                  onDelete={onDelete}
                />
              ))}
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EB5B00',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  toggleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 12,
  },
  emptyText: {
    textAlign: 'center',
    padding: 12,
    color: '#666666',
    fontSize: 14,
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  bulkButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  startAllButton: {
    backgroundColor: '#4CAF50', // Green - keep for positive action
  },
  pauseAllButton: {
    backgroundColor: '#FF9800', // Orange - similar to primary
  },
  resetAllButton: {
    backgroundColor: '#EB5B00', // Your primary color
  },
});

export default CategorySection;