// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Navigate, useParams, generatePath } from "react-router-dom";

function SimpleRedirect(props) {
  const { to, replace, state } = props;
  const params = useParams();
  const redirectWithParams = generatePath(to, params);

  return <Navigate to={redirectWithParams} replace={replace} state={state} />;
}

export default SimpleRedirect;
