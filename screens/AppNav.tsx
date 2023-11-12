// AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Home";
import AddNoteScreen from "./AddNotes";
import EditNoteScreen from "./EditNoteScreen";
import { Note } from "../utils/models";

export type MyStackParamList = {
  Home: undefined; // Assuming Home doesn't require parameters
  "Add Note": undefined; // Assuming Add Note doesn't require parameters
  "Edit Note": { note: Note }; // Define types for other routes similarly
};

const Stack = createNativeStackNavigator<MyStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Add Note' component={AddNoteScreen} />
        <Stack.Screen name='Edit Note' component={EditNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
