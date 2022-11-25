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

function debug(text){
    let debug = document.getElementById("d");
    debug.textContent=text;
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