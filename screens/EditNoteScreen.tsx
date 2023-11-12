import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Category, Client, Note } from "../utils/models";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import data from "../utils/data.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyStackParamList } from "./AppNav";

type EditNoteScreenRouteProp = RouteProp<MyStackParamList, "Edit Note">;
type EditNoteScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  "Edit Note"
>;

type EditNoteScreenProps = {
  route: EditNoteScreenRouteProp;
  navigation: EditNoteScreenNavigationProp;
};

const EditNoteScreen: React.FC<EditNoteScreenProps> = ({
  route,
  navigation,
}) => {
  const { note } = route.params;
  const [editedNote, setEditedNote] = useState(note);
  const [clients, setClients] = useState<Client[]>(data.clients);
  const [categories, setCategories] = useState<Category[]>(data.categories);

  const handleClientChange = (clientId: string) => {
    setEditedNote((prevNote) => ({ ...prevNote, clientId }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setEditedNote((prevNote) => ({ ...prevNote, categoryId }));
  };

  const handleNoteTextChange = (text: string) => {
    setEditedNote((prevNote) => ({ ...prevNote, text }));
  };

  const saveEditedNote = async () => {
    try {
      // Retrieve the current notes array from AsyncStorage
      const storedNotes = await AsyncStorage.getItem("notes");
      let notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Find the index of the note being edited
      const noteIndex = notes.findIndex(
        (n: { id: string }) => n.id === editedNote.id
      );
      if (noteIndex !== -1) {
        // Update the note in the array
        notes[noteIndex] = editedNote;

        // Save the updated notes array back to AsyncStorage
        await AsyncStorage.setItem("notes", JSON.stringify(notes));

        // Navigate back to the Home screen or show a success message
        navigation.goBack();
      } else {
        // Handle the case where the note was not found
        console.error("Note not found");
      }
    } catch (e) {
      console.error("Failed to save the edited note", e);
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
                selectedValue={editedNote.clientId}
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
                selectedValue={editedNote.categoryId}
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
            value={editedNote.text}
            onChangeText={handleNoteTextChange}
            className='border border-gray-300 p-2 rounded h-[30%]'
            multiline={true}
            numberOfLines={4}
          />

          <TouchableOpacity
            onPress={saveEditedNote}
            className='bg-blue-500 p-3 rounded-lg mt-4'>
            <Text className='text-white text-center font-bold'>Save Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditNoteScreen;
