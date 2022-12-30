/*
=========================== WEBGL HELPER ========================
*/
function createArrBuffer(gl, target, data, arrdtype, usage){
    let newBuffer = gl.createBuffer();
    gl.bindBuffer(target, newBuffer);
    // fill the buffer with passed data
    gl.bufferData(target, new arrdtype(data), usage);
    // unbind the array buffer just in case
    gl.bindBuffer(target, null);
    
    return newBuffer;
}

function createShader(gl, srcId, type){
    // get source code for the shader
    let shaderCode = document.getElementById(srcId).text;
    //membuat vertex shader
    let shader = gl.createShader( type );
    // mengset source code dari shader
    gl.shaderSource(shader, shaderCode);
    gl.compileShader(shader);
    return shader;
}

function prepareCanvas(gl, canvas){
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clearDepth(1.0);

    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function makeProgram(gl, vertexShader, fragmentShader){
    let program = gl.createProgram();  
    gl.attachShader(program, vertexShader);   
    gl.attachShader(program, fragmentShader);   
    gl.linkProgram(program);
    gl.useProgram(program);
    return program;
}

function bindAttributeToBuffer(gl, program, attribName, buffer, size, type, normalized, stride, offset){
    let attribLocation = gl.getAttribLocation(program, attribName);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribLocation, size, type, normalized, stride, offset);
    gl.enableVertexAttribArray(attribLocation);
}

function createPVCameraMatrix(fov, aspect, near, far, cameraPos, cameraTarget, cameraUp){
    let projectionMat = glMatrix.mat4.create();
    let viewMat = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projectionMat, fov, aspect, near, far);
    glMatrix.mat4.lookAt(viewMat, cameraPos, cameraTarget, cameraUp);
    return [projectionMat, viewMat];
}

function bindUniformToMatrix(gl, program, uniformName, matrix, transpose){
    let uniformLocation = gl.getUniformLocation(program, uniformName);
    gl.uniformMatrix4fv(uniformLocation, transpose, matrix);
}

function bindUniformToVec3(gl, program, uniformName, vec){
    let uniformLocation = gl.getUniformLocation(program, uniformName);
    gl.uniform3fv(uniformLocation, vec);
}

/*
===================== ANIMATION CONTROL HELPER ====================
*/

function reColorSlider(){
    let value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, #7c17f0 0%, #2e16de ' + value + '%, #fff ' + value + '%, white 100%)'
}

function getSliderValue(id){
    let slider = document.getElementById(id);
    return slider.value;
}

// assign event listener ke masing-masing slider
document.getElementById("vX").oninput = reColorSlider;
document.getElementById("vY").oninput = reColorSlider;
document.getElementById("vZ").oninput = reColorSlider;
document.getElementById("rR").oninput = reColorSlider;
document.getElementById("rG").oninput = reColorSlider;
document.getElementById("rB").oninput = reColorSlider;
document.getElementById("Intensity").oninput = reColorSlider;

function handleRotation(worldMatrix){
    let checkX = document.getElementById("RotateX");
    let checkY = document.getElementById("RotateY");
    let checkZ = document.getElementById("RotateZ");

    let angX = toRadian(getSliderValue("vX")/4);
    let angY = toRadian(getSliderValue("vY")/4);
    let angZ = toRadian(getSliderValue("vZ")/4);

    if(checkX.checked){
        glMatrix.mat4.rotateX(worldMatrix, worldMatrix, angX);
    }
    if(checkY.checked){
        glMatrix.mat4.rotateY(worldMatrix, worldMatrix, angY);
    }
    if(checkZ.checked){
        glMatrix.mat4.rotateZ(worldMatrix, worldMatrix, angZ);
    }
}
let keyboard = {};
function keyUp(event) {
    keyboard[event.keyCode] = false;
}
  
function keyDown(event) {
    keyboard[event.keyCode] = true;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

function handleInputRotation(worldMatrix){
    const SPEED = 0.32;
    if(keyboard[87]){
        // w, rotate x
        glMatrix.mat4.rotateX(worldMatrix, worldMatrix, toRadian(-SPEED));
    }
    if(keyboard[83]){
        // s
        glMatrix.mat4.rotateX(worldMatrix, worldMatrix, toRadian(SPEED));
    }
    if(keyboard[65]){
        //a
        glMatrix.mat4.rotateZ(worldMatrix, worldMatrix, toRadian(-SPEED));
    }
    if(keyboard[68]){
        // d
        glMatrix.mat4.rotateZ(worldMatrix, worldMatrix, toRadian(SPEED));
    }
    if(keyboard[74]){
        // j
        glMatrix.mat4.rotateY(worldMatrix, worldMatrix, toRadian(2*SPEED));
    }
    if(keyboard[75]){
        // k
        glMatrix.mat4.rotateY(worldMatrix, worldMatrix, toRadian(-2*SPEED));
    }
}

function handleAmbientControl(){
    let r = getSliderValue("rR")/255;
    let g = getSliderValue("rG")/255;
    let b = getSliderValue("rB")/255;
    // console.log(r, g, b);
    let intensity = getSliderValue("Intensity")/100;

    let ambientVec = glMatrix.vec3.fromValues(r, g, b);
    let intensityVec = glMatrix.vec3.fromValues(intensity, intensity, intensity);
    return [ambientVec, intensityVec];
}

/*
=============================== MATH HELPER =======================
*/

function toRadian(degree){
    return glMatrix.glMatrix.toRadian(degree);
}

function getMiddlePoint(pstart, pend){
    let x1 = pstart[0], y1 = pstart[1];
    let x2 = pend[0], y2 = pend[1];
    let dx = x2-x1;
    let dy = y2-y1;

    return [x1+dx*0.5, y1+dy*0.5];
}