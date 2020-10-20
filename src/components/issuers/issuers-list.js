import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List } from '@ui-kitten/components';
import Issuer from './issuer';
import { IssuersService } from '../../services/issuers.service';

class IssuersList extends React.Component {
    constructor(props) {
        super(props);

        this.onIssuerSelectedCallback = this.props.onIssuerSelected;

        const issuersService = IssuersService.getInstance();

        this.state = {
            issuers: [issuersService.defaultIssuer].concat(issuersService.fetchAll())
        }
    }

    render() {
        return (
            <View>
                <List
                    style={styles.list}
                    contentContainerStyle={styles.item}
                    data={this.state.issuers}
                    renderItem={(issuer) => (
                        <Issuer
                            issuer={issuer.item}
                            onClick={() => this.onIssuerSelectedCallback(issuer.item)} />
                )} />
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
    }
});

export default IssuersList;