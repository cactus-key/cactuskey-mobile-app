import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { List, Text } from '@ui-kitten/components'
import Service from './service';

class ServicesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: this.props.services,
        }
    }

    componentDidMount() {
        // this.props.posts().then((posts) => {
        //     this.setState({
        //         posts: posts,
        //         loading: false
        //     });
        // });
    }

    renderEmpty = () => {
        if(this.state.services.length == 0) {
            return (
                <View style={styles.container}>
                    <Text appearance='hint'>No services to display</Text>
                    {/* <Button title="Add new service" onPress={this.onRefresh}/> */}
                </View>
            );
        }
    }

    renderList = () => {
        return (
            <List
                style={styles.list}
                contentContainerStyle={styles.item}
                data={this.state.services}
                renderItem={(service) => (
                    <Service navigation={this.props.navigation}
                            service={service.item} />
        )} />);
    }

    render() {
        return (
            <View>
                {this.renderEmpty()}
                {this.renderList()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        marginBottom: 50,
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