import React from "react";

import {
  WebrcadeRetroApp
} from '@webrcade/app-common';

import { Emulator } from './emulator';
import { EmulatorPauseScreen } from './pause';

import './App.scss';

class App extends WebrcadeRetroApp {
  createEmulator(app, isDebug) {
    return new Emulator(app, isDebug);
  }

  getBiosMap() {
    return {
      'f47264dd47fe30f73ab3c010015c155b': 'panafz1.bin',
    };
  }

  getAlternateBiosMap() {
    return {
      "51f2f43ae2f3508a14d9f56597e2d3ce": "panafz10.bin",
      "1477bda80dc33731a65468c1f5bcbee9": "panafz10-norsa.bin",
      "a48e6746bd7edec0f40cff078f0bb19f": "panafz10e-anvil.bin",
      "cf11bbb5a16d7af9875cca9de9a15e09": "panafz10e-anvil-norsa.bin",
      "a496cfdded3da562759be3561317b605": "panafz1j.bin",
      "f6c71de7470d16abe4f71b1444883dc8": "panafz1j-norsa.bin",
      "8639fd5e549bd6238cfee79e3e749114": "goldstar.bin",
      "35fa1a1ebaaeea286dc5cd15487c13ea": "sanyotry.bin",
      "8970fc987ab89a7f64da9f8a8c4333ff": "3do_arcade_saot.bin",
    };
  }

  getBiosUrls(appProps) {
    return appProps.threedo_bios;
  }

  renderPauseScreen() {
    const { appProps, emulator } = this;

    return (
      <EmulatorPauseScreen
        emulator={emulator}
        appProps={appProps}
        closeCallback={() => this.resume()}
        exitCallback={() => {
          this.exitFromPause();
        }}
        isEditor={this.isEditor}
        isStandalone={this.isStandalone}
      />
    );
  }
}

export default App;
