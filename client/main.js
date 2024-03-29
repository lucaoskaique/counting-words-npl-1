import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.js";
import axios from "axios";
import * as d3 from "d3";
import { barChart } from "./script/barChart.js";
import { WordCloud } from "./script/cloudChart.js";

const fetchData = async () => {
  const response = await axios.get("http://localhost:3000/data");
  return response.data;
};

const { filteredFrequency } = await fetchData();

if (!filteredFrequency) {
  throw new Error("No data found");
}

const frequencyData = filteredFrequency
  .slice(0, 10)
  .map(({ word, count }) => ({ text: word, size: count }));

console.log("aqui", frequencyData);

// const chart = barChart(frequencyData, {
//   x: (d) => d.count,
//   y: (d) => d.word,
//   yDomain: d3.groupSort(
//     frequencyData,
//     ([d]) => -d.count,
//     (d) => d.word
//   ), // sort by descending frequency
//   xFormat: "%",
//   xLabel: "Frequency",
//   color: "steelblue",
// });

// d3.select("body").append(() => chart);

const cloudChart = WordCloud(frequencyData, {
  svgId: "word-cloud-11",
  height: 1080,
  width: 1920,
  fontFamily: "Impact",
  fontScale: 10,
  padding: 5,
  rotate: () => (~~(Math.random() * 6) - 3) * 30,
});
// const chartWord = WordCloud(frequencyData, {
//   width: 1920,
//   height: 1080,
//   size: () => 50,
//   rotate: () => ~~(Math.random() * 2) * 90,
// });

// document.body.appendChild(cloudChart);
