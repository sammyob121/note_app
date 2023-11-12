// AddNoteScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Picker } from "@react-native-picker/picker";
import { Note, Client, Category } from "../utils/models";
import data from "../utils/data.json";

const AddNoteScreen = () => {
  const [newNote, setNewNote] = useState<Note>({
    id: "",
    clientId: "",
    categoryId: "",
    text: "",
  });
  const [clients, setClients] = useState<Client[]>(data.clients);
  const [categories, setCategories] = useState<Category[]>(data.categories);

  const handleClientChange = (clientId: string) => {
    setNewNote((prevNote: any) => ({ ...prevNote, clientId }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setNewNote((prevNote) => ({ ...prevNote, categoryId }));
  };

  const handleNoteTextChange = (text: string) => {
    setNewNote((prevNote) => ({ ...prevNote, text }));
  };

  const saveNote = async () => {
    try {
      // Check if client and category are selected
      if (
        !newNote.clientId ||
        !newNote.categoryId ||
        newNote.clientId === "0" ||
        newNote.categoryId === "0"
      ) {
        Alert.alert(
          "Missing Information",
          "Please select a client and a category."
        );
        return;
      }
      if (!newNote.text) {
        Alert.alert("Missing Information", "Please enter a note.");
        return;
      }

      // Generate a unique ID for the new note
      const noteId = `note_${new Date().getTime()}`;
      const noteToSave = { ...newNote, id: noteId };

      // Retrieve the current notes array
      const storedNotes = await AsyncStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Add the new note
      notes.push(noteToSave);

      // Save the updated notes array
      await AsyncStorage.setItem("notes", JSON.stringify(notes));

      // navigation.navigate('NotesList');
      setNewNote({ id: "", clientId: "", categoryId: "", text: "" });
    } catch (e) {
      console.error("Failed to save the note", e);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}>
      <ScrollView style={{ flex: 1 }}>
        <View className='flex-1 p-4 bg-slate-100'>
          <View className='flex justify-between flex-row'>
            {/* Client Picker */}
            <View className='flex-1 mr-2'>
              <Text className='text-lg font-bold mb-2'>Client Name</Text>
              <Picker
                selectedValue={newNote.clientId}
                onValueChange={handleClientChange}
                className='mb-4'>
                {clients.map((client) => (
                  <Picker.Item
                    key={client.id}
                    label={client.name}
                    value={client.id}
                  />
                ))}
              </Picker>
            </View>

            {/* Category Picker */}
            <View style={{ flex: 1 }}>
              <Text className='text-lg font-bold mb-2 text-right'>
                Category
              </Text>
              <Picker
                selectedValue={newNote.categoryId}
                onValueChange={handleCategoryChange}
                className='mb-4'>
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <Text className='text-lg font-bold mb-2 '>Note Text</Text>
          <TextInput
            placeholder='Enter note text'
            value={newNote.text}
            onChangeText={handleNoteTextChange}
            className='border border-gray-300 p-2 rounded h-[30%]'
            multiline={true}
            numberOfLines={4}
          />

          <TouchableOpacity
            onPress={saveNote}
            className='bg-blue-500 p-3 rounded-lg mt-4'>
            <Text className='text-white text-center font-bold'>Save Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNoteScreen;
