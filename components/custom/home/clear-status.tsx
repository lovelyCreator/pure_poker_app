import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  ScrollView,
} from "react-native";
import { useAuth } from "@/hooks/useAuth"; // Ensure this hook is compatible with React Native
import { authApi } from "@/api/api"; // Ensure this API works in React Native
import { Button } from "@/components/ui/button"; // Adjust this import as needed
import { toast } from "react-toastify"; // Ensure this works in React Native

const ClearStatus: React.FC = () => {
  const user = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [clearLink, setClearLink] = useState<string>(user.clearVerificationLink);
  const [clearStatus, setClearStatus] = useState<string>(user.clearApproval);

  const handleGenerateNewLink = async () => {
    setLoading(true);
    toast.loading("Generating a new link...");
    const res = await authApi.clear.generateVerificationLink.$post();
    if (res.ok) {
      const response = await res.json();
      toast.dismiss();
      toast.success("New link generated!");
      setLoading(false);
      setClearStatus("pending");
      setClearLink(response.clearVerificationLink);
    } else {
      toast.dismiss();
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.welcomeText}>Welcome, {user.username}! 🎉</Text>
          {clearStatus === "pending" && (
            <>
              <Text style={styles.statusText}>
                Your KYC Approval Status:{" "}
                <Text style={styles.pendingText}>Pending</Text>
              </Text>
              <Text style={styles.infoText}>
                To access all the features, please verify your identity with
                CLEAR by clicking on the link below.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(clearLink)}
                  style={styles.verifyButton}
                >
                  <Image
                    source={require('@/assets/clear_logo.png')} // Adjust the path as needed
                    style={styles.logo}
                  />
                  <Text style={styles.buttonText}>Verify with CLEAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL('mailto:support@puregroup.media?subject=KYC Verification Help Needed&body=Hi Pure Poker Support,')}
                  style={styles.emailButton}
                >
                  <Image
                    source={require('@/assets/global/send.png')} // Adjust the path as needed
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Email Support</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {clearStatus === "rejected" && (
            <>
              <Text style={styles.statusText}>
                Your KYC Approval Status:{" "}
                <Text style={styles.rejectedText}>Rejected</Text>
              </Text>
              <Text style={styles.infoText}>
                Unfortunately, your identity verification was not approved. Please contact our support team for further assistance.
              </Text>
              <Text style={styles.additionalInfo}>
                Don't worry! You can still use the following features: Community, Groups, and Spectate Poker!
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('mailto:support@puregroup.media?subject=CLEAR Verification Issue&body=Hi Pure Poker Support, I\'m having an issue with my CLEAR verification.')}
                style={styles.contactButton}
              >
                <Image
                  source={require('@/assets/global/send.png')} // Adjust the path as needed
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Contact Support</Text>
              </TouchableOpacity>
            </>
          )}
          {clearStatus === "canceled" && (
            <>
              <Text style={styles.statusText}>
                Your KYC Approval Status:{" "}
                <Text style={styles.canceledText}>Canceled</Text>
              </Text>
              <Text style={styles.infoText}>
                Your verification has been canceled. You can generate a new verification link by clicking below.
              </Text>
              <Button
                onPress={handleGenerateNewLink}
                disabled={loading}
                style={styles.generateButton}
              >
                {loading ? "Generating..." : "Generate a new link"}
            </Button>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: '#121212',
    padding: 20,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statusText: {
    marginBottom: 12,
    fontSize: 18,
    color: 'white',
  },
  pendingText: {
    fontSize: 20,
    color: '#FFD700', // Yellow color
  },
  rejectedText: {
    fontSize: 20,
    color: 'red',
  },
  canceledText: {
    fontSize: 20,
    color: 'gray',
  },
  infoText: {
    marginBottom: 12,
    fontSize: 16,
    color: 'lightgray',
    textAlign: 'center',
  },
  additionalInfo: {
    marginBottom: 12,
    fontSize: 14,
    color: 'lightgray',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  verifyButton: {
    flex: 1,
    backgroundColor: '#041955',
    borderRadius: 30,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  emailButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  contactButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: 'linear-gradient(180deg, #F19595 0%, #F43E3E 100%)',
    borderRadius: 30,
    paddingVertical: 12,
    marginTop: 20,
  },
});

export default ClearStatus;
