import React, { PureComponent } from "react";
import { Row, Col, Card, Button } from "reactstrap";
import ReactRouterPropTypes from "react-router-prop-types";
import ProviderCard from "./ProviderCard";
import CheckBox from "./Checkbox";
import { getAllLookUps } from "../../services/lookUpService";
import { getProvidersFiltered } from "./../../services/providerService";
import { Field, Form, Formik } from "formik";
import { zipValidationSchema } from "./ZipValidationSchema";
import { getLatLongByZip } from "./../../services/locationService";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./ProviderFilter.css";
import debug from "sabio-debug";
const _logger = debug.extend("Providers");

class ProviderFilter extends PureComponent {
  state = {
    providers: [],
    mappedProviders: [],
    currentPage: 1,
    pageSize: 6,
    totalProviders: 0,
    json: {
      maxPrice: 350,
      expertiseIds: [],
      concernIds: [],
      licenseIds: [],
      helperNeedIds: [],
      certificationIds: [],
    },
    search: { zip: "", radius: "" },
    latitude: 28.613459,
    longitude: 4.11162,
    radius: 10000000,
    expertise: [],
    concerns: [],
    certifications: [],
    licenses: [],
    helpNeeds: [],
    languages: [],
    mappedExpertise: [],
    mappedHelpNeeds: [],
    mappedLicenses: [],
    mappedCertifications: [],
    mappedConcerns: [],
    toggle: {
      expertiseToggle: true,
      helpNeedsToggle: true,
      licensesToggle: true,
      certificationsToggle: true,
      concernsToggle: true,
      priceToggle: true,
      optionsToggle: true,
      zipToggle: true,
      initialSearch: true,
    },
    showFilters: false,
  };

  componentDidMount() {
    this.requestLookUps();
    // this.requestProviders(this.state.latitude, this.state.longitude); //remove this once location service working
  }

  submitInitialZip = (values) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        toggle: { ...prevState.toggle, initialSearch: false },
      };
    });
    this.submitZip(values);
  };

  submitZip = (search) => {
    getLatLongByZip(search.zip)
      .then(this.onGetLatLongSuccess)
      .catch(this.onGetLatLongError);
    this.setRadius(search.radius);
  };

  setRadius = (radiusMiles) => {
    const radiusKm = Math.ceil(Number(radiusMiles) * 1609.344);
    this.setState((prevState) => {
      return { ...prevState, radius: radiusKm };
    });
  };
  onGetLatLongSuccess = (response) => {
    _logger("Success Getting location", response);
    this.requestProviders(response.item.latitude, response.item.longitude);
    this.setState((prevState) => {
      return {
        ...prevState,
        latitude: response.item.latitude,
        longitude: response.item.longitude,
      };
    });
  };

  onGetLatLongError = (response) => {
    _logger("Error Getting location", response);
    //implement an error popup
  };

  requestLookUps = () => {
    _logger("requesting lookups");
    getAllLookUps()
      .then(this.onSuccessGetLookUps)
      .catch(this.onErrorGetLookUps);
  };

  onSuccessGetLookUps = (response) => {
    _logger("Success Getting lookups", response.item);
    const concernTypes = this.arrayPrep(
      response.item.concernTypes,
      "concerns",
      "mappedConcerns",
      "concernIds"
    );
    const certificationTypes = this.arrayPrep(
      response.item.certificateTypes,
      "certifications",
      "mappedCertifications",
      "certificationIds"
    );
    const licenseTypes = this.arrayPrep(
      response.item.licenseTypes,
      "licenses",
      "mappedLicenses",
      "licenseIds"
    );
    const helpNeedsTypes = this.arrayPrep(
      response.item.helpNeedTypes,
      "helpNeeds",
      "mappedHelpNeeds",
      "helperNeedIds"
    );
    const expertiseTypes = this.arrayPrep(
      response.item.expertiseTypes,
      "expertise",
      "mappedExpertise",
      "expertiseIds"
    );
    //const languagesTypes = response.item.languages;

    this.setState((...prevState) => {
      return {
        ...prevState,
        concerns: concernTypes,
        licenses: licenseTypes,
        certifications: certificationTypes,
        helpNeeds: helpNeedsTypes,
        expertise: expertiseTypes,
        mappedExpertise: expertiseTypes.map(this.mapOneCheckBox),
        mappedHelpNeeds: helpNeedsTypes.map(this.mapOneCheckBox),
        mappedLicenses: licenseTypes.map(this.mapOneCheckBox),
        mappedCertifications: certificationTypes.map(this.mapOneCheckBox),
        mappedConcerns: concernTypes.map(this.mapOneCheckBox),
      };
    });
  };

  arrayPrep = (array, parentString, mapString, idArrString) => {
    for (let index = 0; index < array.length; index++) {
      const currentObj = array[index];
      currentObj.isChecked = false;
      currentObj.parent = parentString;
      currentObj.map = mapString;
      currentObj.idArrName = idArrString;
    }
    return array;
  };

  onErrorGetLookUps = (response) => {
    _logger("Error Getting lookups", response);
  };

  getCurrentSeekerLocation = () => {
    //getByGeo().then(this.onGetLocationSuccess).then(this.onGetLocationError);
  };

  requestProviders = (latitude, longitude) => {
    let pageIndex = this.state.currentPage - 1;
    getProvidersFiltered(
      pageIndex,
      this.state.pageSize,
      JSON.stringify(this.state.json),
      latitude,
      longitude,
      this.state.radius
    )
      .then(this.onSuccessGetProviders)
      .catch(this.onGetProvidersError);
  };

  onGetProvidersError = (response) => {
    _logger("Error Getting providers", response);
    this.setState((prevState) => {
      return {
        ...prevState,
        Providers: [],
        totalProviders: 0,
        mappedProviders: [],
      };
    });
  };

  onSuccessGetProviders = (response) => {
    _logger("Success Getting Providers", response);
    this.setState((prevState) => {
      return {
        ...prevState,
        providers: response.item.pagedItems,
        totalProviders: response.item.totalCount,
        mappedProviders: response.item.pagedItems.map(this.renderOneProvider),
      };
    });
  };

  renderOneProvider = (AProvider) => (
    <ProviderCard
      isToggled={this.state.toggle.optionsToggle}
      provider={AProvider}
      key={AProvider.userId}
      onSeeMore={this.handleSeeMore}
    ></ProviderCard>
  );

  handleSeeMore = (provider) => {
    _logger("See More!", provider);
    this.props.history.push(`/provider/${provider.userId}/details`, provider);
  };

  onPaginationChange = (pageSelected, pagesize) => {
    _logger("Current:", pageSelected, "pagesize:", pagesize);
    this.setState(
      (prevState) => {
        return { ...prevState, currentPage: pageSelected };
      },
      () => this.requestProviders(this.state.latitude, this.state.longitude)
    );
  };

  pluck = (array, key) => {
    return array.map((obj) => obj[key]);
  };

  mapOneCheckBox = (item) => {
    return (
      <CheckBox item={item} key={item.id} handleChange={this.handleChange} />
    );
  };

  handleChange = (e, parent, mapName, idArrName) => {
    _logger("event", e.target.name, "parent", parent);
    const attribute = this.state[parent];
    let list = [...attribute];
    list.find((item) => item.name === e.target.name).isChecked =
      e.target.checked;
    const array = [...list];
    const newIdArray = this.createIdArray(array);

    this.setState(
      (prevState) => {
        return {
          ...prevState,
          json: { ...prevState.json, [idArrName]: newIdArray },
          [parent]: list,
          [mapName]: list.map(this.mapOneCheckBox),
        };
      },
      () => this.requestProviders(this.state.latitude, this.state.longitude)
    );
  };

  createIdArray = (array) => {
    const trueArray = array.filter((obj) => obj.isChecked === true);
    const idsArray = this.pluck(trueArray, "id");
    return idsArray;
  };

  onToggle = (event) => {
    const name = event.target.name;
    const currentToggle = this.state.toggle[name];
    _logger(event.target.name, "currentToggle", currentToggle);
    let oppositeToggle = !currentToggle;
    let newPageSize = 6;

    if (name === "optionsToggle" && oppositeToggle === false) {
      newPageSize = 8;
    }

    this.setState(
      (prevState) => {
        const updatedToggle = {
          ...prevState.toggle,
        };
        updatedToggle[name] = oppositeToggle;
        return { ...prevState, pageSize: newPageSize, toggle: updatedToggle };
      },
      () => this.requestProviders(this.state.latitude, this.state.longitude)
    );
  };

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(
      (prevState) => {
        const updatedFormData = {
          ...prevState.json,
        };
        updatedFormData[name] = value;

        return { json: updatedFormData };
      },
      () => this.requestProviders(this.state.latitude, this.state.longitude)
    );
  };

  onShowHidePanelClicked = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  //
  render() {
    _logger("provider Filter render");
    return (
      <React.Fragment>
        <div className="container-main container-fluid">
          <div
            className={
              this.state.toggle.initialSearch === true
                ? "initial-form card"
                : "d-none"
            }
          >
            <h3 style={{ color: "#5e72e4", marginBottom: "20px" }}>
              Search For Providers
            </h3>
            <Formik
              className="zip-form"
              enableReinitialize={true}
              validationSchema={zipValidationSchema}
              initialValues={this.state.search}
              onSubmit={(values, { resetForm }) => {
                _logger("values:", values);
                this.submitInitialZip(values);
                resetForm({
                  zip: "",
                  radius: "",
                });
              }}
            >
              {(props) => (
                <Form>
                  {props.errors.zip && (
                    <div id="feedback">{props.errors.zip}</div>
                  )}
                  <Field
                    name="zip"
                    type="text"
                    className="form-control zip-field"
                    placeholder="Zip Code"
                  />
                  {props.errors.radius && (
                    <div id="feedback">{props.errors.radius}</div>
                  )}
                  <Field
                    name="radius"
                    type="text"
                    className="form-control radius-field"
                    placeholder="Radius In Miles"
                  />
                  <button
                    type="submit"
                    className="submit-button btn-lg btn btn-primary zip-submit-side"
                  >
                    Search
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div
            className={
              this.state.toggle.initialSearch === true ? "d-none" : "row"
            }
          >
            <div className="email-app">
              <div
                className={
                  this.state.showFilters
                    ? "left-part-filter show-panel"
                    : "left-part-filter"
                }
              >
                <div
                  className={
                    this.state.toggle.optionsToggle === false
                      ? "d-none"
                      : "filter-options-container"
                  }
                >
                  <Card>
                    <div className="btn-group">
                      <Button
                        color="secondary"
                        type="Button"
                        className="btn btn-primary btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        name="zipToggle"
                        onClick={this.onToggle}
                      >
                        Search By ZipCode
                      </Button>
                    </div>
                    <div
                      className={
                        this.state.toggle.zipToggle === true
                          ? "mb-3 zip-div"
                          : "d-none"
                      }
                    >
                      <Formik
                        enableReinitialize={true}
                        validationSchema={zipValidationSchema}
                        initialValues={this.state.search}
                        onSubmit={(values, { resetForm }) => {
                          _logger("values:", values);
                          this.submitZip(values);
                          resetForm({
                            zip: "",
                            radius: "",
                          });
                        }}
                      >
                        {(props) => (
                          <Form className="zip-form">
                            {props.errors.zip && (
                              <div id="feedback">{props.errors.zip}</div>
                            )}
                            <Field
                              name="zip"
                              type="text"
                              className="form-control zip-field"
                              placeholder="Zip Code"
                            />
                            {props.errors.radius && (
                              <div id="feedback">{props.errors.radius}</div>
                            )}
                            <Field
                              name="radius"
                              type="text"
                              className="form-control radius-field"
                              placeholder="Radius In Miles"
                            />
                            <button
                              type="submit"
                              className="submit-button btn btn-primary zip-submit-side"
                            >
                              Search
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>

                    <div className="btn-group">
                      <Button
                        color="secondary"
                        type="button"
                        className="btn btn-primary btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        name="priceToggle"
                        onClick={this.onToggle}
                      >
                        Max Price $/Hr
                      </Button>
                    </div>
                    <div
                      style={{ width: "80%", margin: "auto" }}
                      className={
                        this.state.toggle.priceToggle === true
                          ? "input-group mb-3"
                          : "d-none"
                      }
                    >
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        name="maxPrice"
                        width="20"
                        type="number"
                        value={this.state.json.maxPrice}
                        onChange={this.changeHandler}
                        className="form-control number-input"
                        aria-label="Amount (to the nearest dollar)"
                      />
                    </div>
                    <div className="btn-group">
                      <Button
                        color="secondary"
                        type="button"
                        className="btn btn-primary btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        name="concernsToggle"
                        onClick={this.onToggle}
                      >
                        Senior Care Services
                      </Button>
                    </div>
                    <div
                      className={
                        this.state.toggle.concernsToggle === true
                          ? "checkbox-div"
                          : "d-none"
                      }
                    >
                      {this.state.mappedConcerns}
                    </div>
                    <div className="btn-group">
                      <Button
                        color="secondary"
                        type="button"
                        className="btn btn-primary btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        name="helpNeedsToggle"
                        onClick={this.onToggle}
                      >
                        Relevant Info
                      </Button>
                    </div>
                    <div
                      className={
                        this.state.toggle.helpNeedsToggle === true
                          ? "checkbox-div"
                          : "d-none"
                      }
                    >
                      {this.state.mappedHelpNeeds}
                    </div>
                    <div className="btn-group">
                      <Button
                        color="secondary"
                        type="button"
                        className="btn btn-primary btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        name="certificationsToggle"
                        onClick={this.onToggle}
                      >
                        Certifications
                      </Button>
                    </div>
                    <div
                      className={
                        this.state.toggle.certificationsToggle === true
                          ? "checkbox-div"
                          : "d-none"
                      }
                    >
                      {this.state.mappedCertifications}
                    </div>
                    <div className="btn-group">
                      <Button
                        color="secondary"
                        type="button"
                        className="btn btn-primary btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        name="expertiseToggle"
                        onClick={this.onToggle}
                      >
                        Expertise
                      </Button>
                    </div>
                    <div
                      className={
                        this.state.toggle.expertiseToggle === true
                          ? "checkbox-div"
                          : "d-none"
                      }
                    >
                      {this.state.mappedExpertise}
                    </div>

                    <div className="btn-group">
                      <Button
                        color="secondary"
                        type="button"
                        className="btn btn-primary btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        name="licensesToggle"
                        onClick={this.onToggle}
                      >
                        Licenses
                      </Button>
                    </div>
                    <div
                      className={
                        this.state.toggle.licensesToggle === true
                          ? "checkbox-div"
                          : "d-none"
                      }
                    >
                      {this.state.mappedLicenses}
                    </div>
                  </Card>
                </div>
              </div>

              <div className="right-part-filter">
                <div>
                  <span
                    className={
                      this.state.showFilters
                        ? "bg-primary show-left-part-filter text-white d-block d-lg-none left-part-open-filter"
                        : "bg-primary show-left-part-filter text-white d-block d-lg-none"
                    }
                    onClick={this.onShowHidePanelClicked}
                  >
                    <i
                      className={
                        this.state.showFilters
                          ? "fas fa-chevron-left"
                          : "fas fa-chevron-right"
                      }
                    />
                  </span>
                  <div
                    className={
                      this.state.toggle.optionsToggle === true
                        ? "providers-container"
                        : "providers-container"
                    }
                  >
                    <Row>{this.state.mappedProviders}</Row>
                  </div>
                  <Row>
                    <Col>
                      <Pagination
                        className="mx-auto"
                        style={{ display: "inline-block" }}
                        current={this.state.currentPage}
                        pageSize={this.state.pageSize}
                        total={this.state.totalProviders}
                        onChange={this.onPaginationChange}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProviderFilter;

ProviderFilter.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};
