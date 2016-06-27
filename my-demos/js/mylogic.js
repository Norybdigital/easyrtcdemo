'use strict';
function my_init() {
	easyrtc.setRoomOccupantListener(roomListener);

	//easyrtc.easyApp function takes an application name, self-video-id, 
	//array-of-caller-video-ids, and a sucess callback.
	easyrtc.easyApp("Company_Chat_Line", "self", ["caller"],
		function(myId) {
			console.log('My easyrtcid is ' + myId);
		}
	);
}

//Determines who else is in the room and adds a button so you can communicate with them
function roomListener(roomName, otherPeers) {
	var otherClientDiv = document.getElementById('otherClients');
	while(otherClientDiv.hasChildNodes()) {
		otherClientDiv.removeChild(otherClientDiv.lastChild);
	}
	for(var i in otherPeers) {
		var button = document.createElement('button');
		button.onclick = function(easyrtcid) {
			return function() {
				performCall(easyrtcid);
			}
		}(i);

		label = document.createTextNode(i);
		button.appendChild(label);
		otherClientDiv.appendChild(button);
	}
}

function performCall(easyrtcid) {
	easyrtc.call(
		easyrtcid,
		function(easyrtcid) { console.log("Completed call to " + easyrtcid); },
		function(errorMessage) { console.log("err:" + errorMessage); },
		function(accepted,bywho) { 
			console.log((accepted?"accepted":"rejected") + " by " + bywho); }
		}
	);
}