import Mithril.*;
using StringTools;

class TodoItem{
  var todo:model.Todo;
  var app:Todo;
  var editing:Bool = false;
  var title:String;
  public function new(todo, app){
    this.todo = todo;
    this.app = app;
  }

  function complete(){
    todo.completed = !todo.completed;
    save();
  }

  function edit(){
    editing = true;
    title = todo.title;
    if(title == null) title = '';
  }

  function doneEditing(){
    if(!editing) return;
    editing = false;
    if(title == null) return;
    todo.title = title.trim();
    title = null;
    save();
  }

  function cancelEditing(){
    if(!editing) return;
    editing = false;
    title = null;
    // todo.editing = false;
    // title = todo.title;
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
      editing ? m('input.edit', {
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
      }) : null,
    ]);
  }
}
