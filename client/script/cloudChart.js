import * as d3 from "d3";
import cloud from "d3-cloud";

export function WordCloud(
  text,
  {
    size = (group) => group.length, // Given a grouping of words, returns the size factor for that word
    word = (d) => d, // Given an item of the data array, returns the word
    marginTop = 0, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 0, // left margin, in pixels
    width = 1920, // outer width, in pixels
    height = 1080, // outer height, in pixels
  } = {}
) {
  // List of words
  var myWords = [
    { text: "Running", size: "10" },
    { text: "Surfing", size: "20" },
    { text: "Climbing", size: "50" },
    { text: "Kiting", size: "30" },
    { text: "Sailing", size: "20" },
    { text: "Snowboarding", size: "60" },
  ];

  console.log("myWords", myWords);
  console.log("data", text);

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = cloud()
    .size([width, height])
    .words(
      myWords.map(function (d) {
        return { text: d.text, size: d.size };
      })
    )
    .padding(5) //space between words
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
    .fontSize(function (d) {
      console.log("d", d);
      return d.size;
    }) // font size of words
    .on("end", (d) => {
      console.log("end", d);
    });
  layout.start();
  // invalidation && invalidation.then(() => cloud.stop());
  // return svg.node();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    console.log("words", words);
    svg
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d) {
        return d.size;
      })
      .style("fill", "#69b3a2")
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }
}
// export function WordCloud(
//   text,
//   {
//     marginTop = 0, // top margin, in pixels
//     marginRight = 0, // right margin, in pixels
//     marginBottom = 0, // bottom margin, in pixels
//     marginLeft = 0, // left margin, in pixels
//     width = 1920, // outer width, in pixels
//     height = 1080, // outer height, in pixels
//     maxWords = 10000, // maximum number of words to extract from the text
//     fontFamily = "Impact", // font family
//     fontScale = 100, // base font size
//     fill = null, // text color, can be a constant or a function of the word
//     padding = 5, // amount of padding between the words (in pixels)
//     rotate = 0, // a constant or function to rotate the words
//     invalidation, // when this promise resolves, stop the simulation
//   } = {}
// ) {
//   var myWords = [
//     { word: "Running", size: "10" },
//     { word: "Surfing", size: "20" },
//     { word: "Climbing", size: "50" },
//     { word: "Kiting", size: "30" },
//     { word: "Sailing", size: "20" },
//     { word: "Snowboarding", size: "60" },
//   ];

//   const words = Array.from(text);

//   console.log("wordds inicio", words);
//   console.log("data", );

//   // var minSize = d3.min(words, (d) => d.size);
//   // var maxSize = d3.max(words, (d) => d.size);

//   // const fontScaleValue = d3
//   //   .scaleLinear()
//   //   .domain([d3.min(words, (d) => d.size), d3.max(words, (d) => d.size)])
//   //   .range([5, 10000]);

//   var layout = cloud()
//     .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
//     .words(words)
//     .padding(padding)
//     .rotate(rotate)
//     .font(fontFamily)
//     .fontSize((d) => d.size)
//     .on("word", (word) => {
//       console.log("word", word);
//     })

//   const svg = d3
//     .create("svg")
//     .attr("viewBox", [0, 0, width, height])
//     .attr("width", width)
//     .attr("font-family", fontFamily)
//     .attr("text-anchor", "middle")
//     .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

//   const g = svg
//     .append("g")
//     .attr("transform", `translate(${marginLeft},${marginTop})`);

//   layout.start();
//   // invalidation && invalidation.then(() => cloud.stop());
//   // return svg.node();

//   function draw(words) {
//     console.log("words", words);
//     svg
//       .append("g")
//       .attr(
//         "transform",
//         "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
//       )
//       .selectAll("text")
//       .data(words)
//       .enter()
//       .append("text")
//       .style("font-size", function (d) {
//         return d.size;
//       })
//       .style("fill", "#69b3a2")
//       .attr("text-anchor", "middle")
//       .style("font-family", "Impact")
//       .attr("transform", function (d) {
//         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//       })
//       .text(function (d) {
//         return d.text;
//       });
//   }
// }
