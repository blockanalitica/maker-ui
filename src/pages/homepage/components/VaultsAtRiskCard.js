// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Card/Card.js";
import { withErrorBoundary } from "../../../hoc.js";
import Loader from "../../../components/Loader/Loader.js";
import { useFetch } from "../../../hooks";
import Value from "../../../components/Value/Value.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "./VaultsAtRiskCard.module.scss";

function VaultsAtRiskCard(props) {
  const navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/vaults-at-risk/count/"
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  if (data.count === 0) {
    return null;
  }
  let declension = "vault";
  if (data.count > 1) {
    declension = "vaults";
  }

  return (
    <Card
      className={classnames("mb-4", styles.atRisk)}
      onClick={() => navigate("/vaults-at-risk/")}
    >
      <div className={styles.iconBox}>
        <FontAwesomeIcon icon={faExclamationCircle} />
      </div>
      {data.count} {declension} with total debt of{" "}
      <Value value={data.debt} decimals={2} prefix="$" compact /> at risk! Click here to
      see more.
    </Card>
  );
}

export default withErrorBoundary(VaultsAtRiskCard);
