
const MapKey = {
    "{bksp}": {
      display: "backspace",
      emitter: () => {
        if (this._instance) {
          this._instance.value = this._instance.value.substring(
            0,
            this._instance.value.length - 1
          );
        }
      },
    },
    "{tab}": {
      display: "tab",
      emitter: () => {
        if (this._instance?.value) {
          this._instance.value += "\t";
        }
      },
    },
    "{lock}": {
      display: "caps",
      emitter: () => {},
    },
    "{enter}": {
      display: "enter",
      emitter: () => {
        const initEvent = {
          key: "Enter",
        } as KeyboardEventInit;
        const evp = new KeyboardEvent("keypress", initEvent);
        const evd = new KeyboardEvent("keydown", initEvent);
        this._instance?.dispatchEvent(evd);
        this._instance?.dispatchEvent(evp);
      },
    },
    "{shift}": {
      display: "shift",
      emitter: () => {},
    },
    "{space}": {
      display: "",
      emitter: () => {},
    },
  } as const as CharMapping;
