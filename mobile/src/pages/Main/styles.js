import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  map: {
    flex: 1
  },
  mapBlank:{
    textAlign: "center",
    marginTop: 50,
    color: "#666",
    fontSize: 16,
  },
  mapBusMarckIcon: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "transparent",
    backgroundColor: "transparent"
  },
  mapBusMarckText: {
    textAlign: "center"
  },
  mapBusMarckCallout: {
    width: 260
  },
  mapBusMarckCalloutTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },
  mapBusMarckCalloutSubTitle: {
    textAlign: "center",
    marginTop: 5,
    color: "#666"
  },
  floatButtonSearch: {
    position: "absolute",
    top: 20,
    right:20,
    width: 70,
    height: 70,
    backgroundColor: "yellow",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  },
  floatButtonShare: {
    position: "absolute",
    bottom: 20,
    right:20,
    width: 70,
    height: 70,
    backgroundColor: "yellow",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
