function Model() {
	var self = this;
	self.height = ko.observable(400)
	self.width = ko.observable(600);
	self.defaultInterval = ko.observable(100);

	self.result = ko.observable(null);
	self.getResult = function() {
		//self.result(_.reduce(self.frames(), function(memo, frame){ return memo + frame.text(); }, ""));
		var gif = new GIF({
			workers: 2,
			quality: 10
		});
		var isFirst = true;
		_.each(self.frames(), function(frame) {
			if (frame.isTextFrame) {
				var delay = isFirst ? 0 : self.defaultInterval();
				gif.addFrame($("#"+frame.uuid)[0], {delay: delay});
				gif.on('finished', function(blob) {
					window.open(URL.createObjectURL(blob));
				});
				gif.render();
			}
		})
	}

	self.frames = ko.observableArray([]);
	self.addTextFrame = function() {
		var frame = new TextFrame(self.width(), self.height());
		self.frames.push(frame);
		frame.redraw();
	}
	self.removeFrame = function(frame) { self.frames.remove(frame) }
}

function TextFrame(width, height) {
	var self = this;

	self.uuid = guid();
	self.isTextFrame = true;
	self.text = ko.observable("Пиши, что хочешь");
	self.posX = ko.observable(Math.round(width * 0.25));
	self.posY = ko.observable(Math.round(height * 0.5));
	self.fontSize = ko.observable(14);
	self.useCustomInterval = ko.observable(false);
	self.canvasContext = null;

	self.redraw = function() {
		var canvas = $('#'+self.uuid)[0];
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,width,height);
		ctx.font = self.fontSize() + "px Arial";
		ctx.fillText(self.text(),self.posX(),self.posY());
	};
}

//http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}