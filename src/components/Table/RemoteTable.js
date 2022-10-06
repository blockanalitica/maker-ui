// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import PropTypes from "prop-types";
import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import LoadingOverlay from "react-loading-overlay";
import LinkTable from "./LinkTable.js";

function RemoteTable(props) {
  const {
    onPageChange,
    onSortChange,
    onSearch,
    page,
    pageSize,
    totalPageSize,
    onRowClick,
    loading,
    ...rest
  } = props;

  const [timer, setTimer] = useState(null);

  const handleTableChange = (type, { page, sortOrder, sortField, searchText }) => {
    switch (type) {
      case "pagination":
        if (onPageChange) {
          onPageChange(page);
        }
        break;
      case "sort":
        if (onSortChange) {
          if (onPageChange) {
            onPageChange(page);
          }
          if (sortOrder === "asc") {
            onSortChange(sortField);
          } else {
            onSortChange(`-${sortField}`);
          }
        }
        break;
      case "search":
        if (onSearch) {
          if (timer) {
            clearTimeout(timer);
          }
          setTimer(
            setTimeout(() => {
              if (onPageChange) {
                onPageChange(1);
              }
              if (searchText) {
                onSearch(searchText);
              } else {
                // If searchText is empty or whatever, we set it to null, to solve the
                // issue where in most cases we want to treat null, undefined and empty
                // string the same way in search
                onSearch(null);
              }
            }, 600)
          );
        }
        break;
      default:
      // pass
    }
  };

  const Component = onRowClick === undefined ? BootstrapTable : LinkTable;

  return (
    <LoadingOverlay active={loading} spinner>
      <Component
        bootstrap4
        remote
        hover
        onRowClick={onRowClick}
        bordered={false}
        keyField="address"
        onTableChange={handleTableChange}
        pagination={paginationFactory({
          page,
          sizePerPageList: [],
          sizePerPage: pageSize,
          showTotal: true,
          totalSize: totalPageSize,
        })}
        {...rest}
      />
    </LoadingOverlay>
  );
}

RemoteTable.propTypes = {
  onPageChange: PropTypes.func,
  onSortChange: PropTypes.func,
  onSearch: PropTypes.func,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalPageSize: PropTypes.number.isRequired,
  onRowClick: PropTypes.func,
  loading: PropTypes.bool,
};

export default RemoteTable;
