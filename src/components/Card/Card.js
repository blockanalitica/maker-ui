// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Card as StrapCard, CardBody, CardTitle } from "reactstrap";
import slugify from "slugify";
import styles from "./Card.module.scss";

function Card(props) {
  const {
    className,
    bodyClassName,
    title,
    children,
    fullHeight,
    id,
    titleNoBorder,
    ...rest
  } = props;
  let anchorId;
  if (id || typeof title === "string") {
    anchorId = slugify(id || title).toLowerCase();
  }
  return (
    <StrapCard
      id={anchorId}
      className={classnames(className, {
        "h-100": fullHeight,
      })}
      {...rest}
    >
      {title ? (
        <CardTitle
          tag="h3"
          className={classnames(styles.title, {
            [styles.noBorder]: titleNoBorder,
          })}
        >
          {title}
        </CardTitle>
      ) : null}
      <CardBody className={bodyClassName}>{children}</CardBody>
    </StrapCard>
  );
}

Card.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  id: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  fullHeight: PropTypes.bool,
  titleNoBorder: PropTypes.bool,
  bodyClassName: PropTypes.string,
};

Card.defaultProps = {
  fullHeight: true,
  titleNoBorder: false,
};

export default Card;
