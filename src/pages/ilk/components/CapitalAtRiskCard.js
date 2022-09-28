import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import styles from "./CapitalAtRiskCard.module.scss";

function CapitalAtRiskCard(props) {
  const { daysAgo, ilk } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/capital-at-risk/`,
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;

  return (
    <Row>
      <Col xl={12} className="mb-4">
        <Link to={`/#/`} className={styles.link}>
          <Card titleNoBorder>
            <div className={styles.sectionWrapper}>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>current capital at risk</div>
                <Value
                  value={results.capital_at_risk}
                  decimals={2}
                  prefix="$"
                  compact
                  className={styles.valueBig}
                />
                <br />
                <small>
                  <ValueChange
                    value={results.capital_at_risk - results.change.capital_at_risk}
                    decimals={2}
                    prefix="$"
                    compact
                    icon
                    hideIfZero
                    reverse
                    tooltipValue={results.change.capital_at_risk}
                  />
                </small>
              </div>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  capital at risk <small>(30d avg)</small>
                </div>
                <Value
                  value={results.capital_at_risk_avg}
                  decimals={2}
                  prefix="$"
                  compact
                  className={styles.valueBig}
                />
                <br />
                <small>
                  <ValueChange
                    value={
                      results.capital_at_risk_avg - results.change.capital_at_risk_avg
                    }
                    decimals={2}
                    prefix="$"
                    compact
                    icon
                    hideIfZero
                    reverse
                    tooltipValue={results.change.capital_at_risk_avg}
                  />
                </small>
              </div>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>current risk premium</div>
                <Value
                  value={results.risk_premium}
                  decimals={2}
                  suffix="%"
                  className={styles.valueBig}
                />
                <br />
                <small>
                  <ValueChange
                    value={results.risk_premium - results.change.risk_premium}
                    decimals={2}
                    suffix="%"
                    icon
                    hideIfZero
                    reverse
                    tooltipValue={results.change.risk_premium}
                  />
                </small>
              </div>
              <div className={classnames(styles.section, styles.noBorder)}>
                <div className={styles.sectionTitle}>
                  risk premium <small>(30d avg)</small>
                </div>
                <Value
                  value={results.risk_premium_avg}
                  decimals={2}
                  suffix="%"
                  className={styles.valueBig}
                />
                <br />
                <small>
                  <ValueChange
                    value={results.risk_premium_avg - results.change.risk_premium_avg}
                    decimals={2}
                    suffix="%"
                    icon
                    hideIfZero
                    reverse
                    tooltipValue={results.change.risk_premium_avg}
                  />
                </small>
              </div>
              <div className={styles.iconBox}>
                <FontAwesomeIcon className={styles.icon} icon={faAngleRight} />
              </div>{" "}
            </div>
          </Card>
        </Link>
      </Col>
    </Row>
  );
}

export default withErrorBoundary(CapitalAtRiskCard);
