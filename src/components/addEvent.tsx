import { useState,useRef  } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image,Alert,Button } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import { useClub } from "../../src/context/EventContext"
import { supabase } from "@/lib/supabase"
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";





type Props = {
  visible: boolean
  onClose: () => void
}

export default function AddEventModal({ visible, onClose }: Props) {
  const [name, setName] = useState("")
  const [date, setDate] = useState(new Date())
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [open, setOpen] = useState(false);


  const { addEvent,events,clubId } = useClub()
  const newUUID = uuidv4();
  const now = new Date();

  // "2025-01-30"
  const timestampString = now.toISOString();           // "2025-01-30T17:21:21.000Z"


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
          .from('clubs-image')
          .upload(filePath, formData);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-image')
          .getPublicUrl(filePath);

         setImage(publicUrl)
        Alert.alert('Success', 'Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      } finally {
        
      }
    }
  };
  const dateString =date.toISOString().split("T")[0];
  const newevent={    
    club_id:clubId,
    name,
    date:dateString,
    created_at:timestampString,
    price: Number.parseFloat(price),
    description,
    image,
    id:newUUID,}


  const handleSubmit = () => {

    addEvent(newevent)
    console.log("EVENTS",events)
     saveChanges()
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDate(new Date())
    setPrice("")
    setDescription("")
    setImage(null)
  }
   const saveChanges = async () => {
           try {
            if (!clubId) {
              throw new Error("Invalid UUID: club_id is empty or undefined");
            }
            else{ const now = new Date();
              const dateString = now.toISOString().split("T")[0];  // "2025-01-30"
              const timestampString = now.toISOString(); 
             const { data, error:eventError} = await supabase
               .from('event')
               .insert(newevent) 
               console.log(eventError)
            }
           
                 Alert.alert('Success', 'Club details updated successfully.');
               } catch (error) {
                 Alert.alert('Error', 'Failed to update club details.');
                 console.error(error);
               }
               
             };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Event</Text>

      <View>
      <Button color={'#5500FF'}
      title="Select Date" onPress={() => setOpen(true)} />
        {open && (
      <DateTimePicker
            value={date}
         
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              setDate(selectedDate)
              setOpen(false)
            }}
            themeVariant="dark"
          /> )}
    </View>

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

          <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
            <Text style={styles.imageButtonText}>{image ? "Change Image" : "Add Image"}</Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.previewImage} />}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add Event</Text>
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

