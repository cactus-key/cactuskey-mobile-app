import React from 'react';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import { Layout, Input, TopNavigation, List, Text, Spinner } from '@ui-kitten/components';
import { default as customTheme } from '../../styles/theme.json';
import ProfileResult from '../../components/organisms/profile-result.organism';
import { apiSearch } from '../../services/discover.service';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

class _DiscoverScene extends React.Component {
  constructor(props) {
    super(props);
    this.searchText = "";
    this.state = {
      searchResults: null,
      processing: false
    }

    this.search_debounce_timeout = null;
  }

  _onSearchInput = (text) => {
    clearTimeout(this.search_debounce_timeout)
    this.searchText = text;

    // if no new char after 250ms, run search
    this.search_debounce_timeout = setTimeout(this._onSeachSubmit, 250);
  }

  _onSeachSubmit = () => {
    clearTimeout(this.search_debounce_timeout);
    
    if(this.searchText.length < 3) {
      return this.setState({searchResults: null, processing: false});
    }

    // Display spinner
    this.setState({processing: true});

    apiSearch(this.searchText).then((res) => {
      this.setState({searchResults: res.json, processing: false});
    }).catch((err) => {
      this.setState({processing: false});
      console.error(err);
    });
  }

  _renderSpinner = () => {
    if(this.state.processing) {
        return (
            <View style={{alignItems: 'center', marginTop: 15}}><Spinner size='giant'/></View>
        );
    }
  }

  _renderList = () => {
    if(this.state.searchResults == null || this.state.processing) return;

    if(this.state.searchResults.length == 0) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text appearance='hint'>{i18n.t('discover.no_results_found')}</Text>
        </View>
      );
    } else {
      return (
        <List style={styles.list}
                    data={this.state.searchResults}
                    renderItem={this._renderResult} />
      );
    }
    
  }

  _renderResult = (info) => {
    return (
      <ProfileResult profile={info.item} navigation={this.props.navigation} />
    );
  }

  render() {
    return (
        <Layout style={{flex: 1}} level='2'>
            <TopNavigation
                style={{marginBotton: 1}}
                alignment='center'
                title={i18n.t('discover.discover')}/>
            <Input placeholder={i18n.t('discover.search_user') + '...'}
                  style={styles.searchInput}
                  status='basic'
                  size='large'
                  icon={() => (<Feather color={customTheme['color-basic-400']} name="search" size={24} />)}
                  autoCapitalize='none'
                  onChangeText={this._onSearchInput}
                  onSubmitEditing={this._onSeachSubmit}
                  returnKeyType='search' />

            {this._renderSpinner()}
            {this._renderList()}
        </Layout>
    );
  }
}

const styles = StyleSheet.create({
  searchInput: {
    paddingHorizontal: 5,
    paddingVertical: 7,
    backgroundColor: customTheme['color-basic-700']
  },
  list: {
    flex: 1
  }
});

const DiscoverScene = connect()(_DiscoverScene);
export { DiscoverScene };