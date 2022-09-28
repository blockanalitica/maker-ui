import React from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Badge, Col, Row, Button } from "reactstrap";
import Card from "../../components/Card/Card.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import EtherscanShort from "../../components/EtherscanShort/EtherscanShort.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import { parseUTCDateTime } from "../../utils/datetime.js";
import successImg from "../../images/success_meme.jpg";
import styles from "./VaultsAtRisk.module.scss";

function VaultsAtRisk(props) {
  let navigate = useNavigate();
  usePageTitle("Vaults At Risk");

  const { data, isLoading, isError, ErrorFallbackComponent } =
    useFetch("/vaults-at-risk/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/vault-types/${row.ilk}/vaults/${row.uid}/`);
  };

  const { vaults, aggregate_data: aggregateData, osm_prices: osmPrices } = data;

  const hasVaults = vaults && vaults.length > 0;

  const stats = [
    {
      title: "# of vaults",
      bigValue: <Value value={aggregateData.count} decimals={0} />,
    },
    {
      title: "total debt",
      bigValue: (
        <Value value={aggregateData.total_debt} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "high risk",
      bigValue: <Value value={aggregateData.high} decimals={2} prefix="$" compact />,
    },
    {
      title: "medium risk",
      bigValue: <Value value={aggregateData.medium} decimals={2} prefix="$" compact />,
    },
    {
      title: "low risk",
      bigValue: <Value value={aggregateData.low} decimals={2} prefix="$" compact />,
    },
  ];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <StatsBar stats={stats} />
        </Col>
      </Row>
      {hasVaults ? (
        <Row>
          <Col xl={3} className="mb-4 text-center">
            {osmPrices.map((osm) => {
              const osmStats = [
                {
                  title: "current OSM",
                  normalValue: (
                    <Value
                      value={osm.osm_current_price}
                      decimals={2}
                      prefix="$"
                      compact100k
                    />
                  ),
                },
                {
                  title: "next OSM",
                  normalValue: (
                    <Value
                      value={osm.osm_next_price}
                      decimals={2}
                      prefix="$"
                      compact100k
                    />
                  ),
                },
              ];
              return (
                <Card className="mb-4" fullHeight={false} key={osm.symbol}>
                  <div className="mb-4 text-center">
                    <CryptoIcon className="me-2" name={osm.symbol} size="2rem" />
                    {osm.symbol}
                  </div>
                  <StatsBar stats={osmStats} cardTag="div" className="mb-2" />
                  {osm.medianizer ? (
                    <Col>
                      <div className="section-title">medianizer</div>
                      <Value value={osm.medianizer} decimals={2} prefix="$" />
                    </Col>
                  ) : null}
                  <div className="d-flex small gray align-items-center justify-content-end">
                    <DateTimeAgo dateTime={parseUTCDateTime(osm.datetime)} />
                  </div>
                </Card>
              );
            })}
          </Col>
          <Col xl={9} className="mb-4">
            <LinkTable
              keyField="uid"
              data={vaults}
              onRowClick={onRowClick}
              pagination={paginationFactory({
                sizePerPageList: [],
                sizePerPage: 20,
                showTotal: true,
              })}
              defaultSorted={[
                {
                  dataField: "debt",
                  order: "desc",
                },
              ]}
              columns={[
                {
                  dataField: "collateral_symbol",
                  text: "",
                  sort: false,
                  formatter: (cell, row) => (
                    <CryptoIcon className="me-2" name={cell} size="2rem" />
                  ),
                },
                {
                  dataField: "ilk",
                  text: "ilk",
                  sort: true,
                },
                {
                  dataField: "uid",
                  text: "vault id",
                },
                {
                  dataField: "liquidation_price",
                  text: "Liq. price",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={0} prefix="$" compact100k />
                  ),
                },
                {
                  dataField: "collateralization",
                  text: "CR",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={0} suffix="%" compact100k />
                  ),
                },
                {
                  dataField: "debt",
                  text: "debt",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={2} prefix="$" compact />
                  ),
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
                },
                {
                  dataField: "last_activity",
                  text: "Last activity",
                  formatter: (cell, row) => (
                    <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
                  ),
                  sort: true,
                },
                {
                  dataField: "owner_address",
                  text: "owner address",
                  sort: true,
                  formatter: (cell, row) => (
                    <>
                      {cell && cell !== "None" ? (
                        <EtherscanShort address={cell} name={row.owner_name} />
                      ) : (
                        "-"
                      )}
                    </>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      ) : null}
      {!hasVaults ? (
        <Row>
          <Col xl={12} className="mb-6 text-center">
            <h3 className="mb-4">no vaults at risk</h3>
            <div className={classnames(styles.successImgWrapper, "mb-4")}>
              <img src={successImg} alt="success" />
            </div>
            <Link to={"/simulations/vaults-at-risk/"}>
              <Button color="primary">vaults at risk simulation</Button>
            </Link>
          </Col>
        </Row>
      ) : null}
    </>
  );
}

export default withErrorBoundary(VaultsAtRisk);
