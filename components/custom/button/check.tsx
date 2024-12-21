import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Text, StyleSheet } from "react-native";


const Check = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Button
      variant="check"
      {...props}
      ref={ref}
      style={styles.button}
    >
      {/* <Image src={check as StaticImport} alt="check" className="mr-2" /> */}
      <Text style={styles.title}
      >
        Check
      </Text>
    </Button>
  );
});

Check.displayName = "Check";

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 100,
    borderRadius: 15,
    backgroundColor: '#FFD000', // Change to your preferred color
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
    color: '#998220', // Text color
  },
});
export default Check;
