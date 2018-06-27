import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";

import * as firebase from "firebase";

const TINT_COLOR = "rgb(4, 159, 239)";
const color = {
  button: '#7BCDBA',
  header: '#6457A6',
  background: '#9799CA',
};

class LoginForm extends Component {
  static navigationOptions = {
    title: "Login"
  };
  state = {
    isLoading: false,
    email: "pc@mail.com",
    // password: "pippo1234",
    password: "pippo99",
    error: ""
  };

  componentDidMount() {
    //this._login();
  }

  _login = () => {
    this.setState({ isLoading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({ isLoading: false });
        //console.log(user);
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        this.setState({ isLoading: false, error: error.message });
        //alert(error.message);
      });
  };

  _signUp = () => {
    this.setState({ isLoading: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({ isLoading: false });
        console.log(user);
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        this.setState({ isLoading: false, error: error.message });
        //alert(error.message);
      });
  };

  renderLoginOrSpinner() {
    return (
      <View style={{ justifyContent: "space-between", height: "40%" }}>
        <Button
          loading={this.state.isLoading}
          raised
          backgroundColor={color.button}
          title="Login"
          onPress={this._login}
        />
        <Button
          raised
          loading={this.state.isLoading}
          backgroundColor={color.button}
          title="Register"
          onPress={this._signUp}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        <Card>
          <FormLabel>E-mail</FormLabel>
          <FormInput
            label="E-mail"
            placeholder="enter a valid e-mail"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />

          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            label="Password"
            placeholder="your password"
            onChangeText={text => this.setState({ password: text })}
            //value={this.state.password}
          />

          {this.renderLoginOrSpinner()}
          <Text>{this.state.error}</Text>
        </Card>
      </View>
    );
  }
}

export default LoginForm;
