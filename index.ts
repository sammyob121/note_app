import AsyncStorage from '@react-native-async-storage/async-storage';
import data
 from '../utils/data.json'

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



export const loadDataIntoStorage = async () => {
  try {
    // Assuming data.json has two top-level keys: 'clients' and 'categories'
    const clients = JSON.stringify(data.clients);
    const categories = JSON.stringify(data.categories);



   const res  = await AsyncStorage.multiSet([['clients', clients], ['categories', categories]]);
   console.log('=========loadDataIntoStorage===========================');
   console.log(res);

   console.log('===========loadDataIntoStorage=========================');

  } catch (error) {
    console.error("Error loading data into storage", error);
    console.log('=========error===========================');
    console.log(error);

    console.log('===========error=========================');
  }
};
