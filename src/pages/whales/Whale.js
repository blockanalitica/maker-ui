import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import EtherscanShort from "../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";
import { parseUTCDateTime } from "../../utils/datetime.js";

function Whale(props) {
  const { slug } = useParams();
  let navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/whales/${slug}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/vault-types/${row.ilk}/vaults/${row.uid}/`);
  };

  const { results, name } = data;

  return (
    <>
      <div className="d-flex mb-4 align-items-center">
        <CryptoIcon name={slug} size="3rem" className="me-3" />
        <h1 className="m-0 h3">{name} vaults</h1>
      </div>

      <div>
        <LinkTable
          keyField="uid"
          data={results}
          onRowClick={onRowClick}
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
              formatter: (cell, row) => (
                <Value value={cell} decimals={2} prefix="$" compact />
              ),
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "liquidation_drop",
              text: "Liq. drop",
              sort: true,
              formatter: (cell, row) => (
                <Value value={cell * 100} decimals={2} suffix="%" />
              ),
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "liquidation_price",
              text: "Liq. price",
              sort: true,
              formatter: (cell, row) => <Value value={cell} decimals={0} prefix="$" />,
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
              dataField: "last_activity",
              text: "Last activity",
              formatter: (cell, row) => (
                <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
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
              headerAlign: "center",
              align: "center",
            },
          ]}
        />
      </div>
    </>
  );
}

export default withErrorBoundary(Whale);
