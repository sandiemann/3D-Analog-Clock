/*jslint es6 */

//default settings
const clockSettings = {
	
	radius:10,
	height:1,
	radiusBlob:0.5,
	heightBlob:3,
	radiusHour:2.5,
	radiusMin:3,
	radiusSec:4,
	numOfClock:2,
	frontClock:0,
	backClock:1,
	lineWidth:0.2,
	lineHeight:1,
	lineShortWidth:0.2,
	lineShortHeight:0.5,
	numOfMinutes:60,
	timeOffsetCET:30,
	timeOffsetIST:10
	
	
};

 
// Initialize webGL
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas : canvas});
//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('white');    // set background color

// Create a new Three.js scene with camera and light
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 10000);
camera.position.set(0,0,30);
camera.lookAt(scene.position);   // camera looks at origin
const ambientLight = new THREE.AmbientLight(0x707070);
scene.add(ambientLight);

// texture loader
const txtLoader = new THREE.TextureLoader();
const texture = txtLoader.load("screenshot/india.png");


//key control on 'r' or 'R' 
function keyControl(event) {
	console.log(event.keyCode);
	if(event.keyCode === 82 || event.keyCode === 114){
		controls.reset();  // reset the control on key hit
	}
		
}
document.addEventListener("keydown", keyControl);


// create cylinder geometry
const geometry = new THREE.CylinderGeometry( clockSettings.radius, clockSettings.radius, clockSettings.height, 60 );
const material = new THREE.MeshBasicMaterial( {color: 'white', wireframe:false, map:texture} );
const cylinder = new THREE.Mesh( geometry, material );

cylinder.rotation.x = (Math.PI/2);
scene.add( cylinder );

// create Lathe geometry
let points=[];
const frameThickness=1;

points.push(new THREE.Vector2(clockSettings.radius, clockSettings.height/2 + frameThickness));
points.push(new THREE.Vector2(clockSettings.radius , clockSettings.height/2 - frameThickness));
points.push(new THREE.Vector2(clockSettings.radius + frameThickness , clockSettings.height/2 - frameThickness));
points.push(new THREE.Vector2(clockSettings.radius + frameThickness , clockSettings.height/2 + frameThickness));	
points.push(new THREE.Vector2(clockSettings.radius, clockSettings.height/2 + frameThickness));

const latheGeo = new THREE.LatheGeometry( points, 60 );
const latheMat = new THREE.MeshBasicMaterial( { color: "black" } );
const lathe = new THREE.Mesh( latheGeo, latheMat );
cylinder.add( lathe ); 


// create blob
const blobGeo = new THREE.CylinderGeometry( clockSettings.radiusBlob, clockSettings.radiusBlob, clockSettings.heightBlob, 32 );
const blob = new THREE.Mesh(blobGeo, new THREE.MeshBasicMaterial( {color: 'red'} ));
cylinder.add(blob);



//**** For CET ****//

// create hourHand for Central European Time (CET)
const hourGeoCET = new THREE.SphereGeometry( clockSettings.radiusHour, 10, 10 );
hourGeoCET.scale(0.03, 0.03, 1);
const hourHandCET = new THREE.Mesh(hourGeoCET, new THREE.MeshPhongMaterial({color: "black"}));
blob.add(hourHandCET);


// create minuteHand for Central European Time (CET)
const minuteGeoCET = new THREE.SphereGeometry( clockSettings.radiusMin, 10, 10 );
minuteGeoCET.scale(0.03, 0.03, 1);
const minuteHandCET = new THREE.Mesh(minuteGeoCET, new THREE.MeshPhongMaterial({color: "black"}));
blob.add(minuteHandCET);


// create secondHand for Central European Time (CET)
const secGeoCET = new THREE.SphereGeometry( clockSettings.radiusSec, 10, 10 );
secGeoCET.scale(0.03, 0.03, 1);
const secHandCET = new THREE.Mesh(secGeoCET, new THREE.MeshPhongMaterial({color: "black"}));
blob.add(secHandCET);


//**** For IST ****//

// create hourHand for Indian Standard Time (IST)
const hourGeoIST = new THREE.SphereGeometry( clockSettings.radiusHour, 10, 10 );
hourGeoIST.scale(0.03, 0.03, 1);
const hourHandIST = new THREE.Mesh(hourGeoIST, new THREE.MeshPhongMaterial({color: "black"}));
blob.add(hourHandIST);


// create minuteHand for Indian Standard Time (IST)
const minuteGeoIST = new THREE.SphereGeometry( clockSettings.radiusMin, 10, 10 );
minuteGeoIST.scale(0.03, 0.03, 1);
const minuteHandIST = new THREE.Mesh(minuteGeoIST, new THREE.MeshPhongMaterial({color: "black"}));
blob.add(minuteHandIST);


// create secondHand for Indian Standard Time (IST)
const secGeoIST = new THREE.SphereGeometry( clockSettings.radiusSec, 10, 10 );
secGeoIST.scale(0.03, 0.03, 1);
const secHandIST = new THREE.Mesh(secGeoIST, new THREE.MeshPhongMaterial({color: "black"}));
blob.add(secHandIST);


for (let i=0; i<clockSettings.numOfClock; i++){
		
	/* check if the clock is front sided i.e. '0' */	
	if(i==clockSettings.frontClock){
		
		for(let j=0; j<clockSettings.numOfMinutes; j++){

			const frontAngle = ((2*Math.PI)/60) * j;
			const frontSide =  clockSettings.height / 2;
			
			/* check to mark twelve o'clock position */	
			if(j === 30){
				
				createLineGeometry(cylinder, clockSettings.lineWidth, clockSettings.lineHeight, "red", frontAngle, frontSide);

			}
			/* check for bigger ticks in every five minutes */	
			else if(j%5 === 0){
				
				createLineGeometry(cylinder, clockSettings.lineWidth, clockSettings.lineHeight, "blue", frontAngle, frontSide); // create box geomentry for every five minutes

			}
			/* check for smaller ticks in every minutes */
			else{
				
				createLineGeometry(cylinder, clockSettings.lineShortWidth, clockSettings.lineShortHeight, "black", frontAngle, frontSide); // create box geomentry for every minute
				
			}
	}
  }
  /* check if the clock is back sided i.e. '1' */
  else if(i==clockSettings.backClock){
	  
	  for(let k=0; k<clockSettings.numOfMinutes; k++){

			const backAngle = ((2*Math.PI)/60) * k;
			const backSide =  -(clockSettings.height / 2);

			/* check to mark twelve o'clock position */	
			if(k === 30){
				
				createLineGeometry(cylinder, clockSettings.lineWidth, clockSettings.lineHeight, "red", backAngle, backSide);

			}
			/* check for bigger ticks in every five minutes */
			else if(k%5 === 0){
				
				createLineGeometry(cylinder, clockSettings.lineWidth, clockSettings.lineHeight, "blue", backAngle, backSide); // create box geomentry for every five minutes

			}
			/* check for smaller ticks in every minutes */
			else{
				
				createLineGeometry(cylinder, clockSettings.lineShortWidth, clockSettings.lineShortHeight, "black", backAngle, backSide); // create box geomentry for every minute
				
			}
	}  
  }
  
}


// Draw everthing			
const controls = new THREE.TrackballControls( camera, canvas );
const clock = new THREE.Clock();
function render(){
	
	update();  // here the update function is called
	requestAnimationFrame(render);
	controls.update();
	renderer.render(scene, camera);
}
		
render();


//** this function creates the box geometry for the ticks depending on the width, height, color, angle, side **//
function createLineGeometry(container, width, height, color, angle, side){
	
	const lineGeometry = new THREE.BoxGeometry(width, height, 0.08);	 
	const line = new THREE.Mesh(lineGeometry, new THREE.MeshPhongMaterial({color: color}));
	line.position.z =Math.cos(angle)*( clockSettings.radius - 0.6);
	line.position.y= side;
	line.position.x= Math.sin(angle)*( clockSettings.radius - 0.6);
	line.rotateY(angle);
	line.rotateX(Math.PI/2);
	container.add(line);
	
}




//** this function updates the hour, min & sec hand **//
function update(){
	
const date = new Date();
const hour = date.getHours()%12;
const minute = date.getMinutes();
const seconds = date.getSeconds();

//**** For CET ****//
const hourCET =(2*Math.PI) - ((Math.PI/6)*(hour + clockSettings.timeOffsetCET));
const minCET = (2*Math.PI) - ((Math.PI/30)*(minute + clockSettings.timeOffsetCET));
const secCET = (2*Math.PI) - (Math.PI/30)* seconds;

//**** For IST ****//
const hourIST = ((Math.PI/6)*(hour + clockSettings.timeOffsetIST));
const minIST =  (Math.PI/30)*minute;
const secIST =  (Math.PI/30)* seconds;


//**** For CET ****//
hourHandCET.position.x = (clockSettings.radiusHour)*Math.sin(hourCET);
hourHandCET.position.y = clockSettings.height + 0.001;
hourHandCET.position.z = (clockSettings.radiusHour)*Math.cos(hourCET);
hourHandCET.rotation.y = hourCET;

minuteHandCET.position.x = (clockSettings.radiusMin)*Math.sin(minCET);
minuteHandCET.position.y = clockSettings.height + 0.002;
minuteHandCET.position.z = (clockSettings.radiusMin)*Math.cos(minCET);
minuteHandCET.rotation.y = minCET;

secHandCET.position.x = (clockSettings.radiusSec)*Math.sin(secCET);
secHandCET.position.y =  clockSettings.height + 0.003;
secHandCET.position.z = (clockSettings.radiusSec)*Math.cos(secCET);
secHandCET.rotation.y = secCET;


//**** For IST ****//
hourHandIST.position.x = (clockSettings.radiusHour)*Math.sin(hourIST);
hourHandIST.position.y = -(clockSettings.height + 0.001);
hourHandIST.position.z = (clockSettings.radiusHour)*Math.cos(hourIST);
hourHandIST.rotation.y = hourIST;

minuteHandIST.position.x = (clockSettings.radiusMin)*Math.sin(minIST);
minuteHandIST.position.y = -(clockSettings.height + 0.002);
minuteHandIST.position.z = (clockSettings.radiusMin)*Math.cos(minIST);
minuteHandIST.rotation.y = minIST;

secHandIST.position.x = (clockSettings.radiusSec)*Math.sin(secIST);
secHandIST.position.y = -(clockSettings.height + 0.003);
secHandIST.position.z = (clockSettings.radiusSec)*Math.cos(secIST);
secHandIST.rotation.y = secIST;

	
}