import React, { Component } from 'react';
import { Constants } from 'expo';
import { StackNavigator, createStackNavigator } from 'react-navigation';

import Login from './components/login';
import Home from './components/home';
import Contacts from './components/contacts';
import Contact from './components/contact';

import * as firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyBeIvyJOmgG7H8iKu-DL1RnFofPjhv1_Sg',
  authDomain: 'fbexample-b69f4.firebaseapp.com',
  databaseURL: 'https://fbexample-b69f4.firebaseio.com',
  projectId: 'fbexample-b69f4',
  storageBucket: 'fbexample-b69f4.appspot.com',
  messagingSenderId: '54754252097',
};
!firebase.apps.length ? firebase.initializeApp(config) : null;

const App = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    Home: {
      screen: Home,
    },
    Contacts: {
      screen: Contacts,
    },
    Contact: {
      screen: Contact,
    },
  },
  {
    initialRouteName: 'Login',
  }
);

export default App;
