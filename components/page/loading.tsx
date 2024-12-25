// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Animated } from 'react-native';

// const LoadingPage = () => {
//   const [randomPhrase, setRandomPhrase] = useState('');

//   const phrases = [
//     "Life's a game, poker is serious.",
//     "Bluffing our way through the wait...",
//     "Just like in poker, patience is key...",
//     "Every card you draw brings a new possibility.",
//     "It's not the cards you're dealt, but how you play them.",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const phrase = phrases[Math.floor(Math.random() * phrases.length)];
//       setRandomPhrase(phrase);
//     }, 3000); // Change phrase every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const pulseAnimation = new Animated.Value(1);
//   const spinAnimation = new Animated.Value(0);

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnimation, {
//           toValue: 1.3,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnimation, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.timing(spinAnimation, {
//         toValue: 1,
//         duration: 1500,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const spin = spinAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.loaderContainer}>
//         <Animated.View style={[styles.loader, { transform: [{ scale: pulseAnimation }] }]} />
//         <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
//         <Animated.View style={[styles.innerLoader, { transform: [{ scale: pulseAnimation }] }]} />
//       </View>
//       <Animated.Text style={styles.phrase}>
//         {randomPhrase}
//       </Animated.Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1a1a1a',
//   },
//   loaderContainer: {
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loader: {
//     height: 100,
//     width: 100,
//     borderRadius: 50,
//     borderWidth: 4,
//     borderColor: '#007BFF',
//     position: 'absolute',
//   },
//   spinner: {
//     height: 80,
//     width: 80,
//     borderRadius: 40,
//     borderWidth: 4,
//     borderColor: 'transparent',
//     borderTopColor: '#007BFF',
//     position: 'absolute',
//     backgroundColor: '#333',
//   },
//   innerLoader: {
//     height: 60,
//     width: 60,
//     borderRadius: 30,
//     borderWidth: 2,
//     borderColor: '#555',
//     position: 'absolute',
//     backgroundColor: '#1a1a1a',
//   },
//   phrase: {
//     marginTop: 20,
//     color: '#ccc',
//     fontSize: 20,
//     textAlign: 'center',
//   },
// });

// export default LoadingPage;


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';

const LoadingPage = () => {
  const phrases = [
    "Life's a game, poker is serious.",
    "Bluffing our way through the wait...",
    "Just like in poker, patience is key...",
    "Every card you draw brings a new possibility.",
    "It's not the cards you're dealt, but how you play them.",
  ];
  const navigation = useNavigation();

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <MotiView
          style={styles.pulse}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
          transition={{
            type: 'timing',
            duration: 2000,
            loop: true,
          }}
        />
        <MotiView
          style={styles.spinner}
          animate={{ rotate: '360deg' }}
          transition={{
            type: 'timing',
            duration: 1500,
            loop: true,
          }}
        />
        <MotiView
          style={styles.innerPulse}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
          transition={{
            type: 'timing',
            duration: 2000,
            loop: true,
          }}
        />
      </View>
      <MotiView
        style={styles.phrase}
        animate={{ translateY: [0, -20, 0] }} // Bounce effect
        transition={{
          type: 'timing',
          duration: 1500,
          loop: true,
        }}
      >
        <Text style={styles.phrase}>{randomPhrase}</Text>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a202c', // Equivalent to bg-gray-900
    padding: 16,
  },
  loaderContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    height: 96,
    width: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#4299e1', // Equivalent to border-blue-500
    position: 'absolute',
  },
  spinner: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#4299e1', // Equivalent to border-t-blue-500
    backgroundColor: '#2d3748', // Equivalent to bg-gray-800
    position: 'absolute',
  },
  innerPulse: {
    height: 64,
    width: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#4a5568', // Equivalent to border-gray-700
    backgroundColor: '#1a202c', // Equivalent to bg-gray-900
    position: 'absolute',
  },
  phrase: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 20, // Equivalent to text-xl
    fontWeight: '600', // Equivalent to font-semibold
    color: '#e2e8f0', // Equivalent to text-gray-300
  },
});

export default LoadingPage;
