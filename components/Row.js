import { View, StyleSheet } from "react-native";
import React from "react";

export default function Row({ children }) {
    return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
