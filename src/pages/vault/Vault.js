// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import classnames from "classnames";
import makeBlockie from "ethereum-blockies-base64";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import SideTabNav from "../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../components/SideTab/SideTabContent.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import VaultEventsTable from "./components/VaultEventsTable.js";
import VaultHistoryGraph from "./components/VaultHistoryGraph.js";
import VaultDebtHistoryGraph from "./components/VaultDebtHistoryGraph.js";
import VaultProfileCard from "./components/VaultProfileCard.js";
import VaultProtectionMatrix from "./components/VaultProtectionMatrix.js";
import styles from "./Vault.module.scss";

function Vault(props) {
  const { uid, ilk } = useParams();
  const [activeTab, setActiveTab] = useState("collateralization");

  usePageTitle(`${ilk}: ${uid}`);

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/vaults/${uid}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  let blockie;
  let link;
  if (data.owner_address) {
    blockie = makeBlockie(data.owner_address);
    link = `https://etherscan.io/address/${data.owner_address}`;
  }

  return (
    <>
      <Row>
        <div className="d-flex mb-4 align-items-center">
          <div className="me-3">
            {blockie ? (
              <a href={link}>
                <img
                  className={classnames(styles.roundedCircle, styles.walletLogo)}
                  src={blockie}
                  alt={data.owner_address}
                />
              </a>
            ) : (
              <CryptoIcon key={data.symbol} name={data.symbol} size="3rem" />
            )}
          </div>
          <h1 className="h3 m-0">#{uid}</h1>
        </div>
      </Row>
      <Row>
        <Col xl={12} className="mb-4">
          <VaultProfileCard uid={uid} data={data} />
        </Col>
        <Col xl={3} className="mb-4">
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "collateralization", text: "Collateralization" },
              { id: "protection_score", text: "Protection Score History" },
              { id: "debt", text: "Debt" },
            ]}
          />
        </Col>
        <Col xl={9} className="mb-4">
          <SideTabContent
            activeTab={activeTab}
            tabs={[
              {
                id: "collateralization",
                content: <VaultHistoryGraph uid={uid} ilk={ilk} />,
              },
              {
                id: "protection_score",
                content: <VaultProtectionMatrix uid={uid} ilk={ilk} />,
              },
              {
                id: "debt",
                content: <VaultDebtHistoryGraph uid={uid} ilk={ilk} />,
              },
            ]}
          />
        </Col>
        <Col xl={12} className="mb-4">
          <VaultEventsTable uid={uid} className="mb-4" ilk={ilk} />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Vault);
