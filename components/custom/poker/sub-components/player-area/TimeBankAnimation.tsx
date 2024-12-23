// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, Animated } from "react-native";
// import { MotiView } from 'moti';

// interface TimeBankProps {
//   setShowTimeBankAnimation: (value: boolean) => void;
// }

// const TimeBankAnimation: React.FC<TimeBankProps> = ({ setShowTimeBankAnimation }) => {
//   const translateX = new Animated.Value(100); // Start off-screen
//   const opacity = new Animated.Value(0); // Start invisible
//   const scale = new Animated.Value(0.8); // Start scaled down

//   useEffect(() => {
//     const animateSequence = async () => {
//       try {
//         // Animate entry
//         await new Promise((resolve) => {
//           Animated.parallel([
//             Animated.spring(translateX, {
//               toValue: 1, // Move to 1% position
//               stiffness: 100,
//               damping: 20,
//               useNativeDriver: true,
//             }),
//             Animated.timing(opacity, {
//               toValue: 1,
//               duration: 500,
//               useNativeDriver: true,
//             }),
//             Animated.timing(scale, {
//               toValue: 1,
//               duration: 300,
//               useNativeDriver: true,
//             }),
//           ]).start(resolve);
//         });

//         // Pause in the center
//         await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 seconds pause

//         // Animate exit
//         await new Promise((resolve) => {
//           Animated.parallel([
//             Animated.spring(translateX, {
//               toValue: -100, // Move off-screen
//               stiffness: 100,
//               damping: 20,
//               useNativeDriver: true,
//             }),
//             Animated.timing(opacity, {
//               toValue: 0,
//               duration: 500,
//               useNativeDriver: true,
//             }),
//             Animated.timing(scale, {
//               toValue: 0.8,
//               duration: 300,
//               useNativeDriver: true,
//             }),
//           ]).start(resolve);
//         });

//         // Hide the component after the animation is done
//         setShowTimeBankAnimation(false);
//       } catch (error) {
//         console.error("Animation sequence error:", error);
//       }
//     };

//     // Start the animation sequence
//     animateSequence();
//   }, [setShowTimeBankAnimation, translateX, opacity, scale]);

//   const animatedStyle = {
//     transform: [
//       { translateX },
//       { scale },
//     ],
//     opacity,
//   };

//   return (
//     <Animated.View style={[styles.container, animatedStyle]}>
//       <View style={styles.messageContainer}>
//         <Text style={styles.messageText}>+30s Added!</Text>
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: [{ translateX: -50 }, { translateY: -50 }],
//     zIndex: 50,
//     backgroundColor: "transparent",
//   },
//   messageContainer: {
//     backgroundColor: "red",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   messageText: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     fontFamily: "Poppins", // Ensure this font is loaded in your project
//   },
// });

// export default TimeBankAnimation;


import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface TimeBankProps {
  setShowTimeBankAnimation: (value: boolean) => void;
}

const TimeBankAnimation = ({ setShowTimeBankAnimation }: TimeBankProps) => {
  const [isVisible, setIsVisible] = React.useState(true);

  useEffect(() => {
    const animateSequence = async () => {
      // Animate entry
      setIsVisible(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 800); // Duration for entry
      });

      // Pause in the center
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second pause

      // Animate exit
      setIsVisible(false);
      setShowTimeBankAnimation(false);
    };

    animateSequence();
  }, [setShowTimeBankAnimation]);

  return (
    <MotiView
      from={{ x: '100%', opacity: 0, scale: 0.8 }}
      animate={{
        x: isVisible ? '1%' : '-100%',
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      }}
      style={styles.container}
    >
      <View style={styles.messageContainer}>
        <Text style={styles.message}>+30s Added!</Text>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 50,
  },
  messageContainer: {
    backgroundColor: 'red',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  message: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});

export default TimeBankAnimation;
