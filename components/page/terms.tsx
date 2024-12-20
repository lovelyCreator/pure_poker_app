import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardTitle } from "@/components/ui/card"; // Ensure these imports are correct
import { Button } from "@/components/ui/button"; // Ensure this import is correct

interface TermsProps {
    setShowTerms: (value: boolean) => void;
}

const Terms: React.FC<TermsProps> = ({ setShowTerms }) => {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <CardTitle style={styles.cardTitle}>
                    <Text style={styles.title}>Pure Poker Terms of Service</Text>
                </CardTitle>
                <CardContent style={styles.cardContent}>
                    <ScrollView>
                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>By using our Services,</Text> whether as a guest, as a registered user, or otherwise, you agree that these Terms of Service will govern your relationship with Pure Poker. If you do not completely agree to these Terms of Service, then you must not use any of our Services.
                        </Text>

                        <Text style={styles.sectionTitle}>Definitions</Text>
                        <Text style={styles.listItem}><Text style={styles.bold}>Account:</Text> Any account provided by Pure Poker that you create to access certain Services.</Text>
                        <Text style={styles.listItem}><Text style={styles.bold}>Conflict:</Text> Any controversy related to this agreement...</Text>
                        <Text style={styles.listItem}><Text style={styles.bold}>Pure Poker:</Text> Pure Poker Inc. d/b/a Pure Poker Online...</Text>
                        {/* Add more definitions as needed */}

                        <Text style={styles.sectionTitle}>Ownership and Limited License</Text>
                        <Text style={styles.paragraph}>
                            The Services are licensed by Pure Poker, and are protected by Intellectual Property Rights...
                        </Text>

                        {/* Additional sections can be added here */}

                        <Text style={styles.contact}>
                            For further assistance, you can contact Pure Poker at support@puregroup.media.
                        </Text>
                    </ScrollView>
                </CardContent>
                <TouchableOpacity style={styles.button} onPress={() => setShowTerms(false)}>
                    <Button variant="full" textStyle={styles.buttonText}>Back</Button>
                </TouchableOpacity>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
    },
    card: {
        maxHeight: '95%',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        backgroundColor: '#212530B2',
        paddingVertical: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardContent: {
        padding: 10,
    },
    paragraph: {
        marginBottom: 12,
        color: '#333',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 16,
        color: '#333',
    },
    listItem: {
        marginLeft: 10,
        color: '#333',
    },
    button: {
        padding: 12,
        alignItems: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    contact: {
        marginTop: 20,
        color: '#333',
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default Terms;
