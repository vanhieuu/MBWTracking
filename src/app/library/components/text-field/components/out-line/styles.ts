import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgb(216, 216, 216)',
    justifyContent: 'center',
    height:50,
    marginBottom:6,
    marginTop:8,
    paddingHorizontal:15,
  },
  input: {
    color: '#000',
    padding: 0,
    borderBottomColor: 'transparent',
    // marginBottom:20
  },
  text: {
    alignSelf: 'flex-start',
    zIndex: 4,
    left: 5,
  },
  wrapLabel: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  
    
  },
  wrapPlaceHolder: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingLeft: 5,
  },
  flex: {
    flex: 1,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
});
