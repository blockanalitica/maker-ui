// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Container } from "reactstrap";
import ErrorFallback from "./ErrorFallback.js";

function ErrorFallbackPage(props) {
  return (
    <Container>
      <ErrorFallback {...props} />
    </Container>
  );
}

export default ErrorFallbackPage;
