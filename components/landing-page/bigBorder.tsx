import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Import your PNG assets
const border = require('@/assets/landing/big-border.png');
const leftCoin = require('@/assets/landing/left-coin.png');
const rightCoin = require('@/assets/landing/right-coin.png');
const pure = require('@/assets/landing/pure.png');

export default function BigBorder() {
    return (
        <View style={styles.container}>
            <Image
                source={border}
                style={styles.border}
                resizeMode="contain"
            />
            <View style={styles.pureContainer}>
                <Image
                    source={pure}
                    style={styles.pure}
                    resizeMode="contain"
                />
            </View>
            <Image
                source={leftCoin}
                style={styles.leftCoin}
                resizeMode="contain"
            />
            <Image
                source={rightCoin}
                style={styles.rightCoin}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        top: -48, // Adjust based on your design
    },
    border: {
        width: '100%',
        position: 'absolute',
    },
    pureContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
    },
    pure: {
        width: '25%', // Adjust based on design
        maxWidth: 150,
    },
    leftCoin: {
        position: 'absolute',
        left: 0,
        top: 4, // Adjust based on design
        width: '12.5%', // Adjust based on design
        maxWidth: 80,
    },
    rightCoin: {
        position: 'absolute',
        right: 0,
        top: 4, // Adjust based on design
        width: '12.5%', // Adjust based on design
        maxWidth: 80,
    },
});
