import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { View, Text, StyleSheet } from 'react-native';

function CommunityError({
    error,
    reset,
}: {
    error: Error & { digest ?: string};
    reset: () => void;
}) {
    return (
        <Card style={{marginLeft: 16, marginTop: 20, width: '33.3333%'}}>
            <CardHeader style={{borderBottomWidth: 2, borderColor: '#4B5563', backgroundColor: '#212530B2'}}>
                <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>Community</Text>
            </CardHeader>
            <View style={{display: 'flex', height: 128, flexDirection: 'column',justifyContent: 'center', borderRadius: 6}}>
                <CardContent style={{display: 'flex', minHeight: 40, flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                        {error.name}
                        {error.digest ? `(${error.digest})` : ""} : {" "}
                        {error.message || "An error occured"}
                    </Text>
                    <Button onPress={reset} style={{marginTop: 20}} variant={"call"}>
                        Retry
                    </Button>
                </CardContent>
            </View>
            <CardFooter style={{display: 'flex', minHeight: 20, backgroundColor: '#FFFFFF0D', paddingLeft: 12, paddingRight: 12 }}>
                <Skeleton style={{marginVertical: 'auto', marginRight: 8, height: 48, width: '75%', borderRadius: '50%'}} />
                <Skeleton style={{marginVertical: 'auto', height: 48, width: '25%', borderRadius: '50%'}} />
            </CardFooter>
        </Card>
    )
}
export default CommunityError;