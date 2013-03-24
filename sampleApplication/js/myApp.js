var foto = {};
$(document).ready(function() {
	var config = {
		'dim.width' : 300, 
		'picture' : 'pic.jpg',
		'callback' : function(){foto.setText($('#labelText').val())}
	};
	foto = new dekuwebsPolaroid('canvas-container', config);
	$('#inputFile').change(function() {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				foto.setImage(e.target.result);
			}
			reader.readAsDataURL(this.files[0]);
		};			
	});
	$('#prepareDownload').click(function() {
		$(this).button('loading');
		disableAll();
		foto.generateDataURL(createLink);
		foto.generateImage(picturizeCanvas);
		
	});			
	$('#scaleMinus').click(function() {foto.setPictureScale(0.9)});
	$('#scalePlus').click(function() {
		foto.setPictureScale(1.1)
	});
	$('#labelBtn').click(function() {
		foto.setText($('#labelText').val())
	});			
	$('#popover').popover({
		"title" : "Move the picture",
		"content" : "You can move the picture by dragging it with the mouse!",
		"trigger" : "hover"
	});
	$('#reset').click(function() {
		container = $('#canvas-container');
		container.empty();
		foto = new dekuwebsPolaroid('canvas-container', config);
		enableAll();
	});
});	
function disableAll() {
	$('#scaleMinus, #scalePlus, #labelText, #inputFile').attr("disabled", "disabled");			
}
function enableAll() {
	$('#scaleMinus, #scalePlus, #labelText, #inputFile').removeAttr("disabled");
	$('#downloadLink').css('display','none');
	$('#prepareDownload').show();
	$('#prepareDownload').button('reset');
}
function picturizeCanvas(data) {			
	var container = $('#canvas-container');
	container.empty();
	var img = $(data);
	img.addClass('shadowed');
	img.popover({
		"title" : "Download it",
		"content" : "Right click with your mouse and 'Save image as...', to get it.",
		"trigger" : "manual"
	});			
	img.appendTo(container).popover('show');
};
function createLink(data) {
	$('#downloadLink').attr('href',data);
	$('#downloadLink').removeAttr('style');
	$('#prepareDownload').hide();
};