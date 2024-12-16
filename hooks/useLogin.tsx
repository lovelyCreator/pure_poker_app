import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/api'; // Adjust the import based on your file structure
import { handleResponse } from '@/lib/fetch'; // Adjust the import based on your file structure

export default function useLogin() {
  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.general.login.$post({
        json: {
          username,
          password,
        },
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

  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: { username: string; password: string }) => {
      return login(data.username, data.password);
    },
  });
}
