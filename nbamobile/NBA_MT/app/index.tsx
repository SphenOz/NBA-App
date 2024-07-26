import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import axios from "axios";
import { useState } from "react";

export default function Index() {

  const [playerName, setPlayerName] = useState<String>()

  const dothing: any = async () => {
    console.log(playerName)
    const response = await axios.get(`http://10.0.2.2:8080/api/stats?name=${playerName}`)
    console.log(response.data)
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.textInput} onChangeText={text => setPlayerName(text)} onSubmitEditing={() => dothing()}>Sup</TextInput>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#78C0E6',
    textAlign: 'center',
    borderWidth: 1,
    padding: 7,
    margin: 10,
    width: '50%',
    fontSize: 25
  }
})