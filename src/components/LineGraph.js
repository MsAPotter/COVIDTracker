import React, { useState, useEffect } from "react";
import { Line, Chart } from "react-chartjs-2";
import numeral from "numeral";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Chart.js options config for Chart aesthetics
const options = {
  plugins: {
    legend: {
        display: false,   // need THIS nested config to 
     } } ,                //  remove Title legend box
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: 
        {
          type: 'time',
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      
      yAxes: 
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      
    },
  };

  // Loops through data object and Sets x and y points for Chart
  const buildChartData = (data, casesType ) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      // data[casesType].forEach((date) => {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };


function LineGraph({ casesType }) {
  const [data, setData] = useState({});
console.log(data)
console.log(casesType)

  useEffect(() => {
    const fetchData = async () =>       // can also async (it works)
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);  //  eg. 1/19/22: 339118567
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          // console.log(chartData);
        });
    ;
    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (    // work without this catch as well
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
