import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text, Button } from '@ui-kitten/components'
import {ServiceStore} from '../../models/ServiceStore';
import Service from './service';
import i18n from "../../../i18n";

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

    onServiceDeletion = async (service) => {
        await ServiceStore.getInstance().remove(service);
        this.reloadServices();
    }

    reloadServices = async () => {
        const services = await ServiceStore.getInstance().fetchAll();
        this.setState({services, is_loading: false});
    }

    renderLoading = () => {
        if(this.state.is_loading) {
            return (
                <View style={styles.container}>
                    <Text>{i18n.t('services.loading_text')}</Text>
                </View>
            );
        }
    }

    renderEmpty = () => {
        if(!this.state.is_loading && this.state.services.length == 0) {
            return (
                <View style={styles.container}>
                    <Text>{i18n.t('services.no_services_text')}</Text>
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
                    style={styles.list}
                    contentContainerStyle={styles.item}
                    data={this.state.services}
                    renderItem={(service) => (
                        <Service navigation={this.props.navigation}
                                service={service.item}
                                is_edit_mode={this.state.is_edit_mode}
                                is_open={this.state.open_service === service.item}
                                onClick={() => this.onServiceClick(service.item)}
                                onDelete={() => this.onServiceDeletion(service.item)} />
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
        alignItems: 'center',
        // marginTop: 40
    }
});

export default ServicesList;