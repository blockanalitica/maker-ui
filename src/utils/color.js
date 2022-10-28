// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

export const lightenDarkenColor = (color, percent) => {
  var hasHashtag = false;
  if (color[0] === "#") {
    color = color.slice(1);
    hasHashtag = true;
  }

  var amount = Math.round(2.55 * percent);
  var numColor = parseInt(color, 16);

  var red = (numColor >> 16) + amount;
  if (red > 255) {
    red = 255;
  } else if (red < 0) {
    red = 0;
  }

  var blue = ((numColor >> 8) & 0x00ff) + amount;
  if (blue > 255) {
    blue = 255;
  } else if (blue < 0) {
    blue = 0;
  }

  var green = (numColor & 0x0000ff) + amount;
  if (green > 255) {
    green = 255;
  } else if (green < 0) {
    green = 0;
  }

  return (
    (hasHashtag ? "#" : "") +
    (0x1000000 + red * 0x10000 + blue * 0x100 + green).toString(16).slice(1)
  );
};
