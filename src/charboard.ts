import style from "./charboard.module.scss";

type CharboardOptions = {
  selector?: string;
  layout?: string[];
};

export class Charboard {
  private _keyboardContainer?: HTMLDivElement;
  private _instance?: HTMLInputElement;
  private _pressedCaps = false;
  private _pressedShift = false;
  private _options: CharboardOptions = {
    layout: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{lock} a s d f g h j k l ; ' {enter}",
      "{shift} z x c v b n m , . / {shift}",
      ".com @ {space}",
    ],
  };

  constructor(options: string | CharboardOptions) {
    this._setOptions(options);
    if (!this._instance) {
      throw new Error("The selector you specified is invalid");
    } else {
      this._init();
    }
  }

  private _setOptions(options: string | CharboardOptions) {
    if (typeof options === "string") {
      this._options.selector = options;
    } else {
      this._options = Object.assign(this._options, options);
    }
    if (this._options.selector) {
      this._instance = document.querySelector(
        this._options.selector
      ) as HTMLInputElement;
    }
  }

  private _init() {
    this._createEventListeners();
  }

  private _createEventListeners() {
    if (!this._instance) return;

    document.addEventListener("click", () => {
      this._destroyKeyboard();
    });

    this._instance.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!this._keyboardContainer) this._createKeyboard();
    });
  }

  private _createKeyboard() {
    this._keyboardContainer = document.createElement("div");
    this._keyboardContainer.className = style.keyboardContainer;
    this._keyboardContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    if (this._options.layout) {
      for (const index in this._options.layout) {
        const line = this._options.layout[index];
        if (line) {
          const lineContainer = document.createElement("div");
          lineContainer.className = style.row;

          const lineItems = line.split(" ");
          for (const keyIndex in lineItems) {
            const key = lineItems[keyIndex];
            const keyButton = document.createElement("button");

            if (Object.prototype.hasOwnProperty.call(this._charMapping, key)) {
              keyButton.innerText = this._charMapping[key].display;
            } else {
              keyButton.innerText = key;
            }
            keyButton.type = "button";
            keyButton.onmousedown = this._keyAction(key);

            lineContainer.append(keyButton);
          }
          this._keyboardContainer.append(lineContainer);
        }
      }
    }

    document.body.append(this._keyboardContainer);
  }

  private _destroyKeyboard() {
    this._keyboardContainer?.remove();
    this._keyboardContainer = undefined;
  }

  private _repetitiveAction(key: string) {
    return () => {
      if (Object.prototype.hasOwnProperty.call(this._charMapping, key)) {
        this._charMapping[key].emitter?.();
      } else if (this._instance) {
        this._instance.value += key;
      }

      this._focusAction();
    };
  }

  private _keyAction(key: string) {
    return () => {
      this._repetitiveAction(key)();
    };
  }

  private _focusAction() {
    if (this._instance) {
      this._instance.scrollLeft = this._instance.scrollWidth;
    }
  }
}
