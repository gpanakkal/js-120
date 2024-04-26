class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  toString() {
    const capitalized = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);
    return `${capitalized(this.rank)} of ${capitalized(this.suit)}`;
  }
}

class Deck {
  static suits = ['spades', 'diamonds', 'clubs', 'hearts'];

  static ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

  constructor(options = {}) {
    this.cards = Deck.initializeDeck();
    if (options.shuffled) this.shuffle();
  }

  static initializeDeck() {
    const cards = [];
    Deck.suits.forEach((suit) => {
      Deck.ranks.forEach((rank) => {
        const card = new Card(suit, rank);
        cards.push(card);
      });
    });

    return cards;
  }

  shuffle() {
    this.cards.sort(() => Math.random() - Math.random());
  }

  draw() {
    return this.cards.shift();
  }
}

module.exports = { Deck };
