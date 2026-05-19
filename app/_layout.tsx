import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: 70,
                    marginBottom: 15,
                    marginHorizontal: 20,
                    height: 60,
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    right: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 5,
                    paddingBottom: 0,
                    paddingTop: 0,
                },
                tabBarActiveTintColor: '#8B6F47',
                tabBarInactiveTintColor: '#999999',
                tabBarLabel: () => null,
                tabBarIconStyle: {
                    width: 40,
                    height: 40,
                    marginTop: 5,
                },
            }}
        >
            <Tabs.Screen
                name="(tabs)/index"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Text style={{ fontSize: 32, color: focused ? '#8B6F47' : '#999999' }}>📚</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="(tabs)/notes"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Text style={{ fontSize: 30, color: focused ? '#8B6F47' : '#999999' }}>📝</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="(tabs)/profile"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Text style={{ fontSize: 30, color: focused ? '#8B6F47' : '#999999' }}>👤</Text>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen name="(tabs)/add-book" options={{ href: null }} />
            <Tabs.Screen name="(tabs)/add-note" options={{ href: null }} />
            <Tabs.Screen name="(tabs)/edit-note" options={{ href: null }} />
            <Tabs.Screen name="(tabs)/edit-profile" options={{ href: null }} />
            <Tabs.Screen name="(tabs)/book/[id]" options={{ href: null }} />
            <Tabs.Screen name="(tabs)/edit-book/[id]" options={{ href: null }} />
        </Tabs>
    );
}