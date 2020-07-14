import React, { PureComponent } from "react";
import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";

class PieChart extends PureComponent {
  state = {
    labels: ["Admin", "Providers", "Seekers"],
    datasets: [
      {
        label: "Users Breakdown",
        fill: true,
        backgroundColor: [
          "rgba(75,192,192,0.2)",
          "rgba(155, 69, 191, 0.2)",
          "rgba(58, 222, 126, 0.2)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(155, 69, 191, 1)",
          "rgba(58, 222, 126, 1)",
        ],
        borderWidth: 2,
        data: [65, 59, 80],
      },
    ],
  };

  componentDidMount() {
    this.setData();
  }

  setData = () => {
    const UsersArray = [
      this.props.totalUsers.admins,
      this.props.totalUsers.providers,
      this.props.totalUsers.seekers,
    ];
    const labelsArray = [
      `Admin (${this.props.totalUsers.admins})`,
      `Providers (${this.props.totalUsers.providers})`,
      `Seekers (${this.props.totalUsers.seekers})`,
    ];
    this.setState((prevState) => {
      return {
        ...prevState,
        labels: labelsArray,
        datasets: [
          ...prevState.datasets,
          {
            ...prevState.datasets[0],
            data: UsersArray,
          },
        ],
      };
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="card chart">
          <Pie
            data={this.state}
            options={{
              title: {
                display: true,
                text: `Users Breakdown`,
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "top",
              },
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default PieChart;

PieChart.propTypes = {
  totalUsers: PropTypes.shape({
    admins: PropTypes.number,
    providers: PropTypes.number,
    seekers: PropTypes.number,
  }),
};
