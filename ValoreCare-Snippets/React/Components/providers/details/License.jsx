import React from "react";
import { Col, Row } from "reactstrap";
import PropTypes from "prop-types";

const License = (props) => {
  const mapLicense = (license) => {
    return (
      <Col xs="12" md="6" key={license.id}>
        <img
          style={{ objectFit: "contain", width: "100%" }}
          src={license.licenseUrl}
          alt="license"
        />
      </Col>
    );
  };
  const providerLicense =
    props.history.location.state.licenses &&
    props.history.location.state.licenses.map(mapLicense);

  return <Row>{providerLicense}</Row>;
};

License.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        licenses: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            licenseUrl: PropTypes.string,
          })
        ),
      }),
    }),
  }),
};

export default License;
