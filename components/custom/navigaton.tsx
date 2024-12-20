import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoutButton from './LogoutButton'; // Assuming you have a LogoutButton component
import DepositButton from '../providers/DepositButton'; // Assuming you have a DepositButton component
import { useAuth } from '@/hooks/useAuth'; // Adjust the import path as needed

const navigationItems = [
  { label: "Home", icon: require('@/assets/menu-bar/home.png'), route: "Home" },
  { label: "Groups", icon: require('@/assets/menu-bar/group.png'), route: "Groups" },
  { label: "Community", icon: require('@/assets/menu-bar/community.png'), route: "Community" },
  { label: "Rewards", icon: require('@/assets/menu-bar/reward.png'), route: "Rewards" },
];

const MenuBar = () => {
  const navigation = useNavigation();
  const userFetched = useAuth(); // Fetch user data
  const [user, setUser] = useState(userFetched);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleNavigation = (route) => {
    navigation.navigate(route);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/global/pure-poker-logo.png')} style={styles.logo} />
      </View>

      <FlatList
        data={navigationItems}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleNavigation(item.route)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.label}
        horizontal
        contentContainerStyle={styles.navList}
      />

      <TouchableOpacity onPress={toggleModal} style={styles.userButton}>
        <Image 
          source={{ uri: user.profilePicture }} // Assuming profilePicture is a URL
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user.username}</Text>
      </TouchableOpacity>

      {/* User Menu Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Menu</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <DepositButton />
            <LogoutButton />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#11141D',
    padding: 10,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: 'contain',
  },
  navList: {
    flexDirection: 'row',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  navLabel: {
    color: '#88898D',
    fontSize: 16,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1F28',
    padding: 10,
    borderRadius: 20,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1C212B',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 10,
  },
  closeButton: {
    color: '#37DD4A',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default MenuBar;
