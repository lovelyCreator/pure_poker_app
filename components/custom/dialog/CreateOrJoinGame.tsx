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
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, StatusBar, TouchableOpacity } from 'react-native'
import Or from "../global/or";

export default function CreateOrJoinGame({
    children,
    isCreateGame,
    defaultGameId,
    userIsVerified,
    seatPosition
} : {
    children: React.ReactNode;
    isCreateGame?: boolean;
    defaultGameId?: string;
    userIsVerified: boolean;
    seatPosition?: number;
}){
    const [isCreateGameDialogOpen, setIsCreateGameDialogOpen] = useState(
      isCreateGame ?? true,
    );
  
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
      setModal(!modal);
    }
    // If user is not verified, disable interaction
    if (!userIsVerified) {
      return <div className="cursor-not-allowed opacity-50">{children}</div>;
    }
    const render =
    (<DialogContent style={styles.content} >
        <DialogTitle>
            {isCreateGameDialogOpen ? "Create game" : "Join game"}
        </DialogTitle>
        {isCreateGameDialogOpen ? (
             <CreateGameDialog />
        ) : (
            <JoinGameDialog defaultGameId={defaultGameId} seatPosition={seatPosition ?? 10}/>
        )}
    </DialogContent>)
    return (
      <View style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems:'center'}}>
        <Dialog content={render}>
          <DialogTrigger>{children}</DialogTrigger>
        </Dialog>
      </View>
    )
}

const styles = StyleSheet.create({
    content: {
        maxWidth: 472,
        borderRadius: 24,
        backgroundColor: '#212530',
        width: '70%',
        gap: 30
    },
})