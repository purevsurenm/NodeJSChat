(function(){
	var getNode = function(s){
		return document.querySelector(s);
	},

	//Get required nodes
	status = getNode('.status span'),
	msgCtnr = getNode('.msg-ctnr'),
	textarea = getNode('.chat textarea'),
	userName = getNode('.username'),
	
	defaultStatus = status.textContent,
	
	setStatus = function(s){
		status.textContent = s;

		if(s !== defaultStatus){
			var delay = setTimeout(function(){
				setStatus(defaultStatus);
				clearInterval(delay);
			}, 3000);
		}
	};

	try{
		var socket = io.connect('http://127.0.0.1:8080');
	} catch(e) {
		// Set status to warn user
	}

	if(socket !== undefined){
		//Listen for messages
		socket.on('output', function(data){
			if(data.length){
				//Loop though the elements
				for(var i=0; i < data.length; i++){
					var message = document.createElement('div')
						messageSpan = document.createElement('span');
						messageParagraph = document.createElement('p');

					messageSpan.textContent = data[i].name + ': ';
					messageParagraph.textContent = data[i].message;
					
					message.setAttribute('class', 'msg');
					message.appendChild(messageSpan);
					message.appendChild(messageParagraph);

					//Append
					msgCtnr.appendChild(message);
					msgCtnr.insertBefore(message, msgCtnr.lastChild);
				}
			}
		});

		//Listen for Status
		socket.on('status', function(data){
			setStatus((typeof data === 'object') ? data.message : data);

			if(data.clear === true){
				textarea.value = '';
			};
		});

		//Listen for keydown
		textarea.addEventListener('keydown', function(event){
			var self = this,
				name = userName.value;

			if(event.which === 13 && event.shiftKey === false){
				socket.emit('input', {
					name : name,
					message : self.value
				});
			}
		});
	}
})();