class Participant {
  constructor(name) {
    this.name = name;
    this.hand = [];
    this.money = 5;
  }

  hit(card) {
    this.hand.push(card);
  }

  getDisplayHand(cardsToShow = undefined) {
    const prefixStr = `${this.name}'s hand: `;
    const visibleCardCount = Math.min(this.hand.length, (cardsToShow ?? this.hand.length));
    const visibleCards = this.hand.slice(0, visibleCardCount);
    const maskedCount = this.hand.length - visibleCardCount;
    const maskedHand = visibleCards.map((card) => card.toString());
    if (maskedCount > 0) maskedHand.push(`${maskedCount} hidden card${maskedCount > 1 ? 's' : ''}`);
    if (maskedHand.length >= 2) {
      const lastTwoJoined = maskedHand.slice(-2).join(' and ');
      maskedHand.splice(-2, 2, lastTwoJoined);
    }
    return prefixStr + maskedHand.join(', ');
  }

  showHand(cardsToShow = undefined) {
    console.log(this.getDisplayHand(cardsToShow));
  }

  formattedMoney() {
    return `$${this.money}`;
  }
}

module.exports = { Participant };
