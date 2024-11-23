import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

/**
 * Renders a list of calculations from the history array and provides
 * a Clear History button and a Back to Calculator button.
 *
 * @param {array} history - array of objects, each with an equation and an answer
 * @param {function} clearHistory - function to clear the history array
 * @param {function} goBack - function to go back to the calculator
 */
const History = ({ history, clearHistory, goBack }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={goBack}>
                <Text style={styles.buttonText}>Back to Calculator</Text>
            </TouchableOpacity>
            <ScrollView style={styles.historyList}>
                {history.map((item, index) => (
                    <View key={index} style={styles.historyItem}>
                        <Text style={styles.equation}>{item.equation} = {item.answer}</Text>
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={clearHistory}>
                <Text style={styles.buttonText}>Clear History</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#505050", // Background color
        padding: 20,
    },
    historyList: {
        marginVertical: 20,
    },
    historyItem: {
        marginBottom: 10,
    },
    equation: {
        color: 'white', // Text color for equations
        fontSize: 22,
    },
    button: {
        backgroundColor: 'orange', // Button background color
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonText: {
        color: 'black', // Button text color
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default History;
