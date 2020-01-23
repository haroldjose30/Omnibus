import React, { useState } from "react";
import Jsx from './view'

function ShareLocation({ navigation }) {
    const [busline_code, setBusline_code] = useState("");
    const [busline_name, setBusline_name] = useState("");

    const {type,buttonCallBack} = navigation.state.params 

    function buttonOnPress(arg1,arg2){
        navigation.goBack();
        buttonCallBack(arg1,arg2);
    }

    
    return <Jsx 
                type={type}
                buttonCallBack={buttonOnPress}
                busline_code={busline_code}
                setBusline_code={setBusline_code}
                busline_name={busline_name}
                setBusline_name={setBusline_name}
                />
}

export default ShareLocation;