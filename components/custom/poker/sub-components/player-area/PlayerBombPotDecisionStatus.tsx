import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PlayerBombPotDecisionStatusProps {
  currentDecision: "optIn" | "optOut" | "veto";
}

const PlayerBombPotDecisionStatus: React.FC<PlayerBombPotDecisionStatusProps> = ({
  currentDecision,
}) => {
  const decisionStyles = {
    optIn: styles.optIn,
    optOut: styles.optOut,
    veto: styles.veto,
  };

  const decisionLabels = {
    optIn: "Opt In",
    optOut: "Opt Out",
    veto: "Veto",
  };

  return (
    <View style={styles.container}>
      <View style={[styles.decisionCircle, decisionStyles[currentDecision]]}>
        <Text style={styles.decisionText}>{decisionLabels[currentDecision]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: -20, // Adjust as needed
    top: 10, // Adjust as needed
    zIndex: 20,
    padding: 2,
    borderRadius: 50,
    backgroundColor: "#4B5563", // Equivalent to bg-gray-800
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  decisionCircle: {
    width: 35,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  optIn: {
    backgroundColor: "#3B82F6", // Equivalent to bg-blue-500
    borderColor: "#2563EB", // Equivalent to border-blue-600
    borderWidth: 2,
  },
  optOut: {
    backgroundColor: "#6B7280", // Equivalent to bg-gray-500
    borderColor: "#4B5563", // Equivalent to border-gray-600
    borderWidth: 2,
  },
  veto: {
    backgroundColor: "#EF4444", // Equivalent to bg-red-500
    borderColor: "#B91C1C", // Equivalent to border-red-600
    borderWidth: 2,
  },
  decisionText: {
    fontSize: 9, // Adjust for smaller screens
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default PlayerBombPotDecisionStatus;
