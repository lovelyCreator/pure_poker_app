import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Linking } from 'react-native';
import { MessageCircle } from 'lucide-react-native'; // Make sure to install lucide-react-native

export default function FeedbackButton() {
  const alwaysWide = false;
  const [isHovered, setIsHovered] = useState(false);
  const [isDelayedHovered, setIsDelayedHovered] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => setIsDelayedHovered(true), 150);
    } else {
      setIsDelayedHovered(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  if (!isPageLoaded) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            'https://docs.google.com/forms/d/e/1FAIpQLSdD1ZLs-wfFJltmqDuXm1dBCUEfjlrZjEbBbSl58rCtn0Yhzw/viewform'
          )
        }
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        style={[
          styles.button,
          { width: alwaysWide || isHovered ? 160 : 48 }, // Adjust width based on hover state
        ]}
      >
        {alwaysWide || isDelayedHovered ? (
          <Text style={styles.text}>We Value Your Feedback</Text>
        ) : (
            <MessageCircle size={32} fill="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100, // Ensure it stays on top
  },
  button: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#45A1FF',
    backgroundColor: '#2085F0',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  icon: {
    color: '#FFF'
  }
});
