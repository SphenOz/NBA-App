import '../gesture-handler'
import { SafeAreaView, StyleSheet, Text, TextInput, View, Image } from "react-native";
import axios from "axios";
import { useState } from "react";
import { useAuth } from '../Auth/auth';

type Navi = {
  navigation: any
}
export default function Playersearch({navigation} : {navigation: any}) {

  const [playerName, setPlayerName] = useState<string>()
  const [playerArray, setPlayerArray] = useState<any>([])
  const [latestSeason, setlatestSeason] = useState<Array<any>>([])
  const {team} = useAuth();

  const dothing: any = async () => {
    const response = await axios.get(`http://10.0.2.2:8080/api/stats?name=${playerName}`)
    const len = response.data[1].length-1
    setlatestSeason(response.data[1][len])
    setPlayerArray(response.data)
    setPlayerName(playerArray[0])
    console.log(latestSeason)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playerdisplay}>
          <Text style={{fontFamily: 'sans-serif-medium', fontSize: 30, color: 'white'}}>{playerArray[0]}</Text>
          <Image source={{
            uri: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${latestSeason[0]}.png`
          }}
          style = {{width: 260, height: 220, marginTop: 30, marginBottom: 20, backgroundColor: 'white', borderWidth: 3, borderColor: '#898ECD'}}/>
          <View style={styles.playerstats}>
            <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '5%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>MPG{"\n"}{(Number(latestSeason[8])/Number(latestSeason[6])).toFixed(0)}</Text>
            <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '5%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>PPG{"\n"}{(Number(latestSeason[26])/Number(latestSeason[6])).toFixed(2)}</Text>
          </View>
          <View style={styles.playerstats}>
            <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '5%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>RPG{"\n"}{(Number(latestSeason[20])/Number(latestSeason[6])).toFixed(2)}</Text>
            <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '5%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>APG{"\n"}{(Number(latestSeason[21])/Number(latestSeason[6])).toFixed(2)}</Text>
          </View>
      </View>
      <View style={styles.footer}>
        <TextInput style={styles.textInput} onChangeText={text => setPlayerName(text)} onSubmitEditing={() => dothing()}>{team}</TextInput>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0312',
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
    // backgroundColor: 'blue',
    width: '100%',
    marginTop: "5%",
    alignItems: 'center',
  },
  playerstats: {
    margin: '0%',
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    // backgroundColor: 'pink',
  },
  footer: {
    flex: .8,
    width: '100%',
    backgroundColor: 'red',
    alignItems: 'center'
  }
})