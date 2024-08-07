import { View, Text } from 'react-native'
import React from 'react'

const Header = (props) => {
  return (
    <View style={{ marginLeft:15}}>
      <Text style={{fontWeight:'bold', fontSize:22}}>
        {props.name}
      </Text>
        <Image  source={require('./assets/logo.png')}/>
    
    </View>
  )
}

export default Header