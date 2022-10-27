// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import PropTypes from "prop-types";
import React from "react";
import { ReactComponent as aaveIcon } from "../../images/crypto/color/aave.svg";
import { ReactComponent as amplIcon } from "../../images/crypto/color/ampl.svg";
import { ReactComponent as balIcon } from "../../images/crypto/color/bal.svg";
import { ReactComponent as batIcon } from "../../images/crypto/color/bat.svg";
import { ReactComponent as bnbIcon } from "../../images/crypto/color/bnb.svg";
import { ReactComponent as btcIcon } from "../../images/crypto/color/btc.svg";
import { ReactComponent as celIcon } from "../../images/crypto/color/cel.svg";
import { ReactComponent as compIcon } from "../../images/crypto/color/comp.svg";
import { ReactComponent as crvIcon } from "../../images/crypto/color/crv.svg";
import { ReactComponent as daiIcon } from "../../images/crypto/color/dai.svg";
import { ReactComponent as dpiIcon } from "../../images/crypto/color/dpi.svg";
import { ReactComponent as enjIcon } from "../../images/crypto/color/enj.svg";
import { ReactComponent as ensIcon } from "../../images/crypto/color/ens.svg";
import { ReactComponent as ethIcon } from "../../images/crypto/color/eth.svg";
import { ReactComponent as feiIcon } from "../../images/crypto/color/fei.svg";
import { ReactComponent as filIcon } from "../../images/crypto/color/fil.svg";
import { ReactComponent as fraxIcon } from "../../images/crypto/color/frax.svg";
import { ReactComponent as gnoIcon } from "../../images/crypto/color/gno.svg";
import { ReactComponent as gunidaiusdcIcon } from "../../images/crypto/color/gunidaiusdc.svg";
import { ReactComponent as gusdIcon } from "../../images/crypto/color/gusd.svg";
import { ReactComponent as kncIcon } from "../../images/crypto/color/knc.svg";
import { ReactComponent as linkIcon } from "../../images/crypto/color/link.svg";
import { ReactComponent as lrcIcon } from "../../images/crypto/color/lrc.svg";
import { ReactComponent as manaIcon } from "../../images/crypto/color/mana.svg";
import { ReactComponent as maticIcon } from "../../images/crypto/color/matic.svg";
import { ReactComponent as mkrIcon } from "../../images/crypto/color/mkr.svg";
import { ReactComponent as nexoIcon } from "../../images/crypto/color/nexo.svg";
import { ReactComponent as paxIcon } from "../../images/crypto/color/pax.svg";
import { ReactComponent as raiIcon } from "../../images/crypto/color/rai.svg";
import { ReactComponent as renIcon } from "../../images/crypto/color/ren.svg";
import { ReactComponent as snxIcon } from "../../images/crypto/color/snx.svg";
import { ReactComponent as stEthIcon } from "../../images/crypto/color/steth.svg";
import { ReactComponent as stkAaveIcon } from "../../images/crypto/color/stkaave.svg";
import { ReactComponent as susdIcon } from "../../images/crypto/color/susd.svg";
import { ReactComponent as sushiIcon } from "../../images/crypto/color/sushi.svg";
import { ReactComponent as tusdIcon } from "../../images/crypto/color/tusd.svg";
import { ReactComponent as uniIcon } from "../../images/crypto/color/uni.svg";
import { ReactComponent as univ2daiethIcon } from "../../images/crypto/color/univ2daieth.svg";
import { ReactComponent as univ2uniethIcon } from "../../images/crypto/color/univ2unieth.svg";
import { ReactComponent as univ2usdcethIcon } from "../../images/crypto/color/univ2usdceth.svg";
import { ReactComponent as univ2wbtcdaiIcon } from "../../images/crypto/color/univ2wbtcdai.svg";
import { ReactComponent as univ2wbtcethIcon } from "../../images/crypto/color/univ2wbtceth.svg";
import { ReactComponent as usdcIcon } from "../../images/crypto/color/usdc.svg";
import { ReactComponent as usdtIcon } from "../../images/crypto/color/usdt.svg";
import { ReactComponent as ustIcon } from "../../images/crypto/color/ust.svg";
import { ReactComponent as wbtcIcon } from "../../images/crypto/color/wbtc.svg";
import { ReactComponent as yfiIcon } from "../../images/crypto/color/yfi.svg";
import { ReactComponent as zrxIcon } from "../../images/crypto/color/zrx.svg";
import { ReactComponent as debankIcon } from "../../images/debank.svg";
import { ReactComponent as defisaverIcon } from "../../images/defisaver.svg";
import { ReactComponent as etherscanIcon } from "../../images/etherscan.svg";
import { ReactComponent as zapperIcon } from "../../images/zapper.svg";

function CryptoIcon(props) {
  const { name, size, address, ...rest } = props;
  const mapping = {
    AAVE: aaveIcon,
    AMPL: amplIcon,
    BAT: batIcon,
    BAL: balIcon,
    BUSD: bnbIcon,
    COMP: compIcon,
    CRV: crvIcon,
    DAI: daiIcon,
    ETH: ethIcon,
    ENJ: enjIcon,
    GUSD: gusdIcon,
    LINK: linkIcon,
    MKR: mkrIcon,
    PAX: paxIcon,
    PAXUSD: paxIcon,
    SUSHI: sushiIcon,
    xSUSHI: sushiIcon,
    KNC: kncIcon,
    SNX: snxIcon,
    TUSD: tusdIcon,
    UNI: uniIcon,
    USDC: usdcIcon,
    USDP: paxIcon,
    USDT: usdtIcon,
    WBTC: wbtcIcon,
    WETH: ethIcon,
    stETH: stEthIcon,
    STETH: stEthIcon,
    WSTETH: stEthIcon,
    MANA: manaIcon,
    MATIC: maticIcon,
    renFIL: filIcon,
    YFI: yfiIcon,
    ZRX: zrxIcon,
    FEI: feiIcon,
    BTC: btcIcon,
    FRAX: fraxIcon,
    sUSD: susdIcon,
    DPI: dpiIcon,
    REN: renIcon,
    RENBTC: btcIcon,
    RAI: raiIcon,
    ENS: ensIcon,
    UST: ustIcon,
    LRC: lrcIcon,
    stkAAVE: stkAaveIcon,
    UNIV2DAIETH: univ2daiethIcon,
    UNIV2UNIETH: univ2uniethIcon,
    UNIV2USDCETH: univ2usdcethIcon,
    UNIV2WBTCDAI: univ2wbtcdaiIcon,
    UNIV2WBTCETH: univ2wbtcethIcon,
    CRVV1ETHSTETH: stEthIcon,
    UNIV2DAIUSDC: gunidaiusdcIcon,
    GUNIV3DAIUSDC1: gunidaiusdcIcon,
    GUNIV3DAIUSDC2: gunidaiusdcIcon,
    nexo: nexoIcon,
    celsius: celIcon,
    gnosis: gnoIcon,
    "7-siblings": daiIcon,
    defisaver: defisaverIcon,
    Compound: compIcon,
    "ETH-A": ethIcon,
    "ETH-B": ethIcon,
    "ETH-C": ethIcon,
    etherscan: etherscanIcon,
    debank: debankIcon,
    zapper: zapperIcon,
    "yearn-treasury": yfiIcon,
    "yearn-strategies": yfiIcon,
    "mana-treasury": manaIcon,
    "matic-treasury": maticIcon,
  };
  const Icon = mapping[name];
  if (!Icon) {
    return null;
  }

  return <Icon {...rest} width={size} height={size} />;
}

CryptoIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
};

CryptoIcon.defaultProps = {
  size: "1rem",
};

export default CryptoIcon;
