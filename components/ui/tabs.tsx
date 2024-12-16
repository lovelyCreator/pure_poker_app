import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialIndex?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, initialIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);

  return (
    <View style={styles.container}>
      <View style={styles.tabsList}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabTrigger,
              activeIndex === index && styles.activeTab,
            ]}
            onPress={() => setActiveIndex(index)}
          >
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        {tabs[activeIndex].content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc', // Border color
    borderRadius: 4,
    overflow: 'hidden',
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', // Background color for tabs
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#fff', // Active tab background color
    borderBottomWidth: 2,
    borderBottomColor: '#38D24A', // Active tab border color
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 16,
    backgroundColor: '#fff', // Background color for content
  },
});

export {Tabs};
