// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Route, Routes } from "react-router";
import { Link, Navigate } from "react-router-dom";
import {
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from "reactstrap";
import SimpleRedirect from "../../components/SimpleRedirect/SimpleRedirect.js";
import baLogo from "../../images/logo-light.svg";
import makerLogo from "../../images/mkr.svg";
import AllVaults from "../../pages/allVaults/AllVaults.js";
import Asset from "../../pages/asset/Asset.js";
import Assets from "../../pages/assets/Assets.js";
import AuctionKickSim from "../../pages/auctionKickSim/AuctionKickSim.js";
import AuctionsThroughput from "../../pages/auctionThroughputs/AuctionsThroughput.js";
import AuctionThroughput from "../../pages/auctionThroughputs/AuctionThroughput.js";
import AaveD3M from "../../pages/d3m/AaveD3M.js";
import Changelog from "../../pages/changelog/Changelog.js";
import D3M from "../../pages/d3m/D3M.js";
import RevenueD3M from "../../pages/d3m/RevenueD3M.js";
import DaiGrowth from "../../pages/daiGrowth/DaiGrowth.js";
import DaiTrades from "../../pages/daiTrades/DaiTrades.js";
import Defi from "../../pages/defi/Defi.js";
import DustSim from "../../pages/dustSim/DustSim.js";
import ErrorPage from "../../pages/error/ErrorPage.js";
import FAQ from "../../pages/faq/Faq.js";
import ForumArchive from "../../pages/forumArchive/ForumArchive.js";
import Homepage from "../../pages/homepage/Homepage.js";
import Ilk from "../../pages/ilk/Ilk.js";
import IlkHistoricStats from "../../pages/ilk/IlkHistoricStats.js";
import Ilks from "../../pages/ilks/Ilks.js";
import PerDayTab from "../../pages/liquidations/components/PerDayTab.js";
import KeepersPage from "../../pages/liquidations/KeepersPage.js";
import LiquidationActions from "../../pages/liquidations/LiquidationActions.js";
import Liquidations from "../../pages/liquidations/Liquidations.js";
import LiquidationsIlk from "../../pages/liquidations/LiquidationsIlk.js";
import LiquidationsPerDateIlk from "../../pages/liquidations/LiquidationsPerDateIlk.js";
import LiquidationsPerDateIlks from "../../pages/liquidations/LiquidationsPerDateIlks.js";
import LiquidationsPerVaultType from "../../pages/liquidations/LiquidationsPerVaultType.js";
import TakersPage from "../../pages/liquidations/TakersPage.js";
import OracleHistoricStats from "../../pages/OSM/OracleHistoricStats.js";
import OSM from "../../pages/OSM/OSM.js";
import PSM from "../../pages/psm/PSM.js";
import PSMs from "../../pages/psm/PSMs.js";
import RiskModel from "../../pages/riskModel/RiskModel.js";
import Vault from "../../pages/vault/Vault.js";
import Vaults from "../../pages/vaults/Vaults.js";
import VaultsAtRisk from "../../pages/vaultsAtRisk/VaultsAtRisk.js";
import VaultsAtRiskMarket from "../../pages/vaultsAtRisk/VaultsAtRiskMarket.js";
import VaultsAtRiskSimulation from "../../pages/vaultsAtRisk/VaultsAtRiskSimulation.js";
import Wallet from "../../pages/wallets/Wallet.js";
import Whales from "../../pages/whales/Whales.js";
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory.js";
import styles from "./Layout.module.scss";

function Layout(props) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);
  return (
    <>
      <Container fluid="xl">
        <header className="mb-4">
          <Navbar expand="md" className="fw-bolder" dark container={false}>
            <NavbarBrand className={styles.navbarBrand} tag={Link} to="/">
              <img src={makerLogo} alt="maker" className={styles.logo} />
              MAKER RISK
            </NavbarBrand>
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={isNavbarOpen} navbar>
              <Nav className="flex-grow-1 justify-content-end" navbar>
                <NavItem>
                  <NavLink tag={Link} to="vault-types/">
                    Vault types
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="vaults-at-risk/">
                    Vaults at risk
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="psms/">
                    PSM
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="d3m/">
                    D3M
                  </NavLink>
                </NavItem>
                <NavLink tag={Link} to="defi/">
                  DeFi
                </NavLink>
                <NavItem>
                  <NavLink tag={Link} to="oracles/">
                    Oracles
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="liquidations/">
                    Liquidations
                  </NavLink>
                </NavItem>

                <UncontrolledDropdown inNavbar nav>
                  <DropdownToggle caret nav>
                    Simulations
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <NavLink tag={Link} to="simulations/risk-model/">
                        Risk Model
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="simulations/vaults-at-risk/">
                        Vaults at Risk
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="simulations/auctions-throughput/">
                        Auctions Throughput
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="simulations/auctions-kick/">
                        Auction Kicks
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="simulations/dust/">
                        Dust
                      </NavLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown inNavbar nav>
                  <DropdownToggle caret nav>
                    More
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <NavLink tag={Link} to="dai/growth/">
                        DAI Growth
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="dai/trades/">
                        DAI Trades
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="vaults/all/">
                        All Vaults
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="whales/">
                        Whales
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="assets/">
                        Assets
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="vaults-at-risk-market/">
                        Vaults At Risk Market
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="forum-archive/">
                        Forum Archive
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="faq/">
                        FAQ
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="changelog/">
                        Changelog
                      </NavLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
        </header>

        <main>
          <BreadcrumbHistory />
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="/assets/" element={<Assets />} />
            <Route path="/assets/:symbol/" element={<Asset />} />
            <Route path="/vault-types/" element={<Ilks />} />
            <Route path="/vault-types/:ilk/" element={<Ilk />} />
            <Route path="/vault-types/:ilk/vaults/" element={<Vaults />} />
            <Route path="/vault-types/:ilk/history/" element={<IlkHistoricStats />} />
            <Route path="/vaults-at-risk/" element={<VaultsAtRisk />} />
            <Route path="/vaults-at-risk-market/" element={<VaultsAtRiskMarket />} />
            <Route path="/vault-types/:ilk/vaults/:uid/" element={<Vault />} />
            <Route path="/liquidations/" element={<Liquidations />} />
            <Route path="/liquidations/keepers/" element={<KeepersPage />} />
            <Route path="/liquidations/takers/" element={<TakersPage />} />
            <Route path="/liquidations/:ilk/:uid/" element={<LiquidationActions />} />
            <Route path="/liquidations/:ilk/" element={<LiquidationsIlk />} />
            <Route
              path="/liquidations/per-vault-type/:ilk/"
              element={<LiquidationsPerVaultType />}
            />
            <Route path="/liquidations/per-date/" element={<PerDayTab />} />
            <Route
              path="/liquidations/per-date/:date/"
              element={<LiquidationsPerDateIlks />}
            />
            <Route
              path="/liquidations/per-date/:date/:ilk/"
              element={<LiquidationsPerDateIlk />}
            />
            <Route path="/d3m/" element={<D3M />} />
            <Route path="/d3m/:protocol/" element={<AaveD3M />} />
            <Route path="/d3m/:protocol/revenue/" element={<RevenueD3M />} />
            <Route path="/oracles/" element={<OSM />} />
            <Route path="/oracles/:symbol/" element={<OracleHistoricStats />} />
            <Route path="/simulations/risk-model/" element={<RiskModel />} />
            <Route
              path="/simulations/vaults-at-risk/"
              element={<VaultsAtRiskSimulation />}
            />
            <Route
              path="/simulations/auctions-throughput/"
              element={<AuctionsThroughput />}
            />
            <Route
              path="/simulations/auctions-throughput/:ilk/"
              element={<AuctionThroughput />}
            />
            <Route path="/simulations/auctions-kick/" element={<AuctionKickSim />} />
            <Route path="/simulations/dust/" element={<DustSim />} />
            <Route path="/dai/" element={<DaiGrowth />} />
            <Route path="/dai/growth/" element={<DaiGrowth />} />
            <Route path="/dai/trades/" element={<DaiTrades />} />
            <Route path="/whales/" element={<Whales />} />
            <Route path="/wallets/:address/" element={<Wallet />} />
            <Route path="/forum-archive/" element={<ForumArchive />} />
            <Route path="/psms/:ilk/" element={<PSM />} />
            <Route path="/psms/" element={<PSMs />} />
            <Route path="/vaults/all/" element={<AllVaults />} />
            <Route path="/defi/" element={<Defi />} />
            <Route path="/faq/" element={<FAQ />} />
            <Route path="/changelog/" element={<Changelog />} />

            {/* Redirects from old maker dashboard */}
            <Route path="/vaults/" element={<Navigate replace to="/vault-types/" />} />
            <Route
              path="/vaults/at-risk/"
              element={<Navigate replace to="/vaults-at-risk/" />}
            />
            <Route
              path="/vaults/:ilk/"
              element={<SimpleRedirect replace to="/vault-types/:ilk/" />}
            />
            <Route
              path="/vaults/:ilk/vaults/:uid/"
              element={<SimpleRedirect replace to="/vault-types/:ilk/vaults/:uid/" />}
            />
            <Route path="/osm/" element={<Navigate replace to="/oracles/" />} />
            <Route
              path="/auctions/"
              element={<Navigate replace to="/liquidations/" />}
            />
            <Route
              path="/dai-trades/"
              element={<Navigate replace to="/dai/trades/" />}
            />
            <Route
              path="/dai-supply-growth/"
              element={<Navigate replace to="/dai/growth/" />}
            />
            <Route
              path="/risk-model/"
              element={<Navigate replace to="/simulations/risk-model/" />}
            />
            <Route
              path="/vaults-at-risk-simulation/"
              element={<Navigate replace to="/simulations/vaults-at-risk/" />}
            />
            <Route
              path="/d3m/"
              element={<Navigate replace to="/d3m/aave/revenue/" />}
            />
            <Route
              path="/d3m/compound/"
              element={<Navigate replace to="/d3m/compound/revenue/" />}
            />
            <Route
              path="/auctions/throughput/"
              element={<Navigate replace to="/simulations/auctions-throughput/" />}
            />
            <Route
              path="/auctions/kick-sim/"
              element={<Navigate replace to="/simulations/auctions-kick/" />}
            />
            <Route
              path="/forum-archive/:category/"
              element={
                <SimpleRedirect replace to="/forum-archive/?category=:category" />
              }
            />

            {/* Catch all */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </Container>

      <footer className="d-flex justify-content-center align-items-baseline gray p-3 small mt-4">
        <img src={baLogo} alt="blockanalitica" className={styles.footerLogo} />
        &copy;2022
      </footer>
    </>
  );
}

export default Layout;
