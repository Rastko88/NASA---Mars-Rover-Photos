//smestas u globalne promenljive

var currentRoverData = [];
var currentRoverImages = [];
var selectedRoverId = "";

//nizovi kamera

var cameras = {
	curiosity:['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
	opportunity:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM'],
	spirit:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM']
};

//API key i URL  koji je zajednicki za oba ajaxa

var key = "0MBgxNs4QpgozbvtFsYv3gdhR5ezpO1bOKiZJ1dS";
var nasa_url = "https://api.nasa.gov/mars-photos/api/v1";

//updateuje slider sa max sol u zavisnosti od selektovanog rovera

function setSliderRange(value){
	$( "#slider")[0].max = value;
}

//labela koja ocitava vrednost selektovanog sola preko slajdera

function setCurrentSOL(value){
	$("#currentSliderValue")[0].innerHTML = value;
}

//dodaje border za selektovani rover

function setRoverActive(currentRoverId) {

	// deselect all rovers
	$(".rover-active").removeClass('rover-active').addClass('rover');

	// set selected rover active
	var selector = "#" + currentRoverId;
	$(selector).addClass('rover-active');
}


//ispis teksta, updateovanje slajdera maksimalnim brojem solova, i appendovanje kamera za izabrani rover

function getRoverData(currentRoverId){
	$.ajax({
		url: nasa_url + "/manifests/" + currentRoverId + "?api_key=" + key,
		type: 'GET',
		error:function(data){
			alert("An error has occured. See error message : " + data.responseText);
		},
		success:function(data) {
			currentRoverData = data;
			$(".text").html("Name: " + data.photo_manifest.name + "<br>Launch date: " + data.photo_manifest.launch_date + "<br>Landing date: " + data.photo_manifest.landing_date + "<br>Newest sol: " + data.photo_manifest.max_sol + "<br>Total photos: " + data.photo_manifest.max_sol);

			// get number of sols
			var numberOfSols = currentRoverData.photo_manifest.max_sol; //currentRoverData.numberOfSols

			// update slider range with number of sols
			setSliderRange(numberOfSols);

			// set cameras 
			setCameras(currentRoverId);

		}
	});	
}

//selektovanje rovera, davanje klase i pozivanje funkcije za ispis teksta i pozivanje getData

function selectRover (currentRoverId) {

	this.selectedRoverId = currentRoverId;

	// set selected rover active
	setRoverActive(currentRoverId);

	// fetch rover information from Nasa API
	getRoverData(currentRoverId);	
}

//setuje kamere za izabrani rover

function setCameras(currentRoverId){

	var camerasToSet = [];

	switch (currentRoverId)
	{
		case "curiosity" : 
			camerasToSet = cameras.curiosity;
			break;

		case "opportunity" :
			camerasToSet = cameras.opportunity;
			break;

		case "spirit" :
			camerasToSet = cameras.spirit;
			break;

		default: 
			alert("Error message");
	}

//prazni formu pre selektovanja drugog rovera

	$("#sel_cam").empty();

	//puni formu sa radio buttonima prema nizu kamera za selektovani rover

	for (var i = 0; i < camerasToSet.length; i++) {
		appendRadioButton(camerasToSet[i]);
	}

}

function appendRadioButton(name){
	$("#sel_cam").append('<li><input type="radio" name="camera" value="' + name + '">'+ name +'</li>');
}



//iscitava slike za selektovani rover, za izabrani sol i cekiranu kameru

function getImages () {
	var activeCamera = $('#sel_cam input:checked').val();
	var currentSliderValue = $("#currentSliderValue")[0].innerHTML;

	$.ajax({
		url: nasa_url + "/rovers/" + selectedRoverId + "/photos?sol=" + currentSliderValue + "&camera=" + activeCamera + "&api_key=" + "0MBgxNs4QpgozbvtFsYv3gdhR5ezpO1bOKiZJ1dS",
		type: 'GET',
		error:function(data){
			$("#right").append('<p id="warning">Info: No photos for this selection! Please change your parameters. Thank you.</p>');
		},
		success:function(images) {
			currentRoverImages = images.photos;
			for (var i = 0; i < currentRoverImages.length; i++) {
			$("#right").append('<img class="rov_img" src="' + currentRoverImages[i].img_src + '">');
			}
		}
	});

	$("#right").empty();
}
