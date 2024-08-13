import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function App() {
  const [serverState, setServerState] = React.useState<string>("Loading...");
  const [messageText, setMessageText] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const [chosenUserName, setChosenUserName] = React.useState<string>("");
  const [disableButton, setDisableButton] = React.useState<boolean>(true);
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState<boolean>(true);
  const [inputUserFieldEmpty, setInputUserFieldEmpty] = React.useState<boolean>(true);
  const [serverMessages, setServerMessages] = React.useState<{sender: string, text: string}[]>([]);
  var ws = React.useRef(new WebSocket("ws://192.168.0.236:8080/")).current;

  const colorScheme = useColorScheme() || 'light';
  const styles = createStyles(colorScheme);

  React.useEffect(() => {
    const serverMessagesList: {sender: string, text: string}[] = [];
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
  const submitMessage = () => {
    const message = {
      sender: chosenUserName,
      text: messageText,
    };
    ws.send(JSON.stringify(message));
    setMessageText("");
    setInputFieldEmpty(true);
  };
  return (
    <View style={styles.container}>
      {chosenUserName === "" ? (

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Colors[colorScheme].tint,
            flexGrow: 1,
            padding: 5,
            color: Colors[colorScheme].text,
          }}
          placeholder={"User name"}
          placeholderTextColor={Colors[colorScheme].text}
          onChangeText={(uName) => {
            setUserName(uName);
            setInputUserFieldEmpty(uName.length > 0 ? false : true);
          }}
          value={userName}
        />
        <Button
          onPress={() => setChosenUserName(userName)}
          title={"Submit"}
          disabled={disableButton || inputUserFieldEmpty}
        />
      </View>

         ) : null}

      <View
        style={{
          height: 30,
          backgroundColor: Colors[colorScheme].statusBG,
          padding: 5,
        }}
      >
        <Text
        style={{
          color: Colors[colorScheme].text,
        }}
        >{serverState}</Text>
      </View>
      <View
        style={{
          backgroundColor: Colors[colorScheme].backgroundChat,
          padding: 5,
          flexGrow: 1,
        }}
      >
        <ScrollView>
          {serverMessages.map((item, ind) => (
            <Text
              key={ind}
              style={{
                color: Colors[colorScheme].text,
              }}
            >
              {item.sender}: {item.text}
            </Text>
          ))}
        </ScrollView>
      </View>
      {chosenUserName != "" ? (

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Colors[colorScheme].tint,
            flexGrow: 1,
            padding: 5,
            color: Colors[colorScheme].text,
          }}
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
      ) : null}
    </View>
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
  });
};
