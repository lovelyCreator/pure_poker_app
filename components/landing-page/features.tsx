import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Import your PNG assets
const creategroup = require('@/assets/landing/featuresgroup.png');
const community = require('@/assets/landing/featurescommunity.png');
const gameplay = require('@/assets/landing/gameplay.png');

const featuresData = [
    {
        image: creategroup,
        title: "Join or create groups to play with like-minded players.",
        description: "Stay connected and organize games easily.",
    },
    {
        image: community,
        title: "Engage with a vibrant community.",
        description: "Chat, share strategies, and make new friends.",
    },
    {
        image: gameplay,
        title: "Experience online poker in the same, social way your home game is played.",
        description: "Enjoy various poker variants and tournaments.",
    },
];

export default function Features() {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Features</Text>
                <View style={styles.featuresList}>
                    {featuresData.map((feature, index) => (
                        <View
                            key={index}
                            style={[
                                styles.featureItem,
                                index % 2 === 1 ? styles.reverse : null,
                            ]}
                        >
                            <Image source={feature.image} style={styles.image} resizeMode="contain" />
                            <View style={styles.textContainer}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>{feature.description}</Text>
                                <TouchableOpacity style={styles.button} onPress={() => {/* Navigate to sign-up */}}>
                                    <Text style={styles.buttonText}>Get started</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1c202b',
        paddingBottom: 40,
        paddingTop: 80,
    },
    innerContainer: {
        marginTop: 40,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1e84f0',
        textAlign: 'center',
    },
    featuresList: {
        marginTop: 20,
        flexDirection: 'column',
        gap: 20,
    },
    featureItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    reverse: {
        flexDirection: 'row-reverse',
    },
    image: {
        width: '100%',
        maxWidth: 250, // Adjust as needed
    },
    textContainer: {
        justifyContent: 'center',
        paddingHorizontal: 16,
        alignItems: 'center',
        textAlign: 'center',
    },
    featureTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#a9c6e5',
        textAlign: 'center',
    },
    featureDescription: {
        paddingVertical: 8,
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
        textAlign: 'center',
    },
});
