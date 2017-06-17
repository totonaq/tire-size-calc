(function() {

	function qs(el) {
		return document.querySelector(el);
	}
	const inch = 2.54,
		mm = ' мм',
		inchQuote = '"';

	let measurement = mm;

	let table = qs('#results'),

		//main selectors
		diameter = qs('#diameter'),
		width = qs('#width'),
		circumference = qs('#circumference'),
		sidewallHeight = qs('#sidewall_height'),
		rev = qs('#rev'),
		clearence = qs('#clearence'),

		//classes for insertions
		oldClass = '.old',
		newClass = '.new',
		diffClass = '.diff',

		//store all td's that need measurement
		measure = document.querySelectorAll('.measure'),

		//selects
		tireDiameterOld = qs('#tire_diameter_old'),
		tireDiameterNew = qs('#tire_diameter_new'),

		tireHeightOld = qs('#tire_height_old'),
		tireHeightNew = qs('#tire_height_new'),

		tireWidthOld = qs('#tire_width_old'),
		tireWidthNew = qs('#tire_width_new'),

		///
		oldSide = qs('.img-old-side'),
		oldFront = qs('.img-old-front'),
		newSide = qs('.img-new-side'),
		newFront = qs('.img-new-front'),


		//tire images
		/*oldImageFront = qs('#tireFrontImg'),
		oldImageSide = qs('#tireSideImg'),
		oldImageDisc = qs('#tireDiscImg'),

		newImageFront = qs('#tireFrontImgNew'),
		newImageSide = qs('#tireSideImgNew'),
		newImageDisc = qs('#tireDiscImgNew'),

		//image descriptions
		oldDiameterDescr = qs('.old-diameter'),
		newDiameterDescr = qs('.new-diameter'),

		oldSideHeightDescr = qs('.old-side-height'),
		newSideHeightDescr = qs('.new-side-height'),

		oldWidthDescr = qs('.old-width'),
		newWidthDescr = qs('.new-width'),*/

		dms = document.querySelectorAll('.dimension'),

		//speed
		speedometer = qs('.speed-wrap'),

		
		deviceSpeedVal = qs('#device-value'),
		/*deviceSpeedArrow = qs('#device-speed'), //speedometer.childNodes[5].childNodes[3]
		realSpeedArrow = qs('#real-speed'), //speedometer.childNodes[7].childNodes[3]
		deviceSpeedTxt = qs('#device-text'), //speedometer.childNodes[1]
		realSpeedTxt = qs('#real-text'), //speedometer.childNodes[3]
		deviceSpeedVal = qs('#device-value'), //speedometer.childNodes[9].childNodes[3]
		realSpeedVal = qs('#real-value'), //speedometer.childNodes[11]*/
		up = qs('#up'),
		down = qs('#down'),
		

		//buttons
		mmBtn = qs('#mm'),
		inchBtn = qs('#inches'),
		calcBtn = qs('#calc_button'),
		switcher = qs('#switch-bg'),
	
		/*mm = ' мм',
		inchQuote = '"',
		measurement = mm,*/

		//arrays to store all values with measurement
		//mmProps = [],
		//inchProps = [],



		tableMethods = {

			imgWidth: 200,
			maxSpeed: 140,
			minSpeed: 0,
			defaultSpeed: 60,
			initSpeedTxt: 'Скорость на спидометре, км/ч',
			realSpeedTxt: 'Реальная скорость, км/ч',

			
			fillTable: function(selector, oldValue, newValue) {
				selector.querySelector(oldClass).innerText = Math.round(oldValue);
				selector.querySelector(newClass).innerText = Math.round(newValue);
				selector.querySelector(diffClass).innerText = Math.round(newValue - oldValue);
			},

			getTableParams: function() {

				//VALUE FROM SELECT
				this.oldDiscDiam = tireDiameterOld.value;
				this.newDiscDiam = tireDiameterNew.value;

				this.oldProfileHeight = tireHeightOld.value;
				this.newProfileHeight = tireHeightNew.value;

				this.oldWidth = tireWidthOld.value;
				this.newWidth = tireWidthNew.value;

				//CALCULATED VALUES
				this.oldHeight = this.oldWidth * this.oldProfileHeight / 100;
				this.newHeight = this.newWidth * this.newProfileHeight / 100;

				this.oldDiscDiamMM = this.oldDiscDiam * inch * 10;
				this.newDiscDiamMM = this.newDiscDiam * inch * 10;

				this.oldDiam = this.oldHeight * 2 + this.oldDiscDiamMM;
				this.newDiam = this.newHeight * 2 + this.newDiscDiamMM;

				this.oldCirc = Math.PI * this.oldDiam;
				this.newCirc = Math.PI * this.newDiam;

				this.oldRevs = Math.round(1000000 / this.oldCirc);
				this.newRevs = Math.round(1000000 / this.newCirc);

				this.diffDiam = this.newDiam - this.oldDiam;

				this.diamRate = this.newDiam/this.oldDiam;

			},

			setTableParams: function() {
				this.setDiameter(this.oldDiam, this.newDiam);
				this.setWidth(this.oldWidth, this.newWidth);
				this.setCircumference(this.oldCirc, this.newCirc);
				this.setSideWallHeight(this.oldHeight, this.newHeight);
				this.setRevs(this.oldRevs, this.newRevs);
				this.setClearenceDiff(this.diffDiam);
			},

			setDiameter: function(o, n) {
				this.fillTable(diameter, o, n);
			},

			setWidth: function(o, n) {
				this.fillTable(width, o, n);
			},

			setCircumference: function(o, n) {
				this.fillTable(circumference, o, n);
			},

			setSideWallHeight: function(o, n) {
				this.fillTable(sidewallHeight, o, n);
			},

			setRevs: function(o, n) {
				this.fillTable(rev, o, n);
			},

			setClearenceDiff: function(diff) {
				clearence.querySelector(diffClass).innerText = 
					Math.round(diff / 2);
			},

			storeData: function() {

				[].forEach.call(measure, function(el, i) {
					tableMethods.mmProps.push(el.innerText);
					tableMethods.inchProps.push((el.innerText / (
						inch * 10)).toFixed(1));
				});
			},

			setMeasure: function(prop) {
				
				[].forEach.call(measure, function(el, i) {
					el.innerText = prop[i] + measurement;
				});

			},

			getImageParams: function() {

				 this.scaledOldDiam = (this.oldDiam > this.newDiam) ? this.imgWidth : 
				 	this.imgWidth / (this.newDiam / this.oldDiam);
				 this.scaledNewDiam = (this.oldDiam > this.newDiam) ? this.imgWidth / 
				 	(this.oldDiam / this.newDiam) : this.imgWidth;

				 this.scaledOldWidth = this.oldWidth * this.scaledOldDiam / this.oldDiam;
				 this.scaledNewWidth = this.newWidth * this.scaledNewDiam / this.newDiam;

				 this.scaledOldDiscDiam = this.oldDiscDiamMM * this.scaledOldDiam / this.oldDiam;
				 this.scaledNewDiscDiam = this.newDiscDiamMM * this.scaledNewDiam / this.newDiam;
			},

			setImageParams: function() {

				//set dimensions of the old images
				oldFront.childNodes[1].height = oldSide.childNodes[1].width = 
					oldSide.childNodes[1].height = this.scaledOldDiam;

				oldFront.childNodes[1].width = this.scaledOldWidth;

				oldSide.childNodes[3].width = this.scaledOldDiscDiam;

				//set dimensions of the new images
				newFront.childNodes[1].height = newSide.childNodes[1].width = 
					newSide.childNodes[1].height = this.scaledNewDiam;

				newFront.childNodes[1].width = this.scaledNewWidth;

				newSide.childNodes[3].width = this.scaledNewDiscDiam;

				
			},

			setImageTitles: function(prop) {

				//set values to .descr-v ( < .*-diameter)
				oldSide.childNodes[5].childNodes[1].innerText = 
					prop[0] + measurement;
				newSide.childNodes[5].childNodes[1].innerText =
					prop[1] + measurement;

				//set values to .descr-h ( < .*-side-height)
				oldSide.childNodes[7].childNodes[1].innerText = 
					prop[9] + measurement;
				newSide.childNodes[7].childNodes[1].innerText = 
					prop[10] + measurement;

				//set values to .descr-h ( < .*-width)
				oldFront.childNodes[3].childNodes[1].innerText = 
					prop[3] + measurement;
				newFront.childNodes[3].childNodes[1].innerText = 
					prop[4] + measurement;

			},

			setImageTitlesWidth: function() {

				oldSide.childNodes[7].childNodes[1].style.width = 
					(this.scaledOldDiam - this.scaledOldDiscDiam) / 2 + 'px';

				newSide.childNodes[7].childNodes[1].style.width = 
					(this.scaledNewDiam - this.scaledNewDiscDiam) / 2 + 'px';
			},

			setSpeedParams: function() {
				this.getSpeedDiff();
				this.setSpeedDiff();
				this.getArrowsDeg();
				this.setArrowsDeg();
			},

			getSpeedDiff: function() {

				this.initialSpeed = deviceSpeedVal.value;
				
				if (isNaN(this.initialSpeed)) this.initialSpeed = this.defaultSpeed;

				if (this.initialSpeed < this.minSpeed) this.initialSpeed = this.minSpeed;
				if (this.initialSpeed > this.maxSpeed) this.initialSpeed = this.maxSpeed;
				
				let speedRate = (1 - this.diamRate) * this.initialSpeed;
				this.realSpeed = (this.initialSpeed - speedRate).toFixed(1);
				
			},

			setSpeedDiff: function() {

				speedometer.childNodes[1].innerText = this.initSpeedTxt;
				speedometer.childNodes[3].innerText = this.realSpeedTxt;

				speedometer.childNodes[9].childNodes[3].value = this.initialSpeed;
				speedometer.childNodes[11].innerText = this.realSpeed;
			},

			getArrowsDeg: function() {

				this.initialDeg = this.initialSpeed * 2 - 190;
				this.realDeg = this.realSpeed * 2 - 190;

				if (this.initialDeg < -90) {
					this.initialDeg = -90;
				} else if (this.initialDeg > 90) {
					this.initialDeg = 90;
				} 
				if (this.realDeg < -90) {
					this.realDeg = -90;
				} else if (this.realDeg > 90) {
					this.realDeg = 90;
				}
			},

			setArrowsDeg: function() {

				speedometer.childNodes[5].childNodes[3].style.transform = 
					'rotateZ(' + this.initialDeg + 'deg)';
				speedometer.childNodes[7].childNodes[3].style.transform = 
					'rotateZ(' + this.realDeg + 'deg)';
			},

			calc: function() {

				tableMethods.getTableParams();
				tableMethods.setTableParams();

				tableMethods.getImageParams();
				tableMethods.setImageParams();

				tableMethods.setImageTitlesWidth();
			
				//reset arrays to store new data
				tableMethods.mmProps = [];
				tableMethods.inchProps = [];

				tableMethods.storeData();

				if (measurement === mm) {
					tableMethods.setMeasure(tableMethods.mmProps);
					tableMethods.setImageTitles(tableMethods.mmProps);
				} else {
					tableMethods.setMeasure(tableMethods.inchProps);
					tableMethods.setImageTitles(tableMethods.inchProps);
				}

				tableMethods.setSpeedParams();
				
			},

			measureBtnClick: function(target, prop, translate, measure) {
				target.addEventListener('click', function() {
					measurement = measure;
					inchBtn.className = mmBtn.className = "change-out",
					this.className = "change-in";
					switcher.style.transform = "translateX(" + translate + ")";
					tableMethods.setMeasure(prop);
					tableMethods.setImageTitles(prop);
				})
			},

			speedBtnClick: function(target) {
				target.addEventListener('click', function() {
					target === up ? deviceSpeedVal.value++ : 
						deviceSpeedVal.value--;
					tableMethods.setSpeedParams();
				})
			},

			speedValChange: function() {
				deviceSpeedVal.addEventListener('change', function() {
					tableMethods.setSpeedParams();
				});
			}

		}


	

	/*deviceSpeedVal.addEventListener('change', function() {
		tableMethods.setSpeedParams();
	});

	up.addEventListener('click', function() {
		deviceSpeedVal.value++;
		tableMethods.setSpeedParams();
	});

	down.addEventListener('click', function() {
		deviceSpeedVal.value--;
		tableMethods.setSpeedParams();
	});*/

	//tableMethods.upClick;
	//tableMethods.upClick;
	calcBtn.addEventListener('click', 
		tableMethods.calc);
	
	window.addEventListener('load', function() {
		tableMethods.calc();
		tableMethods.measureBtnClick(mmBtn, 
			tableMethods.mmProps, '0', mm);
		tableMethods.measureBtnClick(inchBtn, 
			tableMethods.inchProps, '100%', inchQuote);
		tableMethods.speedBtnClick(up);
		tableMethods.speedBtnClick(down);
		tableMethods.speedValChange();
	});
})();
/*TASKS
* 1) 
* 2) 
* 3) 
* 4) 
* 5) 
*/