import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Modal, TextInput, TouchableOpacity ,Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker"
import { supabase } from '@/lib/supabase';
import { useClub } from "../../src/context/EventContext"
import { KeyboardAvoidingView,Platform } from "react-native";

type Props = {
  visible: boolean
  onClose: () => void
  eventId : string | null
  clubId : string | null
  eventName : string
  eventDate : string
  eventPrice : number
  eventDescription : string | null
  eventImage : string | null
}


function ModifyEventModal({ visible, onClose, eventId, clubId, eventName, eventDate, eventPrice, eventDescription, eventImage }: Props) {
  const [name, setName] = useState(eventName)
  const [date, setDate] = useState(eventDate)
  const [price, setPrice] = useState(eventPrice.toString())
  const [description, setDescription] = useState(eventDescription)
  const [image, setImage] = useState(eventImage)
  const { setEvents,events,setRefresh,refresh } = useClub()

  const handleImageUpload = async () => {
      //const clubId=await getAuthenticatedUserId();
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload an image.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (!result.canceled && result.assets[0].uri) {
        try {
      
          const ext = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf(".") + 1);
          const fileName = `${clubId}-${Date.now()}.${ext}`;
          const filePath = `${fileName}`;
  
          const formData = new FormData();
          formData.append('file', {
            uri: result.assets[0].uri,
            name: fileName,
            type: `image/${ext}`
          } as any);
  
          const { error: uploadError } = await supabase.storage
            .from('event_image')
            .upload(filePath, formData);
  
          if (uploadError) throw uploadError;
  
          const { data: { publicUrl } } = supabase.storage
            .from('event_image')
            .getPublicUrl(filePath);
  
           setImage(publicUrl)
          Alert.alert('Success', 'Event picture updated successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
          
        }
      }
    };

  // const pickImage = async () => {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     })
  
  //     if (!result.canceled) {
  //       setImage(result.assets[0].uri)
  //     }
  //   }

  const handleSubmit = async () => {
    try{
      const {data:updateData,error: updateError} = await supabase.from('event').update({
        name,
        date,
        price: parseInt(price),
        description,
        image,
      }).eq('id', eventId)
   

      const updatedEvents = events.map(event =>
        event.id === eventId
          ? { ...event,data:updateData } // Modify only the event with id '123'
          : event
      );
      setEvents(updatedEvents)

      if(updateError) throw new Error('Failed to update event')
    
    }catch (error) {
      console.error(error)
    }finally {
      alert("Event updated successfully")
     
      onClose()
    }

  }



  return (
     <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              
            >
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Modify Event</Text>
  
            
           
  
            <TextInput
              style={styles.input}
              placeholder="Event Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
  
  
            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor="#666"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
  
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#666"
              value={description || ""}
              onChangeText={setDescription}
              multiline
            />
  
            <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload } testID="image-button">
              <Text style={styles.imageButtonText}>{image ? "Change Image" : "Add Image"}</Text>
            </TouchableOpacity>
  
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
  
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#2A2A2A",
  },
  submitButton: {
    backgroundColor: "#5500FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default ModifyEventModal;