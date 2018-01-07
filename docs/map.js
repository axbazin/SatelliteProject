

function mapDrawing(){
	
	var c_grid = {
			ALB: { x: 5, y: 7 },//here
			//ARM: { x: 9, y: 6 },
			AUT: { x: 4, y: 5 },
			//AUS: { x: 9, y: 9 },
			//AZE: { x: 9, y: 5 },
			BEL: { x: 2, y: 3 },
			BGR: { x: 7, y: 5 },
			BIH: { x: 5, y: 6 },
			BLR: { x: 6, y: 3 },
			CHE: { x: 3, y: 4 },
			//CYP: { x: 8, y: 7 },
			CZE: { x: 4, y: 4 },
			DEU: { x: 4, y: 3 },
			DNK: { x: 4, y: 2 },
			ESP: { x: 1, y: 5 },
			EST: { x: 6, y: 1 },
			FIN: { x: 6, y: 0 },
			FRA: { x: 1, y: 4 },
			GBR: { x: 1, y: 2 },
			//GEO: { x: 8, y: 5 },
			GRC: { x: 7, y: 7 },// here
			HUN: { x: 5, y: 5 },
			HRV: { x: 4, y: 6 },
			IRL: { x: 0, y: 2 },
			ISL: { x: 0, y: 0 },
			//ISR: { x: 8, y: 8 },
			ITA: { x: 3, y: 5 },
			KOS: { x: 6, y: 7 },
			LTU: { x: 6, y: 2 },
			LUX: { x: 2, y: 4 },
			LVA: { x: 7, y: 2 },
			MDA: { x: 6, y: 4 },
			MKD: { x: 7, y: 6 },
			//MLT: { x: 1, y: 7 },
			MNE: { x: 4, y: 7 },
			NLD: { x: 3, y: 3 },
			NOR: { x: 4, y: 0 },
			POL: { x: 5, y: 3 },
			PRT: { x: 0, y: 5 },
			ROU: { x: 6, y: 5 },
			//RUS: { x: 7, y: 3 },
			//SMR: { x: 2, y: 6 },
			SRB: { x: 6, y: 6 },
			SVK: { x: 5, y: 4 },
			SVN: { x: 3, y: 6 },
			SWE: { x: 5, y: 0 },
			UKR: { x: 7, y: 4 },
			//TUR: { x: 8, y: 6 }
		};


	var config = {
		width : 1000,
		height : 700,
		padding : 70,
		projection : d3.geoMercator(),
		duration : 2000,
		key:function(d){return d.properties.ISO_A3; },
		grid : c_grid,
	};

	var svg = d3.select('body')
		.append('svg')
		.attr('width',config.width)
		.attr('height',config.height)
		.attr("id","view");

	var tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip');

	var colours = d3.scaleLinear()
		.range(['#ffd59b','#8b0000'])
	//d3.scaleQuantile().range(['#ffffe0','#ffd59b','#ffa474','#f47461','#db4551','#b81b34','#8b0000']);


	var g2r = new geo2rect.draw();

	var currentYear=2008,
		currentGood="TOTAL",
		currentDir="export";

	d3.json("freight.json", function(err,data){
		console.log(err);
		var yearsArray = Object.keys(data);
		var currentYear = yearsArray[0];
		
		colours.domain([
			0,20000
			// d3.min(data, function(d) { return d; }),
			// d3.max(data, function(d) { return d; })
			]);
		
		d3.json('eurovis-countries-simplified.geojson', function(err, json){

			
			var geojson = geo2rect.compute(json);
			g2r.config = config;
			g2r.data = geojson;
			g2r.svg = svg.append('g');
			g2r.draw();

			/*for(var i=0; i<Object.keys(data[currentYear]).length ; i++){
				d3.select(".id-"+ Object.keys(data[currentYear])[i])
					.style("fill", colours(Object.values(data[currentYear])[i].TOTAL.TOTAL));
				//console.log(Object.values(d[currentYear])[i].TOTAL.TOTAL);
			}*/
			var currData = data[currentDir];
			console.log(currData);
			console.log(currData[currentYear]);
			for(var i in currData[currentYear]){
				console.log(i);
				d3.select(".id-"+ currData[currentYear][i])
					.style("fill","white");
				//console.log(Object.values(d[currentYear])[i].TOTAL.TOTAL);
			}
		});

      	d3.select("#slider").on("input", function() {
			d3.select('#year').html(this.value);
			currentYear = this.value;
			updateViz(currentYear, currentGood, data,colours, currentDir);
		});
		
		console.log("hello");
		
		console.log(d3.selectAll(".goodtype"));
		
		d3.selectAll('.goodtype').on("change", function(){
			//console.log(this.value);
			//console.log(currentGood);
			//console.log(d3.select("#" + currentGood));
			d3.select("#" + currentGood).property("checked",true);
			currentGood = this.value;
			updateViz(currentYear,currentGood,data,colours, currentDir);
		});
	});




	d3.select('#toggle').on('click', function(){
		g2r.toggle();
		g2r.draw();
		//console.log(g2r._mode);
		/*for(let c in trans_data){
			if(g2r._mode === "rect"){
				d3.select("#" + trans_data[c].ISO3).attr("fill","Grey");
			}else{
				d3.select("#" + trans_data[c].ISO3).attr("fill","black");
			}
		}*/
	});

}

function HandleMouseOn(d){
	//console.log(d.key);
	tooltip.classed('hidden',false)
	      .html(d.key)
	      .style("left", (d3.event.pageX) + "px")		
	      .style("top", (d3.event.pageY - 28) + "px");
}

function HandleMouseOut(){
  	tooltip.classed('hidden',true);
}


function updateViz(currentYear, currentGood, data, colours, currentDir){
	//color la map avec les données pour l'année currentYear
		
		
		currData = data[currentDir];
		
		console.log(maxGood);
		colours.domain([0,maxGood]);
		
		for(var i=0 ; i<Object.keys(currData[currentYear]).length ; i++){

			var maxGood = 0;
			var pays = Object.keys(currData[currentYear])[i];
			for(var op in currData[currentYear][pays][currentGood]){
				if(maxGood < currData[currentYear][pays][currentGood][op]){
					maxGood = currData[currentYear][pays][currentGood][op];
				}
			}
			
			console.log(maxGood);
			
			for( var srec in Object.values(currData[currentYear])[i][currentGood]){
				
				if(Object.keys(currData[currentYear])[i] == srec){
					d3.select("#" + Object.keys(currData[currentYear])[i] +"-" + srec)
						.style("fill","blue");
				}else{
					
					d3.select("#" + Object.keys(currData[currentYear])[i] +"-" + srec)
						.style("fill", function(){
							if(Object.values(currData[currentYear])[i][currentGood][srec]){
							//console.log(Object.values(data[currentYear])[i]);
								return colours(Object.values(currData[currentYear])[i][currentGood][srec]);
							}else{
								return colours(0);
							}
						});
					
				}
					
			}
			/*
			d3.select('.id-'+ Object.keys(data[currentYear])[i])
				.style("fill", function(){
					if(Object.values(data[currentYear])[i].TOTAL.TOTAL){
						//console.log(Object.values(data[currentYear])[i]);
						return colours(Object.values(data[currentYear])[i][currentGood].TOTAL)
					}else{
						return "#ccc"
					}
				});*/
		}
}
