import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ToastOptions = {
  title: string;
  description?: string;
  onDismiss?: () => void;
};

interface ToasterProps {
  toastOptions: ToastOptions;
}

const Toaster: React.FC<ToasterProps> = ({ toastOptions }) => {
  const { title, description, onDismiss } = toastOptions;

  return (
    <View style={styles.toasterContainer}>
      <View style={styles.toast}>
        <Text style={styles.toastTitle}>{title}</Text>
        {description && <Text style={styles.toastDescription}>{description}</Text>}
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Text style={styles.dismissButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toasterContainer: {
    position: 'absolute',
    top: 50, // Adjust based on your layout
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: '#fff', // Background color
    padding: 16,
    borderRadius: 8,
    borderColor: '#ccc', // Border color
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    width: '90%', // Adjust width as needed
  },
  toastTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  toastDescription: {
    marginTop: 4,
    color: '#666', // Muted text color
  },
  dismissButton: {
    marginTop: 10,
    backgroundColor: '#38D24A', // Primary button color
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#fff', // Button text color
  },
});

export {Toaster};
