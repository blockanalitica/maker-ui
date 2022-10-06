// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

export const sumArrayElements = (arrays) => {
  return arrays.reduce((a, b) => a.map((c, i) => c + b[i]));
};

export const filledUpArray = (array) => {
  let last;
  return array.map((element) => {
    if (element === null) {
      element = last;
    }
    last = element;
    return element;
  });
};
