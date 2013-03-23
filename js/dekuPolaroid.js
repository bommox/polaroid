//Creates the stage
var dim = new Object({
		width : 300,
		height : 350,
		padding : 13,
		picHeight : 250,
		picRadius: 2
	});


var stage = new Kinetic.Stage({
        container: 'canvas-container',
        width: dim.width,
        height: dim.height
    });
var oldClass = stage.getContent().getAttribute("class");
stage.getContent().setAttribute("class", oldClass + " shadowed");
var bgLayer = new Kinetic.Layer();

var shadow = new Kinetic.Rect({
        x: 0,
        y: 0,
        fill: '#555',
        width: dim.width,
		height: dim.height
	});
	
var picLayer = new Kinetic.Layer({
		x: dim.padding,
		y: dim.padding,
		width: stage.getWidth() - dim.padding*2,
		height: dim.picHeight,
	});
var textLabel = new Kinetic.Text({
        x: 0,
        y: dim.picHeight + dim.padding,
        text: 'COMPLEX TEXT\nAll the world\'s a stage, and all the men',
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: dim.width,
        padding: dim.padding,
        align: 'center'
    });
	
function createImage(){
	var background = new Kinetic.Rect({
		x:0,
		y:0,
		width: stage.getWidth(),
		height: stage.getHeight(),
		fillPatternImage: imageBg,
        strokeWidth: 0
	});
	
	// add the shape to the layer
	bgLayer.add(background);		
	
	
	bgLayer.add(textLabel);
	
	// add the layer to the stage	
	stage.add(bgLayer);
	
	var o = new Object({x:0, y:0});

	var picture = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: picLayer.getWidth(),
		height: picLayer.getHeight(),
		cornerRadius: dim.picRadius,
		fillPatternImage: imagePic,
		fillPatternScale: [0.3,0.3],
		fillPatternX: 0,
		fillPatternY: 0,
		draggable: true,
		dragBoundFunc: function(pos) {
			var a = {x:this.getAbsolutePosition().x, y: this.getAbsolutePosition().y};
			if ((pos.x >= (a.x - 2) && pos.x <= (a.x + 2)) && (pos.y >= (a.y - 2) && pos.y <= (a.y + 2))) {
				o.x = this.getFillPatternX();
				o.y = this.getFillPatternY();
			}			
			this.setFillPatternX(o.x + pos.x - a.x);
			this.setFillPatternY(o.y + pos.y - a.y);
			return {
				x: this.getAbsolutePosition().x, 
				y: this.getAbsolutePosition().y
			}
		}
	});
	
	picLayer.add(picture);	
	// apply grayscale filter to second image	
	stage.add(picLayer);
	/*
	picture.applyFilter(Kinetic.Filters.Invert, null, function() {
	  picLayer.draw();
	});
	*/
}

var loadedPic = 0;
function checkLoad() {
	loadedPic++;
	if (loadedPic == 2) {
		createImage();
	}
}

var imageBg = new Image();
var imagePic = new Image();
imageBg.onload = function() {
	checkLoad() 
};
imagePic.onload = function() {
	checkLoad() 
};
imageBg.src = '../img/polaroid-bg.jpg';
imagePic.src = '../pic.jpg';