import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./components/Button";
import Row from "./components/Row";
import { valueHasOp, calculateResult } from './util/logic';

export default function App() {
  const [calValue, setCalValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [previewValue, setPreviewValue] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [cursorSel, setCursorSel] = useState({ end: 0, start: 0 });
  const [isCursorSel, setIsCursorSel] = useState(false);
  const [lastParenthesis, setLastParenthesis] = useState('(');

  const ansColor = {
    color: isAnswer ? "orange" : "white",
  };

  useEffect(() => {
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

    // Check if the pressed button is "+/-"
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
    const newParenthesis = lastParenthesis === '(' ? '(' : ')';
    setLastParenthesis(newParenthesis);
    handlePress(newParenthesis);
  };

  const handleClear = () => {
    setCalValue("");
    setDisplayValue("");
    setLastParenthesis('(');
  };

  const handleEqual = () => {
    if (!calValue) return;
    const result = calculateResult(calValue);
    setCalValue(result);
    setDisplayValue(result.replace(/\*/g, '×').replace(/\//g, '÷'));
    setPreviewValue("");
    setIsAnswer(true);
  };

  return (
    <View style={styles.container}>
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
        showSoftInputOnFocus={false}
      />
      <TextInput
        value={previewValue}
        onChangeText={setPreviewValue}
        cursorColor='#8ad8d1'
        textAlign='right'
        caretHidden={true}
        showSoftInputOnFocus={false}
        style={[styles.input, styles.prevInput]}
      />

      <View style={styles.backButton}>
        <Pressable onPress={handleBackSpace} disabled={!calValue}>
          <Ionicons
            name='backspace'
            size={30}
            color={calValue ? "orange" : "#505050"}
          />
        </Pressable>
      </View>

      <View style={styles.divider} />

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
            icon={<FontAwesome5 name='plus' size={21} />}
          />
        </Row>
        <Row>
          <Button handlePress={handlePress} label={"+/-"} type='digit' />
          <Button handlePress={handlePress} label={"0"} type='digit' />
          <Button handlePress={handlePress} label={"."} type='digit' />
          <Button
            handlePress={handleEqual}
            label={"="}
            type='equal'
            icon={<FontAwesome5 name='equals' size={21} />}
          />
        </Row>
      </View>

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010101",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 40,
    borderWidth: 1,
    padding: 10,
    color: "#fff",
    fontSize: 36,
  },
  prevInput: {
    fontSize: 24,
    marginTop: 40,
    marginBottom: 30,
    color: "#616161",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flex: 4,
  },
  divider: {
    height: 2,
    backgroundColor: "#575757",
    marginVertical: 20,
  },
});
