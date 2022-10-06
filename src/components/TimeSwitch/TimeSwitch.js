// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import classnames from "classnames";
import React, { useState } from "react";
import styles from "./TimeSwitch.module.scss";

function TimeSwitch(props) {
  const { label, className, onChange, activeOption, ...rest } = props;
  let { options } = props;

  if (!options) {
    options = [
      { key: 1, value: "1 day" },
      { key: 7, value: "7 days" },
      { key: 30, value: "30 days" },
    ];
  }

  const [active, setActive] = useState(activeOption || options[0].key);

  const onOptionClick = (option) => {
    setActive(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={classnames(styles.timeSwitchContainer, className)}>
      {label ? <label className={styles.timeSwitchLabel}>{label}</label> : null}
      <ul className={styles.timeSwitch} {...rest}>
        {options.map((option) => (
          <li
            key={option.key}
            className={classnames(styles.timeSwitchItem, {
              [styles.timeSwitchItemActive]: option.key === active,
            })}
            onClick={() => onOptionClick(option.key)}
          >
            {option.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimeSwitch;
