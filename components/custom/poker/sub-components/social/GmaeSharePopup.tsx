import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native";
import { Copy, ExternalLink, X } from "lucide-react"; // Ensure you have lucide-react or similar icon library installed
import { toast } from "sonner"; // Make sure to have a toast library installed
import { Clipboard } from 'react-native-clipboard/clipboard'; // Import Clipboard 

const GameSharePopup: React.FC<{ gameId: string }> = ({ gameId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const shareMessage = `I just started a Game on Pure Poker! Use the game ID ${gameId} or click this link to join!`;
    const shareURL = `http://purepoker.world/play-poker?gameId=${gameId}`;

    const openShareModal = () => setIsModalOpen(true);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // await Clipboard.setString(text);
            toast.success("Copied to clipboard!");
        } catch (e) {
            toast.error("Failed to copy");
        }
    };

    const closeShareModal = () => {
        setIsModalOpen(false);
    };

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join My Game on Pure Poker!",
                    text: shareMessage,
                    url: shareURL,
                });
                toast.success("Game shared successfully!");
            } catch (e) {
                toast.error("Failed to share the game");
            }
        } else {
            toast.error("Web Share API not supported on this device.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => copyToClipboard(gameId)}
            >
                <Text style={styles.buttonText}>#{gameId}</Text>
                <Copy style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.shareButton}
                onPress={openShareModal}
            >
                <ExternalLink style={styles.icon} />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={isModalOpen}
                animationType="fade"
                onRequestClose={closeShareModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={closeShareModal}
                            style={styles.closeButton}
                            aria-label="Close"
                        >
                            <X style={styles.closeIcon} />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Share</Text>

                        <TouchableOpacity
                            style={styles.copyLinkButton}
                            onPress={() => copyToClipboard(shareURL)}
                        >
                            <Text style={styles.copyLinkText}>Copy Game Link</Text>
                            <Copy style={styles.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={handleWebShare}
                        >
                            <Text style={styles.shareText}>Share to Socials</Text>
                            <ExternalLink style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#1f1f1f",
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        marginRight: 5,
    },
    shareButton: {
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
        marginLeft: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#1f1f1f",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    closeIcon: {
        color: "gray",
    },
    modalTitle: {
        fontSize: 20,
        color: "white",
        marginBottom: 20,
        textAlign: "center",
    },
    copyLinkButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333333",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    copyLinkText: {
        color: "white",
        fontSize: 16,
    },
    shareText: {
        color: "white",
        fontSize: 16,
    },
    icon: {
        color: "white",
        width: 24,
        height: 24,
    },
});

export default GameSharePopup;
