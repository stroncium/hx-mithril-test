(function ($hx_exports) { "use strict";
var console = (1,eval)('this').console || {log:function(){}};
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var StringTools = function() { };
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var Storage = function() { };
Storage.get = function() {
	var json = js_Browser.getLocalStorage().getItem(Storage.ID);
	if(json == null) return Storage.DEFAULT; else return JSON.parse(json);
};
Storage.put = function(d) {
	js_Browser.getLocalStorage().setItem(Storage.ID,JSON.stringify(d));
};
var Todo = $hx_exports.Todo = function() {
	this.focused = false;
	this.title = "";
	this.list = Storage.get();
};
Todo.run = function() {
	var todo = new Todo();
	M.route.mode = "hash";
	M.route(window.document.getElementById("todoapp"),"/",{ '/' : todo, '/:filter' : todo});
};
Todo.inputWatcher = function(onEnter,onEscape) {
	return function(e) {
		var _g = e.keyCode;
		switch(_g) {
		case 13:
			onEnter();
			break;
		case 27:
			onEscape();
			break;
		default:
		}
	};
};
Todo.main = function() {
};
Todo.prototype = {
	controller: function() {
		this.filter = M.route.param("filter");
		if(this.filter == null) this.filter = "";
	}
	,save: function() {
		Storage.put(this.list);
	}
	,add: function() {
		var title = StringTools.trim(this.title);
		if(title != "") {
			this.list.push({ title : title});
			Storage.put(this.list);
		}
		title = "";
	}
	,complete: function(todo) {
		todo.completed = !todo.completed;
		Storage.put(this.list);
	}
	,isVisible: function(todo) {
		var _g = this.filter;
		switch(_g) {
		case "active":
			return !todo.completed;
		case "completed":
			return todo.completed;
		default:
			return true;
		}
	}
	,edit: function(todo) {
		todo.previousTitle = todo.title;
		todo.editing = true;
	}
	,doneEditing: function(todo,index) {
		todo.editing = false;
		todo.title = StringTools.trim(todo.title);
		if(todo.title == "") this.list.splice(index,1);
		Storage.put(this.list);
	}
	,cancelEditing: function(todo) {
		todo.title = todo.previousTitle;
		todo.previousTitle = null;
		todo.editing = false;
	}
	,clearTitle: function() {
		this.title = "";
	}
	,remove: function(index) {
		this.list.splice(index,1);
		Storage.put(this.list);
	}
	,clearCompleted: function() {
		var i = this.list.length;
		while(i-- > 0) if(this.list[i].completed) this.list.splice(i,1);
	}
	,countCompleted: function() {
		var count = 0;
		var _g = 0;
		var _g1 = this.list;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(i.completed) count++;
		}
		return count;
	}
	,allCompleted: function() {
		return this.countCompleted() == this.list.length;
	}
	,completeAll: function() {
		var val = !this.allCompleted();
		var _g = 0;
		var _g1 = this.list;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			i.completed = val;
		}
	}
	,view: function() {
		var _g = this;
		return [M("header#header",[M("h1","todos"),M("input#new-todo[placeholder=\"What needs to be done?\"]",{ onkeyup : Todo.inputWatcher($bind(this,this.add),$bind(this,this.clearTitle)), value : this.title, oninput : M.withAttr("value",function(v) {
			_g.title = v;
		}), config : function(element) {
			if(!_g.focused) {
				element.focus();
				_g.focused = true;
			}
		}})]),M("section#main",{ style : { display : this.list.length == 0?"none":""}},[M("input#toggle-all[type=checkbox]",{ onclick : $bind(this,this.completeAll), checked : this.allCompleted()}),M("ul#todo-list",(function($this) {
			var $r;
			var _g1 = [];
			{
				var _g2 = 0;
				var _g11 = $this.list.length;
				while(_g2 < _g11) {
					var i = _g2++;
					if($this.isVisible($this.list[i])) _g1.push($this.viewTodo($this.list[i],i));
				}
			}
			$r = _g1;
			return $r;
		}(this)))]),this.list.length == 0?null:this.viewFooter()];
	}
	,viewFooter: function() {
		var compl = this.countCompleted();
		var active = this.list.length - compl;
		return M("footer#footer",[M("span#todo-count",[M("strong","" + active),active == 1?" item":" items"," left"]),M("ul#filters",[M("li",M("a[href=/]",{ config : M.route, className : this.filter == ""?"selected":""},"All")),M("li",M("a[href=/active]",{ config : M.route, className : this.filter == "active"?"selected":""},"Active")),M("li",M("a[href=/completed]",{ config : M.route, className : this.filter == "completed"?"selected":""},"Completed"))]),compl == 0?null:M("button#clear-completed",{ onclick : $bind(this,this.clearCompleted)},"Clear completed")]);
	}
	,viewTodo: function(todo,index) {
		var classes = "";
		if(todo.completed) classes += " completed";
		if(todo.editing) classes += " editing";
		return M("li",{ className : classes},[M(".view",[M("input.toggle[type=checkbox]",{ onclick : (function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.complete),todo), checked : todo.completed}),M("label",{ ondblclick : (function(f1,a11) {
			return function() {
				f1(a11);
			};
		})($bind(this,this.edit),todo)},todo.title),M("button.destroy",{ onclick : (function(f2,a12) {
			return function() {
				f2(a12);
			};
		})($bind(this,this.remove),index)})]),M("input.edit",{ value : todo.title, onkeyup : Todo.inputWatcher((function(f3,a13,a2) {
			return function() {
				f3(a13,a2);
			};
		})($bind(this,this.doneEditing),todo,index),(function(f4,a14) {
			return function() {
				f4(a14);
			};
		})($bind(this,this.cancelEditing),todo)), oninput : M.withAttr("value",function(v) {
			todo.title = v;
		}), onblur : (function(f5,a15,a21) {
			return function() {
				f5(a15,a21);
			};
		})($bind(this,this.doneEditing),todo,index), config : function(el) {
			if(todo.editing) {
				el.focus();
				el.selectionStart = el.value.length;
			}
		}})]);
	}
};
var js_Browser = function() { };
js_Browser.getLocalStorage = function() {
	try {
		var s = window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
var M = m;
Storage.ID = "hx-mithril-todo";
Storage.DEFAULT = [];
Todo.ENTER_KEY = 13;
Todo.ESC_KEY = 27;
Todo.main();
})(typeof window != "undefined" ? window : exports);

//# sourceMappingURL=todo.js.map