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
================================== GEOMETRY HELPER ======================
*/

function generateCircle(side, radius, center){
    let cx = center[0];
    let cy = center[1];
    let cz = center[2];

    if(side < 3){
        alert("side can not be < 3");
        return; 
    }

    let increment = 2*Math.PI/side;
    let result = [cx, cy, cz];
    for(let i=0;i<side;i++){
        let theta = increment*i;
        let x = radius*Math.cos(theta) + cx;
        let z = -radius*Math.sin(theta) + cz;
        result.push(x,cy,z);
    }
    // debug(String(result.length)+' with side:'+String(fixside));
    return result;
}

function generateCircleColor(side, color){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }

    let r = color[0];
    let g = color[1];
    let b = color[2];
    let colors = [r,g,b]
    for(let i = 0;i<side;i++){
        colors.push(r, g, b);
    }
    return colors;
}

function generateCircleIndices(side, offset){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }
    let indices = [];
    for(let i = 0;i<side;i++){
        indices.push(0+offset,i+1+offset, (i+1)%side+1+offset);
    }
    return indices;
}

function generateTube(side, height, radius, center, offset){
    // vertex circle on the top
    let vertex = generateCircle(side, radius, center);
    // vertex circle on the bottom
    let bottom = generateCircle(side, radius, [center[0], center[1]-height, center[2]]);

    // combine vertex
    vertex = vertex.concat(bottom);

    // indices of circle on top
    let indices = generateCircleIndices(side, offset);
    let indicesBottom = generateCircleIndices(side, side+1+offset);
    let tubeIndices = generateTubeBodyIndices(side, offset);
    // merge indices
    indices = indices.concat(indicesBottom);
    indices = indices.concat(tubeIndices);
    let newOffset = side+1+offset+side+1;
    return [vertex, indices, newOffset];
}

function generateTubeBodyIndices(side, offset){
    let indices = []
    for(let i = 1;i<side;i++){
        indices.push(i+offset, i+side+1+offset, i+side+2+offset);
        indices.push(i+offset, i+1+offset, i+side+2+offset);
    }
    // agak ribet kalo mau 1 line, jadi tak pisah aja side terakhir
    indices.push(side+offset, side+side+1+offset, (side+side+1)%side+side+1+offset);
    indices.push(side+offset, 1+offset, (side+side+1)%side+side+1+offset);
    return indices;
}

/*
=============================== MATH HELPER =======================
*/

function toRadian(degree){
    return glMatrix.glMatrix.toRadian(degree);
}