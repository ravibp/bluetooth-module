/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import React, {Component} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import {BluetoothStatus} from 'react-native-bluetooth-status';
const BluetoothHeadsetDetectModule = NativeModules.RNBluetoothHeadsetDetect;
const bluetoothHeadsetDetectEmitter = new NativeEventEmitter(
  BluetoothHeadsetDetectModule,
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btStatus: null,
      cameraFlag: false,
      locationFlag: false,
    };
  }
  async componentDidMount() {
    let btStatus = await BluetoothStatus.state();
    this.setState({btStatus});
  }

  async toggleBluetoothState() {
    try {
      let btStatus = await BluetoothStatus.state();
      if (btStatus === true) {
        await BluetoothStatus.disable();
        btStatus = false;
      } else if (btStatus === false) {
        await BluetoothStatus.enable();
        btStatus = true;
        this.scanDevices();
      }
      this.setState({
        btStatus,
      });
      alert(`bluetooth is ${btStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error(error);
    }
  }
  async getBluetoothState() {
    try {
      const btStatus = this.state.btStatus ? 'enabled' : 'disabled';
      // eslint-disable-next-line no-alert
      alert(`bluetooth is ${btStatus}`);
      console.log(
        'bt subscription statuss',
        bluetoothHeadsetDetectEmitter._subscriber,
      );
    } catch (error) {
      console.error(error);
    }
  }
  scanDevices = () => {
    console.log('Scan Devices', bluetoothHeadsetDetectEmitter._subscriber);
    bluetoothHeadsetDetectEmitter.addListener('onChange', ({devices}) => {
      if (devices.length) {
        console.log('Connected device:', devices[0]);
      } else {
        console.log('No devices connected');
      }
    });
  };
  render() {
    console.log('render', this.state.btStatus);

    return (
      <>
        <View style={styles.container}>
          <Text style={styles.header}>DATA COLLECTOR APP</Text>
          <Text
            style={styles.button}
            onPress={() => {
              this.toggleBluetoothState();
            }}>
            Toggle BT
          </Text>
          <Text
            style={styles.button}
            onPress={() => {
              this.getBluetoothState();
            }}>
            Check BT
          </Text>
          {/* <Text style={styles.button} onPress={this.scanDevices}>
            Scan BT
          </Text> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                cameraFlag: true,
              });
            }}>
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                locationFlag: true,
              });
            }}>
            <Text style={styles.buttonText}>Get Location</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    margin: 10,
    fontWeight: 'bold',
    color: 'red',
  },
  buttonText: {
    textAlign: 'center',
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderColor: 'red',
    borderWidth: 10,
  },
});

export default App;
