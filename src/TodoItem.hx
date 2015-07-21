import Mithril.*;
using StringTools;

class TodoItem{
  var todo:model.Todo;
  var app:Todo;
  public var ctrl:{
    editing:Bool,
    ?title:String,
  };
  public function new(todo, app){
    this.todo = todo;
    this.app = app;
  }

  public function controller(){
    return {editing: false};
  }

  function complete(){
    todo.completed = !todo.completed;
    save();
  }

  var editing:Bool;
  function edit(){
    ctrl.editing = true;
    ctrl.title = todo.title;
  }

  function doneEditing(){
    ctrl.editing = false;
    todo.title = ctrl.title.trim();
    save();
  }

  function cancelEditing(){
    ctrl.editing = false;
    // todo.editing = false;
    // title = todo.title;
  }

  function remove(){
    app.remove(todo);
  }

  function save(){
    app.save();
  }

  public function view(ctrl){
    this.ctrl = ctrl;
    var classes = '';
    if(todo.completed) classes+= ' completed';
    if(ctrl.editing) classes+= ' editing';

    return m('li', {className:classes}, [
      m('.view', [
        m('input.toggle[type=checkbox]', {
          onclick: complete,
          checked: todo.completed,
        }),
        m('label', {ondblclick: edit}, todo.title),
        m('button.destroy', {onclick:remove}),
      ]),
      ctrl.editing ? m('input.edit', {
        value: ctrl.title,
        onkeyup: Todo.inputWatcher(doneEditing, cancelEditing),
        oninput: setAttr('value', ctrl.title),
        onblur: doneEditing,
        config: function(el){
          if(ctrl.editing){
            el.focus();
            el.selectionStart = el.value.length;
          }
        },
      }) : null,
    ]);
  }
}
