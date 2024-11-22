import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, Keyboard } from "react-native"; // Import Keyboard API
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./components/Button";
import Row from "./components/Row";
import { valueHasOp, calculateResult } from './util/logic';
import History from "./util/History"; // Import the History component

export default function App() {
  // Declare state variables
  const [calValue, setCalValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [previewValue, setPreviewValue] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [cursorSel, setCursorSel] = useState({ end: 0, start: 0 });
  const [isCursorSel, setIsCursorSel] = useState(false);
  const [history, setHistory] = useState([]); // State for calculation history
  const [showHistory, setShowHistory] = useState(false); // State to toggle history view

  const ansColor = {
    color: isAnswer ? "orange" : "white",
  };

  useEffect(() => {
    // Dismiss keyboard when the app starts
    Keyboard.dismiss();

    // If there's an operation in the value, calculate the preview value
    if (valueHasOp(calValue)) {
      let prevAns = calculateResult(calValue);
      setPreviewValue(`${prevAns}`);
    } else {
      setPreviewValue(``);
    }
  }, [calValue]);

  const handleBackSpace = () => {
    const remainValue = calValue.slice(0, calValue.length - 1);
    setCalValue(remainValue);
    setDisplayValue(remainValue.replace(/\*/g, '×').replace(/\//g, '÷'));
  };

  const handlePress = (text) => {
    if (isAnswer) {
      setCalValue("");
      setDisplayValue("");
      setIsAnswer(false);
    }

    if (text === "+/-") {
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

    const displayText = text === "X" ? "×" : text === "/" ? "÷" : text;

    setCursorSel({ end: cursorSel.end + 1, start: cursorSel.start + 1 });
    setCalValue((prev) => {
      if (prev.length !== cursorSel.end && isCursorSel) {
        let leftOver = prev.slice(0, cursorSel.end);
        let rightOver = prev.slice(cursorSel.end, prev.length);
        return `${leftOver}${corrText}${rightOver}`;
      }
      return prev + `${corrText}`;
    });

    setDisplayValue((prev) => {
      if (prev.length !== cursorSel.end && isCursorSel) {
        let leftOver = prev.slice(0, cursorSel.end);
        let rightOver = prev.slice(cursorSel.end, prev.length);
        return `${leftOver}${displayText}${rightOver}`;
      }
      return prev + displayText;
    });
  };

  const handleParenthesis = () => {
    // Count how many opening and closing parentheses are in the current calculation
    const openParentheses = calValue.split("(").length - 1;
    const closeParentheses = calValue.split(")").length - 1;

    // If the number of open parentheses is greater than the number of closed ones, insert a closing parenthesis
    if (openParentheses > closeParentheses) {
      handlePress(")");
    } else {
      // Otherwise, insert an opening parenthesis
      handlePress("(");
    }
  };

  const handleClear = () => {
    // Clear the calculation and reset parentheses state
    setCalValue("");
    setDisplayValue("");
  };

  const handleEqual = () => {
    if (!calValue) return;
    const result = calculateResult(calValue);
    setCalValue(result);
    setDisplayValue(result.replace(/\*/g, '×').replace(/\//g, '÷'));
    setPreviewValue("");

    // Save to history
    setHistory((prev) => [...prev, { equation: calValue, answer: result }]);
    setIsAnswer(true);
  };

  const toggleHistory = () => {
    // Toggle history visibility
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    // Clear calculation history
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
  container: {
    flex: 1,
    backgroundColor: "#17171a",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    height: 70,
    color: "white",
    width: "90%",
    fontSize: 45,
    textAlign: "right",
    marginTop: 85,
  },
  prevInput: {
    color: "#757574",
    fontSize: 30,
    height: 40,
  },
  backButton: {
    width: "95%",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
  },
  backspaceButton: {
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    width: "90%",
    marginVertical: 35,
  },
  buttonContainer: {
    flex: 0.9,
    width: "95%",
    marginBottom: 40,
    justifyContent: "flex-end",
  },
});
