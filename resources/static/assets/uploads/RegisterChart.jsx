import { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  indexAxis: "x",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Registration vs. Demo Comparison",
    },
  },
};

const Horizontalchart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Registration",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Demo",
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  useEffect(() => {
    fetchRegistrationData();
    fetchDemoData();
  }, []);

  const fetchRegistrationData = async () => {
    try {
      const registrationUrl = "http://localhost:8000/getregisterStudent";
      const labelSet = [];
      const registrationDataSet = [];

      const res = await fetch(registrationUrl);
      const data = await res.json();
      console.log("data",data)

      for (const val of data) {
        const registrationDate = new Date(val.RegistrationDate);
        const monthYear = `${registrationDate.getFullYear()}-${(
          registrationDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}`;

        if (!labelSet.includes(monthYear)) {
          labelSet.push(monthYear);
        }

        const index = labelSet.indexOf(monthYear);
        registrationDataSet[index] = (registrationDataSet[index] || 0) + 1;
      }

      setChartData((prevState) => ({
        ...prevState,
        labels: labelSet,
        datasets: [
          {
            ...prevState.datasets[0],
            data: registrationDataSet,
          },
          prevState.datasets[1],
        ],
      }));
      console.log("setChartData", chartData)
    } catch (error) {
      console.error("Error fetching registration data", error);
    }
  };

  const fetchDemoData = async () => {
    try {
      const demoUrl = "http://localhost:8000/Getdemo";
      const labelSet = [];
      const demoDataSet = [];

      const res = await fetch(demoUrl);
      const data = await res.json();

      for (const val of data) {
        const demoDate = new Date(val.DemoDate);
        const monthYear = `${demoDate.getFullYear()}-${(demoDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;

        if (!labelSet.includes(monthYear)) {
          labelSet.push(monthYear);
        }

        const index = labelSet.indexOf(monthYear);
        demoDataSet[index] = (demoDataSet[index] || 0) + 1;
      }

      setChartData((prevState) => ({
        ...prevState,
        labels: labelSet,
        datasets: [
          prevState.datasets[0],
          {
            ...prevState.datasets[1],
            data: demoDataSet,
          },
        ],
      }));
      console.log("setChartData", chartData)
    } catch (error) {
      console.error("Error fetching demo data", error);
    }
  };

  return (
    <>
      <Header />
      <div className="sidebar-main-container">
        <Sidebar />       
        <div style={{ width: "80%", height: "50%" }}>
          <div>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Horizontalchart;
