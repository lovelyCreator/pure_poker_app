import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Text, StyleSheet } from "react-native";

const Fold = forwardRef<HTMLButtonElement, ButtonProps>((props , ref) => {
  return (
    <Button
      variant="fold"
      {...props}
      ref={ref}
      style={styles.button}
    >
      {/* <Image src={fold as StaticImport} alt="fold" className="mr-2 w-[24px] h-[24px]" /> */}
      <Text 
        style={styles.title}
      >
        Fold
      </Text>
    </Button>
  );
});

Fold.displayName = "Fold";

const styles = StyleSheet.create({
    button: {
      height: 50,
      width: 100,
      borderRadius: 15,
      backgroundColor: '#EC274F', // Change to your preferred color
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3, // For Android shadow
      shadowColor: '#000', // For iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16, // Adjust size as needed
      color: '#76182B', // Text color
    },
  });
export default Fold;
