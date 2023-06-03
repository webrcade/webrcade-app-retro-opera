import {
  Controller,
  Controllers,
  KeyCodeToControlMapping,
  RetroAppWrapper,
  CIDS,
  KCODES,
  LOG,
} from '@webrcade/app-common';

export class Emulator extends RetroAppWrapper {

  constructor(app, debug = false) {
    super(app, debug);
    // this.prefs = new Prefs(this);
    this.controllerCount = 1;

    this.fontBios = null;
    this.fontOption = 0;

    // Allow game saves to persist after loading state
    this.saveManager.setDisableGameSaveOnStateLoad(false);
  }

  GAME_SRAM_NAME = 'game.0.srm';
  SAVE_NAME = 'sav';

  createControllers() {
    return new Controllers([
      new Controller(
        new KeyCodeToControlMapping({
          [KCODES.ARROW_UP]: CIDS.UP,
          [KCODES.ARROW_DOWN]: CIDS.DOWN,
          [KCODES.ARROW_RIGHT]: CIDS.RIGHT,
          [KCODES.ARROW_LEFT]: CIDS.LEFT,
          [KCODES.Z]: CIDS.X,
          [KCODES.X]: CIDS.A,
          [KCODES.C]: CIDS.B,
          [KCODES.V]: CIDS.Y,
          [KCODES.A]: CIDS.LBUMP,
          [KCODES.S]: CIDS.RBUMP,
          [KCODES.SHIFT_RIGHT]: CIDS.SELECT,
          [KCODES.ENTER]: CIDS.START,
          [KCODES.ESCAPE]: CIDS.ESCAPE
        })
      ),
      new Controller(),
      new Controller(),
      new Controller(),
    ]);
  }

  setFontBios(b) {
    this.fontBios = b;
  }

  getScriptUrl() {
    return 'js/opera_libretro.js';
  }

  getPrefs() {
    return this.prefs;
  }

  async saveState() {
    const { saveStatePath, started } = this;
    const { FS, Module } = window;

    try {
      if (!started) {
        return;
      }

      // Save to files
      Module._cmd_savefiles();

      let path = '';
      const files = [];
      let s = null;

      path = `/home/web_user/retroarch/userdata/saves/opera/per_game/${this.GAME_SRAM_NAME}`;
      LOG.info('Checking: ' + path);
      try {
        s = FS.readFile(path);
        if (s) {
          LOG.info('Found save file: ' + path);
          files.push({
            name: this.SAVE_NAME,
            content: s,
          });
        }
      } catch (e) {}

      if (files.length > 0) {
        if (await this.getSaveManager().checkFilesChanged(files)) {
          await this.getSaveManager().save(
            saveStatePath,
            files,
            this.saveMessageCallback,
          );
        }
      } else {
        await this.getSaveManager().delete(path);
      }
    } catch (e) {
      LOG.error('Error persisting save state: ' + e);
    }
  }

  async loadState() {
    const { saveStatePath } = this;
    const { FS } = window;

    // Write the save state (if applicable)
    try {
      // Load
      const files = await this.getSaveManager().load(
        saveStatePath,
        this.loadMessageCallback,
      );

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (f.name === this.SAVE_NAME) {
            LOG.info(`writing ${this.GAME_SRAM_NAME} file`);
            FS.writeFile(
              `/home/web_user/retroarch/userdata/saves/opera/per_game/${this.GAME_SRAM_NAME}`,
              f.content,
            );
          }
        }

        // Cache the initial files
        await this.getSaveManager().checkFilesChanged(files);
      }
    } catch (e) {
      LOG.error('Error loading save state: ' + e);
    }
  }

  getControllerCount() {
    return this.controllerCount;
  }

  setControllerCount(count) {
    if (count !== this.controllerCount) {
      this.controllerCount = count;
      this.applyGameSettings(true);
    }
  }

  applyGameSettings(force = false) {
    const { FS, Module } = window;
    const props = this.getProps();
    let options = 0;

    // Only do this on initial application of settings
    if (this.fontBios) {
      const fonts = this.fontBios;
      this.fontBios = null;


      for (let bios in fonts) {
        const bytes = fonts[bios];
        const path = '/home/web_user/retroarch/userdata/system/' + bios;
        FS.writeFile(path, bytes);

        if (bios === "panafz1-kanji.bin") {
          this.fontOption = 1;
        } else if (bios === "panafz10ja-anvil-kanji.bin") {
          this.fontOption = 2;
        } else if (bios === "panafz1j-kanji.bin") {
          this.fontOption = 3;
        }

        break;
      }
    }

    const hack = props.hack;
    if (hack) {
      switch (hack) {
        case 1:
          options |= this.OPT1; // Crash 'n Burn
          break;
        case 2:
          options |= this.OPT2; // Dinopark Tycoon
          break;
        case 3:
          options |= this.OPT3; // Microcosm
          break;
        case 4:
          options |= this.OPT4; // Alone in the Dark
          break;
        case 5:
          options |= this.OPT5; // Samurai Shodown
          break;
        default:
          break;
      }
    }

    if (this.fontOption > 0) {
      if (this.fontOption === 1) {
        options |= this.OPT13;
      } else if (this.fontOption === 2) {
        options |= this.OPT14;
      } else if (this.fontOption === 3) {
        options |= this.OPT13;
        options |= this.OPT14;
      }
    }

    const count = this.controllerCount;
    if (count > 1) {
      if (count === 2) {
        options |= this.OPT15;
      } else if (count === 3) {
        options |= this.OPT16;
      } else if (count === 4) {
        options |= this.OPT15;
        options |= this.OPT16;
      }
    }

    if (options || force) {
      Module._wrc_set_options(options);
    }
  }

  isForceAspectRatio() {
    return false;
  }

  getDefaultAspectRatio() {
    return 1.333;
  }

  resizeScreen(canvas) {
    this.canvas = canvas;
    this.updateScreenSize();
  }

  getShotAspectRatio() { return this.getDefaultAspectRatio(); }
}
