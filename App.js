import React, {useState, useEffect} from 'react';
  import { View, Text, StyleSheet, Pressable, Button, TextInput, Alert, Keyboard } from 'react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import { DataTable } from 'react-native-paper';
  

  const MainScreen = ({navigation, route}) => {
    const[originalprice, setNewP] = useState(0);
    const[discountedPrice, setDP] = useState(0);
    const[savedAmount, setSA] = useState(0);
    const[FDP, setFP] = useState(0);
    const[record, setRecord] = useState([]);
  

    useEffect(()=>{pricecalculation()});
  

    const pricecalculation = () => {
      let temp = 0;
      if (originalprice > 0 && discountedPrice > 0 && discountedPrice < 100){
        temp = ((100-discountedPrice)/100)*originalprice;
        setFP(temp.toFixed(2));
        setSA((originalprice-temp).toFixed(2));
        Keyboard.dismiss;
      }
      else if (discountedPrice > 100) {
        Alert.alert("Warning","Discounted % should be less than 100;.");
        setDP(0);
        setFP(0);
        setSA(0);
      }
      else if (discountedPrice < 0 || originalprice < 0) {
        Alert.alert("You can enter positive numbers only(input not valid)");
        setNewP(0);
        setDP(0);
        setFP(0);
        setSA(0);
      }
    }
  

    const history = () => {
      setRecord([...record,{ogData: originalprice, discData: discountedPrice, fpData: FDP}]);
      setNewP(0);
      setDP(0);
      setFP(0);
      setSA(0);
    }
  

    navigation.setOptions({headerRight: () => <Button title="Record" color="#2ECC71" onPress={()=> navigation.navigate("Record",{ListedR: record, RecordingFun: setRecord})} />})
  

    return (
      <View style={styles.container}>
        <Text style={styles.hdr}>Discount Calculator</Text>
        <View style={styles.box}>
          
          <Text style={styles.txt}>Original Price</Text>
          <TextInput style={styles.txtInput}
            keyboardType = {"number-pad"}
            onChangeText ={(text) => setNewP(text)}
            value = {originalprice}
            placeholder = "enter original price"
            onEndEditing={Keyboard.dismiss}
          />
          <Text style={styles.txt}>Discounted Price</Text>
          <TextInput style={styles.txtInput}
            keyboardType = {"number-pad"}
            onChangeText={(text) => setDP(text)}
            value = {discountedPrice}
            placeholder = "enter discountedPrice % (< 100)"
            onEndEditing={Keyboard.dismiss}
          />
          <Pressable onPress={() => history()} disabled={discountedPrice===0 || originalprice===0} style={styles.btn}><Text>Save Record</Text></Pressable>
        </View>
        <View style={styles.box2}>
          <Text style={styles.txt2}>Amount Saved  {savedAmount}</Text>
          <Text style={styles.txt2}>Discounted Price {FDP}</Text>
        </View>
      </View>
    );
      
  }
  

  const Rpanel = ({navigation, route}) => {
    const ListedR = route.params.ListedR;
    const RecordingFun = route.params.RecordingFun;
    const [RpanelList, setHisScreenList] = useState(ListedR);
  

    const remove = () => {
      Alert.alert("Do you want to remove record?",
      [{text:'Yes',onPress:()=>{
        setHisScreenList([]); 
        navigation.setParams(RecordingFun([]))}},
      {text:'No',onPress:()=>{}}]
      );
    }
  

    navigation.setOptions({headerRight: () => <Button title="Remove" color="#CB4335" onPress={()=> remove()}/>})
  

    const Cdeletion= (itemIndex) => {
      let tempList = RpanelList.filter((data,index)=>index!==itemIndex);
      navigation.setParams(RecordingFun(tempList));
      setHisScreenList(tempList);
    }
  

    return(
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Index</DataTable.Title>
          <DataTable.Title>Original</DataTable.Title>
          <DataTable.Title>DiscountedPrice %</DataTable.Title>
          <DataTable.Title numeric>Final Price</DataTable.Title>
          <DataTable.Title></DataTable.Title>
        </DataTable.Header>
        {RpanelList.map((item, index)=>{
          return(
        <DataTable.Row>
          <DataTable.Cell>{index+1}</DataTable.Cell>
          <DataTable.Cell>{item.ogData}</DataTable.Cell>
          <DataTable.Cell>{item.discData}</DataTable.Cell>
          <DataTable.Cell>{item.fpData}</DataTable.Cell>
          <DataTable.Cell numeric><Pressable onPress={() => Cdeletion(index)} style={{backgroundColor:"#CB4335", borderRadius: 5, width:20, alignItems:"center"}}><Text style={{color: "white"}}>X</Text></Pressable></DataTable.Cell>
        </DataTable.Row>
          )
        })}
      </DataTable>
    );
  }
  

  const Stack = createStackNavigator();
  

  function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={"start"} 
          screenOptions={{
            headerTintColor: "black",
            headerStyle: {
              backgroundColor: "#CB4335"
            }
          }}>
          <Stack.Screen name="Main" component={MainScreen}/>
          <Stack.Screen name="Record" component={Rpanel}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#52BE80',
    },
    box: {
      alignItems: 'center',
      backgroundColor: '#16A085',
      marginTop: 10,
    },
    hdr : {
      fontSize: 20,
      marginLeft: 70,
      marginBottom: 25,
      marginTop: 25,
      fontWeight: 'bold',
      color: '#138D75', 
      fontFamily: 'forte',
    },
    txt : {
      marginTop: 25,
      fontSize: 17,
      fontWeight: "bold",
      color: 'balck', 
      fontFamily: "forte",
    },
    txt2 : {
      marginLeft:70,
      fontSize: 18,
      color: 'black', 
      fontFamily: "forte",
    },
    txtInput: {
      width: "50%",
      height: 50,
      borderColor: "#2ECC71",
      borderWidth: 2,
      margin: 10,
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    box2: {
      justifyContent: "flex-start",
      width: 300,
      height: 80,
      marginTop: 30,
    },
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#CB4335',
      height: 40,
      width: 100,
      marginTop: 15,
      marginBottom: 15,
    }
  });
  

  

  export default App;




