"use strict";

var canvas;
var gl;

var red=1,green=0,blue=0,xPos=0,yPos=0,rotation=0,sX=1,sY=1;

var bufferName, bufferSurname, nameVertices, surnameVertices,poss;
var vPosition;
var transformationMatrix, transformationMatrixLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGLQ
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var fColorLocation = gl.getUniformLocation(program, "FragColor");
		var translationLocation = gl.getUniformLocation(program, "u_translation");
		var rotationLocation = gl.getUniformLocation(program, "u_rotation");

    gl.uniform4f(fColorLocation, red, green, blue, 1); //default color

    // Make the letters
    nameVertices = [

				-0.5,-0.2,
				-0.4,-0.2,
				-0.5,0.2,

				-0.5,0.2,
				-0.4,-0.2,
				-0.4,0.2,

				-0.5,-0.2,
				-0.2,-0.2,
				-0.5,0,

				-0.1,-0.2,
				-0.4,-0.2,
				-0.1,0,

				-0.2,-0.2,
				-0.1,-0.2,
				-0.2,0.2,

				-0.2,0.2,
				-0.1,-0.2,
				-0.1,0.2,

				-0.5,0.2,
				-0.2,0.2,
				-0.5,0,

				-0.1,0.2,
				-0.4,0.2,
				-0.1,0,

				-0.4,0.4,
				-0.3,0.3,
				-0.5,0.3,

				-0.2,0.4,
				-0.1,0.3,
				-0.3,0.3,
    ];

    surnameVertices = [


				0.3,-0.2,
				0.2,-0.2,
				0.3,0.1,

				0.3,0.1,
				0.2,-0.2,
				0.2,0.1,

				0.1,0.4,
				0,0.3,
				0.2,0.1,

				0.5,0.3,
				0.4,0.4,
				0.3,0.1,
    ];


    // Load the data into the GPU
    bufferName = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferName );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nameVertices), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferSurname = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSurname );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(surnameVertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );

    document.getElementById("inp_objX").oninput = function(event) {
			xPos = (document.getElementById("inp_objX").value);

    };
    document.getElementById("inp_objY").oninput = function(event) {
		 	yPos = (document.getElementById("inp_objY").value);
    };
    document.getElementById("inp_obj_scaleX").oninput = function(event) {
      sX = (document.getElementById("inp_obj_scaleX").value);
    };
    document.getElementById("inp_obj_scaleY").oninput = function(event) {
        sY = (document.getElementById("inp_obj_scaleY").value);
    };
    document.getElementById("inp_rotation").oninput = function(event) {
       rotation  = (document.getElementById("inp_rotation").value);
			 console.log(rotation);
    };
    document.getElementById("redSlider").oninput = function(event) {

        red = (document.getElementById("redSlider").value);
        console.log("RedValue:"+red);
        gl.uniform4f(fColorLocation, red, green, blue, 1);

    };
    document.getElementById("greenSlider").oninput = function(event) {
        green = (document.getElementById("greenSlider").value);
        console.log("GreenValue:"+green);
        gl.uniform4f(fColorLocation, red, green, blue, 1);
    };
    document.getElementById("blueSlider").oninput = function(event) {
        blue = (document.getElementById("blueSlider").value);
        console.log("BlueValue:"+blue);
        gl.uniform4f(fColorLocation, red, green, blue, 1);

    };

    render();

};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );


    transformationMatrix = mat4();
    //transformationMatrix = translate(xPos,yPos,0);

		transformationMatrix = mult(transformationMatrix, translate(xPos, yPos, 0));
	  transformationMatrix = mult(transformationMatrix, rotate(rotation, 0, 0, 1));
	  transformationMatrix = mult(transformationMatrix, scalem(sX, sY, 0));

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );


    gl.bindBuffer( gl.ARRAY_BUFFER, bufferName );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLES, 0, 30 );


    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSurname );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLES, 0, 12 );

    window.requestAnimFrame(render);
}
