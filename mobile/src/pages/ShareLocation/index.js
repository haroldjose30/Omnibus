import React, { useState } from "react";
import Jsx from './view'

function ShareLocation({ navigation }) {

    //get navigations params
    const {
        type,
        buttonCallBack,
        inputBusLineCodeValue,
        inputBusLineNameValue,
        inputBusLineCodeRequired,
        inputBusLineNameRequired,
    } = navigation.state.params

    //store states
    const [busline_code, setBusline_code] = useState(inputBusLineCodeValue);
    const [busline_name, setBusline_name] = useState(inputBusLineNameValue);
    const [errors, setErrors] = useState({});


    function buttonOnPress() {

        //validate  code
        if (inputBusLineCodeRequired && !busline_code && busline_code.trim() == "") {
            setErrors({busline_code_error:'campo obrigatório'})
            return;
        }

        //validate name
        if (inputBusLineNameRequired && !busline_name && busline_name.trim() == "") {
            setErrors({busline_name_error:'campo obrigatório'})
            return;
        }
        
        navigation.goBack();
        buttonCallBack(busline_code, busline_name);
    }


    return <Jsx
        type={type}
        buttonCallBack={buttonOnPress}
        busline_code={busline_code}
        setBusline_code={setBusline_code}
        busline_name={busline_name}
        setBusline_name={setBusline_name}
        errors={errors}
    />
}

export default ShareLocation;