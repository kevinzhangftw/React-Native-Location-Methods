import React from 'react';
import { Text } from 'react-native'
import { MapView, Location, Permissions } from 'expo'

const haversineDistance = (coords1, coords2) => {
  function toRad(x) {
    return x * Math.PI / 180
  }
  lon1 = coords1.longitude
  lat1 = coords1.latitude
  lon2 = coords2.longitude
  lat2 = coords2.latitude
  R = 6371000 // meters
  x1 = lat2 - lat1
  dLat = toRad(x1)
  x2 = lon2 - lon1
  dLon = toRad(x2)
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  d = R * c
  return d
}

const isTechnicianOnSite = (currentLatLng, jobLatLng) => {
  distance = haversineDistance(currentLatLng, jobLatLng)
  if (distance < 150){
    return true
  }else{
    return false
  }
}

const isTravelling = speed => {
  console.log('speed in travelling:', speed)
  return speed <= 0 ? false : true
}

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeInterval: 20000, distanceInterval: 100 }

export default class App extends React.Component {
  // state = {
  //   locationResult: null
  // }

  // _getLocationAsync = async () => {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //   this.setState({
  //   locationResult: 'Permission to access location was denied',
  //   })
  //   }
  //   let location = await Location.getCurrentPositionAsync({})
  //   this.setState({ locationResult: location })
  // }

  componentDidMount() {
    Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged)
  }

  locationChanged = (location) => {
    region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
    },
    this.setState({location, region})
  }

  render() {
    if (this.state.locationResult){
      currentLatLng = {
        latitude: this.state.locationResult.coords.latitude,
        longitude: this.state.locationResult.coords.longitude,
      }

      mockJobLatLng1 = {
        latitude: 49.2813308,
        longitude: -122.9570799,
      }
      mockJobLatLng2 = {
        latitude: 49.2784421,
        longitude: -123.1149881,
      }
      console.log('currentlatlng', currentLatLng)
      console.log('istechnicianonsite:', isTechnicianOnSite(currentLatLng, mockJobLatLng2))
      console.log("istravelling:", isTravelling(this.state.locationResult.coords.speed))
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: this.state.locationResult.coords.latitude,
            longitude: this.state.locationResult.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <MapView.Marker
            coordinate={currentLatLng}
            title='Current Location'
            description='Current Location Marker'
          />
        </MapView>
      )
    }else{
      return (
        <Text>Loading ...</Text>
      )
    }
  }
}
