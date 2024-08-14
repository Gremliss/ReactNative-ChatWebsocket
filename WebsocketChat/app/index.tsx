import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "./redux/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { setName } from "./redux/userSlice";
import { RootState } from "./redux/store";
import { increament, decrement } from "./redux/counterSlice";

function MainComponent() {
  const [serverState, setServerState] = React.useState<string>("Loading...");
  const [messageText, setMessageText] = React.useState<string>("");
  const userName = useSelector((state: RootState) => state.user.name);
  const dispatch = useDispatch();
  const counter = useSelector((state: RootState) => state.counter.counter);
  const [chosenUserName, setChosenUserName] = React.useState<string>("");
  const [disableButton, setDisableButton] = React.useState<boolean>(true);
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState<boolean>(true);
  const [inputUserFieldEmpty, setInputUserFieldEmpty] =
    React.useState<boolean>(true);
  const [serverMessages, setServerMessages] = React.useState<
    { sender: string; text: string }[]
  >([]);
  let ws = React.useRef(new WebSocket("ws://192.168.0.236:8080/")).current;

  const colorScheme = useColorScheme() || "light";
  const styles = createStyles(colorScheme);

  React.useEffect(() => {
    const serverMessagesList: { sender: string; text: string }[] = [];
    ws.onopen = () => {
      setServerState("Connected to the server.");
      setDisableButton(false);
    };
    ws.onclose = (e) => {
      setServerState("Disconnected. Check internet or server.");
      setDisableButton(true);
    };
    ws.onerror = (e: any) => {
      setServerState(e.message || "An error occurred.");
    };
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      serverMessagesList.push(message);
      setServerMessages([...serverMessagesList]);
    };
  }, []);

  const submitUserName = () => {
    setChosenUserName(userName);
  };

  const submitMessage = () => {
    const message = {
      sender: userName,
      text: messageText,
    };
    for (let i = 0; i < counter; i++) {
      ws.send(JSON.stringify(message));
    }
    setMessageText("");
    setInputFieldEmpty(true);
  };

  return (
    <View style={styles.container}>
      {chosenUserName === "" ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={"User name"}
            placeholderTextColor={Colors[colorScheme].text}
            onChangeText={(uName) => {
              dispatch(setName(uName));
              setInputUserFieldEmpty(uName.length > 0 ? false : true);
            }}
            value={userName}
          />
          <Button
            onPress={submitUserName}
            title={"Submit"}
            disabled={inputUserFieldEmpty}
          />
        </View>
      ) : (
        <>
          <View style={styles.center}>
            <Text style={{ color: Colors[colorScheme].text }}>
              Repeat message: {counter}
            </Text>
          </View>
          <View style={styles.center}>
            <Button
              onPress={() => dispatch(increament())}
              title={"Increament"}
            />
            <Button onPress={() => dispatch(decrement())} title={"Decrement"} />
          </View>
          <View style={styles.statusBar}>
            <Text style={{ color: Colors[colorScheme].text }}>
              {serverState}
            </Text>
          </View>
          <View style={styles.chatContainer}>
            <ScrollView>
              {serverMessages.map((item, ind) => (
                <Text key={ind} style={{ color: Colors[colorScheme].text }}>
                  {item.sender}: {item.text}
                </Text>
              ))}
            </ScrollView>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={"Add Message"}
              placeholderTextColor={Colors[colorScheme].text}
              onChangeText={(text) => {
                setMessageText(text);
                setInputFieldEmpty(text.length > 0 ? false : true);
              }}
              value={messageText}
            />
            <Button
              onPress={submitMessage}
              title={"Submit"}
              disabled={disableButton || inputFieldEmpty}
            />
          </View>
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainComponent />
    </Provider>
  );
}

const createStyles = (color: keyof typeof Colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[color].background,
      paddingTop: 30,
      padding: 8,
    },
    inputContainer: {
      flexDirection: "row",
    },
    textInput: {
      borderWidth: 1,
      borderColor: Colors[color].tint,
      flexGrow: 1,
      padding: 5,
      color: Colors[color].text,
    },
    statusBar: {
      height: 30,
      backgroundColor: Colors[color].statusBG,
      padding: 5,
    },
    chatContainer: {
      backgroundColor: Colors[color].backgroundChat,
      padding: 5,
      flexGrow: 1,
    },
    center: {
      // alignContent: "center",
      alignSelf: "center",
      flexDirection: "row",
      paddingBottom: 4,
    },
  });
};
