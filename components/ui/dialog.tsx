import React, { useContext, useState, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle, TextStyle } from 'react-native';

// Define the context types
interface DialogContextType {
  isVisible: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  backgroundBlur: boolean;
  showX: boolean;
}

// Create the DialogContext
const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

// Provider component
const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [backgroundBlur, setBackgroundBlur] = useState(true);
  const [showX, setShowX] = useState(true);

  const openDialog = () => setIsVisible(true);
  const closeDialog = () => setIsVisible(false);

  return (
    <DialogContext.Provider value={{ isVisible, openDialog, closeDialog, backgroundBlur, showX }}>
      {children}
      <Dialog />
    </DialogContext.Provider>
  );
};

// Dialog component
const Dialog: React.FC = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('Dialog must be used within a DialogProvider');

  const { isVisible, closeDialog, backgroundBlur, showX } = context;

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={closeDialog}
    >
      <View style={[styles.overlay, backgroundBlur && styles.blur]}>
        <DialogContent closeDialog={closeDialog} showX={showX} />
      </View>
    </Modal>
  );
};

// DialogContent component
const DialogContent: React.FC<{ closeDialog: () => void; showX: boolean }> = ({ closeDialog, showX }) => (
  <View style={styles.content}>
    {showX && (
      <DialogClose closeDialog={closeDialog} />
    )}
    <DialogTitle>Dialog Title</DialogTitle>
    <DialogDescription>This is a dialog description.</DialogDescription>
    {/* Add your dialog content here */}
  </View>
);

// DialogClose component
const DialogClose: React.FC<{ closeDialog: () => void }> = ({ closeDialog }) => (
  <TouchableOpacity style={styles.closeButton} onPress={closeDialog}>
    <Image source={require('@/assets/global/cross.png')} style={styles.icon} />
  </TouchableOpacity>
);

// DialogTrigger component
const DialogTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within a DialogProvider');

  const { openDialog } = context;

  return (
    <TouchableOpacity onPress={openDialog}>
      {children}
    </TouchableOpacity>
  );
};

// DialogHeader component
const DialogHeader: React.FC<{ children: ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

// DialogPortal component
const DialogPortal: React.FC = () => {
  return (
    <Dialog />
  );
};

// DialogFooter component
const DialogFooter: React.FC<{ children: ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

// DialogTitle component
const DialogTitle: React.FC<{ children: ReactNode; style?: TextStyle }> = ({ children, style }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

// DialogDescription component
const DialogDescription: React.FC<{ children: ReactNode; style?: TextStyle }> = ({ children, style }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  blur: {
    // You can add blur effect if needed using libraries like react-native-blur
  },
  content: {
    width: '80%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  header: {
    // Add styles for header if needed
  },
  footer: {
    // Add styles for footer if needed
  },
});

// Exports
export {
  Dialog,
  DialogProvider,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContext,
  DialogTrigger,
  DialogPortal
};
