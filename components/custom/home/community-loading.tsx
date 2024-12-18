import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
    const nb_empty_messages =7;
    return (
        <Card style={{ marginLeft: 16, marginTop: 20, width: '96%', backgroundColor: '#212530B2'}}>
            <CardHeader style={styles.cardHeader}>
                <Text style={styles.title}>
                    Community
                </Text>
            </CardHeader>
            <ScrollArea style={{height: 512, borderRadius: 6}}>
                <CardContent style={{minHeight: 160}}>
                    {
                        [...Array<never>(nb_empty_messages)].map((_: never, index) => (
                            <CommunityMessageLoading key={index} />
                        ))
                    }
                </CardContent>
            </ScrollArea>
            <CardFooter style={{display: 'flex', minHeight: 20, backgroundColor: '#FFFFFF0D', paddingLeft: 12, paddingRight: 12 }}>
                <Skeleton style={{marginVertical: 'auto', marginRight: 8, height: 48, width: '75%', borderRadius: '50%'}} />
                <Skeleton style={{marginVertical: 'auto', height: 48, width: '25%', borderRadius: '50%'}} />
            </CardFooter>
        </Card>
    )
}

function CommunityMessageLoading() {
    return (
        <View style={styles.messageContainer}>
          <View style={styles.messageHeader}>
            <Skeleton style={styles.avatarSkeleton} />
            <Text style={styles.username}>
              <Skeleton style={styles.usernameSkeleton} />
            </Text>
            <Text style={styles.timestamp}>
              <Skeleton style={styles.timestampSkeleton} />
            </Text>
            <View style={styles.iconContainer}>
              <Skeleton style={styles.iconSkeleton} />
              <Skeleton style={styles.iconSkeleton} />
            </View>
          </View>
          <Skeleton style={styles.messageTextSkeleton} />
          <Skeleton style={styles.messageTextSkeleton} />
        </View>
    )
}

const styles = StyleSheet.create({
    cardHeader: {
        borderBottomWidth: 2,
        borderColor: '#4B5563',
        backgroundColor: '#212530B2'
    },
    title: {
        fontSize: 18,
        lineHeight: 27,
        fontWeight: 'bold',
        color: 'white'
    },
    messageContainer: {
      borderBottomWidth: 2,
      borderColor: '#4B5563',
      backgroundColor: '#212530B2',
      padding: 16,
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    avatarSkeleton: {
      height: 24,
      width: 24,
      borderRadius: 12,
    },
    username: {
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    usernameSkeleton: {
      height: 24,
      width: 80,
    },
    timestamp: {
      color: '#FFFFFF',
      opacity: 0.75,
    },
    timestampSkeleton: {
      height: 24,
      width: 80,
    },
    iconContainer: {
      flexDirection: 'row',
      marginLeft: 10,
    },
    iconSkeleton: {
      height: 24,
      width: 24,
      marginRight: 4,
    },
    messageTextSkeleton: {
      height: 24,
      width: '100%',
      marginBottom: 8,
    },
})