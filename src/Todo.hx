import Mithril.*;
using StringTools;

@:expose('Todo')
class Todo{
  static function run(){
    var todo = new Todo(Storage.get());
    Mithril.routeMode = 'hash';
    Mithril.route(js.Browser.document.body, '/', {
      '/':todo,
      '/:filter':todo,
    });
  }

  var list:Array<model.Todo>;

  function new(list){
    this.list = list;
  }

  var ctrl:{
    filter:String,
    title:String,
  };

  function controller(){
    return {filter: Mithril.routeParam('filter'), title:''};
  }

  public inline function save(){
    Storage.put(list);
  }

  function add(){
    var title = ctrl.title.trim();
    if(title != ''){
      list.push({title:title, time:Date.now().getTime(), completed:false});
      save();
    }
    ctrl.title = '';
  }

  function clearTitle(){
    ctrl.title = '';
  }

  public function remove(todo){
    var idx = list.indexOf(todo);
    if(idx == -1) return;
    list.splice(idx, 1);
    save();
  }

  function clearCompleted(){
    var i = list.length;
    while(i--> 0){
      if(list[i].completed) list.splice(i, 1);
    }
  }

  function countCompleted(){
    var count = 0;
    for(i in list) if(i.completed) count++;
    return count;
  }

  function allCompleted(){
    return countCompleted() == list.length;
  }

  function completeAll(){
    var val = !allCompleted();
    for(i in list) i.completed = val;
  }

  static inline var ENTER_KEY = 13;
  static inline var ESC_KEY = 27;
  public static function inputWatcher(onEnter, onEscape){
    return function(e){
      switch e.keyCode{
        case ENTER_KEY: onEnter();
        case ESC_KEY: onEscape();
        case _:
      }
    };
  }
  var focused = false;

  function view(ctrl){
    this.ctrl = ctrl;
    var localList = switch ctrl.filter{
      case 'active': [for(i in list) if(!i.completed) i];
      case 'completed': [for(i in list) if(i.completed) i];
      case _: list;
    }
    var todos = [for(todo in localList) new TodoItem(todo, this)];
    return m('section.todoapp', [
      m('header.header', [
        m('h1', 'todos'),
        m('input.new-todo[placeholder="What needs to be done?"]', {
          onkeyup: inputWatcher(add, clearTitle),
          value: ctrl.title,
          oninput: setAttr('value', ctrl.title),
          config: function(element){
            if(!focused){
              element.focus();
              focused = true;
            }
          },
        })
      ]),
      m('section.main', {
        style: {display: list.length == 0 ? 'none' : ''},
      }, [
        m('input.toggle-all[type=checkbox]', {
          onclick: completeAll,
          checked: allCompleted(),
        }),
        m('ul.todo-list', {}, todos),
      ]),
      list.length == 0 ? null : viewFooter(),
    ]);
  }

  function viewFooter(){
    var compl = countCompleted();
    var active = list.length - compl;

    return m('footer.footer', [
      m('span.todo-count', [
        m('strong', '$active'),
        active == 1 ? ' item' : ' items',
        ' left',
      ]),
      m('ul.filters',[
        m('li', m('a[href=/]', {
            config: Mithril.route,
            className: ctrl.filter == null ? 'selected' : '',
          }, 'All')
        ),
        m('li', m('a[href=/active]', {
            config: Mithril.route,
            className: ctrl.filter == 'active' ? 'selected' : '',
          }, 'Active')
        ),
        m('li', m('a[href=/completed]', {
            config: Mithril.route,
            className: ctrl.filter == 'completed' ? 'selected' : '',
          }, 'Completed')
        ),
      ]),
      compl == 0 ? null : m('button.clear-completed', {onclick: clearCompleted}, 'Clear completed'),
    ]);
  }

  public static function main(){}
}
