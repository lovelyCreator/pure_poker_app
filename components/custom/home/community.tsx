import React, { useRef, useState } from 'react';
import { View, ScrollView, Alert, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; // Adjust the path as necessary
import { useAuth } from '@/hooks/useAuth'; // Adjust import paths as necessary
import useCommunityPosts from '@/hooks/useCommunityPosts';
import usePostCommunityMessage from '@/hooks/usePostCommunityMessage';
import useLikePost, { useDislikePost } from '@/hooks/useLikePost';
import { useDeletePost } from '@/hooks/useDeletePost';
import { toast } from 'sonner'; // Adjust if needed
import { ago } from '@/lib/date'; // Adjust import paths as necessary
import { generateRandomProfilePicture } from '@/utils/generalUtils'; // Import the function
import { HeartIcon } from 'lucide-react'; // Import the HeartIcon
import { useLogger } from '@/utils/logging';

const Community: React.FC = () => {
  const span = useLogger();
  const {user} = useAuth();
  const deleteMutation = useDeletePost();
  const messageRef = useRef<TextInput>(null);
  const [charCount, setCharCount] = useState(0);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useCommunityPosts();
  const postMutation = usePostCommunityMessage();
  const likeMutation = useLikePost();
  const dislikeMutation = useDislikePost();
  let posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const handlePost = async () => {
    const message = messageRef.current?.value;
    if (!message || message.length > 200) {
      Alert.alert("Error", "Message exceeds the 200-character limit.");
      return;
    }

    toast.promise(
        async () =>
          postMutation.mutate(
            { message },
            {
              //eslint-disable-next-line
              onSuccess: async () => {
                messageRef.current!.value = "";
                setCharCount(0); // Reset character count after posting
                const data = await refetch();
                posts = data.data?.pages.flatMap((page) => page.posts) ?? [];
              },
              onError: () => {
                toast.error("Failed to post message");
              },
            },
          ),
        {
          loading: "Posting message...",
          success: "Message posted",
          error: "Failed to post message",
        },
      );
  };

  return (
    <Card style={styles.card}>
      <CardHeader style={styles.cardHeader}>
        <View style={{display: 'flex', alignItems:'center', justifyContent: 'space-between'}}>
            <Text style={styles.headerText}>Community</Text>
            <TouchableOpacity 
                onPress={() => {
                toast.promise(refetch, {
                    loading: "Refreshing...",
                    success: "Refreshed",
                    error: "Failed to refresh",
                });
                }}
            >
            <Image
                src={require('@/assets/community/refresh.jpg')}
                alt="refresh"
                className="h-5 w-5 cursor-pointer"
            />
            </TouchableOpacity>
        </View>
      </CardHeader>
      <ScrollView>
        <CardContent>
          {posts.map((item, index) => (
            <CommunityMessage
              key={index}
              sender={item.author.username}
              ago={ago(item.createdAt ?? new Date().toISOString())}
              profilePicture={item.author.profilePicture ??  "dog-purple"}
              content={item.content}
              likes={item.likesCount}
              isLiked={item.isLiked}
              like={() => {
                span.info("like", { id: item.id });
                likeMutation.mutate(item.id, {
                  onSuccess: () => {
                    toast.promise(refetch, {
                      error: "Failed to refresh",
                    });
                  },
                });
              }}
              dislike={() => {
                dislikeMutation.mutate(item.id, {
                  onSuccess: () => {
                    toast.promise(refetch, {
                      error: "Failed to refresh",
                    });
                  },
                });
              }}
              canDelete={item.author.username === user.username}
              deletePost={() => {
                deleteMutation.mutate(item.id, {
                  onSuccess: () => {
                    toast.promise(refetch, {
                      loading: "Refreshing...",
                      success: "Post deleted",
                      error: "Failed to refresh",
                    });
                  },
                  onError: () => {
                    toast.error("Failed to delete post");
                  },
                });
              }}
            />
          ))}
        </CardContent>
        {isFetchingNextPage ? (
          <View style={{display: 'flex', justifyContent: 'center', paddingVertical: 16}}>
            <Image src={require('@/assets/community/1.png')} />
          </View>
        ) : hasNextPage ? (
          <View style={{display: 'flex', justifyContent: 'center', paddingVertical: 16}}>
            <Button
              variant={"full"}
              style={{height: 40, width: '100%',  maxWidth: 400, borderRadius: 20, borderWidth: 2, borderColor: '#45A1FF'}}
              textStyle={{fontSize: 14}}
              className="h-10 w-full max-w-xs rounded-[20px] border-2 border-[#45A1FF] text-sm"
              onPress={async () => {
                if (hasNextPage) {
                  await fetchNextPage();
                } else {
                  toast.info("No more posts to load");
                }
              }}
            >
              Load more posts
            </Button>
          </View>
        ) : (
          <View style={{display: 'flex', justifyContent: 'center', paddingVertical: 16}}>
            <Text style={{fontSize: 14}}> No more posts to load </Text>
          </View>
        )}
      </ScrollView>
      <CardFooter style={styles.cardFooter}>
        <View style={{position: 'relative', display: 'flex', width: '100%', alignItems: 'center'}}>
            <View style={{position: 'relative', marginRight: 8, width: '100%',}}>
                <Input
                    placeholder="Type your message..."
                    ref={messageRef}
                    style={{height: 40, width: '100%', borderRadius: 18, borderColor: '#6B6D75', paddingRight: 64}}
                    onChangeText={(text) => setCharCount(text.length)}
                />
                <Text style={[styles.charCount, charCount > 200 ? styles.errorText : null]}>
                    {charCount}/200
                </Text>
            </View>
        </View>
        <Button 
            variant='full'
            style={{height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#45A1FF'}}
            textStyle={{fontSize: 14}}
            onPress={handlePost}
        >Post</Button>
      </CardFooter>
    </Card>
  );
};

const styles = {
    card: {
        marginHorizontal: 'auto',
        marginTop: 12,
        display: 'flex',
        height: 800,
        maxHeight: '95%'
    },
    cardHeader: {
        borderRadiusTop: 20,
        borderBottomWidth: 1,
        borderColor: '#50535C',
        backgroundColor: '@212530B2',
        padding: 16,
    },
    headerText: {
        fontSize: 18,
        lineHeight: 27,
        color: '#B6B7BB',
        marginLeft: 4,
    },
    charCount: {
      position: 'absolute',
      right: 12, // right-3 (3 * 4px = 12px)
      top: '50%',
      transform: [{ translateY: -50 }], // -translate-y-1/2
      fontSize: 12, // text-xs (0.75rem or 12px)
      color: '#A0AEC0', // Default color (text-gray-400)
    },
    errorText: {
      color: '#F56565', // text-red-500
    },
    cardFooter: {
        height: 70,
        borderRadiusBotton: 20,
        backgroundColor: '#FFFFFF0D',
        padding: 12
    }
};

export default Community;
