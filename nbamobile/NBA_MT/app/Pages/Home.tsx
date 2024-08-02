import '../gesture-handler'
import { SafeAreaView, StyleSheet, Text, TextInput, View, Image, ScrollView } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '../Auth/auth';
import axiosInstance from '../Auth/authInterceptor';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Navi = {
  navigation: any
}
export default function Playersearch({navigation} : {navigation: any}) {

    const [playerName, setPlayerName] = useState<string>()
    const [playerArray, setPlayerArray] = useState<any>([])
    const [latestSeason, setlatestSeason] = useState<Array<any>>([])
    const [teamPlayers, setTeamPlayers] = useState<any>([])
    const {team} = useAuth();

    useEffect(() => {
        getPlayers()
        setlatestSeason([])
        setPlayerName("")
    }, [team])

    const getPlayers = async() => {
        const response = await axiosInstance.get(`/playersOfTeam?team=${team}`)
        console.log(response.data);
        setTeamPlayers(response.data)
    }
    const setSelectedPlayer = (p_name: string, p_stats: any) => {
        setPlayerName(p_name)
        setlatestSeason(p_stats)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView horizontal={true} style={styles.player_select}>
                {teamPlayers.map((player: any, key: any ) => (
                    <TouchableOpacity onPress={() => setSelectedPlayer(player[0],player[1]) }>
                        <Image source={{uri: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player[1][0]}.png`}} key={key}
                        style = {{width: 130, height: 90, marginTop: 30, margin: 5, backgroundColor: 'white', borderWidth: 3, borderColor: '#898ECD'}}/>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.playerdisplay}>
                <Text style={{fontFamily: 'sans-serif-medium', fontSize: 30, color: 'white'}}>{playerName}</Text>
                <Image source={{
                    uri: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${latestSeason[0]}.png`
                }}
                style = {{width: 230, height: 180, marginTop: 30, marginBottom: 20, backgroundColor: 'white', borderWidth: 3, borderColor: '#898ECD'}}/>
                <View style={styles.playerstats}>
                    <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>MPG{"\n"}{(Number(latestSeason[8])/Number(latestSeason[6])).toFixed(0)}</Text>
                    <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>PPG{"\n"}{(Number(latestSeason[26])/Number(latestSeason[6])).toFixed(2)}</Text>
                </View>
                <View style={styles.playerstats}>
                    <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>RPG{"\n"}{(Number(latestSeason[20])/Number(latestSeason[6])).toFixed(2)}</Text>
                    <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>APG{"\n"}{(Number(latestSeason[21])/Number(latestSeason[6])).toFixed(2)}</Text>
                </View>
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
  player_select: {
    flex: 2,
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
    width: '100%',
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