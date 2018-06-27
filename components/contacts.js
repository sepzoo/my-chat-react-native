import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import Contact from './contact';

const color = {
  button: '#7BCDBA',
  header: '#6457A6',
  background: '#9799CA',
};

export default class Contacts extends React.Component {
  componentWillMount() {
    this.userslist = this.props.navigation.state.params
      ? this.props.navigation.state.params.userslist
      : [];
  }

  _renderItem = item => {
    return (
      <Contact
        email={item.item.email}
        token={item.item.token}
        onSelect={() => this._select(item.item.token)}
      />
    );
  };

  _select = token => {
    this.props.navigation.navigate('Home', { dest: token });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.userslist}
          renderItem={item => this._renderItem(item)}
          keyExtractor={(item, index) => String(index)}
        />
      </ScrollView>
    );
  }
}
Contacts.navigationOptions = ({ navigation }) => ({
  title: 'Contacts',
  headerStyle: {
    backgroundColor: color.header,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  list: {
    backgroundColor: color.background,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
