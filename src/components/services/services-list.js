import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text, Button, Spinner } from '@ui-kitten/components'
import {ServiceStore} from '../../models/ServiceStore';
import { withStyles } from '@ui-kitten/components';
import Service from './service';
import i18n from "../../../i18n";
import { AppRoute } from '../../navigations/app.routes';
import { showMessage } from "react-native-flash-message";

class ServicesList extends React.Component {
    constructor(props) {
        super(props);

        this.props.setReloadCallback(() => {
            this.reloadServices();
        });

        this.state = {
            services: [],
            is_loading: true,
            is_edit_mode: this.props.is_edit_mode,
            open_service: null
        }

        this.reloadServices();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.is_edit_mode !== this.state.is_edit_mode) {
            const newState = {
                is_edit_mode: nextProps.is_edit_mode,
                open_service: this.state.open_service
            };

            // If entering into edit mode, close all services
            if (nextProps.is_edit_mode) {
                newState.open_service = null;
            }

            this.setState(newState);
        }
    }

    onServiceClick = (service) => {
        if (this.state.open_service === service)
            this.setState({open_service: null});
        else
            this.setState({open_service: service});
    }

    onServiceEdition = (service) => {
        this.props.navigation.navigate(AppRoute.SERVICES_EDIT, {
            service,
            reloadServicesList: this.reloadServices
        });
    }

    onServiceDeletion = async (service) => {
        await ServiceStore.getInstance().remove(service);
        this.reloadServices();
        showMessage({
            message: i18n.t('services.delete.success_msg'),
            type: "success",
        });
    }

    reloadServices = async () => {
        const services_count_before = this.state.services.length;
        const services = await ServiceStore.getInstance().fetchAll();
        const services_count_after = services.length;
        this.setState({services, is_loading: false});

        // If it's the 2nd service, open feedback popup
        if (services_count_before === 1 && services_count_after === 2) {
            this.props.navigation.navigate(AppRoute.FEEDBACK);
        }
    }

    renderLoading = () => {
        if(this.state.is_loading) {
            return (<View style={styles.spinner}><Spinner size='giant'/></View>);
        }
    }

    renderEmpty = () => {
        if(!this.state.is_loading && this.state.services.length == 0) {
            return (
                <View style={[styles.container, styles.emptyContainer]}>
                    <Text style={styles.emptyText}>{i18n.t('services.no_services_text')}</Text>
                    <Button onPress={this.props.onNewClick}>
                        {i18n.t('services.no_services_button')}
                    </Button>
                </View>
            );
        }
    }

    renderList = () => {
        if (!this.state.is_loading) {
            return (
                <List
                    style={[styles.list, {
                        backgroundColor: this.props.theme['color-basic-900']
                    }]}
                    contentContainerStyle={styles.item}
                    data={this.state.services}
                    extraData={this.state.services}
                    renderItem={(service) => (
                        <Service navigation={this.props.navigation}
                                service={service.item}
                                is_edit_mode={this.state.is_edit_mode}
                                is_open={this.state.open_service === service.item}
                                onClick={this.onServiceClick}
                                onEdit={this.onServiceEdition}
                                onDelete={this.onServiceDeletion} />
            )} />);
        }
    }

    render() {
        return (
            <View>
                {this.renderLoading()}
                {this.renderEmpty()}
                {this.renderList()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        height: '100%'
    },
    item: {
        marginBottom: 20,
        lineHeight: 18
    },
    container: {
        alignItems: 'center'
    },
    emptyContainer: {
        height: '100%',
        paddingTop: '20%'
    },
    emptyText: {
        marginVertical: 20,
        marginBottom: '10%',
        marginHorizontal: '10%',
        textAlign: 'center'
    },
    spinner: {
        alignItems: 'center',
        marginTop: '50%'
    }
});

export default withStyles(ServicesList);