import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  form: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
  },
  textInputTitle: {
    fontSize: 16,
    marginBottom:8,
    marginLeft: 15,    
  },
  textInput: {
    height: 50,
    backgroundColor: "#FFF",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    textShadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2,
    marginBottom:4,
  },
  textInputError: {
    marginRight: 15,   
    color: "red", 
    marginBottom:24,
    textAlign:"right"
   
  },
  button: {
    height: 50,
    backgroundColor: "#ecb911",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    flexDirection: "row"
  },
});
