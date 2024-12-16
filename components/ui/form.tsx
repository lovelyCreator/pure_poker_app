import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './label'; // Adjust the import based on your file structure
import { Toaster } from './sonner'; // Adjust the import based on your file structure

const Form = ({ children } : {children: any}) => {
  return <>{children}</>;
};

const FormFieldContext = React.createContext({});

const FormField = ({ name, control, render }: {name: any, control: any, render: any}) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller control={control} name={name} render={render} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  return {
    name: fieldContext.name,
    ...fieldState,
  };
};

const FormItemContext = React.createContext({});

const FormItem = React.forwardRef(({ style, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View ref={ref} style={[styles.formItem, style]} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ style, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <Label
      ref={ref}
      style={[error && styles.errorLabel, style]}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ style, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <View
      ref={ref}
      style={style}
      accessibilityLabel={error ? "Error" : "Input"}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <Text
      ref={ref}
      style={[styles.description, style]}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(({ style, children, ...props }, ref) => {
  const { error } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <Text
      ref={ref}
      style={[styles.message, style]}
      {...props}
    >
      {body}
    </Text>
  );
});
FormMessage.displayName = "FormMessage";

const styles = StyleSheet.create({
  formItem: {
    marginBottom: 10,
  },
  errorLabel: {
    color: 'red', // Error label color
  },
  description: {
    fontSize: 12,
    color: 'gray', // Description text color
  },
  message: {
    fontSize: 14,
    color: 'red', // Error message color
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
