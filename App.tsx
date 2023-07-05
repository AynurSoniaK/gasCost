import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { API_KEY } from "@env";
import CountrySelector from './components/CountrySelector';

const App = () => {

  const Logo = require("./assets/gasCost.png")

  const [cost, setCost] = useState<number>(0);
  const [fuelConsumption, setFuelConsumption] = useState<number>(0);
  const [distanceFound, setDistanceFound] = useState<number>(0);
  const [departure, setDeparture] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [departureLat, setDepartureLat] = useState<string>('');
  const [departureLong, setDepartureLong] = useState<string>('');
  const [destinationLat, setDestinationLat] = useState<string>('');
  const [destinationLong, setDestinationLong] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [gasPrice, setGasPrice] = useState<string>('');
  const [showCost, setShowCost] = useState(false);

  const radioButtons: RadioButtonProps[] = useMemo(() => ([
    {
      id: '6',
      label: 'Compact',
      value: '6'
    },
    {
      id: '8',
      label: 'Midsize',
      value: '8'
    },
    {
      id: '10',
      label: 'SUV',
      value: '10'
    }
  ]), []);

  const handleDepartureChange = (city: string, latitude: string, longitude: string) => {
    setDeparture(city);
    setDepartureLat(latitude);
    setDepartureLong(longitude);
  }

  const handleDestinationChange = (city: string, latitude: string, longitude: string) => {
    setDestination(city);
    setDestinationLat(latitude);
    setDestinationLong(longitude);
  }

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  function calculateGasCost(price: number, distance: number, consumption: number): number {
    const fuelRequired = (distance / 100) * consumption;
    const totalCost = fuelRequired * price;
    return totalCost;
  }

  useEffect(() => {
    if (departureLat && departureLong && destinationLat && destinationLong) {
      axios
        .get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${departureLong},${departureLat}&end=${destinationLong},${destinationLat}`)
        .then((response: any) => {
          const distance = response.data.features[0].properties.summary.distance;
          setDistanceFound(parseInt(distance) / 1000)
        })
        .catch((error: any) => {
          console.error('Error retrieving distance:', error);
        });
    }
  }, [departureLat, departureLong, destinationLat, destinationLong]);

  useEffect(() => {
    if (distanceFound !== 0 && fuelConsumption !== 0 && gasPrice.length > 0) {
      const finalGasCost = Number(gasPrice);
      const gasCost = calculateGasCost(finalGasCost, distanceFound, fuelConsumption);
      setCost(gasCost);
      setShowCost(true);
    } else {
      setShowCost(false);
    }
  }, [distanceFound, fuelConsumption, gasPrice]);

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo}></Image>
        <View style={styles.inputContainer}>
          <CountrySelector onCoordinatesChange={handleDepartureChange} />
        </View>
        <View style={styles.inputContainer}>
          <CountrySelector onCoordinatesChange={handleDestinationChange} />
        </View>
        <View style={styles.radioContainer}>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
            layout='row'
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setGasPrice}
            value={gasPrice}
            placeholder="Gas price/liter"
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => {
              if (distanceFound !== 0) {
                Keyboard.dismiss()
                setFuelConsumption(parseInt(selectedId || '0'));
              }
            }}>
            <Text style={styles.button}>Cost in euro</Text>
          </TouchableOpacity>
        </View>
        {showCost && departureLat !== '' && departureLong !== '' && destinationLat !== '' && destinationLong !== '' && (
          <Text>
            This ride will cost approximately {cost.toFixed(2)} euros.
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#535150',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 11,
    borderColor: '#535150',
    borderRadius: 5,
    marginLeft: 0,
  },
  logo: {
    width: 200,
    height: 200
  },
  inputContainer: {
    flexDirection: 'row'
  },
  text: {
    height: 40,
    margin: 12,
    padding: 10,
    marginLeft: 0,
    color: '#535150',
  },
  button: {
    height: 40,
    margin: 12,
    padding: 11,
    marginLeft: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    color: 'red'
  },
  radioContainer: {
    padding: 10,
  },
});

export default App;
