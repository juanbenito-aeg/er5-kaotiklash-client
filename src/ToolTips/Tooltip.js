import { globals } from "../index.js";

export default class ToolTip {
  #currentTooltip;
  #tooltipElements;
  #style;

  constructor() {
    this.#currentTooltip = null;
    this.#tooltipElements = [];
    this.#style = {
      bgColor: "rgba(0, 0, 0, 0.85)",
      textColor: "white",
      font: "16px MedievalSharp",
      padding: 8,
      lineHeight: 20,
      borderWidth: 2,
    };
  }

  showTooltip(content, x, y) {
    this.clearTooltip();

    const startY = y - content.length * this.#style.lineHeight - 10;

    for (let i = 0; i < content.length; i++) {
      this.#tooltipElements.push({
        text: content[i],
        x: x,
        y: startY + i * this.#style.lineHeight,
      });
    }

    this.#currentTooltip = {
      x: x,
      y: y,
      content: content,
    };
  }

  clearTooltip() {
    this.#tooltipElements = [];
    this.#currentTooltip = null;
  }

  hasTooltip() {
    return this.#currentTooltip !== null;
  }

  getCurrentTooltip() {
    return this.#currentTooltip;
  }

  getTooltipPosition() {
    if (this.#currentTooltip) {
      return {
        x: this.#currentTooltip.x,
        y: this.#currentTooltip.y,
      };
    }
    return null;
  }

  render() {
    let maxWidth = 0;
    globals.ctx.font = this.#style.font;

    for (let i = 0; i < this.#tooltipElements.length; i++) {
      const textWidth = globals.ctx.measureText(
        this.#tooltipElements[i].text
      ).width;
      if (textWidth > maxWidth) {
        maxWidth = textWidth;
      }
    }

    const totalHeight = this.#tooltipElements.length * this.#style.lineHeight;
    const tooltipWidth = maxWidth + this.#style.padding * 2;
    const tooltipHeight = totalHeight + this.#style.padding * 2;

    const tooltipX = this.#currentTooltip.x - tooltipWidth / 2;
    const tooltipY = this.#currentTooltip.y - tooltipHeight - 20;

    globals.ctx.save();

    //DRAW BACKGROUND
    globals.ctx.fillStyle = this.#style.bgColor;
    globals.ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

    // DRAW TEXT
    globals.ctx.fillStyle = this.#style.textColor;
    globals.ctx.font = this.#style.font;
    globals.ctx.textAlign = "left";
    globals.ctx.textBaseline = "top";

    for (let i = 0; i < this.#tooltipElements.length; i++) {
      const textX = tooltipX + this.#style.padding;
      const textY = tooltipY + this.#style.padding + i * this.#style.lineHeight;

      globals.ctx.fillText(this.#tooltipElements[i].text, textX, textY);
    }

    globals.ctx.restore();
  }
}
