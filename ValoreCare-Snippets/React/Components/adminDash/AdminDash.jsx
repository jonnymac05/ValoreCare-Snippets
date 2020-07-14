import React, { PureComponent } from "react";
import logger from "sabio-debug";
import { getAdminData } from "../../services/adminDashService";
import LatestUser from "./LatestUser";
import { Row, Col } from "reactstrap";
import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";
import "./AdminDash.css";
import { getTransactionsList } from "../../services/connectService";
const _logger = logger.extend("AdminDash");

class AdminDash extends PureComponent {
  state = {
    paidSubscriptions: 0,
    payingSeekersTotal: 0,
    totalUsers: {
      admins: 0,
      providers: 0,
      seekers: 0,
      bloggers: 0,
    },
    // mappedLastUsers: [],
    mappedLastProviders: [],
    mappedLastSeekers: [],
    mappedLineUsersMonth: [],
    mappedLineProvidersMonth: [],
    mappedLineSeekersMonth: [],
    currentChartUser: "Users",
    currentChartDays: "Month",
    currentBarUser: "Users",
    currentBarDays: "Month",
    currentGraph: "Bar",
    refundData: { sum: 0, lowest: 0, highest: 0, average: 0, quantity: 0 },
    subscriptionData: {
      sum: 0,
      lowest: 0,
      highest: 0,
      average: 0,
      quantity: 0,
    },
    appointmentData: { sum: 0, lowest: 0, highest: 0, average: 0, quantity: 0 },
    backgroundCheckData: {
      sum: 0,
      lowest: 0,
      highest: 0,
      average: 0,
      quantity: 0,
    },
    eventData: { sum: 0, lowest: 0, highest: 0, average: 0, quantity: 0 },
  };

  componentDidMount() {
    getAdminData()
      .then(this.onSuccessGetAdminData)
      .catch(this.onErrorGetAdminData);
    getTransactionsList()
      .then(this.onSuccessGetStripeData)
      .catch(this.onErrorGetStripeData);
    //replace this with the call to get the data
  }

  onErrorGetStripeData = () => {
    _logger("error getting stripe data");
  };

  onSuccessGetStripeData = (response) => {
    _logger("success getting stripe data", response.item);
    const stripeArray = response.item;
    const refundArray = stripeArray.filter(
      (obj) => obj.description === "REFUND FOR CHARGE" || obj.amount < 0
    );
    const subscriptionArray = stripeArray.filter(
      (obj) => obj.description === "Subscription creation"
    );
    const appointmentArray = stripeArray.filter(
      (obj) =>
        (obj.description === "Appointment creation" && obj.amount > 0) ||
        (obj.description === null && obj.amount > 0)
    );
    const backgroundCheckArray = stripeArray.filter(
      (obj) => obj.description === "Evident Id Background Check"
    );
    const eventArray = stripeArray.filter(
      (obj) =>
        obj.amount > 0 &&
        (obj.description !== "Evident Id Background Check" ||
          obj.description !== null ||
          obj.description !== "Appointment creation" ||
          obj.description !== "Subscription creation" ||
          obj.description !== "REFUND FOR CHARGE")
    );
    const refundSummary = this.sumTotal(refundArray);
    const subscriptionSummary = this.sumTotal(subscriptionArray);
    const appointmentSummary = this.sumTotal(appointmentArray);
    const backgroundCheckSummary = this.sumTotal(backgroundCheckArray);
    const eventSummary = this.sumTotal(eventArray);

    this.setState((prevState) => {
      return {
        ...prevState,
        refundData: refundSummary,
        subscriptionData: subscriptionSummary,
        appointmentData: appointmentSummary,
        backgroundCheckData: backgroundCheckSummary,
        eventData: eventSummary,
      };
    });
  };

  sumTotal = (arrayOfObjs) => {
    let sum = 0;
    let lowest = null;
    let highest = null;

    if (arrayOfObjs === null || arrayOfObjs[0] === null) {
      return { sum: 0, lowest: 0, highest: 0, average: 0, quantity: 0 };
    } else {
      for (let index = 0; index < arrayOfObjs.length; index++) {
        const currentObj = arrayOfObjs[index];
        if (currentObj.amount) {
          sum = sum + currentObj.amount;
          if (lowest === null || currentObj.amount < lowest) {
            lowest = currentObj.amount;
          }
          if (highest === null || currentObj.amount > highest) {
            highest = currentObj.amount;
          }
        }
      }
      const summary = {
        sum: sum / 100,
        lowest: lowest / 100,
        highest: highest / 100,
        average: Math.round(sum / arrayOfObjs.length) / 100,
        quantity: arrayOfObjs.length,
      };
      return summary;
    }
  };

  onSuccessGetAdminData = (response) => {
    _logger("success getting admin data", response);
    let totalUsersMonth = null;
    let totalProvidersMonth = null;
    let totalSeekersMonth = null;
    let totalUsersWeek = null;
    let totalProvidersWeek = null;
    let totalSeekersWeek = null;
    // let mappedRecentUsers = null;
    let mappedRecentProviders = null;
    let mappedRecentSeekers = null;
    let barUsersMonth = null;
    let barSeekersMonth = null;
    let barProvidersMonth = null;
    let barUsersWeek = null;
    let barSeekersWeek = null;
    let barProvidersWeek = null;

    if (response.item.usersThisMonth === null) {
      totalUsersMonth = this.defaultNullResponse();
      barUsersMonth = this.defaultNullResponse();
    } else {
      totalUsersMonth = this.mapLineGraph(
        response.item.usersThisMonth,
        "User Sign Ups Past 31 Days",
        "Users"
      );
      barUsersMonth = this.mapBarGraph(
        response.item.usersThisMonth,
        "User Sign Ups Past 31 Days",
        "Users"
      );
    }
    if (response.item.providersThisMonth === null) {
      totalProvidersMonth = this.defaultNullResponse();
      barProvidersMonth = this.defaultNullResponse();
    } else {
      totalProvidersMonth = this.mapLineGraph(
        response.item.providersThisMonth,
        "Provider Sign Ups Past 31 Days",
        "Providers"
      );
      barProvidersMonth = this.mapBarGraph(
        response.item.providersThisMonth,
        "Provider Sign Ups Past 31 Days",
        "Providers"
      );
    }
    if (response.item.seekersThisMonth === null) {
      totalSeekersMonth = this.defaultNullResponse();
      barSeekersMonth = this.defaultNullResponse();
    } else {
      totalSeekersMonth = this.mapLineGraph(
        response.item.seekersThisMonth,
        "Seeker Sign Ups Past 31 Days",
        "Seekers"
      );
      barSeekersMonth = this.mapBarGraph(
        response.item.seekersThisMonth,
        "Seeker Sign Ups Past 31 Days",
        "Seekers"
      );
    }
    if (response.item.usersThisWeek === null) {
      barUsersWeek = this.defaultNullResponse();
      totalUsersWeek = this.defaultNullResponse();
    } else {
      totalUsersWeek = this.mapLineGraph(
        response.item.usersThisWeek,
        "User Sign Ups Past 7 Days",
        "Users"
      );
      barUsersWeek = this.mapBarGraph(
        response.item.usersThisWeek,
        "User Sign Ups Past 7 Days",
        "Users"
      );
    }
    if (response.item.providersThisWeek === null) {
      totalProvidersWeek = this.defaultNullResponse();
      barProvidersWeek = this.defaultNullResponse();
    } else {
      totalProvidersWeek = this.mapLineGraph(
        response.item.providersThisWeek,
        "Provider Sign Ups Past 7 Days",
        "Providers"
      );
      barProvidersWeek = this.mapBarGraph(
        response.item.providersThisWeek,
        "Provider Sign Ups Past 7 Days",
        "Providers"
      );
    }
    if (response.item.seekersThisWeek === null) {
      totalSeekersWeek = this.defaultNullResponse();
      barSeekersWeek = this.defaultNullResponse();
    } else {
      totalSeekersWeek = this.mapLineGraph(
        response.item.seekersThisWeek,
        "Seeker Sign Ups Past 7 Days",
        "Seekers"
      );
      barSeekersWeek = this.mapBarGraph(
        response.item.seekersThisWeek,
        "Seeker Sign Ups Past 7 Days",
        "Seekers"
      );
    }

    // if (response.item.lastUsers === null) {
    //   mappedRecentUsers = this.defaultNullResponse();
    // } else {
    //   mappedRecentUsers = response.item.lastUsers.map(this.mapPicAndName);
    // }

    if (response.item.lastProviders === null) {
      mappedRecentProviders = this.defaultNullResponse();
    } else {
      mappedRecentProviders = response.item.lastProviders.map(
        this.mapPicAndName
      );
    }

    if (response.item.lastSeekers === null) {
      mappedRecentSeekers = this.defaultNullResponse();
    } else {
      mappedRecentSeekers = response.item.lastSeekers.map(this.mapPicAndName);
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        paidSubscriptions: response.item.activeSubscriptions,
        payingSeekers: response.item.payingSeekers,
        totalUsers: response.item.totalUsers,
        // mappedLastUsers: mappedRecentUsers,
        mappedLastProviders: mappedRecentProviders,
        mappedLastSeekers: mappedRecentSeekers,
        mappedLineUsersMonth: totalUsersMonth,
        mappedLineProvidersMonth: totalProvidersMonth,
        mappedLineSeekersMonth: totalSeekersMonth,
        mappedLineUsersWeek: totalUsersWeek,
        mappedLineProvidersWeek: totalProvidersWeek,
        mappedLineSeekersWeek: totalSeekersWeek,
        mappedBarUsersMonth: barUsersMonth,
        mappedBarProvidersMonth: barProvidersMonth,
        mappedBarSeekersMonth: barSeekersMonth,
        mappedBarUsersWeek: barUsersWeek,
        mappedBarProvidersWeek: barProvidersWeek,
        mappedBarSeekersWeek: barSeekersWeek,
        mappedPieUsers: this.mapPieChart(response.item.totalUsers),
      };
    });
  };

  mapPicAndName = (user) => {
    return <LatestUser key={user.userId} user={user} />;
  };

  mapLineGraph = (usersThisMonth, title, type) => {
    return (
      <LineGraph usersThisMonth={usersThisMonth} title={title} type={type} />
    );
  };

  mapBarGraph = (usersThisMonth, title, type) => {
    return (
      <BarGraph usersThisMonth={usersThisMonth} title={title} type={type} />
    );
  };

  mapPieChart = (totalUsers) => {
    return <PieChart className="pie" totalUsers={totalUsers} />;
  };

  defaultNullResponse = () => {
    return (
      <div className="card">
        <h2> None During This Period</h2>
      </div>
    );
  };

  onErrorGetAdminData = (error) => {
    _logger("error getting admin data", error);
  };

  toggleBarToUsers = () => {
    this.toggleCurrentBarUser("Users");
  };
  toggleBarToProviders = () => {
    this.toggleCurrentBarUser("Providers");
  };
  toggleBarToSeekers = () => {
    this.toggleCurrentBarUser("Seekers");
  };

  toggleBarToWeek = () => {
    this.toggleCurrentBarDays("Week");
  };

  toggleBarToMonth = () => {
    this.toggleCurrentBarDays("Month");
  };

  toggleCurrentBarUser = (name) => {
    this.setState((prevState) => {
      return { ...prevState, currentBarUser: name };
    });
  };

  toggleToBar = () => {
    this.toggleCurrentGraph("Bar");
  };

  toggleToLine = () => {
    this.toggleCurrentGraph("Line");
  };

  toggleToPie = () => {
    this.toggleCurrentGraph("Pie");
  };

  toggleCurrentGraph = (name) => {
    this.setState((prevState) => {
      return { ...prevState, currentGraph: name };
    });
  };

  toggleCurrentBarDays = (name) => {
    this.setState((prevState) => {
      return { ...prevState, currentBarDays: name };
    });
  };

  toggleToUsers = () => {
    this.toggleCurrentChartUser("Users");
  };
  toggleToProviders = () => {
    this.toggleCurrentChartUser("Providers");
  };
  toggleToSeekers = () => {
    this.toggleCurrentChartUser("Seekers");
  };

  toggleToWeek = () => {
    this.toggleCurrentChartDays("Week");
  };

  toggleToMonth = () => {
    this.toggleCurrentChartDays("Month");
  };

  toggleCurrentChartUser = (name) => {
    this.setState((prevState) => {
      return { ...prevState, currentChartUser: name };
    });
  };

  toggleCurrentChartDays = (name) => {
    this.setState((prevState) => {
      return { ...prevState, currentChartDays: name };
    });
  };

  render() {
    _logger("dash render");
    return (
      <React.Fragment>
        <div className="container-main">
          <Row>
            <Col lg="12">
              <div className="bg-cyan card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <h4 className="text-white font-medium mb-0">
                      Total Current Users
                    </h4>
                  </div>
                  <div className="text-center text-white mt-4 row">
                    <div className="col-2">
                      <span className="font-16 d-block">Admin</span>
                      <span className="font-medium">
                        {this.state.totalUsers.admins}
                      </span>
                    </div>
                    <div className="col-2">
                      <span className="font-16 d-block">Providers</span>
                      <span className="font-medium">
                        {this.state.totalUsers.providers}
                      </span>
                    </div>
                    <div className="col-2">
                      <span className="font-16 d-block">Seekers</span>
                      <span className="font-medium">
                        {this.state.totalUsers.seekers}
                      </span>
                    </div>
                    <div className="col-3">
                      <span className="font-16 d-block">
                        Active Subscriptions
                      </span>
                      <span className="font-medium">
                        {this.state.paidSubscriptions}
                      </span>
                    </div>
                    <div className="col-3">
                      <span className="font-16 d-block">Paying Seekers</span>
                      <span className="font-medium">
                        {this.state.payingSeekers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="4">
              <Row>
                <Col xs="12">
                  <div
                    style={{ backgroundColor: "rgb(155, 69, 191)" }}
                    className="card"
                  >
                    <div className="card-body">
                      <h4 className="text-white font-medium mb-0">
                        Latest Sign Ups
                      </h4>
                    </div>

                    <table className="no-wrap v-middle table">
                      <thead>
                        <tr className="border-0">
                          <th className="border-0 text-white font-16">
                            Providers
                          </th>
                          <th className="border-0 text-white font-16">
                            Seekers
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {this.state.mappedLastProviders[0]}
                          {this.state.mappedLastSeekers[0]}
                        </tr>
                        <tr>
                          {this.state.mappedLastProviders[1]}
                          {this.state.mappedLastSeekers[1]}
                        </tr>
                        <tr>
                          {this.state.mappedLastProviders[2]}
                          {this.state.mappedLastSeekers[2]}
                        </tr>
                        <tr>
                          {this.state.mappedLastProviders[3]}
                          {this.state.mappedLastSeekers[3]}
                        </tr>
                        <tr>
                          {this.state.mappedLastProviders[4]}
                          {this.state.mappedLastSeekers[4]}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg="8">
              <div
                style={{ backgroundColor: "rgb(85, 194, 115)" }}
                className="card"
              >
                <div className="card-body">
                  <h3 className="text-white font-medium mb-0">
                    Revenue Past 31 Days
                  </h3>
                </div>

                <table className="no-wrap v-middle table">
                  <thead>
                    <tr className="border-0">
                      <th className="border-0 text-white font-14"></th>
                      <th className="border-0 text-white font-14">
                        Appointments
                      </th>
                      <th className="border-0 text-white font-14">
                        Subscriptions
                      </th>
                      <th className="border-0 text-white font-14">Events</th>
                      <th className="border-0 text-white font-14">Refunds</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p className="mb-0 font-14 font-medium text-white">
                          Transactions
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          {this.state.appointmentData.quantity
                            ? this.state.appointmentData.quantity
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          {this.state.subscriptionData.quantity
                            ? this.state.subscriptionData.quantity
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          {this.state.eventData.quantity
                            ? this.state.eventData.quantity
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          {this.state.refundData.quantity
                            ? this.state.refundData.quantity
                            : 0}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="mb-0 font-14 font-medium text-white">
                          Avg Revenue Per
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.appointmentData.average
                            ? this.state.appointmentData.average
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.subscriptionData.average
                            ? this.state.subscriptionData.average
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.eventData.average
                            ? this.state.eventData.average
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          -$
                          {this.state.refundData.average
                            ? this.state.refundData.average * -1
                            : 0}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="mb-0 font-14 font-medium text-white">
                          Lowest Revenue Per
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.appointmentData.lowest
                            ? this.state.appointmentData.lowest
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.subscriptionData.lowest
                            ? this.state.subscriptionData.lowest
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.eventData.lowest
                            ? this.state.eventData.lowest
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          -$
                          {this.state.refundData.highest
                            ? this.state.refundData.highest * -1
                            : 0}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="mb-0 font-14 font-medium text-white">
                          Highest Revenue Per
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.appointmentData.highest
                            ? this.state.appointmentData.highest
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.subscriptionData.highest
                            ? this.state.subscriptionData.highest
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.eventData.highest
                            ? this.state.eventData.highest
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          -$
                          {this.state.refundData.lowest
                            ? this.state.refundData.lowest * -1
                            : 0}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="mb-0 font-14 font-medium text-white">
                          Revenue
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.appointmentData.sum
                            ? this.state.appointmentData.sum
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.subscriptionData.sum
                            ? this.state.subscriptionData.sum
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          $
                          {this.state.eventData.sum
                            ? this.state.eventData.sum
                            : 0}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 font-17 font-medium text-white">
                          -$
                          {this.state.refundData.sum
                            ? this.state.refundData.sum * -1
                            : 0}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="mb-4 font-20 font-medium text-white">
                          Total Revenue
                        </p>
                      </td>
                      <td>
                        <p className="mb-4 font-20 font-medium text-white">
                          $
                          {this.state.appointmentData.sum &&
                          this.state.subscriptionData.sum &&
                          this.state.eventData.sum &&
                          this.state.refundData.sum
                            ? Math.round(
                                100 *
                                  (this.state.appointmentData.sum +
                                    this.state.subscriptionData.sum +
                                    this.state.eventData.sum +
                                    this.state.refundData.sum)
                              ) / 100
                            : "Missing Numbers"}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
            <Col lg="12">
              <Row>
                <Col
                  xs="6"
                  className="btn-group-lg"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    name="Users"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.toggleBarToUsers}
                  >
                    All Users
                  </button>
                  <button
                    name="Providers"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.toggleBarToProviders}
                  >
                    Providers
                  </button>
                  <button
                    name="Seekers"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.toggleBarToSeekers}
                  >
                    Seekers
                  </button>
                </Col>
                <Col
                  xs="6"
                  className="btn-group-lg"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    name="Week"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.toggleBarToWeek}
                  >
                    Last 7 Days
                  </button>
                  <button
                    name="Month"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.toggleBarToMonth}
                  >
                    Last 31 Days
                  </button>
                </Col>
              </Row>
              <Row>
                <Col xs="1">
                  <div>
                    <button
                      name="Bar"
                      type="button"
                      className="btn btn-primary sideways btn-lg"
                      onClick={this.toggleToBar}
                    >
                      Bar Graph
                    </button>
                  </div>
                  <div>
                    <button
                      name="Line"
                      type="button"
                      className="btn btn-primary sideways btn-lg"
                      onClick={this.toggleToLine}
                    >
                      Line Graph
                    </button>
                  </div>
                  <div>
                    <button
                      name="Pie"
                      type="button"
                      className="btn btn-primary sideways btn-lg"
                      onClick={this.toggleToPie}
                    >
                      Pie Graph
                    </button>
                  </div>
                </Col>
                <Col xs="11">
                  <div
                    className={
                      this.state.currentBarUser === "Providers" &&
                      this.state.currentBarDays === "Month" &&
                      this.state.currentGraph === "Bar"
                        ? "bar"
                        : "d-none"
                    }
                  >
                    {this.state.mappedBarProvidersMonth}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Seekers" &&
                      this.state.currentBarDays === "Month" &&
                      this.state.currentGraph === "Bar"
                        ? "bar"
                        : "d-none"
                    }
                  >
                    {this.state.mappedBarSeekersMonth}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Users" &&
                      this.state.currentBarDays === "Month" &&
                      this.state.currentGraph === "Bar"
                        ? "bar"
                        : "d-none"
                    }
                  >
                    {this.state.mappedBarUsersMonth}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Users" &&
                      this.state.currentBarDays === "Week" &&
                      this.state.currentGraph === "Bar"
                        ? "bar"
                        : "d-none"
                    }
                  >
                    {this.state.mappedBarUsersWeek}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Providers" &&
                      this.state.currentBarDays === "Week" &&
                      this.state.currentGraph === "Bar"
                        ? "bar"
                        : "d-none"
                    }
                  >
                    {this.state.mappedBarProvidersWeek}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Seekers" &&
                      this.state.currentBarDays === "Week" &&
                      this.state.currentGraph === "Bar"
                        ? "bar"
                        : "d-none"
                    }
                  >
                    {this.state.mappedBarSeekersWeek}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Providers" &&
                      this.state.currentBarDays === "Month" &&
                      this.state.currentGraph === "Line"
                        ? "chart"
                        : "d-none"
                    }
                  >
                    {this.state.mappedLineProvidersMonth}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Seekers" &&
                      this.state.currentBarDays === "Month" &&
                      this.state.currentGraph === "Line"
                        ? "chart"
                        : "d-none"
                    }
                  >
                    {this.state.mappedLineSeekersMonth}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Users" &&
                      this.state.currentBarDays === "Month" &&
                      this.state.currentGraph === "Line"
                        ? "chart"
                        : "d-none"
                    }
                  >
                    {this.state.mappedLineUsersMonth}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Users" &&
                      this.state.currentBarDays === "Week" &&
                      this.state.currentGraph === "Line"
                        ? "chart"
                        : "d-none"
                    }
                  >
                    {this.state.mappedLineUsersWeek}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Providers" &&
                      this.state.currentBarDays === "Week" &&
                      this.state.currentGraph === "Line"
                        ? "chart"
                        : "d-none"
                    }
                  >
                    {this.state.mappedLineProvidersWeek}
                  </div>
                  <div
                    className={
                      this.state.currentBarUser === "Seekers" &&
                      this.state.currentBarDays === "Week" &&
                      this.state.currentGraph === "Line"
                        ? "chart"
                        : "d-none"
                    }
                  >
                    {this.state.mappedLineSeekersWeek}
                  </div>
                  <div
                    className={
                      this.state.currentGraph === "Pie" ? "chart" : "d-none"
                    }
                  >
                    {this.state.mappedPieUsers}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminDash;
