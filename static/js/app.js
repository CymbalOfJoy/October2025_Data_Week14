// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_metadata = metadata.filter(row => row.id == sample)[0];
    console.log(sample_metadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sample_metadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`).style("color", "#ffffff"); // White text color
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sample_data = samples.filter(row => row.id == sample)[0];
    console.log(sample_data);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_data.otu_ids;
    let otu_labels = sample_data.otu_labels;
    let sample_values = sample_data.sample_values;

    // Build a Bubble Chart with reds and purples
    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: [
          [0, "rgb(255, 204, 255)"], // Light pinkish purple
          [0.2, "rgb(204, 102, 255)"], // Medium purple
          [0.4, "rgb(153, 0, 204)"],   // Dark purple
          [0.6, "rgb(204, 0, 102)"],   // Red-pink
          [0.8, "rgb(255, 51, 102)"],  // Bright red-pink
          [1, "rgb(204, 0, 0)"]        // Dark red
        ]
      }
    };

    let traces = [trace];

    let layout = {
      title: {
        text: 'Bacteria Cultures per Sample',
        font: { color: '#ffffff' } // White title text color
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria',
          font: { color: '#ffffff' } // White axis text color
        }
      },
      xaxis: {
        title: {
          text: 'OTU ID',
          font: { color: '#ffffff' } // White axis text color
        }
      },
      height: 700,
      paper_bgcolor: '#6a0d3c', // Dark red background
      plot_bgcolor: '#d16d7f',    // Lighter pinkish red
      font: { color: '#ffffff' }  // White text color for other chart elements
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', traces, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_ticks = otu_ids.map(x => `OTU: ${x} `);

    // Build a Bar Chart with reds and purples
    let bar_trace = {
      y: bar_ticks.slice(0, 10).reverse(),
      x: sample_values.slice(0, 10).reverse(),
      type: 'bar',
      hovertext: otu_labels.slice(0, 10).reverse(),
      marker: {
        color: '#9b1c36', // Deep red color
        line: {
          color: 'black', // Add border around bars
          width: 1.5
        }
      },
      orientation: 'h'
    };

    // Trace Array
    let bar_traces = [bar_trace];

    // Titles
    let bar_layout = {
      title: {
        text: `Top 10 Bacteria Cultures Found`,
        font: { color: '#ffffff' } // White title text color
      },
      xaxis: {
        title: {
          text: 'Number of Bacteria',
          font: { color: '#ffffff' } // White axis text color
        }
      },
      height: 700,
      paper_bgcolor: '#6a0d3c', // Dark red background
      plot_bgcolor: '#d16d7f',    // Lighter pinkish red
      font: { color: '#ffffff' }  // White text color for other chart elements
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', bar_traces, bar_layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(names);

    for (let i = 0; i < names.length; i++) {
      let name = names[i];

      // Create option
      dropdown.append("option").text(name).style("color", "#ffffff"); // White text color
    }

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
