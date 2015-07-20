import node.Http;
import haxe.Json;

typedef Config = {
  port: Int,
  // mongo:{
  //   db:String,
  //   host:String,
  //   port:Int,
  // },
}

class Server{
  static inline var CFG_ROOT = '../cfg';
  public static function main(){
    var args = Node.process.argv;
    var cfgName = args.length > 2 ? args[2] : 'default';
    var file = '${Node.dirname}/$CFG_ROOT/$cfgName.toml';
    var text = node.Fs.readFileSync(file, 'utf8');
    var toml = haxetoml.TomlParser.parseString(text, null);
    var cfg = toml;
    trace('CFG file $file');
    var srv = new Server();
    srv.run(cfg);
  }

  static var express:haxe.DynamicAccess<Dynamic> = js.Lib.require('express');
  static var expressStatic = express['static'];

  var httpSrv:HttpServer;
  var app:Dynamic;

  // var mongo:Db;
  // var logClx:Collection<Dynamic>;

  static function createInstance(of:Dynamic):Dynamic{
    return untyped __js__('new of')();
  }

  public function new(){
    app = createInstance(express);
    httpSrv = Http.createServer(app);
  }

  function run(cfg:Config){
    // mongo = new node.mongodb.Db(cfg.mongo.db, new node.mongodb.Server(cfg.mongo.host, cfg.mongo.port, {auto_reconnect: true}), {safe:false });
    // mongo.open(function(err){
    //   if(err != null) throw err;
      app.get('/test', function(req, rsp){
        rsp.send('OK');
      });

      var staticPath = '${Node.dirname}/frontend';
      app.use('/', expressStatic(staticPath));
      trace('using static at $staticPath');

      trace('PORT ${cfg.port}');
      httpSrv.listen(cfg.port);
    // });
  }

}
