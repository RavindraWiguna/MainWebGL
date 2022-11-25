/*
================================== GEOMETRY & COLOR HELPER ======================
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

function generateHollowCircle(side, radius, center){
    if(side < 3){
        alert("side can not be < 3");
        return; 
    }
    let cx = center[0], cy = center[1], cz = center[2];
    let innerR = radius[0], outerR=radius[1];

    let increment = 2*Math.PI/side;
    let result = [];
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
        result.push(innerX, cy, innerZ);
        result.push(outerX, cy, outerZ);
        result.push(midPoint[0], cy, midPoint[1]);
    }
    return result;

}

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

// function generateHollowTube(side, height, radius, )

function generateTubeLike(side, height, radius, center, offset){
    let rtop = radius[0], rbottom=radius[1];
    // vertex circle on the top
    let vertex = generateCircle(side, rtop, center);
    // vertex circle on the bottom
    let bottom = generateCircle(side, rbottom,   [center[0], center[1]-height, center[2]]);

    // combine vertex
    vertex = vertex.concat(bottom);

    // indices of circle on top
    let indices = generateCircleIndices(side, offset);
    let indicesBottom = generateCircleIndices(side, side+1+offset);
    let tubeIndices = generateTubeLikeBodyIndices(side, offset);
    // merge indices
    indices = indices.concat(indicesBottom);
    indices = indices.concat(tubeIndices);
    let newOffset = side+1+offset+side+1;
    return [vertex, indices, newOffset];
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
