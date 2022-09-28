import React, { useState } from "react";
import { Col, Row, Badge } from "reactstrap";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import Loader from "../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle, useQueryParams } from "../../hooks";
import Card from "../../components/Card/Card.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import { parseUTCDateTime } from "../../utils/datetime.js";

function ForumArchive(props) {
  usePageTitle("Risk Core Unit Forum Archive");

  const navigate = useNavigate();
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const queryParams = useQueryParams();
  const category = queryParams.get("category");

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/forum-archive/",
    {
      p: page,
      p_size: pageSize,
      category: category,
    },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { segments, results, count } = data;

  const onRowClick = (row) => {
    window.open(row.url, "_blank");
  };

  const setCategoryParam = (category) => {
    let qs = queryString.stringify({ category });
    navigate(`?${qs}`);
  };

  const sliceTitle = (value) => {
    let title = value;
    if (value.length > 29) {
      title = value.slice(0, 29);
      title += "...";
    }
    return title;
  };

  return (
    <>
      <h1 className="mb-4 h3">risk core unit forum archive</h1>
      <h2 className="mb-4 h4 gray">{category ? category : "all posts"}</h2>
      <Row>
        <Col xl={9} className="mb-4">
          <RemoteTable
            loading={isPreviousData}
            onRowClick={onRowClick}
            keyField="url"
            data={results}
            columns={[
              {
                dataField: "publish_date",
                text: "Date",
                formatter: (cell, row) => (
                  <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
                ),
              },
              {
                dataField: "title",
                text: "Subject and short desc",
                formatter: (cell, row) => (
                  <>
                    <h5 className="mb-3">{row.title}</h5>
                    <p className="mb-1">{row.description}&hellip;</p>
                    {row.vault_types
                      ? row.vault_types.map((vaultType) => (
                          <Badge className="mt-2 me-2 small" key={vaultType}>
                            {vaultType}
                          </Badge>
                        ))
                      : null}
                  </>
                ),
              },
              {
                dataField: "publisher",
                text: "author",
              },
            ]}
            page={page}
            pageSize={pageSize}
            totalPageSize={count}
            onPageChange={setPage}
          />
        </Col>
        <Col xl={3} className="mb-4">
          <Card fullHeight={false}>
            <h5>Categories</h5>
            {segments
              ? segments.map((segment) => (
                  <div
                    key={segment.title}
                    className="link-primary mb-1"
                    role="button"
                    onClick={() => setCategoryParam(segment.title)}
                  >
                    {sliceTitle(segment.title)}
                    <Badge className="ms-2">{segment.count}</Badge>
                  </div>
                ))
              : null}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(ForumArchive);
