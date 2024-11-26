/*
	File Name: App.js
	Author: S.D.S.H. Samarakkodi
	Student ID: IM/2021/007
	Description: This file contains the main calculator application component. It includes the logic for handling the calculator operations and rendering the calculator UI.
	Date Created: 2024-09-05
*/


// Import necessary modules and components
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, Keyboard } from "react-native";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./components/Button";
import Row from "./components/Row";
import { valueHasOp, calculateResult } from './util/logic';
import History from "./util/History";

export default function App() {
	// Declare state variables
	const [calValue, setCalValue] = useState("");  // Stores the current calculation value
	const [displayValue, setDisplayValue] = useState("");  // Stores the display value for the calculator screen
	const [previewValue, setPreviewValue] = useState("");  // Stores the preview result (before pressing equal)
	const [isAnswer, setIsAnswer] = useState(false);  // Determines if the result is an answer (used to highlight answer)
	const [cursorSel, setCursorSel] = useState({ end: 0, start: 0 });  // Stores cursor position for text input
	const [isCursorSel, setIsCursorSel] = useState(false);  // Checks if cursor selection is active
	const [history, setHistory] = useState([]);  // State for storing calculation history
	const [showHistory, setShowHistory] = useState(false);  // State to toggle history view

	// Answer display color change based on whether it's the final result
	const ansColor = {
		color: isAnswer ? "orange" : "white",  // Orange when result, white when not
	};

	useEffect(() => {
		// Dismiss keyboard when the app starts
		Keyboard.dismiss();

		// If there's an operation in the value, calculate the preview value
		if (valueHasOp(calValue)) {
			let prevAns = calculateResult(calValue);  // Calculate result for preview
			setPreviewValue(`${prevAns}`);  // Set preview value
		} else {
			setPreviewValue(``);  // Clear preview if no operation
		}
	}, [calValue]);  // Trigger this effect whenever the calculation value changes

	const handleBackSpace = () => {
		// Handle the backspace button, removing one character from the calculation
		const remainValue = calValue.slice(0, calValue.length - 1);
		setCalValue(remainValue);
		setDisplayValue(remainValue.replace(/\*/g, '×').replace(/\//g, '÷'));  // Replace operators for better display
	};

	const handlePress = (text) => {
		if (isAnswer) {
			// If the result has been shown, reset the calculation on new input
			setCalValue("");
			setDisplayValue("");
			setIsAnswer(false);
		}

		if (text === "+/-") {
			// Handle toggling the sign of the last number
			if (calValue) {
				const lastNumberMatch = calValue.match(/[-]?\d+(\.\d+)?$/);
				if (lastNumberMatch) {
					const lastNumber = lastNumberMatch[0];
					const newNumber = (parseFloat(lastNumber) * -1).toString();
					const updatedValue = calValue.slice(0, -lastNumber.length) + newNumber;
					setCalValue(updatedValue);
					setDisplayValue(updatedValue.replace(/\*/g, '×').replace(/\//g, '÷'));
				}
			}
			return;
		}

		// Correct the text for calculation and display
		let corrText = text === "X" ? "*" : text === "+/-" ? "-" : text;

		// Handle percentage calculation for the last number
		if (text === "%") {
			if (calValue) {
				const lastNumber = calValue.split(/[\+\-\*\/]/).pop();
				const percentageValue = (parseFloat(lastNumber) / 100).toString();
				setCalValue(calValue.slice(0, -lastNumber.length) + percentageValue);
				setDisplayValue(calValue.slice(0, -lastNumber.length) + percentageValue);
			}
			return;
		}

		// Correct the text for calculation and display
		const displayText = text === "X" ? "×" : text === "/" ? "÷" : text;

		setCursorSel({ end: cursorSel.end + 1, start: cursorSel.start + 1 });
		setCalValue((prev) => {
			// Insert the operator or number at the correct cursor position
			if (prev.length !== cursorSel.end && isCursorSel) {
				let leftOver = prev.slice(0, cursorSel.end);
				let rightOver = prev.slice(cursorSel.end, prev.length);
				return `${leftOver}${corrText}${rightOver}`;
			}
			return prev + `${corrText}`;
		});

		setDisplayValue((prev) => {
			// Insert the operator or number at the correct cursor position in the display
			if (prev.length !== cursorSel.end && isCursorSel) {
				let leftOver = prev.slice(0, cursorSel.end);
				let rightOver = prev.slice(cursorSel.end, prev.length);
				return `${leftOver}${displayText}${rightOver}`;
			}
			return prev + displayText;
		});
	};

	const handleParenthesis = () => {
		// Toggle parentheses based on the current calculation
		const openParentheses = calValue.split("(").length - 1;
		const closeParentheses = calValue.split(")").length - 1;

		if (openParentheses > closeParentheses) {
			// If there are more opening parentheses, insert a closing parenthesis
			handlePress(")");
		} else {
			// Otherwise, insert an opening parenthesis
			handlePress("(");
		}
	};

	const handleClear = () => {
		// Clear the calculation and reset display
		setCalValue("");
		setDisplayValue("");
	};

	const handleEqual = () => {
		// Calculate the result when "=" is pressed
		if (!calValue) return;
		const result = calculateResult(calValue);
		setCalValue(result);
		setDisplayValue(result.replace(/\*/g, '×').replace(/\//g, '÷'));
		setPreviewValue("");

		// Save the current equation and result to history
		setHistory((prev) => [...prev, { equation: calValue, answer: result }]);
		setIsAnswer(true);  // Mark that the result is shown
	};

	const toggleHistory = () => {
		// Toggle visibility of history view
		setShowHistory(!showHistory);
	};

	const clearHistory = () => {
		// Clear the calculation history
		setHistory([]);
	};

	// Render the history component when the history view is active
	if (showHistory) {
		return (
			<History history={history} clearHistory={clearHistory} goBack={toggleHistory} />
		);
	}

	return (
		<View style={styles.container}>
			{/* Text input for displaying the current calculation */}
			<TextInput
				style={[styles.input, ansColor]}
				value={displayValue}
				onChangeText={setCalValue}
				selection={cursorSel}
				cursorColor='#8ad8d1'
				autoFocus={true}
				textAlign='right'
				onSelectionChange={(e) => {
					setIsCursorSel(true);
					setCursorSel(e.nativeEvent.selection);
				}}
				showSoftInputOnFocus={false} // Prevent the keyboard from showing
				editable={false} // Disable text input editing
			/>
			{/* Text input for showing the preview of the result */}
			<TextInput
				value={previewValue}
				onChangeText={setPreviewValue}
				cursorColor='#8ad8d1'
				textAlign='right'
				caretHidden={true}
				showSoftInputOnFocus={false} // Prevent the keyboard from showing
				style={[styles.input, styles.prevInput]}
				editable={false} // Disable text input editing
			/>

			{/* Backspace and history buttons */}
			<View style={styles.backButton}>
				<Pressable onPress={toggleHistory}>
					<Ionicons name='time' size={30} color="#505050" />
				</Pressable>
				<Pressable onPress={handleBackSpace} disabled={!calValue} style={styles.backspaceButton}>
					<Ionicons
						name='backspace'
						size={30}
						color={calValue ? "orange" : "#505050"}
					/>
				</Pressable>
			</View>

			<View style={styles.divider} />

			{/* Button container for calculator */}
			<View style={styles.buttonContainer}>
				<Row>
					<Button handlePress={handleClear} label={"C"} type='operatorSecondary' />
					<Button
						handlePress={handleParenthesis}
						label={"()"}
						type='operatorSecondary'
						icon={
							<MaterialCommunityIcons
								name='code-parentheses'
								size={30}
								style={{ fontWeight: "bold" }}
							/>
						}
					/>
					<Button handlePress={handlePress} label={"%"} type='operatorSecondary'
						icon={<FontAwesome5 name='percent' size={21} />} />
					<Button
						handlePress={handlePress}
						label={"/"}
						type='operatorPrimary'
						icon={<FontAwesome5 name='divide' size={21} />}
					/>
				</Row>
				<Row>
					<Button handlePress={handlePress} label={"7"} type='digit' />
					<Button handlePress={handlePress} label={"8"} type='digit' />
					<Button handlePress={handlePress} label={"9"} type='digit' />
					<Button
						handlePress={handlePress}
						label={"X"}
						type='operatorPrimary'
						icon={<FontAwesome5 name='times' size={21} />}
					/>
				</Row>
				<Row>
					<Button handlePress={handlePress} label={"4"} type='digit' />
					<Button handlePress={handlePress} label={"5"} type='digit' />
					<Button handlePress={handlePress} label={"6"} type='digit' />
					<Button
						handlePress={handlePress}
						label={"-"}
						type='operatorPrimary'
						icon={<FontAwesome name='minus' size={21} />}
					/>
				</Row>
				<Row>
					<Button handlePress={handlePress} label={"1"} type='digit' />
					<Button handlePress={handlePress} label={"2"} type='digit' />
					<Button handlePress={handlePress} label={"3"} type='digit' />
					<Button
						handlePress={handlePress}
						label={"+"}
						type='operatorPrimary'
						icon={<FontAwesome name='plus' size={21} />}
					/>
				</Row>
				<Row>
					<Button handlePress={handlePress} label={"+/-"} type='digit' />
					<Button handlePress={handlePress} label={"0"} type='digit' />
					<Button handlePress={handlePress} label={"."} type='digit' />
					<Button handlePress={handleEqual} label={"="} type='equal'
						icon={<FontAwesome5 name='equals' size={21} />} />
				</Row>
			</View>

			<StatusBar style='light' />
		</View>
	);
}

const styles = StyleSheet.create({
	// Styles for the main container
	container: {
		flex: 1,
		backgroundColor: "#17171a",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	// Styles for the text input
	input: {
		height: 55,
		color: "white",
		width: "90%",
		fontSize: 45,
		textAlign: "right",
		marginTop: 75,
	},
	// Styles for the preview text input
	prevInput: {
		color: "#757574",
		fontSize: 50,
		height: 50,
	},
	// Styles for the back button container
	backButton: {
		width: "95%",
		paddingHorizontal: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 0,
	},
	// Styles for the backspace button
	backspaceButton: {
		paddingHorizontal: 5,
	},
	// Styles for the divider line
	divider: {
		height: 1,
		backgroundColor: "#333",
		width: "90%",
		marginVertical: 25,
	},
	// Styles for the button container
	buttonContainer: {
		flex: 0.9,
		width: "95%",
		marginBottom: 1,
		justifyContent: "flex-end",
	},
});
