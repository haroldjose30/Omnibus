import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  map: {
    flex: 1
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
  searchForm: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row-reverse"
  },
  searchInput: {
    flex: 1,
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
    elevation: 2
  },
  floatButton: {
    width: 70,
    height: 70,
    backgroundColor: "yellow",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
