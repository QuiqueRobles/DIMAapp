import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingSpinner: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <ActivityIndicator size="large" color="#A78BFA" testID="loading-spinner"/>
    </View>
  );
};

export default LoadingSpinner;

