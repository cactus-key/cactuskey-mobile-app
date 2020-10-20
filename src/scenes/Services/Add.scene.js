import React from 'react';
import I18n from "../../../i18n";
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Layout, TopNavigation, TopNavigationAction, Text, Button } from '@ui-kitten/components';
import { Service } from '../../models/Service';
import { ServiceStore } from '../../models/ServiceStore';
import { AppRoute } from '../../navigations/app.routes';
import { showMessage } from "react-native-flash-message";

class _AddScene extends React.Component {

    constructor(props) {
        super(props);
        this.has_scanned = false;
        this.state = {
            has_permission: null
        }
    }

    componentDidMount = async () => {
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
                showMessage({
                    message: I18n.t('services.add.success_msg'),
                    type: "success",
                });
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

    renderBarcodeScanner = () => {
        if (this.state.has_permission) {
            return (
                <BarCodeScanner
                    type="back"
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={this.onQrScanned}
                    style={styles.camera}
                />
            );
        }
    };

    render() {
        return (
            <Layout style={styles.container} level='2'>
                <TopNavigation
                    alignment='center'
                    title={I18n.t('services.add.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                {this.renderBarcodeScanner()}
                <View style={styles.hintWrapper}>
                    <Text style={styles.hintText}>
                        {I18n.t(this.state.has_permission ? 'services.add.hint' : 'services.add.hint_no_permission')}
                    </Text>
                    <Button
                        style={styles.noQrcodeButton}
                        appearance='outline'
                        onPress={() => this.props.navigation.navigate(AppRoute.SERVICES_ADD_MANUAL_ISSUER, {
                            reloadServicesList: this.props.route.params.reloadServicesList
                        })}>
                        {I18n.t(this.state.has_permission ? 'services.add.no_qrcode_button' : 'services.add.no_permission_button')}
                    </Button>
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
    return {};
}
const AddScene = connect(mapStateToProps)(_AddScene);
export { AddScene };