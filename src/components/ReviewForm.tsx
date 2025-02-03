import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Feather } from "@expo/vector-icons";


interface ReviewFormProps {
    clubName: string;
    rating: number;
    rewiewtext: string;
    setRating: (rating: number) => void;
    setReview: (review: string) => void;
    onReviewSubmit: () => void;
    onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ clubName,onReviewSubmit, onClose, rating, rewiewtext, setRating,setReview}) => {

  const handleStarPress = (star: number) => {
    setRating(star);
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Write a Review for {clubName}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Feather
                  name="star"
                  size={30}
                  color={star <= rating ? '#FFD700' : '#CCCCCC'}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.reviewTextInput}
            placeholder="Review"
            value={rewiewtext}
            onChangeText={setReview}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={onReviewSubmit} testID="submit-review-button">
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} testID="close-review-button">
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#121212',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxHeight: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    star: {
        marginHorizontal: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        textAlign: 'left',
    },
    reviewTextInput: {
        backgroundColor: '#222222',
        height: 120,
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        color:'#FFFFFF',
        
    },
    button: {
        backgroundColor: '#5500FF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
});

export default ReviewForm;