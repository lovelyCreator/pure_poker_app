import Radar from 'radar-sdk-js';
import { env } from "../env"

export async function verifyLocation(userId: string, skipVerifyApp = true) {
    Radar.initialize(env.NEXT_PUBLIC_RADAR_TOKEN, {
        logLevel: 'info', // Set to "error" in production
        locationTimeout: 30000,
        desiredAccuracy: 'high',
    });
    Radar.setUserId(userId);
    try {
        const result = await Radar.trackVerified({ skipVerifyApp });
        const { passed, token, expiresIn, user } = result;

        if (passed) {
            console.log('Location verified:', user);
            return { success: true, token, expiresIn };
        } else {
            console.error('Location verification failed:', result.failureReasons);
            return { success: false, reasons: result.failureReasons };
        }
    } catch (error) {
        console.error('Location verification error:', error);
        return { success: false, error };
    }
}