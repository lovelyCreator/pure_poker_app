import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const expandIcon = require('@/assets/menu-bar/expand.png'); // Adjust the path

const NavigationMenu = ({ children } : { children:any }) => {
  return (
    <View style={styles.container}>
      {children}
      <NavigationMenuViewport />
    </View>
  );
};

const NavigationMenuList = ({ children } : { children:any }) => {
  return (
    <View style={styles.menuList}>
      {children}
    </View>
  );
};

const NavigationMenuItem = ({ children } : { children:any }) => {
  return (
    <View style={styles.menuItem}>
      {children}
    </View>
  );
};

const NavigationMenuTrigger = ({ onPress, children } : { onPress: any, children:any }) => {
  return (
    <TouchableOpacity style={styles.trigger} onPress={onPress}>
      {children}
      <Image
        source={expandIcon}
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const NavigationMenuContent = ({ children } : { children:any }) => {
  return (
    <View style={styles.menuContent}>
      {children}
    </View>
  );
};

const NavigationMenuViewport = () => {
  return (
    <View style={styles.viewport}>
      {/* Content for the viewport can be added here */}
    </View>
  );
};

const NavigationMenuIndicator = () => {
  return (
    <View style={styles.indicator}>
      <View style={styles.indicatorDot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    listStyle: 'none',
    paddingHorizontal: 10,
  },
  menuItem: {
    marginHorizontal: 5,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Adjust background color
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  menuContent: {
    position: 'absolute',
    left: 0,
    top: '100%',
    width: '100%',
    backgroundColor: '#fff', // Adjust background color
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  viewport: {
    position: 'absolute',
    left: 0,
    top: '100%',
    width: '100%',
    backgroundColor: '#fff', // Adjust background color
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  indicator: {
    position: 'absolute',
    top: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ccc', // Adjust color
    borderRadius: 4,
  },
});

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
  NavigationMenuIndicator,
};
