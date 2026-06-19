> Edge Engineer

## Backend Communication Design Patterns

### Request - Response

> classic, simple and everywhere


#### Request Response Model

+ Client sends a Request
+ Server parses the Request
+ Server processes the Request
+ Server send a Response
+ Client parses the Response and consume

Where it is use?

+ Web, HTTP, DNS< SSH
+ RPC(remote procedure call)
+ SQL and Database Protocols
+ APIs(REST/SOAP/GraphQL)
+ Implemented in variations


Anatomy of a Request/Response

+ A request structure is defined by both client and server
+ Requet has a boundary
+ Defined by a protocol and message format
+ Same for the response
+ E.g.HTTP Request

Building an upload image service with request responde

+ Send large request with the image(simple)
+ Chunk image and send a request per chunk(resumable)


Doesn't work everythere

+ Motification servic3
+ Chatting application
+ Very long running requests
+ What if the client disconnects?

> curl -v --trace out.txt http://google.com


Synchronous VS Asynchronous - Can i do work while waiting?

Synchronous I/O

+ Caller sends a request and blocks
+ Caller cannot execute any code meanwhile
+ Receiver responds, Caller unblocks
+ Caller and receiver are in 'sync'

Example of an OS synchronous I/O

+ Program asks OS to read from disk
+ Program main thread is taken off of the CPU
+ Read completes, program can resume execution


Asynchronous I/O

+ Caller sends a request
+ Caller can work until it gets a response
+ Caller either:
  + Checks if the response is ready(epoll)
  + Receiver calls back when its doen(io_uring)
  + Spins up a new thread that blocks
+ Caller and receiver are not necessary in sync

Example of an OS Asynchronous call(NodeJS)

+ Program spins up a secondary thread
+ Secondary thread reads from disk, OS blocks it
+ Main program still running and executing code
+ Thread finish reading and calls back main thread

Synchronous vs Asynchronous in Request Response

+ Synchronous is a client property
+ Most modern client libraries are Asynchronous
+ E.g.Clients send an HTTP request and do work


Synchronous vs Asynchronous in real life

+ Just in case, it is still confusing
+ In synchronous communication the call waits for a response from receiver
  + E.g.Asking someone a question in a meeting
+ Asynchronous communication the respone can come whenever, Caller and receiver can do anything meanwhile
  + Email


Asynchronous workload is everywhere

+ Asynchronous Programming(promises/futures)
+ Asynchronous backend processing
+ Asynchronous commits in postgres
+ Asynchronous IO in Linux(epoll, io_uring)
+ Asynchronous replication
+ Asynchronous OS fsync(fs cache)

> ext3

#### Push

Request/response isn't always ideal

+ Client wants real time notification from backend
  + A user just logged in
  + A message is just redeived
+ Push model is good for certain cases

What is Push?

+ Client connects a server
+ Server sends data to the client
+ client doesn't have to request anything
+ Protocol must be bidrectional
+ Used by RabbitMQ

#### Push Pros and Cons

+ Pros 
  + Real time
+ Cons
  + Clients must be online
  + Clients might not be able to handle
  + Polling is preferred for light clients





> sidecar pattern

## Protocols

## Many ways to HTTPS

## Backend Execution patterns

## Proxying and Load Balancing


