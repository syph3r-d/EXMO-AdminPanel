import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

class MapContainer extends Component {
  state = {
    marker: { lat: 6.795178614237275, lng: 79.90102643723809 },
  };

  handleMarkerClick = (mapProps, map, event) => {
    console.log(mapProps, map, event.latLng);
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);

    this.setState(() => ({
      marker: { lat, lng },
    }));
    this.props.onMapLocationChange(lat, lng);
  };

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        initialCenter={{ lat: 6.795178614237275, lng: 79.90102643723809 }} // Default center coordinates
        containerStyle={{ width: "640px", height: "250px" }}
        onClick={this.handleMarkerClick}
      >
        <Marker
          position={{ lat: this.state.marker.lat, lng: this.state.marker.lng }}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAbPPdvTCexjs4yABNdK3PDT2U837MbtH4",
})(MapContainer);
