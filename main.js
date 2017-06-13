(function() {


	function qs(el) {
		return document.querySelector(el);
	}

	

	//let imgOldDiameter = qs('.img-old-side');
	//let imgNewDiameter = qs('.img-new-side');




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


		//tire images
		oldImageFront = qs('#tireFrontImg'),
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
		newWidthDescr = qs('.new-width'),

		dms = document.querySelectorAll('.dimension'),

		//speed
		diamRate,
		deviceSpeedArrow = qs('#device-speed'),
		realSpeedArrow = qs('#real-speed'),
		deviceSpeedTxt = qs('#device-text'),
		realSpeedTxt = qs('#real-text'),
		deviceSpeedVal = qs('#device-value'),
		realSpeedVal = qs('#real-value'),
		up = qs('#up'),
		down = qs('#down'),
		

		//buttons
		mmBtn = qs('#mm'),
		inchBtn = qs('#inches'),
		calcBtn = qs('#calc_button'),
	
		mm = ' мм',
		inchQuot = '"',
		measurement = mm,
		inch = 2.54,
		imgWidth = 200,

		//arrays to store all values with measurement
		mmProps = [],
		inchProps = [],

		tableMethods = {
			
			fillTable: function(selector, oldValue, newValue) {
				selector.querySelector(oldClass).innerText = Math.round(oldValue);
				selector.querySelector(newClass).innerText = Math.round(newValue);
				selector.querySelector(diffClass).innerText = Math.round(newValue - oldValue);
			},

			getDiameter: function(oldWidth, newWidth, oldProfileHeight,
				newProfileHeight, oldDiscDiam, newDiscDiam) {

				let oldHeight = oldWidth * oldProfileHeight / 100;
				let newHeight = newWidth * newProfileHeight / 100;

				let oldDiscDiamMM = oldDiscDiam * inch * 10;
				let newDiscDiamMM = newDiscDiam * inch * 10

				let oldDiam = oldHeight * 2 + oldDiscDiamMM;
				let newDiam = newHeight * 2 + newDiscDiamMM;


				let diffDiam = newDiam - oldDiam;

				diamRate = newDiam/oldDiam;

				tableMethods.fillTable(diameter, oldDiam, newDiam);

				tableMethods.getCircumference(oldDiam, newDiam);
				tableMethods.getSideWallHeight(oldHeight, newHeight);
				tableMethods.getClearenceDiff(diffDiam);
				tableMethods.getSpeedDiff();

				imgMethods.setImageDimension(oldDiam, newDiam, oldWidth, newWidth, oldDiscDiamMM, newDiscDiamMM);
				
				
			},

			getWidth: function(oldWidth, newWidth) {
				tableMethods.fillTable(width, oldWidth, newWidth);
			},

			getCircumference: function(oldDiscDiam, newDiscDiam) {

				let oldCirc = Math.PI * oldDiscDiam;
				let newCirc = Math.PI * newDiscDiam;
				console.log(oldCirc);
				console.log(newCirc);
				tableMethods.fillTable(circumference, oldCirc, newCirc);

				tableMethods.getRevs(oldCirc, newCirc);
			},

			getSideWallHeight: function(oldProfileHeight, newProfileHeight) {
				tableMethods.fillTable(sidewallHeight, oldProfileHeight, newProfileHeight);
			},

			getRevs: function(oldCirc, newCirc) {

				let oldRevs = Math.round(1000000 / oldCirc);
				let newRevs = Math.round(1000000 / newCirc);

				tableMethods.fillTable(rev, oldRevs, newRevs);

			},

			getClearenceDiff: function(diffDiam) {
				clearence.querySelector(diffClass).innerText = 
					Math.round(diffDiam / 2);
			},

			getSpeedDiff: function() {
				let initialSpeed = deviceSpeedVal.value;
				let rate = 100*(1-diamRate)*initialSpeed/100;
				let realSpeed = (initialSpeed - rate).toFixed(1);

				let initialDeg = (initialSpeed - 100) * 2; 
				// 60km/h = -80deg; 1 km/h = 2deg
				let scaledRate = 2 * rate;
				
				deviceSpeedArrow.style.transform = 'rotateZ(' + initialDeg + 'deg)';
				realSpeedArrow.style.transform = 'rotateZ(' + (initialDeg - scaledRate) + 'deg)';
				
				deviceSpeedTxt.innerText = 'Скорость на спидометре, км/ч';
				realSpeedTxt.innerText = 'Реальная скорость, км/ч';

				deviceSpeedVal.value = initialSpeed;
				realSpeedVal.innerText = realSpeed;

			},

			storeData: function() {

				[].forEach.call(measure, function(el, i) {
					mmProps.push(el.innerText);
					inchProps.push((el.innerText / (
						inch * 10)).toFixed(1));
				});
			},

			setMeasure: function(prop) {
				
				[].forEach.call(measure, function(el, i) {
					el.innerText = prop[i] + measurement;
				});
			},

			calc: function() {

				let getDiameterOld = tireDiameterOld.value;
				let getDiameterNew = tireDiameterNew.value;

				let getHeightOld = tireHeightOld.value;
				let getHeightNew = tireHeightNew.value;

				let getWidthOld = tireWidthOld.value;
				let getWidthNew = tireWidthNew.value;

				tableMethods.getDiameter(getWidthOld, getWidthNew,
					getHeightOld, getHeightNew, 
					getDiameterOld, getDiameterNew);

				tableMethods.getWidth(getWidthOld, getWidthNew);

				//reset arrays to store new data
				mmProps = [];
				inchProps = [];

				tableMethods.storeData();

				if (!measurement || measurement === mm) {
					tableMethods.setMeasure(mmProps);
					imgMethods.setTitles(mmProps);
				} else {
					tableMethods.setMeasure(inchProps);
					imgMethods.setTitles(inchProps);
				}
				
			}
		}

	imgMethods = {
		
		setImageDimension: function(oldDiam, newDiam, oldWidth, newWidth, oldDiscDiam, newDiscDiam) {

			let scaledOldDiam = (oldDiam > newDiam) ? imgWidth : imgWidth / (newDiam / oldDiam);
			let scaledNewDiam = (oldDiam > newDiam) ? imgWidth / (oldDiam / newDiam) : imgWidth;

			let scaledOldWidth = oldWidth * scaledOldDiam / oldDiam;
			let scaledNewWidth = newWidth * scaledNewDiam / newDiam;

			let scaledOldDiscDiam = oldDiscDiam * scaledOldDiam / oldDiam;
			let scaledNewDiscDiam = newDiscDiam * scaledNewDiam / newDiam;

			//set dimensions of the old image

			oldImageFront.height = oldImageSide.width = oldImageSide.height = scaledOldDiam;
			oldImageFront.width = scaledOldWidth;
			oldImageDisc.width = scaledOldDiscDiam;

			//set dimensions of the new image

			newImageFront.height = newImageSide.width = newImageSide.height = scaledNewDiam;
			newImageFront.width = scaledNewWidth;
			newImageDisc.width = scaledNewDiscDiam;

			//set width of dimension's line of profile height
			oldSideHeightDescr.style.width = (scaledOldDiam - scaledOldDiscDiam) / 2 + 'px';
			newSideHeightDescr.style.width = (scaledNewDiam - scaledNewDiscDiam) / 2 + 'px';
			
		},

		setTitles: function(prop) {

			oldDiameterDescr.querySelector('div').innerText = prop[0] + measurement;
			newDiameterDescr.querySelector('div').innerText = prop[1] + measurement;

			oldWidthDescr.querySelector('div').innerText = prop[3] + measurement;
			newWidthDescr.querySelector('div').innerText = prop[4] + measurement;

			oldSideHeightDescr.querySelector('div').innerText = prop[9] + measurement;
			newSideHeightDescr.querySelector('div').innerText = prop[10] + measurement;
		
		}
			
	};

	mmBtn.addEventListener('click', function() {
		measurement = mm;
		inchBtn.style.backgroundColor = "#888";
		this.style.backgroundColor = "#00a8a8";
		tableMethods.setMeasure(mmProps);
		imgMethods.setTitles(mmProps);
	});

	inchBtn.addEventListener('click', function() {
		measurement = inchQuot;
		this.style.backgroundColor = "#00a8a8";
		mmBtn.style.backgroundColor = "#888";
		tableMethods.setMeasure(inchProps);
		imgMethods.setTitles(inchProps);
	});

	/*let select = document.querySelectorAll('select');
	[].forEach.call(select, function(sel) {
		sel.addEventListener('change', tableMethods.calc)
	});*/
	calcBtn.addEventListener('click', 
		tableMethods.calc);

	deviceSpeedVal.addEventListener('change', tableMethods.getSpeedDiff);

	up.addEventListener('click', function() {
		deviceSpeedVal.value++;
		tableMethods.getSpeedDiff();
	});

	down.addEventListener('click', function() {
		deviceSpeedVal.value--;
		tableMethods.getSpeedDiff();
	});
	
	window.addEventListener('load', tableMethods.calc);
})();
/*TASKS
* 1) reduce amount of global vars
* 2) rename some vars
* 3) to group event listeners
* 4) make style
*/