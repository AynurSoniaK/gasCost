import React, { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';

interface Location {
  value: string;
  label: string;
}

interface Props {
  locations: Location[];
  onSelect: (value: string) => void;
}

const ITEM_HEIGHT = 40;

const InputSelector: React.FC<Props> = ({ locations, onSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSelect = (country: Location) => {
    setSelectedLocation(country);
    setSearchText(country.label);
    onSelect(country.value);
    if (showDropdown) {
      toggleDropdown(); // Close the dropdown if it is open
    }
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setSelectedLocation(null);
  };

  const handleInputPress = () => {
    setSearchText('');
    setSelectedLocation(null);
  };

  const renderItem = ({ item }: { item: Location }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Text style={{ height: ITEM_HEIGHT, lineHeight: ITEM_HEIGHT }}>{item.label}</Text>
    </TouchableOpacity>
  );

  const keyExtractor = (item: Location) => item.value;

  const filteredLocations = useMemo(() => {
    return locations.filter(location => location.label.toLowerCase().startsWith(searchText.toLowerCase()));
  }, [locations, searchText]);

  useEffect(() => {
    if (searchText.length > 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchText]);

  useLayoutEffect(() => {
    if (selectedLocation) {
      // Focus the TextInput when a location is selected
      inputRef.current?.focus();
    }
  }, [selectedLocation]);

  const inputRef = useRef<TextInput>(null);

  return (
    <View>
      <TouchableWithoutFeedback onPress={toggleDropdown}>
        <TextInput
          ref={inputRef}
          style={styles.inputLocationContainer}
          value={searchText}
          onChangeText={handleTextChange}
          onFocus={toggleDropdown}
          placeholder='Tap here'
          onPressIn={handleInputPress} // Clear the input field when pressed
        />
      </TouchableWithoutFeedback>
      {showDropdown && searchText.length > 2 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            renderItem={renderItem}
            data={filteredLocations}
            keyExtractor={keyExtractor}
            getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
            initialNumToRender={20} // Number of items to render initially
            maxToRenderPerBatch={20} // Number of items to render per batch
            windowSize={5} // Number of items to keep rendered in memory
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputLocationContainer: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: 'blue',
    width: 150,
    borderRadius: 5,
  },
  dropdownContainer: {
    marginRight: 5,
    width: 150, // Set the desired width for the dropdown container
  },
});

export default InputSelector;
