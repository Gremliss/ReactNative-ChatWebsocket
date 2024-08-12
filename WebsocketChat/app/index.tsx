import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

export default function App() {
  const [serverState, setServerState] = React.useState<string>("Loading...");
  const [messageText, setMessageText] = React.useState<string>("");
  const [disableButton, setDisableButton] = React.useState<boolean>(true);
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState<boolean>(true);
  const [serverMessages, setServerMessages] = React.useState<string[]>([]);
  var ws = React.useRef(new WebSocket("ws://192.168.0.236:8080/")).current;

  React.useEffect(() => {
    const serverMessagesList: string[] = [];
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
      serverMessagesList.push(e.data);
      setServerMessages([...serverMessagesList]);
    };
  }, []);
  const submitMessage = () => {
    ws.send(messageText);
    setMessageText("");
    setInputFieldEmpty(true);
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 30,
          backgroundColor: "#eeceff",
          padding: 5,
        }}
      >
        <Text>{serverState}</Text>
      </View>
      <View
        style={{
          backgroundColor: "#ffeece",
          padding: 5,
          flexGrow: 1,
        }}
      >
        <ScrollView>
          {serverMessages.map((item, ind) => {
            return <Text key={ind}>{item}</Text>;
          })}
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "black",
            flexGrow: 1,
            padding: 5,
          }}
          placeholder={"Add Message"}
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingTop: 30,
    padding: 8,
  },
});
