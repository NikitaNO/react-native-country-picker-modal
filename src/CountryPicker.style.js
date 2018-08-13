import { Platform, StyleSheet, PixelRatio } from 'react-native'
import { getHeightPercent } from './ratio'

export default StyleSheet.create({
  modalContainer: {
    backgroundColor: '#16161d',
    flex: 1,
    paddingTop: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 16 : 0,
    marginLeft: 15
  },
  filterContainer: {
    marginRight: 15
  },
  contentFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delimiter: {
    width: '100%'
  },
  input: {
    width: '80%',
    fontSize: 12,
    color: 'white',
    height: getHeightPercent(7)
  },
  serchIcon: {
    width: 15,
    height: 15,
    tintColor: '#36cdaf',
    marginRight: 10
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    flexDirection: 'row',
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 15,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8,
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 25,
    width: 25,
    height: 25,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  itemCountry: {
    flexDirection: 'row',
    height: getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '7%',
  },
  itemCountryName: {
    justifyContent: 'center',
    marginLeft: 15,
    width: '100%'
  },
  countryName: {
    fontSize: 12,
    color: 'white'
  },
  letters: {
    marginLeft: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    height: 25,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  letterText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white'
  },
  closeButton: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -3,
    top: -3,
    zIndex: 100,
  },
  closeButtonImage: {
    height: 17,
    width: 17,
    resizeMode: 'contain'
  },
  countryText: {
    fontSize: 16,
    color: '#36cdaf',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectCountryText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10
  },
  curentCountryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  curentCountryFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    height: 40,
    width: '60%',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    marginRight: 10,
    backgroundColor: 'rgba(54,205,175,.1)'
  },
  curentCantryText: {
    fontSize: 12,
    color: '#36cdaf',
  },
  cuntryNmame: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    marginLeft: 15,
    marginRight: 10,
  },
  activLetterWrapper: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(54,205,175,.1)',
    borderRadius: 35 / 2,
  },
  activLetterContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(54,205,175,.2)',
    borderRadius: 25 / 2,
  },
  activeLetter: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  }
});
