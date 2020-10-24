import React from 'react';
import { connect } from 'react-redux';
import { Layout } from '@ui-kitten/components';
import { StyleSheet, Platform, StatusBar } from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

class AppStatusBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
<           Layout level='1' style={styles.statusBar}>
                <StatusBar
                    translucent
                    barStyle={this.props.current_theme === 'light' ? "dark-content" : "light-content"} />
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT
    }
});

const mapStateToProps = (state) => {
    return {
        current_theme: state.settings.current_theme
    };
}

export default connect(mapStateToProps)(AppStatusBar);