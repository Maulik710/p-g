import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ImageBackground,
    Image,
    Button,
    TouchableOpacity,
    Alert,
    Linking,
    Platform,
    TouchableOpacityBase,
    TouchableWithoutFeedbackBase,
    ActivityIndicator,
    ScrollView,
    Dimensions
} from 'react-native';
import WSPlace from './WSClasses/WSPlace';
import WSPlaceImages from './WSClasses/WSPlaceImages';
import WSHappyHours from './WSClasses/WSHappyHours';
import PageControl from 'react-native-page-control';
import moment from "moment";
import ActionSheet from 'react-native-actionsheet';
import openMap from 'react-native-open-maps';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { isIphoneX } from 'react-native-iphone-x-helper';
// import { createOpenLink } from 'react-native-open-maps';
var converTime = require('convert-time');
var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
const { width, height } = Dimensions.get('window');
export default class Detail extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            getPlaceDetail: WSPlace,
            arrHappyHours: [WSHappyHours],
            arrPlaceImages: [],
            index: 0,
            isNext: false,
            isPervious: false,
            currentDay: String(),
            thatDay: String(),
            date: moment().format('dddd'),
            dictHappyHaours: [{ "": [WSHappyHours] }],
            today: new Date(),
            dictAllData: {},
            strCurrentDay: String(),
            arrfilterHappyHour: [],
            nextDay: [],
        }
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }


    componentDidMount = () => {
        this.fetchData();
    }

    fetchData = async () => {
        const { navigation } = this.props
        var getId = Number();
        getId = navigation.getParam('PlaceId')
        // this.state.pkPlace = getId
        //  this.setState({pkPlace:getId})
        console.log("mk" + this.state.pkPlace)
        //---getUDID---
        var mainUniqueId = getUniqueId();
        console.log("UDID:---" + JSON.stringify(mainUniqueId))
        fetch('http://ec2-18-224-24-126.us-east-2.compute.amazonaws.com/APIs/Services.php?Service=getPlaceDetailsWithFavorite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "UDID": mainUniqueId,
                "pkPlace": getId
            })
        }).then(response => response.json())
            .then((responseJson) => {
                // console.log("resData="+JSON.stringify(responseJson))
                // this.setState({ arrDetail: responseJson.Place, loading: true })
                //this.state.arrDetail.push(responseJson.Place)
                //console.log("push=" + JSON.stringify(this.state.arrDetail))
                placeDetailData = responseJson.Place
                var len = Object.keys(placeDetailData).length
                for (let i = 0; i < len; i++) {
                    var row = placeDetailData[i]
                    var Objplace = new WSPlace()
                    //Place Name
                    Objplace.name = row.name
                    console.log('name:-' + Objplace.name)

                    //Place Description
                    Objplace.placeDescription = row.placeDescription
                    console.log('placeDescription:-' + Objplace.placeDescription)

                    //Address
                    Objplace.address = row.address

                    //WebsiteUrl
                    Objplace.websiteURL = row.websiteURL
                    console.log('websiteURL:-' + Objplace.websiteURL)

                    //Telephone Number
                    Objplace.contactNumber = row.contactNumber
                    console.log('Phone Number:-' + Objplace.contactNumber)

                    //PlaceLatitude and Longitude
                    Objplace.placeLatitude = row.placeLatitude
                    Objplace.placeLongitude = row.placeLongitude


                    //Place Images
                    Objplace.placeImages = row.PlaceImages
                    PlaceImages = row.PlaceImages

                    var placeImagelen = Object.keys(PlaceImages).length
                    for (let i = 0; i < placeImagelen; i++) {

                        let ObjPlaceImages = new WSPlaceImages()
                        let PlaceImagesrow = PlaceImages[i]
                        ObjPlaceImages.imageUrl = PlaceImagesrow.imageUrl
                        Objplace.PlaceImages = ObjPlaceImages
                        console.log('image uri:-' + ObjPlaceImages.imageUrl)
                        this.state.arrPlaceImages.push(ObjPlaceImages)
                    }

                    //Happy Hours
                    Objplace.happyHours = row.HappyHours
                    HappyHours = row.HappyHours

                    var happyHourslen = Object.keys(HappyHours).length
                    for (let i = 0; i < happyHourslen; i++) {

                        let ObjHappyHours = new WSHappyHours()
                        let happyHoursrow = HappyHours[i]

                        //1.Offers
                        ObjHappyHours.happyHoursOffers = happyHoursrow.happyHoursOffers

                        //2.week Day
                        ObjHappyHours.weekDay = happyHoursrow.weekDay

                        //3.time
                        ObjHappyHours.startTime = happyHoursrow.startTime
                        ObjHappyHours.endTime = happyHoursrow.endTime
                        //Objplace.happyHours=ObjHappyHours
                        //Time Convert
                        var startTime = ObjHappyHours.startTime
                        var endTime = ObjHappyHours.endTime
                        var converTime = require('convert-time')
                        var myStartTime = converTime(startTime)
                        var myEndTime = converTime(endTime)
                        ObjHappyHours.startTime = myStartTime
                        ObjHappyHours.endTime = myEndTime

                        this.state.arrHappyHours.push(ObjHappyHours)
                    }
                    this.setState({ getPlaceDetail: Objplace, loading: true })
                }


                this.state.arrHappyHours = Objplace.happyHours
                let arrHappyHoursNew = Objplace.happyHours
                var len = arrHappyHoursNew.length
                for (let i = 0; i < len; i++) {

                    let obj = arrHappyHoursNew[i]
                    console.log("obj;=============" + JSON.stringify(obj))

                    if (obj.weekDay === "Monday-Friday") {

                        console.log("=======Monday-Friday =============")
                        // this.state.arrHappyHours.splice(obj,1)
                        this.state.arrHappyHours.splice(i, 1)
                        console.log("RemoveData:====" + JSON.stringify(this.state.arrHappyHours))
                        var arrWeekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
                        var weekDayLen = arrWeekday.length
                        for (let j = 0; j < weekDayLen; j++) {

                            var day = arrWeekday[j];
                            let newObject = new WSHappyHours();
                            newObject.weekDay = day;
                            newObject.endTime = obj.endTime
                            newObject.startTime = obj.startTime
                            newObject.fkPlace = obj.fkPlace
                            newObject.happyHoursOffers = obj.happyHoursOffers
                            newObject.isDeleted = obj.isDeleted
                            newObject.isTestData = obj.isTestData
                            newObject.pkHappyHours = obj.pkHappyHours
                            newObject.createdDate = obj.createdDate
                            newObject.modifiedDate = obj.modifiedDate

                            this.state.arrHappyHours.push(newObject);
                            console.log("ARRAY HAPPYHOURS:==" + JSON.stringify(this.state.arrHappyHours))
                        }
                    }
                }
                // console.log("ARRAY HAPPYHOURS:==" + JSON.stringify(this.state.arrHappyHours))
                Objplace.happyHours = this.state.arrHappyHours
                this.state.dictHappyHaours = groupBy(Objplace.happyHours, 'weekDay')
                console.log("grouping:==" + JSON.stringify(this.state.dictHappyHaours))

                var currentDay = this.state.today;
                // var sortedArray = this.state.dictHappyHaours.sort(currentDay.getDay.)

                const ordered = {};
                var dict = this.state.dictHappyHaours;
                Object.keys(dict).sort(function (a, b) {
                    return moment(a, 'ddd dddd').weekday() > moment(b, 'ddd dddd').weekday();
                }).forEach(function (key) {
                    ordered[key] = dict[key];
                });

                console.log("Sorted Data:==" + JSON.stringify(ordered));
                this.setState({ dictHappyHaours: ordered })

                this.state.dictAllData = ordered
                this.setState({ strCurrentDay: this.state.date })
                console.log("forted Data:==" + JSON.stringify(this.state.dictHappyHaours));


                console.log("Current Data:====" + JSON.stringify(this.state.strCurrentDay))
                console.log("All Data:====" + JSON.stringify(this.state.dictAllData))


                var matchKey = '';
                for (var key in this.state.dictAllData) {
                    // console.log("Keysss:===" + key)
                    if (key === this.state.strCurrentDay) {
                        matchKey = key
                        // console.log("matchkeys:==" + matchKey)
                        // return;
                    }
                }
                var dicLen = Object.keys(this.state.dictAllData).length
                // console.log("diclenth:====" + dicLen)
                for (let i = 0; i < dicLen; i++) {
                    var dicIndex = Object.keys(this.state.dictAllData)
                    //var dic = this.state.dictAllData[i]
                    // console.log("dic:====" + dicIndex)
                    var dicAll = dicIndex[i]
                    // this.setState({ nextDay: dicAll })
                    //console.log("dickeys" + this.state.nextDay)
                    if (dicAll === matchKey) {
                        this.setState({ index: i })
                        console.log("indexCurrent:==" + this.state.index)

                    }
                }
                this.HappyHoursFilteredData(this.state.strCurrentDay)
                //this.state.dictHappyHaours = Object.keys(this.state.dictHappyHaours).map((key)=> this.state.dictHappyHaours[key])

            }).catch((error) => {
                console.error(error);
            });
    }

    renderDeatilImage = ({ item, index }) => {
        //console.log('DataItem:--' + JSON.stringify())
        return (
            <View>
                <View style={{ height: 200, width: width }}>
                    <ImageBackground
                        source={{ uri: item.imageUrl }}
                        style={{ height: '100%', width: width }}
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

            </View>
        )
    }


    moveNext = () => {
        //console.log(" Item::-----"+item)
        var diclen = Object.keys(this.state.dictAllData).length
        console.log("lenth:====" + JSON.stringify(diclen))


        this.setState({ isPervious: false })
        if (this.state.index >= diclen - 1) {
            this.setState({ isNext: true })
        } else {
            var indexNext = this.state.index + 1
            console.log("index:====" + indexNext)
            this.state.index = indexNext
            //this.setState({ index: this.state.index + 1 })
            var dic = this.state.dictAllData
            var dicData = Object.keys(dic)[this.state.index]
            // console.log("dicAa:==="+dicData)
            this.setState({ strCurrentDay: dicData })
            this.HappyHoursFilteredData(dicData)
            console.log("NEXTDAY:====" + JSON.stringify(this.state.strCurrentDay))

            if (this.state.index === diclen) {
                this.setState({ isNext: true })
            }
        }

    }

    moveBack = () => {
        this.setState({ isNext: false })
        if (this.state.index <= 0) {
            this.setState({ isPervious: true })
        } else {
            var indexBack = this.state.index - 1
            console.log("index:====" + indexBack)
            this.state.index = indexBack
            //this.setState({ index:index })
            var dic = this.state.dictAllData

            var dicData = Object.keys(dic)[this.state.index]
            console.log("dicAa:===" + dicData)
            //this.state.strCurrentDay = dicData
            this.setState({ strCurrentDay: dicData })
            this.HappyHoursFilteredData(dicData)
            console.log("PRIVIOUSDAY:====" + JSON.stringify(this.state.strCurrentDay))
            if (this.state.index === this.state.dictAllData.length) {
                this.setState({ isPervious: true })
            }
        }
        //this.setState({ index: this.state.index - 1 })
    }

    renderHappyHours = ({ item, index }) => {
        //console.log("renderHappyHoursData:====" + JSON.stringify(item))

        var titleH = item.happyHoursOffers
        var title = titleH.split(' ');
        console.log('TitleData:==' + title[0])
        var OfferTitel = title[0]

        var removetitle = item.happyHoursOffers
        var removeTitle = removetitle.replace(title[0], '')
        console.log('remove title:==' + removeTitle[0])

        return (
            <View style={{ flex: 1, marginRight: 15, marginLeft: 15, marginTop: 10, borderBottomWidth: 0.5, borderBottomColor: 'red' }}>

                <View style={{ flexDirection: 'row', marginTop: 1, marginBottom: 5 }}>
                    <Image style={{ height: 20, width: 20, tintColor: 'red' }}
                        source={require('./Images/clock.png')}
                    />
                    <Text style={{ fontSize: 15, fontWeight: '600', paddingLeft: 10 }}>{converTime(item.startTime)} - {converTime(item.endTime)}</Text>
                </View>
                <View style={{ padding: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{OfferTitel}</Text>
                    <Text style={{ fontSize: 15, padding: 5 }}>{removeTitle}</Text>
                </View>
            </View>
        )
    }
    Map = () => {
        var latitudeN = Number()
        latitudeN = this.state.getPlaceDetail.placeLatitude
        var leti = latitudeN;
        console.log('location let:==' + leti)
        var longitudeN = Number()
        longitudeN = this.state.getPlaceDetail.placeLongitude
        var longi = longitudeN
        console.log("location lon:==" + longi)
        openMap({ latitude: parseFloat(leti), longitude: parseFloat(longi), provider: 'ios' ? 'apple' : 'google', query: this.state.getPlaceDetail.name });

    }
    website = () => {

        Linking.openURL(this.state.getPlaceDetail.websiteURL)
    }

    dialCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = `tel:${this.state.getPlaceDetail.contactNumber}`
        }
        else {
            phoneNumber = `telprompt:${this.state.getPlaceDetail.contactNumber}`
        }
        Linking.openURL(phoneNumber);
    }
    HappyHoursFilteredData = (strDay) => {

        var self = this

        console.log("Filter=================")

        var filtereArray = Object.entries(self.state.dictAllData).filter(function (obj) {

            var key = obj[0];
            var value = obj[1];

            console.log("key:==" + JSON.stringify(key))
            console.log("values:==" + JSON.stringify(value))

            var data = { key: value };
            if (key === strDay) {
                return data;
            }
            else {
                return false
            }
        });
        console.log("filteredArray:=" + JSON.stringify(filtereArray[0]))
        console.log("DAychange:==" + JSON.stringify(self.state.strCurrentDay))

        var newFilterArray = Object.values(filtereArray).map(function (obj) {
            console.log("new key:==" + JSON.stringify(obj))
            var data = obj.splice(1, 1)
            console.log("new data:==" + JSON.stringify(data))
            return data[0]
        });

        console.log("newFilterArray:=" + JSON.stringify(newFilterArray[0]))
        self.setState({ arrfilterHappyHour: newFilterArray[0] })

       
    }

    

    render() {
      
        console.log('getPlaceDetails 2' + JSON.stringify(this.state.getPlaceDetail));
        console.log('arrHappyHours 2:' + JSON.stringify(this.state.arrHappyHours));
        console.log('arrPlaceImages:-' + JSON.stringify(this.state.arrPlaceImages));
        
        return (


            <View style={{ flex: 1 }}>
                {/*------------Action--------- */}
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Other Info'}
                    options={['Direction', 'Report', 'cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={3}
                    onPress={(index) => {
                        if (index === 0) {
                            var latitudeN = Number()
                            latitudeN = this.state.getPlaceDetail.placeLatitude
                            //Alert.alert(latitudeN)
                            var longitudeN = Number()
                            longitudeN = this.state.getPlaceDetail.placeLongitude
                            //Alert.alert(longitudeN)
                            openMap({ latitude: parseFloat(latitudeN), longitude: parseFloat(longitudeN), provider: 'ios' ? 'apple' : 'google', query: this.state.getPlaceDetail.name });
                        } else if (index === 1) {
                            Alert.alert('Not Data Found')
                        }
                    }}
                />
                {/*-------------Detail Hrader------------ */}
                <View style={styles.headerView}>
                    <View style={styles.headerMargin}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'white' }}
                                source={require('./Images/back.png')}
                            />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 25, flex: 1, textAlign: 'center', color: 'white', }}>Detail</Text>

                        <TouchableOpacity onPress={this.showActionSheet}>
                            <Image style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'white', marginRight: 15 }}
                                source={require('./Images/more.png')}
                            />
                        </TouchableOpacity>
                    </View>

                </View>

                <ScrollView style={{marginBottom:60}}>
                    {/*----------------Images List----------- */}
                    <View style={{ height: 200, width: width, }}>
                        <FlatList
                            horizontal={true}
                            data={this.state.arrPlaceImages}
                            extraData={this.state.arrPlaceImages}
                            pagingEnabled
                            ref={ref => { this.flatListRef = ref; }}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderDeatilImage}
                        />
                        <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                            <TouchableOpacity onPress={this.fovariteChange}>
                                <Image style={{ width: 25, height: 25, tintColor: 'white' }}
                                    source={require('./Images/star1.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/*----------------Secound Row----------- */}
                    <View >
                        <Text style={styles.Name}>{this.state.getPlaceDetail.name}</Text>
                        <View style={styles.adderssView}>
                            <Image style={styles.adderssViewImage}
                                source={require('./Images/pin1.png')}
                            />
                            <Text style={styles.addFont}>{this.state.getPlaceDetail.address}</Text>
                        </View>
                        {/*----------------Button Call Website Navigation----------- */}
                        <View style={styles.threeButtonView}>
                            {/*------------------Call---------------*/}
                            <TouchableOpacity onPress={this.dialCall} >
                                <View style={styles.buttonView}>
                                    <Image style={styles.buttonImageView}
                                        source={require('./Images/telephone.png')}
                                    />
                                    <Text style={styles.buttonTextView}>Call</Text>
                                </View>
                            </TouchableOpacity>
                            {/*------------------Website---------------*/}
                            <TouchableOpacity onPress={this.website} >
                                <View style={{ height: 35, width: 100, backgroundColor: 'red', marginLeft: 15, marginTop: 5, borderRadius: 5, flexDirection: 'row' }}>
                                    <Image style={{ height: 20, width: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 5, marginTop: 8, tintColor: 'white' }}
                                        source={require('./Images/world.png')}
                                    />
                                    <Text style={{ fontSize: 15, marginTop: 8, color: 'white', fontWeight: '900', paddingLeft: 4 }}>Website</Text>
                                </View>
                            </TouchableOpacity >
                            {/*------------------Navigation---------------*/}
                            <TouchableOpacity onPress={this.Map}>
                                <View style={{ height: 35, width: 115, backgroundColor: 'red', marginLeft: 15, marginTop: 5, borderRadius: 5, flexDirection: 'row' }}>
                                    <Image style={{ height: 22, width: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 5, marginTop: 7, tintColor: 'white' }}
                                        source={require('./Images/sedan-car-front.png')}
                                    />
                                    <Text style={{ fontSize: 15, marginTop: 8, color: 'white', fontWeight: '900', paddingLeft: 4 }}>Navigation</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/*----------------HappyHours Data------------*/}

                    <View style={{ marginTop: 5, height: 300, marginBottom: 10 }}>

                        <FlatList

                            data={this.state.arrfilterHappyHour}
                            renderItem={this.renderHappyHours}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </View>

                </ScrollView>
                {/*----------------Button Day Change----------- */}
                <View style={{ height: 45, width: '100%', backgroundColor: 'red', position: 'absolute', bottom: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>

                        <TouchableOpacity onPress={() => this.moveBack()} disabled={this.state.isPervious}  >
                            <Image style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', marginLeft: 5, marginTop: 10, tintColor: 'white' }}
                                source={require('./Images/back.png')}
                            />
                        </TouchableOpacity>

                        <View style={{ width: '50%', alignItems: 'center' }}>

                            <Text style={{ fontSize: 25, color: 'white', marginTop: 7, fontWeight: '600' }}>
                                {this.state.strCurrentDay}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => this.moveNext()} disabled={this.state.isNext}>
                            <Image style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', marginLeft: 5, marginTop: 10, tintColor: 'white', }}
                                source={require('./Images/next.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    Name: {
        fontSize: 20,
        marginLeft: 15,
        fontWeight: 'bold',
        marginTop: 15,

    },
    headerView: {
        height: Platform.OS === 'ios' ? (isIphoneX() ? '12%' : '10%') : '9.5%',
        backgroundColor: 'red',
        width: '100%'
    },
    adderssView: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 15
    },
    adderssViewImage: {
        height: 20,
        width: 20,
        marginLeft: 5,
        marginTop: 8,
        tintColor: 'red'
    },
    headerMargin: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? (isIphoneX() ? 50 : 25) : 15,
        marginLeft: 10
    },
    addFont: {
        fontSize: 15,
        marginTop: 10,
        marginLeft: 10
    },
    threeButtonView: {
        flexDirection: 'row',
        marginTop: 15,
        borderBottomWidth: 2,
        paddingBottom: 15,
        borderBottomColor: 'red'
    },
    buttonView: {
        height: 35,
        width: 60,
        backgroundColor: 'red',
        marginLeft: 15,
        marginTop: 5,
        borderRadius: 5,
        flexDirection: 'row'
    },
    buttonImageView: {
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        marginTop: 8
    },
    buttonTextView: {
        fontSize: 15,
        marginTop: 7,
        color: 'white',
        fontWeight: '900',
        paddingLeft: 2
    },
})
