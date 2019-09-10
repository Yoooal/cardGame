import React from 'react';
import { View, Text, Button, Image } from 'react-native';

export default class App extends React.Component {
  state = {
    cardsRemaining: 0,
    currentCard: null,
    lastCardValue: null,
    score: 0
  };

  deckID = null;
  cardValues = {
    "ACE": 14,
    "KING": 13,
    "QUEEN": 12,
    "JACK": 11,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
  }

  componentDidMount() {
    this.newGame();
  }

  newGame = async () => {
    this.setState({
      cardsRemaining: 0,
      currentCard: null,
      lastCardValue: null,
      score: 0
    })
    response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    responseJson = await response.json();
    this.deckID = responseJson.deck_id
    this.setState({
      cardsRemaining: responseJson.remaining
    })
  }

  drawCard = async (choice = null) => {
    let result;

    if (this.state.currentCard) {
      this.state.lastCardValue = this.cardValues[this.state.currentCard.value]
    }

    response = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckID}/draw/?count=1`);
    responseJson = await response.json();
    this.deckID = responseJson.deck_id,
      this.setState({
        cardsRemaining: responseJson.remaining,
        currentCard: responseJson.cards[0]
      })

    if (choice) {
      if (choice === 'higher') {
        result = this.cardValues[this.state.currentCard.value] > this.state.lastCardValue;
      } else if (choice === 'lower') {
        result = this.cardValues[this.state.currentCard.value] < this.state.lastCardValue;
      }
    }

    if (result) {
      this.setState({
        score: this.state.score + 1
      });
    }
  }

  gameOn = () => {
    if (this.state.currentCard) {
      return (
        <View>
          <Button
            title="Higher"
            onPress={() => this.drawCard("higher")}
          />
          <Button
            title="Lower"
            onPress={() => this.drawCard("lower")}
          />
        </View>
      )
    }
  }

  renderCard = () => {
    if (this.state.currentCard) {
      return (
        <Image
          style={{ width: 200, height: 400, alignSelf: 'center' }}
          source={{ uri: this.state.currentCard.image }}
        />
      )
    }
  }

  render() {
    return (
      <View>
        <Text>
          Remainin cards: {this.state.cardsRemaining}
        </Text>
        <Text>
          Current score: {this.state.score}
        </Text>
        <Text>
          {this.state.gameOver}
        </Text>
        <Button
          title="Start new game"
          onPress={() => this.newGame()}
        />
        <Button
          title="Draw a Card"
          onPress={() => this.drawCard()}
        />
        {this.renderCard()}
        {this.gameOn()}
      </View>
    )
  }
}
