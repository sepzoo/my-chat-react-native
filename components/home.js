import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import { Notifications, Permissions } from 'expo';

import * as firebase from 'firebase';
const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

const color = {
  button: '#7BCDBA',
  header: '#6457A6',
  background: '#9799CA',
};

export default class Home extends React.Component {
  state = {
    userslist: [],
    messages: [],
    currentUser: { email: '', uid: 0 },
    dest: 'ExponentPushToken[QYTxB2Cr1qONRormdAhr-Z]',
  };

  // async componentWillMount() {
  //await this._retrieveData();
  //}

  _clear = () => {
    this.setState({
      messages: [],
    });

    AsyncStorage.multiRemove(['messages'], err => {
      console.log('store clean now');
    });

    firebase
      .database()
      .ref('users/' + this.currentUser.uid + '/messages/')
      .remove();
  };

  componentDidMount() {
    this.currentUser = firebase.auth().currentUser;
    this.registerForPushNotificationsAsync();
    const userslist = [];
    firebase
      .database()
      .ref('/users')
      .on('value', snapshot => {
        snapshot.forEach(childSpanshot => {
          const profile = childSpanshot.val().profile;
          if (profile) {
            userslist.push(profile);
          }
        });
      });
    this.props.navigation.setParams({
      email: this.currentUser.email,
      userslist: userslist,
    });

    let messages = [];

    firebase
      .database()
      .ref('/users/' + this.currentUser.uid + '/messages')
      .on('value', snapshot => {
        snapshot
          ? snapshot.forEach(childSpanshot => {
              if (childSpanshot)
                messages.push({
                  from: childSpanshot.val().from,
                  text: childSpanshot.val().text,
                });
            })
          : null;
      }).then
    this.setState({ messages });

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('messages');
      if (value !== null) {
        this.setState({
          messages: JSON.parse(value),
        });
      } else {
        console.log('no data');
      }
    } catch (error) {
      console.log('errore get data');
    }
  };

  _storeData = async messages => {
    console.log('store data called');
    try {
      console.log('saving messages:', messages);
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log('error saving data', error);
    }
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
    // Get the token that uniquely identifies this device
    try {
      var token = await Notifications.getExpoPushTokenAsync();
    } catch (e) {
      console.log('errore', e);
    }

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    firebase
      .database()
      .ref('/users/' + this.currentUser.uid + '/profile')
      .set({
        email: this.currentUser.email,
        token,
      });
  };

  _handleNotification = async notification => {
    let messages = [
      ...this.state.messages,
      { from: notification.data.from, text: notification.data.message },
    ];
    this.setState({
      messages,
    });
    //await this._storeData(messages);
    firebase
      .database()
      .ref('/users/' + this.currentUser.uid + '/messages')
      .push({
        from: notification.data.from,
        text: notification.data.message,
      });
  };

  _sendNotification = async token => {
    fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title: this.currentUser.email,
        body: this.state.message,
        data: {
          message: this.state.message,
          from: this.currentUser.email,
        },
        sound: 'default',
      }),
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
    let messages = [
      ...this.state.messages,
      { from: this.currentUser.email, text: this.state.message },
    ];
    this.setState({
      messages,
    });
    //await this._storeData(messages);

    firebase
      .database()
      .ref('/users/' + this.currentUser.uid + '/messages')
      .push({
        from: this.currentUser.email,
        text: this.state.message,
      });
  };

  /*
  <View
              key={String(index)}
              style={msg.mine ? styles.myMsg : styles.otherMsg}>
              <Text style={{ fontWeight: 'bold' }}>from: {msg.from}</Text>
              <Text style={{ fontSize: 20 }}>{msg.text}</Text>
            </View>;
  */

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.input}>
          <TextInput
            placeholder="messaggio da inviare"
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: color.header,
              alignItems: 'stretch',
              flex: 1,
              paddingLeft: 10,
            }}
            onChangeText={text => this.setState({ message: text })}
          />
          <Button
            color={color.button}
            title="Send"
            onPress={() => {
              //console.log(this.props.navigation.state.params.dest)
              this._sendNotification(this.props.navigation.state.params.dest);
            }}
          />
        </View>
        <ScrollView style={styles.messages}>
          {this.state.messages.map((msg, index) => (
            <View
              key={String(index)}
              style={
                msg.from === this.currentUser.email
                  ? styles.myMsg
                  : styles.otherMsg
              }>
              <Text style={{ fontWeight: 'bold', flex: 1 }}>
                from: {msg.from === this.currentUser.email ? 'me' : msg.from}
              </Text>
              <Text style={{ fontSize: 20, flex: 1 }}> {msg.text}</Text>
            </View>
          ))}
          <View />
          <Button title="clear" color="#f003" onPress={this._clear} />
        </ScrollView>
      </View>
    );
  }
}

Home.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params ? navigation.state.params.email : '',
  headerStyle: {
    backgroundColor: color.header,
  },
  headerRight: (
    <Button
      color={color.button}
      title="Contacts"
      onPress={() => {
        navigation.navigate('Contacts', {
          userslist: navigation.state.params.userslist,
        });
      }}
    />
  ),
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
    /*
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    */
    padding: 10,
  },
  input: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  myMsg: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    //justifyContent: 'stretch',
  },
  otherMsg: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    //justifyContent: 'stretch',
  },
  messages: {
    flexDirection: 'column',
  },
});
