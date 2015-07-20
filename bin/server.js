(function () { "use strict";
var console = (1,eval)('this').console || {log:function(){}};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
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
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
Math.__name__ = true;
var Node = function() { };
Node.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
var Server = function() {
	this.app = Server.createInstance(Server.express);
	this.httpSrv = node_Http.createServer(this.app);
};
Server.__name__ = true;
Server.main = function() {
	var args = Node.process.argv;
	var cfgName;
	if(args.length > 2) cfgName = args[2]; else cfgName = "default";
	var file = "" + Node.dirname + "/" + "../cfg" + "/" + cfgName + ".toml";
	var text = node_Fs.readFileSync(file,node__$Encoding_Encoding_$Impl_$.fromString("utf8"));
	var toml = haxetoml_TomlParser.parseString(text,null);
	var cfg = toml;
	console.log("CFG file " + file);
	var srv = new Server();
	srv.run(cfg);
};
Server.createInstance = function(of) {
	return new of();
};
Server.prototype = {
	run: function(cfg) {
		this.app.get("/test",function(req,rsp) {
			rsp.send("OK");
		});
		var staticPath = "" + Node.dirname + "/frontend";
		this.app["use"]("/",Server.expressStatic(staticPath));
		console.log("using static at " + staticPath);
		console.log("PORT " + cfg.port);
		this.httpSrv.listen(cfg.port);
	}
	,__class__: Server
};
var Std = function() { };
Std.__name__ = true;
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() { };
StringBuf.__name__ = true;
StringBuf.prototype = {
	__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
var haxe_Utf8 = function(size) {
	this.__b = "";
};
haxe_Utf8.__name__ = true;
haxe_Utf8.prototype = {
	__class__: haxe_Utf8
};
var haxetoml_TomlParser = function() {
	this.pos = 0;
};
haxetoml_TomlParser.__name__ = true;
haxetoml_TomlParser.parseString = function(toml,defaultValue) {
	return new haxetoml_TomlParser().parse(toml,defaultValue);
};
haxetoml_TomlParser.prototype = {
	parse: function(str,defaultValue) {
		this.tokens = this.tokenize(str);
		if(defaultValue != null) this.root = defaultValue; else this.root = { };
		this.pos = 0;
		this.parseObj();
		return this.root;
	}
	,get_currentToken: function() {
		return this.tokens[this.pos];
	}
	,nextToken: function() {
		this.pos++;
	}
	,parseObj: function() {
		var keygroup = "";
		while(this.pos < this.tokens.length) {
			var _g = this.get_currentToken().type;
			switch(_g) {
			case 3:
				keygroup = this.decodeKeygroup(this.get_currentToken());
				this.createKeygroup(keygroup);
				this.nextToken();
				break;
			case 2:
				var pair = this.parsePair();
				this.setPair(keygroup,pair);
				break;
			default:
				this.InvalidToken(this.get_currentToken());
			}
		}
	}
	,parsePair: function() {
		var key = "";
		var value = { };
		if(this.get_currentToken().type == 2) {
			key = this.decodeKey(this.get_currentToken());
			this.nextToken();
			if(this.get_currentToken().type == 9) {
				this.nextToken();
				value = this.parseValue();
			} else this.InvalidToken(this.get_currentToken());
		} else this.InvalidToken(this.get_currentToken());
		return { key : key, value : value};
	}
	,parseValue: function() {
		var value = { };
		var _g = this.get_currentToken().type;
		switch(_g) {
		case 4:
			value = this.decodeString(this.get_currentToken());
			this.nextToken();
			break;
		case 8:
			value = this.decodeDatetime(this.get_currentToken());
			this.nextToken();
			break;
		case 6:
			value = this.decodeFloat(this.get_currentToken());
			this.nextToken();
			break;
		case 5:
			value = this.decodeInteger(this.get_currentToken());
			this.nextToken();
			break;
		case 7:
			value = this.decodeBoolean(this.get_currentToken());
			this.nextToken();
			break;
		case 11:
			value = this.parseArray();
			break;
		default:
			this.InvalidToken(this.get_currentToken());
		}
		return value;
	}
	,parseArray: function() {
		var array = [];
		if(this.get_currentToken().type == 11) {
			this.nextToken();
			try {
				while(true) {
					if(this.get_currentToken().type != 12) array.push(this.parseValue()); else {
						this.nextToken();
						throw "__break__";
					}
					var _g = this.get_currentToken().type;
					switch(_g) {
					case 10:
						this.nextToken();
						break;
					case 12:
						this.nextToken();
						throw "__break__";
						break;
					default:
						this.InvalidToken(this.get_currentToken());
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
		}
		return array;
	}
	,createKeygroup: function(keygroup) {
		var keys = keygroup.split(".");
		var obj = this.root;
		var _g = 0;
		while(_g < keys.length) {
			var key = keys[_g];
			++_g;
			var next = Reflect.field(obj,key);
			if(next == null) {
				obj[key] = { };
				next = Reflect.field(obj,key);
			}
			obj = next;
		}
	}
	,setPair: function(keygroup,pair) {
		var keys = keygroup.split(".");
		var obj = this.root;
		var _g = 0;
		while(_g < keys.length) {
			var key = keys[_g];
			++_g;
			if(key != "") obj = Reflect.field(obj,key);
		}
		obj[pair.key] = pair.value;
	}
	,decode: function(token,expectedType,decoder) {
		var type = token.type;
		var value = token.value;
		if(type == expectedType) return decoder(value); else throw "Can't parse " + type + " as " + expectedType;
	}
	,decodeKeygroup: function(token) {
		return this.decode(token,3,function(v) {
			return v.substring(1,v.length - 1);
		});
	}
	,decodeString: function(token) {
		var _g = this;
		return this.decode(token,4,function(v) {
			try {
				return _g.unescape(v);
			} catch( msg ) {
				if( js_Boot.__instanceof(msg,String) ) {
					_g.InvalidToken(token);
					return "";
				} else throw(msg);
			}
		});
	}
	,decodeDatetime: function(token) {
		return this.decode(token,8,function(v) {
			var dateStr = new EReg("(T|Z)","").replace(v,"");
			return HxOverrides.strDate(dateStr);
		});
	}
	,decodeFloat: function(token) {
		return this.decode(token,6,function(v) {
			return Std.parseFloat(v);
		});
	}
	,decodeInteger: function(token) {
		return this.decode(token,5,function(v) {
			return Std.parseInt(v);
		});
	}
	,decodeBoolean: function(token) {
		return this.decode(token,7,function(v) {
			return v == "true";
		});
	}
	,decodeKey: function(token) {
		return this.decode(token,2,function(v) {
			return v;
		});
	}
	,unescape: function(str) {
		var pos = 0;
		var buf = new haxe_Utf8();
		var len = str.length;
		while(pos < len) {
			var c = HxOverrides.cca(str,pos);
			if((pos == 0 || pos == len - 1) && c == 34) {
				pos++;
				continue;
			}
			pos++;
			if(c == 92) {
				c = HxOverrides.cca(str,pos);
				pos++;
				if(c != null) switch(c) {
				case 114:
					buf.__b += "\r";
					break;
				case 110:
					buf.__b += "\n";
					break;
				case 116:
					buf.__b += "\t";
					break;
				case 98:
					buf.__b += "\x08";
					break;
				case 102:
					buf.__b += "\x0C";
					break;
				case 47:case 92:case 34:
					buf.__b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(str,pos,4));
					buf.__b += String.fromCharCode(uc);
					pos += 4;
					break;
				default:
					throw "Invalid Escape";
				} else throw "Invalid Escape";
			} else buf.__b += String.fromCharCode(c);
		}
		return buf.__b;
	}
	,tokenize: function(str) {
		var tokens = new Array();
		var lineBreakPattern = new EReg("\r\n?|\n","g");
		var lines = lineBreakPattern.split(str);
		var a = new EReg("abc","");
		var patterns = [{ type : 1, ereg : new EReg("^#.*$","")},{ type : 3, ereg : new EReg("^\\[.+]","")},{ type : 4, ereg : new EReg("^\"((\\\\\")|[^\"])*\"","")},{ type : 9, ereg : new EReg("^=","")},{ type : 11, ereg : new EReg("^\\[","")},{ type : 12, ereg : new EReg("^]","")},{ type : 10, ereg : new EReg("^,","")},{ type : 2, ereg : new EReg("^\\S+","")},{ type : 8, ereg : new EReg("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z","")},{ type : 6, ereg : new EReg("^-?\\d+\\.\\d+","")},{ type : 5, ereg : new EReg("^-?\\d+","")},{ type : 7, ereg : new EReg("^true|^false","")}];
		var _g1 = 0;
		var _g = lines.length;
		while(_g1 < _g) {
			var lineNum = _g1++;
			var line = lines[lineNum];
			var colNum = 0;
			var tokenColNum = 0;
			while(colNum < line.length) {
				while(StringTools.isSpace(line,colNum)) colNum++;
				if(colNum >= line.length) break;
				var subline = line.substring(colNum);
				var matched = false;
				var _g2 = 0;
				while(_g2 < patterns.length) {
					var pattern = patterns[_g2];
					++_g2;
					var type = pattern.type;
					var ereg = pattern.ereg;
					if(ereg.match(subline)) {
						if((type == 3 || type == 2) && tokenColNum != 0) continue;
						if(type != 1) {
							tokens.push({ type : type, value : ereg.matched(0), lineNum : lineNum, colNum : colNum});
							tokenColNum++;
						}
						colNum += ereg.matchedPos().len;
						matched = true;
						break;
					}
				}
				if(!matched) this.InvalidCharacter(line.charAt(colNum),lineNum,colNum);
			}
		}
		return tokens;
	}
	,InvalidCharacter: function($char,lineNum,colNum) {
		throw "Line " + lineNum + " Character " + (colNum + 1) + ": " + ("Invalid Character '" + $char + "', ") + ("Character Code " + HxOverrides.cca($char,0));
	}
	,InvalidToken: function(token) {
		throw "Line " + (token.lineNum + 1) + " Character " + (token.colNum + 1) + ": " + ("Invalid Token '" + token.value + "'(" + token.type + ")");
	}
	,__class__: haxetoml_TomlParser
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var js_Lib = function() { };
js_Lib.__name__ = true;
var node__$Encoding_Encoding_$Impl_$ = {};
node__$Encoding_Encoding_$Impl_$.__name__ = true;
node__$Encoding_Encoding_$Impl_$.fromString = function(v) {
	if(HxOverrides.indexOf(node__$Encoding_Encoding_$Impl_$.allowedNames,v,0) == -1) throw "Unkown encoding: " + v;
	return v;
};
var node__$Fs_SymlinkType_$Impl_$ = {};
node__$Fs_SymlinkType_$Impl_$.__name__ = true;
node__$Fs_SymlinkType_$Impl_$._new = function(name) {
	var this1;
	if(HxOverrides.indexOf(node__$Fs_SymlinkType_$Impl_$.allowedNames,name,0) == -1) throw "Unkown symlink type: " + name;
	this1 = name;
	return this1;
};
var node__$Fs_FileOpenFlags_$Impl_$ = {};
node__$Fs_FileOpenFlags_$Impl_$.__name__ = true;
node__$Fs_FileOpenFlags_$Impl_$._new = function(name) {
	var this1;
	if(HxOverrides.indexOf(node__$Fs_FileOpenFlags_$Impl_$.allowedNames,name,0) == -1) throw "Unkown symlink type: " + name;
	this1 = name;
	return this1;
};
var node_Fs = require("fs");
var node_stream_Readable = function() { };
node_stream_Readable.__name__ = true;
node_stream_Readable.prototype = {
	__class__: node_stream_Readable
};
var node_Http = require("http");
var node_stream_Writable = function() { };
node_stream_Writable.__name__ = true;
node_stream_Writable.prototype = {
	__class__: node_stream_Writable
};
var node_stream_Duplex = function() { };
node_stream_Duplex.__name__ = true;
node_stream_Duplex.__interfaces__ = [node_stream_Writable,node_stream_Readable];
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Node.Object = Object;
Node.setTimeout = setTimeout;
Node.clearTimeout = clearTimeout;
Node.setInterval = setInterval;
Node.clearInterval = clearInterval;
Node.setImmediate = setImmediate;
Node.clearImmediate = clearImmediate;
Node.filename = __filename;
Node.dirname = __dirname;
Node.module = module;
Node.process = process;
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Server.CFG_ROOT = "../cfg";
Server.express = require("express");
Server.expressStatic = Server.express["static"];
js_Boot.__toStr = {}.toString;
node__$Encoding_Encoding_$Impl_$.Hex = "hex";
node__$Encoding_Encoding_$Impl_$.Utf8 = "utf8";
node__$Encoding_Encoding_$Impl_$.Ascii = "ascii";
node__$Encoding_Encoding_$Impl_$.Binary = "binary";
node__$Encoding_Encoding_$Impl_$.Base64 = "base64";
node__$Encoding_Encoding_$Impl_$.Ucs2 = "ucs2";
node__$Encoding_Encoding_$Impl_$.Utf16LE = "utf16le";
node__$Encoding_Encoding_$Impl_$.Raw = "raw";
node__$Encoding_Encoding_$Impl_$.allowedNames = "hex|utf8|ascii|binary|base64|ucs2|utf16le|raw".split("|");
node__$Fs_SymlinkType_$Impl_$.Dir = "dir";
node__$Fs_SymlinkType_$Impl_$.File = "file";
node__$Fs_SymlinkType_$Impl_$.Junction = "junction";
node__$Fs_SymlinkType_$Impl_$.allowedNames = "dir|file|junction".split("|");
node__$Fs_FileOpenFlags_$Impl_$.allowedNames = "r|r+|rs|rs+|w|wx|w+|wx+|a|ax|a+|ax+".split("|");
Server.main();
})();

//# sourceMappingURL=server.js.map