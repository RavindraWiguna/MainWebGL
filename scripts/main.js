function main(){
    // prerequisite
    let canvas  = document.getElementById("myCanvas");
    let gl      = canvas.getContext("webgl");
    let mat4    = glMatrix.mat4;

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

    // combine vertices & indices
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
    let vertexBuffer = createArrFloatBuffer(gl, vertices);
    let colorBuffer = createArrFloatBuffer(gl, colors);
    let indexBuffer = createElementArrUintBuffer(gl, indices);

    // membuat&compile vertex shader
    let vertexShader = createShader(gl, "vertexShaderCode", gl.VERTEX_SHADER);
    // sama, tetapi fragment shader
    let fragmentShader = createShader(gl, "fragmentShaderCode", gl.FRAGMENT_SHADER);

    // membuat program gl dan menambahkan shader ke program tersebut
    let program = gl.createProgram();  
    gl.attachShader(program, vertexShader);   
    gl.attachShader(program, fragmentShader);   
    gl.linkProgram(program);
    gl.useProgram(program);

    //menambahkan vertices ke dalam aPosition dan aColor untuk digambar
    //position
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    //color
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);
    
    let Pmatrix = gl.getUniformLocation(program, "uProj");
    let Vmatrix = gl.getUniformLocation(program, "uView");
    let Mmatrix = gl.getUniformLocation(program, "uModel");
    
    let projmatrix = new Float32Array(16);
    let modmatrix = new Float32Array(16);
    let viewmatrix = new Float32Array(16);

    let camx = 3.0,camy=4.0,camz=8.0;
    // matrix that store where the 'camera' is, at what coordinate it looking, and which way is up
    mat4.lookAt(viewmatrix, [camx, camy, camz], [0,0,0], [0,1,0]);
    // matrix that store the perspective projection from the camera
    mat4.perspective(projmatrix, toRadian(45), canvas.width/canvas.height, 0.1, 1000);
    // matrix that store world transformation
    mat4.identity(modmatrix);

    let theta = glMatrix.glMatrix.toRadian(0.5);    
    let animate = function(){
        // mat4.rotateX(modmatrix, modmatrix, theta);
        mat4.rotateY(modmatrix, modmatrix, 1*theta);
        // mat4.rotateZ(modmatrix, modmatrix, theta);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);

        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(Pmatrix, false, projmatrix);
        gl.uniformMatrix4fv(Vmatrix, false, viewmatrix);
        gl.uniformMatrix4fv(Mmatrix, false, modmatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, Uint16Array.BYTES_PER_ELEMENT*0);
        // gl.drawElements(gl.TRIANGLES, indices.length/2, gl.UNSIGNED_SHORT, 72);

        window.requestAnimationFrame(animate);
    }    
    animate(0);    
}