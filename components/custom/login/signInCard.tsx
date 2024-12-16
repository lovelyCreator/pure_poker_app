import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

const SignInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function SignInScreen() {
  const navigation = useNavigation();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    // Simulate a login process
    try {
      console.log('Submitted:', data);
      // Here you would typically call your login API
      Alert.alert('Login successful', `Welcome, ${data.username}!`);
    //   navigation.navigate('Home'); // Navigate to Home screen on success
    } catch (error) {
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="YourUsername"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="*******"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button title="Sign in" onPress={handleSubmit(onSubmit)} />
      <Text style={styles.signupText}>
        Don't have an account? 
        <Text style={styles.signupLink} 
        // onPress={() => navigation.navigate('SignUp')}
        > 
            Visit: purepoker.world
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
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
  },
  signupLink: {
    color: 'blue',
  },
});