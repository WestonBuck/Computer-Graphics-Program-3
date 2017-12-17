///////////////////////////////////////////////////////////
//
// Weston Buck
// Program 4
//
// Bugs/Problems: None, other than not figuring out a way to do filling the circle without using globals. 
//
//////////////////////////////////////////////////////////

var numSlices = 15;       // How many vertices we want to start with.
var isFilled = false;     

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main( ) {

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }


  DrawPoints(gl, numSlices);


}

function DrawPoints(gl, numPoints)
{
  
  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl, numSlices);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  
    // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Check to see which type of rawing method we need to do.
  if (isFilled == false)
  {
    gl.drawArrays(gl.LINE_STRIP, 0, n);
  }
    // Draw the rectangle
  else
  {
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
      
  }
    
}

//Gets the circle base on how many points there are and how big the radius is.
function GetPoints(points)
{

  var newPoints = []; 
  var radius = 1.0;   //radius for the circle

  for (var i = 0; i < points; i++)
  {
      newPoints.push((radius * Math.cos((i / points) * 2.0 * Math.PI)));

      newPoints.push(radius * Math.sin((i / points) * 2.0 * Math.PI));

  }

  newPoints.push(newPoints[0]);
  newPoints.push(newPoints[1]);

  return newPoints;
}

//Increase the amount of vertices in the circle by 2. Can be changed to increase by more or less if needed.
function upVertices()
{
  numSlices += 2;
  main();
}

//Decrease the amount of vertices in the circle by 2. Don't let it go below 3 so it oesn't disappear.
function downVertices()
{
  if (numSlices == 3)
  {
    //do nothing
  } 
  else
  {
    numSlices -= 2;
    main();
  }
}

// this gets called when we click the button to select if the circle is filled or not. re reraw the whole scene with the set with its new value.
function redraw()
{
  if (isFilled == false)
  {
    isFilled = true;
    main();
  }

  else 
  {
    isFilled = false;
    main();
  }
}
function initVertexBuffers(gl, numVertices) {

  var n = numVertices + 1; // The number of vertices
  var vertices = new Float32Array( GetPoints(numVertices));

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
　// Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}
