// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../../hoc.js";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Value from "../../../components/Value/Value.js";
import StatsBar from "../../../components/Stats/StatsBar.js";

function AuctionStats(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModalOpen = () => setModalOpen(!modalOpen);
  const { data } = props;
  if (!data) {
    return null;
  }

  const stats = [
    {
      title: "dai",
      bigValue: <Value value={data.dai} decimals={2} prefix="$" compact />,
    },
    {
      title: "debt ceiling",
      bigValue: <Value value={data.debt_ceiling} decimals={2} prefix="$" compact />,
    },
    {
      title: "hole",
      bigValue: <Value value={data.current_hole} decimals={2} prefix="$" compact />,
    },
    {
      title: "LR",
      bigValue: <Value value={data.lr * 100} decimals={2} suffix="%" />,
    },
  ];

  return (
    <>
      <StatsBar role="button" stats={stats} onClick={toggleModalOpen} />
      <Modal centered isOpen={modalOpen} toggle={toggleModalOpen}>
        <ModalHeader toggle={toggleModalOpen}>parameters</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={6}>
              <div className="section-title">dai</div>
              <Value
                value={data.dai}
                decimals={2}
                prefix="$"
                compact
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">hole</div>
              <Value
                value={data.current_hole}
                decimals={2}
                prefix="$"
                compact
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">LR</div>
              <Value value={data.lr * 100} decimals={2} suffix="%" />
            </Col>
            <Col xl={6}>
              <div className="section-title">dc-iam-line</div>
              <Value
                value={data.dc_iam_line}
                decimals={2}
                prefix="$"
                compact
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">chop</div>
              <Value
                value={(data.chop - 1) * 100}
                suffix="%"
                decimals={2}
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">buf</div>
              <Value
                value={data.buf * 100}
                decimals={2}
                suffix="%"
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">tail</div>
              <Value
                value={data.tail}
                decimals={0}
                suffix=" sec"
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">cusp</div>
              <Value
                value={data.cusp * 100}
                decimals={2}
                suffix="%"
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">chip</div>
              <Value
                value={data.chip * 100}
                decimals={2}
                suffix="%"
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">tip</div>
              <Value value={data.tip} decimals={0} className="text-big" />
            </Col>
            <Col xl={6}>
              <div className="section-title">step</div>
              <Value
                value={data.step}
                decimals={0}
                suffix=" sec"
                className="text-big"
              />
            </Col>
            <Col xl={6}>
              <div className="section-title">cut</div>
              <Value
                value={data.cut * 100}
                suffix="%"
                decimals={2}
                className="text-big"
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withErrorBoundary(AuctionStats);
