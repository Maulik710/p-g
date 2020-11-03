import React from 'react';
import {
    Text, View, StyleSheet, TextInput, Button, FlatList, Image, TouchableOpacity, Alert, LayoutAnimation, ImageBackground,
    AsyncStorage, TouchableHighlight, StatusBar, Dimensions, ActivityIndicator, ScrollView, Platform
} from 'react-native';
import PageControl from 'react-native-page-control';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import moment from "moment";
import { Container, Root, Toast } from 'native-base';



const { width, height } = Dimensions.get('window');
var converTime = require('convert-time');
export default class Happy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            arrAllPlaces: [],
            dataSourace: [],
            images: [],
            arrHppyHours: [],
            active: 0,
            isFovarite: false,
            data: Number(),
            time: moment().format('hh:mm A'),
            settingList: ["City", "Time", "Offer Type"],
            arrayCityData: [
                { title: "NewJersey", data: ['Jersey City', 'Bayonne', 'Hoboken'] },
                { title: "Georgia", data: ['Atlanta'] },
                { title: "New York", data: ['Mahanttan', 'Brooklyn'] },
            ],
            arrayTimeData: [
                "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
                "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 PM", "1:00 AM", "2:00 AM", "3:00 AM"
            ],
            arrayOfferTypeData: [
                "All", "Drink", "Food", "Brunch"
            ],
            text: '',

        };
        this.filterArray = []
    }
    componentDidMount() {
        this.fetchData();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('willFocus', () => {
            this.setState({ isLoading: true });
            this.fetchData();
        })
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    showLoader = () => { this.setState({ isLoading: true }); };
    keyExtractor = (item, index) => index.toString()

    static geterror_Toast(message) {
        return Toast.show({ text: message, type: "danger", position: 'bottom' })
    }
    static getTimeOutToast_Toast(message) {
        return Toast.show({ text: "Request time out,Please check your internet connection!", type: "warning", position: 'top' })
    }

    //fetch data from api and save into 
    fetchData = async () => {
        const { navigation } = this.props;


        //---getUDID---
        var mainUniqueId = getUniqueId();
        console.log("UDID:---" + JSON.stringify(mainUniqueId))

        //----Day----
        var day = moment().format('dddd');
        console.log("toDay:---" + JSON.stringify(day))

        //----City----
        var getCity = await AsyncStorage.getItem('selectedAllData')
        var citys = "";
        var arryCity = [];
        arryCity = JSON.parse(getCity);
        arryCity.map(item => {
            // console.log("City:==" + item)
            citys += `${item},`
        })
        citys.toString();
        console.log("City:==" + citys)


        //---Offer---
        var getoffer = await AsyncStorage.getItem('Offers')
        var offers = '',
            arryOffer = JSON.parse(getoffer);
        arryOffer.map(item => {
            offers += `"${item}",`
        })
        console.log("offers:==" + offers)



        //---Radius---
        var getRadius = String();
        getRadius = await AsyncStorage.getItem('radius')
        console.log("RadiusData::=====" + getRadius)

        //---Time---
        var getTime = String();
        getTime = await AsyncStorage.getItem('time')
        var time = converTime(getTime)
        console.log("TimeData::=====" + time)
        this.showLoader();
        fetch('http://ec2-18-224-24-126.us-east-2.compute.amazonaws.com/APIs/Services.php?Service=getAllPlacesNearbyWithMultipleCitiesWithFavorite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "UDID": mainUniqueId,
                "cityName": citys,
                "offerType": offers,
                "radius": "5 miles",
                "startTime": getTime,
                "weekDay": day
                // "UDID": "F871E851-641E-4474-BA97-8680DA7D5DC3",
                // "cityName": "Jersey City,Bayonne,Hoboken",
                // "offerType": "All",
                // "radius": "5 miles",
                // "startTime": "22:00",
                // "weekDay": "Saturday"
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "success") {

                    console.log("main Json" + JSON.stringify(responseJson))

                    this.setState({ arrAllPlaces: responseJson.Place, loading: false });


                    AsyncStorage.setItem('PlacesLocation', JSON.stringify(this.state.arrAllPlaces))
                    // console.log('1arrPlace->'+this.state.arrAllPlaces)
                } else {
                    Happy.geterror_Toast(responseJson.message);
                    this.setState({ loading: false });
                    return
                }
            }).catch((error) => {
                setTimeout(function () {
                    this.setState({ loading: false });
                    Happy.getTimeOutToast_Toast(error)
                }.bind(this), 500);
            });
    };

    filterFetchData = async (searchText) => {
        //---Time---
        var getTime = String();
        getTime = await AsyncStorage.getItem('time')
        var time = converTime(getTime)
        console.log("TimeData::=====" + time)

        //----Day----
        var day = moment().format('dddd');
        console.log("toDay:---" + JSON.stringify(day))


        //---getUDID---
        var mainUniqueId = getUniqueId();
        console.log("UDID:---" + JSON.stringify(mainUniqueId))

        fetch('http://ec2-18-224-24-126.us-east-2.compute.amazonaws.com/APIs/Services.php?Service=SearchPlacesByNameWithActiveHappyHoursWithFavorite', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "placeName": searchText,
                "startTime": time,
                "weekDay": day,
                "UDID": mainUniqueId
            })
        }).then(response => response.json())
            .then((responseJson) => {
                this.setState({ arrAllPlaces: responseJson.Place, loading: false },
                    function () {
                        this.filterArray = responseJson.Place
                    }
                )
                console.log("filterArray:==" + JSON.stringify(this.state.filterArray))
            })
            .catch(error => {
                console.error(error);
            });

        //console.log("filterArray:==" + JSON.stringify(responseJson))
        // this.setState({ filterArray: responseJson, isLoading: true })
        // console.log("filterArray:==" + JSON.stringify(this.state.filterArray))

    }

    SearchFilterFunction = (text) => {
        this.setState({ text: text })
        if (this.state.text !== '') {
            this.filterFetchData(text)
        }
    }


    //addFavorite Api
    addTOfavorite = async (placeId) => {
        var addUniqueId = getUniqueId();
        console.log("UDID/:---" + addUniqueId)
        console.log("placeId:==" + placeId)

        fetch('http://ec2-18-224-24-126.us-east-2.compute.amazonaws.com/APIs/Services.php?Service=addPlaceToFavourite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                "fkPlaces": placeId.toString(),
                "UDID": addUniqueId.toString()
            }
        }).then(response => response.json())
            .then((responseJson) => {
                console.log("DATa response:--" + JSON.stringify(responseJson))
            })
    }
    //removeFavorite Api
    removeFavorite = async (placeId) => {
        var removeUniqueId = getUniqueId();
        console.log("removeUDID/:---" + JSON.stringify(removeUniqueId))
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
                console.log("Data response:--" + JSON.stringify(responseJson))
            })
    }

    addFovariteChange = (item) => {
        if (item.isFavorite === 0) {
            item.isFavorite = 1
            this.addTOfavorite(item.pkPlace)
            this.setState({ data: item.isFavorite })
            console.log("dataSetPlace:--" + JSON.stringify(item.pkPlace))
            console.log("dataSet:--" + JSON.stringify(this.state.data))
            // AsyncStorage.setItem("AddFav",JSON.stringify(item.pkPlace))
        } else if (item.isFavorite === 1) {
            item.isFavorite = 0
            this.removeFavorite(item.pkPlace)
            this.setState({ data: item.isFavorite })
            //console.log("dataSet:--"+JSON.stringify(item.pkPlace)) 

        }
    }

    renderPlaceData = ({ item, index }) => {
        console.log("renderPlace:==" + JSON.stringify(item))
        //console.log('mk'+JSON.stringify(item.pkPlace))
        return (

            <View style={{ flex: 1 }}>

                <View style={{ width: width, marginTop: 10 }}>

                    <FlatList
                        data={item.PlaceImages}
                        renderItem={this.renderPlaceImages}
                        extraData={item.PlaceImages}
                        pagingEnabled={true}
                        horizontal={true}
                        ref={ref => { this.flatListRef = ref; }}
                        keyExtractor={(item, index) => index.toString()}

                    />
                    <View style={{ position: 'absolute', bottom: 10, right: 25 }}>

                        <TouchableOpacity onPress={() => this.addFovariteChange(item)}>

                            <Image style={{ width: 25, height: 25, tintColor: 'white' }}
                                source={item.isFavorite ? require('./Images/star.png') : require('./Images/star1.png')} />
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={{ marginTop: 5 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.pkPlace })}>

                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                    </TouchableOpacity>
                    <View style={{ padding: 5, }}>
                        <FlatList
                            data={item.HappyHours}
                            renderItem={this.renderHappyHoursData}
                            extraData={item.HappyHours}
                        />
                    </View>
                </View>
            </View>
        )
    }

    renderPlaceImages = ({ item, index }) => {
        console.log("ITEM Images:==" + JSON.stringify(item))
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.fkplace })}>
                <View style={styles.imageSc}>
                    <ImageBackground
                        source={{ uri: item.imageUrl }}
                        style={{ height: '100%', width: '100%', }}
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

    renderHappyHoursData = ({ item, index }) => {
        console.log("Happy Data:==" + JSON.stringify(item.happyHoursOffers))
        var arrOffers = [];
        arrOffers.push(item.happyHoursOffers)
        
            return(
                <View style={{}} >

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.fkPlace })}>
                    <View style={styles.startTimeView}>
                        < Text style={{ color: 'grey', fontSize: 12 }}>{`${converTime(item.startTime)}` + ' - ' + `${converTime(item.endTime)}`}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { PlaceId: item.fkPlace })}>
                    <Text>{item.happyHoursOffers}</Text>
                </TouchableOpacity>

            </View >
            )

    }

    navigationScreen = (item) => {
        var selectedOption = String();
        if (item === 'City') {
            selectedOption = 'City'
            this.props.navigation.navigate('optionList', { CityData: this.state.arrayCityData, selectedOption: selectedOption })

        } else if (item === 'Time') {
            selectedOption = 'Time'
            this.props.navigation.navigate('optionList', { TimeData: this.state.arrayTimeData, selectedOption: selectedOption })
        } else if (item === 'Offer Type') {
            selectedOption = 'Offer Type'
            this.props.navigation.navigate('optionList', { OfferTypeData: this.state.arrayOfferTypeData, selectedOption: selectedOption })
        }
    }

    closeActivityIndicator = () => {
        if (this.state.isLoading === true) {
            setTimeout(() => this.setState({
                loading: false
            }), 100)
        }
    }

    render() {
        // if (this.state.isLoading) {
        //     return (
        //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //             <ActivityIndicator
        //                 animating={this.state.loading}
        //                 color='red'
        //                 size="large"
        //             />
        //         </View>
        //     );
        // }

        // console.log("Main array lenght:-" + this.state.arrAllPlaces.length);
        //console.log("set Item"+JSON.stringify(this.state.arrAllPlaces));
        console.disableYellowBox = true
        return (
            <Root>
                <Container>
                    <View style={styles.mainView}>
                        <StatusBar barStyle='light-content' />
                        {/* ---------------header-----------      */}
                        <View style={styles.headerView}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.citiesView}>
                                    <TouchableOpacity onPress={() => this.navigationScreen("City")}>
                                        <Text style={{ fontSize: 15, color: 'white' }}>5 Cities ▼</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.logo}>
                                    <Image style={{ height: 50, width: 50, backgroundColor: 'white', borderRadius: 50 / 2, tintColor: 'red' }}
                                        source={require('./Images/beer.png')}
                                    />
                                </View>

                                <View style={styles.timeView}>
                                    <TouchableOpacity onPress={() => this.navigationScreen("Time")}>
                                        <Text style={{ fontSize: 15, color: 'white', }}>{this.state.time} ▼</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ width: '100%', left: 5, flexDirection: 'row' }}>
                                <View style={{ height: 35, width: '15%', backgroundColor: 'white', borderRadius: 10 }}>
                                    <TouchableOpacity onPress={() => this.navigationScreen("Offer Type")}>
                                        <Text style={{ textAlign: 'center', justifyContent: 'center', marginTop: 5, fontSize: 20 }}>All</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ height: 35, width: '80%', backgroundColor: 'white', borderRadius: 10, left: 5 }}>
                                    <View style={{ position: 'absolute', marginTop: 8, marginLeft: 10 }}>
                                        <Image style={{ height: 20, width: 20, tintColor: 'grey' }}
                                            source={require('./Images/search.png')}
                                        />
                                    </View>
                                    <TextInput
                                        style={styles.textInputStyle}
                                        onChangeText={text => this.SearchFilterFunction(text)}
                                        clearButtonMode={true}
                                        value={this.state.text}
                                        autoCorrect={false}
                                        placeholder="Search Here"
                                    />

                                </View>
                            </View>


                        </View>
                        {/* ---------------headerClose-----------      */}

                        <View style={styles.container}>

                            <FlatList
                                data={this.state.arrAllPlaces}
                                renderItem={this.renderPlaceData}
                                extraData={this.state.arrAllPlaces}
                                keyExtractor={(item, index) => index.toString()}
                            />


                        </View>

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


        },
        headerView: {
            width: width,
            height: Platform.OS === 'ios' ? '20%' : '18%',
            backgroundColor: 'red',
            justifyContent: 'space-evenly',
            alignItems: 'center',

        },

        citiesView: {
            marginTop: Platform.OS === 'ios' ? 25 : 10,
            width: '25%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        timeView: {
            width: '25%',
            marginTop: Platform.OS === 'ios' ? 25 : 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        logo: {
            width: '50%',
            marginTop: Platform.OS === 'ios' ? 25 : 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        container: {
            //flex: 1,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            height: '85%',
            // width: '100%',


        },
        itemTitel: {
            fontSize: 12,
            fontWeight: 'bold'
        },
        imageView: {
            height: 70,
            width: 70,
            borderRadius: 70 / 2,
            marginTop: 18
        },
        imageSc: {
            height: 230,
            width: width,


        },
        textInputStyle: {
            height: 40,
            paddingLeft: 50,
            top: 0
        },
        startTimeView: {
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
            bottom: 8
        },
        startCondiVoew: {
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
            bottom: 0
        }

    }
);




