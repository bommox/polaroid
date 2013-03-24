var dekuPolaroid = new Object({
	width : 300,
	height : 350,
	padding : 13,
	picHeight : 250,
	picRadius: 5,
	container: 'canvas-container',
	text : 'Your lovely picture!',
	picture : '',
	layer : {},
	element : {},
	_state : 0,
	_pictureLoaded : false,
	create : function() {
		this._prepareCanvas();
		this._prepareLayers();
		this._prepareElements();
		this.layer.bg.add(this.element.bg);
		this.layer.bg.add(this.element.text);
		this.layer.pic.add(this.element.picture);
		this._loadImages();
		if (this.picture != '') {
			this.setPicture(this.picture);
		}
	},
	setPicture : function(src) {
		var img = new Image();
		img._this = this;
		img.onload = function() {
			this._this._setPicture(this);
		};
		img.src = src;
	},
	setPictureScale : function(scale) {
		if (this._pictureLoaded) {
			var oldScale = this.element.picture.getFillPatternScale().x;
			this.element.picture.setFillPatternScale(scale * oldScale);
		}
		this._reDrawPicture();
	},
	setText : function(text) {
		this.text = text;
		this.element.text.setText(text);
		this._reDrawPicture();
	},
	generateDataURL : function(cback) {
		this.stage.toDataURL({
			callback : function(data) {
				cback(data);
			}
		});
	},
	generateImage : function(cback) {
		this.stage.toImage({
			callback : function(data) {
				cback(data);
			}
		});
	},
	_setPicture : function(img) {
		this.element.picture.setFillPatternImage(img);
		this.element.picture.setFillPriority('pattern');
		var scale =  (img.width < img.height) 
			? (this.width - 2*this.padding) / img.width
			: this.picHeight / img.height;
		this.element.picture.setFillPatternScale(scale);
		this.element.picture._lastPos = {x:0,y:0};
		this._pictureLoaded = true;
		this.element.shadow.setDraggable(true);
		this.element.shadow._this = this;			
		this.element.shadow.setDragBoundFunc(function(pos) {				
				var pic = this._this.element.picture;
				var o = pic.getFillPatternOffset();
				var p = this._this.padding;
				if ((pos.x >= (p - 2) && pos.x <= (p + 2)) && (pos.y >= (p - 2) && pos.y <= (p + 2))) {
					pic._lastPos = {x : pic.getFillPatternX(), y : pic.getFillPatternY()};
				}
				var a = pic._lastPos;
				pic.setFillPatternX(pos.x + a.x - p);
				pic.setFillPatternY(pos.y + a.y - p);
				this._this.layer.pic.draw();
				return {
					x: this.getAbsolutePosition().x, 
					y: this.getAbsolutePosition().y
				}
			});
		this.stage.add(dekuPolaroid.layer.pic);
		this._reDrawPicture();
	},
	_reDrawPicture : function() {
		this.layer.pic.draw();
		this.layer.bg.draw();
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
			fillPatternOffset: [0,0],
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