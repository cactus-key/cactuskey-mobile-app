import React from 'react';
import i18n from "../../../i18n";
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Layout, TopNavigation, TopNavigationAction, Text, Button } from '@ui-kitten/components';
import { Service } from '../../models/Service';
import { ServiceStore } from '../../models/ServiceStore';
import { AppRoute } from '../../navigations/app.routes';
import { showMessage } from "react-native-flash-message";
import { SvgXml } from 'react-native-svg';
import { Svgs } from '../../constants/svgs.constants';
import { withStyles } from '@ui-kitten/components';
import { BugsnagService } from '../../services/bugsnag.service';

class _AddScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Services/Add');

        this.has_scanned = false;
        this.state = {
            has_permission: null
        }
    }

    componentDidMount = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.logger(`BarCodeScanner permission=${status}`);
        this.setState({
            has_permission: (status === 'granted')
        })
    }

    onQrScanned = (data) => {
        // Scan only once
        if (this.has_scanned) return;
        this.has_scanned = true;
        this.logger('New QR code scan');

        try {
            const service = new Service(data.data);
            ServiceStore.getInstance().store(service).then(() => {
                this.props.route.params.reloadServicesList();
                this.props.navigation.goBack();
                showMessage({
                    message: i18n.t('services.add.success_msg'),
                    type: "success",
                });
            });
        } catch (error) {
            if (error.message === 'TOTP_ONLY') {
                alert(i18n.t('services.add.errors.totp_only'));
            } else {
                alert(i18n.t('services.add.errors.unknown'));
            }
            
            setTimeout(() => {
                this.has_scanned = false;
            }, 2000);
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

    renderNoPermissionDrawing = () => {
        if (!this.state.has_permission) {
            return (<View style={styles.noPermissionDrawingWrapper}>
                <SvgXml style={styles.noPermissionDrawing} xml={Svgs.fetch('security')} width="200" height="200"/>
            </View>);
        }
    }

    render() {
        return (
            <Layout style={[styles.container, {backgroundColor: this.props.theme['color-basic-800']}]} level='2'>
                <TopNavigation
                    alignment='center'
                    title={i18n.t('services.add.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                {this.renderBarcodeScanner()}
                <View style={styles.hintWrapper}>
                    {this.renderNoPermissionDrawing()}
                    <Text style={styles.hintText}>
                        {i18n.t(this.state.has_permission ? 'services.add.hint' : 'services.add.hint_no_permission')}
                    </Text>
                    <Button
                        appearance='outline'
                        onPress={() => this.props.navigation.navigate(AppRoute.SERVICES_ADD_MANUAL_ISSUER, {
                            reloadServicesList: this.props.route.params.reloadServicesList
                        })}>
                        {i18n.t(this.state.has_permission ? 'services.add.no_qrcode_button' : 'services.add.no_permission_button')}
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
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 10
    },
    hintText: {
        textAlign: 'center',
        marginBottom: 20
    },
    noPermissionDrawingWrapper: {
        alignItems: 'center'
    },
    noPermissionDrawing: {
        flex: 1
    }
});

const AddScene = withStyles(_AddScene);
export { AddScene };