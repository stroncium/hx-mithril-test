import Mithril.*;
using StringTools;

typedef TodoItem = {
  title:String,
  ?previousTitle:String,
  ?completed:Bool,
  ?editing:Bool,
}

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

@:expose('Todo')
class Todo{
  static function run(){
    var todo = new Todo();
    Mithril.routeMode = 'hash';
    Mithril.route(js.Browser.document.getElementById('todoapp'), '/', {
      '/':todo,
      '/:filter':todo,
    });
  }


  var list:Array<TodoItem>;
  var title:String = '';
  var filter:String;

  function new(){
    list = Storage.get();
  }

  function controller(){
    filter = Mithril.routeParam('filter');
    if(filter == null) filter = '';
  }


  inline function save(){
    Storage.put(list);
  }

  function add(){
    var title = title.trim();
    if(title != ''){
      list.push({title:title});
      save();
    }
    title = '';
  }

  function complete(todo){
    todo.completed = !todo.completed;
    save();
  }

  function isVisible(todo):Bool{
    return switch filter{
      case 'active': !todo.completed;
      case 'completed': todo.completed;
      case _: true;
    }
  }

  function edit(todo){
    todo.previousTitle = todo.title;
    todo.editing = true;
  }

  function doneEditing(todo:TodoItem, index){
    todo.editing = false;
    todo.title = todo.title.trim();
    if(todo.title == '') list.splice(index, 1);
    save();
  }

  function cancelEditing(todo){
    todo.title = todo.previousTitle;
    todo.previousTitle = null;
    todo.editing = false;
  }

  function clearTitle(){
    title = '';
  }

  function remove(index){
    list.splice(index, 1);
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
  static function inputWatcher(onEnter, onEscape){
    return function(e){
      switch e.keyCode{
        case ENTER_KEY: onEnter();
        case ESC_KEY: onEscape();
        case _:
      }
    };
  }
  var focused = false;

  function view(){
    return [
      m('header#header', [
        m('h1', 'todos'),
        m('input#new-todo[placeholder="What needs to be done?"]', {
          onkeyup: inputWatcher(add, clearTitle),
          value: title,
          oninput: setAttr('value', title),
          config: function(element){
            if(!focused){
              element.focus();
              focused = true;
            }
          },
        })
      ]),
      m('section#main', {
        style: {display: list.length == 0 ? 'none' : ''},
      }, [
        m('input#toggle-all[type=checkbox]', {
          onclick: completeAll,
          checked: allCompleted(),
        }),
        m('ul#todo-list', [for(i in 0...list.length) if(isVisible(list[i])) viewTodo(list[i], i)]),
      ]),
      list.length == 0 ? null : viewFooter(),
    ];
  }

  function viewFooter(){
    var compl = countCompleted();
    var active = list.length - compl;

    return m('footer#footer', [
      m('span#todo-count', [
        m('strong', '$active'),
        active == 1 ? ' item' : ' items',
        ' left',
      ]),
      m('ul#filters',[
        m('li', m('a[href=/]', {
            config: Mithril.route,
            className: filter == '' ? 'selected' : '',
          }, 'All')
        ),
        m('li', m('a[href=/active]', {
            config: Mithril.route,
            className: filter == 'active' ? 'selected' : '',
          }, 'Active')
        ),
        m('li', m('a[href=/completed]', {
            config: Mithril.route,
            className: filter == 'completed' ? 'selected' : '',
          }, 'Completed')
        ),
      ]),
      compl == 0 ? null : m('button#clear-completed', {onclick: clearCompleted}, 'Clear completed'),
    ]);
  }

  function viewTodo(todo:TodoItem, index){
    var classes = '';
    if(todo.completed) classes+= ' completed';
    if(todo.editing) classes+= ' editing';

    return m('li', {className:classes}, [
      m('.view', [
        m('input.toggle[type=checkbox]', {
          onclick: complete.bind(todo),
          checked: todo.completed,
        }),
        m('label', {ondblclick: edit.bind(todo)}, todo.title),
        m('button.destroy', {onclick:remove.bind(index)}),
      ]),
      m('input.edit', {
        value: todo.title,
        onkeyup: inputWatcher(doneEditing.bind(todo, index), cancelEditing.bind(todo)),
        oninput: setAttr('value', todo.title),
        onblur: doneEditing.bind(todo, index),
        config: function(el){
          if(todo.editing){
            el.focus();
            el.selectionStart = el.value.length;
          }
        },

      }),
    ]);
  }

  public static function main(){}
}
