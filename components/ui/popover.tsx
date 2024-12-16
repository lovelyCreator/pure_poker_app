import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface PopoverProps {
  children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const togglePopover = () => setVisible((prev) => !prev);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePopover}>
        <Text>Toggle Popover</Text>
      </TouchableOpacity>
      {visible && (
        <PopoverContent onClose={togglePopover}>
          {children}
        </PopoverContent>
      )}
    </View>
  );
};

interface PopoverContentProps {
  children: React.ReactNode;
  onClose: () => void;
}

const PopoverContent: React.FC<PopoverContentProps> = ({ children, onClose }) => {
  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.popoverContainer}>
          <TouchableOpacity style={styles.closeArea} onPress={onClose} />
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  popoverContainer: {
    width: 280, // Width of the popover
    borderRadius: 8,
    backgroundColor: '#fff', // Background color of the popover
    padding: 16,
    elevation: 4, // Shadow effect
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    zIndex: 1,
  },
});

export { Popover, PopoverContent };
