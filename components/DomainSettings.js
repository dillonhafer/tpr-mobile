import React, { Component } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  View
} from "react-native";

// Redux
import { connect } from "react-redux";
import { updateDomain } from "actions/appConfig";

import colors from "constants/colors";
import { SetDomain } from "utils/authentication";
import PrimaryButton from "components/forms/PrimaryButton";
import Form from "components/forms/Form";
import TextInputContainer from "components/forms/TextInputContainer";
import Label from "components/forms/Label";
import Device from "utils/Device";
const isTablet = Device.isTablet();

class DomainSettings extends Component {
  state = {
    loading: false,
    valid: false,
    domain: ""
  };

  formatDomain(domain) {
    return domain.replace(/^(https?:|)\/\//, "").trim();
  }

  validateFields = () => {
    return this.state.domain.length > 0;
  };

  setDomain = () => {
    try {
      this.setState({ loading: true });
      SetDomain(this.state.domain);
      this.props.updateDomain(this.state.domain);
      this.props.navigation.navigate("SignIn");
    } catch (err) {
      //
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const valid = this.validateFields();
    const { loading } = this.state;

    return (
      <Form>
        <View style={styles.container}>
          <Label align="center" label="Domain" />
          <TextInputContainer>
            <TextInput
              placeholder="tpr.example.com"
              autoCapitalize={"none"}
              underlineColorAndroid={"transparent"}
              autoCorrect={false}
              keyboardType="url"
              onSubmitEditing={this.setDomain}
              returnKeyType="done"
              enablesReturnKeyAutomatically={true}
              onChangeText={domain =>
                this.setState({
                  domain: this.formatDomain(domain)
                })
              }
            />
          </TextInputContainer>
          <PrimaryButton
            label="Set Domain"
            onPress={this.setDomain}
            loading={loading}
            disabled={!valid}
          />
        </View>
      </Form>
    );
  }
}

const styles = {
  container: {
    ...(isTablet ? { width: 300, alignSelf: "center" } : {})
  }
};

export default connect(
  null,
  dispatch => ({
    updateDomain: domain => {
      dispatch(updateDomain(domain));
    }
  })
)(DomainSettings);
