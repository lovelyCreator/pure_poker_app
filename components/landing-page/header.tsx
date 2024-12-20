import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Import your PNG logo
const logo = require('@/assets/global/pure-poker-logo.png');

export default function Header() {
    return (
        <View style={styles.header}>
            <View style={styles.nav}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} resizeMode="contain" />
                </View>
                <View style={styles.linksContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => {/* Navigate to sign-up */}}>
                        <Text style={styles.buttonText}>Get started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => {/* Navigate to sign-in */}}>
                        <Text style={styles.loginText}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(33, 37, 48, 0.7)', // Adjust opacity as needed
        paddingVertical: 10,
        paddingHorizontal: 16,
        zIndex: 50,
        backdropFilter: 'blur(10px)', // Note: This may not work directly in React Native; consider alternative methods
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        height: '100%',
        justifyContent: 'center',
    },
    logo: {
        width: 64, // Adjust based on design
        height: 'auto',
    },
    linksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        backgroundColor: '#1e84f0',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: 'transparent',
        borderColor: '#1e84f0',
        borderWidth: 1,
    },
    loginText: {
        color: '#1e84f0',
        fontSize: 14,
    },
});
