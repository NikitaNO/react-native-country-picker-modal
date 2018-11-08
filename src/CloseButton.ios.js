// @flow
import React from 'react'
// eslint-disable-next-line
import { Image, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'

const CloseButton = props => {
  let closeImage = require('./close.png')

  if (props.image) closeImage = props.image

  return (
    <View style={props.styles[0]}>
      <TouchableOpacity onPress={props.onPress} style={{ padding: 20 }}>
        <Image source={closeImage} style={props.styles[1]} />
      </TouchableOpacity>
    </View>
  )
}

CloseButton.propTypes = {
  styles: PropTypes.array,
  onPress: PropTypes.func,
  image: PropTypes.any
}

export default CloseButton
