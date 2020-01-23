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
    } = props;

    const buttonText = (type=='search' ? 'Pesquisar' : 'Embarcar' )
    const buttonIcon = (type=='search' ? 'search' : 'gps-fixed' )

    return (
        <>

            <View style={styles.form}>
                <Text style={styles.inputsText}>Número da Linha</Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="022"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    autoCorrect={false}
                    value={busline_code}
                    onChangeText={setBusline_code}
                />

                <Text  style={styles.inputsText}>Nome da Linha</Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="INTER BAIRROS II"
                    placeholderTextColor="#999"
                    autoCorrect={false}
                    value={busline_name}
                    onChangeText={setBusline_name}
                />

                <TouchableOpacity onPress={() => { buttonCallBack(busline_code,busline_name) }} style={styles.button}>
                    <MaterialIcons name={buttonIcon} size={20} color="black" />
                    <Text>  {buttonText}</Text>
                </TouchableOpacity>

            </View>
        </>
    );
};


export default Jsx