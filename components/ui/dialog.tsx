import React, { useContext, useState, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle, TextStyle, TouchableWithoutFeedback } from 'react-native';

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
const Dialog: React.FC<{ children: ReactNode, content: React.ReactNode }> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [backgroundBlur, setBackgroundBlur] = useState(true);
  const [showX, setShowX] = useState(true);

  const openDialog = () => setIsVisible(true);
  const closeDialog = () => setIsVisible(false);

  return (
    <DialogContext.Provider value={{ isVisible, openDialog, closeDialog, backgroundBlur, showX }}>
      
      {children}
       <Modal
        transparent={true}
        animationType="fade"
        visible={isVisible}
        onRequestClose={closeDialog}
      >
        <TouchableWithoutFeedback onPress={closeDialog}>
          <View style={[styles.modalContainer, isVisible ? styles.fadeIn : styles.fadeOut]}>           
              {content}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </DialogContext.Provider>
  );
};


// DialogContent component
const DialogContent: React.FC<{ closeDialog: () => void; showX: boolean; children: React.ReactNode, style: ViewStyle }> = ({ closeDialog, showX, children, style }) => (
  <TouchableWithoutFeedback>
    <View style={[styles.content, style]}>
      {/* {showX && (
        <DialogClose closeDialog={closeDialog} />
      )} */}
      {children}
      {/* Add your dialog content here */}
    </View>
  </TouchableWithoutFeedback>
);

// DialogClose component
const DialogClose: React.FC<{ closeDialog: () => void }> = ({ closeDialog }) => (
  <TouchableOpacity style={styles.closeButton} onPress={closeDialog}>
    <Image source={require('@/assets/global/back.png')} style={styles.icon} />
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
const DialogTitle: React.FC<{ children: ReactNode; style?: TextStyle }> = ({ children, style }) => 
  {
    const context = useContext(DialogContext);
    if (!context) throw new Error('DialogTrigger must be used within a DialogProvider');
  
    const { closeDialog } = context;
  
    return (
  <View style={{display:'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
    <DialogClose closeDialog={closeDialog}/>   
    <Text style={[styles.title, style]}>{children}</Text>
  </View>
)};

// DialogDescription compoent
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
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative'
  },
  closeButton: {
    zIndex: 100
  },
  icon: {
    height: 20,
    width: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white'
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
  modalContainer: {
    position: 'absolute', // Equivalent to 'fixed'
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 50, // Equivalent to 'z-50'
    opacity: 1, // Start fully visible
    // Add animation properties here if needed
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11111190'
  },
  fadeIn: {
    opacity: 1, // Fully visible
    // transition: 'opacity 0.3s ease-in', // Example for animation
  },
  fadeOut: {
    opacity: 0, // Fully transparent
    // transition: 'opacity 0.3s ease-out', // Example for animation
  },
});

// Exports
export {
  Dialog,
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
