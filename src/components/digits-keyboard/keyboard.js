import React from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import Digit from './digit';

class DigitsKeyboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: ''
        }

        this.dotsBounceValues = [];
        for (let i = 0; i < this.props.digitsCount; i++) {
            this.dotsBounceValues.push(new Animated.Value(0));
        }
    }

    /**
     * Triggered when a digit key is pressed
     * @param {number} digit (0-9)
     */
    onDigitClick = (digit) => {
        const input = `${this.state.input}${digit}`;
        this.dotBounce(input.length - 1);
        this.setState({input}, () => {
            
            // Submit if required length reached
            if (input.length >= this.props.digitsCount) {
                this.props.onSubmit(this.state.input);
                this.setState({input: ''});
            }
            
        });
    }

    /**
     * Triggered when erase key is pressed
     */
    onEraseClick = () => {
        if (this.state.input.length > 0) {
            this.setState({
                input: this.state.input.slice(0, -1)
            });
        }
    }

    dotBounce(i) {
        const bounceValue = this.dotsBounceValues[i];
        bounceValue.setValue(0);
        Animated.timing(
            bounceValue,
            {
                toValue: 8,
                duration: 50,
                easing: Easing.linear
            }
        ).start(() => {
            Animated.timing(
                bounceValue,
                {
                    toValue: 0,
                    duration: 50,
                    easing: Easing.linear
                }
            ).start();
        })
    }

    renderDots() {
        const dots = [];
        for (let i = 0; i < this.props.digitsCount; i++) {
            dots.push(<Animated.View style={[styles.dot, {
                backgroundColor: (this.state.input[i] !== undefined ? '#71C56B' : '#1F1F1F'),
                marginBottom: this.dotsBounceValues[i]
            }]} />);
        }

        return (<View style={styles.dotsWrapper}>{dots}</View>);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderDots()}
                <View style={styles.keyboard}>
                    <View style={styles.row}>
                        <Digit digit={1} onClick={this.onDigitClick} />
                        <Digit digit={2} onClick={this.onDigitClick} />
                        <Digit digit={3} onClick={this.onDigitClick} />
                    </View>
                    <View style={styles.row}>
                        <Digit digit={4} onClick={this.onDigitClick} />
                        <Digit digit={5} onClick={this.onDigitClick} />
                        <Digit digit={6} onClick={this.onDigitClick} />
                    </View>
                    <View style={styles.row}>
                        <Digit digit={7} onClick={this.onDigitClick} />
                        <Digit digit={8} onClick={this.onDigitClick} />
                        <Digit digit={9} onClick={this.onDigitClick} />
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.key} onPress={this.onChildrenClick}>
                            <View>{this.props.children}</View>
                        </TouchableOpacity>
                        <Digit digit={0} onClick={this.onDigitClick} />
                        <TouchableOpacity style={styles.key} onPress={this.onEraseClick}>
                            <Feather name="delete" color='white' size={22}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '10%'
    },
    passcode: {

    },
    keyboard: {
        // backgroundColor: '#F5F5F5'
    },
    dotsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: '15%',
        height: 25
    },
    dot: {
        width: 15,
        height: 15,
        marginHorizontal: '5%',
        borderRadius: 15,
    },
    row: {
        flexDirection: 'row',
        // backgroundColor: 'blue',
        justifyContent: 'space-around',
        marginVertical: 15
    },
    key: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DigitsKeyboard;