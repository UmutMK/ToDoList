import { View, Text, StyleSheet,Image} from 'react-native';

const TabBarIcon = () => {
    return(
        <View style={Styles.container}>
           
        </View>

    );
};

export default TabBarIcon;


const Styles = StyleSheet.create({
    container: {
      flex: 0.9,
      backgroundColor: 'turquoise',
      paddingTop:40,
      paddingHorizontal:20,
      //alignItems: 'center',
      //justifyContent: 'center',
    },
    text:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:16,
    }
  
  });