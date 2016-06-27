var activeBox = -1; nothing selected
var aspectRatio = 4/3; //Standard definition video aspect ratio
var maxCALLERS = 3;
var numVideoBJS = maxCALLERS + 1;
var layout;

easyrtc.dontAddCloseButtons(true);

function getIdOfBox(boxNum) {
	return "box" + boxNum;
}

function reshapeFull(parentw, parenth) {
	return {
		left: 0,
		top: 0,
		width: parentw,
		height: parenth
	};
}

function reshapeTextEntryBox(parentw, parenth) {
	return {
		left: parentw/4,
		top: parenth/4,
		width: parentw/2,
		height: parenth/4
	}
}

function reshapeTextEntryField(parentw, parenth) {
	return {
		width: parentw -40
	}
}

var margin = 20;

function reshapeToFullSize(parentw, parenth) {
	var left, top, width, height;
	var margin = 20;

	if(parentw < parenth * aspectRatio) {
		width = parentw - margin;
		height = width/aspectRatio;
	}
	else {
		height = parenth - margin;
		width = height * aspectRatio;
	}
	left = (parenth - margin)/2;
	top = (parenth - height)/ 2;
	return { 
		left: left,
		top:,
		width: width,
		height: height
	};
}

//
// A negative percentLeft is interpreted as setting the right edge of the object 
// that distance from the right edge of the parent.
// Similar for percentTop.
// 

function setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {
	var width, height;
	if(parentw < parenth * aspectRatio) {
		width = parentw * percentSize;
		height = width/aspect;
	}
	else {
		height = parenth * percentSize;
		width = height * aspect;
	}
	var left;
    if( percentLeft < 0) {
        left = parentw - width;
    }
    else {
        left = 0;
    }
    left += Math.floor(percentLeft*parentw);
    var top = 0;
    if( percentTop < 0) {
        top = parenth - height;
    }
    else {
        top = 0;
    }
    top += Math.floor(percentTop*parenth);
    return {
        left:left,
        top:top,
        width:width,
        height:height
    };
}

function setThumbSize(percentSize, percentLeft, percentTop, parentw, parenth) {
    return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspectRatio);
}

function setThumbSizeButton(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
    return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
}


var sharedVideoWidth  = 1;
var sharedVideoHeight = 1;

function reshape1of2(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3,
            top:  (parenth -sharedVideoHeight)/2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}



function reshape2of2(parentw, parenth){
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*2)/3 *2 + sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3 *2 + sharedVideoWidth,
            top:  (parenth -sharedVideoHeight)/2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape1of3(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4 ,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape2of3(parentw, parenth){
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4*2+ sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3*2+sharedVideoWidth,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape3of3(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4*3+ sharedVideoHeight*2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3*1.5+sharedVideoWidth/2,
            top:  (parenth -sharedVideoHeight*2)/3*2+ sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}


function reshape1of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3,
        top: (parenth - sharedVideoHeight*2)/3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

function reshape2of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3*2+ sharedVideoWidth,
        top: (parenth - sharedVideoHeight*2)/3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}
function reshape3of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3,
        top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

function reshape4of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
        top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

var boxUsed = [true, false, false, false];
var connectCount = 0;


function setSharedVideoSize(parentw, parenth) {
    layout = ((parentw /aspectRatio) < parenth)?'p':'l';
    var w, h;

    function sizeBy(fullsize, numVideos) {
        return (fullsize - margin*(numVideos+1) )/numVideos;
    }

    switch(layout+(connectCount+1)) {
        case 'p1':
        case 'l1':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 1);
            break;
        case 'l2':
            w = sizeBy(parentw, 2);
            h = sizeBy(parenth, 1);
            break;
        case 'p2':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 2);
            break;
        case 'p4':
        case 'l4':
        case 'l3':
            w = sizeBy(parentw, 2);
            h = sizeBy(parenth, 2);
            break;
        case 'p3':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 3);
            break;
    }
    sharedVideoWidth = Math.min(w, h * aspectRatio);
    sharedVideoHeight = Math.min(h, w/aspectRatio);
}

var reshapeThumbs = [
    function(parentw, parenth) {

        if( activeBox > 0 ) {
            return setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
        }
        else {
            setSharedVideoSize(parentw, parenth)
            switch(connectCount) {
                case 0:return reshapeToFullSize(parentw, parenth);
                case 1:return reshape1of2(parentw, parenth);
                case 2:return reshape1of3(parentw, parenth);
                case 3:return reshape1of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[1]) {
            return setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
        }
        else{
            switch(connectCount) {
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    return reshape2of3(parentw, parenth);
                case 3:
                    return reshape2of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[2] ) {
            return setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
        }
        else  {
            switch(connectCount){
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    if( !boxUsed[1]) {
                        return reshape2of3(parentw, parenth);
                    }
                    else {
                        return reshape3of3(parentw, parenth);
                    }
                case 3:
                    return reshape3of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[3]) {
            return setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
        }
        else{
            switch(connectCount){
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    return reshape3of3(parentw, parenth);
                case 3:
                    return reshape4of4(parentw, parenth);
            }
        }
    },
];


function killButtonReshaper(parentw, parenth) {
    var imagew = 128;
    var imageh = 128;
    if( parentw < parenth) {
        return setThumbSizeButton(0.1, -.51, -0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.1, -.01, -.51, parentw, parenth, imagew, imageh);
    }
}


function muteButtonReshaper(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return setThumbSizeButton(0.10, -.51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.10, 0.01, -.51, parentw, parenth, imagew, imageh);
    }
}

function reshapeTextEntryButton(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return setThumbSizeButton(0.10, .51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.10, 0.01, .51, parentw, parenth, imagew, imageh);
    }
}


function handleWindowResize() {
    var fullpage = document.getElementById('fullpage');
    fullpage.style.width = window.innerWidth + "px";
    fullpage.style.height = window.innerHeight + "px";
    connectCount = easyrtc.getConnectionCount();

    function applyReshape(obj,  parentw, parenth) {
        var myReshape = obj.reshapeMe(parentw, parenth);

        if(typeof myReshape.left !== 'undefined' ) {
            obj.style.left = Math.round(myReshape.left) + "px";
        }
        if(typeof myReshape.top !== 'undefined' ) {
            obj.style.top = Math.round(myReshape.top) + "px";
        }
        if(typeof myReshape.width !== 'undefined' ) {
            obj.style.width = Math.round(myReshape.width) + "px";
        }
        if(typeof myReshape.height !== 'undefined' ) {
            obj.style.height = Math.round(myReshape.height) + "px";
        }

        var n = obj.childNodes.length;
        for(var i = 0; i < n; i++ ) {
            var childNode = obj.childNodes[i];
            if( childNode.reshapeMe) {
                applyReshape(childNode, myReshape.width, myReshape.height);
            }
        }
    }

    applyReshape(fullpage, window.innerWidth, window.innerHeight);
}


function setReshaper(elementId, reshapeFn) {
    var element = document.getElementById(elementId);
    if( !element) {
        alert("Attempt to apply to reshapeFn to non-existent element " + elementId);
    }
    if( !reshapeFn) {
        alert("Attempt to apply misnamed reshapeFn to element " + elementId);
    }
    element.reshapeMe = reshapeFn;
}


function collapseToThumbHelper() {
    if( activeBox >= 0) {
        var id = getIdOfBox(activeBox);
        document.getElementById(id).style.zIndex = 2;
        setReshaper(id, reshapeThumbs[activeBox]);
        document.getElementById('muteButton').style.display = "none";
        document.getElementById('killButton').style.display = "none";
        activeBox = -1;
    }
}

function collapseToThumb() {
    collapseToThumbHelper();
    activeBox = -1;
    updateMuteImage(false);
    handleWindowResize();

}

function updateMuteImage(toggle) {
	var muteButton = document.getElementById('muteButton');
	if(activeBox > 0) { //no kill button for self video
		muteButton.style.display = "block";
		var videoObject = document.getElementById(getIdOfBox(activeBox));
		var isMuted = videoObject.muted?true:false;
		if(toggle) {
			isMuted = !isMuted;
			videoObject.muted = isMuted;
		}
		muteButton.src = isMuted?"images/button_unmute.png":"images/button_mute.png";
	} else {
		muteButton.style.display = "none";
	}
}

function expandThumb(whichBox) {
	var lastActiveBox = activeBox;
	if(activeBox >= 0) {
		collapseToThumbHelper();
	}
	if(lastActiveBox != whichBox) {
		var id = getIdOfBox(whichBox);
		activeBox =whichBox;
		setReshaper(id, reshapeToFullSize);
		document.getElementById(id).style.zIndex = 1;
		if(whichBox > 0) {
			document.getElementById(id).style.display = "block";
			updateMuteImage();
			document.getElementById('killButton').style.display = "block";
		}

	}
	updateMuteImage(false);
	handleWindowResize();
}

