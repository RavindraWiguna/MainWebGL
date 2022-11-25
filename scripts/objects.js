/*
================================== GEOMETRY & COLOR HELPER ======================
*/
const VERTEX = 0;
const INDICES = 1;
const OFFSET = 2;

function generateUniformColor(total, color){
    let r = color[0];
    let g = color[1];
    let b = color[2];
    let colors = [];
    for(let i = 0;i<total;i++){
        colors.push(r, g, b);
    }
    return colors;
}

// Generate vertices and indices of an approximate-circle
// return vertex, indice, offset
function generateCircle(side, radius, center, offset){
    let vertices = generateCircleVertices(side, radius, center);
    let indices = generateCircleIndices(side, offset);
    let newOffset = offset+side+1;
    return [vertices, indices, newOffset];
}

// Generate vertices of a circle by approximating it into N-side polygon
function generateCircleVertices(side, radius, center){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }

    let cx = center[0];
    let cy = center[1];
    let cz = center[2];
    let increment = 2*Math.PI/side;
    let vertices = [cx, cy, cz];
    for(let i=0;i<side;i++){
        let theta = increment*i;
        let x = radius*Math.cos(theta) + cx;
        let z = -radius*Math.sin(theta) + cz;
        vertices.push(x,cy,z);
    }
    return vertices;
}

// Generate Indices of a circle (N-polygon)
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

// Generate array of rgb color for each vertices of a circle
function generateCircleColor(side, color){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }
    return generateUniformColor(side+1, color);
}

// Generate vertices and indices of a hollow circle
function generateHollowCircle(side, radius, center, offset){
    let vertices = generateHollowCircleVertices(side, radius, center);
    let indices = generateHollowCircleIndices(side, offset);
    let newOffset = offset+3*side;
    return [vertices, indices, newOffset];
}

// Generate vertices of a hollow circle by using trapezoid in between 2 circle
function generateHollowCircleVertices(side, radius, center){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }
    let cx = center[0], cy = center[1], cz = center[2];
    let innerR = radius[0], outerR=radius[1];

    let increment = 2*Math.PI/side;
    let vertices = [];
    for(let i=0;i<side;i++){
        let theta = increment*i;
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        let innerX = innerR*cos + cx;
        let innerZ = -innerR*sin + cz;
        let outerX = outerR*cos + cx;
        let outerZ = -outerR*sin + cz;

        let futureOuterX = outerR*Math.cos(theta+increment) + cx;
        let futureOuterZ = -outerR*Math.sin(theta+increment) + cz;
        
        let midPoint = getMiddlePoint([outerX, outerZ], [futureOuterX, futureOuterZ]);
        vertices.push(innerX, cy, innerZ);
        vertices.push(outerX, cy, outerZ);
        vertices.push(midPoint[0], cy, midPoint[1]);
    }
    return vertices;
}

// Generate indices of a hollow circle
function generateHollowCircleIndices(side, offset){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }
    let indices = [];
    let start = 0;
    for(let i = 0;i<side-1;i++){
        start = i*3;
        indices.push(start+offset, start+1+offset, start+2+offset);
        indices.push(start+offset, start+2+offset, start+3+offset);
        indices.push(start+2+offset, start+3+offset, start+4+offset);
    }
    start = (side-1)*3;
    indices.push(start+offset, start+1+offset, start+2+offset);
    indices.push(start+offset, start+2+offset, 0+offset);
    indices.push(start+2+offset, 0+offset, 1+offset);
    return indices;
}
function generateHollowCircleColor(side, color){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }
    return generateUniformColor(side*3, color);
}
// function generateHollowTube(side, height, radius, )

function generateTubeLike(side, height, radius, center, offset){
    let rtop = radius[0], rbottom=radius[1];
    let vertices = [];
    let indices = [];

    // geometry circle on the top
    let geometryTop = generateCircle(side, rtop, center, offset);
    // geometry circle on the bottom
    let geometryBottom = generateCircle(side, rbottom, [center[0], center[1]-height, center[2]], geometryTop[OFFSET]);
    // combine vertex
    vertices = vertices.concat(geometryTop[VERTEX], geometryBottom[VERTEX]);
    
    // tube-body offset is start the same with offset of the top circle
    let tubeIndices = generateTubeLikeBodyIndices(side, offset);
    // merge indices
    indices = indices.concat(geometryTop[INDICES], geometryBottom[INDICES], tubeIndices);
    let newOffset = geometryBottom[OFFSET];
    return [vertices, indices, newOffset];
}

function generateTubeLikeBodyIndices(side, offset){
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
