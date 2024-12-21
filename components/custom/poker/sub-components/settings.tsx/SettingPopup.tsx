import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Settings, X } from "lucide-react-native"; // Ensure you have lucide-react-native installed

interface SettingsProps {
  displayBB: boolean;
  setDisplayBB: (value: boolean) => void;
  playSoundEnabled: boolean;
  setPlaySoundEnabled: (value: boolean) => void;
}

const SettingsPopup: React.FC<SettingsProps> = ({
  displayBB,
  setDisplayBB,
  playSoundEnabled,
  setPlaySoundEnabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openSettingsModal = () => setIsModalOpen(true);
  const closeSettingsModal = () => setIsModalOpen(false);

  const toggleDisplayBB = () => {
    const newDisplayBB = !displayBB;
    setDisplayBB(newDisplayBB);
    // Update the search params if needed
  };

  const toggleSetSoundEnabled = () => {
    const newSoundEnabled = !playSoundEnabled;
    setPlaySoundEnabled(newSoundEnabled);
    // Update the search params if needed
  };

  return (
    <View style={styles.container}>
      {/* Settings Button */}
      <TouchableOpacity
        onPress={openSettingsModal}
        style={styles.settingsButton}
      >
        <Settings size={16} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalOpen}
        onRequestClose={closeSettingsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeSettingsModal} style={styles.closeButton}>
              <X size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Settings</Text>

            <View style={styles.settingOption}>
              <Text style={styles.optionLabel}>Display BB</Text>
              <TouchableOpacity onPress={toggleDisplayBB} style={styles.toggleSwitch}>
                <View style={[styles.switch, displayBB ? styles.switchOn : styles.switchOff]}>
                  <View style={[styles.thumb, displayBB ? styles.thumbOn : styles.thumbOff]} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.settingOption}>
              <Text style={styles.optionLabel}>Enable Sounds</Text>
              <TouchableOpacity onPress={toggleSetSoundEnabled} style={styles.toggleSwitch}>
                <View style={[styles.switch, playSoundEnabled ? styles.switchOn : styles.switchOff]}>
                  <View style={[styles.thumb, playSoundEnabled ? styles.thumbOn : styles.thumbOff]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsButton: {
    backgroundColor: "#6b7280",
    padding: 10,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  settingOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  optionLabel: {
    color: "white",
    fontSize: 18,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
  },
  switchOn: {
    backgroundColor: "#34d399",
  },
  switchOff: {
    backgroundColor: "#6b7280",
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: "absolute",
    top: 2,
  },
  thumbOn: {
    left: 24,
    backgroundColor: "white",
  },
  thumbOff: {
    left: 2,
    backgroundColor: "white",
  },
});

export default SettingsPopup;
