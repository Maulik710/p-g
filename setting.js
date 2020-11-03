import React from 'react';
import {
    Text, View, StyleSheet, TextInput, Button, TouchableHighlight, Image, TouchableOpacity, Modal
} from 'react-native';
import { createStackNavigator, HeaderTitle } from 'react-navigation-stack';
import { FlatList } from 'react-native-gesture-handler';


export default class setting extends React.Component {

    constructor() {
        super();
        this.state = {
            settingList: ["City", "Time", "Radius", "Offer Type","Terms of Services","Contact Us","Tour of Pubs N Grubs"],
            arrayCityData: [
                { title: "NewJersey", data: ['Jersey City', 'Bayonne', 'Hoboken'] },
                { title: "Georgia", data: ['Atlanta'] },
                { title: "New York", data: ['Mahanttan', 'Brooklyn'] },
            ],
            arrayTimeData: [
                "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
                "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 PM", "1:00 AM", "2:00 AM", "3:00 AM"
            ],
            arrayRadiusData: [
                "2 miles", "5 miles", "10 miles", "20 miles"
            ],
            arrayOfferTypeData: [
                "All", "Drink", "Food", "Brunch"
            ],
            selectArray: [],
            isSelected: false,
        }
    }
    renderSetting = ({ item }) => {
        console.log("settingData:--" + JSON.stringify(item))
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 50, borderBottomWidth: 0.5, borderBottomColor: 'red' }}>
                    <TouchableOpacity onPress={() => this.navigationScreen(item)}>
                        <View style={{ marginTop: 15, marginLeft: 10 }}>
                            <Text style={{ fontSize: 20, }}>{item}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )

    }

    navigationScreen = async(item) => {
        var selectedOption = String();
        if (item === 'City') {
            selectedOption = 'City'
            this.props.navigation.navigate('optionList', { CityData:this.state.arrayCityData,selectedOption:selectedOption })
  
        } else if (item === 'Time') {
            selectedOption = 'Time'
            this.props.navigation.navigate('optionList', { TimeData: this.state.arrayTimeData,selectedOption:selectedOption })

        } else if (item === 'Radius') {
            selectedOption = 'Radius'
            this.props.navigation.navigate('optionList', { RadiusData: this.state.arrayRadiusData,selectedOption:selectedOption })

        } else if (item === 'Offer Type') {
            selectedOption = 'Offer Type'
            this.props.navigation.navigate('optionList', { OfferTypeData: this.state.arrayOfferTypeData,selectedOption:selectedOption })
        }
    }

    itemSelectItem = (item) => {
        // console.log("dataItem:--" + item)
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
    }

    render() {

        return (
            <View style={styles.mainView}>

                <FlatList
                    data={this.state.settingList}
                    renderItem={this.renderSetting}
                    extraData={this.state.settingList}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                />
        
            </View>
        )
    }
}





const styles = StyleSheet.create(
    {
        mainView: {
            flex: 1,

        },

    }
);