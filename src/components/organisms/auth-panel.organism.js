import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { default as customTheme } from '../../styles/theme.json';
import BottomSheet from 'reanimated-bottom-sheet';
import { Feather } from '@expo/vector-icons';
import Store from '../../store/configure_store';

class _AuthPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.bs = React.createRef();
        
    }

    componentDidMount = () => {
        Store.getStore().dispatch({
            type: 'REGISTER_AUTH_MODAL_CALLBACK',
            callback: () => {
                this.bs.current.snapTo(1);
            }
        });
    }

    renderContent = () => (
        <View style={styles.panel}>
            <Text style={styles.panelTitle}>San Francisco Airport</Text>
            <Text style={styles.panelSubtitle}>
                International Airport - 40 miles away
            </Text>
            <View style={styles.panelButton}>
                <Text style={styles.panelButtonTitle}>Directions</Text>
            </View>
            <View style={styles.panelButton}>
                <Text style={styles.panelButtonTitle}>Search Nearby</Text>
            </View>
        </View>
    )
    
    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                    <Feather name="x" color={customTheme['color-basic-700']} size={20}/>
                </TouchableOpacity>
                
                <Feather name="x" color={customTheme['color-basic-300']} size={20}/>
            </View>
        </View>
    )

    render() {
        return (
            <BottomSheet
                ref={this.bs}
                snapPoints={[0, '85%']}
                renderContent = {this.renderContent}
                renderHeader = {this.renderHeader}
                enabledBottomInitialAnimation={true}
                enabledInnerScrolling={true}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    panelContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    panel: {
      height: 600,
      padding: 20,
      backgroundColor: customTheme['color-basic-300'],
    },
    header: {
      backgroundColor: customTheme['color-basic-300'],
      shadowColor: '#000000',
      paddingTop: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    panelHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 20,
      borderRadius: 10,
      backgroundColor: '#318bfb',
      alignItems: 'center',
      marginVertical: 10,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    photo: {
      width: '100%',
      height: 225,
      marginTop: 30,
    },
    map: {
      height: '100%',
      width: '100%',
    },
  });

  const AuthPanel = connect()(_AuthPanel);
  export { AuthPanel };
