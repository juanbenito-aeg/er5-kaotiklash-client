import { CardCategory, DeckType } from "../Game/constants.js";

export default class InitialPhase {
    constructor(deckContainer) {
        this.deckContainer = deckContainer;
    }

    execute() {
        this.#dealMinions();
        this.#dealEventCards();
    }

    #dealMinions() {
        const player1MinionsInPlay = this.deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
        const player2MinionsInPlay = this.deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
        const player1Minions = this.deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS];
        const player2Minions = this.deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS];
       
        this.#shuffleDeck(player1Minions);
        this.#shuffleDeck(player2Minions);

        this.#selectAndInsertCards(player1Minions, player1MinionsInPlay, 3);
        this.#selectAndInsertCards(player2Minions, player2MinionsInPlay, 3);
    }

    #shuffleDeck(deck) {
        for (let i = 0; i < deck.length; i++) {
            console.log(deck)
            const randomIndex = Math.floor(Math.random() * deck.length);
            const temp = deck[i];
            deck[i] = deck[randomIndex];
            deck[randomIndex] = temp;
        }
        return deck;
    }

    #selectAndInsertCards(minionsDeck, minionsInPlayDeck, numCards) {
        let selectedMinions = [];
        
        for (let i = 0; i < numCards; i++) {
            let selectedMinion = minionsDeck[0];
            minionsDeck.length = minionsDeck.length - 1;
            for (let j = 0; j < minionsDeck.length; j++) {
                minionsDeck[j] = minionsDeck[j + 1];
            }
            selectedMinions.push(selectedMinion);
        }
    
        for (let i = 0; i < selectedMinions.length; i++) {
            minionsInPlayDeck.insertCard(selectedMinions[i]);
        }
    }

    #dealEventCards() {
        const player1CardsInHand = this.deckContainer.getDecks(DeckType.PLAYER_1_CARDS_IN_HAND);
        const player2CardsInHand = this.deckContainer.getDecks(DeckType.PLAYER_2_CARDS_IN_HAND);
        
        const eventCards = [];
        for( let i = 0; i < this.deckContainer.getDecks().length; i++) {
            const currentDecks = this.deckContainer.getDecks()[i];

            for ( let j = 0; j < currentDecks.getCards().length; j++) {
                const currentCard = currentDecks.getCards()[j];
                if (currentCard.getCategory() === CardCategory.WEAPON) {
                    eventCards.push(currentCard[j]);
                    console.log(eventCards)
                }
            }
        }
        for (let j = 0; j < eventCards.length; j++) {
            player1CardsInHand.insertCard(eventCards[j * 2]);
            player2CardsInHand.insertCard(eventCards[j * 2 + 1]);
            console.log(player1CardsInHand)
          }
    }
}