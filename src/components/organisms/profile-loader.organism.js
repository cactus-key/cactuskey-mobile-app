import React from 'react';
import { StyleSheet, View } from 'react-native';
import { default as customTheme } from '../../styles/theme.json';
import SkeletonContent from "react-native-skeleton-content";

class ProfileLoader extends React.Component {
    render() {
        return (
            <View>
                <View style={styles.headContainer}>
                    <SkeletonContent
                        containerStyle={{flex: 2, paddingTop: 8, paddingLeft: 20}}
                        boneColor={customTheme['color-basic-700']}
                        highlightColor={customTheme['color-basic-800']}
                        layout={[
                            { width: 140, height: 16, marginBottom: 10 },
                            { width: 80, height: 16, marginBottom: 10 }
                        ]}></SkeletonContent>
                    <SkeletonContent
                        containerStyle={{flex: 1}}
                        boneColor={customTheme['color-basic-700']}
                        highlightColor={customTheme['color-basic-800']}
                        layout={[
                            { width: 60, height: 60, marginBottom: 6, borderRadius: 60, marginHorizontal: 20 }
                        ]}></SkeletonContent>
                </View>
                <SkeletonContent
                    containerStyle={styles.bodyContainer}
                    boneColor={customTheme['color-basic-700']}
                    highlightColor={customTheme['color-basic-800']}
                    layout={[
                        { width: 280, height: 40 }
                    ]}></SkeletonContent>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headContainer: {
        marginTop: 20,
        flexDirection: 'row'
    },
    bodyContainer: {
        marginTop: 10,
        marginLeft: 20
    }
});

export default ProfileLoader;