import Tooltip from "./Tooltip.js";

export default class RemainingCardsTooltip extends Tooltip {
  constructor() {
    super();
  }

  getContent(deck) {
    const content = [];
    const remaining = deck.getCards().length;
    content.push(`🃏 Remaining Minions : ${remaining} `);

    return content;
  }
}
