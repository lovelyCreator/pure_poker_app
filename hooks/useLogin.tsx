import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/api'; // Adjust the import based on your file structure
import { handleResponse } from '@/lib/fetch'; // Adjust the import based on your file structure

const NEXT_PUBLIC_AUTH_API_URL = 'https://905ok7ze53.execute-api.us-east-1.amazonaws.com/prod'
export default async function useLogin(username: string, password: string) {
    try {
      // const response = await authApi.general.login.$post({
      //   json: {
      //     username,
      //     password,
      //   },
      // });
      const response = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/general/login`, {
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
        const res = (await response.json()) as { message: string };
        throw new Error(res.message);
      }
      
      return response; // Return the response or any data you want to handle
    } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred');
  }
};
