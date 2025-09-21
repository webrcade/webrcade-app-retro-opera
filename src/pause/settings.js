import React from 'react';
import { Component } from 'react';

import {
  AppDisplaySettingsTab,
  EditorScreen,
  FieldsTab,
  FieldRow,
  FieldLabel,
  FieldControl,
  TelevisionWhiteImage,
  GamepadWhiteImage,
  Select,
  BlurImage,
  ShaderSettingsTab,
  // Switch,
  WebrcadeContext,
} from '@webrcade/app-common';

export class ThreedoSettingsEditor extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: null,
      focusGridComps: null,
      values: {},
    };
  }

  componentDidMount() {
    const { emulator } = this.props;

    const values = {
      origBilinearMode: emulator.getPrefs().isBilinearEnabled(),
      bilinearMode: emulator.getPrefs().isBilinearEnabled(),
      origScreenSize: emulator.getPrefs().getScreenSize(),
      screenSize: emulator.getPrefs().getScreenSize(),
      controllerCount: emulator.getControllerCount(),
      // ejectInsert: false
    };

    this.shaderService = this.props.emulator.getShadersService();
    this.shaderService.addEditorValues(values);

    this.setState({
      values: values
    });
  }

  render() {
    const { emulator, onClose } = this.props;
    const { tabIndex, values, focusGridComps } = this.state;

    const setFocusGridComps = (comps) => {
      this.setState({ focusGridComps: comps });
    };

    const setValues = (values) => {
      this.setState({ values: values });
    };

    return (
      <EditorScreen
        showCancel={true}
        onOk={async () => {
          // emulator.setAnalogMode(values.analogMode ? 1 : 0);
          // emulator.setSwapControllers(values.swapControllers);
          // emulator.setEjectInsert(values.ejectInsert);
          // emulator.setInsert(values.insert);
          emulator.setControllerCount(values.controllerCount);
          let updated = false;
          if (values.origBilinearMode !== values.bilinearMode) {
            emulator.getPrefs().setBilinearEnabled(values.bilinearMode);
            emulator.updateBilinearFilter();
            updated = true;
          }
          if (values.origScreenSize !== values.screenSize) {
            emulator.getPrefs().setScreenSize(values.screenSize);
            emulator.updateScreenSize();
            updated = true;
          }
          if (updated) {
            emulator.getPrefs().save();
          }

          // Set the shader
          await this.shaderService.setShader(values.shaderId);

          onClose();
        }}
        onClose={onClose}
        focusGridComps={focusGridComps}
        onTabChange={(oldTab, newTab) => this.setState({ tabIndex: newTab })}
        tabs={[
          {
            image: GamepadWhiteImage,
            label: '3DO Settings (Session only)',
            content: (
              <ThreedoSettingsTab
                emulator={emulator}
                isActive={tabIndex === 0}
                setFocusGridComps={setFocusGridComps}
                values={values}
                setValues={setValues}
              />
            ),
          },
          {
            image: TelevisionWhiteImage,
            label: 'Display Settings',
            content: (
              <AppDisplaySettingsTab
                emulator={emulator}
                isActive={tabIndex === 1}
                setFocusGridComps={setFocusGridComps}
                values={values}
                setValues={setValues}
              />
            ),
          },
          {
            image: BlurImage,
            label: 'Shader Settings',
            content: (
              <ShaderSettingsTab
                shaderService={this.shaderService}
                emulator={emulator}
                isActive={tabIndex === 2}
                setFocusGridComps={setFocusGridComps}
                values={values}
                setValues={setValues}
              />
            )
          },
        ]}
      />
    );
  }
}

class ThreedoSettingsTab extends FieldsTab {
  constructor() {
    super();
    // this.ejectInsertRef = React.createRef();
    this.controllerCountRef = React.createRef();
    this.gridComps = [
      [this.controllerCountRef],
      // [this.ejectInsertRef]
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    const { gridComps } = this;
    const { setFocusGridComps } = this.props;
    const { isActive } = this.props;

    if (isActive && isActive !== prevProps.isActive) {
      setFocusGridComps(gridComps);
    }
  }

  render() {
    const { controllerCountRef, /*ejectInsertRef*/ } = this;
    const { focusGrid } = this.context;
    const { setValues, values } = this.props;

    const controllerOpts = [];
    controllerOpts.push({ value: 1, label: "One" });
    controllerOpts.push({ value: 2, label: "Two" });
    controllerOpts.push({ value: 3, label: "Three" });
    controllerOpts.push({ value: 4, label: "Four" });

    console.log(values.controllerCount)

    return (
      <>
        <FieldRow>
          <FieldLabel>Controllers</FieldLabel>
          <FieldControl>

            <Select
              ref={controllerCountRef}
              options={controllerOpts}
              onChange={(value) => {
                setValues({
                  ...values,
                  ...{ controllerCount: value },
                });
              }}
              value={values.controllerCount}
              onPad={(e) => focusGrid.moveFocus(e.type, controllerCountRef)}
            />
          </FieldControl>
        </FieldRow>
        {/* <FieldRow>
          <FieldLabel>Reset disc</FieldLabel>
          <FieldControl>
            <Switch
              ref={ejectInsertRef}
              onPad={(e) => focusGrid.moveFocus(e.type, ejectInsertRef)}
              onChange={(e) => {
                setValues({
                  ...values,
                  ...{ ejectInsert: e.target.checked },
                });
              }}
              checked={values.ejectInsert}
            />
          </FieldControl>
        </FieldRow> */}
      </>
    );
  }
}
ThreedoSettingsTab.contextType = WebrcadeContext;


