import { Linking } from 'react-native';
import { getScreenSize } from "@/lib/poker"; // Assuming this function remains the same

export async function openUrlNewTab(url: string) {
  const screenSize = getScreenSize();

  // React Native doesn't have the concept of tabs in the same way a browser does.
  //  We'll open the URL in the system's default browser.

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true; // Indicate success
    } else {
      console.error("Don't know how to open URI: " + url);
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Error opening URL:", error);
    return false; // Indicate failure
  }
}
