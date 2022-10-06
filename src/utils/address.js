// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

export const shorten = (address) => {
  return address.slice(0, 5) + "..." + address.slice(-5);
};
