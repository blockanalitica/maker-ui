import React from "react";
import Loader from "../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import WhaleCard from "./components/WhaleCard.js";

function Whales(props) {
  usePageTitle("Whales");
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/whales/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <>
      {/* <StatsCard stats={data.stats} /> */}
      <WhaleCard results={data.results} />
    </>
  );
}

export default withErrorBoundary(Whales);
