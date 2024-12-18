import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface CardGradientProps {
  gradient: "blue" | "purple" | "orange";
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardGradient: React.FC<CardGradientProps> = ({ children, style, gradient }) => {
  const gradients = {
    blue: {
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(108.28deg, #55A6FC 4.31%, #1363B6 94.3%)',
    },
    purple: {
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(102.47deg, #EC26FD 4.45%, #471797 98.95%)',
    },
    orange: {
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(180deg, #F19595 0%, #F43E3E 100%)',
    },
  };

  return (
    <View
      style={[
        styles.card,
        { ...gradients[gradient] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 240,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default CardGradient;
