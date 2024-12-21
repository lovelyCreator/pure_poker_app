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
import LoadingPage from '@/components/page/loading';
import HomePage from '@/components/page/home';

// const SignInCard = lazy(() => import('"@/components/custom/login/signInCard'));

export default function Home() {

  return (
    <Suspense fallback={<LoadingPage />}> 
      <HomePage />
    </Suspense>
  );
}
