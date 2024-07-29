import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup () {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [validPassowrd, setValidPassowrd] = useState<boolean>(false)
    const [validUsername, setvalidUsername] = useState<boolean>(false)
    const userRegex = /^[0-9A-Za-z]{6,20}$/
    const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/

    useEffect(() => {
        console.log(userRegex.test(username), username)
        setvalidUsername(userRegex.test(username))
    }, [username])
    useEffect(() => {
        console.log(passwordRegex.test(password), password)
        setValidPassowrd(passwordRegex.test(password))
    }, [password])

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
                {validUsername ? null : 
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