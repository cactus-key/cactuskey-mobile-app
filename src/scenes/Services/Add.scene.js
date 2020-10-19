import React from 'react';
import I18n from "../../../i18n";
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Layout, TopNavigation, TopNavigationAction, Text, Button } from '@ui-kitten/components';
import { Service } from '../../models/Service';
import { ServiceStore } from '../../models/ServiceStore';

class _AddScene extends React.Component {

    constructor(props) {
        super(props);
        this.has_scanned = false;
        this.state = {
            new_post_img: null,
            has_permission: null
        }
    }

    componentDidMount = async () => {
        // // Ask push notification permission
        // const device_data = await fetchExpoDeviceData();

        // // Store data in Redux
        // this.props.dispatch({
        //     type: "STORE_DEVICE_DATA",
        //     value: device_data
        // });
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.setState({
            has_permission: (status === 'granted')
        })
    }

    onQrScanned = (data) => {
        // Scan only once
        if (this.has_scanned) return;
        this.has_scanned = true;

        try {
            const service = new Service(data.data);
            ServiceStore.getInstance().store(service).then(() => {
                this.props.route.params.reloadServicesList();
                this.props.navigation.goBack();
            });
        } catch (error) {
            alert('Error, try again or enter code');
            setTimeout(() => {
                this.has_scanned = false;
            }, 2000);
            throw error;
        }
    }

    renderBack = () => (
        <TopNavigationAction
            icon={() => (<Feather name="arrow-left" color='#CCC' size={24}/>)}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.goBack()}
        />
    );

    render() {
        return (
            <Layout style={styles.container} level='2'>
                <TopNavigation
                    alignment='center'
                    title={I18n.t('services.add.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                <BarCodeScanner
                    type="back"
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={this.onQrScanned}
                    style={styles.camera}
                />
                <View style={styles.hintWrapper}>
                    <Text style={styles.hintText}>{I18n.t('services.add.hint')}</Text>
                    <Button
                        style={styles.noQrcodeButton}
                        appearance='outline'>
                        {I18n.t('services.add.no_qrcode_button')}</Button>
                </View>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 1
    },
    hintWrapper: {
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    hintText: {
        textAlign: 'center',
        marginBottom: 20
    },
    noQrcodeButton: {

    }
});

const mapStateToProps = (state) => {
    return {
        // auth_user_id: state.auth.id
    };
}
const AddScene = connect(mapStateToProps)(_AddScene);
export { AddScene };