import '../gesture-handler'
import { SafeAreaView, StyleSheet, Text, TextInput, View, Image, ScrollView, Button } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '../Auth/auth';
import axiosInstance from '../Auth/authInterceptor';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LS from './array-mapping';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-reanimated-table';
import team_logos from '../images'

type Navi = {
  navigation: any
}

function gameTab() {
    return(
        <View style={styles.gameTab}>
            <Text>Hi</Text>
        </View>
    )
}
export default function GameView({navigation} : {navigation: any}) {
    const {team} = useAuth();
    const [gameLogs, setGameLogs] = useState<any>([])
    const [expanded, setExpanded] = useState<any>(null)
    const [moreDetails, setMoreDetails] = useState<any>(false)

    useEffect(() => {
        getGames()
    },[team])
    const getGames = async() => {
        const response = await axiosInstance.get(`/team_games?team=${team}`)
        console.log(response.data[0].GAME_DATE)
        setGameLogs(response.data)
    }
    return(
        <SafeAreaView style={styles.container}>
            {!moreDetails ? 
                <View style={styles.tabContainer}>
                    {gameLogs.map((game: any, key: any) => (
                        <View style={[styles.gameTab, game.WL == "W" ? {backgroundColor: "green"} : {backgroundColor: "red"},expanded === key ? {height: "10%"}:{height: "7%"}]}>
                            {gameLogs.length > 0 ? (<>
                                <TouchableOpacity key={key} style={[styles.details]} 
                                    onPress={() => setExpanded(expanded === key ? null : key)}>
                                    <Text style={{padding: 5, color: "white", textAlign: 'left', fontSize: 15, width: "auto"}}>
                                        {`${game.GAME_DATE} ${game.MATCHUP} ${game.WL} ${game.W} - ${game.L}`}
                                    </Text>
                                    <TouchableOpacity style={{padding: 5}} onPress={() => setMoreDetails(!moreDetails)}>
                                        <Text style={{color: "blue"}}>More Details</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                {expanded === key && (
                                    <View style={{}}>
                                        <Text style={{color: "white", fontSize: 15, padding: 5}}>{`PTS: ${game.PTS} | REBS: ${game.REB} | ASTS: ${game.AST}`} </Text>
                                    </View>
                                )}
                                </>
                            ) : (
                                <Text style={{ color: "white" }}>Loading...</Text> // Placeholder or message while loading
                            )}
                        </View>
                    ))}
                </View>
                :<>
                <View style={styles.header}>
                    <TouchableOpacity style={{padding: 5, marginTop: 15}} onPress={() => setMoreDetails(!moreDetails)}>
                        <Text style={{color: "blue"}}>Go Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.banner}>
                    <Image style={{width: 200, height: 200}} source={team_logos[team]}/>
                    <Text style={{fontSize: 30, color: "white"}}>VS</Text>
                    <Image style={{width: 200, height: 200}} source={team_logos["BOS"]}/>
                </View>
                <View style={styles.stats}>
                </View></>
            }
            <View style={styles.footer}>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0A0312',
      alignItems: 'center',
    },
    tabContainer:{
        flex: 5, 
        width: "90%", 
        padding: "3%",
    },
    gameTab: {
        backgroundColor: 'red',
        width: "auto",
        height: "7%",
        borderRadius: 10,
        margin: "1%",
    },
    details:{
      flexDirection: 'row',
      marginTop: "1%"
    },
    buttonText: {
      color: '#FFFFFF',           // Text color
      fontSize: 16,               // Font size
      textAlign: 'center',        // Center text
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
    footer: {
      flex: .5,
      width: '100%',
      backgroundColor: '#7C86F7',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 10
    },
    header: {
        flex: .5,
        width: '100%',
        backgroundColor: '#7C86F7',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    banner: {
        flex: 2,
        width: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    stats: {
        flex: 3,
        width: '100%',
    }
  })