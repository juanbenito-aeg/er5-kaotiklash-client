import Tooltip from "./Tooltip.js";
export default class SpecialTooltip extends Tooltip {
  constructor() {
    super();
  }

  getContent(special) {
    const content = [];

    content.push(`✨ Special: ${special.getName()}`);
    content.push(`⏳ Duration: ${special.getCurrentDurationInRounds()} rounds`);
    content.push(
      `🛠️ Preparation Time: ${special.getCurrentPrepTimeInRounds()} rounds`
    );

    return content;
  }
}
