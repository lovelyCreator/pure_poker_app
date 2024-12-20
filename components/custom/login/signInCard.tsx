import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Dimensions, Platform} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/ui/button';
import useLogin from '@/hooks/useLogin';

import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { Link, Stack } from 'expo-router';
import { PasswordInput } from '@/components/ui/password-input';
import { authApi } from '@/api/api';
import { useLogger } from '@/utils/logging';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Signin } from '@/api/auth';
import * as WebBrowser from 'expo-web-browser';
const { height } = Dimensions.get('window');
const calculatedHeight = height - 64; // 4rem = 64px

const adjustedHeight = Platform.OS === 'ios' ? calculatedHeight - 20 : calculatedHeight;

const SignInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function SignInCard() {
  const navigation = useNavigation();
  const logger = useLogger();

  // useEffect(() => {
  //   authApi.general.validate_token
  //     .$get(undefined)
  //     .then((res:any) => {
  //       if (res.ok) {
  //         navigation.navigate('/index');
  //       }
  //     })
  //     .catch((e: any) => {
  //       console.error(e);
  //     });
  // }, []);

  logger.info('Init');

  // const form = useForm<z.infer<typeof SignInSchema>>({
  //   resolver: zodResolver(SignInSchema),
  //   defaultValues: {
  //     username: '',
  //     password: '',
  //   },
  // });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    // console.log('signIn datas==========>',values);
    logger.info("Submitted", values);
    // console.log('logger-->', logger)
    const result = await useLogin(values.username, values.password);
    if (result.ok) {
      navigation.navigate('home');
    }
  }

  return (
    <View style={[styles.container, {height: adjustedHeight}]}>
      <Card style={styles.card}>
        <CardTitle style={styles.cardTitle}>
          <Text style={styles.title}>Sign In</Text>
        </CardTitle>
        <CardContent style={styles.cardContent}> 
          <Text style={styles.subtitle}>Email</Text>         
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <Input
                placeholder="jsmith@gmail.com"
                {...field}
                style={{borderRadius: 24, width: '100%'}}
              />
            )}
          />
          {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
          <Text style={styles.subtitle}>Password</Text>   
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                placeholder='At least minimum 8 characters'
                {...field}
                style={{borderRadius: 24}}
              />
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          <Text style={[styles.subtitle, {textAlign: 'right', marginBottom: 20}]}>Forgot Password?</Text>
          <Button onPress={handleSubmit(onSubmit)} variant={'full'} 
            style={{width: '100%'}}
            textStyle={{color: 'white'}}
          >
            Sign In
          </Button>
          <Text style={styles.signupText}>
            Don't have an account? 
          </Text> 
          <Text style={styles.signupLink} 
          onPress={async() => await WebBrowser.openBrowserAsync('https://www.purepokerworld.com')}
          > 
              Visit: purepoker.world
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  card: {
    borderRadius: 10, // rounded-lg
    borderWidth: 1, // border
    borderColor: '#414a60', // border color
    backgroundColor: 'rgba(44, 50, 65, 0.6)', // bg with opacity
    shadowColor: '#000', // shadow color
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // shadow opacity
    shadowRadius: 1.5, // shadow radius
    width: '95%', // w-256
    minWidth: 256,
    alignItems: 'center', // center content
    justifyContent: 'center', // center content
    padding: 16, // optional padding
  },
  cardTitle: {
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center'
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
    marginBottom: 10
  },
  cardContent: {
    minHeight: 40,
    width: '100%'
  },
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
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'white'
  },
  signupLink: {
    textAlign: 'center',
    color: '#1E84F0',
  },
});