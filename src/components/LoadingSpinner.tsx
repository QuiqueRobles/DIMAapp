import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingSpinner: React.FC = () => {
  return (
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>



      <ActivityIndicator size="large" color="#A78BFA" testID="loading-spinner"/>
    </View>
  );
};

export default LoadingSpinner;

