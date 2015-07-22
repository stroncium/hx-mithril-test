private typedef Prop<T> = ?T->T;

class Comp<T:{function view():Node;}>{
  public function new(cl:Class<T>, args:Array<Dynamic>){
    controller = function(){
      var o = untyped Object.create(cl.prototype);
      untyped cl.apply(o, args);
      return o;
    }
  }
  var controller:Dynamic;
  function view(ctrl){
    return ctrl.view();
  }
}

private typedef Promize = Dynamic;

abstract Node(Dynamic) from Comp<Dynamic> from String from Float from Array<Node>{
  public inline function new(v:Dynamic) this = v;
}

private typedef MithrilFn = String->?Dynamic->?Node->Node;
@:native('M')
#if !macro extern #end
class Mithril{
  public static macro function set(expr:haxe.macro.Expr){
    return macro function(v) $expr = v;
  }
  public static macro function setAttr(name:String, expr:haxe.macro.Expr){
    return macro Mithril.withAttr($v{name}, function(v) $expr = v);
  }
  public static macro function component(expr:haxe.macro.Expr, args:Array<haxe.macro.Expr>){
    return macro ((new Mithril.Comp($expr, [$a{args}]):Dynamic):Mithril.Node);
  }
  #if !macro

  public static inline function routeParam(name:String):Null<String> return (untyped route).param(name);
  public static var routeMode(get,set):String;
  static inline function get_routeMode():String return (untyped route).mode;
  static inline function set_routeMode(v:String):String return (untyped route).mode = v;

  public static inline function getRoute():String return (untyped route)();
  public static function route(el:js.html.Element, def:String, routes:Dynamic):Void;

  public static function prop<T>(v:T):Prop<T>;
  public static function module(el:js.html.Element, comp:Comp<Dynamic>):Void;
  public static function withAttr(name:String, fn:Dynamic->Void):Void->Void;
  public static function request(opts:Dynamic):Promize;
  public static function startComputation():Void;
  public static function endComputation():Void;
  public static function redraw():Void;
  public static var m(get, null):MithrilFn;

  static inline function get_m():MithrilFn return untyped Mithril;
  static function __init__():Void var M = untyped __js__('m');

  #end
}

