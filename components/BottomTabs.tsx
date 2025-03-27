import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome" 

interface BottomTabsProps {
    onChangetab: (tabName: string) => void;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ onChangetab }) => {
    const [selectedTab, setSelectedTab] = useState("Timers");

    const tabs = [
        { id: "1", name: "Timers", icon: "clock" },
        { id: "2", name: "History", icon: "history" },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={styles.tab}
                    onPress={() => { setSelectedTab(tab.name), onChangetab(tab.name) }}
                >
                    {
                        tab.name === "Timers" ?
                            <Entypo name={tab.icon} size={24} color={selectedTab === tab.name ? "#EB5B00" : "#5F6368"} />
                            : tab.name === "History" ?
                                <FontAwesome name={tab.icon} size={24} color={selectedTab === tab.name ? "#EB5B00" : "#5F6368"} />
                                : null
                    }

                    <Text
                        style={[
                            styles.tabText,
                            { color: selectedTab === tab.name ? "#EB5B00" : "#5F6368" },
                        ]}
                    >
                        {tab.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingVertical: 10,
    },
    tab: {
        alignItems: "center",
    },
    tabText: {
        fontSize: 12,
        marginTop: 5, // Space between icon and text
    },
});

export default BottomTabs;