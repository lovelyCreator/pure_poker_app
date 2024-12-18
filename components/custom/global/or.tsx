import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Or() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Adjust as needed
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF80', // Adjust color as needed
    marginHorizontal: 10, // Space between the lines and text
  },
  text: {
    fontSize: 20, // Adjust font size as needed
    fontWeight: 'bold',
    color: 'white', // Adjust text color as needed
  },
});
