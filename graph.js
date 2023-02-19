const nodeR = 10;
const edgeD = 3;
const INF = 1E9;

var
    canv = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    edges = [],
    nodes = [],
    exist = [],
    cur = -1,
    last = -1,
    type = false,
    n = 0,
    d = [],
    maxb = 1,
    switchColor = 1,
    saveX,
    saveY;


document.oncontextmenu = function (){return false};
canv.width = 500;
canv.height = 500;

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

console.log(getRandomArbitrary(1, 3));
// Create random location (x, y) for each node.
for(var i = 0; i < 10; i++) {
    n++;
    var 
        x = getRandomArbitrary(550, 1000);
        y = getRandomArbitrary(100, 450);

    var v = node(x, y);
    nodes.push([x, y]);
    edges.push([]);
    exist.push(true);
        
}

// Create edges from node 0 to node 9
for(var i = 0; i < 10; i++) {
    if (i > 0) {
        edges[i].push(i - 1);
        edges[i - 1].push(i);
    }
}

// Create a circle graph.

edges[9].push(0);
edges[0].push(9);


//Create random edges

for (j = 0; j < 7; j++) {
    var 
        a = Math.round(Math.random() * 8),
        b = Math.round(Math.random() * 8);

    edges[a].push(b);
    edges[b].push(a);

}


// Check the direction these three points rotate
function RotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
    if (((p3y - p1y) * (p2x - p1x)) > ((p2y - p1y) * (p3x - p1x)))
      return 1;
    else if (((p3y - p1y) * (p2x - p1x)) == ((p2y - p1y) * (p3x - p1x)))
      return 0;
    
    return -1;
}
  
function containsSegment(x1, y1, x2, y2, sx, sy) {
    if (x1 < x2 && x1 < sx && sx < x2) return true;
    else if (x2 < x1 && x2 < sx && sx < x1) return true;
    else if (y1 < y2 && y1 < sy && sy < y2) return true;
    else if (y2 < y1 && y2 < sy && sy < y1) return true;
    else if (x1 == sx && y1 == sy || x2 == sx && y2 == sy) return true;
    return false;
}
  
function hasIntersection(p1, p2, p3, p4) {
    x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y, x4 = p4.x, y4 = p4.y;
    var f1 = RotationDirection(x1, y1, x2, y2, x4, y4);
    var f2 = RotationDirection(x1, y1, x2, y2, x3, y3);
    var f3 = RotationDirection(x1, y1, x3, y3, x4, y4);
    var f4 = RotationDirection(x2, y2, x3, y3, x4, y4);
    
    // If the faces rotate opposite directions, they intersect.
    var intersect = f1 != f2 && f3 != f4;
    
    // If the segments are on the same line, we have to check for overlap.
    if (f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0) {
      intersect = containsSegment(x1, y1, x2, y2, x3, y3) || containsSegment(x1, y1, x2, y2, x4, y4) ||
      containsSegment(x3, y3, x4, y4, x1, y1) || containsSegment(x3, y3, x4, y4, x2, y2);
    }
    
    return intersect;
}
  
     
function intersects(p1, p2, p3, p4) {
    var 
        det, gamma, lambda,
        a = p1.x, b = p1.y, c = p2.x, d = p2.y, p = p3.x, q = p3.y, r = p4.x, s = p4.y;

    det = (c - a) * (s - q) - (r - p) * (d - b);
    
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};



// Canvas setup
setInterval(function() {
    canv.width = canv.offsetWidth;
    canv.height = canv.offsetHeight;
    
    if (type) {
        force();
    }
   
    drawField();
    drawLine();
}, 30);

// Click chuột phải để xoá node
/*
canv.addEventListener('contextmenu', function(e) {
    console.log("contextmenu");
    var v = node(e.offsetX, e.offsetY);
    if (v != -1) {
        exist[v] = false;
    }
});
*/
canv.addEventListener('click', function(e) {
    console.log("click");
    
    if (cur != -1) {
        return;
    }

    var
        x = e.offsetX;
        y = e.offsetY;
        v = node(x, y);

    // If node is not available
    /*

    if (v == -1) {
        n++;
        nodes.push([x, y]);
        edges.push([]);
        exist.push(true);
        
        if (exist[last] && last != -1) {
            if (edges[last].indexOf(n - 1))
            edges[last].push(n - 1);
            edges[n - 1].push(last);
            last = -1;
        }

    }

    // If node is available
    else {
        console.log(last);
        if (!exist[last] || last == -1) {
            last = v;
            

        } else {
            if (edges[last].indexOf(v) == -1) {
                edges[last].push(v);
                edges[v].push(last);
                
            } else {
                edges[last].splice(edges[last].indexOf(v), 1);
                edges[v].splice(edges[v].indexOf(last), 1);
            }
            last = -1;

        }

    }

    */
});

for(var i = 0; i < nodes.length; i++) {
    if(nodes[i][0] < 520 || nodes[i][0] > 1030) {
        if(nodes[i][1] < 25 || nodes[i][1] > 500) {
            nodes[i] = [saveX, saveY];
        }
    }
}

canv.addEventListener('mousedown', function(e) {
    console.log("mousedown");
    var v = node(e.offsetX,  e.offsetY);
    if (v != -1) {
        cur = v;
        saveX = nodes[cur][0];
        saveY = nodes[cur][1];
    }
    checkDebug();
});

canv.addEventListener('mouseup', function(e) {
    console.log("mouseup");
    cur = -1;
    checkDebug();
});

canv.addEventListener('mousemove', function(e) {
    console.log("mousemove");
    var 
        legalXpoint = false, 
        legalYpoint = false;
    if (cur != -1) {
        if(nodes[cur][0] >= 520 && nodes[cur][0] <= 1030) {
            legalXpoint = true;
        }
        if(nodes[cur][1] >= 25 && nodes[cur][1] <= 525) {
            legalYpoint = true;
        } 
    }
    if(legalXpoint && legalYpoint) {nodes[cur] = [e.offsetX, e.offsetY]; checkDebug();}
    else nodes[cur] = [saveX, saveY];    
});

// Function to check if node is out of limited area it will be turned back to last location.
function checkDebug() {
    for(var i = 0; i < nodes.length; i++) {
        if(nodes[i][0] < 520 || nodes[i][0] > 1030) {
            nodes[i] = [saveX, saveY];
        }
        if(nodes[i][1] < 25 || nodes[i][1] > 525) {
            nodes[i] = [saveX, saveY];
        }
        
    }
}

document.addEventListener('keydown', function(e) {
    //console.log("keydown ", e.keyCode);

    // Press B
    if (e.keyCode == 66) { 
        showEdges(); // Show all of edges to debug
        
        // type = !type;
        // console.log('force: ', type);
    } 

    // Press C
    else if (e.keyCode == 67) {
        showNodes(); // Show all of nodes to debug

        // clear();
        // nodes = [];
        // edges = [];
        // exist = [];
        // n = 0;
        // maxb = 1;
        // console.log("clear");
    }
 
    
});


function clear() {

    // Draw stroke main minigame
    ctx.beginPath();
    ctx.fillStyle = '#232832';
    ctx.fillRect(canv.offsetWidth/3 - 3 , 0, 550, 550);

    // Draw main minigame
    ctx.beginPath();
    ctx.fillStyle = '#011B0A';
    ctx.fillRect(canv.offsetWidth/3 + 23 , 25, 500, 500);
}

function drawField() { 
    clear();

    // Drawing a node
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            ctx.fillStyle = '#1ac618';
            if (i == last) {
                ctx.fillStyle = '#1ac618';
            }
            ctx.beginPath();

            // nodes is a list of nodes, nodes[i][0] = x, nodes[i][1] = y
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * 2 - 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#1ac618';
            ctx.beginPath();
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * 2 - 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function drawLine() {

    // Drawing a line between 2 nodes.
    for (var i = 0; i < edges.length; ++i) {
        if (exist[i]) {
           for (var j = 0; j < edges[i].length; ++j) {
                if (exist[edges[i][j]] && i < edges[i][j]) {
                    ctx.lineWidth = edgeD;
                    ctx.strokeStyle = '#1ac618';
                    ctx.beginPath();
                    ctx.moveTo(nodes[i][0], nodes[i][1]);
                    ctx.lineTo(nodes[edges[i][j]][0], nodes[edges[i][j]][1]); // nodes[...][0] = x, nodes[...][1] = y
                    ctx.stroke();
                }
            }
        }
    }

}

function node(x, y) {
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            var
                dx = nodes[i][0] - x;
                dy = nodes[i][1] - y;
                len = Math.sqrt(dx * dx + dy * dy);
            if (len < nodeR * 3) {
                return i;
            }
        }
    }
    return -1;
}

function bfs(s) {
    var 
        q = [],
        beg = 0;
        used = [];
    for (var i = 0; i < n; ++i) {
        used.push(false);
    }
    q.push(s);
    used[s] = true;
    d[s][s] = 0;
    while (beg != q.length) {
        var v = q[beg];
        beg++;
        for (var j = 0; j < edges[v].length; ++j) {
            var u = edges[v][j];
            if (exist[u] && !used[u]) {
                used[u] = true;
                q.push(u);
                d[s][u] = d[s][v] + 1;
                maxb = Math.max(maxb, d[s][u]);
            }
        }
    }
}

function rib() {
    return Math.min(canv.width, canv.height) / (maxb + 1);
}

function f(v, u) {
    var
        dx = nodes[v][0] - nodes[u][0],
        dy = nodes[v][1] - nodes[u][1],
        len = Math.sqrt(dx * dx + dy * dy);
    return [(dx / len * d[v][u] * rib() - dx) / 30,
            (dy / len * d[v][u] * rib() - dy) / 30];
}

function force() {
    d = [];
    maxb = 0;
    for (var i = 0; i < n; ++i) {
        d.push([]);
        for (var j = 0; j < n; ++j) {
            d[i].push(INF);
        }
        if (exist[i]) {
            bfs(i);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            for (var j = 0; j < n; ++j) {
                if (exist[j] && i != j && d[i][j] != INF && i != cur) {
                    var delta = f(i, j);
                    nodes[i][0] += delta[0];
                    nodes[i][1] += delta[1];
                }
            }
        }
    }
    var 
        mxx = -INF,
        mxy = -INF,
        mnx = INF,
        mny = INF;
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            mxx = Math.max(mxx, nodes[i][0]);
            mxy = Math.max(mxy, nodes[i][1]);
            mnx = Math.min(mnx, nodes[i][0]);
            mny = Math.min(mny, nodes[i][1]);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            nodes[i][0] += (canv.width / 2 - (mxx + mnx) / 2) / 30;
            nodes[i][1] += (canv.height / 2 - (mxy + mny) / 2) / 30;
        }
    }
}

function showEdges() {
    console.log('--EDGES--');
    for (var i = 0; i < edges.length; ++i) {
        console.log(i);
        console.log(edges[i]);
        
    }
    console.log('---------');
}

function showNodes() {
    console.log('--NODES--');
    for (var i = 0; i < edges.length; ++i) {
        console.log(i);
        console.log(nodes[i]);
        
    }
    console.log('---------');
}
   

