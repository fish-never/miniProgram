
function generateGUID() {
	function _p8(s) {
	  var p = (Math.random().toString(16) + "000000000").substr(2, 8);
	  return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
	}
	return _p8() + _p8(true) + _p8(true) + _p8();
}

function runEvents(eventName,res){
	let events = EventListener.events[eventName];
	for (var id in events) {
		let itemFunc = events[id];
		itemFunc.call(this,res,eventName + ':' + id);
	}
}

class EventListener {
	// constructor() {
	// }
	static guid = generateGUID;
	static events = {
		userInfo : {}
	};

	userInfo(obj){
		let funcType = typeof obj;
		switch (funcType){
			case 'function':
				let id = EventListener.guid();
				EventListener.events.userInfo[id] = obj;
				return 'userInfo:' + id;
			case 'undefined':
				runEvents.call(this,'userInfo');
				return;
			case 'object':
				runEvents.call(this,'userInfo',obj);
				return;
		}
	}

	cleanUserInfo(){
		EventListener.events.userInfo = {};
	}

	removeEvent(eventId){
		let [eventName, id] = eventId.split(':');
		delete EventListener.events[eventName][id];
	}

	
}

export default new EventListener();
