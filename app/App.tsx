/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */


import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';


import {
  Colors, Header,
} from 'react-native/Libraries/NewAppScreen';
import TopBar from './components/TopBar';
import { SaCollection } from './models/saCollection';
import { SaLetter } from './models/saLetter';
const apiData = require('./spelalfabeet.json')

export default function App() {

  const [alphabetData, setAlphabetData] = useState<SaCollection | undefined>(undefined)
  const [text, onChangeText] = useState<string | undefined>(undefined)

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function fetchAlphabet() {
    setAlphabetData(apiData);
  }

  useEffect(() => {
    fetchAlphabet();
  })

  function getSpelledOut(ch: string): string | undefined {
    let found: string | undefined = undefined;
    alphabetData?.letters.forEach((saLetter: SaLetter) => {
      if (saLetter.character.toLowerCase() == ch.toLowerCase()) {
        found = saLetter.spelledOut;
      }
    })
    return found;
  }

  function translateIt(): string {
    let spelledOutCol: string[] = [];
    console.log("Translating ======");
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

      console.log(`${curChar}: ${getSpelledOut(curChar)}`);
      let spelledOut = getSpelledOut(curChar);
      spelledOut == undefined ? spelledOutCol.push(curChar) : spelledOutCol.push(spelledOut);
    }

    return spelledOutCol.join(" - ")
  }

  function showTranslated() {
    let translated = translateIt();
    return translated ? <Text style={styles.centerIt}>{translated}</Text> : <></>
  }

  return (
    <>
      <SafeAreaView style={[styles.container, { flexDirection: 'column' }]}>
        <View style={{ flex: 1}} >
          <Text style={[styles.centerIt, styles.appTitle]}>Spelling alphabet</Text>
          <Text style={[styles.centerIt, styles.appDesc]}>Proof of concept by K4CZP3R</Text>
        </View>
        <View style={{ flex: 3}}>
          <Text style={[styles.centerIt, styles.info1]}>Enter text which will be translated:</Text>
          <TextInput style={styles.input} onChangeText={onChangeText} value={text} placeholder="Tracking number or something else" />

          <Text style={[styles.centerIt, styles.info2]}> {translateIt()}</Text>
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
  }

});