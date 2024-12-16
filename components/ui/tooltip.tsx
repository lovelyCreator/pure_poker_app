import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface TooltipProps {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ children, tooltipContent, visible, onClose }) => {
  return (
    <>
      <TouchableOpacity onPress={onClose}>
        {children}
      </TouchableOpacity>
      {visible && (
        <Modal transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{tooltipContent}</Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  tooltip: {
    zIndex: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Border color
    backgroundColor: '#fff', // Background color
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  tooltipText: {
    fontSize: 12, // Tooltip text size
    color: '#000', // Tooltip text color
  },
});

export {Tooltip};
