import Mithril.*;
using StringTools;

class TodoItem{
  var todo:model.Todo;
  var title:String;
  var app:Todo;
  public function new(todo, app){
    this.todo = todo;
    title = todo.title;
    this.app = app;
  }

  function complete(){
    todo.completed = !todo.completed;
    save();
  }

  var editing:Bool;

  function edit(){
    editing = true;
  }

  function doneEditing(){
    editing = false;
    todo.title = title = title.trim();
    save();
  }

  function cancelEditing(){
    editing = false;
    title = todo.title;
  }

  function remove(){
    app.remove(todo);
  }

  function save(){
    app.save();
  }

  public function view(){
    var classes = '';
    if(todo.completed) classes+= ' completed';
    if(editing) classes+= ' editing';

    return m('li', {className:classes}, [
      m('.view', [
        m('input.toggle[type=checkbox]', {
          onclick: complete,
          checked: todo.completed,
        }),
        m('label', {ondblclick: edit}, todo.title),
        m('button.destroy', {onclick:remove}),
      ]),
      m('input.edit', {
        value: title,
        onkeyup: Todo.inputWatcher(doneEditing, cancelEditing),
        oninput: setAttr('value', title),
        onblur: doneEditing,
        config: function(el){
          if(editing){
            el.focus();
            el.selectionStart = el.value.length;
          }
        },
      }),
    ]);
  }
}
