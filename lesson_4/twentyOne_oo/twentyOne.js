const { question } = require('readline-sync');
const { Deck } = require('./Deck');
const { Participant } = require('./Participant');

class TwentyOneGame {
  static initialHandSize = 2;

  static dealerCardsToShow = 1;

  static dealerStayMinScore = 17;

  static bustScore = 22;

  static royalScore = 10;

  static aceScores = [11, 1];

  static dealerName = 'Dealer';

  static displayWelcomeMessage() {
    console.log('Welcome to Twenty One!');
  }

  static partialMatches(options, input) {
    const testCb = (option) => option.startsWith(input.toLowerCase());
    return options.filter(testCb);
  }

  static getValidInput(prompt, invalidInputMsgCb, testCb) {
    const inputPrefix = '==> ';
    const defaultInvalidInputMsgCb = (input) => `Input ${input} is invalid.`;
    console.log(prompt);
    let userInput = question(inputPrefix);
    while (!testCb(userInput)) {
      const invalidInputMsg = invalidInputMsgCb
        ? invalidInputMsgCb(userInput)
        : defaultInvalidInputMsgCb(userInput);
      console.log(invalidInputMsg);
      userInput = question(inputPrefix);
    }
    return userInput;
  }

  static getValidSelection(prompt, options, invalidInputMsgCb, selectionCb) {
    const testCb = (input) => selectionCb(options, input).length === 1;
    const promptWithOptions = `${prompt} (${options.join(', ')})`;
    const userInput = this.getValidInput(promptWithOptions, invalidInputMsgCb, testCb);
    const matches = selectionCb(options, userInput);
    return matches[0];
  }

  static numberScore = (card) => Number(card.rank);

  // put the aces at the end
  static getSortedHand(hand) {
    const nonAces = hand.filter((card) => card.rank !== 'ace');
    const aces = hand.filter((card) => card.rank === 'ace');
    return [...nonAces, ...aces];
  }

  static scoreHand(hand) {
    return this.getSortedHand(hand).reduce((score, card) => {
      let value;
      const isNumberCard = !Number.isNaN(Number(card.rank));
      if (isNumberCard) value = Number(card.rank);
      else if (card.rank === 'ace') {
        const higherValueBusts = score + this.aceScores[0] >= this.bustScore;
        value = higherValueBusts ? this.aceScores[1] : this.aceScores[0];
      } else {
        value = this.royalScore;
      }
      return score + value;
    }, 0);
  }

  static getHandScore(participant) {
    const hand = participant.getDisplayHand();
    const score = TwentyOneGame.scoreHand(participant.hand);
    return `${hand}. ${participant.name} has ${score} points`;
  }

  static getHandScoreAndMoney(participant) {
    const handScore = TwentyOneGame.getHandScore(participant);
    return `${handScore} and ${participant.formattedMoney()}.`;
  }

  static didBust(participant) {
    return this.scoreHand(participant.hand) >= this.bustScore;
  }

  #result;

  constructor() {
    this.deck = new Deck({ shuffled: true });
    this.participants = [
      new Participant(TwentyOneGame.dealerName),
      new Participant('Player'),
    ];
    this.#result = { winner: 'undecided', score: 0 };
  }

  play() {
    TwentyOneGame.displayWelcomeMessage();

    while (true) {
      this.result = null;
      console.clear();
      this.showParticipantMoney();
      this.dealCards();
      this.showDealerHand();
      let result;
      for (let i = this.participants.length - 1; i >= 0; i -= 1) {
        result = this.participantTurn(this.participants[i]);
        if (result === 'busted') break;
      }
      this.endRound(result === 'busted');
      if (this.promptPlayAgain() === 'no') break;
    }

    this.displayGoodbyeMessage();
  }

  endRound(didBust) {
    console.log('----- ROUND OVER -----');
    if (didBust) {
      this.displayBustResult();
    } else {
      this.displayRoundResult();
    }
    this.logPayouts();
    this.makePayouts();
  }

  dealCards() {
    this.participants.forEach((participant) => {
      participant.hand.length = 0;
      while (participant.hand.length < TwentyOneGame.initialHandSize) {
        if (this.deck.length === 0) this.deck = new Deck({ shuffled: true });
        participant.hit(this.deck.draw());
      }
    });
  }

  promptPlayAgain() {
    const promptStr = `Would you like to play again, ${this.participants[1].name}?`;
    const choice = TwentyOneGame.getValidSelection(promptStr, ['yes', 'no'], undefined, TwentyOneGame.partialMatches);
    return choice;
  }

  /**
   * Offer players the option to hit or stay
   * @returns 'stayed' if the player stays, or 'busted' otherwise
   */
  participantTurn(participant) {
    console.log(`----- ${participant.name}'s Turn -----`);
    while (!TwentyOneGame.didBust(participant)) {
      const isDealer = participant.name === TwentyOneGame.dealerName;
      const choice = isDealer
        ? this.dealerChoice(participant)
        : this.promptPlayerChoice(participant);
      if (choice === 'stayed') {
        return choice;
      }
    }
    return 'busted';
  }

  promptPlayerChoice(participant) {
    const hand = TwentyOneGame.getHandScore(participant);
    console.log(hand);
    const promptString = `${participant.name}: make a choice`;

    const choice = TwentyOneGame.getValidSelection(
      promptString,
      ['hit', 'stay'],
      undefined,
      TwentyOneGame.partialMatches,
    );
    return this.executePlayerChoice(participant, choice);
  }

  // stay if score >= 17, else hit
  dealerChoice(participant) {
    const score = TwentyOneGame.scoreHand(participant.hand);
    const scoreAtStayThreshold = score >= TwentyOneGame.dealerStayMinScore;
    const choice = scoreAtStayThreshold ? 'stay' : 'hit';
    return this.executePlayerChoice(participant, choice);
  }

  executePlayerChoice(participant, choice) {
    console.log(`${participant.name} chose to ${choice}`);
    if (choice === 'hit') {
      const newCard = this.deck.draw();
      console.log(`${participant.name} drew ${newCard.toString()}`);
      participant.hit(newCard);
      return 'hit';
    }
    return 'stayed';
  }

  bustResult() {
    const [dealer, player] = this.participants;
    const bustString = (winner, loser) => {
      const bustScore = TwentyOneGame.scoreHand(loser.hand);
      return `${loser.name} busted with ${bustScore} points! ${winner.name} wins.`;
    };

    if (TwentyOneGame.didBust(dealer)) return bustString(player, dealer);
    if (TwentyOneGame.didBust(player)) return bustString(dealer, player);
    return false;
  }

  displayBustResult() {
    const resultArr = this.getFormattedHands();
    resultArr.unshift(this.bustResult());
    resultArr.forEach((line) => console.log(line));
  }

  getFormattedHands() {
    const handsWithScores = this.participants.map(TwentyOneGame.getHandScoreAndMoney);
    return handsWithScores.toReversed();
  }

  showDealerHand() {
    const isDealer = (participant) => participant.name === TwentyOneGame.dealerName;
    const dealer = this.participants.filter(isDealer)[0];
    dealer.showHand(TwentyOneGame.dealerCardsToShow);
  }

  getScoreEntries() {
    const scoreEntries = this.participants.map((participant) => ({
      participant,
      score: TwentyOneGame.scoreHand(participant.hand),
    }));
    return scoreEntries;
  }

  get result() {
    if (this.#result.winner === 'undecided') {
      const scoreEntries = this.getScoreEntries();
      const isTie = scoreEntries.every((entry) => entry.score === scoreEntries[0].score);
      console.log({ isTie });
      const sorted = scoreEntries.filter((entry) => entry.score < TwentyOneGame.bustScore)
        .toSorted((a, b) => b.score - a.score);
      const result = {
        winner: isTie ? null : sorted[0].participant,
        score: sorted[0].score,
      };
      this.#result = result;
    }
    return this.#result;
  }

  set result(value) {
    if (!value) this.#result = { winner: 'undecided', score: 0 };
  }

  showParticipantMoney() {
    const currentMoney = this.participants
      .map((participant) => `${participant.name}: ${participant.formattedMoney()}`)
      .join('; ');
    console.log(`Participants' money: ${currentMoney}.`);
  }

  calcPayouts() {
    // get the name of the winner
    // if the winner is not null, subtract 1 from each losing player
    // and add the total to the winner's money
    const { winner } = this.result;
    if (winner === null) return null;
    const buyin = 1;
    const isWinner = (participant) => participant.name === winner.name;
    const winnerPayout = this.participants.length - 1 * buyin;
    return this.participants.map((participant) => (isWinner(participant) ? winnerPayout : -buyin));
  }

  makePayouts() {
    const payouts = this.calcPayouts();
    if (!payouts) return;
    this.participants.forEach((participant, i) => {
      participant.money += payouts[i];
    });
  }

  logPayouts() {
    const { winner } = this.result;
    if (winner === null) console.log('No payouts since the game ended in a tie');
    else {
      const payouts = this.calcPayouts();
      const winnerPayout = Math.max(...payouts);
      const loserPayout = Math.min(...payouts);
      console.log(`${winner.name} receives $${winnerPayout}. Other players lose $${-loserPayout} each.`);
    }
  }

  displayRoundResult() {
    const resultArr = this.getFormattedHands();
    const { winner, score } = this.result;
    const outcomeString = winner
      ? `${winner.name} won with a score of ${score} points!`
      : `Both players scored ${score} points. Game ended in a tie!`;
    resultArr.push(outcomeString);
    resultArr.forEach((line) => console.log(line));
  }

  displayGoodbyeMessage() {
    this.showParticipantMoney();
    console.log('Thanks for playing!');
  }
}

const game = new TwentyOneGame();
game.play();
