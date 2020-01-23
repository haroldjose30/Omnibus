import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  form: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
  },
  inputsText: {
    fontSize: 16,
    marginBottom:8,
    marginLeft: 15,    
  },
  inputs: {
    height: 50,
    marginBottom:24,
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
    elevation: 2
  },
  button: {
    height: 50,
    backgroundColor: "yellow",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    flexDirection: "row"
  },
});
