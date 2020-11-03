import React, { Component } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Happy from './Happy';
import map from './map';
import Fovarite from './Fovarite';
import setting from './setting';
import Detail from './Detail';
import optionList from './optionList';


const StackHappy = createStackNavigator({
    StackHappy: {
        screen: Happy,
        navigationOptions: ({ navigation }) => {
            return {
                header: null,
            }
        }
    },
    Detail: {
        screen: Detail,
        navigationOptions: ({ navigation }) => {
            return {
                header: null,
            }
        }
   
    },
          
});

const StackMap = createStackNavigator({
    StackMap: {
        screen: map,
        navigationOptions: ({ navigation }) => {
            return {
                header: null
            }
        }
    }
})

const StackFovarite = createStackNavigator({
    StackFovarite: {
        screen: Fovarite,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle:
                    <Text style={{ fontSize: 22, flex: 1, textAlign: 'center', color: 'white' }}>Favorite</Text>,

                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: 'red',
                },
            }

        }
    }
    
});

const Stacksetting = createStackNavigator({
    Stacksetting: {
        screen: setting,

        navigationOptions: ({ navigation }) => {
            return {
                headerTitle:
                    <Text style={{ fontSize: 22, flex: 1, textAlign: 'center', color: 'white',alignItems:'center' }}>Settings</Text>,

                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: 'red',
                },
            }
        }
    },
    optionList:{
        screen:optionList,
        navigationOptions: ({ navigation }) => {
            return {
                header: null,
            }
        }
    }
});


const routeTabNavigator = createBottomTabNavigator({
    map: {
        screen: StackMap,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'map',

            tabBarIcon: (
                <TouchableOpacity onPress={() => navigation.navigate('map')}>
                    <Image style={{ width: 25, height: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'red' }}
                        source={require('./Images/pin.png')} />

                </TouchableOpacity>
            ),


        })
    },

    Happy: {
        screen: StackHappy,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'HappyHours',
            tabBarIcon:
                <TouchableOpacity onPress={()=>navigation.navigate('StackHappy')}>
                    <Image style={{ width: 25, height: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'red' }}
                        source={require('./Images/wine.png')}
                    />
                </TouchableOpacity>,

            activeTintColor: 'red',
            inactiveTintColor: 'black',

        }),
    },

    Fovarite: {
        screen: StackFovarite,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'Fovarite',
            tabBarIcon: (
                <TouchableOpacity

                    onPress={() => navigation.navigate('Fovarite')}>
                    <Image style={{ width: 25, height: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'red' }}
                        source={require('./Images/star1.png')} />
                    {/* <Text style={{fontSize:12}}>Map</Text> */}
                </TouchableOpacity>
            ),


        })
    },
    setting: {
        screen: Stacksetting,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'setting',
            tabBarIcon: (
                <TouchableOpacity

                    onPress={() => navigation.navigate('setting')}>
                    <Image style={{ width: 25, height: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'red' }}
                        source={require('./Images/settings.png')} />
                    {/* <Text style={{fontSize:12}}>Map</Text>  */}
                </TouchableOpacity>
            ),


        })
    },

},
    {
        initialRouteName: "Happy"
    }
);
const AppContainer = createAppContainer(routeTabNavigator);
export default class Route extends React.Component {
    render() {
        return <AppContainer />;
    }
}  
