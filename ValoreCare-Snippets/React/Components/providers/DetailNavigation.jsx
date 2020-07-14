import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import {
  Nav,
  NavItem,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  Container,
} from "reactstrap";

import "./ProviderDetailsStyle.css";
import About from "./details/About";
import Experience from "./details/Experience";
import Certification from "./details/Certification";
import License from "./details/License";
import Schedule from "./details/Schedule";
import Education from "./details/Education";
import PropTypes from "prop-types";

import debug from "sabio-debug";
const _logger = debug.extend("ProviderDetails");

const DetailNavigation = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  _logger("Details: ", props.history.location.state);

  return (
    <Router>
      <Row className="mb-5">
        <Col>
          <Navbar light expand="md" className="mx-auto">
            <NavbarToggler className="mx-auto mb-3" onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar style={{ textAlign: "center" }}>
                <Row>
                  <Col xs="12" md="auto" className="mb-2">
                    <NavItem>
                      <h4>
                        <NavLink
                          to={`/provider/${props.history.location.state.userId}/about`}
                          activeClassName="selectedLink"
                        >
                          About
                        </NavLink>
                      </h4>
                    </NavItem>
                  </Col>
                  <Col xs="12" md="auto" className="mb-2">
                    <NavItem>
                      <h4>
                        <NavLink
                          to={`/provider/${props.history.location.state.userId}/experience`}
                          activeClassName="selectedLink"
                        >
                          Experience
                        </NavLink>
                      </h4>
                    </NavItem>
                  </Col>
                  <Col xs="12" md="auto" className="mb-2">
                    <NavItem>
                      <h4>
                        <NavLink
                          to={`/provider/${props.history.location.state.userId}/schedule`}
                          activeClassName="selectedLink"
                        >
                          Availability
                        </NavLink>
                      </h4>
                    </NavItem>
                  </Col>
                  <Col xs="12" md="auto" className="mb-2">
                    <NavItem>
                      <h4>
                        <NavLink
                          to={`/provider/${props.history.location.state.userId}/education`}
                          activeClassName="selectedLink"
                        >
                          Education
                        </NavLink>
                      </h4>
                    </NavItem>
                  </Col>
                  <Col xs="12" md="auto" className="mb-2">
                    <NavItem>
                      <h4>
                        <NavLink
                          to={`/provider/${props.history.location.state.userId}/certification`}
                          activeClassName="selectedLink"
                        >
                          Certification
                        </NavLink>
                      </h4>
                    </NavItem>
                  </Col>
                  <Col xs="12" md="auto" className="mb-2">
                    <NavItem>
                      <h4>
                        <NavLink
                          to={`/provider/${props.history.location.state.userId}/license`}
                          activeClassName="selectedLink"
                        >
                          License
                        </NavLink>
                      </h4>
                    </NavItem>
                  </Col>
                </Row>
              </Nav>
            </Collapse>
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Col>
          <Switch>
            <Route
              path={`/provider/${props.history.location.state.userId}/experience`}
            >
              <Container>
                <Experience {...props} />
              </Container>
            </Route>
            <Route
              path={`/provider/${props.history.location.state.userId}/schedule`}
            >
              <Row>
                <Col>
                  <Schedule {...props} />
                </Col>
              </Row>
            </Route>
            <Route
              path={`/provider/${props.history.location.state.userId}/education`}
            >
              <Row>
                <Col>
                  <Education {...props} />
                </Col>
              </Row>
            </Route>
            <Route
              path={`/provider/${props.history.location.state.userId}/certification`}
            >
              <Container>
                <Certification {...props} />
              </Container>
            </Route>
            <Route
              path={`/provider/${props.history.location.state.userId}/license`}
            >
              <Container>
                <License {...props} />
              </Container>
            </Route>

            <Route>
              <Redirect
                from="/"
                to={`/provider/${props.history.location.state.userId}/about`}
              />
              <Row>
                <Col>
                  <About
                    {...props}
                    providerDetails={props.history.location.state}
                  />
                </Col>
              </Row>
            </Route>
          </Switch>
        </Col>
      </Row>
    </Router>
  );
};

DetailNavigation.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        userId: PropTypes.number,
        price: PropTypes.number,
      }),
    }),
  }),
  currentUser: PropTypes.shape({
    userId: PropTypes.number,
  }),
};

export default DetailNavigation;
