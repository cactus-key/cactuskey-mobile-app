import React from 'react';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import { Layout, Text, TopNavigation } from '@ui-kitten/components';

class _ContestScene extends React.Component {
  render() {
    return (
        <Layout style={{flex: 1}} level='2'>
            <TopNavigation
                style={{marginBotton: 1}}
                alignment='center'
                title={i18n.t('contest.contest')}/>
            <Text>{i18n.t('common.soon')}</Text>
        </Layout>
    );
  }
}

const ContestScene = connect()(_ContestScene);
export { ContestScene };