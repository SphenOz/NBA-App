import '../gesture-handler'
import { SafeAreaView, StyleSheet, Text, TextInput, View, Image, ScrollView, Button } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '../Auth/auth';
import axiosInstance from '../Auth/authInterceptor';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LS from './array-mapping';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-reanimated-table';

type Navi = {
  navigation: any
}
export default function Home({navigation} : {navigation: any}) {

    const [advanced, setAdvanced] = useState<boolean>(false);
    const [playerName, setPlayerName] = useState<string>()
    const [playerArray, setPlayerArray] = useState<any>([])
    const [latestSeason, setlatestSeason] = useState<Array<any>>([])
    const [teamPlayers, setTeamPlayers] = useState<any>([])
    const {team, logout} = useAuth();

    const t1Head= ['MPG','PPG','RPG','APG','SPG','BPG','TOV', 'PF']
    const t2Head= ['GP','FG%','3FG%','FT%','EFG%','TS%']
    

    useEffect(() => {
        getPlayers()
        setlatestSeason([])
        setPlayerName("")
    }, [team])

    const getPlayers = async() => {
        const response = await axiosInstance.get(`/playersOfTeam?teamToSearch=${team}`)
        console.log(response.data);
        setTeamPlayers(response.data)
    }
    const setSelectedPlayer = (p_name: string, p_stats: any) => {
        setPlayerName(p_name)
        setlatestSeason(p_stats)
    }

    const logOff = () => {
      logout()
      navigation.navigate("PlayerSearch")
    }

    const pGC = (index: number) => {
      return (Number(latestSeason[index])/Number(latestSeason[6])).toFixed(1)
    }
    const eFG = () => {
      const makes = ((latestSeason[LS["FGM"]]-latestSeason[LS["FG3M"]]) + 1.5*latestSeason[LS["FG3M"]])
      return ((makes/latestSeason[LS["FGA"]])*100).toFixed(1)
    }
    const tS = () => {
      const TSA = latestSeason[LS["FGA"]] + 0.44 * latestSeason[LS["FTA"]]
      return (latestSeason[LS["PTS"]] / ( 2 * TSA) * 100).toFixed(1)
    }
    const t1Body =[[pGC(LS["MIN"]), pGC(LS["PTS"]),pGC(LS["REB"]),pGC(LS["AST"]),pGC(LS["STL"]),pGC(LS["BLK"]),pGC(LS["TOV"]),pGC(LS["PF"])]]
    const t2Body = [[latestSeason[LS["GP"]], (latestSeason[LS["FG_PCT"]]*100).toFixed(1), (latestSeason[LS["FG3_PCT"]]*100).toFixed(1), (latestSeason[LS["FT_PCT"]]*100).toFixed(1), eFG(), tS()]]
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView horizontal={true} style={styles.player_select}>
                {teamPlayers.map((player: any, key: any ) => (
                    <TouchableOpacity onPress={() => setSelectedPlayer(player[0],player[1]) }>
                        <Image source={{uri: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player[1][0]}.png`}} key={key}
                        style = {{width: 130, height: 100, marginTop: 30, margin: 5, backgroundColor: 'white', borderWidth: 3, borderColor: '#898ECD'}}/>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.playerdisplay}>
                <Text style={{fontFamily: 'sans-serif-medium', fontSize: 30, color: 'white'}}>{playerName}</Text>
                <Image source={{
                    uri: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${latestSeason[0]}.png`
                }}
                style = {{width: 230, height: 180, marginTop: 20, marginBottom: 20, backgroundColor: 'white', borderWidth: 3, borderColor: '#898ECD'}}/>
                { advanced ?
                <>
                  <View style={styles.playerstats}>
                      <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>MPG{"\n"}{(Number(latestSeason[8])/Number(latestSeason[6])).toFixed(0)}</Text>
                      <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>PPG{"\n"}{(Number(latestSeason[26])/Number(latestSeason[6])).toFixed(1)}</Text>
                  </View>
                  <View style={styles.playerstats}>
                      <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>RPG{"\n"}{(Number(latestSeason[20])/Number(latestSeason[6])).toFixed(1)}</Text>
                      <Text style={{textAlignVertical: 'center', borderColor: '#7C86F7', backgroundColor: 'black', borderWidth: 3, fontSize: 30, margin: '2%', width: '35%', height: '90%', textAlign: 'center', borderRadius: 10, color: 'white'}}>APG{"\n"}{(Number(latestSeason[21])/Number(latestSeason[6])).toFixed(1)}</Text>
                  </View>
                </>
                :
                <View style={styles.a_playerstats}>
                  <View style={styles.a_ps_table}>
                    <Table style={{width: '85%'}} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                      <Row data={t1Head} style={{backgroundColor: "#607DDB"}} textStyle={styles.a_ps_text} />
                      <Rows data={t1Body} style={{backgroundColor: "#6B60DB"}} textStyle={styles.a_ps_text}/>
                    </Table>
                  </View>
                  {/*Converts Totals to Per Game*/}
                  <View style={styles.a_ps_table}>
                    <Table style={{width: '85%'}} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                      <Row data={t2Head} style={{backgroundColor: "#607DDB"}} textStyle={styles.a_ps_text} />
                      <Rows data={t2Body} style={{backgroundColor: "#6B60DB"}} textStyle={styles.a_ps_text}/>
                    </Table>
                  </View>
                </View>
                
                }
                {/*['PLAYER_ID', 'SEASON_ID', 'LEAGUE_ID', 'TEAM_ID', 'TEAM_ABBREVIATION', 'PLAYER_AGE', 'GP', 'GS', 'MIN', 'FGM', 'FGA', 'FG_PCT', 'FG3M', 'FG3A', 'FG3_PCT', 'FTM', 'FTA', 'FT_PCT', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS']*/}
            </View>
            <Button
              onPress={() => setAdvanced(!advanced)}
              title={advanced ? "Switch to Advanced Stats Display" : "Switch to Basic Stats Display"}
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
              />
            <View style={styles.footer}>
              <Button  title="logout" onPress={() => logOff()}/>
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
    flex: 1,
    // backgroundColor: 'white',
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
    flex: 4,
    width: '100%',
    alignItems: 'center',
    // backgroundColor: 'purple'
  },
  playerstats: {
    margin: '0%',
    padding: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    // backgroundColor: 'pink',
  },
  a_playerstats: {
    margin: '0%',
    padding: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontSize: 30,
    // backgroundColor: 'pink',
  },
  a_ps_text: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center'
  },
  a_ps_table: {
    width: '100%',
    margin: 5,
    alignItems: 'center'
  },
  footer: {
    flex: .3,
    width: '100%',
    backgroundColor: 'red',
    alignItems: 'center',
    marginTop: 10
  }
})