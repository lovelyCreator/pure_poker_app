import React, { useContext, useEffect } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// import useWebSocket from 'react-use-websocket';
// import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { sendPokerAction } from '@/types/poker';
import { getPokerUrl } from '@/lib/poker';
import { useSpan } from '@/utils/logging';
import { Controller, useForm } from 'react-hook-form';

// import useUserGroups from '@/hooks/useUserGroups';
import { centsToDollars } from  '@/utils/magnitudeConversion'
import type { PokerActionsFrontend } from '@/types/pokerFrontend.';
import assert from "assert";
// import { verifyLocation } from "@/lib/radar";
import { View, Text, StyleSheet } from 'react-native';
import {useAuth} from '@/hooks/useAuth';
import useUserGroups from '@/hooks/useUserGroups';
import useWebSocket from 'react-use-websocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DialogContext } from '@/components/ui/dialog';

const JoinGameSchema = z.object({
    gameId: z.string().min(10, { message: "Invalid GameId." }),
    buyIn: z.coerce
      .number()
      .min(10, { message: "Buy in must be at least 100." })
      .max(5000, { message: "Buy-in myst be less than 5000." }),
  });

  export function JoinGameDialog({ defaultGameId, seatPosition }: { defaultGameId?: string;  seatPosition: number }) {
    const span = useSpan("JoinGameDialog");
    const user = useAuth();

    const context = useContext(DialogContext);
    if (!context) throw new Error('DialogTrigger must be used within a DialogProvider');
    const { closeDialog } = context;  
    const groupsQuery = useUserGroups(); // Fetch the groups the user is part of
  
    // Fetch user's groups from groupsQuery.data
    const userGroups = groupsQuery.data?.map((group) => group.groupId) || [];
    const navigation = useNavigation();
    const route = useRoute();
    const s_span = span.span("webSocket");
    const { sendJsonMessage, getWebSocket } = useWebSocket(
      getPokerUrl(span, "", user.username),
      {
        share: true,
        onOpen: async () => {
          const token = await AsyncStorage.getItem("PP_TOKEN");
          console.log('tokens tokens', token)
          if (token ) {
            sendJsonMessage({
              action: "authenticate",
              token: token,
            });
          } else {
            console.error('Token not found');
          }
        },
        onMessage: (event) => {
          try {
            console.log("messages messages")
            // assert(typeof event.data === "string", "Event is not a string");
            const res = JSON.parse(event.data) as PokerActionsFrontend;
            console.log("Response =====> ", res)
            toast.dismiss();
            if (
              (res.action === "joinGamePlayer" || res.action === "joinGame") && res.statusCode === 200
            ) {
              toast.dismiss();
  
              // give our socket span the game details:
              s_span.setFields({
                gameId: res.gameDetails.gameId,
                gameInProgress: res.gameDetails.gameInProgress,
                //eslint-disable-next-line
                groupId: res.gameDetails.groupId,
                // add more if you please...
              });
  
              const currentGameId = route.params?.gameId ?? "";
              // const currentGameId = currentSearchParams.get("gameId");
              console.log("CurrentGameId => ", currentGameId)
              const desiredGameId = res.gameDetails.gameId;
  
              // Check if the user is already on the correct route
              if (currentGameId !== desiredGameId) {
                // If not on the correct route, open a new window with the correct path
                // router.push(`/play-poker/?gameId=${desiredGameId}`);
                navigation.navigate('playPoker', { gameId: desiredGameId})
              } else {
                toast.success("Successfully joined the game!");
              }
            } else {
              if (res.action === "joinGame" && res.statusCode !== 200) {
                toast.dismiss();
                toast.error(res.message);
              }
              console.log("Failed to join game.", res);
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    );
  
    useEffect(() => {
      return () => {
        s_span.info("Closing");
        getWebSocket()?.close();
      };
    }, []);
  
    const form = useForm<z.infer<typeof JoinGameSchema>>({
      resolver: zodResolver(JoinGameSchema),
      defaultValues: {
        gameId: defaultGameId ?? "",
        buyIn: 50,
      },
    });

      const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(JoinGameSchema),
        defaultValues: {
          gameId: defaultGameId ?? "",
          buyIn: 50,
        },
      });
    
  
    const onSubmit = async (values: z.infer<typeof JoinGameSchema>) => {
      console.log("Close Dialogsssss")
      if (seatPosition === 10) {
        closeDialog();
        navigation.navigate(`playPoker`, { gameId: values.gameId})
        // router.push(`/play-poker/?gameId=${values.gameId}`);
        return;
      }
      values.buyIn = values.buyIn * 100;
      const userChipsCents = user.chips * 100;
  
      if (values.buyIn > userChipsCents) {
        toast.error(
          `You do not have enough chips. You currently have ${centsToDollars(userChipsCents)} chips on your account.`,
        );
        return;
      }
  
      toast.loading("Confirming your location...");
      // // Perform Radar location verification
      // const result = await verifyLocation(user.id);
      // const { success, token } = result;
  
      // Ignored temporaily for the developement, Aziz
      // if (!success) {
      //   toast.dismiss();
      //   toast.error(
      //       `Location check failed. Try again or visit the list of allowed states.`
      //   );
      //   return;
      // }
  
      toast.dismiss();
      toast.success("Location confirmed!");
  
      // Convert token to a string if needed
      // const radarTokenString = token ? token.toString() : "";
  
      const joinGameMessage: sendPokerAction = {
        action: "sendPokerAction",
        gameId: values.gameId,
        gameAction: "joinGame",
        buyIn: values.buyIn,
        raiseAmount: null,
        groups: userGroups,
        seatPosition: seatPosition,
        // radarToken: radarTokenString
        radarToken: ''
      };
      
      // Delay the JSON message by 1 second
      setTimeout(() => {
        sendJsonMessage(joinGameMessage);
        toast.loading("Joining game...");
      }, 1000);
    };
  
    return (
      <View>          
        <Text style={styles.subtitle}>Game ID</Text>         
        <Controller
          control={control}
          name="gameId"
          render={({ field }) => (
            <Input
              placeholder="#********"
              {...field}
              style={{borderRadius: 24, width: '100%'}}
            />
          )}
        />
        {errors.gameId && <Text style={styles.error}>{errors.gameId.message}</Text>}
        {
          seatPosition !== 10 &&
          <View>
            <Text style={styles.subtitle}>Buy In</Text>         
            <Controller
              control={control}
              name="buyIn"
              render={({ field }) => (
                <Input
                  placeholder="#********"
                  {...field}
                  keyboardType="numeric" // Set keyboard type to numeric
                  style={{borderRadius: 24, width: '100%'}}
                />
              )}
            />
            {errors.buyIn && <Text style={styles.error}>{errors.buyIn.message}</Text>}
          </View>
        }
        {/* <Button onPress={handleSubmit(onSubmit)} variant={'full'} 
          style={{width: 64}}
          textStyle={{color: 'white'}}
        >
          Join game
        </Button> */}
        <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30, }}>
          <Button
            variant="empty"
            style={{width: 128, height: 32}}
            textStyle={{color: 'white'}}
            onPress={handleSubmit(onSubmit)} 
          >
              
              Join Game
          </Button>
        </View>
      </View>
    );
  }
const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
})
  