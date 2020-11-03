import React from 'react';
import {
    Text, View, StyleSheet,
    TextInput, Button,
    TouchableHighlight, Image,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    FlatList,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Container, Root, Toast } from 'native-base';



export default class map extends React.Component {
    constructor() {
        super();
        this.state = {
            arrPlace: [],
            mapData: [],

        }
    }
    componentDidMount = async () => {


        var getData = await AsyncStorage.getItem('PlacesLocation')

        //console.log("PlacesLocation==" + JSON.stringify(getData))
        this.setState({ arrPlace: JSON.parse(getData) })

        console.log("PlacesLocation:====" + JSON.stringify(this.state.arrPlace))
        // this.mapData()

    }

    static geterror_Toast(message) {
        return Toast.show({ text: message, type: "danger", position: 'bottom' })
    }

    mapData = () => {
        console.log("PlacesLocation:===" + JSON.stringify(this.state.arrPlace))
        if (this.state.arrPlace === null) {
            map.geterror_Toast('Data Not Found Please Go to Setting And Cheak')
        } else {
            return (
                markers = Object.keys(this.state.arrPlace).map(key => {
                    const mark = this.state.arrPlace[key];
                    //console.log("here:---" + JSON.stringify(mark))
                    console.log('location let:==' + mark.placeLatitude)
                    console.log("location lon:==" + mark.placeLongitude)
                    console.log("Place Id :=="+mark.pkPlace)
                    return (
                        marker = (
                            <Marker
                                key={key}
                                coordinate={{ latitude: parseFloat(mark.placeLatitude), longitude: parseFloat(mark.placeLongitude) }}
                            >
                                <Callout onPress={() => this.props.navigation.navigate('Detail', { PlaceId: mark.pkPlace })}>
                                    <Text>{mark.name}</Text>
                                    <TouchableOpacity >
                                        <Image
                                            source={require('./Images/info.png')}
                                            style={{ height: 20, width: 20, tintColor: '#0290ED' }}
                                        />
                                    </TouchableOpacity>
                                </Callout>

                            </Marker>

                        )
                    )
                })

            )
        }

    }


    render() {

        return (
            <Root>
                <Container>
                    <View style={styles.MainContainer}>

                        <MapView
                            ref={map => this.map = map}
                            style={styles.mapStyle}
                            showsUserLocation={false}

                            zoomEnabled={true}
                            zoomControlEnabled={true}
                            initialRegion={{
                                latitude: 40.7389401,
                                longitude: -74.0302714,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}>

                            {this.mapData()}

                        </MapView>

                    </View>
                </Container>
            </Root>
        )
    }
}


const styles = StyleSheet.create(
    {
        MainContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'flex-end',
            // backgroundColor:'yellow'
        },
        mapStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },

    }
);