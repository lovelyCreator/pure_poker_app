import React from "react";
import { View, Image, StyleSheet, ViewStyle} from "react-native";

interface CardEmptyProps {
  style?: ViewStyle;
}

export const CardEmpty: React.FC<CardEmptyProps> = ({ style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <Image
        source={require('@/assets/game/empty-card-desktop.png')}
        style={styles.cardImage}
        alt="Empty Card"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    height: 60,
    width: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
});

export default CardEmpty;
