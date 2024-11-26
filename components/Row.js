/*
    File Name: App.js
    Author: S.D.S.H. Samarakkodi
    Student ID: IM/2021/007
    Description: This file contains the row component for the calculator app.
    Date Created: 2024-09-05
*/


// Import necessary modules
import { View, StyleSheet } from "react-native";
import React from "react";

// Row component
export default function Row({ children }) {
    return <View style={styles.row}>{children}</View>;
}

// Styles for the Row component
const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
