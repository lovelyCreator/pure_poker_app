// import { handleResponse } from '@/lib/fetch'; // Adjust the import based on your file structure
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// import { env } from "@/env";
// import { Alert } from 'react-native';

// export default async function useLogin(username: string, password: string) {
//     try {
//       // const token = await AsyncStorage.getItem('PP_TOKEN');
//       const response = await fetch(`${env.NEXT_PUBLIC_AUTH_API_URL}/general/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // 'Authorization': `Bearer ${token}`
//           // Include any necessary authorization token here
//         },
//         body: JSON.stringify({
//           username,
//           password,
//         }),
//       });

//       Alert.alert(
//         "Error",
//         "You are not signed. Please try again."
//       )
//       handleResponse(response);
//       console.log(response.body)

//       // if (!response.ok) {
//       //   const res = (await response.json()) as { message: string };
//       //   throw new Error(res.message);
        
//       // }
//       return response; // Return the response or any data you want to handle
//     } catch (error) {
//     throw new Error(error instanceof Error ? error.message : 'An error occurred');
//   }
// };

import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/api'; // Adjust the import based on your file structure
import { handleResponse } from '@/lib/fetch'; // Adjust the import based on your file structure
import { env } from '@/env';
import { useNavigation } from '@react-navigation/native';
import { logger } from 'react-native-reanimated/lib/typescript/logger/logger';

export default async function useLogin() {
  const navigation = useNavigation();
  async function login(username: string, password: string) {
    try {
      // const response = await authApi.general.login.$post({
      //   json: {
      //     username,
      //     password,
      //   },
      // });
      const response = await fetch(`${env.NEXT_PUBLIC_AUTH_API_URL}/general/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authorization token here
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      handleResponse(response);
      if (!response.ok) {
        const res = (await response.json() as {message: string;});
        await Promise.reject(res.message);
      }
      else {
        console.log("Navigation to Home!")
        
      }
    } catch (error) {
      await Promise.reject(error);
    }
  }
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { username: string, password: string}) => {
      return login(data.username, data.password)
    }
  });
};

