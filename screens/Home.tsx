import React, { useState, useEffect } from "react";
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from "@react-navigation/native";

import data from "../utils/data.json";
import { View, Text, FlatList, Button } from "react-native";
import { Note, Client, Category } from "../utils/models";

import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigation: NavigationProp<
    Record<string, object | undefined>,
    string
  > = useNavigation();

  const getNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      return storedNotes != null ? JSON.parse(storedNotes) : [];
    } catch (e) {
      console.error("Failed to fetch notes", e);
      return []; // Return an empty array in case of an error
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Function to load notes
      const loadNotes = async () => {
        const loadedNotes = await getNotes();
        setNotes(loadedNotes);
      };

      loadNotes();
      setClients(data.clients);
      setCategories(data.categories);
    }, [])
  );

  const clearAllNotes = async () => {
    try {
      await AsyncStorage.removeItem("notes");

      setNotes([]);
    } catch (e) {
      console.error("Failed to clear notes", e);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      // Retrieve the current notes array from AsyncStorage
      const storedNotes = await AsyncStorage.getItem("notes");
      let notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Filter out the note to be deleted
      notes = notes.filter((n: { id: string }) => n.id !== noteId);

      // Save the updated notes array back to AsyncStorage
      await AsyncStorage.setItem("notes", JSON.stringify(notes));

      // Update local state to reflect the deletion
      setNotes(notes);
    } catch (e) {
      console.error("Error deleting the note", e);
    }
  };

  const renderNote = ({ item }: { item: Note }) => {
    // Find the client and category names using their IDs
    const clientName =
      clients.find((client) => client.id === item.clientId)?.name ||
      "Unknown Client";
    const categoryName =
      categories.find((category) => category.id === item.categoryId)?.name ||
      "Unknown Category";

    return (
      <View className='p-4 border-b border-gray-200  bg-white'>
        <Text className='text-lg font-bold'>{item.text}</Text>
        <Text>
          {clientName} - {categoryName}
        </Text>
        <View className='flex flex-row justify-end space-x-3'>
          <TouchableOpacity
            onPress={() => navigation.navigate("Edit Note", { note: item })}
            className='bg-blue-500 p-2 rounded-lg mt-2'>
            <Text className='text-white text-center'>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteNote(item.id)}
            className='bg-red-500 p-2 rounded-lg mt-2'>
            <Text className='text-white text-center'>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className='flex-1 p-4 bg-slate-200 w-full'>
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View className='flex justify-center items-center  h-1/2'>
          <Text className='text-gray-700 text-center '>No notes available</Text>
        </View>
      )}

      <View className='flex-row justify-around mt-10 mb-[100px]'>
        <TouchableOpacity
          className='bg-blue-500 px-4 py-2 rounded-lg'
          onPress={() => navigation.navigate("Add Note")}>
          <Text className='text-white text-center font-bold'>Add Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-red-500 px-4 py-2 rounded-lg'
          onPress={() => clearAllNotes()}>
          <Text className='text-white text-center font-bold'>
            Clear All Notes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
