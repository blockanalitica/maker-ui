import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import DataTabs from "./components/DataTabs.js";
import LiquidationCurveCard from "./components/LiquidationCurveCard.js";
import OSM from "./components/OSM.js";
import Profile from "./components/Profile.js";
import StatsCard from "./components/StatsCard.js";

function Ilk(props) {
  const { ilk } = useParams();
  usePageTitle(ilk);

  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState(1);

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { type, collateral } = data;

  if (type === "lp-stable") {
    // Redirect lp-stable ilks to vaults page
    navigate(`/vault-types/${ilk}/vaults/`);
  }

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <div className="mb-2 flex-grow-1 d-flex align-items-center">
          <CryptoIcon name={data.collateral} size="3rem" className="me-2" />
          <h1 className="h3 m-0">{data.ilk}</h1>
        </div>
        <TimeSwitch activeOption={timePeriod} label={""} onChange={setTimePeriod} />
      </div>
      <Row className="mb-4">
        <Col xl={12}>
          <StatsCard ilk={ilk} days_ago={timePeriod} />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col xl={3} className="mb-4">
          <Row>
            <Col xl={12} className="mb-4">
              <Profile data={data} />
            </Col>
            <Col className="text-center mb-4">
              <Link to={`/vault-types/${ilk}/vaults/`} key={ilk}>
                <Button color="primary">See all vaults</Button>
              </Link>
            </Col>
          </Row>
        </Col>
        <Col xl={9} className="mb-2">
          <Row>
            <Col xl={12} className="mb-4">
              <LiquidationCurveCard ilk={ilk} />
            </Col>
            <Col xl={12} className="mb-4">
              <OSM ilk={ilk} isLp={type === "lp"} />
            </Col>
          </Row>
        </Col>
      </Row>
      {type !== "lp" ? <DataTabs ilk={ilk} symbol={collateral} /> : null}
    </>
  );
}

export default withErrorBoundary(Ilk);
