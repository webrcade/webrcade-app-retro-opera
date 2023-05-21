import React from 'react';

import { ControlsTab } from '@webrcade/app-common';

export class GamepadControlsTab extends ControlsTab {
  render() {
    return (
      <>
        {this.renderControl('start', 'Play')}
        {this.renderControl('y', 'Play')}
        {this.renderControl('select', 'Stop')}
        {this.renderControl('dpad', 'Move')}
        {this.renderControl('lanalog', 'Move')}
        {this.renderControl('x', 'Button A')}
        {this.renderControl('a', 'Button B')}
        {this.renderControl('b', 'Button C')}
        {this.renderControl('lbump', 'Left Bumper')}
        {this.renderControl('rbump', 'Right Bumper')}
      </>
    );
  }
}

export class KeyboardControlsTab extends ControlsTab {
  render() {
    return (
      <>
        {this.renderKey('Enter', 'Play')}
        {this.renderKey('KeyV', 'Play')}
        {this.renderKey('ShiftRight', 'Stop')}
        {this.renderKey('ArrowUp', 'Up')}
        {this.renderKey('ArrowDown', 'Down')}
        {this.renderKey('ArrowLeft', 'Left')}
        {this.renderKey('ArrowRight', 'Right')}
        {this.renderKey('KeyZ', 'Button A')}
        {this.renderKey('KeyX', 'Button B')}
        {this.renderKey('KeyC', 'Button C')}
        {this.renderKey('KeyA', 'Left Bumper')}
        {this.renderKey('KeyS', 'Right Bumper')}
      </>
    );
  }
}
