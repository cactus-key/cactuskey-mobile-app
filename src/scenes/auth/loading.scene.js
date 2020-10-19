import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import { connect } from 'react-redux';
import { authLogin } from '../../services/auth.service';
import { fetchExpoDeviceData } from '../../services/device_session.service';

class _LoadingScene extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount = async () => {
        // Try simple login
        if(this.props.auth_email && this.props.auth_password_h2 && this.props.auth_salt) {
            // Ask push notification permission
            let device_data = await fetchExpoDeviceData();

            authLogin(this.props.auth_email, this.props.auth_password_h2, this.props.auth_salt, this.props.auth_server_delta, device_data).then((res) => {
                if(res.status == 200) {
                    this.props.dispatch({
                        type: "STORE_USER_TOKEN",
                        value: {
                            token: res.json.token,
                            id: res.json.id
                        }
                    });

                    this.goToMain();
                }
                else this.goToLogin();
            })
            .catch((err) => {
                this.goToLogin();
            });
        } else {
            this.goToLogin();
        }
    }

    goToLogin = () => {
        this.props.navigation.navigate(AppRoute.AUTH_EMAIL);
    }

    goToMain = () => {
        this.props.navigation.navigate(AppRoute.MAIN);
    }

    render() {
        return (
            <Layout style={styles.container}></Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const mapStateToProps = (state) => {
    return {
        auth_email: state.auth.email,
        auth_salt: state.auth.salt,
        auth_server_delta: state.auth.server_delta,
        auth_password_h2: state.auth.password_h2
    };
}
const LoadingScene = connect(mapStateToProps)(_LoadingScene);
export { LoadingScene };