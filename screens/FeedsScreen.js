import React from 'react';
import { View } from 'react-native';

import { notice } from 'notify';
import { GetExportURL } from 'utils/authentication';
import PrimaryButton from 'components/forms/PrimaryButton';
import { FileSystem } from 'expo';

export default class SettingsScreen extends React.Component {
  exportXML = async () => {
    const exportURL = await GetExportURL();
    await FileSystem.downloadAsync(
      exportURL,
      FileSystem.documentDirectory + 'tpr-opml.xml',
    );
    notice('Download Complete');
  };

  render() {
    return (
      <View style={{ paddingTop: 22 }}>
        <PrimaryButton
          onPress={this.exportXML}
          label="Export"
          loading={false}
        />
      </View>
    );
  }
}
