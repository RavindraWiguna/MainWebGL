function main(){
    // prerequisite
    let canvas  = document.getElementById("myCanvas");
    let gl      = canvas.getContext("webgl");
    let mat4    = glMatrix.mat4;
    let vec3    = glMatrix.vec3;

    // define object
    let canOpener1  = generateHollowTube(SIDE_CANOP, HEIGHT_CANOP, [R_CANOP, R_OUTER_CANOP], [CX_CANOP, CY, CZ_CANOP], 0);
    let canOpener2  = generateHollowTube(SIDE_CANOP, HEIGHT_CANOP, [R_CANOP, R_OUTER_CANOP], [-CX_CANOP, CY, -CZ_CANOP], canOpener1[OFFSET]);
    let topRing     = generateHollowTube(SIDE, HEIGHT_TOP_RING, [R_TOP_RING, R_OUTER_TOP_RING], [CX,CY,CZ], canOpener2[OFFSET]);
    let bridge      = generateTubeLike(SIDE, HEIGHT_BRIDGE, [R_OUTER_TOP_RING, R_OUTER_BRIDGE], [CX, CY_BRIDGE, CZ], topRing[2]);
    let bodyindices = generateTubeLikeBodyIndices(SIDE, bridge[2]-SIDE-1);
    let bottomBody  = generateCircle(SIDE, R_OUTER_BRIDGE, [CX, CY_BOTTOM_BODY, CZ], bridge[2]);
    let bridge2     = generateTubeLike(SIDE, HEIGHT_BRIDGE_2/2, [R_OUTER_BRIDGE, R_OUTER_BRIDGE-0.05], [CX, CY_BOTTOM_BODY, CZ], bottomBody[OFFSET]);
    let bottomRing  = generateHollowTube(SIDE, HEIGHT_TOP_RING, [R_OUTER_BRIDGE-0.1, R_OUTER_BRIDGE], [CX,CY_BOTTOM_RING+HEIGHT_BRIDGE_2/2,CZ], bridge2[OFFSET]);

    // define its color
    let colorCanop1     = generateHollowTubeColor(SIDE_CANOP, COLOR_CANOP, COLOR_CANOP);
    let colorCanop2     = generateHollowTubeColor(SIDE_CANOP, COLOR_CANOP, COLOR_CANOP);
    let colorRing       = generateHollowTubeColor(SIDE, COLOR_TOP_RING, COLOR_TOP_RING);
    let colorBridge     = generateTubeLikeColor(SIDE, COLOR_BRIDGE_1, COLOR_BRIDGE_2);
    let colorBottomBody = generateCircleColor(SIDE, COLOR_BRIDGE_2);
    let colorBridge2    = generateTubeLikeColor(SIDE, COLOR_BRIDGE_2, COLOR_BRIDGE_1);

    // combine vertices & indices & colors
    let vertices = [];
    let indices = [];
    let colors = [];
    vertices =  vertices.concat(
                canOpener1[0],
                canOpener2[0],
                topRing[0], 
                bridge[0], 
                bottomBody[0],
                bridge2[0],
                bottomRing[0],
                );
    indices  =  indices.concat(
                canOpener1[1],
                canOpener2[1],
                topRing[1], 
                bridge[1], 
                bodyindices, 
                bottomBody[1],
                bridge2[1],
                bottomRing[1],
                );    
    colors  =   colors.concat(
                colorCanop1, 
                colorCanop2, 
                colorRing, 
                colorBridge, 
                colorBottomBody,
                colorBridge2,
                colorRing,
                );
    
    // membuat buffer-buffer yang akan digunakan
    let vertexBuffer = createArrBuffer(gl, gl.ARRAY_BUFFER, vertices, Float32Array, gl.STATIC_DRAW);
    let colorBuffer = createArrBuffer(gl, gl.ARRAY_BUFFER, colors, Float32Array, gl.STATIC_DRAW);
    let indexBuffer = createArrBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices, Uint16Array, gl.STATIC_DRAW);

    // membuat&compile vertex shader
    let vertexShader = createShader(gl, "vertexShaderCode", gl.VERTEX_SHADER);
    
    // sama, tetapi fragment shader
    let fragmentShader = createShader(gl, "fragmentShaderCode", gl.FRAGMENT_SHADER);

    // membuat program gl dan menambahkan shader ke program tersebut
    let program = makeProgram(gl, vertexShader, fragmentShader);

    // bind vertex buffer ke atribut aPosition
    bindAttributeToBuffer(gl, program, "aPosition", vertexBuffer, 3, gl.FLOAT, false, 0, 0);

    // bind color buffer ke atribut aColor
    bindAttributeToBuffer(gl, program, "aColor", colorBuffer, 3, gl.FLOAT, false, 0, 0);
    
    // camera setting for matrix
    let camMatrix = createPVCameraMatrix(fov, canvas.width/canvas.height, near, far, camPos, target, up);
    // world matrix
    let modmatrix = mat4.create();

    // bind camera matrix to uniform + world too
    bindUniformToMatrix(gl, program, "uProj", camMatrix[0], false);
    bindUniformToMatrix(gl, program, "uView", camMatrix[1], false);
    bindUniformToMatrix(gl, program, "uModel", modmatrix, false);
    
    // light setting
    let ambientLight = [1.0, 1.0, 1.0];
    let intensity = [1.0, 1.0, 1.0];
    let ambientVec = vec3.fromValues(ambientLight[0], ambientLight[1], ambientLight[2]);
    let intensityVec = vec3.fromValues(intensity[0], intensity[1], intensity[2]);

    bindUniformToVec3(gl, program, "uAmbientLight", ambientVec);
    bindUniformToVec3(gl, program, "uIntensity", intensityVec);

    let animate = function(){
        // handle user input
        handleRotation(modmatrix);
        handleInputRotation(modmatrix);
        let ambient =  handleAmbientControl();
        ambientVec = ambient[0];
        intensityVec = ambient[1];

        prepareCanvas(gl, canvas);

        // update modmatrix kalau ada perubahan
        bindUniformToMatrix(gl, program, "uModel", modmatrix, false);
        // update ambient light kalau ada perubahan
        bindUniformToVec3(gl, program, "uAmbientLight", ambientVec);
        bindUniformToVec3(gl, program, "uIntensity", intensityVec);
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, Uint16Array.BYTES_PER_ELEMENT*0);

        window.requestAnimationFrame(animate);
    }    
    animate(0);    
}