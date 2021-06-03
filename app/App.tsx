/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */


import React, { FC, useEffect, useRef, useState } from 'react';
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';


import { SaCollection } from './models/saCollection';
import { SaLetter } from './models/saLetter';
import { SaCollections } from './models/saCollections';
const apiData = require('./spelalfabeet.json')



export default function App() {

  const [alphabetsData, setAlphabetsData] = useState<SaCollections | undefined>(undefined)
  const [text, onChangeText] = useState<string | undefined>(undefined)
  const [selectedLanguage, setSelectedLanguage] = useState<string|undefined>();

  function fetchAlphabets() {
    setAlphabetsData(apiData)
  }

  function getLanguages() {
    let languages: string[] = [];
    alphabetsData?.collections.forEach((collection: SaCollection) => {
      languages.push(collection.language);
    })
    return languages;
  }
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function getLanguagesPickerItems(): Element[] {
    let pickerItems: Element[] = [];

    getLanguages().forEach((langName: string) => {
      pickerItems.push(<Picker.Item color='white' label={capitalizeFirstLetter(langName)} value={langName} />)
    })

    return pickerItems

  }

  useEffect(() => {
    fetchAlphabets();

  })

  function getLanguageIndex(langName: string): number {
    let found: number = 0;
    alphabetsData?.collections.forEach((collection, idx) => {
      if(collection.language == langName)
      {
        found = idx;
      }

    })

    return found;
  }



  function getSpelledOut(ch: string): string | undefined {
    let found: string | undefined = undefined;
    if(selectedLanguage === undefined)
    {
      return found;
    }
    alphabetsData?.collections[getLanguageIndex(selectedLanguage)].letters.forEach((saLetter: SaLetter) => {
      if (saLetter.character.toLowerCase() == ch.toLowerCase()) {
        found = saLetter.spelledOut;
      }
    })
    return found;
  }

  function translateIt(): string {
    let spelledOutCol: string[] = [];
    if (text == null) {
      return "";
    }

    let curIdx = 0;
    while (curIdx < text?.length) {
      let curChar = text.charAt(curIdx);

      if (curChar == 'i') {
        let nxtChar = text.charAt(curIdx + 1);
        if (nxtChar == 'j') {
          curChar = 'ij';
          curIdx += 2;
        }
        else {
          curIdx += 1;
        }
      }
      else {
        curIdx += 1;
      }
      let spelledOut = getSpelledOut(curChar);
      spelledOut == undefined ? spelledOutCol.push(curChar) : spelledOutCol.push(spelledOut);
    }

    return spelledOutCol.join(" - ")
  }


  return (
    <>
      <SafeAreaView style={[styles.container, { flexDirection: 'column', backgroundColor: 'black' }]}>
        <View style={{ flex: 1 }} >
          <Text style={[styles.centerIt, styles.appTitle, { color: 'white' }]}>Spelling alphabet</Text>
          <Text style={[styles.centerIt, styles.appDesc, { color: 'white' }]}>Proof of concept by K4CZP3R</Text>
        </View>
        <View style={{ flex: 2 }} >
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedLanguage(itemValue)
            }}>

            {getLanguagesPickerItems()}

          </Picker>
        </View>
        <View style={{ flex: 3 }}>
          <Text style={[styles.centerIt, styles.info1, { color: 'white' }]}>Enter text which will be translated:</Text>
          <TextInput placeholderTextColor='lightgray' style={[styles.input]} onChangeText={onChangeText} value={text} placeholder="Tracking number or something else" />

          <Text style={[styles.centerIt, styles.info2, { color: 'white' }]}> {translateIt()}</Text>
        </View>


      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 30
  },
  appDesc: {
    fontStyle: 'italic'
  },
  info1: {
    fontWeight: 'bold'
  },
  info2: {
    fontStyle: 'italic'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  centerIt: {
    textAlign: 'center'
  },
  input: {
    textAlign: 'center',
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: 'white',
    color: 'white'
  }

});