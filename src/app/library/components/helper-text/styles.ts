import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 3,
    paddingBottom: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    overflow: 'hidden',
    marginBottom:15
  },
  text: {
    fontWeight: '400',
    fontSize:12,
    fontFamily: 'SFProDisplay-Regular'
  },
  hiddenView: {
    position: 'absolute',
    zIndex: -999,
    opacity: 0,
    // overflow: 'hidden',
  },
});
