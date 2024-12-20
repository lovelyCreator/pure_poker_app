import { StyleSheet, Image, View, Text, Animated, ScrollView, TouchableOpacity, Pressable } from 'react-native';

import React, { lazy, Suspense, useState,  useRef } from 'react';
import CreateOrJoinGame from '@/components/custom/dialog/CreateOrJoinGame';
import Welcome from '@/components/custom/home/welcome';
import CardGradient from '@/components/custom/home/card-gradiant';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import ErrorBoundary from '@/components/custom/ErrorBondary';
import CommunityError from '@/components/custom/home/community-error';
import ClearStatus from '@/components/custom/home/clear-status';
import { useSpan, SpanWrapper, Instrument } from '@/utils/logging';
import { JoinGameDialog } from '@/components/custom/dialog/JoinGame';
import CommunityLoading from "@/components/custom/home/community-loading";
import AvailableGamesHome from '@/components/custom/home/available-games';
import useUserGroups from '@/hooks/useUserGroups';
import useAvailableGames from '@/hooks/useUserAvailableGames';
import SeeAllGames from '@/components/custom/home/see-all-games';
import MassPayStatus from '@/components/custom/home/masspay-status';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';

// const SignInCard = lazy(() => import('"@/components/custom/login/signInCard'));

export default function Home() {
  const span = useSpan('displayHomePage');
  const navigation = useNavigation();
  span.info('Initializing')

  const user = useAuth();
  // console.log('Auth---->', user)
  const userIsVerified = user.clearApproval === "approved";
  // const userIsVerified = true;
  // const availableGames = [true, true, false];
  const massPayAccountCreated = user.massPayToken;
  span.info('Provided User', user);
  const groupsQuery = useUserGroups();
  const groupIds = groupsQuery.data?.map((group) => group.groupId) || [];
  const { data: availableGames} = useAvailableGames(groupIds, user.id);

  const [showAllGames, setShowAllGames] = useState(false);
  const handleSeeAllClick = () => {
    setShowAllGames(true);
  }

  const handleSeeLessClick = () => {
    setShowAllGames(false);
  }

  // const renderContent = () => (
  //   <>
  //     {!userIsVerified && (
  //       <View style={{marginTop: 0}}>
  //         <ClearStatus />
  //       </View>
  //     )}
  //     {userIsVerified && !massPayAccountCreated && (
  //       <View style={{marginTop: 0}}> 
  //         <MassPayStatus />
  //       </View>
  //     )}
  //     {userIsVerified && massPayAccountCreated && (
  //       <View style={{marginTop: 0}}>
  //         <Welcome />
  //       </View>
  //     )}
  //     <View style={{marginTop: 16, display: 'flex', flexDirection: 'column',}}>
  //       <CardGradient
  //         gradient="purple"
  //         style={[
  //           styles.gradient,
  //           !userIsVerified && styles.disabled
  //         ]}
  //       >
  //         <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}>
  //         <Image source={require('@/assets/home/icon/plus.png')}
  //           alt='Create Game'
  //           style={{cursor: 'pointer'}}
  //         />
  //         </CreateOrJoinGame>
  //         <Text style={styles.subTitle}>Create New Game</Text>
  //         <Text style={styles.content}>
  //           Customize Your Poker Experience
  //         </Text>
  //       </CardGradient>
  //       <CardGradient
  //         gradient="blue"
  //         style={[
  //           styles.gradient,
  //           !userIsVerified && styles.disabled
  //         ]}
  //       >
  //         <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}>
  //         <Image 
  //           source={require('@/assets/home/icon/friends.png')}
  //           alt='Join Game'
  //           style={{cursor: 'pointer'}}
  //         />
  //         </CreateOrJoinGame>
  //         <Text style={styles.subTitle}>Join Game</Text>
  //         <Text style={styles.content}>
  //           Find and Join Exciting Poker Games
  //         </Text>
  //       </CardGradient>
  //       <CardGradient
  //         gradient="orange"
  //         style={[
  //           styles.gradient,
  //           !userIsVerified && styles.disabled
  //         ]}
  //       >
  //         <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}>
  //         <Image 
  //           source={require('@/assets/home/icon/friends.png')}
  //           alt='Create Group'
  //           style={{cursor: 'pointer'}}
  //         />
  //         </CreateOrJoinGame>
  //         <Text style={styles.subTitle}>Create Group</Text>
  //         <Text style={styles.content}>
  //           Explore and Become a Member of Viewerse Groups
  //         </Text>
  //       </CardGradient>
  //     </View>
  //     <View style={styles.seeAll}>
  //       <View style={{marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  //         <Text style={{fontSize: 18, lineHeight: 27, color: '#D1D5DB'}}>Available Games</Text>
  //         {availableGames && availableGames.length > 3 && (
  //           <Button
  //             onPress={showAllGames ? handleSeeLessClick : handleSeeAllClick}
  //             style={styles.button}
  //             textStyle={styles.text}
  //           >
  //             {showAllGames ? "See Less" : "See All"}
  //           </Button>
  //         )}
  //       </View>
  //       {showAllGames ? (
  //         <SeeAllGames
  //           availableGames={availableGames}
  //           userIsVerified={userIsVerified}
  //         />
  //       ) : (
  //         <View style={{
  //           flexDirection: 'row', // Use row for columns
  //           flexWrap: 'wrap',     // Allow wrapping to create multiple rows
  //           justifyContent: 'space-between', // Space between items
  //           margin: -8,   }}>
  //           {availableGames?.slice(0, 3) // Show only first 3 games
  //               .map((game) => (
  //                 <AvailableGamesHome
  //                   key={game.gameId}
  //                   availableGame={game}
  //                   userIsVerified={userIsVerified}
  //                 />
  //               ))}
  //         </View>
  //       )}
  //       {availableGames?.length === 0 && (
  //         <Text style={{paddingVertical: 16, textAlign: 'center'}}>No games found.</Text>
  //       )}
  //     </View>
  //   </>
  // )
  const [chipState, setChipState] = useState(false);

  return (
    <SpanWrapper name="HomePage" span={span}>
      <View style={styles.topBar}>
        <Image style={[styles.mark]} source={require('@/assets/global/pure-poker-logo.png')} />
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={()=> {setChipState(!chipState)}} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#1B1F28', padding: 5,paddingHorizontal: 10, borderRadius: 20}}>
            <Image style={{width: 16, height: 16}} source={require(`@/assets/game/coin-yellow.png`)} />
            <Text style={{color: '#FFC105', fontWeight: 500, fontSize: 16}}>&nbsp;&nbsp;{user.chips}&nbsp;</Text>
            <Image style={{width: 16, height: 16}} source={require(`@/assets/home/icon/pro.png`)} />
          </TouchableOpacity>
          {
            user.profilePicture !== '' ? 
            <Image style={[styles.mark, {opacity: 1, marginLeft: 5}]} source={require(`@/assets/profile/shark-pink.png`)} />
            : 
            <></> 
          }
        </View>
      </View>
        {chipState && 
          <TouchableOpacity onPress={()=> {setChipState(!chipState)}}
            style={{position: 'absolute', top: 55, right: 40, backgroundColor: '#1B1F28', height: 80, width: 150, borderRadius: 10, zIndex: 100}} 
          >
            <Text style={{color: 'white', textAlign: 'center', textAlignVertical: 'center', height: '100%', padding: 10}}>
              Please visit purepoker.world for more info
            </Text>
          </TouchableOpacity>
        } 
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>   
        <View style={{position: 'relative', width:'100%', paddingHorizontal: '5%', display:'flex', alignItems: 'center', paddingTop: 100}}>
          <Welcome />
            <CardGradient
              gradient="purple"
              style={[
                styles.gradient,
                !userIsVerified && styles.disabled,
                {marginTop: 16}
              ]}
            >
              <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}>
                <Image source={require('@/assets/home/icon/plus.png')}
                  alt='Create Game'
                  style={{cursor: 'pointer'}}
                />
              </CreateOrJoinGame>
              <Text style={styles.subTitle}>Create New Game</Text>
              <Text style={styles.content}>
                Customize Your Poker Experience
              </Text>
            </CardGradient>
            <CardGradient
              gradient="blue"
              style={[
                styles.gradient,
                !userIsVerified && styles.disabled
              ]}
            >
              <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={false}>
                <Image 
                  source={require('@/assets/home/icon/friends.png')}
                  alt='Join Game'
                  style={{cursor: 'pointer'}}
                />
              </CreateOrJoinGame>
              <Text style={styles.subTitle}>Join Game</Text>
              <Text style={styles.content}>
                Find and Join Exciting Poker Games
              </Text>
            </CardGradient>
            
            <View style={styles.seeAll}>
              <View style={{marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 18, lineHeight: 27, color: '#D1D5DB'}}>Available Games</Text>
                {availableGames && availableGames.length > 3 && (
                <Button
                  onPress={showAllGames ? handleSeeLessClick : handleSeeAllClick}
                  style={styles.button}
                  textStyle={styles.text}
                >
                  {showAllGames ? "See Less" : "See All"}
                </Button>
              )}
            </View>
            {showAllGames ? (
              <SeeAllGames
                availableGames={availableGames}
                userIsVerified={userIsVerified}
              />
            ) : (
              <View style={{
                flexDirection: 'column', // Use row for columns
                flexWrap: 'wrap',     // Allow wrapping to create multiple rows
                justifyContent: 'space-between', // Space between items
                margin: -8,   }}>
                {availableGames?.slice(0, 3) // Show only first 3 games
                  .map((game) => (
                    <AvailableGamesHome
                      key={game.gameId}
                      availableGame={game}
                      userIsVerified={userIsVerified}
                    />
                  ))}
              </View>
            )}
            {availableGames?.length === 0 && (
              <Text style={{paddingVertical: 16, textAlign: 'center', color: 'white'}}>No games found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SpanWrapper>
  );
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    height: '100%',
    width: '100%',
    backgroundColor: '#11141D'
  },
  gradient: {
    marginBottom: 16, // mb-4
    height: 'auto', // h-auto
    minHeight: '15%', // min-h-[20vh]
    width: '90%', // w-full
    paddingVertical: 20
  },
  disabled: {
    opacity: 0.5, // opacity-50
  },
  subTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  content: {
    marginTop: 4,
    fontSize: 12,
    color: '#FFF'
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 30,
  },
  seeAll: {
    width: '90%',
    marginTop: 16, // mt-4
    marginBottom: 12, // mb-3
    padding: 12, // p-3
    borderRadius: 16, // rounded-2xl
    borderWidth: 1, // border
    borderColor: '#4B5563', // border-gray-700 (adjust as necessary)
    backgroundColor: 'rgba(31, 41, 55, 0.75)', // bg-gray-800 with opacity (adjust as necessary)
  },
  button: {
    borderRadius: 9999, // rounded-full
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white with 10% opacity
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
    // transition: 'background-color 0.3s ease', // transition (not directly applicable)
  },
  text: {
    fontSize: 14, // text-sm
    color: '#9CA3AF', // text-gray-400
  },
  topBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    zIndex: 50,
    backgroundColor: '#11141D',
    paddingBottom: 5
  }
});
