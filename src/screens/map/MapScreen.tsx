import { Platform } from 'react-native';

const MapScreen = Platform.OS === 'web'
  ? require('./MapScreen.web').default
  : require('./MapScreen.native').default;

export default MapScreen;
