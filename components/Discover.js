import React from 'react';
import { StyleSheet, View, Button, TextInput, FlatList, Text, ActivityIndicator } from 'react-native';
import { getSearchResults } from '../services/users.service';
import SearchResult from './SearchResult';

// styles sheet: https://github.com/vhpoet/react-native-styling-cheat-sheet
// styles={{height:50}} OU styles={styles.xx} OU styles={[styles.xx, styles.yy]} OU styles={[styles.xx, {height: 50}]}
// flex: x, flexDirection: row/column
// tip: "flex:1" ---> prend tout l'écran en hauteur
class Discover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            processing: false
        };
        this.searchText = '';
        this.searchTimeout = null;
    }

    onChangeText(text) {
        clearTimeout(this.searchTimeout);
        this.searchText = text;
        this.setState({processing: true});
        if(text.length < 3) {
            return this.setState({
                results: [],
                processing: false
            });
        }

        // debounce
        this.searchTimeout = setTimeout(() => {
            console.log(">> REQUEST");
            getSearchResults(this.searchText).then((res) => {
                this.setState({
                    results: res,
                    processing: false
                });
            });
        }, 250);
    }

    _displayLoading() {
        if (this.state.processing) {
            return (
                <ActivityIndicator
                style={{position: 'absolute', top: 100, left:100}}
                size='large'></ActivityIndicator>
            )
        }
    }

    _displayProfile = (profileId) => {
        this.props.navigation.navigate("Profile", {profileId: profileId});
    }

    render() {
        console.log("RENDER");
        console.log(this.state.processing);
        return (
            <View style={styles.View}>
                <TextInput style={styles.TextInput}
                           placeholder="Search..."
                           onChangeText={(text) => this.onChangeText(text)}/>

                <Text ></Text>
                <FlatList
                    style={{marginTop: 20}}
                    data={this.state.results}
                    extraData={this.props.favoriteFilms} // reload list if this data is updated
                    renderItem={({ item }) => <SearchResult profile={item} _displayProfile={this._displayProfile}/>}
                    keyExtractor={item => item.id.toString()}
                />
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    View: {
        flex: 1,
        marginTop: 6
    },
    TextInput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 5
    }
});

export default Discover;