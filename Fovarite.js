import React from 'react';
import {
    Text, View, StyleSheet, TextInput, Button, TouchableHighlight, Image, TouchableOpacity, AsyncStorage, ImageBackground, Dimensions,
    ActivityIndicator

} from 'react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { FlatList } from 'react-native-gesture-handler';
import PageControl from 'react-native-page-control';
import moment from "moment";
const { width, height } = Dimensions.get('window');
import { Container, Root, Toast } from 'native-base';

var converTime = require('convert-time');
export default class Fovarite extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            arrAllFavoritePlace: [],
        }
    }

    componentDidMount = () => {
        this.closeActivityIndicator();
        this.fetchData();

    }

    static geterror_Toast(message) {
        return Toast.show({ text: message, type: "danger", position: 'bottom' })
    }
    static getTimeOutToast_Toast(message) {
        return Toast.show({ text: "Request time out,Please check your internet connection!", type: "warning", position: 'bottom' })
    }
    static getSucess_Toast(message) {
        return Toast.show({ text: message, type: "success", position: 'bottom' })
    }

    fetchData = async () => {

        //---Time---
        var getTime = String();
        getTime = await AsyncStorage.getItem('time')
        var time = converTime(getTime)
        time.toString();
        console.log("TimeData::=====" +time)
        //----Day----
        var day = moment().format('dddd');
        console.log("toDay:---" + day)
        //---getUDID---
        var favUniqueId = getUniqueId();
        console.log("UDID:---" + favUniqueId)

        fetch('http://ec2-18-224-24-126.us-east-2.compute.amazonaws.com/APIs/Services.php?Service=getAllFavouritePlaces', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "startTime": getTime.toString(),
                "weekDay": day.toString(),
                "UDID": favUniqueId.toString()
                // "startTime": "22:00",
                // "weekDay": "Sunday",
                // "UDID": "BEA9C9D2-D1BE-4936-88A7-5B6E9278B3B6"
            })
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.status == "success") {
                    //Fovarite.getSucess_Toast(responseJson.message);
                    console.log("Favorite All Data:-" + JSON.stringify(responseJson.favouritPlaces))

                    this.setState({ arrAllFavoritePlace: responseJson.favouritPlaces, loading: false });
                    console.log("favouriteGetData:--" + JSON.stringify(this.state.arrAllFavoritePlace))
                } else {
                   // Fovarite.geterror_Toast(responseJson.message);
                    this.setState({ loading: false });
                    console.log("error:==" + JSON.stringify(responseJson.message))
                    return
                }
            }).catch((error) => {
                setTimeout(function () {
                    this.setState({ loading: false });
                    Fovarite.getTimeOutToast_Toast(error)
                }.bind(this), 500);
            });
    }

    addTOfavorite = async (placeId) => {
        var addUniqueId = getUniqueId();
        // console.log("UDID/:---"+JSON.stringify(addUniqueId))
        console.log("Place Id" + placeId)
        // var getAddFav=await AsyncStorage.getItem('AddFav')
        // console.log("getAddFav"+getAddFav)
        fetch('http://ec2-18-224-24-126.us-east-2.compute.amazonaws.com/APIs/Services.php?Service=addPlaceToFavourite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                "fkPlaces": placeId,
                "UDID": addUniqueId
            }
        }).then(response => response.json())
            .then((responseJson) => {
                console.log("Data response:--" + JSON.stringify(responseJson))
            })
    }
    //removeFavorite Api
    removeFavorite = async (placeId) => {


        var removeUniqueId = getUniqueId();
        //console.log("removeUDID/:---"+JSON.stringify(removeUniqueId))
        fetch('http://ec2-18-224-24-126.us-east-2.compute.amazonaws.com/APIs/Services.php?Service=removePlaceFromFavourite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                "fkPlaces": placeId,
                "UDID": removeUniqueId
            }
        }).then(response => response.json())
            .then((responseJson) => {
                console.log("DATa response:--" + JSON.stringify(responseJson))
            })
    }

    allFavouritePlace = ({ item, index }) => {
        console.log("renderPlace:==" + JSON.stringify(item))
        //console.log('mk'+JSON.stringify(item.pkPlace))
        return (

            <View style={{ flex: 1 }}>

                <View >

                    <FlatList
                        data={item.PlaceImages}
                        renderItem={this.renderFavoritePlaceImages}
                        extraData={item.PlaceImages}
                        pagingEnabled={true}
                        horizontal={true}
                        ref={ref => { this.flatListRef = ref; }}
                        keyExtractor={(item, index) => index.toString()}

                    />
                    <View style={{ position: 'absolute', bottom: 10, right: 5 }}>

                        <TouchableOpacity onPress={() => this.addFovariteChange(item)}>

                            <Image style={{ width: 25, height: 25, tintColor: 'white' }}
                                source={item.isFavorite ? require('./Images/star.png') : require('./Images/star1.png')} />
                        </TouchableOpacity>

                    </View>

                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.pkPlace })}>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5 }}>{item.name}</Text>
                </TouchableOpacity>
                <View style={{ padding: 5, }}>
                    <FlatList
                        data={item.HappyHours}
                        renderItem={this.renderFavoriteHappyHoursData}
                        extraData={item.HappyHours}
                    />
                </View>
            </View>
        )
    }

    addFovariteChange = (item) => {
        if (item.isFavorite === 0) {
            item.isFavorite = 1
            this.addTOfavorite(item.pkPlace)
            this.setState({ data: item.isFavorite })
            console.log("dataSetPlace:--" + JSON.stringify(item.pkPlace))
            console.log("dataSet:--" + JSON.stringify(this.state.data))
        } else if (item.isFavorite === 1) {
            item.isFavorite = 0
            this.removeFavorite(item.pkPlace)
            this.setState({ data: item.isFavorite })
            //console.log("dataSet:--"+JSON.stringify(item.pkPlace)) 

        }
    }

    renderFavoritePlaceImages = ({ item, index }) => {
        console.log("ITEM Images:==" + JSON.stringify(item))
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.fkplace })}>
                <View style={styles.imageSc}>
                    <ImageBackground
                        source={{ uri: item.imageUrl }}
                        style={{ height: '100%', width: width, }}
                    >
                        <PageControl
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 10 }}
                            numberOfPages={3}
                            currentPage={index}
                            pageIndicatorTintColor='gray'
                            currentPageIndicatorTintColor='white'
                            indicatorStyle={{ borderRadius: 5 }}
                            currentIndicatorStyle={{ borderRadius: 5 }}
                            indicatorSize={{ width: 8, height: 8 }}
                        />
                    </ImageBackground>
                </View>
            </TouchableOpacity>

        );
    };

    renderFavoriteHappyHoursData = ({ item, index }) => {
        //console.log("Happy Data:==" + JSON.stringify(item.happyHoursOffers))

        return (

            <View style={{ padding: 5 }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.fkPlace })}>
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, right: 5 }}>
                        <Text style={{ color: 'grey' }}>{`${converTime(item.startTime)}` + ' - ' + `${converTime(item.endTime)}`}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.fkPlace })}>
                    <Text>{item.happyHoursOffers}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    closeActivityIndicator = () => {
        if (this.state.loading === true) {
            setTimeout(() => this.setState({
                loading: false
            }), 600)
        } else {
            Alert.alert('Data Not Found')

        }


    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator
                        animating={this.state.loading}
                        color='red'
                        size="large"
                    />
                </View>
            );
        }

        return (
            <Root>
                <Container>
                    <View style={styles.mainView}>
                        <FlatList
                            data={this.state.arrAllFavoritePlace}
                            renderItem={this.allFavouritePlace}
                            extraData={this.state.arrAllFavoritePlace}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </Container>
            </Root>
        )
    }
}


const styles = StyleSheet.create(
    {
        mainView: {
            flex: 1,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10


        },
        itemTitel: {
            fontSize: 12,
            fontWeight: 'bold'
        },

        imageSc: {
            height: 200,
            width: '100%',

        }
    }
);