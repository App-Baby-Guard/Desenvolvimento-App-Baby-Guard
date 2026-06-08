// import 'react-native-gesture-handler/jestSetup';

try {
  const { ModuleMocker } = require('jest-mock');
  if (ModuleMocker && !ModuleMocker.prototype.clearMocksOnScope) {
    ModuleMocker.prototype.clearMocksOnScope = function (scope) {
      if (!scope) return;
      for (const key of Object.keys(scope)) {
        const value = scope[key];
        if (value != null && (typeof value === 'object' || typeof value === 'function') && '_isMockFunction' in value && this.isMockFunction(value) && typeof value.mockClear === 'function') {
          value.mockClear();
        }
      }
    };
  }
} catch (e) {
  // Ignore
}

// Pre-load and define Expo winter CG runtime properties as non-configurable
// to prevent Expo from overwriting them with lazy-getters that trigger dynamic require errors between tests.
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Failed to set polyfill')) return;
  originalConsoleError(...args);
};

try {
  Object.defineProperty(global, '__ExpoImportMetaRegistry', {
    value: require('expo/src/winter/ImportMetaRegistry').ImportMetaRegistry,
    configurable: false,
    writable: true,
    enumerable: true
  });
  Object.defineProperty(global, 'URL', {
    value: require('expo/src/winter/url').URL,
    configurable: false,
    writable: true,
    enumerable: true
  });
  Object.defineProperty(global, 'URLSearchParams', {
    value: require('expo/src/winter/url').URLSearchParams,
    configurable: false,
    writable: true,
    enumerable: true
  });
  Object.defineProperty(global, 'TextDecoder', {
    value: require('expo/src/winter/TextDecoder').TextDecoder,
    configurable: false,
    writable: true,
    enumerable: true
  });
  Object.defineProperty(global, 'structuredClone', {
    value: require('@ungap/structured-clone').default,
    configurable: false,
    writable: true,
    enumerable: true
  });
} catch (e) {
  // Ignore
}


// Mock global fetch
Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true,
  configurable: true
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-sqlite
jest.mock('expo-sqlite', () => {
  const mockDb = {
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
    execAsync: jest.fn(),
    withTransactionAsync: jest.fn(async (cb) => {
      await cb();
    }),
  };
  return {
    openDatabaseAsync: jest.fn().mockResolvedValue(mockDb),
    __mockDb: mockDb,
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return {
    Provider: ({ children }) => children,
    MD3DarkTheme: {},
    MD3LightTheme: {},
    useTheme: () => ({ colors: {} }),
    Text: RN.Text,
    Button: RN.TouchableOpacity,
    TextInput: RN.TextInput,
    Switch: RN.Switch,
    Card: RN.View,
    IconButton: RN.TouchableOpacity,
    ActivityIndicator: RN.ActivityIndicator,
    Surface: RN.View,
    Divider: RN.View,
    List: {
      Item: RN.View,
      Section: RN.View,
    },
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Mock @react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useIsFocused: jest.fn(() => true),
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock ThemeContext globally so any screen/component using useTheme renders
// without needing to be wrapped inside a ThemeProvider.
// The ThemeContext.test.tsx file calls jest.unmock to bypass this and test the real implementation.
jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ isDarkMode: false, toggleDarkMode: jest.fn() }),
  ThemeProvider: ({ children }) => children,
  ThemeContext: {},
}));
