import React, { PureComponent } from "react";
import {
  Platform,
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  TouchableHighlight
} from "react-native";

// Redux
import { connect } from "react-redux";
import { updateCurrentUser } from "actions/users";

// Components
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "components/forms/PrimaryButton";
import { notice } from "notify";
import colors from "constants/colors";

import { SignOutRequest } from "api/sessions";
import { GetAccountRequest } from "api/users";
import {
  RemoveAuthentication,
  GetAuthenticationToken
} from "utils/authentication";
import { Constants } from "expo";
import Device from "utils/Device";
const isTablet = Device.isTablet();

import ChangeEmailScreen from "screens/ChangeEmailScreen";
import ChangePasswordScreen from "screens/ChangePasswordScreen";

class AccountScreen extends PureComponent {
  state = {
    loading: false,
    user: {
      name: "",
      email: ""
    },
    sideBar: ""
  };

  componentDidMount() {
    this.fetchCurrentUserEmail();
  }

  fetchCurrentUserEmail = async () => {
    const resp = await GetAccountRequest();
    if (resp && resp.ok) {
      this.setState({
        user: {
          name: resp.name,
          email: resp.email
        }
      });
    }
  };

  confirmSignOut = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: this.signOut
        }
      ],
      { cancelable: true }
    );
  };

  signOut = async () => {
    try {
      this.setState({ loading: true });
      const sessionToken = await GetAuthenticationToken();
      await SignOutRequest(sessionToken);
      RemoveAuthentication();
      this.props.updateCurrentUser({ name: "" });
      notice("You are now logged out");
      this.setState({ loading: false });
      this.props.screenProps.parentNavigation.navigate("Login");
    } catch (err) {
      console.log("logout error", err);
      this.setState({ loading: false });
    }
  };

  renderHeader = () => {
    const { user } = this.state;
    const iconName = Platform.OS === "ios" ? "ios-contact" : "md-contact";
    return (
      <View>
        <View style={styles.userContainer}>
          <Ionicons name={iconName} style={styles.userIcon} />
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        {this.renderSeparator()}
      </View>
    );
  };

  renderFooter = () => {
    const { loading } = this.state;
    return (
      <View>
        {this.renderSeparator()}
        <View style={{ padding: 20 }}>
          <PrimaryButton
            onPress={this.confirmSignOut}
            label="Logout"
            loading={loading}
          />
        </View>
        <View style={styles.version}>
          <Text style={styles.versionText}>
            Version {Constants.manifest.version}
          </Text>
        </View>
      </View>
    );
  };

  handleOnPress = key => {
    if (!isTablet) {
      return this.props.navigation.navigate(key);
    }

    this.setState({ sideBar: key });
  };

  renderItem = ({ item }) => {
    const iconName =
      Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-round-forward";
    return (
      <TouchableHighlight
        style={{
          backgroundColor:
            this.state.sideBar === item.key ? colors.background : "transparent"
        }}
        underlayColor={colors.background}
        onPress={_ => this.handleOnPress(item.key)}
      >
        <View key={item.title} style={styles.itemRow}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 10
            }}
          >
            <Text style={styles.itemText}>{item.key}</Text>
            <Ionicons
              name={iconName}
              size={24}
              style={{ color: colors.links }}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.primary
        }}
      />
    );
  };

  renderSideItem = () => {
    if (isTablet) {
      let SideComponent;

      switch (this.state.sideBar) {
        case "Change Password":
          SideComponent = <ChangePasswordScreen />;
          break;
        case "Change Email":
          SideComponent = <ChangeEmailScreen />;
          break;
        default:
          SideComponent = <View />;
      }

      return <View style={styles.sidebarContainer}>{SideComponent}</View>;
    } else {
      return null;
    }
  };

  render() {
    const { loading, user } = this.state;
    const items = [
      { key: "Change Email" },
      {
        key: "Change Password"
      }
    ];
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>
          <FlatList
            contentInset={{ top: 42 }}
            contentOffset={{ y: -42 }}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            data={items}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={this.renderItem}
          />
        </View>
        {this.renderSideItem()}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "transparent",
    ...(isTablet ? { flexDirection: "row" } : {})
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    ...(isTablet ? { maxWidth: "35%" } : {})
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: "#dedede",
    borderWidth: 0.5,
    borderColor: "transparent",
    borderLeftColor: colors.primary
  },
  userContainer: {
    padding: 20,
    paddingTop: 0
  },
  username: {
    fontFamily: "Verdana",
    textAlign: "center",
    color: colors.links,
    fontSize: 22
  },
  email: {
    fontFamily: "Verdana",
    textAlign: "center",
    color: colors.tabIconDefault,
    fontSize: 14
  },
  itemText: {
    fontFamily: "Verdana",
    color: colors.links,
    fontWeight: "700"
  },
  itemRow: {
    padding: 10
  },
  userIcon: {
    marginBottom: -3,
    fontSize: 68,
    textAlign: "center",
    color: colors.primary
  },
  versionText: {
    textAlign: "center",
    color: colors.links,
    fontFamily: "Verdana",
    fontWeight: "700"
  }
};

export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    }
  })
)(AccountScreen);
