import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { MessageCircleMore } from "lucide-react-native"; // Ensure you have lucide-react-native or a similar icon library installed

interface EmoteToggleButtonProps {
  toggleEmoteSelector: () => void;
  isEmoteSelectorVisible: boolean;
}

const EmoteToggleButton: React.FC<EmoteToggleButtonProps> = ({
  toggleEmoteSelector,
  isEmoteSelectorVisible,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleEmoteSelector}
        style={[
          styles.button,
          isEmoteSelectorVisible ? styles.buttonActive : styles.buttonInactive,
        ]}
      >
        <MessageCircleMore
          style={[
            styles.icon,
            isEmoteSelectorVisible ? styles.iconActive : styles.iconInactive,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    top: 10,
    zIndex: 20,
  },
  button: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 2,
    transitionDuration: "300ms",
  },
  buttonActive: {
    backgroundColor: "#3B82F6", // Blue color
    borderColor: "#3B82F6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonInactive: {
    backgroundColor: "#FFFFFF", // White color
    borderColor: "#D1D5DB", // Gray color
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconActive: {
    color: "#FFFFFF", // White color when active
  },
  iconInactive: {
    color: "#000000", // Black color when inactive
  },
});

export default EmoteToggleButton;
