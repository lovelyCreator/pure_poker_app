import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: ViewStyle;
}

const Card = React.forwardRef<View, CardProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = "Card";

interface CardHeaderProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: ViewStyle;
}

const CardHeader = React.forwardRef<View, CardHeaderProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardHeader, style]} {...props} />
));
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.ComponentPropsWithoutRef<typeof Text> {
  style?: TextStyle;
}

const CardTitle = React.forwardRef<Text, CardTitleProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardTitle, style]} {...props} />
));
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends React.ComponentPropsWithoutRef<typeof Text> {
  style?: TextStyle;
}

const CardDescription = React.forwardRef<Text, CardDescriptionProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardDescription, style]} {...props} />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: ViewStyle;
}

const CardContent = React.forwardRef<View, CardContentProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardContent, style]} {...props} />
));
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: ViewStyle;
}

const CardFooter = React.forwardRef<View, CardFooterProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardFooter, style]} {...props} />
));
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#414a60',
    backgroundColor: 'rgba(44, 50, 65, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 14,
    color: '#888',
  },
  cardContent: {
    padding: 24,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
