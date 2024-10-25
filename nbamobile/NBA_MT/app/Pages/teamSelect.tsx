import { SafeAreaView, StyleSheet, Text, TextInput, View, Image, Touchable, TouchableOpacity } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import team_logos from '../images'
import { TouchableHighlight } from "react-native-gesture-handler";
import axiosInstance from "../Auth/authInterceptor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../Auth/auth";

export default function TeamSelect({ navigation }: any) {

    const teams = [
        { label: "Atlanta Hawks", value: 'ATL' },
        { label: "Boston Celtics", value: 'BOS' },
        { label: "Brooklyn Nets", value: 'BKN' },
        { label: "Charlotte Hornets", value: 'CHA' },
        { label: "Chicago Bulls", value: 'CHI' },
        { label: "Cleveland Cavaliers", value: 'CLE' },
        { label: "Dallas Mavericks", value: 'DAL' },
        { label: "Denver Nuggets", value: 'DEN' },
        { label: "Detroit Pistons", value: 'DET' },
        { label: "Golden State Warriors", value: 'GSW' },
        { label: "Houston Rockets", value: 'HOU' },
        { label: "Indiana Pacers", value: 'IND' },
        { label: "LA Clippers", value: 'LAC' },
        { label: "Los Angeles Lakers", value: 'LAL' },
        { label: "Memphis Grizzlies", value: 'MEM' },
        { label: "Miami Heat", value: 'MIA' },
        { label: "Milwaukee Bucks", value: 'MIL' },
        { label: "Minnesota Timberwolves", value: 'MIN' },
        { label: "New Orleans Pelicans", value: 'NOP' },
        { label: "New York Knicks", value: 'NYK' },
        { label: "Oklahoma City Thunder", value: 'OKC' },
        { label: "Orlando Magic", value: 'ORL' },
        { label: "Philadelphia 76ers", value: 'PHI' },
        { label: "Phoenix Suns", value: 'PHX' },
        { label: "Portland Trail Blazers", value: 'POR' },
        { label: "Sacramento Kings", value: 'SAC' },
        { label: "San Antonio Spurs", value: 'SAS' },
        { label: "Toronto Raptors", value: 'TOR' },
        { label: "Utah Jazz", value: 'UTA' },
        { label: "Washington Wizards", value: 'WAS' }
    ];
    const {team, setTeam, token} = useAuth();
    useEffect(() => {
        console.log(team)
    },[team])
    
    const postTeam = async(key: string) =>{
        try{
            console.log("Setting Team: ", token)
            const response = await axiosInstance.put(`/set_team?team=${key}`)
            setTeam(response.data)
            AsyncStorage.setItem('team',response.data)
            navigation.navigate('Home')
        }
        catch{

        }
        finally{
            
        }
    }

    

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.team_select}>
                <Text style={{color: 'white', fontWeight: 800}}>Congrats on creating your Account, Please select a team</Text>
                {team ? <Text style={{color: 'white', fontWeight: 800, fontSize: 30, textAlign: 'center'}}>Press the Logo to confirm your selection</Text> : null}
            </View>
            <View style={styles.team_dropdown}>
                <Dropdown data={teams} labelField={"label"} valueField={"value"} onChange={item => setTeam(item.value)}
                    style={dropdown_styles.dropdown} placeholderStyle={dropdown_styles.placeholderStyle}
                    selectedTextStyle={dropdown_styles.selectedTextStyle} itemContainerStyle={dropdown_styles.itemContainerStyle}
                    search maxHeight={300}
                    placeholder={team ? team : "Select a team"}>
                </Dropdown>
                <TouchableOpacity onPress={() => postTeam(team)}>
                    <Image style={{width: 300, height: 300, alignSelf:"center"}} source={team_logos[team]}/>
                </TouchableOpacity>
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
    team_select: {
        flex: 1,
        justifyContent: 'center',
        color: 'white'
    },
    team_dropdown: {
        flex: 1,
        backgroundColor: '#7C86F7',
        width: '90%'
    }
  })

  const dropdown_styles = StyleSheet.create({
    dropdown: { 
        margin: 16,
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 12,
        padding: 5,

    },
    placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
    itemContainerStyle: {
        backgroundColor: "#6B95E3"
    }
  })