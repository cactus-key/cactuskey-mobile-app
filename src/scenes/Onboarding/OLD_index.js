import React from 'react';
import I18n from "../../../i18n";
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Layout, Button, Spinner } from '@ui-kitten/components';
import { default as customTheme } from '../../styles/theme.json';
import { fetchExpoDeviceData } from '../../services/device_session.service';
import { authLogin } from '../../services/auth.service';
import { publicService } from '../../services/public.service';
import { connect } from 'react-redux';
import { AppRoute } from '../../navigations/app.routes';

class _OnboardingScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            available_interests: [],
            selected_interests: [],
            is_loading: true
        }

        // Try simple login
        if(this.props.auth_email && this.props.auth_password_h2 && this.props.auth_salt) {
            // Ask push notification permission
            fetchExpoDeviceData().then((device_data) => {
                authLogin(this.props.auth_email, this.props.auth_password_h2, this.props.auth_salt, this.props.auth_server_delta, device_data).then((res) => {
                    if(res.status === 200) {
                        this.props.dispatch({
                            type: "STORE_USER_TOKEN",
                            value: {
                                token: res.json.token,
                                id: res.json.id
                            }
                        });
    
                        this._nextStep();
                    } else {
                        this.props.dispatch({
                            type: "STORE_USER_TOKEN",
                            value: {
                                token: undefined,
                                id: undefined
                            }
                        });
                    }
                }).catch(() => {
                    this.props.dispatch({
                        type: "STORE_USER_TOKEN",
                        value: {
                            token: undefined,
                            id: undefined
                        }
                    });
                });
            }).catch(() => {
                this.props.dispatch({
                    type: "STORE_USER_TOKEN",
                    value: {
                        token: undefined,
                        id: undefined
                    }
                });
            });
        }

        // Redirect if onboarding is done
        if (this.props.saved_interests !== null) {
            return this._nextStep();
        }

        // Load available interests from server
        publicService.interests().then((interests) => {
            this.setState({
                available_interests: interests.json,
                selected_interests: [],
                is_loading: false
            });
        });
    }

    /**
     * Triggered when interest is touched
     * @param {*} interest 
     */
    _toggleInterest = (interest) => {
        const index = this.state.selected_interests.indexOf(interest.id);

        // If interest not selected yet
        if (index === -1) {
            this.state.selected_interests.push(interest.id);
        }
        
        // Remove it otherwise
        else {
            this.state.selected_interests.splice(index, 1);
        }

        // Update state
        this.setState({
            selected_interests: this.state.selected_interests
        });
    }

    /**
     * Triggered when onboarding is submitted
     */
    _onSubmit = () => {
        this.props.dispatch({
            type: "STORE_INTERESTS",
            value: this.state.selected_interests
        });

        this._nextStep();
    }

    _onSkip = () => {
        this.props.dispatch({
            type: "STORE_INTERESTS",
            value: []
        });

        this._nextStep();
    }

    _nextStep = () => {
        this.props.navigation.navigate(AppRoute.MAIN);
    }

    _renderSpinner = () => {
        if(this.state.is_loading) {
            return (
                <ScrollView>
                    <View style={styles.loader}><Spinner size='giant'/></View>
                </ScrollView>
            );
        }
    }

    _renderInterests = () => {
        if(!this.state.is_loading) {
            return this.state.available_interests.map(interest => (
                <Button style={styles.interest}
                        status={this.state.selected_interests.includes(interest.id) ? 'primary' : 'basic'}
                        onPress={() => this._toggleInterest(interest)}
                        appearance={this.state.selected_interests.includes(interest.id) ? 'filled' : 'outline'}>
                    {interest.name}
                </Button>
            ));
        }
    }

    render() {
        return (
            <Layout style={styles.container}>
                <View style={styles.skip_container}>
                    <Button style={styles.skip} onPress={this._onSkip} status='basic' appearance='ghost'>{I18n.t('common.skip')}</Button>
                </View>

                <Text style={styles.title}>{I18n.t('onboarding.choose_your_interests')}</Text>
                {this._renderSpinner()}
                <ScrollView>
                    <Layout style={styles.interests_container}>
                        {this._renderInterests()}
                    </Layout>
                </ScrollView>

                <Button
                    style={styles.submitBtn}
                    status='primary'
                    size='large'
                    disabled={this.state.selected_interests.length < 1}
                    onPress={this._onSubmit}>{I18n.t('common.letsgo')}
                </Button>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    loader: {
        alignItems: 'center',
        marginTop: 30
    },
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 12
    },
    title: {
        fontSize: 30,
        color: customTheme['color-basic-300'],
        textAlign: 'left',
        marginBottom: 20
    },
    skip_container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: 10,
        marginBottom: 10
    },
    skip: {
        paddingHorizontal: 0
    },
    interests_container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    interest: {
      borderRadius: 20,
      marginHorizontal: 6,
      marginVertical: 8
    },
    submitBtn: {
        width: '100%',
        marginBottom: 25
    }
});

const mapStateToProps = (state) => {
    return {
        saved_interests: state.preferences.interests,
        auth_email: state.auth.email,
        auth_salt: state.auth.salt,
        auth_server_delta: state.auth.server_delta,
        auth_password_h2: state.auth.password_h2
    };
}
const OnboardingScene = connect(mapStateToProps)(_OnboardingScene);
export { OnboardingScene };
