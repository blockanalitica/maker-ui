// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import ReactSelect from "react-select";

export default function Select(props) {
  return (
    <ReactSelect
      styles={{
        control: (provided, state) => ({
          ...provided,
          backgroundColor: "#000000",
          borderWidth: 1,
          borderColor: "#333c49",
          color: "rgba(244, 244, 245, 0.9)",
        }),
        singleValue: (provided, state) => ({
          ...provided,
          color: "rgba(244, 244, 245, 0.9)",
        }),
        indicatorSeparator: (provided, state) => ({
          ...provided,
          display: "none",
        }),
        input: (provided, state) => ({
          ...provided,
          color: "rgba(244, 244, 245, 0.9)",
        }),
        option: (provided, state) => {
          return {
            ...provided,
            color: state.isFocused ? "#000000" : "rgba(244, 244, 245, 0.9)",
            backgroundColor: state.isFocused
              ? "#51b4c5"
              : state.isSelected
              ? "rgba(81, 180, 197, 0.7)"
              : "transparent",
            ":active": {},
          };
        },
        menu: (provided, state) => ({
          ...provided,
          backgroundColor: "#191e3a",
          zIndex: 2,
          margin: "0.3rem 0 0 0",
          width: "max-content",
          minWidth: "100%",
        }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: "0.3rem",
      })}
      {...props}
    />
  );
}
