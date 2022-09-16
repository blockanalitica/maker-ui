import React from "react";

function EtherscanShort(props) {
  const { address, name, type } = props;
  if (address === null) {
    return address;
  }
  let href;
  if (type === "txhash") {
    href = `https://etherscan.io/tx/${address}`;
  } else {
    href = `https://etherscan.io/address/${address}`;
  }
  let text;
  if (name && name !== "None") {
    text = name;
  } else {
    text = address.slice(0, 5) + "..." + address.slice(-5);
  }
  return (
    <>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    </>
  );
}

export default EtherscanShort;
