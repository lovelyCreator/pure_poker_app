import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

const NEXT_PUBLIC_RADAR_TOKEN="prj_test_pk_cf656bda4d701461dc853a8d2cfadd1cb4884553"
const NEXT_PUBLIC_AUTH_API_URL="https://905ok7ze53.execute-api.us-east-1.amazonaws.com/prod"

export const Signin = async (values: any) => {
    try {
      console.log(values);
      const response = await axios.post(`${NEXT_PUBLIC_AUTH_API_URL}/general/login`, values, 
        );
      console.log('ewrw', response.data);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error(error)    
      // return {error: error.response.data};
    }
  }
