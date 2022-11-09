// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import classnames from "classnames";
import makeBlockie from "ethereum-blockies-base64";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import DebankWallet from "../../components/DebankWallet/DebankWallet.js";
import EtherscanWallet from "../../components/EtherscanWallet/EtherscanWallet.js";
import Loader from "../../components/Loader/Loader.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import LinkTable from "../../components/Table/LinkTable.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import Value from "../../components/Value/Value.js";
import ZapperWallet from "../../components/ZapperWallet/ZapperWallet.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";
import { shorten } from "../../utils/address.js";
import { parseUTCDateTime } from "../../utils/datetime.js";
import DebtChart from "./components/DebtChart.js";
import EventsTable from "./components/EventsTable.js";
import styles from "./Wallet.module.scss";

function Wallet(props) {
  const { address } = useParams();
  let navigate = useNavigate();
  const [showAllVaults, setShowAllVaults] = useState(null);

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/wallets/${address}/`,
    { all_vaults: showAllVaults }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/vault-types/${row.ilk}/vaults/${row.uid}/`);
  };

  const onDSProxyClick = (e, address, url) => {
    window.open(`${url}${address}`, "_blank");
    e.stopPropagation();
  };

  const onOwnerClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const { vaults, name, ens, address: walletAddress, slug } = data;

  const addressParam = slug || walletAddress;

  const vaultOptions = [
    { key: null, value: "Active" },
    { key: "1", value: "All" },
  ];

  let totalDebt = 0;
  let totalCollateral = 0;
  vaults.forEach((vault) => {
    totalCollateral = totalCollateral + vault.collateral * vault.osm_price;
    totalDebt = totalDebt + vault.debt;
  });

  const stats = [
    {
      title: "# of vaults",
      bigValue: <Value value={vaults.length} />,
    },
    {
      title: "total collateral",
      bigValue: <Value value={totalCollateral} decimals={2} prefix="$" compact />,
    },
    {
      title: "total debt",
      bigValue: <Value value={totalDebt} decimals={2} prefix="$" compact />,
    },
  ];

  let blockie = null;
  if (walletAddress) {
    blockie = makeBlockie(walletAddress);
  }

  const columns = [
    {
      dataField: "collateral_symbol",
      text: "",
      sort: false,
      formatter: (cell, row) => <CryptoIcon className="me-2" name={cell} size="2rem" />,
    },
    {
      dataField: "ilk",
      text: "vault type",
    },
    {
      dataField: "uid",
      text: "vault id",
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "collateral",
      text: "collateral",
      sort: true,
      formatter: (cell, row) => <Value value={cell} decimals={2} compact />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "debt",
      text: "debt",
      sort: true,
      formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" compact />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "liquidation_drop",
      text: "Liq. drop",
      sort: true,
      formatter: (cell, row) => <Value value={cell * 100} decimals={2} suffix="%" />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "liquidation_price",
      text: "Liq. price",
      sort: true,
      formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "collateralization",
      text: "CR",
      sort: true,
      formatter: (cell, row) => <Value value={cell} decimals={0} suffix="%" />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "protection_score",
      text: "protection score",
      sort: true,
      formatter: (cell, row) => {
        if (row.protection_service) {
          return <CryptoIcon name={row.protection_service} size="2rem" />;
        } else if (cell === "low") {
          return (
            <Badge color="success" className="mr-1">
              {cell} risk
            </Badge>
          );
        } else if (cell === "medium") {
          return (
            <Badge color="warning" className="mr-1">
              {cell} risk
            </Badge>
          );
        } else if (cell === "high") {
          return (
            <Badge color="danger" className="mr-1">
              {cell} risk
            </Badge>
          );
        }
        return null;
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "ds_proxy_address",
      text: "DS Proxy",
      formatter: (cell, row) => (
        <>
          {cell ? (
            <>
              <div className="small">{row["ds_proxy_name"] || shorten(cell)}</div>
              <div>
                <CryptoIcon
                  name="etherscan"
                  className="me-2"
                  onClick={(e) =>
                    onDSProxyClick(e, cell, "https://etherscan.io/address/")
                  }
                />
                <CryptoIcon
                  name="debank"
                  className="me-2"
                  onClick={(e) =>
                    onDSProxyClick(e, cell, "https://debank.com/profile/")
                  }
                />
                <CryptoIcon
                  name="zapper"
                  onClick={(e) => onDSProxyClick(e, cell, "https://zapper.fi/account/")}
                />
              </div>
            </>
          ) : (
            "-"
          )}
        </>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "last_activity",
      text: "Last activity",
      formatter: (cell, row) => <DateTimeAgo dateTime={parseUTCDateTime(cell)} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
  ];

  if (slug) {
    columns.splice(10, 0, {
      dataField: "owner_address",
      text: "owner address",
      formatter: (cell, row) => (
        <>
          {cell ? (
            <span
              role="button"
              className="link"
              onClick={(e) => onOwnerClick(e, `/wallets/${cell}/`)}
            >
              {row.owner_name ||
                (row.owner_ens && row.owner_ens.length < 25 ? row.owner_ens : null) ||
                shorten(cell)}
            </span>
          ) : (
            "-"
          )}
        </>
      ),
      headerAlign: "center",
      align: "center",
    });
  }

  return (
    <>
      <div className="d-flex mb-4 align-items-center">
        <div className="d-flex align-items-center flex-grow-1">
          {blockie ? (
            <img
              className={classnames("me-3", styles.roundedCircle, styles.walletLogo)}
              src={blockie}
              alt={walletAddress}
            />
          ) : null}
          <div>
            <h1 className="h3 m-0">
              {name || (ens && ens.length < 25 ? ens : null) || walletAddress}
            </h1>
            {walletAddress ? (
              <div>
                <EtherscanWallet className="me-2" address={walletAddress} />
                <DebankWallet className="me-2" address={walletAddress} />
                <ZapperWallet address={walletAddress} />
              </div>
            ) : null}
          </div>
        </div>
        <div className="d-flex align-items-center">
          Show vaults:{" "}
          <TimeSwitch
            activeOption={showAllVaults}
            onChange={setShowAllVaults}
            options={vaultOptions}
          />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-end"></div>

      <StatsBar className="mb-4" stats={stats} />
      <LinkTable
        keyField="uid"
        data={vaults}
        onRowClick={onRowClick}
        defaultSorted={[
          {
            dataField: "debt",
            order: "desc",
          },
        ]}
        columns={columns}
      />
      <h3 className="my-4">debt history</h3>
      <DebtChart address={addressParam} showAllVaults={showAllVaults} />
      <h3 className="my-4">events</h3>
      <EventsTable address={addressParam} showAllVaults={showAllVaults} />
    </>
  );
}

export default withErrorBoundary(Wallet);
