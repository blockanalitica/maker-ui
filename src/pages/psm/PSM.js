// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import EtherscanShort from "../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../components/Loader/Loader.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import ValueChange from "../../components/Value/ValueChange.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import EventStatsChart from "./components/EventStatsChart.js";
import DAISupplyHistoryChart from "./components/DAISupplyHistoryChart.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";

function PSM(props) {
  const { ilk } = useParams();
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [timePeriod, setTimePeriod] = useState(1);
  const [historyTimePeriod, setHistoryTimePeriod] = useState(30);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/psms/${ilk}/`,
    { p: page, p_size: pageSize, order },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const historyTimeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  const { results, count } = data;
  const symbol = results[0].symbol;

  return (
    <>
      <div className="d-flex mb-4 justify-content-space-between align-items-center">
        <CryptoIcon name={symbol} size="3rem" className="me-2" />
        <h1 className="h3 m-0 flex-grow-1">{ilk} events</h1>
        <TimeSwitch activeOption={timePeriod} onChange={setTimePeriod} />
      </div>

      <EventStatsChart className="mb-4" ilk={ilk} timePeriod={timePeriod} />
      <RemoteTable
        loading={isPreviousData}
        keyField="tx_hash"
        hover={false}
        data={results}
        defaultSorted={[
          {
            dataField: "block_number",
            order: "desc",
          },
        ]}
        columns={[
          {
            dataField: "block_number",
            text: "Block",
            sort: true,
          },
          {
            dataField: "datetime",
            text: "datetime",
            sort: true,
          },
          {
            dataField: "principal",
            text: "DAI",
            sort: true,
            formatter: (cell, row) => (
              <ValueChange value={cell} decimals={2} compact prefix="$" icon />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "tx_hash",
            text: "tx hash",
            formatter: (cell, row) => <EtherscanShort address={cell} type="txhash" />,
            headerAlign: "right",
            align: "right",
          },
        ]}
        page={page}
        pageSize={pageSize}
        totalPageSize={count}
        onSortChange={setOrder}
        onPageChange={setPage}
      />
      <h3 className="mb-4">total DAI supply over time</h3>
      <TimeSwitch
        options={historyTimeOptions}
        activeOption={historyTimePeriod}
        onChange={setHistoryTimePeriod}
      />
      <DAISupplyHistoryChart
        className="mb-4"
        ilk={ilk}
        timePeriod={historyTimePeriod}
      />
    </>
  );
}

export default withErrorBoundary(PSM);
