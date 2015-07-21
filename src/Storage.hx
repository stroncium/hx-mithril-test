class Storage{
  static var ID = 'hx-mithril-todo';
  static var DEFAULT = [];
  public static function get():Dynamic{
    var json = js.Browser.getLocalStorage().getItem(ID);
    return json == null ? DEFAULT : haxe.Json.parse(json);
  }

  public static function put(d:Dynamic){
    js.Browser.getLocalStorage().setItem(ID, haxe.Json.stringify(d));
  }
}
