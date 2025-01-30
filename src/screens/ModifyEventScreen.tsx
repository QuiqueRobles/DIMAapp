import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const ModifyEvent = () => {
    return (
        <SafeAreaView style={styles.container}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
              >
                <Text>Event Modify</Text>

              </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1F2937',
    },
    scrollContent: {
        flexGrow: 1,
    },
  });

export default ModifyEvent;