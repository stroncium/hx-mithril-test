CLIENT_OPTS=
S = src
L = ../../libs
HAXE_FLAGS = -debug -D async-stack -D js-flatten -cp src
HAXE = haxe $(HAXE_FLAGS)

all: client server
client: bin/frontend/todo.js
server: bin/server.js

bin/server.js: src/Server.hx
	$(HAXE) -lib node -cp libs/haxetoml/src -D nodejs -D server -main Server -js bin/server.js $(CP)

bin/frontend/todo.js: src/Todo.hx
	$(HAXE) -D client -main Todo -js bin/frontend/todo.js

clean:
	rm -f bin/server.js bin/frontend/todo.js

run: all
	node bin/server.js

.PHONY: client server run clean

