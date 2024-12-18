import { StyleSheet, Image, View, Text, Animated, ScrollView } from 'react-native';

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

  // const user = useAuth();
  // const userIsVerified = user.clearApproval === "approved";
  const userIsVerified = true;
  const availableGames = [true, true, false];
  // const massPayAccountCreated = user.massPayToken;
  // span.info('Provided User', user);
  // const groupsQuery = useUserGroups();
  // const groupIds = groupsQuery.data?.map((group) => group.groupId) || [];
  // const { data: availableGames} = useAvailableGames(groupIds, user.id);

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
  //         {/* <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}> */}
  //         <Image source={require('@/assets/home/icon/plus.png')}
  //           alt='Create Game'
  //           style={{cursor: 'pointer'}}
  //         />
  //         {/* </CreateOrJoinGame> */}
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
  //         {/* <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}> */}
  //         <Image 
  //           source={require('@/assets/home/icon/friends.png')}
  //           alt='Join Game'
  //           style={{cursor: 'pointer'}}
  //         />
  //         {/* </CreateOrJoinGame> */}
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
  //         {/* <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}> */}
  //         <Image 
  //           source={require('@/assets/home/icon/friends.png')}
  //           alt='Create Group'
  //           style={{cursor: 'pointer'}}
  //         />
  //         {/* </CreateOrJoinGame> */}
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

  return (
    // <SpanWrapper name="Homepage" span={span}>
    //   <View style={{display: 'flex', minHeight: '100%', flexDirection: 'column'}}>
    //     <View className="mt-4 w-full px-4">{renderContent()}
    //       <ErrorBoundary errorComponent={CommunityError}>
    //         <Suspense fallback={<CommunityLoading />} key={"test"}>
    //           <SpanWrapper name="Community (posts display)">
    //             <Instrument name="CommunityHome">
    //               <div className="w-full px-4 pb-2">
    //                 <CommunityHome />
    //               </div>
    //             </Instrument>
    //           </SpanWrapper>
    //         </Suspense>
    //       </ErrorBoundary>
    //     </View>
    //   </View>
    // </SpanWrapper>
    <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
      <Image style={[styles.mark]} source={require('@/assets/global/pure-poker-logo.png')} />
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
            {/* <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}> */}
            <Image source={require('@/assets/home/icon/plus.png')}
              alt='Create Game'
              style={{cursor: 'pointer'}}
            />
            {/* </CreateOrJoinGame> */}
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
            {/* <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}> */}
            <Image 
              source={require('@/assets/home/icon/friends.png')}
              alt='Join Game'
              style={{cursor: 'pointer'}}
            />
            {/* </CreateOrJoinGame> */}
            <Text style={styles.subTitle}>Join Game</Text>
            <Text style={styles.content}>
              Find and Join Exciting Poker Games
            </Text>
          </CardGradient>
          <CardGradient
            gradient="orange"
            style={[
              styles.gradient,
              !userIsVerified && styles.disabled
            ]}
          >
            {/* <CreateOrJoinGame userIsVerified={userIsVerified} isCreateGame={true}> */}
            <Image 
              source={require('@/assets/home/icon/friends.png')}
              alt='Create Group'
              style={{cursor: 'pointer'}}
            />
            {/* </CreateOrJoinGame> */}
            <Text style={styles.subTitle}>Create Group</Text>
            <Text style={styles.content}>
              Explore and Become a Member of Viewerse Groups
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
            <Text style={{paddingVertical: 16, textAlign: 'center'}}>No games found.</Text>
          )}
        </View>
      </View>
    </ScrollView>
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
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 1,
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
});
