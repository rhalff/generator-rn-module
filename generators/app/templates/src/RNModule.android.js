import React, { Component } from 'react'
import {
  Button,
  View,
  NativeModules,
} from 'react-native'

const { <%= moduleName %>Module } = NativeModules

export default class <%= moduleName %>ModuleComponent extends Component {
  render() {
    return (
      <View>
        <Button
          title="To get started, edit RNModule.android.js"
          onPress={() => <%= moduleName %>Module.<%= reactMethodName %>()}
        />
      </View>
    )
  }
}
