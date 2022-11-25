function main(){
    let canvas = document.getElementById("myCanvas");
    let gl = canvas.getContext("webgl");
    let mat4 = glMatrix.mat4;

    let side = 72;
    let radiusI = 1.1;
    let radiusO = 1.2;
    let height = 0.1;
    let baseH = 1.5;
    // let mesh = generateTubeLike(side, height, [radius, radius+0.1], [0.0, 0.0, 0.0], 0);
    // let mesh = generateHollowCircle(side, [radius,1.5*radius], [0.0, 0.0, 0.0], 0);
    // let mesh2 = generateTubeLike(10, 1, 0.25, [0.0, 1.0, 0.0], mesh[2]);
    let topKaleng = generateHollowTube(side, height, [radiusI, radiusO], [0.0,0.0+baseH,0.0], 0);
    let bridge = generateTubeLike(side, 0.4, [radiusO, radiusO+0.15], [0.0, -height+baseH, 0.0], topKaleng[2]);
    let bodyindices = generateTubeLikeBodyIndices(side, bridge[2]-side-1);
    let bottom = generateCircle(side, radiusO+0.15, [0.0, -height-0.4-3.6+baseH, 0.0], bridge[2]);
    // alert(topKaleng[2]);
    let vertices = topKaleng[0];
    let indices = topKaleng[1];
    vertices = vertices.concat(bridge[0], bottom[0]);
    indices = indices.concat(bridge[1], bodyindices, bottom[1]);

    // let indices = generateTubeLikeBodyIndices(side, 0);
    // console.log(vertices);
    // console.log(indices);
    // vertices = vertices.concat(mesh2[0]);
    // indices = indices.concat(mesh2[1]);
    // console.log(vertices);
    // console.log(mesh2[0].length)
    // debug(indices.length);
    // getTriangleProperty([0,0],[3,4]);
    // let colortop = generateCircleColor(side, [0.25,0.25,0.75]);
    let colorbottom = generateHollowCircleColor(side, [1,0,1]);
    let colortop = generateHollowCircleColor(side, [1,1,0]);
    let colorTubeTop = generateCircleColor(side, [0,0.5,0.5]);
    let colorTubeBottom = generateCircleColor(side, [0.2,0.2,0.75]);
    let colorCir = generateCircleColor(side, [1,1,1]);
    let colors = [];
    colors = colors.concat(colortop, colorbottom, colorTubeTop, colorTubeBottom, colorCir);
    // let colors = generateHollowCircleColor(side, [1,0,1]);
    
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

    let camx = 3.0,camy=4.0,camz=10.0;
    // matrix that store where the 'camera' is, at what coordinate it looking, and which way is up
    mat4.lookAt(viewmatrix, [camx, camy, camz], [0,0,0], [0,1,0]);
    // matrix that store the perspective projection from the camera
    mat4.perspective(projmatrix, toRadian(45), canvas.width/canvas.height, 0.1, 1000);
    // matrix that store world transformation
    mat4.identity(modmatrix);


    let theta = glMatrix.glMatrix.toRadian(0.1);    
    let animate = function(){
        // mat4.rotateX(modmatrix, modmatrix, 3*theta);
        mat4.rotateY(modmatrix, modmatrix, 1*theta);
        // mat4.rotateZ(modmatrix, modmatrix, 5*theta);
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