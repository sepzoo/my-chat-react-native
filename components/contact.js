import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, FormLabel } from 'react-native-elements';

const color = {
  button: '#7BCDBA',
  header: '#6457A6',
  background: '#9799CA',
};

export default class Contact extends React.Component {
  render() {
    return (
      <View>
        <Card>
          <FormLabel> {this.props.email} </FormLabel>
          <Button
            title="Select"
            backgroundColor={color.button}
            onPress={this.props.onSelect}
          />
        </Card>
      </View>
    );
  }
}
