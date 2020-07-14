import React, { PureComponent } from "react";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";

class BarGraph extends PureComponent {
  state = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Total Users",
        fill: true,
        lineTension: 0.01,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81, 56],
      },
    ],
  };

  componentDidMount() {
    this.separateArrays();
  }

  separateArrays = () => {
    const datesWithTime = this.pluck(this.props.usersThisMonth, "date");
    const dates = datesWithTime.map(this.mapOneDate);
    const usersAdded = this.pluck(this.props.usersThisMonth, "signUps");
    const newLabel = `${this.props.type}`;
    let newBgColor = "rgba(75,192,192,0.2)";
    let newBorderColor = "rgba(75,192,192,1)";
    if (this.props.type && this.props.type === "Providers") {
      newBgColor = "rgba(155, 69, 191, 0.2)";
      newBorderColor = "rgba(155, 69, 191, 1)";
    } else if (this.props.type && this.props.type === "Seekers") {
      newBgColor = "rgba(58, 222, 126, 0.2)";
      newBorderColor = "rgba(58, 222, 126, 1)";
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        labels: dates,
        datasets: [
          ...prevState.datasets,
          {
            ...prevState.datasets[0],
            data: usersAdded,
            label: newLabel,
            backgroundColor: newBgColor,
            borderColor: newBorderColor,
          },
        ],
      };
    });
  };

  pluck = (array, key) => {
    return array.map((obj) => obj[key]);
  };

  mapOneDate = (dateTime) => {
    return dateTime.split("T")[0];
  };
  render() {
    return (
      <React.Fragment>
        <div className="card chart">
          <Bar
            data={this.state}
            options={{
              title: {
                display: true,
                text: `${this.props.title}`,
                fontSize: 20,
              },
              legend: {
                display: false,
                position: "right",
              },
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default BarGraph;

BarGraph.propTypes = {
  usersThisMonth: PropTypes.arrayOf(
    PropTypes.shape({
      signUps: PropTypes.number,
      date: PropTypes.string,
      totalToDate: PropTypes.number,
    })
  ),
  title: PropTypes.string,
  type: PropTypes.string,
};
