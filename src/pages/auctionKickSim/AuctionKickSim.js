// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row, FormGroup, Label, Input, Button } from "reactstrap";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import Loader from "../../components/Loader/Loader.js";
import { useFetch, useQueryParams } from "../../hooks.js";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import Select from "../../components/Select/Select.js";
import KickSimPerDay from "./components/KickSimPerDay.js";
import KickSimPerStepBuf from "./components/KickSimPerStepBuf.js";
import KickSimPerStepBufOSM from "./components/KickSimPerStepBufOSM.js";
import KickSimOSM from "./components/KickSimOSM.js";
import Card from "../../components/Card/Card.js";
import SideTabNav from "../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../components/SideTab/SideTabContent.js";

function AuctionKickSim(props) {
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const qParams = {
    tab: queryParams.get("tab") || "1",
    asset: queryParams.get("asset") || "ETH",
    date: queryParams.get("date") || undefined,
    cut: queryParams.get("cut") || undefined,
    buf: queryParams.get("buf") || undefined,
    step: queryParams.get("step") || undefined,
    taker_profit: queryParams.get("taker_profit") || undefined,
  };

  const [activeTab, setActiveTab] = useState(qParams.tab);
  const [params, setParams] = useState(qParams);
  const [showApply, setShowApply] = useState(false);

  usePageTitle("Auction Kick Simulation");

  const onApply = (e) => {
    let qs = queryString.stringify(params, { skipNull: true });
    navigate(`?${qs}`);
    setShowApply(false);
    e.preventDefault();
  };

  const onNumChange = (param, value) => {
    if (value >= 1) {
      value = 0.99;
    } else if (value < 0) {
      value = 0;
    }
    onParamChange({ [param]: value });
  };

  const onParamChange = (qp, submit = false) => {
    const queryParams = {
      ...params,
      ...qp,
    };
    setParams(queryParams);
    if (submit) {
      let qs = queryString.stringify(queryParams, { skipNull: true });
      navigate(`?${qs}`);
    } else {
      setShowApply(true);
    }
  };

  let url;
  if (activeTab === "1") {
    url = `/auctions/kick-sim/per-day/${qParams.asset}/`;
  } else if (activeTab === "2") {
    url = `/auctions/kick-sim/per-param/${qParams.asset}/`;
  } else if (activeTab === "3") {
    url = `/auctions/kick-sim/per-day-osm/${qParams.asset}/`;
  } else if (activeTab === "4") {
    url = `/auctions/kick-sim/per-param-osm/${qParams.asset}/`;
  }

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    url,
    qParams,
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { default_settings: defaultSettings } = data;

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setParams({
        ...params,
        tab: tab,
      });

      const queryParams = {
        ...params,
        tab: tab,
      };
      let qs = queryString.stringify(queryParams, { skipNull: true });
      navigate(`?${qs}`);
    }
  };

  const assetOptions = [
    { value: "ETH", label: "ETH" },
    { value: "BTC", label: "BTC" },
  ];

  const selectedAssetOption = assetOptions.find(
    (option) => option.value === qParams.asset
  );

  return (
    <div>
      <h1 className="h3 mb-4">auction kick simulation</h1>
      <Row>
        <Col xl={3} className="mb-4">
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "1", text: "Per day" },
              { id: "2", text: "Per step / buf" },
              { id: "3", text: "Per day at OSM price" },
              { id: "4", text: "Per step / buf at OSM Price" },
            ]}
          />

          <Card fullHeight={false}>
            <FormGroup row className="mb-2">
              <Label xl={6} for="asset">
                Asset:
              </Label>
              <Col xl={6}>
                <Select
                  id="asset"
                  defaultValue={selectedAssetOption}
                  options={assetOptions}
                  onChange={(option) => onParamChange({ asset: option.value })}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-2">
              <Label xl={6} for="cut">
                Cut: <span className="small">(default: {defaultSettings.cut})</span>
              </Label>
              <Col xl={6}>
                <Input
                  id="cut"
                  type="number"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={params.cut || defaultSettings.cut}
                  onChange={(e) => onNumChange("cut", e.target.value)}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-2">
              <Label xl={6} for="taker_profit">
                Taker Profit:
              </Label>
              <Col xl={6}>
                <Input
                  id="taker_profit"
                  type="number"
                  step={0.01}
                  min={0}
                  max={0.99}
                  value={params.taker_profit || 0.05}
                  onChange={(e) => onNumChange("taker_profit", e.target.value)}
                />
              </Col>
            </FormGroup>

            {showApply ? (
              <div className="text-center">
                <Button color="primary" className="ml-4" onClick={onApply}>
                  Apply
                </Button>
              </div>
            ) : null}
          </Card>
        </Col>
        <Col xl={9}>
          <SideTabContent
            activeTab={activeTab}
            tabs={[
              {
                id: "1",
                content: (
                  <KickSimPerDay
                    data={data}
                    isLoading={isPreviousData}
                    onParamChange={onParamChange}
                    asset={qParams.asset}
                  />
                ),
              },
              {
                id: "2",
                content: (
                  <KickSimPerStepBuf
                    data={data}
                    isLoading={isPreviousData}
                    onParamChange={onParamChange}
                  />
                ),
              },
              {
                id: "3",
                content: (
                  <KickSimOSM
                    data={data}
                    isLoading={isPreviousData}
                    onParamChange={onParamChange}
                    asset={qParams.asset}
                  />
                ),
              },
              {
                id: "4",
                content: (
                  <KickSimPerStepBufOSM
                    data={data}
                    isLoading={isPreviousData}
                    onParamChange={onParamChange}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(AuctionKickSim);
