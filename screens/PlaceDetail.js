import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Image,
    Dimensions
} from "react-native";
import StarRating from 'react-native-star-rating'

import { SliderBox } from "react-native-image-slider-box";
import MapView, { Marker, Callout  } from 'react-native-maps';
import {key} from '../googleAPIKey';


import { Button, Block, Text, theme } from "galio-framework";

import {  Icon, Input } from "../components";
const { width } = Dimensions.get('screen');


class PlaceDetail extends Component {

    getPlaceDetails = ()=>{
        const place_id = this.props.navigation.getParam('place_id');
        let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,geometry,photos,rating,formatted_phone_number&key=${key}`
        // console.log(url);
        fetch(url)
            .then(res => res.json())
            .then(result => {
                let res = result.result;
                let photos = [];
                res.photos.forEach(photo => {
                    let url = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&sensor=false&maxheight=${photo.height}&maxwidth=${photo.width}&key=${key}`
                    photos.push(url);
                })
                    let location = {
                        latitude: res.geometry.location.lat, 
                        longitude: res.geometry.location.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }
                    this.setState({images:photos, name: res.name, location: location,  rating: res.rating });

                

                // console.log(this.state);
        });
    }

    componentWillMount = ()=>{
        this.getPlaceDetails();
    }

    state = {
        place_id : this.props.navigation.getParam('item').place_id,
        place_types: this.props.navigation.getParam('item').type, // array
        images:[],
        name:"",
        location:{
            latitude: 33.7126467,
            longitude: 73.0871031,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        },
        rating:0,


        // images: [
        //   "https://source.unsplash.com/1024x768/?nature",
        //   "https://source.unsplash.com/1024x768/?water",
        //   "https://source.unsplash.com/1024x768/?girl",
        //   "https://source.unsplash.com/1024x768/?tree", // Network image
        //           // Local image
        // ],
        mapRegion: { 
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }
      };
    renderImages = ()=>{
        return(
            <Block flex style={styles.container}>
                
            <Block shadow flex={2.5} center style={{width: width*0.9}} >
                 <SliderBox
                images={this.state.images}
                sliderBoxHeight={200}
                onCurrentImagePressed={index =>
                    console.warn(`image ${index} pressed`)
                }
                autoplay
                circleLoop
            />
            </Block>
            <Block shadow flex={2} style={{backgroundColor: '#f5f5f5', borderRadius: 2, marginBottom: 2 , width:width*0.9}}>
            <Block  left flex={1} style={{paddingTop: 10, paddingLeft: 5}} >
            <Text h4>{this.state.name}</Text>
            <StarRating
                        disable={true}
                        maxStars={5}
                        rating={this.state.rating}
                        starSize={20}
                        fullStarColor={'tomato'}

                    />
            </Block>
            <Block center flex={1} style={{marginTop: 2, paddingTop: 5}}>
                <Button  round size="small"  color="#ff6347" shadowless onPress={()=>{
                    this.props.navigation.navigate("PlanChoice", {
                        place_id: this.state.place_id, 
                        name: this.state.name,
                        images: this.state.images,
                        location: this.state.location,
                        types: this.state.place_types
                    })
                    }} >Plan</Button>
            </Block>
            </Block>
            <Block flex={0.2}></Block>
            <Block shadow center flex={3} style={{marginTop: 5}} >
            <MapView  showsUserLocation
                provider={"google"}
                style={styles.mapStyle}
                region={this.state.location}
                showsUserLocation
                showsMyLocationButton
                showsPointsOfInterest
                // onRegionChange={this.onRegionChange}
                // onUserLocationChange={this.handleChangeLocation}
                >
                    <Marker 
                        coordinate = {{
                        latitude: this.state.location.latitude,
                        longitude: this.state.location.longitude
                        }}
                        title={this.state.name}
                    >
                        {/* <Callout >
                            <View >
                            <Text>{this.state.name}</Text>
                            </View>
                        </Callout> */}
                    </Marker>
                    {/* {this.state.followingUserMarkers} */}
            </MapView>   
            </Block>
            
            </Block>
        );
    }


    render() {
        return (
            // <View style={{ height: 130, width: 130, marginLeft: 20, borderWidth: 0.5, borderColor: '#dddddd' }}>
            //     <View style={{ flex: 2 }}>
            //         <Image source={{uri:this.props.imageUri}}
            //             style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
            //         />
            //     </View>
            //     <View style={{ flex: 1, paddingLeft: 10, paddingTop: 10 }}>
            //         <Text>{this.props.name}</Text>
            //     </View>
            // </View>

            <Block flex center style={styles.home}>
                {this.renderImages()}
            </Block>
        );
    }
}
export default PlaceDetail;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        
    },
    home: {
        width: width,    
      },
      articles: {
        width: width,
        paddingVertical: theme.SIZES.BASE,
      },
      mapStyle: {
        borderRadius: 4,
        width: Dimensions.get('window').width*0.9,
        height: Dimensions.get('window').height/3.5,
      },
});