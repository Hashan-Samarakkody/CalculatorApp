/*
    File Name: App.js
    Author: S.D.S.H. Samarakkodi
    Student ID: IM/2021/007
    Description: This file contains the button component for the calculator app.
    Date Created: 2024-09-05
*/

// Import necessary modules
import { TouchableHighlight, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";

// Get screen width
const { width } = Dimensions.get('window');

// Define dynamic button size based on screen width
const BUTTON_SIZE = width < 350 ? 50 : 80; // Make buttons smaller on small screens

// Define button colors
const colorMapping = {
    equal: {
        backgroundColor: "orange",
        textColor: "#1C1C1C",
        iconColor: "#1C1C1C",
    },
    digit: {
        backgroundColor: "#505050",
        textColor: "#fff",
        iconColor: "#fff",
    },
    operatorPrimary: {
        backgroundColor: "orange",
        textColor: "#505050",
        iconColor: "#fff",
    },
    operatorSecondary: {
        backgroundColor: "#D4D4D2",
        textColor: "#1C1C1C",
        iconColor: "#1C1C1C",
    },
};

// Button component
export default function Button({ label, type, handlePress, icon }) {
    const { backgroundColor, textColor, iconColor } = colorMapping[type] || colorMapping.digit;

    // Return button component
    return (
        <TouchableHighlight
            underlayColor={backgroundColor}
            style={[styles.button, { backgroundColor, width: BUTTON_SIZE, height: BUTTON_SIZE }]}
            onPress={() => handlePress(label)}
        >
            {icon ? (
                React.cloneElement(icon, { color: iconColor }) // Set the icon color
            ) : (
                <Text style={{ fontSize: BUTTON_SIZE / 2, color: textColor, fontWeight: "bold" }}>
                    {label}
                </Text>
            )}
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 50, // Make button round
        alignItems: "center",
        justifyContent: "center",
        margin: 1, // Add space between buttons
    },
});
