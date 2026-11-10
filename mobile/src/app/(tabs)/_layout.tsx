import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { tabMessages } from "@/widgets/messages";

type IconName = keyof typeof Ionicons.glyphMap;

const tabs: { name: string; label: keyof typeof tabMessages.ko; icon: IconName }[] = [
  { name: "analyze", label: "analyze", icon: "scan-outline" },
  { name: "detect", label: "detect", icon: "search-outline" },
  { name: "chat", label: "chat", icon: "chatbubble-ellipses-outline" },
  { name: "report", label: "report", icon: "document-text-outline" },
  { name: "more", label: "more", icon: "ellipsis-horizontal" },
];

export default function TabsLayout() {
  const t = useMessages(tabMessages);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary600,
        tabBarInactiveTintColor: colors.gray600,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.gray400 },
        tabBarLabelStyle: { fontFamily: "Pretendard-Medium", fontSize: 12 },
      }}
    >
      {tabs.map(({ name, label, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t[label],
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={icon}
                size={size}
                color={focused ? colors.primary600 : colors.gray600}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
