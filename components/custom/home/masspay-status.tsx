import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth"; // Adjust the import path as necessary
import { authApi } from "@/api/api"; // Adjust the import path as necessary
import { toast } from "react-toastify"; // Adjust the import path as necessary
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary

const MassPayStatus: React.FC = () => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [activationLink, setActivationLink] = useState(user.massPayActivationUrl);
  const [massPayCreated, setMassPayCreated] = useState(!!user.massPayToken && user.massPayToken.length > 0);

  const handleCreateMassPayAccount = async () => {
    setLoading(true);
    toast.loading("Creating your Mass Pay account...");
    const res = await authApi.massPay.massPayRegistration.$post();

    if (res.ok) {
      const response = (await res.json() as { massPayActivationUrl: string; });
      toast.dismiss();
      toast.success("MassPay account created!");
      setLoading(false);
      setMassPayCreated(true);
      setActivationLink(response.massPayActivationUrl ?? "");
      if (response.massPayActivationUrl) {
        Linking.openURL(response.massPayActivationUrl);
      }
    } else {
      const response = (await res.json() as { message: string; });
      toast.dismiss();
      toast.error(response.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.background}>
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome, {user.username}! 🎉</Text>
          {user.clearApproval === "approved" && !massPayCreated && (
            <>
              <Text style={styles.approvalStatus}>
                Your KYC Approval Status:{" "}
                <Text style={styles.approvedText}>Approved!</Text>
              </Text>
              <Text style={styles.instructions}>
                Now, create a Mass Pay account to start depositing chips to your account.
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={handleCreateMassPayAccount}
                  disabled={loading}
                  style={styles.createAccountButton}
                >
                  <Image source={require('@/assets/home/icon/massPayIcon.png')} style={styles.icon} />
                  Create Mass Pay Account
                </Button>
                <TouchableOpacity
                  onPress={() => Linking.openURL("mailto:support@puregroup.media?subject=KYC Verification Help Needed&body=Hi Pure Poker Support,")}
                  style={styles.emailSupportButton}
                >
                  <Image source={require('@/assets/global/send.png')} style={styles.icon} />
                  Email Support
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* Uncomment the following section if you want to display the activation link */}
          {/* {user.clearApproval === "approved" && massPayCreated && (
            <>
              <Text style={styles.approvalStatus}>
                <Text style={styles.approvedText}>
                  Congratulations, your Mass Pay account was created! Now, activate it!
                </Text>
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(activationLink)}
                  style={styles.activateButton}
                >
                  <Image source={require('@/assets/home/icon/massPayIcon.png')} style={styles.icon} />
                  Activate Mass Pay Account
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL("mailto:support@puregroup.media?subject=KYC Verification Help Needed&body=Hi Pure Poker Support,")}
                  style={styles.emailSupportButton}
                >
                  <Image source={require('@/assets/global/send.png')} style={styles.icon} />
                  Email Support
                </TouchableOpacity>
              </View>
            </>
          )} */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  background: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: '#121212',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  approvalStatus: {
    fontSize: 18,
    color: '#D1D5DB', // gray-300
    marginBottom: 8,
  },
  approvedText: {
    fontSize: 20,
    color: '#48BB78', // green-500
  },
  instructions: {
    fontSize: 16,
    color: '#9CA3AF', // gray-400
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  createAccountButton: {
    backgroundColor: '#3D4041',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: 328,
    justifyContent: 'center',
  },
  emailSupportButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: 328,
    justifyContent: 'center',
    marginTop: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

export default MassPayStatus;
