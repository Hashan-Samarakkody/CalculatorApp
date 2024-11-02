import { TouchableHighlight, Text, StyleSheet } from "react-native";
import React from "react";

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

export default function Button({ label, type, handlePress, icon }) {
    const { backgroundColor, textColor, iconColor } = colorMapping[type] || colorMapping.digit;

    return (
        <TouchableHighlight
            underlayColor={backgroundColor}
            style={[styles.button, { backgroundColor }]}
            onPress={() => handlePress(label)}
        >
            {icon ? (
                React.cloneElement(icon, { color: iconColor }) // Set the icon color
            ) : (
                <Text style={{ fontSize: 26, color: textColor, fontWeight: "bold" }}>
                    {label}
                </Text>
            )}
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
    },
});
