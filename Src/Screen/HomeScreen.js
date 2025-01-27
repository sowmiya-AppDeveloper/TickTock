import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useReducer, useState} from 'react';
import {
  Alert,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../Common/Colors';
import TimerComponent from './TimerList';

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TIMER':
      if (Array.isArray(action.payload)) {
        return [...state, ...action.payload];
      }
      return [...state, action.payload];

    case 'UPDATE_TIMER':
      return state.map(timer =>
        timer.id === action.payload.id
          ? {...timer, remaining: action.payload.remaining}
          : timer,
      );

    case 'REMOVE_TIMER':
      return state.filter(timer => timer.id !== action.payload);

    default:
      return state;
  }
};

const HomeScreen = ({navigation}) => {
  const [timers, dispatch] = useReducer(timerReducer, []);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTimer, setNewTimer] = useState({
    name: '',
    duration: '',
    category: '',
  });
  const [history, setHistory] = useState([]);
  const [completedTimer, setCompletedTimer] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const categoryOptions = ['Workout', 'Study', 'Break'];

  useEffect(() => {
    const loadTimersAndHistory = async () => {
      try {
        const timersData = await AsyncStorage.getItem('timers');
        const historyData = await AsyncStorage.getItem('history');

        if (timersData) {
          const parsedTimers = JSON.parse(timersData);
          if (Array.isArray(parsedTimers)) {
            dispatch({type: 'ADD_TIMER', payload: parsedTimers});
          }
        }

        if (historyData) {
          const parsedHistory = JSON.parse(historyData);
          if (Array.isArray(parsedHistory)) {
            setHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.error('Error loading timers or history:', error);
      }
    };

    loadTimersAndHistory();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    if (history.length > 0) {
      AsyncStorage.setItem('history', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    const groupedCategories = timers.reduce((acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    }, {});
    setCategories(
      Object.keys(groupedCategories).map(category => ({
        title: category,
        data: groupedCategories[category],
      })),
    );
  }, [timers]);

  const addTimer = () => {
    const {name, duration, category} = newTimer;
    if (!name || !duration || !category) {
      Alert.alert('Please fill all fields');
      return;
    }

    const newTimerItem = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration),
      category,
      remaining: parseInt(duration),
      status: 'Paused',
    };

    dispatch({type: 'ADD_TIMER', payload: newTimerItem});

    setNewTimer({name: '', duration: '', category: ''});
    setModalVisible(false);
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectCategory = category => {
    setNewTimer({...newTimer, category: category});
    setDropdownVisible(false);
  };

  const handleTimerComplete = completedTimer => {
    const completedTimerData = {
      name: completedTimer.name,
      completionTime: new Date().toLocaleString(),
    };

    setCompletedTimer(completedTimerData);
    setModalVisible(true);

    setHistory(prevHistory => [...prevHistory, completedTimerData]);
    dispatch({type: 'REMOVE_TIMER', payload: completedTimer.id});
  };

  const closeCompletionModal = () => {
    setModalVisible(false);
    setCompletedTimer(null);
  };

  const navigateHistory = () => {
    navigation.navigate('history', {updatedHistory: [...history]});
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContTop}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.buttonCon}>
          <Ionicons name={'timer'} color={colors.black} size={25} />
          <Text style={styles.button}>ADD TIMER</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateHistory} style={styles.buttonConIco}>
          <FontAwesome name={'history'} color={colors.black} size={25} />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={categories}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TimerComponent
            timer={item}
            onComplete={() => handleTimerComplete(item)}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View
            style={{
              padding: 10,
              marginTop: 40,
            }}>
            <Text>
              No timers available. Click the addTimer button to add a new timer.
            </Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Timer</Text>
            <TextInput
              placeholder="Timer Name"
              placeholderTextColor={colors.darkGrey}
              value={newTimer.name}
              onChangeText={text => setNewTimer({...newTimer, name: text})}
              style={styles.input}
            />
            <TextInput
              placeholder="Duration (seconds)"
              placeholderTextColor={colors.darkGrey}
              value={newTimer.duration}
              onChangeText={text => setNewTimer({...newTimer, duration: text})}
              style={styles.input}
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
              <Text style={styles.dropdownText}>
                {newTimer.category || 'Select Category'}
              </Text>
            </TouchableOpacity>
            {dropdownVisible && (
              <View style={styles.dropdownList}>
                {categoryOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => selectCategory(option)}
                    style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonCon}>
                <Text onPress={addTimer} style={styles.button}>
                  Add Timer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCon}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.button}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={completedTimer !== null} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              Congratulations! Timer "{completedTimer?.name}" Completed!
            </Text>
            <Text style={styles.subText}>
              Completion Time: {completedTimer?.completionTime}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonCon}
                onPress={navigateHistory}>
                <Text style={styles.button}>View History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCon}
                onPress={closeCompletionModal}>
                <Text style={styles.button}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subText: {
    fontSize: 14,
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCon: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    color: colors.black,
    fontSize: 14,
    marginStart: 5,
    fontWeight: 'bold',
  },
  buttonConIco: {
    padding: 5,
  },
  dropdown: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 3,
    marginTop: -5,
    width: '100%',
  },
  dropdownItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});
export default HomeScreen;
