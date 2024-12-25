import React, { useEffect, useState, useRef, useContext } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useWebSocket from "react-use-websocket";

import type { createGame } from "@/types/poker";
import { useAuth } from "@/hooks/useAuth";

import Toast from 'react-native-toast-message';
import { toast } from "react-toastify";

import { getPokerUrl } from "@/lib/poker";
import useUserGroups from "@/hooks/useUserGroups";
import { View, Image, StyleSheet, Text } from 'react-native';
import { useSpan } from "@/utils/logging";
import { centsToDollars } from "@/utils/magnitudeConversion";
import type { PokerActionsFrontend } from "@/types/pokerFrontend.";
import assert from "assert";
import { useNavigation } from "@react-navigation/native";
import { verifyLocation } from "@/lib/radar";
import { Picker } from '@react-native-picker/picker';
import { DialogContext } from "@/components/ui/dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateGameSchema = z
  .object({
    bigBlind: z.coerce
      .number()
      .min(0.1, { message: "Big blind must be at least 2" })
      .max(10, { message: "Big blind cannot be more than 10" }),
    maxPlayers: z.coerce
      .number()
      .min(2, { message: "Max players must be at least 2" })
      .max(9, { message: "Max Players must be less than 9" }),
    buyIn: z.coerce.number(),
    groupSelection: z.string().min(1, { message: "Please select a group" }),
    minNumberOfPlayers: z.number().min(2).default(2),
  })
  .refine(
    (data) => {
      const minBuyIn = data.bigBlind * 50;
      const maxBuyIn = data.bigBlind * 250;
      return data.buyIn >= minBuyIn && data.buyIn <= maxBuyIn;
    },
    {
      message: "Buy-In must be between 50 and 250 times the Big Blind",
      path: ["buyIn"], // This specifies that the error message should be associated with the buyIn field
    },
  );   

  export function CreateGameDialog( ) {
    const span = useSpan("CreateGameDialog");
    const navigation = useNavigation();
  
    span.info("Attempting to useAuth");
    const user = useAuth();
    const userId = user.id;
    const context = useContext(DialogContext);
    if (!context) throw new Error('DialogTrigger must be used within a DialogProvider');
    const { closeDialog } = context;  
    
    const userChips = user.chips * 100;
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(CreateGameSchema),
        defaultValues: {
            bigBlind: 0.1,
            maxPlayers: 2,
            buyIn: 10,
            groupSelection: "Network (all your groups)", // Default value for group selection
        },
    });
  
    const s_span = span.span("webSocket");
    //eslint-disable-next-line
    const wsRef = useRef<any>(null);
    const { sendJsonMessage, getWebSocket } = useWebSocket(
      getPokerUrl(span, "", user.username),
      {
        share: true,
        onOpen: async () => {
          wsRef.current = getWebSocket();
          const token = await AsyncStorage.getItem("PP_TOKEN");
          
          if (token) {
            sendJsonMessage({
              action: "authenticate",
              token: token,
            });
            console.log('message sent successfully')
          } else {
            console.error('Token not found');
            // Handle missing token case (e.g., show an error message)
          }
        },
        onMessage: (eventString) => {
          try {
            const res = JSON.parse(eventString.data) as PokerActionsFrontend;

            
            if (res.action === "createGame") {
              if (res.statusCode === 200) {
                toast.dismiss();
                toast.success("Game created successfully!");

                const g_span = s_span.span("success", res);
                g_span.info("Adjusting path to corresponding gameId.");
                navigation.navigate('playPoker', {gameId: res.gameId});
                closeDialog();
              } else if (res.statusCode === 401) {
                // Handle authentication failure
                toast.dismiss();
                toast.error("Please Try Again now.");
                console.log("You are not authenticated")
                // Optional: Retry authentication
                // setTimeout(() => {
                //   authenticate(); // Call authenticate function to retry
                // }, 5000); // Retry after 5 seconds
              }
            }
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        },
      },
    );

    useEffect(() => {
      return () => {
        s_span.info("Forcefully closing...");
        //eslint-disable-next-line
        wsRef.current?.close();
      };
    }, []);
  
    const groupsQuery = useUserGroups(); // Fetch the groups the user is part of
    const [groupOptions, setGroupOptions] = useState<
      { groupName: string; groupId: string }[]
    >([]);
  
    useEffect(() => {
      if (groupsQuery.data) {
        const groupsWithIds = groupsQuery.data.map((group) => ({
          groupName: group.groupName,
          groupId: group.groupId,
        }));
        setGroupOptions([
          ...groupsWithIds,
          { groupName: "Network (all your groups)", groupId: "network" },
        ]);
      }
    }, [groupsQuery.data]);
  
    async function onSubmit(values: z.infer<typeof CreateGameSchema>) {
      values.buyIn = values.buyIn * 100;
      values.bigBlind = values.bigBlind * 100;
  
      if (values.buyIn > userChips) {
        toast.error(
          `You do not have enough chips. You currently have ${centsToDollars(userChips)} chips on your account.`,
        );
        return;
      }
  
      const selectedGroups =
        values.groupSelection === "Network (all your groups)"
          ? groupsQuery.data?.map((group) => group.groupId) || []
          : groupOptions
              .filter((group) => group.groupName === values.groupSelection)
              .map((group) => group.groupId);
  
      try {
        
        toast.loading("Confirming your location...");
        //Perform Radar location verification
        // const result = await verifyLocation(userId);
        // const { success, token, expiresIn } = result;
  
        // Ignored temporarily for the development
        // if (!success) {
        //   Toast.hide();
        //   Toast.error(
        //       `Location check failed. Try again or visit the list of allowed states.`
        //   );
        //   return;
        // }
  
        // Convert token to a string if needed
        // const radarTokenString = token ? token.toString() : "";
        // const radarTokenString = '';
  
        const createGame: createGame = {
          action: "createGame",
          bigBlind: values.bigBlind,
          maxNumberOfPlayers: values.maxPlayers,
          buyIn: values.buyIn,
          minNumberOfPlayers: values.minNumberOfPlayers,
          groups: selectedGroups,
          // radarToken: radarTokenString
          radarToken: ''
        };         
        // Delay the JSON message by 1.5 seconds
        setTimeout(() => {
          sendJsonMessage(createGame);
          toast.loading("Creating game...");
        }, 1500);
      } catch (error) {
        console.error("Radar location verification failed:", error);
        toast.error("An error occurred while verifying your location. Please try again.");

      }
    }
    return (
        <View>
            <View style={{display: 'flex'}}>
                <Text style={styles.subtitle}>Big Blind</Text>         
                <Controller
                    control={control}
                    name="bigBlind"
                    render={({ field }) => (
                    <Input
                        {...field}
                        keyboardType="numeric"
                        style={{borderRadius: 24, width: '100%'}}
                    />
                    )}
                />
                {errors.bigBlind && <Text style={styles.error}>{errors.bigBlind.message}</Text>}
                    
                <Text style={styles.subtitle}>Maximum players</Text>         
                <Controller
                    control={control}
                    name="maxPlayers"
                    render={({ field }) => (
                    <Input
                        {...field}
                        keyboardType="numeric"
                        style={{borderRadius: 24, width: '100%'}}
                    />
                    )}
                />
                {errors.maxPlayers && <Text style={styles.error}>{errors.maxPlayers.message}</Text>}
                     
                <Text style={styles.subtitle}>Buy In</Text>         
                <Controller
                    control={control}
                    name="buyIn"
                    render={({ field }) => (
                    <Input
                        {...field}
                        keyboardType="numeric"
                        style={{borderRadius: 24, width: '100%'}}
                    />
                    )}
                />
                {errors.buyIn && <Text style={styles.error}>{errors.buyIn.message}</Text>}
            </View>     
            <Text style={styles.subtitle}>Select Group</Text>         
            <Controller
                control={control}
                name="groupSelection"
                render={({ field }) => (
                    <View style={{position: 'relative'}}>
                        <Picker
                        {...field}
                        style={styles.picker}
                        dropdownIconColor="white" 
                        >
                        {groupOptions.map((group) => (
                            <Picker.Item key={group.groupId} label={group.groupName} value={group.groupName} />
                        ))}
                        </Picker>
                        {/* <Image
                          source={require("@/assets/menu-bar/expand.png")} 
                          style={styles.icon}
                        /> */}

                    </View>
                )}
            />
            {errors.groupSelection && <Text style={styles.error}>{errors.groupSelection.message}</Text>}
            
          <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30, }}>
              <Button
                  variant="empty"
                  style={{width: 128, height: 32}}
                  textStyle={{color: 'white'}}
                  onPress={handleSubmit(onSubmit)} 
              >
                  
                  Create Game
              </Button>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    subtitle: {
      fontSize: 14,
      color: '#9ca3af',
      opacity:  0.7
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
    picker: {
      height: 50,
      width: '100%',
      backgroundColor: '#333',
      color: 'white',
      borderColor: '#ffffff4',
      borderWidth: 2,
      borderRadius: 5,
    },
    icon: {
      position: 'absolute',
      right: 10,
      top: 10,
      height: 20,
      width: 20,
      tintColor: 'white', // Customize icon color
    },
  });