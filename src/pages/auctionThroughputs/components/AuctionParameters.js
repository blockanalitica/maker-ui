// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Input, Button, Label, Col, FormGroup } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import { withErrorBoundary } from "../../../hoc.js";

function AuctionParameters(props) {
  const {
    setDaiDebt,
    setSimHole,
    setPercentLiquidated,
    setBuf,
    setCut,
    setStep,
    setTail,
    setCusp,
    onApply,
    setShowApply,
    ...rest
  } = props;

  const onDaiDebt = (value) => {
    setDaiDebt(value);
    setShowApply(true);
  };
  const onSimHole = (value) => {
    if (value > 5000000000) {
      return;
    }
    setSimHole(value);
    setShowApply(true);
  };
  const onPercentLiquidated = (value) => {
    if (value > 100) {
      return;
    }
    setPercentLiquidated(value);
    setShowApply(true);
  };
  const onBuf = (value) => {
    setBuf(value);
    setShowApply(true);
  };
  const onCut = (value) => {
    if (value >= 100) {
      return;
    }
    setCut(value);
    setShowApply(true);
  };
  const onStep = (value) => {
    setStep(value);
    setShowApply(true);
  };
  const onTail = (value) => {
    setTail(value);
    setShowApply(true);
  };
  const onCusp = (value) => {
    setCusp(value);
    setShowApply(true);
  };

  return (
    <>
      <Card fullHeight={false}>
        <FormGroup row>
          <Label xl={4} for="dai_debt">
            Dai debt:
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="dai_debt"
              id="dai_debt"
              step={1000000}
              value={rest.daiDebt}
              onChange={(event) => onDaiDebt(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label xl={4} for="sim_hole">
            Hole
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="sim_hole"
              id="sim_hole"
              step={100000}
              value={rest.simHole}
              onChange={(event) => onSimHole(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label xl={4} for="percent_liquidated">
            Percent liquidated
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="percent_liquidated"
              id="percent_liquidated"
              step={5}
              value={rest.percentLiquidated}
              onChange={(event) => onPercentLiquidated(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label xl={4} for="buf">
            Buf
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="buf"
              id="buf"
              step={10}
              value={rest.buf}
              onChange={(event) => onBuf(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label xl={4} for="cut">
            Cut
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="cut"
              id="cut"
              step={1}
              value={rest.cut}
              onChange={(event) => onCut(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label xl={4} for="step">
            Step
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="step"
              id="step"
              step={5}
              value={rest.step}
              onChange={(event) => onStep(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label xl={4} for="tail">
            Tail
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="tail"
              id="tail"
              step={100}
              value={rest.tail}
              onChange={(event) => onTail(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label xl={4} for="cusp">
            Cusp
          </Label>
          <Col xl={8}>
            <Input
              type="number"
              name="cusp"
              id="cusp"
              step={0.05}
              value={rest.cusp}
              onChange={(event) => onCusp(event.target.value)}
            ></Input>
          </Col>
        </FormGroup>

        {rest.showApply ? (
          <div className="text-center">
            <Button color="primary" onClick={onApply}>
              Apply
            </Button>
          </div>
        ) : null}
      </Card>
    </>
  );
}

export default withErrorBoundary(AuctionParameters);
