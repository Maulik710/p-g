import React from 'react';
import {
    Text, View, StyleSheet, TextInput, Button, TouchableHighlight, Image, TouchableOpacity, FlatList, SectionList, Modal, AsyncStorage,Platform
} from 'react-native';
import moment from "moment";
import { isIphoneX } from 'react-native-iphone-x-helper';

var getAllData = String()

export default class City extends React.Component {
    constructor() {
        super();
        this.state = {
            arrCity: null,
            arrListData: null,
            isSelected: false,
            selectArray: [],
            selectOffer: [],
            selectData: String(),
            selecttimeData: String(),

        }
    }
    componentDidMount = () => {
        this.getDataFromSetting();
    }
    getDataFromSetting = async () => {
        const { navigation } = this.props;
        var that = this;
        //-----------getSettingMainData------------------
        getAllData = navigation.getParam('selectedOption')
        console.log("Selected option:---" + getAllData)

        if (getAllData === 'City') {

            var getStoreData = await AsyncStorage.getItem('selectedAllData')
            // this.setState({ selectArray: JSON.parse(getStoreData) })
           // console.log("datas" + JSON.stringify(getStoreData))

            //-----------getCityData------------------
            if (getStoreData === null) {
                this.state.selectArray.push('Hoboken')
            } else {
                this.setState({ selectArray: JSON.parse(getStoreData) })
            }
            var getCity = navigation.getParam('CityData')
            //console.log("getCity:==" + JSON.stringify(getCity))
            that.setState({ arrCity: getCity })
            //console.log("arrCity:==" + JSON.stringify(this.state.arrCity))





        } else if (getAllData === "Time") {
            var gettimeData = await AsyncStorage.getItem("time")
            this.setState({ selecttimeData: JSON.parse(gettimeData) })

            //-----------getTimeData------------------ 

            var getTimeData = String();
            getTimeData = navigation.getParam('TimeData')
            // this.state.arrListData = getTimeData;
            that.setState({ arrListData: getTimeData })
            //console.log("timegetDataa:---" + JSON.stringify(getTimeData))
            //console.log("timedata:----" + JSON.stringify(this.state.arrListData))
            var time = moment().format('hh A')
            //console.log("currnttimedata:----" + JSON.stringify(time))
            if (gettimeData === null) {
                //this.state.selecttimeData = time
                this.setState({ selecttimeData: "11:00 PM" })
                //console.log("SEtTIme" + this.state.selecttimeData)
            } else {
                this.setState({ selecttimeData: JSON.parse(gettimeData) })
            }

        } else if (getAllData === "Radius") {
            var getradiusData = await AsyncStorage.getItem("radius")
            //this.setState({ selectData: JSON.parse(getradiusData) })

            //-----------getRadiusData------------------

            var getRadiusData = String();
            getRadiusData = navigation.getParam('RadiusData')
            //this.state.arrListData = getRadiusData;
            that.setState({ arrListData: getRadiusData })
            // console.log("timegetDataa:---" + JSON.stringify(getRadiusData))
            //console.log("radiusdata:---" + JSON.stringify(this.state.arrListData))
            if (getradiusData === null) {
                this.setState({ selectData: '5 miles' })
            } else {
                this.setState({ selectData: JSON.parse(getradiusData) })
            }

        } else if (getAllData === "Offer Type") {
            var getofferStoreData = await AsyncStorage.getItem('Offers')
            // this.setState({ selectOffer: JSON.parse(getofferStoreData) })

            //-----------getOfferTypeData------------------
            if (getofferStoreData === null) {
                this.state.selectOffer.push('All')
            } else {
                this.setState({ selectOffer: JSON.parse(getofferStoreData) })
            }
            var getOfferTypeData = String();
            getOfferTypeData = navigation.getParam('OfferTypeData')
            //this.state.arrListData = getOfferTypeData;
            that.setState({ arrListData: getOfferTypeData })
            // console.log("timegetDataa:---" + JSON.stringify(getOfferTypeData))
            //console.log("offerdata:------" + JSON.stringify(this.state.arrListData))
        }

    }

    renderCitySection = ({ item }) => {
        console.log("renderCitySection:--" + JSON.stringify(item))
        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.item}>{item}</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 10, paddingTop: 6 }}>
                    <TouchableOpacity onPress={() => this.itemSelect(item)}>
                        <Image style={{ width: 25, height: 25, tintColor: 'red' }}
                            source={this.state.selectArray.includes(item) ? require('./Images/correct.png') : null} />
                    </TouchableOpacity>

                </View>
                <View style={{ height: 1, backgroundColor: 'red' }} />

            </View>
        )
    }

    itemSelect = (item) => {
        console.log("dataItem:--" + JSON.stringify(item))
        var index = this.state.selectArray.indexOf(item)

        if (this.state.selectArray.includes(item)) {
            if (this.state.selectArray.length > 1) {
                this.state.selectArray.splice(index, 1)
                console.log("dataRemove:--" + JSON.stringify(this.state.selectArray))
                //console.log("rArray:===" + JSON.stringify(this.state.selectArray))

                this.setState({ isSelected: false })
            }
        } else {
            this.setState({ isSelected: false })

            this.state.selectArray.push(item)
            console.log("dataPush:--" + this.state.selectArray)


        }
        AsyncStorage.setItem('selectedAllData', JSON.stringify(this.state.selectArray))
        console.log('001All Data:====' + JSON.stringify(this.state.selectArray))
    }

    itemOfferSelect = (item) => {
        // console.log("dataItem:--" + item)
        var index = this.state.selectOffer.indexOf(item)

        if (this.state.selectOffer.includes(item)) {
            if (this.state.selectOffer.length > 1) {
                this.state.selectOffer.splice(index, 1)
                console.log("dataRemove:--" + JSON.stringify(this.state.selectOffer))
                //console.log("rArray:===" + JSON.stringify(this.state.selectOffer))

                this.setState({ isSelected: false })
            }
        } else {
            this.setState({ isSelected: false })
            this.state.selectOffer.push(item)
            console.log("dataPush:--" + this.state.selectOffer)

        }
        AsyncStorage.setItem('Offers', JSON.stringify(this.state.selectOffer))
        console.log('001All Data:====' + JSON.stringify(this.state.selectOffer))
    }

    itemRadiusData = (item) => {
        var index = this.state.arrListData.indexOf(item)
        console.log("SElect:==" + JSON.stringify(item))

        if (this.state.selectData == item) {

            if (this.state.selectData.length) {
                this.state.selectData.slice(index, 1)
                this.setState({ isSelected: false })
            }

        } else {
            this.state.selectData = item
            console.log("Setdata:==" + JSON.stringify(this.state.selectData))
            this.setState({ isSelected: false })

        }
        AsyncStorage.setItem('radius', JSON.stringify(this.state.selectData))

    }

    intemtimeSelect = (item) => {
        var index = this.state.arrListData.indexOf(item)
        console.log("SElect:==" + JSON.stringify(item))
        if (this.state.selecttimeData === item) {
            if (this.state.selecttimeData.length) {
                this.state.selecttimeData.slice(index, 1)
                this.setState({ isSelected: false })
            }
        } else {
            this.state.selecttimeData = item
            console.log("Setdata:==" + JSON.stringify(this.state.selecttimeData))
            this.setState({ isSelected: false })

        }
        AsyncStorage.setItem('time', JSON.stringify(this.state.selecttimeData))
    }



    renderAllData = ({ item }) => {
        return (
            <View style={{ flex: 1 }}>

                <Text style={styles.item}>{item}</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 10, paddingTop: 6 }}>
                    {getAllData === "Offer Type" ?
                        <TouchableOpacity onPress={() => this.itemOfferSelect(item)}>

                            <Image style={{ width: 25, height: 25, tintColor: 'red' }}
                                source={this.state.selectOffer.includes(item) ? require('./Images/correct.png') : null} />
                        </TouchableOpacity> :

                        <View>
                            {getAllData === "Radius" ?
                                <TouchableOpacity onPress={() => this.itemRadiusData(item)}>
                                    <Image style={{ width: 25, height: 25, tintColor: 'red' }}
                                        source={this.state.selectData == item ? require('./Images/correct.png') : null} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.intemtimeSelect(item)}>
                                    <Image style={{ width: 25, height: 25, tintColor: 'red' }}
                                        source={this.state.selecttimeData == item ? require('./Images/correct.png') : null} />
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </View>
                <View style={{ height: 1, backgroundColor: 'red' }} />


            </View>
        )

    }

    render() {

        if (getAllData === 'City') {
            return (

                <View style={styles.mainView}>
                    <View style={styles.headerStyle}>
                        <View style={styles.headerMargin}>
                            <View style={{ marginLeft: 5 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Image
                                        source={require('./Images/back.png')}
                                        style={{ height: 25, width: 25, tintColor: 'white' }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ position: 'absolute', right: '38%' }}>
                                <Text style={{ fontSize: 22, color: 'white' }}>Select City</Text>
                            </View>
                            <View style={{ position: 'absolute', right: 10 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Happy')}>
                                <Text style={{ fontSize: 18, color: 'white' }}>Search</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <SectionList
                        sections={this.state.arrCity}
                        renderItem={this.renderCitySection}
                        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                        keyExtractor={(item, index) => index}
                    />

                </View>

            )
        } else {

            return (
                <View style={styles.mainView}>
                    <View style={styles.headerStyle}>
                        <View style={styles.headerMargin}>
                            <View style={{ marginLeft: 5 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Image
                                        source={require('./Images/back.png')}
                                        style={{ height: 25, width: 25, tintColor: 'white' }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ position: 'absolute', right: '42%' }}>
                                <Text style={{ fontSize: 22, color: 'white' }}>Select</Text>
                            </View>
                            <View style={{ position: 'absolute', right: 10 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Happy')}>
                                <Text style={{ fontSize: 18, color: 'white' }}>Search</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.arrListData}
                        renderItem={this.renderAllData}
                        extraData={this.state.arrListData}
                        keyExtractor={(item, index) => index.toString()}
                    />

                </View >
            )

        }
    }
}



const styles = StyleSheet.create(
    {
        mainView: {
            flex: 1,
        },
        sectionHeader: {
            paddingTop: 8,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 8,
            fontSize: 18,
            color: 'white',
            height: 40,
            backgroundColor: 'red'

        },
        item: {
            padding: 10,
            fontSize: 15,
            height: 38,
        },
        headerStyle: {
            
            height: Platform.OS === 'ios'?(isIphoneX()?'12%':'10%'):'9.5%',
            backgroundColor: 'red',
            borderBottomWidth: 2,
            borderBottomColor: 'white'
        },
        headerMargin:{
            flexDirection: 'row',
             marginTop: Platform.OS === 'ios'?(isIphoneX()?40:25):15 
        },
       

    }
);