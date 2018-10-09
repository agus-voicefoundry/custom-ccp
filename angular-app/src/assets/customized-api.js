var updatedAgent;
var connectedContact;
var agentEndpoints;

var containerDiv = document.getElementById("containerDiv");

connect.core.initCCP(containerDiv, {
//   ccpUrl: "https://datastreaming-test.awsapps.com/connect/ccp#/",
   ccpUrl: "https://waterfield.awsapps.com/connect/ccp#/",
   loginPopup: true
});

connect.agent(function(agent) {
	
	console.log("connect.agent");
	
	initQuickConnecs(agent);
	
	agent.onRefresh(function(agent) {
	
		updatedAgent = agent;
		
		//console.log(agent);
		
		//console.log(updatedAgent.getRoutingProfile());
		
		//console.log("agent.onRefresh");
		
		//var agentState = agent.getState();
		
		//console.log("agent state: " + agentState.name);
	});
	
	agent.onRoutable(function(agent) {
	
		console.log("agent.onRoutable");
		
		$('#agentInactiveStatus').hide();
		$('#agentActiveStatus').css('display', 'block');
		
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneOnCall').css('display', 'none');
		$('#softphoneCallEnded').css('display', 'none');
		$('#softphoneTransfer').css('display', 'none');
		$('#inactiveSoftphone').css('display', 'block');
	});
	
	agent.onNotRoutable(function(agent) {
	
		console.log("agent.onNotRoutable");
	});
	
	agent.onOffline(function(agent) {
		
		console.log("agent.onOffline");
		
		$('#agentActiveStatus').hide();
		$('#agentInactiveStatus').css('display', 'block');
	});
	
	agent.onAfterCallWork(function(agent) {
		
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneOnCall').css('display', 'none');
		$('#inactiveSoftphone').css('display', 'none');
		$('#softphoneTransfer').css('display', 'none');
		$('#softphoneCallEnded').css('display', 'block');
		
		console.log("agent.onAfterCallWork");
	});
	
	agent.onError(function(agent) {
		
		console.log("agent.onError");
	});
});

connect.contact(function(contact) {
	
	connectedContact = contact;

	console.log("connect.contact");
	
	//console.log(contact);
	
	contact.onRefresh(function(contact) {
	
		//console.log("contact.onRefresh");
		
		var attributeMap = contact.getAttributes();
		
		console.log(attributeMap);

		/*
		if (attributeMap && attributeMap.DateOfBirth) {
			//alert("Customer date of birth is: " + attributeMap.DateOfBirth.value);
			$('#customerInput').html(attributeMap.DateOfBirth.value);
			$('#customerInputContainer').show();
		}
		*/
	});
	
	contact.onConnecting(function(contact) {
		$('#softphoneContainer').css('display', 'block');
		$('#inactiveSoftphone').css('display', 'none');
		
		if (contact.isInbound()) {	
			console.log("connect.onConnecting (inbound)");
						
			$("#contactphone").html("");
			var connection = contact.getActiveInitialConnection();
			var address = connection.getAddress();
			var phoneNumber = address.stripPhoneNumber();
			console.log('Incoming number: ' + phoneNumber);
			$("#incomingnumber, #incomingnumber2").html(phoneNumber);
			/*
			//attempt to get user data for incoming phonenumber
			if (phoneNumber) {
				console.log("inc num: " + phoneNumber);
				$.ajax({
					dataType: "json",
					url: "https://utils.qualityconnex.com/vf.api.connectdemo/customer/getinfo?phoneNumber"+phoneNumber,
					success: function(data){
						console.log(data);
					}
				});
			}
			*/

			$('#softphoneIncoming').css('display', 'block');
			
		} else {
		
			console.log("connect.onConnecting (outbound)");
		
			$('#softphoneIncoming').css('display', 'none');
			$('#softphoneCalling').css('display', 'block');
		}

	});
	
	contact.onConnected(function() {
	
		console.log("contact.onConnected");
		
		$('#inactiveSoftphone').css('display', 'none');
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneTransfer').css('display', 'none');
		$('#softphoneOnCall').css('display', 'block');
	});
	
	contact.onIncoming(function(contact) {


		console.log("contact.onIncoming");
		
		$('#softphoneContainer').css('display', 'block');
		$('#inactiveSoftphone').css('display', 'none');
		$('#softphoneIncoming').css('display', 'block');
	});
	
	contact.onAccepted(function(contact) {
		console.log("contact.onAccepted");
	});
	
	contact.onEnded(function(contact) {
		
		// TODO: check why sometimes is called twice.
		
		/*
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneOnCall').css('display', 'none');
		$('#inactiveSoftphone').css('display', 'block');
		//$('#softphoneCallEnded').css('display', 'block');
		*/
		
		console.log("contact.onEnded");
		console.log(contact);
	});
});

function openCloseSoftphone() {

	var softphoneVisible = $('#softphoneContainer').css('display');
	if (softphoneVisible == 'none') {
		$('#softphoneContainer').css('display', 'block');
	} else {
		$('#softphoneContainer').css('display', 'none');
	}
}

function viewQuickConnects() {

	var softphoneTransferVisible = $('#softphoneTransfer').css('display');
	if (softphoneTransferVisible == 'none') {
		$('#softphoneOnCall').css('display', 'none');
		$('#softphoneTransfer').css('display', 'block');
	} else {
		$('#softphoneTransfer').css('display', 'none');
		$('#softphoneOnCall').css('display', 'block');
	}
}

function openCloseQuickConnectSelection() {

	var quickConnectsContainerVisible = $('#quickConnectsContainer').css('display');
	if (quickConnectsContainerVisible == 'none') {
		$('#quickConnectsContainer').css('display', 'block');
	} else {
		$('#quickConnectsContainer').css('display', 'none');
	}
}

function initQuickConnecs(agent) {
	
	if (agent && !agentEndpoints) {
		
		var queues = agent.getRoutingProfile().queues;
		
		agent.getEndpoints(
			queues[0].queueARN,
			{
				success: function(data) {
					
					console.log('agent.getEndpoints success');
					console.log(data.addresses);
					
					agentEndpoints = data.addresses;
					
					$('#quickConnectsContainer').empty();
					
					for (var i = 0; i < agentEndpoints.length; i++) {
						//console.log(agentEndpoints[i].endpointId);
						$('#quickConnectsContainer').append("<div class='quick-connect' onclick='changeQuickConnect(\"" + agentEndpoints[i].name + "\");'>" + agentEndpoints[i].name + "</div>");
					}
					
				},
				failure: function(err, data) {
					console.log('agent.getEndpoints failure');
				}
			}
		)
	}
}

var selectedEndpoint;
function changeQuickConnect(endpointName) {
	
	selectedEndpoint = endpointName;
	
	$('#selectedQuickConnect').html('<div id="' + endpointName + '">' + endpointName + '</div>');
	$('#quickConnectsContainer').css('display', 'none');
}

function transferCall() {
	
	if (connectedContact) {
		
		var endpointToTransfer;
		for (var i = 0; i < agentEndpoints.length; i++) {
			
			
			if (selectedEndpoint == agentEndpoints[i].name) {
				endpointToTransfer = agentEndpoints[i];
				break;
			}
		}
	
		if (endpointToTransfer) {
			
			connectedContact.addConnection(endpointToTransfer,
			{
			   success: function() {
					console.log("contact.addConnection success");
					
					$('#holdLabel').html('Holding');
				    $('#holdButton').css('background-color', '#b3b3b3');
				    $('#holdIcon').attr('src', 'assets/softphone_icons/ic_phone_hold_active_24px.svg');
					
					$('#softphoneTransfer').css('display', 'none');
					$('#softphoneOnCall').css('display', 'block');
				   
			   },
			   failure: function() {
					console.log("contact.addConnection failure");
			   }
			});	
		}
	}
}

function placeCall() {
	
	if (updatedAgent) {
		
		//$('#inactiveSoftphone').css('display', 'none');
		//$('#softphoneCalling').css('display', 'block');
			
		var inputNumber = "+61449216577";//$('#inputNumber').val();
		//var inputNumber = "+61432330174";//$('#inputNumber').val();
		
		var endpoint = connect.Endpoint.byPhoneNumber(inputNumber);
		
		updatedAgent.connect(endpoint, {
		   success: function() {
			   console.log("agent.connect success");
		   },
		   failure: function() {
			   console.log("agent.connect failure");
		   }
		});
	}
}

function cancelCall() {

	if (connectedContact) {
			
		connectedContact.getAgentConnection().destroy({
		   success: function() {
			   
			    console.log("connection.destroy success");
			   
			    $('#softphoneCalling').css('display', 'none');
				$('#softphoneOnCall').css('display', 'none');
				//$('#inactiveSoftphone').css('display', 'block');
		   },
		   failure: function() {
			    console.log("connection.destroy failure");
		   }
		});
	}
}

function acceptCall() {
	
	if (connectedContact) {
	
		connectedContact.accept({
		   success: function() {
		   },
		   failure: function() {
		   }
		});
	}
		
}

function declineCall() {

	if (connectedContact) {
	
		var conn = connectedContact.getActiveInitialConnection();
		
		if (conn) {
			
			conn.destroy({
			   success: function() {
				   console.log("activeInitialConnection.destroy success");
			   },
			   failure: function() {
				   console.log("activeInitialConnection.destroy failure");
			   }
			});
		}
	}
}

function setAsAvailable() {
		
	if (updatedAgent) {
		var routableState = updatedAgent.getAgentStates().filter(function(state) {
		   return state.type === connect.AgentStateType.ROUTABLE;
		})[0];
		
		updatedAgent.setState(routableState, {
		   success: function() {
		   },
		   failure: function() {
		   }
		});	
	}
}

function goOffline() {
	
	if (updatedAgent) {
		
		var routableState = updatedAgent.getAgentStates().filter(function(state) {
			
		   return state.type === connect.AgentStateType.OFFLINE;
		})[0];
		
		updatedAgent.setState(routableState, {
		   success: function() {
		   },
		   failure: function() {
		   }
		});
	}
}

function openCloseAgentStatusSelection() {

	var agentStatusesContainerVisible = $('#agentStatusesContainer').css('display');
	if (agentStatusesContainerVisible == 'none') {
		$('#agentStatusesContainer').css('display', 'block');
	} else {
		$('#agentStatusesContainer').css('display', 'none');
	}
}

function changeAgentStatus(elem) {

	var selectedElemId = $(elem).attr('id');

	if (selectedElemId == "selectableActiveAgentStatus") {
		
		setAsAvailable();
		
		//$('#agentInactiveStatus').hide();
		//$('#agentActiveStatus').css('display', 'block');
	} else {
		
		goOffline();
		
		//$('#agentActiveStatus').hide();
		//$('#agentInactiveStatus').css('display', 'block');
	}

	$('#agentStatusesContainer').css('display', 'none');
}

function clearInputNumber() {
	$('#inputNumber').val('');
}

function addInputNumber(number) {
	$('#inputNumber').val($('#inputNumber').val() + number);
}

function holdCall() {

	if (connectedContact) {
			
		var conn = connectedContact.getActiveInitialConnection();
		
		if (conn) {
		
			if (!conn.isOnHold()) {
				
				conn.hold({
				   success: function() {
					   console.log("connection.hold success");
					   
					   $('#holdLabel').html('Holding');
					   $('#holdButton').css('background-color', '#b3b3b3');
					   $('#holdIcon').attr('src', 'assets/softphone_icons/ic_phone_hold_active_24px.svg');
				   },
				   failure: function() {
					   console.log("connection.hold failure");
				   }
				});
				
			} else {
				
				conn.resume({
				   success: function() {
					   console.log("connection.resume success");
					   
					   $('#holdLabel').html('Hold');
					   $('#holdButton').css('background-color', '#e4e4e4');
					   $('#holdIcon').attr('src', 'assets/softphone_icons/ic_phone_hold_inactive_24px.svg');
				   },
				   failure: function() {
					   console.log("connection.resume failure");
				   }
				});
			}	
		}
	}
}

getPhoneNumberFromConnection = (connection) =>{

}

//Make the DIV element draggagle:
dragElement(document.getElementById(("softphoneContainer")));

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "Header")) {
		/* if present, the header is where you move the DIV from:*/
		document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
	} else {
		/* otherwise, move the DIV from anywhere inside the DIV:*/
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		/*
		e = e || window.event;
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		*/
	}

	function closeDragElement() {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;
	}
}