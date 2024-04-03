
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
  btoa: (input: string = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input: string = '') => {
    let str = input.replace(/[=]+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};
export const Auth_header = (api_key: string, api_secret: string) => {
  return {
    Authorization: `Basic ${Base64.btoa(api_key + ':' + api_secret)}`,
    'content-type': 'application/json',
  };
};
export type MMKVOption = {
  id: string;
  cryptKey: string;
};
export const MMKVStorage = {
  setString: async (key: string, value: string) => {
    const res = await storage.set(key, value);
    return res;
  },
  setNumber: async (key: string, value: number) => {
    const res = await storage.set(key, value);
    return res;
  },
  setBoolean: async (key: string, value: boolean) => {
    const res = await storage.set(key, value);
    return res;
  },
  getString: async (key: string) => {
    const res: string | any = await storage.getString(key);
    return res;
  },
  getNumber: async (key: string) => {
    const res: number | any = await storage.getNumber(key);
    return res;
  },
  getBoolean: async (key: string) => {
    const res: boolean | any = await storage.getBoolean(key);
    return res;
  },
  getAllKeys: async () => {
    const res: Array<string> = await storage.getAllKeys();
    return res;
  },
  clearAll: async () => {
    const res: void = await storage.clearAll();
    return res;
  },
  delete: async (key: string) => {
    const res: void = await storage.delete(key);
    return res;
  },
};

// export const setEnableIQKeyboard = (enable: boolean) => {
//   if (!isIos) {
//     return;
//   }
//   AppModule.setIQKeyboardOption({enable});
// };

// export const setIQKeyboardOption = (options: {
//   enable?: boolean;
//   layoutIfNeededOnUpdate?: boolean;
//   enableDebugging?: boolean;
//   keyboardDistanceFromTextField?: number;
//   enableAutoToolbar?: boolean;
//   toolbarDoneBarButtonItemText?: string;
//   toolbarManageBehaviourBy?: 'subviews' | 'tag' | 'position';
//   toolbarPreviousNextButtonEnable?: boolean;
//   toolbarTintColor?: string;
//   toolbarBarTintColor?: string;
//   shouldShowToolbarPlaceholder?: boolean;
//   overrideKeyboardAppearance?: boolean;
//   keyboardAppearance?: 'default' | 'light' | 'dark';
//   shouldResignOnTouchOutside?: boolean;
//   shouldPlayInputClicks?: boolean;
//   resignFirstResponder?: boolean;
//   reloadLayoutIfNeeded?: boolean;
// }) => {
//   if (!isIos) {
//     return;
//   }
//   const actualOption = {...options};
//   if (options.toolbarBarTintColor) {
//     actualOption.toolbarBarTintColor = hexStringFromCSSColor(
//       options.toolbarBarTintColor,
//     );
//   }
//   if (options.toolbarTintColor) {
//     actualOption.toolbarTintColor = hexStringFromCSSColor(
//       options.toolbarTintColor,
//     );
//   }
//   AppModule.setIQKeyboardOption(actualOption);
// };
