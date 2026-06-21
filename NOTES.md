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


#### Short Polling (短轮询)

> Request is taking a while, i'll check with you later

When request/response isn't ideal

+ A request takes long time to process
  + Upload a youtube video
+ The backend want to sends notification
  + A user just logged in
+ Polling is a good communication style


#### What is Short Polling

+ Client sends a request
+ Server responds immediately with a handle
+ Server continues to process the request
+ Client uses that handle to check for status
+ Multiple 'short' request response as polls

#### Short Polling Pros and Cons

+ Pros
  + Simple
  + Good for long running requests
  + Client can disconnect
+ Cns
  + Too chatty
  + Network bandwidth
  + Wasted Backend resources

### Long Polling

> Requests is taking long, I'll check with you later, but talk to me only when it's ready


Where request/response & polling isn't ideal

+ A rquest takes ong time to process
  + Upload a youtube video
+ The backend want to sends notification
  + A user just logged in
+ Short Polling is good but chatty
+ Meet long polling(kafka uses it)

What is Long Polling

+ Client sends a request
+ Server responds immediately with a handle
+ Client uses thta handle to check for status
+ Server DOES not reply until it has the response
+ So we got a handle, we can disconnect and we are less chatty
+ Some variation has timeouts too

Long Polling Pros and Cons

+ Pros
  + Less chatty and backend friendly
  + Client can still disconnect
+ Cons
  + Not real time


#### Server Sent Events

> One Request, a very very long response

Limitations of Request/Response

+ Vanilla Request/Response isn't ideal for notification backend
+ Client wnats real time notification from backend
  + A user just logged in
  + A message is just received
+ Push just works but restrictive
+ Server Send Events work with Request/Response, and Http
+ Designed for HTTP

What is Server Send Events

+ A response has start and end
+ Client sends a request
+ Server sends logical events as part of response
+ Server never writes the end of the response
+ It is still a request but an unending response
+ Client parses the streams data looking for this events
+ Working with request/response(HTTP)

Server Send Events Pros and Cons

+ Pros
  + Real time
  + compatible with Request/Response
+ Cons
  + Clients must be online
  + Client might not be able to handle
  + Polling is preferred for light clients
  + HTTP/1.1 problem(6 connections)

### Publish Subscribe

> One publisher many readers

Pub/Sub Pros and Cons

+ Pros
  + Scales w/ multiple receivers
  + Great for microservices
  + Loose coupling
  + Works while clients not running
+ Cons
  + Message delivery issues(Two generals problem)
  + Complexity
  + Network saturation(网络饱和)

#### Rabbitmq demo

> cloudamqp.com

> sidecar pattern


#### Multiplexing(复用) vs Demultiplexing(分用)

> HTTP/2, QUIC, ConnectionPull, MPTCP

### Stateful vs Stateless backend

+ Stateful
  + stores about clients in its memory
  + Depends on the information being there
+ Stateless
  + Client is responsible to to 'transfer' the state with every request
  + May store but can safely lose it

### Stateless backends

+ Stateless backends can still store data somewhere else
+ Can you restart the backend during idle time while the client workflow continues to work?

### What makes a backend stateless?

+ Stateless backends can store state somewhere else (database)
+ The backend remain stateless but system is stateful
+ Can you restart the backend during idle time while the client workflow continues to work?

Stateless vs Stateful protocols

+ The protocol can be designed to store states
+ TCP is stateful
  + Sequences, Connections file descriptor
+ UDP is stateless
  + DNS send queryID in UDP to identify queries
  + QUIC(stateful) sends connectionID to identify connection
+ You can build a stateless protocol on top of a stateful one and vise versa
+ HTTP on top of TCP
+ If TCP breaks, HTTP blindly create another one
+ QUIC on top of UDP

Complete Stateless System

+ Stateless Systems are rare
+ State is carried with every request
+ A backend service that relies completely on the input
  + Check if input param is a prime number
+ JWT(JSON Web Token)
+ Definitions go nowhere

### Sidecar Pattern

> Thick clients, Thicker backends

Changing the library is hard

+ Once you use the library your app is entrenched
+ App & Library 'should' be same language
+ Changing the library require retesting
+ Breaking changes Backward compatibility
+ Adding features to the library is hard
+ Microservices suffer

What if we delegate communication?

+ Proxy communicate instead
+ Proxy has the rich library
+ Client has thin library(e.g.h1)
+ Meet Sidecar pattern
+ Each client must have a sidecar proxy

Sidecar examples

+ Service Mesh proxies
  + Linkerd,istio,Envoy
+ Sidecar proxy container
+ Must be layer 7 Proxy

Pros & Cons of Sidecar proxy

+ Pros
  + Language agnositc(polyglot)
  + Protocol upgrade
  + Security
  + Tracing and Monitoring
  + Service Discovery
  + CAching
+ Cons
  + Complexity
  + Latency






> TLS extension ALPN(Application layer portocol negotiation)
## Protocols

## Many ways to HTTPS

## Backend Execution patterns

## Proxying and Load Balancing


