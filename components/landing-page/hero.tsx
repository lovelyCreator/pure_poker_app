import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// Import your PNG assets (convert SVGs to PNG)
const banner = require('@/assets/landing/hero.png'); // Use PNG instead of SVG
const bg = require('@/assets/landing/hero-bg.png'); // Use PNG instead of SVG

const { height } = Dimensions.get('window');

export default function Hero() {
    return (
        <View style={styles.section}>
            <View style={styles.background}>
                <Image source={bg} style={styles.backgroundImage} resizeMode="cover" />
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>
                                Play Online Poker Like You Play At Home
                            </Text>
                            <Text style={styles.description}>
                                Join the best online poker community and experience a safe,
                                rake-free poker environment
                            </Text>
                            <TouchableOpacity style={styles.button} onPress={() => {/* Navigate to sign-up */}}>
                                <Text style={styles.buttonText}>Get started</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image source={banner} style={styles.bannerImage} resizeMode="contain" />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        minHeight: height - 64, // Adjust based on your header height
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: 10,
    },
    textContainer: {
        marginBottom: 10,
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1e84f0',
        textAlign: 'center',
    },
    description: {
        maxWidth: 540,
        paddingVertical: 5,
        fontSize: 14,
        color: '#7086a9',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#1e84f0',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
    },
    bannerImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1, // Adjust based on your image aspect ratio
    },
});
