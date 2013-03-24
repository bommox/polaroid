/**
 * @license dekuPolaroid v1.0
 * (c) 2013 Dekuwebs http://www.dekuwebs.com - J. Blom-Dahl
 */
function dekuwebsPolaroid(container, conf) {
	'use strict';
	
	/* CONFIGURATION OBJECT
	 * ==================== */
	var config = {
		dim: {
			width 		: 300,
			height 		: 350,
			padding		: 13,
			picHeight 	: 250,
			picRadius 	: 5
		},
		container : container,
		picture : '',
		text : '',
		imgPath : './img/dekuwebs/',
		callback : function(){}
	};	
	
	/* ARGUMENTS
	 * ========= */
	var container = container;
	
	
	/* OTHER INTERNAL VARS
	 * =================== */
	var layer = {};
	var element = {};
	var stage = {};	
	var state = 0;
	var loaded = false;
	var pictureLoaded = false;
	
	/* PUBLIC FUNCTIONS
	 * ================ */	
	 
	/**
	 * @name setImage
	 * @function
	 *
	 * @description Load a picture for the polaroid photo.
	 * @param {string} src The URL to the image.
	 */
	function setImage(src) {
		var img = new Image();
		img.onload = function() {
			setupPicture(this);
		};
		img.src = src;
	};
	
	/**
	 * @name setPictureScale
	 * @function
	 *
	 * @description Changes the image size. Use scale > 1 to increase it, and < 1 to make it 
	 *				smaller.
	 * @param {number} scale Scale multiplier. 1 keeps the size.
	 */
	function setPictureScale(scale) {
		if (pictureLoaded) {
			var oldScale = element.picture.getFillPatternScale().x;
			element.picture.setFillPatternScale(scale * oldScale);
		}
		reDrawAll();
	};
	
	/**
	 * @name setText
	 * @function
	 *
	 * @description Displays a text below the picture.
	 * @param {string} text The text to show as picture label.
	 */
	function setText(text) {
		config.text = text;
		element.text.setText(config.text);
		reDrawAll();
	};
	
	/**
	 * @name generateDataURL
	 * @function
	 *
	 * @description Generates the image data as a dataURL.
	 * @param {function} callback The callback function to this asynchronous method.
	 * @returns {string} dataURL with the image.
	 */
	function generateDataURL(cback) {
		stage.toDataURL({
			callback : function(data) {
				cback(data);
			}
		});
	};
	
	/**
	 * @name generateImage
	 * @function
	 *
	 * @description Generates the image data.
	 * @param {function} callback The callback function to this asynchronous method.
	 * @returns {data} Image data. Can be loaded in the src attribute of <img>
	 */
	function generateImage(cback) {
		stage.toImage({
			callback : function(data) {
				cback(data);
			}
		});
	};
	
	/**
	 * @name isReady
	 * @function
	 *
	 * @description Says when the deku object is ready to be accessed.
	 * @returns {boolean} True when it is ready.
	 */
	function isReady() {
		return loaded;
	};
	/* PRIVATE FUNCTIONS
	 * ================= */	
	function setupPicture(img) {
		element.picture.setFillPatternImage(img);
		element.picture.setFillPriority('pattern');
		var scale =  (img.width < img.height) 
			? (config.dim.width - 2*config.dim.padding) / img.width
			: config.dim.picHeight / img.height;
		element.picture.setFillPatternScale(scale);
		element.picture._lastPos = {x:0,y:0};
		pictureLoaded = true;
		element.shadow.setDraggable(true);
		element.shadow.setDragBoundFunc(function(pos) {				
				var pic = element.picture;
				var o = pic.getFillPatternOffset();
				var p = config.dim.padding;
				if ((pos.x >= (p - 2) && pos.x <= (p + 2)) && (pos.y >= (p - 2) && pos.y <= (p + 2))) {
					pic._lastPos = {x : pic.getFillPatternX(), y : pic.getFillPatternY()};
				}
				var a = pic._lastPos;
				pic.setFillPatternX(pos.x + a.x - p);
				pic.setFillPatternY(pos.y + a.y - p);
				layer.pic.draw();
				return {
					x: pic.getAbsolutePosition().x, 
					y: pic.getAbsolutePosition().y
				}
			});
		stage.add(layer.pic);
		reDrawAll();
	};
	function reDrawAll() {
		layer.pic.draw();
		layer.bg.draw();
		layer.shadow.moveToTop();
	};
	function prepareCanvas() {
		stage = new Kinetic.Stage({
			container: container,
			width: config.dim.width,
			height: config.dim.height
			});
		var oldClass = stage.getContent().getAttribute("class");
		stage.getContent().setAttribute("class", oldClass + " shadowed");
	};
	function prepareLayers() {
		layer.bg = new Kinetic.Layer();	
		layer.pic = new Kinetic.Layer({
			x: config.dim.padding,
			y: config.dim.padding,
			width: stage.getWidth() - config.dim.padding*2,
			height: config.dim.picHeight,
		});
		layer.shadow = new Kinetic.Layer({
			x: config.dim.padding,
			y: config.dim.padding,
			width: stage.getWidth() - config.dim.padding*2,
			height: config.dim.picHeight,
		});
	};
	function prepareElements() {
		element.text = new Kinetic.Text({
			x: 0,
			y: config.dim.picHeight + config.dim.padding,
			text: config.text,
			fontSize: 18,
			fontFamily: 'Shadows Into Light Two',
			fontStyle: 'bold',
			fill: '#555',
			width: config.dim.width,
			padding: config.dim.padding,
			align: 'center'
		});			
		element.bg = new Kinetic.Rect({
			x:0,
			y:0,
			width: stage.getWidth(),
			height: stage.getHeight(),
			fill: 'white',
			strokeWidth: 0
		});
		element.picture = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: layer.pic.getWidth(),
			height: layer.pic.getHeight(),
			cornerRadius: config.dim.picRadius,
			fillPatternOffset: [0,0],
			fillPatternX: 0,
			fillPatternY: 0
		});
	};
	function loadImages() {
		var imageBg = new Image();
		var imageShadow = new Image();
		imageBg.onload = function() {
			element.bg.setFillPatternImage(this);
			element.bg.setFillPriority('pattern');
			layer.bg.draw();
			checkState();
		};
		imageShadow.onload = function() {
			element.shadow = new Kinetic.Image({
				x: 0,
				y:0,
				width: layer.shadow.getWidth(),
				height: layer.shadow.getHeight(),
				cornerRadius: config.dim.picRadius,
				image: this,
				opacity: 0.5
			});
			layer.shadow.add(element.shadow);
			checkState();
		};
		imageBg.src = config.imgPath + 'polaroid-bg.jpg';
		imageShadow.src = config.imgPath + 'shadow.png';
	};
	function checkState() {
		state += 1;
		if (state == 2) {
			stage.add(layer.bg);
			stage.add(layer.shadow);
			ready(config.callback);
		}
	};
	function ready(callback) {
		loaded = true;
		reDrawAll();
		callback();
	};	
	function create() {
		changeConfig.set(conf);
		prepareCanvas();
		prepareLayers();
		prepareElements();
		layer.bg.add(element.bg);
		layer.bg.add(element.text);
		layer.pic.add(element.picture);
		loadImages();
		if (config.picture != '') {
			setImage(config.picture);
		}		
	};
	// ChangeConfig makes possible to override configuration
	//  --Code by Christian Heilman
	//	--http://christianheilmann.com/2008/05/23/script-configuration/
	var changeConfig = function(){
		function set(o){
		  var reg = /\./g;
		  if(isObj(o)){
			for(var i in o){
			  if(i.indexOf('.')!== -1){
				var str = '["' + i.replace(reg,'"]["') + '"]';
				var val = getValue(o[i]);
				eval('config' + str + '=' + val);
			  } else {
				findProperty(config,i,o[i]);
			  }
			}
		  }
		};
		function findProperty(o,p,v){
		  for(var i in o){
			if(isObj(o[i])){
			  findProperty(o[i],p,v);
			} else {
			  if(i === p){o[p] = v;};
			}
		  }
		};
		function isObj(o){
		  return (typeof o === 'object' && typeof o.splice !== 'function');
		};
		function getValue(v){
		  switch(typeof v){
			case 'string': return "'"+v+"'"; break;
			case 'number': return v; break;
			case 'object':
			  if(typeof v.splice === 'function'){
				return '['+v+']';
			  } else {
				return '{'+v+'}';
			  }
			break;
			case NaN: break;
		  };
		};
		return{set:set};
	}();
	//Start it when instantiation
	create(this);
	//Return public objects
	return {
		setImage : setImage,
		setText : setText,
		setPictureScale : setPictureScale,
		generateDataURL : generateDataURL,
		generateImage : generateImage,
		isReady : isReady
	};
}