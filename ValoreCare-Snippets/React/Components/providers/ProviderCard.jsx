import React, { PureComponent } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import PropTypes from "prop-types";
import yellowIcon from "../../assets/images/users/yellow-profile-icon.png";
import debug from "sabio-debug";
import BgCheckResults from "./../backgroundCheck/BgCheckResults";
const _logger = debug.extend("Providers");

class ProviderCard extends PureComponent {
  state = {};

  render() {
    const findYearsOfExp = () => {
      let startYear = this.props.provider.experienceDetails[0].startDate.substring(
        0,
        4
      );
      let currentYear = new Date().getFullYear();
      return currentYear - startYear;
    };

    _logger("card render", this.props.provider);
    return (
      <Col key={this.props.provider.userId} md="6">
        <Card>
          <CardBody className="mt-3 mb-3">
            <Row>
              <Col
                xs="4"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  className="rounded-circle"
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  alt="Profile Avatar"
                  src={this.props.provider.avatarUrl}
                  ref={(img) => (this.img = img)}
                  onError={() => (this.img.src = yellowIcon)}
                />
              </Col>
              <Col className="pl-3 mt-3" style={{ textAlign: "left" }}>
                <h2>
                  {this.props.provider.firstName || ""}{" "}
                  {this.props.provider.lastName || ""}
                </h2>
                {/* <h4>
                  <small>
                    Avg Rating:{" "}
                    {this.props.provider.averageRating
                      ? this.props.provider.averageRating
                      : "N/A"}
                  </small>
                </h4> */}
                <h4>
                  <BgCheckResults userId={this.props.provider.userId} />
                </h4>
              </Col>
            </Row>
            <Row className="pt-4 pb-4">
              <Col>
                <h4>
                  {findYearsOfExp()} + <br />
                  <small>Years Exp.</small>
                </h4>
              </Col>
              <Col
                style={{
                  borderLeft: "solid thin #cccccc",
                  borderRight: "solid thin #cccccc",
                }}
              >
                <h4>
                  $ {this.props.provider.price || ""} <br />
                  <small>Hourly Rate</small>
                </h4>
              </Col>
              <Col>
                <h4>
                  {" "}
                  {Math.ceil(
                    (this.props.provider.distance / 1000) * 0.621371
                  ) || ""}{" "}
                  <br />
                  <small>Miles Away</small>
                </h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  color="primary"
                  onClick={() => this.props.onSeeMore(this.props.provider)}
                >
                  See More
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default ProviderCard;

ProviderCard.propTypes = {
  isToggled: PropTypes.bool,
  provider: PropTypes.shape({
    userId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    mi: PropTypes.string,
    avatarUrl: PropTypes.string,
    dateModified: PropTypes.string,
    dateCreated: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    bio: PropTypes.string,
    price: PropTypes.number,
    certifications: PropTypes.array,
    expertise: PropTypes.array,
    licenses: PropTypes.array,
    languages: PropTypes.array,
    locations: PropTypes.array,
    careNeeds: PropTypes.array,
    concerns: PropTypes.array,
    ratings: PropTypes.array,
    averageRating: PropTypes.number,
    helperNeeds: PropTypes.array,
    experienceDetails: PropTypes.array,
    distance: PropTypes.number,
  }),

  currentUser: PropTypes.shape({
    firstName: PropTypes.string,
    avatarUrl: PropTypes.string,
    id: PropTypes.number,
  }),
  onSeeMore: PropTypes.func,
};
