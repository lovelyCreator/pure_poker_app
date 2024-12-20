import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import useWebSocket from "react-use-websocket";
import { gameFinishedToWaitTime, getPokerUrl } from "@/lib/poker";
import { useSpan } from "@/utils/logging";
import { toast } from "sonner";
import { GameState, sendPokerAction, WebSocketMessage } from "@/types/poker";
import { useAuth } from "@/hooks/useAuth";
import { Animated } from "react-native";

type BombPotDecisionProps = {
    isBombPotProposed: boolean;
    gameIsAllIn: "preFlop" | "flop" | "turn" | "river";
    gameOverTimeStamp: string;
    thisPlayerBombPotDecision: "optIn" | "optOut" | "veto";
    proposer: string;
    bigBlinds: number;
    postFlopBetting: boolean;
    gameId: string;
    gameState: GameState;
    showBombPotDecisionModal: boolean;
    setShowBombPotDecisionModal: (value: boolean) => void;
};

const BombPotDecision: React.FC<BombPotDecisionProps> = ({
    isBombPotProposed,
    gameIsAllIn,
    gameOverTimeStamp,
    thisPlayerBombPotDecision,
    proposer,
    bigBlinds,
    postFlopBetting,
    gameId,
    gameState,
    showBombPotDecisionModal,
    setShowBombPotDecisionModal
}) => {
    const [decision, setDecision] = useState<string>(thisPlayerBombPotDecision);
    const [timeBarWidth, setTimeBarWidth] = useState(new Animated.Value(100)); // Start at 100%

    const user = useAuth();
    const span = useSpan("bombPotDecision");
    const { sendJsonMessage } = useWebSocket(getPokerUrl(span, gameId, user.username), {
        share: true,
        onMessage: (event) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                if (data.action === "bombPotDecision" && data.statusCode !== 200) {
                    toast.error("Failed to make bomb pot decision.");
                }
            } catch (e) {
                toast.error("Failed to process bomb pot decision.");
            }
        },
    });

    const handleMakeBombPotDecision = (newDecision: string) => {
        setDecision(newDecision);
        const bombPotMessage: sendPokerAction = {
            action: "sendPokerAction",
            gameId,
            gameAction: "makeBombPotDecision",
            bombPotDecision: newDecision,
        };
        sendJsonMessage(bombPotMessage);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDecision(thisPlayerBombPotDecision);
        }, 1000); // wait 1 second

        return () => clearTimeout(timer);
    }, [decision, thisPlayerBombPotDecision]);

    useEffect(() => {
        const timestamp = new Date(gameOverTimeStamp).getTime();
        const currentTime = Date.now();
        let showDownTime = gameFinishedToWaitTime[gameIsAllIn] * 1000;
        if (gameState?.bombPotActive && gameIsAllIn === "preFlop") {
            showDownTime = 12 * 1000;
        }
        const delay = Math.max(0, timestamp + showDownTime - currentTime);

        const showTimer = setTimeout(() => setShowBombPotDecisionModal(true), delay);
        return () => clearTimeout(showTimer);
    }, [gameOverTimeStamp, isBombPotProposed]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        let showDownTime = gameFinishedToWaitTime[gameIsAllIn] * 1000;
        if (gameState?.bombPotActive && gameIsAllIn === "preFlop") {
            showDownTime = 12 * 1000;
        }

        if (showBombPotDecisionModal) {
            const startTimestamp = new Date(gameOverTimeStamp).getTime() + showDownTime;

            intervalId = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = (currentTime - startTimestamp) / 1000; // elapsed time in seconds
                const timeLimit = 10.5; // 10 seconds

                const remainingPercentage = Math.max(0, ((timeLimit - elapsedTime) / timeLimit) * 100);
                setTimeBarWidth(new Animated.Value(remainingPercentage));

                if (remainingPercentage === 0) {
                    clearInterval(intervalId); // Stop updates when time is up
                }
            }, 16);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [showBombPotDecisionModal, gameOverTimeStamp]);

    if (!showBombPotDecisionModal) return null;

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>
                    <Text style={styles.proposer}>{proposer}</Text> has proposed a Bomb Pot for
                    <Text style={styles.bigBlinds}> {bigBlinds} BBs</Text>{" "}
                    <Text style={postFlopBetting ? styles.postFlop : styles.preFlop}>
                        {postFlopBetting ? "with Post-Flop Betting" : "without Post-Flop Betting"}
                    </Text>
                </Text>

                <View style={styles.buttonContainer}>
                    {/* Opt In */}
                    <View style={styles.buttonWrapper}>
                        <Text style={styles.buttonLabel}>Opt In</Text>
                        <TouchableOpacity
                            onPress={() => handleMakeBombPotDecision("optIn")}
                            style={[
                                styles.button,
                                decision === "optIn" ? styles.optInActive : styles.optInInactive
                            ]}
                        >
                            <Text style={styles.buttonIcon}>✔️</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Opt Out */}
                    <View style={styles.buttonWrapper}>
                        <Text style={styles.buttonLabel}>Opt Out</Text>
                        <TouchableOpacity
                            onPress={() => handleMakeBombPotDecision("optOut")}
                            style={[
                                styles.button,
                                decision === "optOut" ? styles.optOutActive : styles.optOutInactive
                            ]}
                        >
                            <Text style={styles.buttonIcon}>❌</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Veto */}
                    <View style={styles.buttonWrapper}>
                        <Text style={styles.buttonLabel}>Veto</Text>
                        <TouchableOpacity
                            onPress={() => handleMakeBombPotDecision("veto")}
                            style={[
                                styles.button,
                                decision === "veto" ? styles.vetoActive : styles.vetoInactive
                            ]}
                        >
                            <Text style={styles.buttonIcon}>🚫</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Time Bar */}
                <View style={styles.timeBarContainer}>
                    <Animated.View
                        style={[
                            styles.timeBar,
                            { width: timeBarWidth.interpolate({
                                inputRange: [0, 100],
                                outputRange: ["0%", "100%"],
                            }) }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
        zIndex: 50,
        backgroundColor: "#2D2D2D",
        borderRadius: 15,
        padding: 20,
        width: "90%",
        maxWidth: 400,
        alignItems: "center",
    },
    modalContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    proposer: {
        color: "#3B82F6",
    },
    bigBlinds: {
        color: "#FBBF24",
        fontWeight: "bold",
    },
    postFlop: {
        color: "#22C55E",
        fontWeight: "bold",
    },
    preFlop: {
        color: "#EF4444",
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    buttonWrapper: {
        alignItems: "center",
    },
    buttonLabel: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 5,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    optInActive: {
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
    },
    optInInactive: {
        borderColor: "#3B82F6",
    },
    optOutActive: {
        backgroundColor: "#4B5563",
        borderColor: "#374151",
    },
    optOutInactive: {
        borderColor: "#9CA3AF",
    },
    vetoActive: {
        backgroundColor: "#DC2626",
        borderColor: "#B91C1C",
    },
    vetoInactive: {
        borderColor: "#EF4444",
    },
    buttonIcon: {
        fontSize: 24,
        color: "white",
    },
    timeBarContainer: {
        marginTop: 20,
        height: 10,
        width: "100%",
        backgroundColor: "#4B5563",
        borderRadius: 5,
    },
    timeBar: {
        height: "100%",
        backgroundColor: "#3B82F6",
        borderRadius: 5,
    },
});

export default BombPotDecision;
