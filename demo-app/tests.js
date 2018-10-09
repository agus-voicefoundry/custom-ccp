var updatedAgent;
var agentSnapshot;
var connectedContact;
var agentEndpoints;

var containerDiv = document.getElementById("containerDiv");

connect.core.initCCP(containerDiv, {
   //ccpUrl: "https://datastreaming-test.awsapps.com/connect/ccp#/",
   ccpUrl: "https://agus-instance.awsapps.com/connect/ccp#/",
   loginPopup: true
});

connect.agent(function(agent) {
	
	console.log("connect.agent");
		
	initQuickConnecs(agent);
	
	var agentConfig = agent.getConfiguration();
	console.log(agentConfig);
	
	$('#agentName').html(agentConfig.name);
	
	getCallsByAgent();
	
	agent.onRefresh(function(agent) {
	
		updatedAgent = agent;
		
		agentSnapshot = agent.toSnapshot();
		
		//console.log(agent);
		
		//console.log(updatedAgent.getRoutingProfile());
		
		//console.log("agent.onRefresh");
		
		//var agentState = agent.getState();
		
		//console.log("agent state: " + agentState.name);
	});
	
	agent.onRoutable(function(agent) {
	
		console.log("agent.onRoutable");
		
		$('#agentInactiveStatus').hide();
		$('#agentActiveStatus').css('display', 'flex');
		
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneOnCall').css('display', 'none');
		$('#softphoneCallEnded').css('display', 'none');
		$('#softphoneTransfer').css('display', 'none');
		$('#inactiveSoftphone').css('display', 'flex');
		
		
		showHome();
		$('#currentCallTab').hide();
	});
	
	agent.onNotRoutable(function(agent) {
	
		console.log("agent.onNotRoutable");
	});
	
	agent.onOffline(function(agent) {
		
		console.log("agent.onOffline");
		
		$('#agentActiveStatus').hide();
		$('#agentInactiveStatus').css('display', 'flex');
	});
	
	agent.onAfterCallWork(function(agent) {
		
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneOnCall').css('display', 'none');
		$('#inactiveSoftphone').css('display', 'none');
		$('#softphoneTransfer').css('display', 'none');
		$('#softphoneCallEnded').css('display', 'flex');
		
		console.log("agent.onAfterCallWork");
	});
	
	agent.onError(function(agent) {
		
		console.log("agent.onError");
	});
});

var customerId, contactSnapshot;
connect.contact(function(contact) {
	
	connectedContact = contact;
	
	initTransferPanel();
	
	console.log(connectedContact.getConnections());
	
	//var conn = connectedContact.getAgentConnection();
	//var conn = connectedContact.getActiveInitialConnection();
	//var conn = connectedContact.getConnections();
	//var conn = connectedContact.getActiveInitialConnection();
	//console.log(conn);

	console.log("connect.contact");
	//console.log(contact.toSnapshot().contactData.connections);
	
	contactSnapshot = contact.toSnapshot();
	
	customerId = null;
	
	var attributeMap = contact.getAttributes();
		
	//console.log(attributeMap);
	console.log(attributeMap.InputCustomerId);
	
	//attributeMap = { "InputCustomerId": { "value": "1" }}; // TODO: DELETE!!!
	
	if (attributeMap != null && 
		attributeMap.InputCustomerId != null && 
		attributeMap.InputCustomerId.value != null &&
		attributeMap.InputCustomerId.value != 'Timeout') {
	
		customerId = attributeMap.InputCustomerId.value;
		
		viewCustomerDetail(customerId);
		getCallsByAgent();
	}
	
	//console.log(contact);
	
	contact.onRefresh(function(contact) {
	
		console.log("contact.onRefresh");
		
		connectedContact = contact;
		
		initTransferPanel();
		
		//var attributeMap = contact.getAttributes();
		
		//console.log(attributeMap);
		
		/*
		if (attributeMap && attributeMap.DateOfBirth) {
			//alert("Customer date of birth is: " + attributeMap.DateOfBirth.value);
			$('#customerInput').html(attributeMap.DateOfBirth.value);
			$('#customerInputContainer').show();
		}
		*/
	});
	
	contact.onConnecting(function(contact) {
		
		$('#softphoneContainer').css('display', 'flex');
		$('#inactiveSoftphone').css('display', 'none');
		
		if (contact.isInbound()) {
					
			console.log("connect.onConnecting (inbound)");
			
			$('#softphoneIncoming').css('display', 'flex');
			
		} else {
		
			console.log("connect.onConnecting (outbound)");
		
			$('#softphoneIncoming').css('display', 'none');
			$('#softphoneCalling').css('display', 'flex');
		}

		console.log(contact);
		//console.log(contact.getData());
		
		logCustomerCall();
	});
	
	contact.onConnected(function() {
	
		console.log("contact.onConnected");
		
		$('#inactiveSoftphone').css('display', 'none');
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneTransfer').css('display', 'none');
		$('#softphoneOnCall').css('display', 'flex');
	});
	
	contact.onIncoming(function(contact) {
	
		console.log("contact.onIncoming");
		
		$('#softphoneContainer').css('display', 'flex');
		$('#inactiveSoftphone').css('display', 'none');
		$('#softphoneIncoming').css('display', 'flex');
	});
	
	contact.onAccepted(function(contact) {
	
		//logCustomerCall();
		
		console.log("contact.onAccepted");
	});
	
	contact.onEnded(function(contact) {
		
		// TODO: check why sometimes is called twice.
		
		/*
		$('#softphoneCalling').css('display', 'none');
		$('#softphoneIncoming').css('display', 'none');
		$('#softphoneOnCall').css('display', 'none');
		$('#inactiveSoftphone').css('display', 'flex');
		//$('#softphoneCallEnded').css('display', 'flex');
		*/
		
		console.log("contact.onEnded");
		console.log(contact);
		
		$('#currentDiallerStatus').html("Waiting Inbound");
	});
});

function openCloseSoftphone() {

	var softphoneVisible = $('#softphoneContainer').css('display');
	if (softphoneVisible == 'none') {
		$('#softphoneContainer').css('display', 'flex');
	} else {
		$('#softphoneContainer').css('display', 'none');
	}
}

function viewQuickConnects() {

	var softphoneTransferVisible = $('#softphoneTransfer').css('display');
	if (softphoneTransferVisible == 'none') {
		$('#softphoneOnCall').css('display', 'none');
		$('#softphoneTransfer').css('display', 'flex');
	} else {
		$('#softphoneTransfer').css('display', 'none');
		$('#softphoneOnCall').css('display', 'flex');
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
			
			console.log(endpointToTransfer);
			
			connectedContact.addConnection(endpointToTransfer,
			{
			   success: function() {
					console.log("contact.addConnection success");
					
					$('#holdLabel').html('Holding');
				    $('#holdButton').css('background-color', '#b3b3b3');
				    $('#holdIcon').attr('src', 'softphone_icons/ic_phone_hold_active_24px.svg');
					
					$('#softphoneTransfer').css('display', 'none');
					$('#softphoneOnCall').css('display', 'flex');
					
					//initTransferPanel();
			   },
			   failure: function() {
					console.log("contact.addConnection failure");
			   }
			});	
		}
	}
}

function placeCall(phone) {
	
	if (updatedAgent) {
		
		//$('#inactiveSoftphone').css('display', 'none');
		//$('#softphoneCalling').css('display', 'flex');
		
		var inputNumber = phone;
		if (!inputNumber) {
			inputNumber = $('#inputNumber').val();
			//var inputNumber = "+61449216577";//$('#inputNumber').val();
			//var inputNumber = "+61432330174";//$('#inputNumber').val();
		}
		
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
				//$('#inactiveSoftphone').css('display', 'flex');
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
		//$('#agentActiveStatus').css('display', 'flex');
	} else {
		
		goOffline();
		
		//$('#agentActiveStatus').hide();
		//$('#agentInactiveStatus').css('display', 'flex');
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
					   $('#holdIcon').attr('src', 'softphone_icons/ic_phone_hold_active_24px.svg');
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
					   $('#holdIcon').attr('src', 'softphone_icons/ic_phone_hold_inactive_24px.svg');
				   },
				   failure: function() {
					   console.log("connection.resume failure");
				   }
				});
			}	
		}
	}
}

function logCustomerCall() {
	
	//if (customerId) {
	if (contactSnapshot) {
		
		console.log("Calling logCustomerCall.");
		console.log(contactSnapshot);
		console.log(agentSnapshot);
		
		var currentCallPhoneNumber = "null";
		var currentCallType = "null";
		var contactConnections = contactSnapshot.contactData.connections;
		
		for (var i = 0; i < contactConnections.length; i++) {
			if (contactConnections[i].type == "outbound" || contactConnections[i].type == "inbound") {
				
				currentCallPhoneNumber = contactConnections[i].address.phoneNumber;
				
				if (currentCallPhoneNumber.indexOf("sip:") != -1 && currentCallPhoneNumber.indexOf("@") != -1) {
					
					var startIndex = currentCallPhoneNumber.indexOf("sip:") + 4;
					var endIndex = currentCallPhoneNumber.indexOf("@");
					currentCallPhoneNumber = currentCallPhoneNumber.substring(startIndex, endIndex);
				}
				
				currentCallPhoneNumber = currentCallPhoneNumber.replace("+", '%2B');
				currentCallType = contactConnections[i].type;
				break;
			}
		}
		
		var agentId = "null";
		var agentName = "null";
		if (agentSnapshot) {
			agentId = agentSnapshot.agentData.configuration.username;
			agentName = agentSnapshot.agentData.configuration.name;
		}
		
		customerId = customerId == null ? "null" : customerId;
		
		$.ajax({
			url: "https://utils.qualityconnex.com/vf.api.connectdemo/customer/logcall?phone=" + currentCallPhoneNumber + 
					"&callType=" + currentCallType +
					"&callDate=Oct 20, 2018" +
					"&callTime=12:43 AM" +
					"&agentId=" + agentId +
					"&agentName=" + agentName +
					"&agentTitle=Test Title" +
					"&customerId=" + customerId,
			
			method: "POST",
			async: "false",
			success: function (response) {
				
				$('#historyTabContent').append(
					'<div class="history-box">' +
						'<div class="history-first-col">' +
							'<div class="history-date">' + 'Oct 20, 2018' + '</div>' +
							'<div>' + '12:43 AM' + '</div>' +
						'</div>' +
						'<div class="history-second-col">' +
							'<div class="history-call-type">' + currentCallType + ' Call</div>' +
							'<div class="history-agent-details">' +
								'<div class="history-agent-name">' + agentName + '</div>' +
								'<div class="history-agent-title">' + 'Test Title' + '</div>' +
							'</div>' +
						'</div>' +
						'<div class="history-third-col">' +
							'<div class="history-call-details">Call Details</div>' +
						'</div>' +
					'</div>');
				
				getCallsByAgent();
			},
			error: function (xhr, ajaxOptions, thrownError) {

			}
		});
	}
}

function selectTab(elemName) {
			
	$('.customer-detail-tab').removeClass('selected-tab');
	$('#' + elemName).addClass('selected-tab');
	
	if (elemName == 'historyTab') {
		$('#ticketsTabContent').hide();
	} else {
		$('#historyTabContent').hide();
	}
	
	$('#' + elemName + "Content").css('display', 'flex');
}

function showSearch() {
	
	$('#innerCustomerPanel').hide();
	$('#innerSearchPanel').show();
}

function showHome() {
	
	$('#innerSearchPanel').hide();
	$('#innerCustomerPanel').show();
	$('#customerDetailsContainer').css('display', 'none');
	$('#agentDetailsContainer').css('display', 'flex');
}

function showCurrentCall() {
	
	$('#innerSearchPanel').hide();
	$('#agentDetailsContainer').css('display', 'none');
	$('#innerCustomerPanel').show();
	$('#customerDetailsContainer').css('display', 'flex');
}




function initTransferPanel() {

	if (connectedContact) {
		
		var connections = connectedContact.getConnections();

		if (connections.length >= 3) {
			
			var conn1 = connectedContact.getSingleActiveThirdPartyConnection();
			if (!conn1.isOnHold()) {
				$('#internalCallButtonsPanel').css('background-color', '#109B2B');
			} else {
				$('#internalCallButtonsPanel').css('background-color', '#E07725');
			}
		
		    var conn2 = connectedContact.getActiveInitialConnection();
			if (!conn2.isOnHold()) {
				$('#customerCallButtonsPanel').css('background-color', '#109B2B');
			} else {
				$('#customerCallButtonsPanel').css('background-color', '#E07725');
			}
			
			if (conn1.isOnHold() && conn2.isOnHold()) {
				
				$('#holdButtonCustomer').hide();
				$('#holdButtonInternal').hide();
				$('#joinButtonCustomer').show();
				$('#joinButtonInternal').show();
				
				$('#allOnHoldButtonsPanel').show();
				
			} else if (!conn1.isOnHold() && !conn2.isOnHold()) {
				
				$('#joinButtonCustomer').hide();
				$('#joinButtonInternal').hide();
				$('#holdButtonCustomer').show();
				$('#holdButtonInternal').show();
				
				$('#allResumedButtonsPanel').show();
				
			} else {
				
				$('#holdButtonCustomer').hide();
				$('#holdButtonInternal').hide();
				$('#joinButtonCustomer').hide();
				$('#joinButtonInternal').hide();
				
				$('#oneOnHoldButtonsPanel').show();
			}
			
			$('#destroyButtonCustomer').show();
			$('#destroyButtonInternal').show();
			
			$('#callControlsPanel').hide();
			$('#transferControlsPanel').show();
		}
	}
}

function join() {
	
	connectedContact.conferenceConnections({
	   success: function() {
		   
		   $('#customerCallButtonsPanel').css('background-color', '#109B2B');
			$('#internalCallButtonsPanel').css('background-color', '#109B2B');
			
			$('#oneOnHoldButtonsPanel').hide();
			$('#allOnHoldButtonsPanel').hide();
			$('#allResumedButtonsPanel').show();
			
			$('#joinButtonCustomer').hide();
			$('#holdButtonCustomer').show();
			$('#destroyButtonCustomer').show();
			$('#joinButtonInternal').hide();
			$('#holdButtonInternal').show();
			$('#destroyButtonInternal').show();
	   },
	   failure: function() {}
	});
}

function swap() {
	
	connectedContact.toggleActiveConnections(
	{
	   success: function() {
		   
		   if ($('#internalCallButtonsPanel').css('background-color') == '#E07725') {
	
				$('#internalCallButtonsPanel').css('background-color', '#109B2B');
				$('#customerCallButtonsPanel').css('background-color', '#E07725');
				
			} else {
				
				$('#internalCallButtonsPanel').css('background-color', '#E07725');
				$('#customerCallButtonsPanel').css('background-color', '#109B2B');
			}
			
			$('#joinButtonCustomer').hide();
			$('#holdButtonCustomer').hide();
			$('#destroyButtonCustomer').show();
			$('#joinButtonInternal').hide();
			$('#holdButtonInternal').hide();
			$('#destroyButtonInternal').show();
	   },
	   failure: function() {}
	});
}

function holdall() {
	
	var conn = connectedContact.getActiveInitialConnection();
	
	if (!conn.isOnHold()) {
		conn.hold({
		   success: function() {
			   console.log("connection.hold success");
			   
			   conn = connectedContact.getSingleActiveThirdPartyConnection();
			   
			   $('#customerCallButtonsPanel').css('background-color', '#E07725');
			   
			   setTimeout(function() {
			   
					conn.hold({
					   success: function() {
						   console.log("connection.hold success");
						   
						   $('#internalCallButtonsPanel').css('background-color', '#E07725');
						   
						   $('#oneOnHoldButtonsPanel').hide();
						   $('#allResumedButtonsPanel').hide();
						   $('#allOnHoldButtonsPanel').show();
						   
						   $('#joinButtonCustomer').show();
							$('#holdButtonCustomer').hide();
							$('#destroyButtonCustomer').show();
							$('#joinButtonInternal').show();
							$('#holdButtonInternal').hide();
							$('#destroyButtonInternal').show();
						   
					   },
					   failure: function() {
						   console.log("connection.hold failure");
					   }
					});
					
			   }, 1000);
		   },
		   failure: function() {
			   console.log("connection.hold failure");
		   }
		});
	} else {
		
		conn = connectedContact.getSingleActiveThirdPartyConnection();
			   
	    setTimeout(function() {
	   
			conn.hold({
			   success: function() {
				   console.log("connection.hold success");
				   
				   $('#internalCallButtonsPanel').css('background-color', '#E07725');
				   
				   $('#oneOnHoldButtonsPanel').hide();
						   $('#allResumedButtonsPanel').hide();
						   $('#allOnHoldButtonsPanel').show();
				   
				   $('#joinButtonCustomer').show();
					$('#holdButtonCustomer').hide();
					$('#destroyButtonCustomer').show();
					$('#joinButtonInternal').show();
					$('#holdButtonInternal').hide();
					$('#destroyButtonInternal').show();
			   },
			   failure: function() {
				   console.log("connection.hold failure");
			   }
			});
			
	    }, 1000);
	}
}

function resumeall() {
	
	connectedContact.conferenceConnections({
	   success: function() {
		   
		   $('#customerCallButtonsPanel').css('background-color', '#109B2B');
			$('#internalCallButtonsPanel').css('background-color', '#109B2B');
			
			$('#oneOnHoldButtonsPanel').hide();
			$('#allOnHoldButtonsPanel').hide();
			$('#allResumedButtonsPanel').show();
			
			$('#joinButtonCustomer').hide();
			$('#holdButtonCustomer').show();
			$('#destroyButtonCustomer').show();
			$('#joinButtonInternal').hide();
			$('#holdButtonInternal').show();
			$('#destroyButtonInternal').show();
	   },
	   failure: function() {}
	});
}

function joinincoming() {
	
	var conn = connectedContact.getActiveInitialConnection();
		
	if (conn) {
	
		if (conn.isOnHold()) {
			
			conn.resume({
			   success: function() {
				   console.log("connection.resume success");
				   
				   $('#customerCallButtonsPanel').css('background-color', '#109B2B');
				   
				   $('#allResumedButtonsPanel').hide();
				   $('#allOnHoldButtonsPanel').hide();
				   $('#oneOnHoldButtonsPanel').show();
				   
				   $('#joinButtonCustomer').hide();
				   $('#holdButtonCustomer').hide();
				   $('#joinButtonInternal').hide();
				   $('#holdButtonInternal').hide();
				   $('#destroyButtonCustomer').show();
				   $('#destroyButtonInternal').show();
			   },
			   failure: function() {
				   console.log("connection.resume failure");
			   }
			});
		}	
	}
}

function holdincoming() {
	
	var conn = connectedContact.getActiveInitialConnection();
		
	if (conn) {
	
		if (!conn.isOnHold()) {
			
			conn.hold({
			   success: function() {
				   console.log("connection.hold success");
				   
				   $('#allResumedButtonsPanel').hide();
				   $('#allOnHoldButtonsPanel').hide();
				   $('#oneOnHoldButtonsPanel').show();
				   
				   $('#customerCallButtonsPanel').css('background-color', '#E07725');
				   
				   $('#joinButtonCustomer').hide();
				   $('#holdButtonCustomer').hide();
				   $('#joinButtonInternal').hide();
				   $('#holdButtonInternal').hide();
				   $('#destroyButtonCustomer').show();
				   $('#destroyButtonInternal').show();
			   },
			   failure: function() {
				   console.log("connection.hold failure");
			   }
			});
		}	
	}
}

function destroyincoming() {
	
	var conn = connectedContact.getActiveInitialConnection();
		
	if (conn) {
		conn.destroy({
		   success: function() {
			   
			    console.log("connection.destroy success");
				
				$('#transferControlsPanel').hide();
				$('#callControlsPanel').show();
			   
		   },
		   failure: function() {
			    console.log("connection.destroy failure");
		   }
		});
	}
}

function joinagent() {
	
	var conn = connectedContact.getSingleActiveThirdPartyConnection();

	if (conn) {
	
		if (conn.isOnHold()) {
			
			conn.resume({
			   success: function() {
				   console.log("connection.resume success");
				   
				   $('#internalCallButtonsPanel').css('background-color', '#109B2B');
				   
				   $('#allResumedButtonsPanel').hide();
				   $('#allOnHoldButtonsPanel').hide();
				   $('#oneOnHoldButtonsPanel').show();
				   
				   $('#joinButtonCustomer').hide();
				   $('#holdButtonCustomer').hide();
				   $('#joinButtonInternal').hide();
				   $('#holdButtonInternal').hide();
				   $('#destroyButtonCustomer').show();
				   $('#destroyButtonInternal').show();
			   },
			   failure: function() {
				   console.log("connection.resume failure");
			   }
			});
		}	
	}
}

function holdagent() {
	
	var conn = connectedContact.getSingleActiveThirdPartyConnection();
		
	if (conn) {
	
		if (!conn.isOnHold()) {
			
			conn.hold({
			   success: function() {
				   console.log("connection.hold success");
				   
				   $('#allResumedButtonsPanel').hide();
				   $('#allOnHoldButtonsPanel').hide();
				   $('#oneOnHoldButtonsPanel').show();
				   
				   $('#internalCallButtonsPanel').css('background-color', '#E07725');
				   
				   $('#joinButtonCustomer').hide();
				   $('#holdButtonCustomer').hide();
				   $('#joinButtonInternal').hide();
				   $('#holdButtonInternal').hide();
				   $('#destroyButtonCustomer').show();
				   $('#destroyButtonInternal').show();
			   },
			   failure: function() {
				   console.log("connection.hold failure");
			   }
			});
		}
	}
}

function destroyagent() {
	
	var conn = connectedContact.getSingleActiveThirdPartyConnection();
		
	if (conn) {
		conn.destroy({
		   success: function() {
			   
			    console.log("connection.destroy success");
				
				$('#transferControlsPanel').hide();
				$('#callControlsPanel').show();
			   
		   },
		   failure: function() {
			    console.log("connection.destroy failure");
		   }
		});
	}
}






function searchCustomers() {
	
	var customerName = $('#customerNameToSearch').val();

	if (customerName != '') {
	
		$('#searchResults').hide();
		$('#loadingCustomersLabel').css('display', 'flex');
	
		$.ajax({
			url: "https://utils.qualityconnex.com/vf.api.connectdemo/customer/search?customerName=" + customerName,
			success: function (response) {

				console.log(response);
				
				$('#loadingCustomersLabel').css('display', 'none');
				$('#searchResults').html('');
				
				if (response.customers != null) {
				
					for (var i = 0; i < response.customers.length; i++) {
						
						$('#searchResults').append(
							'<div style="display: flex; border: 1px solid lightgray; margin: 5px 10px; justify-content: space-between;">' +
								'<div style="padding: 10px; width: 300px;">' +
									'<div style="display: flex;">' +
										'<div style="font-weight: bold; width: 100px;">First Name:&nbsp;</div><div>' + response.customers[i].firstName + '</div>' +
									'</div>' +
									'<div style="display: flex;">' +
										'<div style="font-weight: bold; width: 100px;">Last Name:&nbsp;</div><div>' + response.customers[i].lastName + '</div>' +
									'</div>' +
								'</div>' +
								'<div style="padding: 10px; width: 400px;">' +
									'<div style="display: flex;">' +
										'<div style="font-weight: bold; width: 80px;">Email:&nbsp;</div><div>' + response.customers[i].email + '</div>' +
									'</div>' +
									'<div style="display: flex;">' +
										'<div style="font-weight: bold; width: 80px;">Phone:&nbsp;</div><div style="text-decoration: underline; color: blue; cursor: pointer;" onclick="placeCall(\'' + response.customers[i].phone + '\');">' + response.customers[i].phone + '</div>' +
									'</div>' +
								'</div>' +
								'<div style="padding: 10px; align-self: flex-end;">' +
									'<div onclick="viewCustomerDetail(\'' + response.customers[i].id + '\');" style="font-size: 14px; display: flex; justify-content: center; align-items: center; width: 168px; height: 30px; background-color: black; color: white; border-radius: 2px; cursor: pointer;">' +
										'View Detail' +
									'</div>' +
								'</div>' +
							'</div>');
					}
				}
				
				$('#searchResults').show();
				
			},
			error: function (xhr, ajaxOptions, thrownError) {

			}
		});
	}
}

function getCallsByAgent() {

	//if (updatedAgent != null) {
	
		$.ajax({
			url: "https://utils.qualityconnex.com/vf.api.connectdemo/customer/getcallsbyagent?agentId=agus",// + customerName,
			success: function (response) {

				console.log(response);

				$('#recentCallsList').html('');
				
				if (response.calls != null) {
				
					for (var i = 0; i < response.calls.length; i++) {
					
						var callTypeIcon = response.calls[i].callType.toLowerCase() == "inbound" ? "ic_call_incoming_30px.svg" : "ic_call_outgoing_30px.svg" ;
						
						$('#recentCallsList').append(
							'<div style="padding: 6px; margin: 0 10px; border-bottom: 1px solid lightgray; display: flex; align-items: center;">' +
								'<div style="padding-right: 10px;">' +
									'<img src="address_book_icons/' + callTypeIcon + '" />' +
								'</div>' +
								'<div>' +
									'<div style="color: white; font-weight: bold; padding-bottom: 5px;">' + response.calls[i].customerName + '</div>' +
									'<div style="color: lightgray;">' + response.calls[i].phone + '</div>' +
								'</div>' +
							'</div>');
					}
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {

			}
		});
	//}
}

function viewCustomerDetail(customerId) {

	$('#innerSearchPanel').hide();
	$('#agentDetailsContainer').css('display', 'none');
	$('#innerCustomerPanel').show();

	$.ajax({
		url: "https://utils.qualityconnex.com/vf.api.connectdemo/customer/getinfo?customerId=" + customerId,
		success: function (response) {

			console.log(response);
			
			// reset tabs
			$('.customer-detail-tab').removeClass('selected-tab');
			$('#ticketCount').html('0');
			$('#ticketsTabContent').hide();
			$('#ticketsTabContent').html('');
			$('#historyCount').html('0');
			$('#historyTabContent').hide();
			$('#historyTabContent').html('');
			
			if (response.user != null) {
			
				$('#currentDiallerStatus').html("Inbound Call");
				$('.customer-name').html(response.user.firstName + " " + response.user.lastName);
				$('#customerTitle').html(response.user.title + " at " + response.user.company);
				$('#customerEmail').html(response.user.email);
				$('#customerPhone').html(response.user.phone);
				
				$('#customerDetailsContainer').css('display', 'flex');
				$('#currentCallTab').show();
				
				if (response.user.cases != null) {
					
					$('#ticketCount').html(response.user.cases.length);
					$('#ticketsTabContent').html('');
					
					for (var i = 0; i < response.user.cases.length; i++) {
						
						$('#ticketsTabContent').append(
							'<div class="ticket-box">' +
								'<div class="ticket-box-header">' +
									'<div>Ticket # ' + response.user.cases[i].caseId + '</div>' +
									'<div>' + response.user.cases[i].callDate + ' ' + response.user.cases[i].callTime + '</div>' +
								'</div>' +
								
								'<div class="ticket-box-detail-container">' +
									'<div class="ticket-box-detail-label">Reason:</div>' +
									'<div class="ticket-box-detail-content"></div>' +
								'</div>' +
								'<div class="ticket-box-detail-container">' +
									'<div class="ticket-box-detail-label">Status:</div>' +
									'<div class="ticket-box-detail-content">' + response.user.cases[i].caseStatus + '</div>' +
								'</div>' +
								'<div class="ticket-box-detail-container">' +
									'<div class="ticket-box-detail-label">Assigned:</div>' +
									'<div class="ticket-box-detail-content">' + response.user.cases[i].agentName + '</div>' +
								'</div>' +
							'</div>');
					}
				}
				
				if (response.user.calls != null) {
					
					$('#historyCount').html(response.user.calls.length);
					$('#historyTabContent').html('');
					
					for (var i = 0; i < response.user.calls.length; i++) {
						
						var call = response.user.calls[i];
						
						var callTypeIcon = call.callType.toLowerCase() == "inbound" ? "ic_call_incoming_30px.svg" : "ic_call_outgoing_30px.svg";
						
						$('#historyTabContent').append(
							'<div class="history-box">' +
								'<div class="history-first-col">' +
									'<div class="history-date">' + call.callDate + '</div>' +
									'<div>' + call.callTime + '</div>' +
								'</div>' +
								'<div class="history-second-col">' +
									'<div class="history-call-type">' +
										'<div style="margin-right: 10px;"><img src="address_book_icons/' + callTypeIcon + '" /></div>' +
										'<div style="">' +
											'<div style="font-weight: bold;">' + call.callType + ' Call</div>' +
											'<div style="">' + call.phone + '</div>' +
										'</div>' +
									'</div>' +
									'<div class="history-agent-details">' +
										'<div style="margin-right: 10px;"><img src="customer_profile_icons/ic_person_24px.svg" width="30" height="30" /></div>' +
										'<div style="">' +
											'<div class="history-agent-name">' + call.agentName + '</div>' +
										'<div class="history-agent-title">' + call.agentTitle + '</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
								'<div class="history-third-col">' +
									'<div class="history-call-details">Call Details</div>' +
								'</div>' +
							'</div>');
					}
					
					$('#historyTab').addClass('selected-tab');
					$('#historyTabContent').css('display', 'flex');
				}
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {

		}
	});
}