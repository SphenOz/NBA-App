import { SafeAreaView, StyleSheet, Text, TextInput, View, Image } from "react-native";
import axios from "axios";
import { useState } from "react";

export default function Index() {

  const [playerName, setPlayerName] = useState<String>()
  const [playerArray, setPlayerArray] = useState<any>()
  const [latestSeason, setlatestSeason] = useState<Array<any>>([])

  const dothing: any = async () => {
    const response = await axios.get(`http://10.0.2.2:8080/api/stats?name=${playerName}`)
    console.log(response.data)
    const len = response.data[1].length-1
    setlatestSeason(response.data[1][len])
    setPlayerArray(response.data)
    setPlayerName(playerArray[0])
    console.log(latestSeason)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playerdisplay}>
          <Text>{playerName}</Text>
          <Image source={{
            uri: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${latestSeason[0]}.png`
          }}
          style = {{width: 200, height: 200, marginTop: 30}}/>
          <View style={styles.playerstats}>
            <Text style={{borderColor: 'black', borderWidth: 2, fontSize: 30, margin: '5%', width: '35%', height: '100%', textAlign: 'center'}}>MPG</Text>
            <Text style={{borderColor: 'black', borderWidth: 2, fontSize: 30, margin: '5%', width: '35%', height: '100%', textAlign: 'center'}}>PPG</Text>
          </View>
          <View style={styles.playerstats}>
            <Text style={{borderColor: 'black', borderWidth: 2, fontSize: 30, margin: '5%', width: '35%', height: '100%', textAlign: 'center'}}>APG</Text>
            <Text style={{borderColor: 'black', borderWidth: 2, fontSize: 30, margin: '5%', width: '35%', height: '100%', textAlign: 'center'}}>RPG</Text>
          </View>
      </View>
      <View style={styles.footer}>
        <TextInput style={styles.textInput} onChangeText={text => setPlayerName(text)} onSubmitEditing={() => dothing()}>Sup</TextInput>
      </View>
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
  },
  playerdisplay: {
    flex: 5,
    backgroundColor: 'blue',
    width: '100%',
    marginTop: "5%",
    alignItems: 'center',
  },
  playerstats: {
    margin: '5%',
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'pink'
  },
  footer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'red',
    alignItems: 'center'
  }
})