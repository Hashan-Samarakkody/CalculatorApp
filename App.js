import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, TextInput, View, Keyboard, Dimensions, Text } from "react-native";
import Button from "./components/Button";
import Row from "./components/Row";
import { valueHasOp, calculateResult } from './util/logic';
import History from "./util/History";

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const screenRatio = width / height; // Calculate the screen ratio

export default function App() {
  const [calValue, setCalValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [previewValue, setPreviewValue] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [cursorSel, setCursorSel] = useState({ end: 0, start: 0 });
  const [isCursorSel, setIsCursorSel] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const ansColor = {
    color: isAnswer ? "orange" : "white",
  };

  useEffect(() => {
    Keyboard.dismiss();

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

    let corrText = text === "X" ? "*" : text === "+/-" ? "-" : text;

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
        return `${leftOver}${corrText}${rightOver}`;
      }
      return prev + corrText;
    });
  };

  const handleClear = () => {
    setCalValue("");
    setDisplayValue("");
  };

  const handleEqual = () => {
    if (!calValue) return;
    const result = calculateResult(calValue);
    setCalValue(result);
    setDisplayValue(result.replace(/\*/g, '×').replace(/\//g, '÷'));
    setPreviewValue("");

    setHistory((prev) => [...prev, { equation: calValue, answer: result }]);
    setIsAnswer(true);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  if (showHistory) {
    return (
      <History history={history} clearHistory={clearHistory} goBack={toggleHistory} />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.screen}>
        <TextInput
          style={[styles.result, ansColor, { fontSize: width < 400 ? 50 : 70 }]} // Dynamic font size based on screen width
          value={displayValue}
          editable={false}
          pointerEvents="none"
        />
        <TextInput
          style={[styles.result, { fontSize: width < 400 ? 30 : 40 }]} // Smaller preview font
          value={previewValue}
          editable={false}
          pointerEvents="none"
        />
      </View>

      {/* Add rows with buttons */}
      <View style={styles.buttonContainer}>
        <Row>
          <Button label="1" type="digit" handlePress={handlePress} />
          <Button label="2" type="digit" handlePress={handlePress} />
          <Button label="3" type="digit" handlePress={handlePress} />
          <Button label="+" type="operatorPrimary" handlePress={handlePress} />
        </Row>
        <Row>
          <Button label="4" type="digit" handlePress={handlePress} />
          <Button label="5" type="digit" handlePress={handlePress} />
          <Button label="6" type="digit" handlePress={handlePress} />
          <Button label="-" type="operatorPrimary" handlePress={handlePress} />
        </Row>
        <Row>
          <Button label="7" type="digit" handlePress={handlePress} />
          <Button label="8" type="digit" handlePress={handlePress} />
          <Button label="9" type="digit" handlePress={handlePress} />
          <Button label="×" type="operatorPrimary" handlePress={handlePress} />
        </Row>
        <Row>
          <Button label="C" type="operatorSecondary" handlePress={handleClear} />
          <Button label="0" type="digit" handlePress={handlePress} />
          <Button label="=" type="equal" handlePress={handleEqual} />
          <Button label="÷" type="operatorPrimary" handlePress={handlePress} />
        </Row>
        <Row>
          <Button label="(" type="operatorSecondary" handlePress={handlePress} />
          <Button label=")" type="operatorSecondary" handlePress={handlePress} />
          <Button label="%" type="operatorSecondary" handlePress={handlePress} />
          <Button label="+/-" type="operatorSecondary" handlePress={handlePress} />
        </Row>
        <Text
          style={styles.historyToggle}
          onPress={toggleHistory}
        >
          {showHistory ? "Hide History" : "Show History"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    padding: 20,
  },
  result: {
    color: "white",
    fontWeight: "bold",
    textAlign: "right",
    width: "90%", // Ensure the width adjusts for screen size
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  historyToggle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
