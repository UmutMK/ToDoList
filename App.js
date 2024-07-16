import {
  Button, StyleSheet, Text, View, TextInput, Image, TouchableOpacity,
  SafeAreaView, FlatList
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from './src/screens/TabBarIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [visible, setVisible] = useState(1);
  const [isPressAdd, setIsPressAdd] = useState(false);
  const [isPressDelete, setIsPressDelete] = useState(false);
  const [isPress, setIsPress] = useState(false);

  // Retrieve tasks from AsyncStorage when the app starts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const storedDoneTasks = await AsyncStorage.getItem('doneTasks');
        if (storedTasks !== null) setTasks(JSON.parse(storedTasks));
        if (storedDoneTasks !== null) setDoneTasks(JSON.parse(storedDoneTasks));
      } catch (error) {
        console.error('Failed to load tasks.', error);
      }
    };

    loadTasks();
  }, []);

  const saveTasks = async (tasks, doneTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      await AsyncStorage.setItem('doneTasks', JSON.stringify(doneTasks));
    } catch (error) {
      console.error('Failed to save tasks.', error);
    }
  };

  const toggleViewDo = () => {
    setVisible(1);
  };

  const toggleViewDone = () => {
    setVisible(0);
  };

  const handleAddTaskPressAdd = () => {
    let add = [...tasks, text];
    setTasks(add);
    saveTasks(add, doneTasks);
    setIsPressAdd(!isPressAdd);
  };

  const handleAddTaskPresscheck = (index) => {
    setIsPress(!isPress);
    setTimeout(() => {
      const newTasks = [...tasks];
      const newDoneTasks = [...doneTasks, newTasks.splice(index, 1)[0]];
      setTasks(newTasks);
      setDoneTasks(newDoneTasks);
      saveTasks(newTasks, newDoneTasks);
    }, 200);
  };

  const handleAddTaskPressDelete = (index) => {
    setIsPressDelete(!isPressDelete);
    setTimeout(() => {
      const deleteDoneTasks = [...doneTasks];
      deleteDoneTasks.splice(index, 1);
      setDoneTasks(deleteDoneTasks);
      saveTasks(tasks, deleteDoneTasks);
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./assets/icon/headerIcon1.png')}
          style={styles.hIcon}
        />
        <Text style={styles.headerText}> ToDoList </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonTasks}
          onPress={toggleViewDo}>
          <Text style={styles.buttonText}>Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDoneTasks}
          onPress={toggleViewDone}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.inputContainer, { display: visible ? 'flex' : 'none' }]}>
        <TextInput
          style={styles.input}
          placeholder='Things to Do ... '
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          onPress={handleAddTaskPressAdd}
          onPressIn={() => setIsPressAdd(true)}
          onPressOut={() => setIsPressAdd(false)}
          activeOpacity={1.2}
        >
          <View style={[styles.buttonAdd, { backgroundColor: isPressAdd ? 'yellow' : 'green' }]}>
            <Text style={styles.buttonText}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>

      {visible == 0 && (
        <View style={styles.flatView}>
          <FlatList
            data={doneTasks}
            renderItem={({ item, index }) => (
              <View style={styles.tasksContainer}>
                <Text style={styles.flatText1}>{item}</Text>
                <TouchableOpacity
                  style={styles.buttonFlat1}
                  onPress={() => handleAddTaskPressDelete(index)}
                  onPressOut={() => setIsPressDelete(false)}
                  activeOpacity={1.2}>
                  <Image
                    source={require('./assets/icon/deleteIcon.png')}
                    resizeMode='center'
                    style={[styles.deleteIcon, { backgroundColor: isPressDelete ? 'green' : 'red' }]}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
          />
        </View>
      )}

      {visible == 1 && (
        <View style={styles.flatView}>
          <FlatList
            data={tasks}
            renderItem={({ item, index }) => (
              <View style={styles.tasksContainer}>
                <Text style={styles.flatText1}>{item}</Text>
                <TouchableOpacity
                  style={styles.buttonFlat1}
                  onPress={() => handleAddTaskPresscheck(index)}
                  onPressOut={() => setIsPress(false)}
                  activeOpacity={1.2}>
                  <Image
                    source={require('./assets/icon/doneIcon.png')}
                    resizeMode='center'
                    style={[styles.doneIcon, { backgroundColor: isPress ? 'green' : 'yellow' }]}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
          />
        </View>
      )}

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelPosition: 'below-icon',
            tabBarShowLabel: false,
            tabBarActiveTintColor: 'black',
            tabBarInactiveBackgroundColor: 'blue',
            tabBarStyle: { position: 'absolute', height: 65, backgroundColor: 'azure' },
          }}>
          <Tab.Screen
            name='Icon'
            component={TabBarIcon}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <View>
                  <Image
                    source={require('./assets/icon/tabBarSearchIcon.png')}
                    resizeMode='contain'
                    style={styles.tIcon}
                  />
                </View>
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'turquoise',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    padding: 25,
    flexDirection: 'row',
    backgroundColor: 'azure',
  },
  hIcon: {
    width: 25,
    height: 25,
    left: 325,
    resizeMode: 'contain'
  },
  tIcon: {
    width: 25,
    height: 25,
  },
  headerText: {
    color: 'blue',
    fontSize: 22,
    textAlign: 'center',
    left: 100
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    paddingVertical: 30,
  },
  input: {
    flex: 1,
    backgroundColor: 'azure',
    borderWidth: 3,
    borderColor: 'black',
    padding: 18,
    marginRight: 10,
  },
  buttonAdd: {
    padding: 20,
    borderRadius: 100,
    margin: 10,
  },
  buttonTasks: {
    flex: 0.5,
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonDoneTasks: {
    flex: 0.5,
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center'
  },
  flatText1: {
    fontSize: 24,
    backgroundColor: 'bisque',
    marginVertical: 5,
  },
  flatView: {
    flex: 1,
    marginVertical: 16,
  },
  tasksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingVertical: 10,
  },
  flatText1: {
    fontSize: 20,
  },
  buttonFlat1: {
    padding: 10,
    borderRadius: 100,
  },
  textGo: {
    fontSize: 15,
    color: 'white',
  },
  doneIcon: {
    borderRadius: 30,
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  deleteIcon: {
    borderRadius: 30,
    width: 30,
    height: 30,
    resizeMode: 'cover'
  },
});
