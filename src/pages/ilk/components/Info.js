import React from "react";
import { Col, Row } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import styles from "./Info.module.scss";
function Info(props) {
  const { ilk, days_ago } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/`,
    { days_ago }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <Row>
      <Col xl={12} className="mb-4">
        <Card>
          <div className={styles.sectionWrapper}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>stability fee</div>
              <Value
                value={data.stability_fee * 100}
                decimals={2}
                suffix="%"
                compact
                className={styles.valueBig}
              />
            </div>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>liquidation ratio</div>
              <Value
                value={data.lr * 100}
                decimals={2}
                suffix="%"
                compact
                className={styles.valueBig}
              />
            </div>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>debt ceiling</div>
              <Value
                value={data.dc_iam_line}
                decimals={2}
                prefix="$"
                compact
                className={styles.valueBig}
              />
            </div>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>dust</div>
              <Value
                value={data.dust}
                decimals={2}
                prefix="$"
                compact
                className={styles.valueBig}
              />
            </div>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>liquidation hole</div>
              <Value
                value={data.hole}
                decimals={2}
                prefix="$"
                compact
                className={styles.valueBig}
              />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default withErrorBoundary(Info);
