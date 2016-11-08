function loading(){
	var datos;
	$('#progress').show();
	$('#complete').hide();
	$("#canvas_mujeres").hide();
	$("#canvas_hombres").hide();
	Papa.parse("http://datos.gob.ar/dataset/becaceb2-dbd0-4879-93bd-5f02bd3b8ca2/resource/bf2f67f4-9ab3-479b-a881-56b43565125e/download/contratos-2015.csv", {
		download: true,
		header: true,
		complete: function(results) {
			datos = results.data;
			mujeres = datos.filter(mujeres);
			hombres = datos.filter(hombres);
			$('#complete').show();
			$('#progress').hide();
			data = [[
			{ 'mes': 'Ene', 'cant': hombres.filter(mes(0)).length},
			{ 'mes': 'Feb', 'cant': hombres.filter(mes(1)).length},
			{ 'mes': 'Mar', 'cant': hombres.filter(mes(2)).length},
			{ 'mes': 'Abr', 'cant': hombres.filter(mes(3)).length},
			{ 'mes': 'May', 'cant': hombres.filter(mes(4)).length},
			{ 'mes': 'Jun', 'cant': hombres.filter(mes(5)).length},
			{ 'mes': 'Jul', 'cant': hombres.filter(mes(6)).length},
			{ 'mes': 'Ago', 'cant': hombres.filter(mes(7)).length},
			{ 'mes': 'Sep', 'cant': hombres.filter(mes(8)).length},
			{ 'mes': 'Oct', 'cant': hombres.filter(mes(9)).length},
			{ 'mes': 'Nov', 'cant': hombres.filter(mes(10)).length},
			{ 'mes': 'Dic', 'cant': hombres.filter(mes(11)).length}
			],[
			{ 'mes': 'Ene', 'cant': mujeres.filter(mes(0)).length},
			{ 'mes': 'Feb', 'cant': mujeres.filter(mes(1)).length},
			{ 'mes': 'Mar', 'cant': mujeres.filter(mes(2)).length},
			{ 'mes': 'Abr', 'cant': mujeres.filter(mes(3)).length},
			{ 'mes': 'May', 'cant': mujeres.filter(mes(4)).length},
			{ 'mes': 'Jun', 'cant': mujeres.filter(mes(5)).length},
			{ 'mes': 'Jul', 'cant': mujeres.filter(mes(6)).length},
			{ 'mes': 'Ago', 'cant': mujeres.filter(mes(7)).length},
			{ 'mes': 'Sep', 'cant': mujeres.filter(mes(8)).length},
			{ 'mes': 'Oct', 'cant': mujeres.filter(mes(9)).length},
			{ 'mes': 'Nov', 'cant': mujeres.filter(mes(10)).length},
			{ 'mes': 'Dic', 'cant': mujeres.filter(mes(11)).length}
			]];
			showNumbers(hombres, mujeres);
			canvas(data[0], 'canvas_hombres');
			canvas(data[1], 'canvas_mujeres');
			$("#canvas_mujeres").fadeIn(3000);
			$("#canvas_hombres").fadeIn(3000);
		}
	});
}

function showNumbers(hombres, mujeres){
	var format = d3.format(",d");
	d3.select("#hombres")
	.transition()
	.duration(2500)
	.on("start", function repeat() {
		d3.active(this)
		.tween("text", function() {
			var that = d3.select(this),
			i = d3.interpolateNumber(that.text().replace(/,/g, ""), hombres.length);
			return function(t) { that.text(format(i(t))); };
		})
		.transition()
		.delay(1500)
		.on("start", repeat);
	});

	d3.select("#mujeres")
	.transition()
	.duration(2500)
	.on("start", function repeat() {
		d3.active(this)
		.tween("text", function() {
			var that = d3.select(this),
			i = d3.interpolateNumber(that.text().replace(/,/g, ""), mujeres.length);
			return function(t) { that.text(format(i(t))); };
		})
		.transition()
		.delay(1500)
		.on("start", repeat);
	});
}

function canvas(data, canvas){
	var canvas = document.getElementById(canvas),
	context = canvas.getContext("2d");

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = canvas.width - margin.left - margin.right,
	height = canvas.height - margin.top - margin.bottom;

	var x = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.1);

	var y = d3.scaleLinear()
	.rangeRound([height, 0]);

	context.translate(margin.left, margin.top);

	x.domain(data.map(function(d) { return d.mes; }));
	y.domain([0, d3.max(data, function(d) { return d.cant; })]);

	var yTickCount = 10,
	yTicks = y.ticks(yTickCount),
	yTickFormat = y.tickFormat(yTickCount);

	context.beginPath();
	x.domain().forEach(function(d) {
		context.moveTo(x(d) + x.bandwidth() / 2, height);
		context.lineTo(x(d) + x.bandwidth() / 2, height + 6);
	});
	context.strokeStyle = "black";
	context.stroke();

	context.textAlign = "center";
	context.textBaseline = "top";
	x.domain().forEach(function(d) {
		context.fillText(d, x(d) + x.bandwidth() / 2, height + 6);
	});

	context.beginPath();
	yTicks.forEach(function(d) {
		context.moveTo(0, y(d) + 0.5);
		context.lineTo(-6, y(d) + 0.5);
	});
	context.strokeStyle = "black";
	context.stroke();

	context.textAlign = "right";
	context.textBaseline = "middle";
	yTicks.forEach(function(d) {
		context.fillText(yTickFormat(d), -9, y(d));
	});

	context.beginPath();
	context.moveTo(-6.5, 0 + 0.5);
	context.lineTo(0.5, 0 + 0.5);
	context.lineTo(0.5, height + 0.5);
	context.lineTo(-6.5, height + 0.5);
	context.strokeStyle = "black";
	context.stroke();

	context.save();
	context.textAlign = "right";
	context.textBaseline = "top";
	context.font = "bold 10px sans-serif";
	context.fillText("Contratos", 10, -20);
	context.restore();

	context.fillStyle = "steelblue";
	data.forEach(function(d) {
		context.fillRect(x(d.mes), y(d.cant), x.bandwidth(), height - y(d.cant));
	});
}

function mes(mes) {
	return function(elemento) {
		date = new Date(new Date(elemento.fecha_alta_registro_rcpc).getTime() + (new Date().getTimezoneOffset() * 60 * 1000));
		return date.getMonth() == mes;
	}
}

function mujeres(elemento) {
	return elemento.sexo == "F";
}
function hombres(elemento) {
	return elemento.sexo == "M";
}