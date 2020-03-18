// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as data
// d3.json("samples.json").then(function(data){
// 	console.log(data);
// });
// inspecting data shows 3 object arrays of same length
// arrays related to each other through the key, id
// therefore first obtain dropdown through first array, name
// all other data will be selected according to this first array
function init() {
    
  // add ids to dropdown
  d3.json("samples.json").then(function(data){
	
    var names = data.names;
    var dropdownMenu = d3.select("#selDataset");
    names.forEach(id=>dropdownMenu.append("option").text(id));

    // init can be created here from passing build functions by holding first key const
    // further explained belowed
    const firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// function optionChanged in html will be how other functions know which id to pass through
function optionChanged(sample){
  buildCharts(sample);
  buildMetadata(sample);
}


function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // use filter to select key passed from optionChanged
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // console.log(result);
    var demoinfo = d3.select("#sample-metadata");
    // clear html before passing new info
    demoinfo.html("");
    // pass new info straight to html
    Object.entries(result).forEach(([key,value]) =>{
      demoinfo.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then(function(data) {
      var samples = data.samples;
      // use filter to select key passed from optionChanged
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // console.log(result);
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
    
      // bar chart
      var trace1 = {
          type: "bar",
          orientation: 'h',
          x: sample_values.slice(0,10).reverse(),
          y: otu_ids.slice(0,10).reverse().map(otu_id=>`OTU ${otu_id}`),
          text: otu_labels.slice(0,10).reverse()
      };

      var barData = [trace1];

      var barLayout = {
          title: "Top 10 OTUs",
      };

      Plotly.newPlot("bar", barData, barLayout);
      // no need for restyle due to slices

    
    // bubble chart
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    
    var bubbledata = [trace2];

    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
      
    };

    Plotly.plot('bubble', bubbledata, bubbleLayout);
    Plotly.restyle("bubble","x",[otu_ids]);
		Plotly.restyle("bubble","y",[sample_values]);
		Plotly.restyle("bubble","marker.size",[sample_values]);
		Plotly.restyle("bubble","marker.color",[otu_ids]);
		Plotly.restyle("bubble","text",[otu_labels]);

  });

}
init(); 