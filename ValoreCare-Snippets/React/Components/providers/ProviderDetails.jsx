import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { paginateByProviderId } from "../../services/scheduleService";
import { getById } from "../../services/educationService";
import { getType } from "../../services/lookUpService";
import DetailNavigation from "./DetailNavigation";
import ProviderDetailPdf from "./ProviderDetailPDF";
import PropTypes from "prop-types";
import Types from "./details/Types";
import debug from "sabio-debug";
import "./ProviderDetailsStyle.css";

const _logger = debug.extend("ProviderDetails");

class ProviderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      providerSchedule: [],
      providerEducation: [],
      certificateTypes: [],
      daysOfWeek: [],
    };
  }

  componentDidMount() {
    _logger("Details: ", this.props.location.state);
    paginateByProviderId(this.props.location.state.userId)
      .then(this.onPaginateByIdSuccess)
      .catch(this.onPaginateByIdError);
    getById(this.props.location.state.userId)
      .then(this.onGetByIdSuccess)
      .catch(this.onGetByIdError);
    getType("CertificateTypes")
      .then(this.onGetCertificateTypeSuccess)
      .catch(this.onGetCertificateTypeError);
    getType("DaysOfWeek")
      .then(this.onGetDaysSuccess)
      .catch(this.onGetDaysError);
  }

  onPaginateByIdSuccess = response => {
    this.setState(prevState => {
      return {
        ...prevState,
        providerSchedule: response.item.pagedItems,
      };
    });
  };

  onPaginateByIdError = response => {
    return response;
  };

  onGetByIdSuccess = response => {
    this.setState(prevState => {
      return {
        ...prevState,
        providerEducation: response.items,
      };
    });
  };

  onGetByIdError = response => {
    return response;
  };

  onGetCertificateTypeSuccess = response => {
    this.setState(prevState => {
      return {
        ...prevState,
        certificateTypes: response.items,
      };
    });
  };

  onGetCertificateTypeError = response => {
    return response;
  };

  onGetDaysSuccess = response => {
    this.setState(prevState => {
      return {
        ...prevState,
        daysOfWeek: response.items,
      };
    });
  };

  onGetDaysError = response => {
    return response;
  };

  render() {
    return (
      <>
        <div style={{ backgroundColor: "inherit" }}>
          <Row className="">
            <Col md="6" lg="6" xl="5">
              <Card style={{ borderRadius: "25px", height: "100%" }}>
                <img
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "25px",
                  }}
                  src={this.props.location.state.avatarUrl}
                  alt="Profile"
                />
                <CardBody>
                  <Row className="mb-4">
                    <Col style={{ textAlign: "center" }}>
                      <h1 className="display-4">
                        {this.props.location.state.firstName}{" "}
                        {this.props.location.state.lastName}
                      </h1>
                      <Row className="justify-content-center">
                        {this.state.certificateTypes.length > 0 &&
                        this.state.daysOfWeek.length > 0 ? (
                          <button type="button" className="btn btn-primary">
                            <PDFDownloadLink
                              document={
                                <ProviderDetailPdf
                                  providerAvailability={
                                    this.state.providerSchedule
                                  }
                                  certificateTypes={this.state.certificateTypes}
                                  daysOfWeek={this.state.daysOfWeek}
                                  providerEducation={
                                    this.state.providerEducation
                                  }
                                  pdfData={this.props.location.state}
                                />
                              }
                              fileName={`Provider_${this.props.location.state.userId}_${this.props.location.state.firstName}${this.props.location.state.lastName}_Details`}
                              style={{
                                padding: "10px",
                                color: "#ffffff",
                              }}
                            >
                              {({ loading }) =>
                                loading
                                  ? "Loading document..."
                                  : `Download ${this.props.location.state.firstName}'s Details`
                              }
                            </PDFDownloadLink>
                          </button>
                        ) : (
                          <span>
                            <small>
                              Sorry, There seems to be an error getting the PDF.
                              Please try reloading the page
                            </small>
                          </span>
                        )}
                      </Row>
                      <span>
                        <small>Download this providers details as a PDF</small>
                      </span>
                    </Col>
                  </Row>
                  <Types {...this.props} />
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card style={{ borderRadius: "25px", height: "100%" }}>
                <CardBody>
                  <DetailNavigation
                    {...this.props}
                    providerSchedule={this.state.providerSchedule}
                    providerEducation={this.state.providerEducation}
                    certificateTypes={this.state.certificateTypes}
                    daysOfWeek={this.state.daysOfWeek}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

ProviderDetails.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      userId: PropTypes.number,
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      price: PropTypes.number,
    }),
  }),
  currentUser: PropTypes.shape({
    userId: PropTypes.number,
  }),
};

export default ProviderDetails;
