import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, Button } from 'react-native';
import { getProfile } from '../services/users.service';
import moment from "moment";
import {connect} from 'react-redux';
import { TabRouter } from 'react-navigation';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: undefined,
            processing: true
        }
    }

    componentDidMount() {
        getProfile(this.props.route.params.profileId).then((res) => {
            console.log("000");
            console.log(res);
            this.setState({
                profile: res,
                processing: false
            });
        });
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

    _displayProfileDetail() {
        if (this.state.profile !== undefined) {
            return (
                <ScrollView>
                    <Text>{this.state.profile.name} (#{this.state.profile.id})</Text>
                    <Text>{moment(this.state.profile.created_at).format('DD/MM/YYYY')}</Text>
                </ScrollView>
            )
        }
    }

    _toggleFavorite() {
        const action= {type: 'TOGGLE_FAVORITE', value: this.state.profile};

        // il faut avoir connect()() a la fin pour avoir acces a dispatch
        this.props.dispatch(action);
    }

    componentDidUpdate() {
        console.log("componentDidUpdate");
        console.log(this.props.favoriteFilms);
    }

    render() {
        console.log(this.props);
        return (
            <View>
                {this._displayProfileDetail()}
                {this._displayLoading()}
                <Button onPress={() => this._toggleFavorite()} title="Favorite"></Button>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    // return state;
    return {
        favoriteFilms: state.toggleFavorite.favoriteFilms
    };
}
export default connect(mapStateToProps)(Profile);