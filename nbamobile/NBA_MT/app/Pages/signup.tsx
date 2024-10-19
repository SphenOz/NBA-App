import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Platform, KeyboardAvoidingView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../Auth/auth";
import axiosInstance from "../Auth/authInterceptor";

export default function Signup () {
    const {login} = useAuth();
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [validPassowrd, setValidPassowrd] = useState<boolean>(false)
    const [validUsername, setvalidUsername] = useState<boolean>(false)
    const userRegex = /^[0-9A-Za-z]{6,20}$/
    const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/

    useEffect(() => {
        setvalidUsername(userRegex.test(username))
    }, [username])
    useEffect(() => {
        setValidPassowrd(passwordRegex.test(password))
    }, [password])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try{
            const response = await axiosInstance.post(`signup?username=${username}&password=${password}`)
            console.log(response.data)
            setTimeout(() => {
                
            }, 1000)
            await handleLogin();
            setTimeout(() => {
                console.log("success")
            }, 500)
        }catch (error:any) {
            console.error(error)
        }
    }
    const handleLogin = async () => {
        try {
            const response = await axiosInstance.get(`login?username=${username}&password=${password}`)
            console.log("Login Successful", response.data.token)
            login(response.data.token)
            // login(response.data.token)
            // await sleep(500)
            // const userN = await axiosInstance.get(`/username`)
            // setUsername(userN.data)
            // Redirect or update state to reflect logged-in status
        } catch (error: any) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.signupbox}>
                <Text style={{fontSize: 30, marginTop: 10, marginBottom: 30}}>SignUp</Text>
                <TextInput 
                    style={styles.textInput} 
                    placeholder="Username"
                    textContentType="username"
                    maxLength={30}
                    onChangeText={text => setUsername(text)}>
                </TextInput>
                {validUsername && username != "" ? null : 
                    <Text style={{marginLeft: 40, color: 'red', fontFamily: 'Roboto', fontSize: 15, fontWeight: 800, alignSelf: 'flex-start',}}>Username minimum length include 6, letters and numbers only</Text>}
                <TextInput 
                    style={styles.textInput} 
                    textContentType="password"
                    placeholder="Password"
                    secureTextEntry={true}
                    maxLength={30}
                    onChangeText={text => setPassword(text)}>
                </TextInput>
                {validPassowrd ? null : 
                    <Text style={{marginLeft: 40, color: 'red', fontFamily: 'Roboto', fontSize: 15, fontWeight: 800, alignSelf: 'flex-start',}}>Password must include 8-32 characters, 1 letter and 1 number required</Text>}
                <Button title="Submit" onPress={(e) => handleSubmit(e)}></Button>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0312',
        alignItems: 'center',
        justifyContent: 'center'
      },
      textInput: {
        backgroundColor: '#78C0E6',
        textAlign: 'center',
        borderWidth: 1,
        padding: 7,
        margin: 10,
        marginTop: 40,
        width: '70%',
        fontSize: 25
      },
      signupbox: {
        backgroundColor: '#5391DB',
        borderWidth: 3,
        borderColor: "#7C86F7",
        width: "70%",
        height: "60%",
        alignItems: "center",
        minHeight: 400
      }
})