import React, { forwardRef, ReactNode } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

// Type definitions for props (adjust as needed)
interface CardProps extends StyleProp<ViewStyle> {
    children: ReactNode;
}
interface CardHeaderProps extends StyleProp<ViewStyle> {
    children: ReactNode;
}
interface CardTitleProps extends StyleProp<ViewStyle> {
    children: ReactNode;
}
interface CardDescriptionProps extends StyleProp<ViewStyle> {
    children: ReactNode;
}
interface CardContentProps extends StyleProp<ViewStyle> {
    children: ReactNode;
}
interface CardFooterProps extends StyleProp<ViewStyle> {
    children: ReactNode;
}


const Card = forwardRef<View, CardProps>((props, ref) => (
  <View ref={ref} style={[styles.card, props]}>
    {props.children}
  </View>
));
Card.displayName = 'Card';

const CardHeader = forwardRef<View, CardHeaderProps>((props, ref) => (
  <View ref={ref} style={[styles.cardHeader, props]}>
    {props.children}
  </View>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<Text, CardTitleProps>((props, ref) => (
  <Text ref={ref} style={[styles.cardTitle, props]}>
    {props.children}
  </Text>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<Text, CardDescriptionProps>((props, ref) => (
  <Text ref={ref} style={[styles.cardDescription, props]}>
    {props.children}
  </Text>
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<View, CardContentProps>((props, ref) => (
  <View ref={ref} style={[styles.cardContent, props]}>
    {props.children}
  </View>
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<View, CardFooterProps>((props, ref) => (
  <View ref={ref} style={[styles.cardFooter, props]}>
    {props.children}
  </View>
));
CardFooter.displayName = 'CardFooter';


const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#414a60',
    backgroundColor: '#2c324199',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 10, // Add padding as needed
  },
  cardHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: 'gray',
  },
  cardContent: {
    padding: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };