import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-4">
      <Feather name="alert-circle" size={48} color="#EF4444" />
      <Text className="text-red-500 text-lg font-semibold mt-4 text-center">{message}</Text>
    </View>
  );
};

export default ErrorDisplay;

