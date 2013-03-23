//Creates the stage
var isReady = false;

var dekuPolaroid = new Object({
		width : 300,
		height : 350,
		padding : 13,
		picHeight : 250,
		picRadius: 2,
		container: 'canvas-container',
		text : 'SAMPLE TITLE\nAnd sample content!',
		layer : {},
		element : {},
		_state : 0,
		create : function() {
			this._prepareCanvas();
			this._prepareLayers();
			this._prepareElements();
			this.layer.bg.add(this.element.bg);
			this.layer.bg.add(this.element.text);
			this.layer.pic.add(this.element.picture);	
			this._loadImages();
			
		},
		setPicture : function(img) {
			this.element.picture.setFillPatternImage(img);
			this.element.picture.setFillPriority('pattern');
			this.layer.pic.draw();
			this.stage.add(dekuPolaroid.layer.pic);
			this.layer.shadow.moveToTop();
		},
		_prepareCanvas : function() {
			this.stage = new Kinetic.Stage({
			container: this.container,
			width: this.width,
			height: this.height
			});
			var oldClass = this.stage.getContent().getAttribute("class");
			this.stage.getContent().setAttribute("class", oldClass + " shadowed");
		},
		_prepareLayers : function() {
			this.layer.bg = new Kinetic.Layer();	
			this.layer.pic = new Kinetic.Layer({
				x: this.padding,
				y: this.padding,
				width: this.stage.getWidth() - this.padding*2,
				height: this.picHeight,
			});
			this.layer.shadow = new Kinetic.Layer({
				x: this.padding,
				y: this.padding,
				width: this.stage.getWidth() - this.padding*2,
				height: this.picHeight,
			});
		},
		_prepareElements : function() {
			this.element.text = new Kinetic.Text({
				x: 0,
				y: this.picHeight + this.padding,
				text: this.text,
				fontSize: 18,
				fontFamily: 'Shadows Into Light Two',
				fontStyle: 'bold',
				fill: '#555',
				width: this.width,
				padding: this.padding,
				align: 'center'
			});			
			this.element.bg = new Kinetic.Rect({
				x:0,
				y:0,
				width: dekuPolaroid.stage.getWidth(),
				height: dekuPolaroid.stage.getHeight(),
				fill: 'white',
				strokeWidth: 0
			});
			this.element.picture = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: this.layer.pic.getWidth(),
				height: this.layer.pic.getHeight(),
				cornerRadius: this.picRadius,
				fillPatternScale: [0.3,0.3],
				fillPatternX: 0,
				fillPatternY: 0
			});
		},
		_loadImages : function() {
			var imageBg = new Image();
			var imageShadow = new Image();
			imageBg._this = this;
			imageShadow._this = this;
			imageBg.onload = function() {
				this._this.element.bg.setFillPatternImage(this);
				this._this.element.bg.setFillPriority('pattern');
				this._this.layer.bg.draw();
				this._this._checkState();
			};
			imageShadow.onload = function() {
				this._this._createShadow(imageShadow);
				this._this._checkState();
			};
			imageBg.src = '../img/polaroid-bg.jpg';
			imageShadow.src = '../img/shadow.png';
		},
		_createShadow: function(img) {
			this.element.shadow = new Kinetic.Image({
				x: 0,
				y:0,
				width: this.layer.shadow.getWidth(),
				height: this.layer.shadow.getHeight(),
				cornerRadius: this.picRadius,
				image: img,
				opacity: 0.5
			});
			this.layer.shadow.add(this.element.shadow);
		},		
		_checkState : function() {
			this._state += 1;
			if (this._state == 2) {
				this.stage.add(dekuPolaroid.layer.bg);
				this.stage.add(dekuPolaroid.layer.shadow);
			}
		}
	});



dekuPolaroid.create();


var imagePic = new Image();

imagePic.onload = function() {
	dekuPolaroid.setPicture(this);
};

imagePic.src = '../pic.jpg';


		/* ---------------- Not working properly due to shadow layer
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
		*/
	