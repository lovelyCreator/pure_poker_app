// import { refreshToken } from "@/lib/fetch";
// import type { GameState } from "@/types/poker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { env } from "@/env";
// import { useNavigation } from "@react-navigation/native";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// export default function useGameState(gameId: string) {
//   async function INNER_getGameState(
//     gameId: string,
//   ): Promise<[GameState | null, boolean]> {
//     const token = await AsyncStorage.getItem('PP_TOKEN')
//     // const res = await pokerApi.poker.$get({ query: { gameId } });
//     const url = `${env.NEXT_PUBLIC_POKER_URL}${"poker"}?gameId=${gameId}`;
//     console.log("url============", url)
//     const res = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//         // Add any other headers if needed, e.g., Authorization
//       },
//     });
//     if (res.ok) {
//       return [await res.json(), false];
//     }
//     if (res.status === 401) {
//       return [null, true];
//     }
//     if (res.status === 404) {
//       console.log("===============>")
//       // navigation.navigate('404');
//       return [null, true];
//     }
//     if (!res.ok) {
//       const error = await res.json();
//       if ("message" in error) {
//         // eslint-disable-next-line
//         throw new Error(error.message);
//       } else {
//         throw new Error("An unknown error occurred");
//       }
//     }
//     return [null, false]; // Default return to satisfy TypeScript
//   }
//   // async function getGameState(gameId: string): Promise<GameState | null> {
//   //   console.log("GameState from GetGameState")
//   //   let [res, isUnauthorized] = await INNER_getGameState(gameId);
//   //   if (isUnauthorized) {
//   //     await refreshToken();
//   //     [res, isUnauthorized] = await INNER_getGameState(gameId);
//   //     if (!isUnauthorized) {
//   //       window.location.reload();
//   //     }
//   //   }
//   //   return res;
//   // }
//   async function getGameState(gameId: string): Promise<GameState | null> {
//     console.log("GameState from GetGameState");
//     let [res, isUnauthorized] = await INNER_getGameState(gameId);
    
//     if (isUnauthorized) {
//         await refreshToken();
//         [res, isUnauthorized] = await INNER_getGameState(gameId);
        
//         if (isUnauthorized) {
//             // Handle unauthorized access, e.g., show an alert or navigate to a login screen
//             toast.warning("Session expired. Please log in again.");
//             return null; // or handle accordingly
//         }
//     }
    
//     return res;
// }

//   return useSuspenseQuery({
//     queryKey: ["getGameState", gameId],
//     queryFn: () => getGameState(gameId),
//     staleTime: 1,
//   });
// }


import { refreshToken } from "@/lib/fetch";
import type { GameState } from "@/types/poker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "@/env";
import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Alert } from 'react-native';
import { toast } from "react-toastify"; // Use this only if you have a way to show toast notifications in React Native

export default function useGameState(gameId: string) {
  console.log("<--------------useGameState------------->")
  const navigation = useNavigation(); // Get navigation object

  async function INNER_getGameState(gameId: string): Promise<[GameState | null, boolean]> {
    const token = await AsyncStorage.getItem('PP_TOKEN');
    const url = `${env.NEXT_PUBLIC_POKER_URL}poker?gameId=${gameId}`;
    console.log("url============", url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return [await res.json(), false];
    }
    if (res.status === 401) {
      return [null, true];
    }
    if (res.status === 404) {
      console.log("===============>");
      // navigation.navigate('notFound', { gameId }); // Navigate to a 404 screen if needed
      return [null, false];
    }
    if (!res.ok) {
      const error = await res.json();
      if ("message" in error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
    return [null, false]; // Default return to satisfy TypeScript
  }

  async function getGameState(gameId: string): Promise<GameState | null> {
    console.log("GameState from GetGameState");
    let [res, isUnauthorized] = await INNER_getGameState(gameId);
    
    if (isUnauthorized) {
      await refreshToken();
      // [res, isUnauthorized] = await INNER_getGameState(gameId);
      
      if (isUnauthorized) {
        // Handle unauthorized access, e.g., show an alert
        Alert.alert("Session expired", "Please log in again.", [
          { text: "OK", onPress: () => navigation.navigate('Login') } // Navigate to the login screen
        ]);
        return null; // or handle accordingly
      }
    }
    
    return res;
  }

  return useSuspenseQuery({
    queryKey: ["getGameState", gameId],
    queryFn: () => getGameState(gameId),
    staleTime: 1,
  });
}