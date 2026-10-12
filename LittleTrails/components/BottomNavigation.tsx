import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const tabs = ['Today', 'Explore', 'History', 'Places', 'Month','Extra'];

type BottomNavigationProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <View style={styles.navigation}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onTabChange(tab)}
          hitSlop={10}
        >
          <Text
            style={[
              styles.tab,
              tab === activeTab && styles.activeTab,
            ]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    paddingTop: 18,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    fontSize: 12,
    color: colors.cardMuted,
  },
  activeTab: {
    color: colors.cardText,
    fontWeight: '800',
  },
});