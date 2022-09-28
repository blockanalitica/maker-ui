import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "../../components/Loader/Loader.js";
import { useFetch, usePageTitle, useQueryParams } from "../../hooks";
import queryString from "query-string";
import AuctionParameters from "./components/AuctionParameters.js";
import { useNavigate } from "react-router-dom";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import AuctionStats from "./components/AuctionStats.js";
import SimulationStats from "./components/SimulationStats.js";
import StairstepGraph from "./components/StairstepGraph.js";

function AuctionThroughput(props) {
  const queryParams = useQueryParams();
  const [showApply, setShowApply] = useState(false);
  let navigate = useNavigate();

  const { ilk } = useParams();
  usePageTitle(ilk);

  const queryDaiDebt = queryParams.get("daiDebt") || 3000000000;
  const querySimHole = queryParams.get("simHole") || 10000000;
  const queryPercentLiquidated = queryParams.get("percentLiquidated") || 20;
  const queryBuf = queryParams.get("buf") || 130;
  const queryCut = queryParams.get("cut") || 99;
  const queryStep = queryParams.get("step") || 60;
  const queryTail = queryParams.get("tail") || 8400;
  const queryCusp = queryParams.get("cusp") || 0.4;

  const [daiDebt, setDaiDebt] = useState(queryDaiDebt);
  const [simHole, setSimHole] = useState(querySimHole);
  const [percentLiquidated, setPercentLiquidated] = useState(queryPercentLiquidated);
  const [buf, setBuf] = useState(queryBuf);
  const [tail, setTail] = useState(queryTail);
  const [cut, setCut] = useState(queryCut);
  const [step, setStep] = useState(queryStep);
  const [cusp, setCusp] = useState(queryCusp);
  const [previousDuration, setPreviousDuration] = useState();
  const [previousCycle, setPreviousCycle] = useState();
  const [previousExposure, setPreviousExposure] = useState();
  const [previousSlippage, setPreviousSlippage] = useState();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/auctions/throughput/${ilk}/`,
    {
      debt: queryDaiDebt,
      sim_hole: querySimHole,
      percent_liquidated: queryPercentLiquidated,
      buf: queryBuf,
      cut: queryCut,
      step: queryStep,
      tail: queryTail,
      cusp: queryCusp,
      previous_duration: previousDuration,
      previous_cycle: previousCycle,
      previous_exposure: previousExposure,
      previous_slippage: previousSlippage,
    }
  );

  const onApply = (e) => {
    const url = queryString.stringify(
      {
        simHole,
        percentLiquidated,
        buf,
        cut,
        step,
        daiDebt,
        tail,
        cusp,
      },

      { skipNull: true }
    );
    setPreviousDuration(data.simulations.auction_dur_m);
    setPreviousCycle(data.simulations.auction_cycle);
    setPreviousExposure(data.simulations.debt_exposure_share);
    setPreviousSlippage(data.simulations.sim_slippage);
    navigate(`?${url}`);
    setShowApply(false);
    e.preventDefault();
  };
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <div>
      <div className="mb-4 d-flex align-items-center">
        <CryptoIcon name={data.stats.asset} size="3rem" className="mb-2 me-2" />
        <h1 className="h3">{data.stats.ilk} auctions throughput</h1>
      </div>
      <Row className="mb-4">
        <Col xl={12}>
          <AuctionStats data={data.stats} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xl={3} className="mb-4">
          <Row>
            <Col xl={12} className="mb-4">
              <AuctionParameters
                setDaiDebt={setDaiDebt}
                setSimHole={setSimHole}
                setPercentLiquidated={setPercentLiquidated}
                setBuf={setBuf}
                setCut={setCut}
                setStep={setStep}
                setTail={setTail}
                setCusp={setCusp}
                onApply={onApply}
                setShowApply={setShowApply}
                showApply={showApply}
                daiDebt={daiDebt}
                simHole={simHole}
                percentLiquidated={percentLiquidated}
                buf={buf}
                tail={tail}
                cut={cut}
                step={step}
                cusp={cusp}
              />
            </Col>
          </Row>
        </Col>
        <Col xl={9} className="mb-4">
          <Row>
            <Col xl={12} className="mb-4">
              <StairstepGraph
                data={data.stairstep_exponential}
                tail={data.stats.tail}
                cusp={data.stats.cusp}
                buf={data.stats.buf}
                cycle={data.simulations.auction_cycle}
              />
            </Col>
            <Col xl={12} className="mb-4">
              <SimulationStats data={data.simulations} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

AuctionThroughput.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      ilk: PropTypes.string.isRequired,
    }),
  }),
};

export default AuctionThroughput;
