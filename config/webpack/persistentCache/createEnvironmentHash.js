// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

const { createHash } = require("crypto");

module.exports = (env) => {
  const hash = createHash("md5");
  hash.update(JSON.stringify(env));

  return hash.digest("hex");
};
