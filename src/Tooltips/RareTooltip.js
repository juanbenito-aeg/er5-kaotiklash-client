import Tooltip from "./Tooltip.js";
export default class RareTooltip extends Tooltip {
  constructor() {
    super();
  }

  getContent(rare) {
    const content = [];

    content.push(`💠 Rare: ${rare.getName()}`);
    content.push(`⏳ Duration: ${rare.getCurrentDurationInRounds()} rounds`);

    return content;
  }
}
