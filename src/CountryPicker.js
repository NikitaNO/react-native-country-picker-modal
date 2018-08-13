// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  ListView,
  ScrollView,
  Platform,
  Animated,
  Easing,
  Dimensions
} from 'react-native'
import { BlurView } from 'react-native-blur'

import Fuse from 'fuse.js'

import cca2List from '../data/cca2'
import { getHeightPercent } from './ratio'
import CloseButton from './CloseButton'
import countryPickerStyles from './CountryPicker.style'
import KeyboardAvoidingView from './KeyboardAvoidingView'
import phoneBack from './phoneBack.png'
import colors from '../../../src/constants/colors';

let countries = null
let Emoji = null
let styles = {}

const { width, height } = Dimensions.get('window');
const isEmojiable = Platform.OS === 'ios'

if (isEmojiable) {
  countries = require('../data/countries-emoji')
  Emoji = require('./emoji').default
} else {
  countries = require('../data/countries')

  Emoji = <View />
}

export const getAllCountries = () =>
  cca2List.map(cca2 => ({ ...countries[cca2], cca2 }))

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default class CountryPicker extends Component {
  static propTypes = {
    cca2: PropTypes.string.isRequired,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    filterable: PropTypes.bool,
    children: PropTypes.node,
    countryList: PropTypes.array,
    excludeCountries: PropTypes.array,
    styles: PropTypes.object,
    filterPlaceholder: PropTypes.string,
    autoFocusFilter: PropTypes.bool,
    // to provide a functionality to disable/enable the onPress of Country Picker.
    disabled: PropTypes.bool,
    filterPlaceholderTextColor: PropTypes.string,
    closeButtonImage: Image.propTypes.source,
    transparent: PropTypes.bool,
    animationType: PropTypes.string,
    cuntryNmame: PropTypes.string,
  }

  static defaultProps = {
    translation: 'eng',
    countryList: cca2List,
    excludeCountries: [],
    filterPlaceholder: 'Filter',
    autoFocusFilter: true,
    transparent: false,
    animationType: 'none'
  }

  static renderEmojiFlag(cca2, emojiStyle) {
    return (
      <Text style={[styles.emojiFlag, emojiStyle]}>
        {cca2 !== '' && countries[cca2.toUpperCase()] ? (
          <Emoji name={countries[cca2.toUpperCase()].flag} />
        ) : null}
      </Text>
    )
  }

  static renderImageFlag(cca2, imageStyle) {
    return cca2 !== '' ? (
      <Image
        style={[styles.imgStyle, imageStyle]}
        source={{ uri: countries[cca2].flag }}
      />
    ) : null
  }

  static renderFlag(cca2, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={[styles.itemCountryFlag, itemStyle]}>
        {isEmojiable
          ? CountryPicker.renderEmojiFlag(cca2, emojiStyle)
          : CountryPicker.renderImageFlag(cca2, imageStyle)}
      </View>
    )
  }

  constructor(props) {
    super(props)
    this.openModal = this.openModal.bind(this)

    let countryList = [...props.countryList]
    const excludeCountries = [...props.excludeCountries]

    excludeCountries.forEach(excludeCountry => {
      const index = countryList.indexOf(excludeCountry)

      if (index !== -1) {
        countryList.splice(index, 1)
      }
    })

    // Sort country list
    countryList = countryList
    .map(c => [c, this.getCountryName(countries[c])])
    .sort((a, b) => {
      if (a[1] < b[1]) return -1
      if (a[1] > b[1]) return 1
      return 0
    })
    .map(c => c[0])

    this.state = {
      modalVisible: false,
      cca2List: countryList,
      dataSource: ds.cloneWithRows(countryList),
      filter: '',
      letters: this.getLetters(countryList),
      activeLetter: 'A',
    }

    if (this.props.styles) {
      Object.keys(countryPickerStyles).forEach(key => {
        styles[key] = StyleSheet.flatten([
          countryPickerStyles[key],
          this.props.styles[key]
        ])
      })
      styles = StyleSheet.create(styles)
    } else {
      styles = countryPickerStyles
    }

    this.fuse = new Fuse(
      countryList.reduce(
        (acc, item) => [
          ...acc,
          { id: item, name: this.getCountryName(countries[item]) }
        ],
        []
      ),
      {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['name'],
        id: 'id'
      }
    );

    this.animatedValue = new Animated.Value(0);

    this.animatedValue.addListener(value => {
      this.setState({ modalBlur: value.value });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.countryList !== this.props.countryList) {
      this.setState({
        cca2List: nextProps.countryList,
        dataSource: ds.cloneWithRows(nextProps.countryList)
      })
    }
  }

  onSelectCountry(cca2) {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: ds.cloneWithRows(this.state.cca2List)
    })

    this.props.onChange({
      cca2,
      ...countries[cca2],
      flag: undefined,
      name: this.getCountryName(countries[cca2])
    })
  }

  onClose() {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: ds.cloneWithRows(this.state.cca2List)
    })
    if (this.props.onClose) {
      this.props.onClose()
    }

    this.onAnimationEnd()
  }

  onAnimationStart = () => {
    const animation = Animated.timing(this.animatedValue, {
      toValue: 32,
      duration: 1000,
      easing: Easing.ease.in,
      useNativeDriver: true,
    });

    animation.start(() => this.onAnimationStart());
  };

  onAnimationEnd = () => {
    const animation = Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 1000,
      easing: Easing.ease.out,
      useNativeDriver: true,
    });

    animation.start(() => this.onAnimationStart());
  };

  getCountryName(country, optionalTranslation) {
    const translation = optionalTranslation || this.props.translation || 'eng'
    return country.name[translation] || country.name.common
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset
  }

  getLetters(list) {
    return Object.keys(
      list.reduce(
        (acc, val) => ({
          ...acc,
          [this.getCountryName(countries[val])
          .slice(0, 1)
          .toUpperCase()]: ''
        }),
        {}
      )
    ).sort()
  }

  openModal = this.openModal.bind(this)

  // dimensions of country list and window
  itemHeight = getHeightPercent(7)
  listHeight = countries.length * this.itemHeight

  openModal() {
    this.setState({ modalVisible: true }, () => this.onAnimationStart())
  }

  scrollTo(letter) {
    // find position of first country that starts with letter
    this.setState({
      activeLetter: letter
    });
    const index = this.state.cca2List
    .map(country => this.getCountryName(countries[country])[0])
    .indexOf(letter)
    if (index === -1) {
      return
    }
    let position = index * this.itemHeight

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight
    }

    // scroll
    this._listView.scrollTo({
      y: position
    })
  }

  handleFilterChange = value => {
    const filteredCountries =
      value === '' ? this.state.cca2List : this.fuse.search(value)

    this._listView.scrollTo({ y: 0 })

    this.setState({
      filter: value,
      dataSource: ds.cloneWithRows(filteredCountries)
    })
  }

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectCountry(country)}
        activeOpacity={0.99}
      >
        <View style={{ marginLeft: 15 }}>
          {this.renderCountryDetail(country)}
          <Image source={require('./delimiter.png')} style={styles.delimiter} />
        </View>
      </TouchableOpacity>
    )
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.scrollTo(letter)}
        activeOpacity={0.6}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderCountryDetail(cca2) {
    const country = countries[cca2]
    return (
      <View style={styles.itemCountry}>
        {CountryPicker.renderFlag(cca2)}
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>{this.getCountryName(country)}</Text>
        </View>
      </View>
    )
  }

  renderCurentCountry = () => {
    const country = countries[this.props.cca2]

    return (
      <View>
        <View style={styles.curentCountryContainer}>
          <View style={styles.curentCountryFlag}>
            {CountryPicker.renderFlag(this.props.cca2)}
            <Text style={styles.cuntryNmame}>{this.getCountryName(country)}</Text>
          </View>
          <Text style={styles.curentCantryText}>{'current country'.toUpperCase()}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', marginBottom: 5 }}>
          <View style={styles.activLetterWrapper}>
            <View style={styles.activLetterContainer}>
              <Text style={styles.activeLetter}>{this.state.activeLetter.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const country = countries[this.props.cca2]

    return (
      <View>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
          style={{ justifyContent: 'center' }}
        >
          {this.props.children ? (
            this.props.children
          ) : (
            <View
              style={[styles.touchFlag]}
            >
              {CountryPicker.renderFlag(this.props.cca2)}
              <Text style={{ fontSize: 14, color: colors.white, textAlign: 'center' }}>{` + ${country.callingCode}`}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Modal
          transparent={this.props.transparent}
          animationType={this.props.animationType}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          {Platform.OS === 'ios' ? (
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }} blurType="dark" blurAmount={this.state.modalBlur}
            />
          ) : (
            <View style={styles.absolute}>
              <Image
                source={phoneBack}
                style={{ position: 'absolute', width, height }}
                resizeMode="cover"
                blurRadius={20}
              />
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            </View>
          )}
          <View style={styles.header}>
            <View style={{ marginTop: 10 }}>
              {this.props.closeable && (
                <CloseButton
                  image={this.props.closeButtonImage}
                  styles={[styles.closeButton, styles.closeButtonImage]}
                  onPress={() => this.onClose()}
                />
              )}
              <Text style={styles.countryText}>COUNTRY</Text>
              <Text style={styles.selectCountryText}>{'Select your country'.toUpperCase()}</Text>
            </View>
            {this.props.filterable && (
              <View style={styles.filterContainer}>
                <Image source={require('./delimiter.png')} style={styles.delimiter} />
                <View style={styles.contentFilterContainer}>
                  <Image source={require('./search.png')} style={styles.serchIcon} />
                  <TextInput
                    underlineColorAndroid="transparent"
                    autoFocus={this.props.autoFocusFilter}
                    autoCorrect={false}
                    placeholder={this.props.filterPlaceholder}
                    placeholderTextColor={this.props.filterPlaceholderTextColor}
                    style={styles.input}
                    onChangeText={this.handleFilterChange}
                    value={this.state.filter}
                  />
                </View>
                <Image source={require('./delimiter.png')} style={styles.delimiter} />
              </View>
            )}
          </View>
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.contentContainer}>
              <View style={{ width: '90%' }}>
                {this.renderCurentCountry()}
                <ListView
                  keyboardShouldPersistTaps="always"
                  enableEmptySections
                  ref={listView => (this._listView = listView)}
                  dataSource={this.state.dataSource}
                  renderRow={country => this.renderCountry(country)}
                  initialListSize={30}
                  pageSize={15}
                  onLayout={({ nativeEvent: { layout: { y: offset } } }) =>
                    this.setVisibleListHeight(offset)
                  }
                />
              </View>
              <ScrollView
                contentContainerStyle={styles.letters}
                keyboardShouldPersistTaps="always"
              >
                {this.state.filter === '' &&
                this.state.letters.map((letter, index) =>
                  this.renderLetters(letter, index)
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    )
  }
}
