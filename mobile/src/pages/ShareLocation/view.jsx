import React from "react";
import { Image, Text, View, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from './styles';


const Jsx = (props) => {
    const {
        type,
        buttonCallBack,
        busline_code,
        setBusline_code,
        busline_name,
        setBusline_name,
        errors,
    } = props;
  
    const {busline_code_error,busline_name_error} = errors

    const buttonText = (type == 'search' ? 'Pesquisar' : 'Embarcar')
    const buttonIcon = (type == 'search' ? 'search' : 'gps-fixed')

    return (
        <>

            <View style={styles.form}>
                <Text style={styles.textInputTitle}>Número da Linha</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="022"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    value={busline_code}
                    onChangeText={setBusline_code} />
                <Text style={styles.textInputError}>{busline_code_error}</Text>

                <Text style={styles.textInputTitle}>Nome da Linha</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="INTER BAIRROS II"
                    placeholderTextColor="#999"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    value={busline_name}
                    onChangeText={setBusline_name} />
                <Text style={styles.textInputError}>{busline_name_error}</Text>


                <TouchableOpacity onPress={() => { buttonCallBack() }} style={styles.button}>
                    <MaterialIcons name={buttonIcon} size={30} color="black" />
                    <Text>  {buttonText}</Text>
                </TouchableOpacity>

            </View>
        </>
    );
};


export default Jsx