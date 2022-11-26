/*
=========================== WEBGL HELPER ========================
*/
function createArrFloatBuffer(gl, data){
    let newBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
    // fill the buffer with passed data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    // unbind the array buffer just in case
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return newBuffer;
}

function createElementArrUintBuffer(gl, data){
    let newBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, newBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

    // unbind the array buffer just in case
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
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

document.getElementById("vX").oninput = reColorSlider;
document.getElementById("vY").oninput = reColorSlider;
document.getElementById("vZ").oninput = reColorSlider;

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