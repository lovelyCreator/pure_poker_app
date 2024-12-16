import React, { useRef, useState } from "react";
import { View, Image, Video, StyleSheet, TouchableOpacity, Text } from "react-native";

interface BackgroundMediaProps {
  variant?: "none" | "light" | "dark";
  type?: "image" | "video";
  source: any;
  alt?: string;
}

const BackgroundMedia: React.FC<BackgroundMediaProps> = ({
  variant = "light",
  type = "image",
  source,
  alt = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const mediaRef = useRef(null);

  const toggleMediaPlay = () => {
    if (type === "video" && mediaRef.current) {
      if (isPlaying) {
        // Pause the video
        mediaRef.current.pause();
      } else {
        // Play the video
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderMedia = () => {
    if (type === "video") {
      return (
        <Video
          ref={mediaRef}
          source={source}
          style={styles.media}
          resizeMode="cover"
          isLooping
          shouldPlay={isPlaying}
          isMuted
        />
      );
    } else {
      return (
        <Image
          source={source}
          style={styles.media}
          accessibilityLabel={alt}
        />
      );
    }
  };

  return (
    <View style={[styles.container, variantStyles[variant]]}>
      {renderMedia()}
      {type === "video" && (
        <TouchableOpacity
          style={styles.button}
          onPress={toggleMediaPlay}
          accessibilityLabel={isPlaying ? "Pause video" : "Play video"}
        >
          <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const variantStyles = {
  none: {},
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export { BackgroundMedia };
