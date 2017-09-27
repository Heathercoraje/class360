//animation for contact page
	function Constellation () {
		var archorPoint = document.getElementById('canvas');

		var context = canvas.getContext('2d');
		var defaults = {
				star: {
					color: 'rgba(255, 255, 255, .9)',
					width: 5,
					randomWidth: true
				},
				line: {
					color: 'rgba(255, 255, 255, .5)',
					width: 1
				},
				position: {
					x: 0,
					y: 0
				},
				width: window.innerWidth,
				height: window.innerHeight,
				velocity: 0.1,
				length: 300,
				distance: 80,
				radius: 200,
				stars: []
			};
		var config = Object.assign({}, defaults);

		function Star () {
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;

			this.vx = (config.velocity - (Math.random() * 0.1));
			this.vy = (config.velocity - (Math.random() * 0.1));

			this.radius = config.star.randomWidth ? (Math.random() * config.star.width) : config.star.width;
		}

		Star.prototype = {
			create: function(){
				context.beginPath();
				context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
				context.fill();
			},

			animate: function(){
				var i;
				for (i = 0; i < config.length; i++) {

					var star = config.stars[i];

					if (star.y < 0 || star.y > canvas.height) {
						star.vx = star.vx;
						star.vy = - star.vy;
					} else if (star.x < 0 || star.x > canvas.width) {
						star.vx = - star.vx;
						star.vy = star.vy;
					}

					star.x += star.vx;
					star.y += star.vy;
				}
			},

			line: function(){
				var length = config.length,
					iStar,
					jStar,
					i,
					j;

				for (i = 0; i < length; i++) {
					for (j = 0; j < length; j++) {
						iStar = config.stars[i];
						jStar = config.stars[j];
						//for distance between stars
						if (
							(iStar.x - jStar.x) < config.distance &&
							(iStar.y - jStar.y) < config.distance &&
							(iStar.x - jStar.x) > - config.distance &&
							(iStar.y - jStar.y) > - config.distance
						) {
							//for mouse interaction
							if (
								(iStar.x - config.position.x) < config.radius &&
								(iStar.y - config.position.y) < config.radius &&
								(iStar.x - config.position.x) > - config.radius &&
								(iStar.y - config.position.y) > - config.radius
							) {
								context.beginPath();
								context.moveTo(iStar.x, iStar.y);
								context.lineTo(jStar.x, jStar.y);
								context.stroke();
								context.closePath();
							}
						}
					}
				}
			}
		};

		this.createStars = function () {
			var length = config.length,
				star,
				i;

			context.clearRect(0, 0, canvas.width, canvas.height);

			for (i = 0; i < length; i++) {
				config.stars.push(new Star());
				star = config.stars[i];

				star.create();
			}

			star.line();
			star.animate();
		};

		this.setCanvas = function () {
			canvas.width = config.width;
			canvas.height = config.height;
		};

		this.setContext = function () {
			context.fillStyle = config.star.color;
			context.strokeStyle = config.line.color;
			context.lineWidth = config.line.width;
		};

		this.setInitialPosition = function () {
				config.position = {
					x: canvas.width * 0.5,
					y: canvas.height * 0.5
				};
		};

		this.loop = function (callback) {
			callback();

			window.requestAnimationFrame(function () {
				this.loop(callback);
			}.bind(this));
		};

		this.mouse = function () {
			archorPoint.addEventListener('mousemove', function(e){
				config.position.x = e.clientX;
				config.position.y = e.clientY;
			});
		};

		this.init = function () {
			this.setCanvas();
			this.setContext();
			this.setInitialPosition();
			this.loop(this.createStars);
			this.mouse();
		};
	}

  var c = new Constellation();
			c.init();

//listeners
function listener(buttonClass, targetClass, event, state, cb){
	var addElementListener = document.getElementsByClassName(buttonClass)[0];
	var target = document.getElementsByClassName(targetClass)[0];
	addElementListener.addEventListener(event,
	e => {
		if(state)target.style.display = state;
		if(cb)cb(target, e);
	});
}

function stopVideo(target){
	var getVideoPlayer = target.querySelector('iframe');
	var temp = getVideoPlayer.src;
	getVideoPlayer.src = temp;
}

function formAction(placeholder, e){
	e.preventDefault();
	// e.target.elements[0].value,e.target.elements[1].value,e.target.elements[2].value,e.target.elements[3].value
	e.target.reset();
}

listener('button__video', 'container__video', 'click', 'block');
listener('button__instruct', 'container__video__instr', 'click', 'block');
listener('container__video__instr', 'container__video__instr', 'click', 'none', stopVideo);
listener('container__video', 'container__video', 'click', 'none', stopVideo);

listener('form', null, 'submit', null, formAction);
