const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto',{});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

server.addService(todoPackage.Todo.service,{
  'createTodo': createTodo,
  'readTodos': readTodos,
  'readTodosStream': readTodosStream,
});

server.bindAsync('0.0.0.0:40000', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server running on port 40000');
});


const todos = [];
function createTodo(call, callback) {
  //console.log('Received createTodo request:', call.request);
  const todoItem = {
    'id':todos.length + 1,
    'text': call.request.text
  };
  todos.push(todoItem);
  callback(null, todoItem);
}

function readTodos(call, callback) {
  //console.log('Received readTodo request:', call.request);
  callback(null, {'items':todos});
}

function readTodosStream(call, callback) {
  todos.forEach(t => call.write(t));
  call.end();
}
