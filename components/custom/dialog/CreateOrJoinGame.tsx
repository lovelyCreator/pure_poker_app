import React, { useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { JoinGameDialog } from "./JoinGame";
import { CreateGameDialog } from "./CreateGame";

import { Button } from "@/components/ui/button";
import { View, Text, StyleSheet } from 'react-native'
import Or from "../global/or";

export default function CreateOrJoinGame({
    children,
    isCreateGame,
    defaultGameId,
    userIsVerified,
} : {
    children: React.ReactNode;
    isCreateGame?: boolean;
    defaultGameId?: string;
    userIsVerified: boolean;
}){
    const [isCreateGameDialogOpen, setIsCreateGameDialogOpen] = useState(
      isCreateGame ?? true,
    );
  
    // If user is not verified, disable interaction
    if (!userIsVerified) {
      return <div className="cursor-not-allowed opacity-50">{children}</div>;
    }
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent style={styles.content}>
                <DialogTitle>
                {isCreateGameDialogOpen ? "Create game" : "Join game"}
                </DialogTitle>
                {isCreateGameDialogOpen ? (
                <CreateGameDialog />
                ) : (
                <JoinGameDialog defaultGameId={defaultGameId} />
                )}
                <View style={{display: 'flex', justifyContent: 'center'}}>
                    <View style={{width: '50%'}}>
                        <Or />
                    </View>
                </View>
                <View>
                    <Button
                        variant="empty"
                        className="h-8 w-32"
                        onPress={() => setIsCreateGameDialogOpen((prev) => !prev)}
                    >
                        {isCreateGameDialogOpen ? "Join game" : "Create game"}
                    </Button>
                </View>
            </DialogContent>
        </Dialog>
    )
}

const styles = StyleSheet.create({
    content: {
        maxWidth: 128,
        borderRadius: 24,
        backgroundColor: '#212530'
    }
})