import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Modal, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker"
import { supabase } from '@/lib/supabase';

type Props = {
  visible: boolean
  onClose: () => void
  eventId : string
  clubId : string
  eventName : string
  eventDate : Date
  eventPrice : number
  eventDescription : string 
  eventImage : string 
}


function ModifyEventModal({ visible, onClose, eventId, clubId, eventName, eventDate, eventPrice, eventDescription, eventImage }: Props) {
  const [name, setName] = useState(eventName)
  const [date, setDate] = useState(eventDate)
  const [price, setPrice] = useState(eventPrice.toString())
  const [description, setDescription] = useState(eventDescription)
  const [image, setImage] = useState(eventImage)

  const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
  
      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    }

  const handleSubmit = async () => {
    try{
      const {error: updateError} = await supabase.from('event').update({
        name,
        date,
        price: parseInt(price) * 100,
        description,
        image,
      }).eq('event_id', eventId)

      if(updateError) throw new Error('Failed to update event')
    
    }catch (error) {
      console.error(error)
    }finally {
      alert("Event updated successfully")
      onClose()
    }

  }



  return (
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
              value={description}
              onChangeText={setDescription}
              multiline
            />
  
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
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
    color: "#8B5CF6",
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
    backgroundColor: "#8B5CF6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default ModifyEventModal;