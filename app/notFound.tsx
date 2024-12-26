import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const NotFound = () => {
  const navigation = useNavigation();
  console.log("This is 404 page!!!!")

  return (
    <ImageBackground
      source={require('@/assets/404/404.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Game not found!</Text>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('home')}>
          <Image source={require('@/assets/404/leftArrow.png')} style={styles.icon} />
          <Text style={styles.linkText}>Go back to home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11141D'
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 72,
    fontWeight: 'bold',
    color: '#D7D5E4',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 48,
    color: '#9E9BB2',
  },
  link: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  linkText: {
    fontSize: 24,
    color: '#FFFFFF', // Adjust color as needed
  },
});

export default NotFound;
