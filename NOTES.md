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

### Protocol Properties

What to take into account when designing a protocol?

What is a protocol?

+ A system that alloes two paries to communicate
+ A protocol is designed with a set of properties
+ Depending on the purpose of the protocol
+ TCP, UDP, HTTP, gRPC, FTP

> It’s Time to Replace TCP in the Datacenter
> https://arxiv.org/pdf/2210.00714
> https://lwn.net/Articles/1003059/ 
> thoe HOMA protocol

Protocol properties

+ Data format
  + Text based(plain text, JSON, XML)
  + Binary(protobuf, RESP(redis resp protocol spec), h2(http2),h3(http3))
+ Transfer mode
  + Message based(UDP, HTTP)
  + Stream(TCP, WebRTC)
+ Addressing system
  + DNS name,IP,MAC
+ Directionality
  + Bidirectional(TCP)
  + Unidirectional(HTTP)
  + Full/Half duplex
+ State
  + Stateful(TCP, gRPC, apache thrift)
  + Stateless(UDP, HTTP)
+ Routing
  + Proxies, Gateways
+ Flow & Congestion control
  + TCP(flow & Congestion)
  + UDP(No control)
+ Error management
  + Error code
  + Retries and timeouts


#### OSI Model

> Open Systems Interconnection Model

Why do we need a communication model?

+ Agnostic applications
  + Without a standard model, your application must have knowlgdge of the underlying network medium
  + Image if you have to author different version of you apps so that it works on wifi vs ethernet vs LTE vs fiber
+ Network Equipment Management
  + Without a standard model, upgrading network equipmentbecomes difficult
+ Decoupled innovation
  + innovation can bedone in each layer separately without affecting the rest of the models

What is the OSI Model?

+ 7 layers each describe a specific networking component
+ Layer 7 Application - HTTP/FTP/gRPC
+ Layer 6 Presentation - Encoding,Serialization
+ Layer 5 Session - Connection establishment, TLS
+ Layer 4 Transport - UDP/TCP
+ Layer 3 Network - IP
+ Layer 2 Data link - Frames, Mac address Ethernet
+ Layer 1 Physical - Electric signals, fiber or radio waves

The OSI layers - an Example(sender)

+ Example sending a POST request to an HTTPS webpage

+ Layer 7 - Application
  + POST request with JSON data to HTTPS server
+ Layer 6 Presentation
  + Serialize JSON to the byte strings
+ Layer 5 - Session
  + Request to establish TCP connections/TLS
+ Layer 4 - Transport
  + Sends SYN request target port 443
+ Layer 3 - Network
  + SYN is placed in IP packet(s) adds the source/dist IPs
+ Layer 2 - Data link
  + Each packet goes into a single frame and adds the address/MAC addresses
+ Layer 1 - Physical
  + Each frame becomes string of bites which converted into either a radio signal(wifi), electric signal(ethernet), or light(fiber)
+ Take it with a grain of salt, it's not always cut and try

The OSI layers - an Example(receiver)

+ Receiver computer receives the POST request the other way round
+ Layer 1 - physical
  + Radio, electric or light is received and converted into digital bites
+ Layer 2 - Data Link
  + The data from Layer 1 is assembled into frames
+ Layer 3 - Network
  + The frames from layer are assembled into IP packet
+ Layer 4 - Transport
  + The Ip packets from layer 3 are assembled into TCP segments
  + Deals with congestion control/flow control/retransmission in case of TCP
  + If segment is SYN we don't need to go futher into more layers as we are still processing the connection request 
+ Layer 5 - Session
  + The connection session is established or identified
  + We only arrive at this layer when necessary (three way handshake is done)
+ Layer 6 - Presentation
  + Deserialize flat byte strings back to JSON for the app to consume
+ Layer 7 - Application
  + Application understands the JSON POST request and your express json or apache rquest receive event is triggered 
+ Take it with a grain of salt, its not always out and dry


> MTU (maximum transmission unit)

> TCP segment(tcp 报文段)

> IP Packet(数据包)

> Frame（帧）

Layer 2 Swich (Data Link)
Layer 3 Router, VPN (Network)
Layer 4 Proxy, Firewall
Layer 7 Load balancer/CDN

The shortcomings of the OSI Model

+ OSI Model has too many layers which can be hard to comprehend
+ Hard to argue about which layer does what
+ Simpler to deal with Layers 5,6,7 as just one layer, application
+ TCP/IP Model does just that

TCP/IP Model

+ Much simpler then OSI,just 4 layers
+ Application(Layer 5,6,7)
+ Transport(Layer 4)
+ Internet(Layer 3)
+ Data link(layer 2)
+ Physical layer is not officially covered in the model

## Many ways to HTTPS

## Backend Execution patterns

## Proxying and Load Balancing


