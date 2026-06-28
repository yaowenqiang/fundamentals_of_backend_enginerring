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
  + Without a standard model, your application must have knowledge of the underlying network medium
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

#### IP Address

+ Layer 3 property
+ Can be set automatically or statically
+ Network and Host portion
+ 4 bytes in Ipv4 - 32 bits

#### Network vs Host

+ a.b.c.d/x(a.b.c.d are integers) x is the network bits and remains are host
+ Example 192.168.254.0/24
+ The first 24 bits(3 bytes) are network the rest 8 are for host
+ This means we can have 2^24(16777216) networks and each network has 2^8(255) hosts
+ Also called a subnet

#### Subnet mask

+ 192.168.254.0/24 is also called a subnet
+ The subnet has a mask 255.255.255.0
+ Subnet mask is used to determain whether an IP is in the same subnet

#### Default Gateway

+ Most networks consists of hosts and a Default Gateway
+ When host A want to talk to B directly if both are in the same subnet
+ Otherwise A sends it to someone who might know, the gateway
+ The Gateway has an IP Address and each host should know its gateway

E.g.Host 192.168.1.3 wants to talk to 192.168.1.2

+ 192.168.1.3 applies subnet mask to itsself and the destination Ip is 192.168.1.2
+ 255.255.255.0 & 192.168.1.3 = 192.168.1.0
+ 255.255.255.0 & 192.168.1.2 = 192.168.1.0
+ Same subnet! no need to route

E.g.Host 192.168.1.3 wants to talk to 192.168.2.2

+ 192.168.1.3 applies subnet mask to itsself and the destination Ip is 192.168.2.2
+ 255.255.255.0 & 192.168.1.3 = 192.168.1.0
+ 255.255.255.0 & 192.168.2.2 = 192.168.2.0
+ Not the subnet! The packet is dent to the Defaut Gateway 192.168.1.100

### The IP packet - Anatomy of the Ip Packet

IP Packet

+ The IP packet has headers and data sections
+ IP Packet header is 20 bytes (can go up to 60 bytes if options are enabled)
+ Data section can go up to 65536

#### IP Fragmentation(IP 分片)

> 巨型帧（Jumbo Frames）

IHL (Internet header length)

> Stream Fragmentation and Reassembly Attacks


> https://datatracker.ietf.org/doc/html/rfc791

> https://en.wikipedia.org/wiki/IPv4

> ECN(Explicit congestion Notification)(显式拥塞通知)

> TCP black hole

#### ICMP - Internet Control Message Protocol

ICMP

+ Stands for Internet Control Message Protocol
+ Designed for informational messages
  + Host unreachable, port unreachable, fragmentation needed
  + Packet expired(Infinite loop in routers)
+ Use IP directly
+ PING and traceroute use it
+ Doesn't require listeners or ports to be opened
+ Lives in Layer 3
+ Some firwalls block ICMP for security reasons
+ That is why PING might not work in those cases
+ Disabling ICMP also can cause real damage with connection establishment
  + Fragmentation needed
+ PING demo

> https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol

TraceRoute

+ Can you identify the entire path your IP Packet takes?
+ Clever use of TTL
+ Increment TTL slowly and you will get the router IP address for each hop
+ Doesn't always work as path changes and ICMP might be blocked

### UDP

+ Stands for User Datagram Protocol
+ Layer 4 protocol
+ Ability to address processes in a host using ports
+ Simple protocol to send and receive data
+ Prior communication not required(double edge sword)
+ Stateless no knowledge is stored on the host
+ 8 byte header Datagram

### UDP Use cases

+ Video streaming
+ VPN
+ DNS
+ WebRTC

> TCP meltdown
> DNS Poison
> ARP Poison

### Multiplexing and Demultiplexing

+ IP target hosts only 
+ Hosts run many apps each with different requirements
+ Ports now identify the 'app' or 'process'
+ Sender multiplexes all its apps into UDP
+ Receiver demultiplex UDP datagrams to each app

### Source and Destination Port

+ App1 on 10.0.0.1 sends data to AppX on 10.0.0.2
+ Destination Port = 53
+ AppX responds back to App1
+ We need Source Port so we know how to send back data
+ Source Port = 5555

### UDP Datagram

+ UDP Header is 8 bytes only(IPv4)
+ Datagram slides into an IP packet as 'data'
+ Ports are 16 bite(0 to 65535)

> https://datatracker.ietf.org/doc/html/rfc768
> https://en.wikipedia.org/wiki/User_Datagram_Protocol

### UDP Pros and Cons - The power and drawbacks of UDP

#### Pros

+ Simple Protocol
+ header size is small so datagrams are small
+ uses less bandwidth
+ Stateless
+ Consumes less memory(no state stored in the server/client)
+ Low latency - no handshake, order, retransmission or guaranteed delivery

#### Cons

+ No acknowledgement
+ No guarantee delivery
+ connection-less - anyone can send data without prior knowledge
+ No flow control
+ No congestion control
+ No ordered packets
+ Security - can be easily spoofed

> nc -u 127.0.0.1 5501

###  TCP(Transmission Control protocol)

#### TCP

+ Stands for Transmission Control Protocol
+ Layer 4 protocol
+ Ability to address processes in a host using ports
+ 'Controls' the transmission unlike UDP which is a firehose
+ Connection
+ Requires handshake
+ 20 bytes headers Segment(can go to 60)
+ Stateful

#### TCP Use cases

+ Reliable communication
+ Remote shell
+ Database connections
+ Web communications
+ Any bidirectional communication

#### TCP Connection

+ Connection is a Layer 5(session)
+ Connection is an agreement between client and server
+ Must create a connection to send data
+ Connection is identified by 4 properties
  + SourceIp:SourcePort
  + DestinationIp:DestinationPort
+ Can't send data outside of a connection
+ Sometimes called socket or file descriptor
+ Requires a 3-way TCP handshake
+ Segments are sequenced and ordered
+ Segments are acknowledged
+ Lost segments are retransmitted

> MultiPathTcp

#### Multiplexing and demultiplexing

+ IP targets hosts only
+ Hosts run many apps each with different requirements
+ Ports now identify the 'app' or 'process'
+ Sender multiplexes all its apps into TCP connections
+ Receiver demultiplex TCP segments to each app based on connection paris

#### Connection Establishment

+ App1 on 10.0.0.1 want to send data to AppX on 10.0.0.2
+ App1 sends SYN to AppX to synchronous sequence numbers
+ AppX sends SYN/ACK to synchronous its sdquence number
+ App1 ACKs AppX SYN
+ Three way handshake

#### Sending data

+ App1 sends data to AppX
+ App1 encapsulate the data in a segment and send it
+ AppX acknowledges the segment
+ Hint: Can App1 send new segment before ack of old segment arrives?(yes)

#### acknowledgement

+ App1 sends segment 1,2 and 3 to AppX
+ AppX acknowledge all of them with a singel ACK 3

#### Lost data

+ App1 sends segment 1,2 and 3 to ApX
+ Seg 3 is lost, AppX acknowledge 3
+ App1 resend Seg 3

#### Closing Connection

+ App1 wants to close the connection
+ App1 send FIN, APPX ack
+ AppX sends FIN, App1 ACK
+ Four way handshake

#### TCP Segment

+ TCP segment header is 20 bytes and can go up to 60 bytes
+ TCP segments slides into an ip packet as 'data'
+ Port are 16 bit(0 to 65535)
+ Sequences, Acknowledgement, flow control and more

> https://en.wikipedia.org/wiki/Transmission_Control_Protocol

> https://datatracker.ietf.org/doc/html/rfc793

#### maximum Segment Size

+ Segment Size depends the MTU of the network
+ Usually 512 bytes can go up to 1460
+ Default MTU in the internet is 1500(results in MSS 1460)
+ Jumbo frames MTU goes to 9000 or more
+ MSS can be larger in jumbo frames cases

> https://github.com/nikhilroxtomar/TCP-Client-Server-Implementation-in-C.git

### TLS - Transport Layer Security


#### Why TLS

+ We encrypt with symmetric key algorithms
+ We need to exchange the symmetric key(XOR)
+ Key exchange uses asymmetric key(PKI)
+ Authenticate the server
+ extensions(SNI, preshared, ORTT)


### HTTP/1.1 - Simple Web protocol lasts decades

#### Client/Server

+ (Client)Browser, python or javascript app, or any app tha makes HTTp request
+ (Server)HTTP Web Server, e.g.IIS,Apache Tomcat, NodeJS, Python Tomado

> curl -v http://husseinnasser.com/about

#### HTTP 1.0

+ New TCP connection with each request
+ Slow
+ Buffering(thranfer-encoding chunked didn't exist)
+ No multi-homed websites(HOST header)

#### HTTP 1.1

+ Persisted TCP connection
+ Low latency & Low CPU Usage
+ Streaming with Chunked transfer
+ Pipelining(disabled by default)
+ Proxying & Multi-homed websites

#### HTTP/2 

+ SPDY(google)
+ Compression
+ Multiplexing
+ Server Push(dead)
+ Secure by default(protocol ossification(协议僵化))
+ Protocol Negotiation during TLS(NPN/ALPN)

> Application Layer Protocol Negotiation

#### HTTP Over QUIC(HTTP/3)

+ Replaces TCP with QUIC(UDP with Congestion control)
+ All HTTP/2 features
+ Without HOL(head of line blocking)


> https://ece.engineering.arizona.edu/undergrad-programs/courses/ECE462

> http://www.ece.arizona.edu/~ece462/Lec03-pipe/



> HTTP request smuggling(请求走私)

> https://portswigger.net/web-security/request-smuggling

#### Vanilla(原生) HTTP

#### HTTPS



#### TLS 1.2 Handshake

#### Diffie Hellman

#### TLS 1.3 Improvements


##### Node HTTPS - understanding HTTPS/TLS

HTTPS

+ Hypertext transfer protocol(Secure)
+ Node implements HTTPS client and server 
+ On top of TLS(Transport Layer Security)

Encryption

+ Encryptions are two types
+ Symmetric -> You encrypt with key and decrypt with the same key
  + One key
  + Fast but both client and server must have the same key
+ Asymmetric -> You encrypt with a key and decrypt with another
  + Comes in pairs Two keys Private key and Public key
  + Slower but both client and server can have their own public keys
+ We always want to encrypt with Symmetric encryptions
+ Exchange the symmetric key with asymmetric encryption

Symmetric Encryption

+ Assume both parties have the same key(The most difficult ting)
+ Users uses the key to encrypt message
+ Send it
+ Receiver gets the encrypted message
+ Uses the same key to decrypt
+ E.g.AES

##### Public key VS Privaet Keys Rules

+ Public key private key are pairs(e.g. Red Public, Blue private)
+ Given the Private key you can generate the Public key
+ Given the Public key you cannot get the Private key

#### Encrypting with the Public Key

+ You can encrypt a message with Public key
+ And only owner of Private key can decrypt it
+ Proved Authenticity

#### Encrypting with the Private Key

+ You can encrypt a message with the Private Key
  + And only the corresponding Public key can decrypt it
  + Only owner of the private key could have signed this document
  + Protects confidentiality, nobody could have missed with it

#### Certificates

+ We need a way to proof authenticity
+ Generate a pair of public/private key
+ Put a public key in a certificate
+ Put the website name in the certificate
+ Sign the certificate with the privatekey
+ meet x509
+ Certificates can be 'self signed'
  + ie private key signing the cert belong to the public key
  + Usually untrusted and used for testing/local
+ Certificates can sign 'other certificates'
  + Creating a trust chain
  + issuer name is who issued it
  + Lets encrypt
+ Untimately a ROOT cert is found
  + ROOT certs are always self signed
  + They are trusted by everyone
  + installed with OS root(ceritficate store)

#### Certificates Verification

#### TLS

+ Transport Layer Security
+ Encrypt using the same key on both client and server
+ For that we need to exchange the key
+ We use public key encryption to exchange key
+ We dhare certificate for authentication

Problem with that approach

+ Encrypting the symmetric key with public key is simple
+ But its not perfectly forward
+ Attacker can record all encrypted communication
+ If the server private key is leaked(heart bleed)
+ They can go back and decrypt everything
+ We need ephemeral keys!Meet Diffie Hellman

#### Diffie Hellman

+ Let us not share the symmetric key at all
+ Let us only share parameters enough to generate it
+ Each party generate the same key
+ party one generate x number(private)
  + also generates g and n(public, random and prime)
+ party two generates Y number(private)
+ party 1 sends g and n to Party 2
+ Anyone can sniff those values fine
+ Now both has g and n

#### More problems! MITM(man in the middle)

+ This solves perfect secrecy
+ But what if someone intercepts and put their own DH keys
+ MITM replace Y 's parameter with their own'
+ X doesn't know that happened(it's just numbers)

#### Solved with signing

+ We bring back public key encryption
+ But only to sign the entire DH message
+ With certificates

#### There is more to TLS

+ More stuff is sent in the TLS handshake
+ TLS extensions
  + ALPN
  + SNI
+ Cipher algorithms
+ Key generation algorithms
+ Key size
+ Digital signature algorithms
+ Client side certificates

#### Node HTTPS

+ Node HTTPS Server requires a certificate and private key
+ The rest is the same
+ More work though
+ Requests gets hit with additional cost
+ Responses get hit with additional cost

#### Generate Private key and Certificate with OpenSSL

+ OpenSSL is a library for cryptographic operations
+ Generate private key
  + openssl genrsa -out private-key.pem 2048
+ Generate Certificate x509(which contains public key)
  + openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
  + Answer questions to fill the 509 fields
  + Most important is common name, subject alternative which is the website

> curl --insecure https://localhost:8443

> curl -k https://localhost:8443

> The Heartbleed Bug

### WebSockets

WebSockets handshake ws:// or wss://

> 101 switch protocol

#### Websocket use cases

+ Chatting
+ Live Feed
+ Multiplayer gaming
+ Showin client progress/logging


#### Websocket Pros and Cons


Pros

+ Full-dupliex(no polling)
+ HTTP compatible
+ Firewall friendly(standard)

Cons

+ Proxying is tricky
+ L7 LB challenging(timeoutso)
+ Stateful,difficult to horizontially scale

#### Do you have to use WebSockets?

+ No
+ Rule of thumb - do you absolutely need bidirectional communication?
+ Long polling
+ Server Send Events

### HTTP/2

> early hands

HTTP/2 Pros

+ Multiplexing over Single Connection(save resources)
+ Compression(Headers & Data)
+ Server Push
+ Secure by default
+ Protocol Negotiation during TLS(ALPN)

HTTP/2 Cons

+ TCP head of line blocking(队头阻塞)
+ Server Push never picked up
+ High CPU usage



> https://lucid.co/techblog/2019/04/10/why-turning-on-http2-was-a-mistake 

### HTTP/3 - HTTP over QUIC multiplexed streams


#### TCP head of line blocking

+ TCP segments must be delivered in order
+ But streams don't have to
+ Blocking requests

#### HTTP/3 & QUIC

+ HTTP/3 uses QUIC
+ Like HTTP/2, QUIC has streams
+ But QUIC ues UDP instead
+ Application decides the boundary

#### HTTP/3 & QUIC Pros

+ QUIC has many other benefits
+ Merges Connection setup + TLS in one handshake
+ Has congestion control at stream level
+ Connection migraiton(connectionID, not encrypted)
+ Why not HTTP/2 over QUIC?
  + Header copression algorithm(H-back)

> CRIME(Compression Ratio into-leak Made Easy)


#### HTTP/3 & QUIC Cons

+ Takes a lot of CPU(parsing logic)
+ UDP could be blocked
+ IP Fragmentation is the enemy



> QUIC actually is the reverse, odd streams are server while even streams are the client's


### gRPC - Taking HTTP/2 to the next level

Client Server Communication

+ SOAP, REST,GraphQL
+ SSE, WebSockets
+ Raw TCP

#### The problem with Clien Libraries

+ Any communication protocol needs client libraries for the language of choise
  + SOAP Library
  + HTTP Client Library
+ Hard to maintain and patch client libraries
  + HTTP/1.1 HTTP/2,new features, security etc.

#### Why gRPC was invented?

+ Client library: One library for popular languages
+ Protocol: HTTP/2(hidden implementation)
+ Message Format: Protocol buffers as format

#### gRPC modes

+ Unary RPC
+ Server streaming RPC
+ Client streaming RPC
+ Bidirectional streaming RPC

#### Coding time

+ Todo application(server, client) with gRPC
+ createTodo()
+ readTodos()//synchronous
+ readTodos()//server stream

#### gPRC Pros and Cons

##### Pros

+ Fast & Compact
+ One Client Library
+ Progress Feedback(upload)
+ Cancel Request(h2)
+ H2/Protobuf

##### Cons

+ Schema
+ Thick Client
+ Proxies
+ Errro handling
+ No native browser support
+ Timeouts(pub/sub)


> The Story of Why We Migrate to gRPC and How We Go About It - Matthias Grüter, Spotify

> https://www.youtube.com/watch?v=fMq3IpPE3TU

> Hermes


### WebRTC

WebRTC Overview

+ Stands for Web Real-Time Communication
+ Find a peer to peer path to exchange video and audio in an efficient and low latency manner
+ Standardized API
+ Enables rich communications browsers, mobile, IOT devices
+ A want to connect to B
+ A finds out all possible ways the public can connect to it
+ B finds out all possible ways the public can connect to it
+ A and B signal this session information vir other means
  + WhatsApp, QR, Tweet,WebSockets, HTTP Fetch...
+ A connects to B via the most optimal path
+ A & B also exchanges their supported media and security

> SDP(session Description Protocol)

#### WebRTC Demystified

+ NAT
+ STUN, TURN
+ ICE
+ SDP
+ Signaling the SDP

> NAT table


#### NAT Translations Method

+ One to One NAT(Full-cone NAT)
+ Address restricted NAT
+ Port restricted NAT
+ Symmetric NAT

##### One to One NAT(Full cone NAT)

+ Packets to external IP:port on the router always maps to internal IP:port without exceptions

##### Address restricted NAT

+ Packets to external IP:port on the router always maps to internal IP:port as long as source address from packet matches the table(regardless of port)
+ Allow if we communicated with this host before

##### Port Restricted NAT

+ Packets to external IP:port on the router always maps to internal Ip:port as long as source address and port from packet matches the table
+ Allow if we communicated with this host:port before

##### Symmetric NAT

+ Packets to external IP:port on the router always maps to internal IP:port as long as soure address and port from packet matches the table
+ Only Allow if the full pair match

#### STUN

+ Session Traversal Utilities for NAT
+ Tell me my public ip address/port throught NAT
+ Works for Full-cone, Port/Address restricted NAT
+ Doesn't work for symmetric NAT
+ STUN server port 3478, 5349 for TLS
+ Cheap to maintain

#### TURN

+ Traversal Using Relays around NAT
+ In case of Symmetric NAT we use TURN
+ It's just a server that relays packets
+ TURN default server port 3478, 5349 for TLS
+ Expensive to maintain and run

#### ICE

+ Interactive Connectivity Establishment

+ ICE collects all available candidates(local IP addresses, reflexive addresses - STUN ones and relayed addresses - TURN ones)
+ Called ice candidates
+ All the collected addresses are then sent to the remote peer via SDP

#### SDP

+ Session Description Protocol
+ A format that describes ice candidates, networking options, media options, security options and other stuff
+ Not really a protocol its a format
+ Most important conncept in WebRTC
+ The goal is to take the SDP genereted by a user and send it 'somehow' to the other party

#### Signaling

+ SDP Signaling
+ Send the SDP that we just generated somehow to the other party we wish to communicate with
+ Signaling can be done via a tweet, QR code, Whatsapp, WebSockets, HTTP request DOESN'T MATTER!Just get that large string to the other party

#### WebRTC Denystified

+ A wants to connect to B
+ A creates an 'offer', it fines all ICE candidates, security options, audio/video options and generates SDP, the offer is basically the SDP
+ A signals the offer somehow to B(whatsapp)
+ B creates the 'answer' after setting A's offer
+ B signals the 'answer'to A
+ Connection is created

> https://github.com/samyk/slipstream

#### WebRTC Demo

+ We will connect two browsers(Browser A and Browser B)
+ A will create an offer(SDP) and set it as local description
+ B will get the offer and set it as remote description
+ B creates an answer sets its as its local description and signal the answer(SDP) to A
+ A sets the answer as its remote description
+ Connection established, exchange data channel


```javascript
const lc = new RTCPeerConnection()
const dc = lc.createDataChannel('channel')
dc.onmessage = e => console.log('just got a message '+ e.data);
dc.onopen = e => console.log('Connection opened!');
lc.onicecandidate = e => console.log('New Ice candidate! reprinting SDP ' + JSON.stringify(lc.localDescription))
lc.createOffer().then(o => lc.setLocalDescription(o)).then(a => console.log('Set successfully!'));
// copy the offer

const offer = {};
const rc = new RTCPeerConnection();
rc.onicecandidate = e => console.log('New Ice candidate! reprinting SDP' + JSON.stringify(rc.localDescription));
rc.ondatachannel = e => {
    rc.dc = e.channel;
    rc.dc.onmessage = e => console.log('new message from client: ' + e.data);
    rc.dc.onopen = e => console.log('connection OPENED!!!');
};
rc.setRemoteDescription(offer).then(a => {
    console.log('Offer set');
});

rc.createAnswer().then(a => {
    rc.setLocalDescription(a)
}).then(a => console.log('answer created!'));

conset anser = {};
lc.setRemoteDescription(answer);
dc.send('hello')
rc.dc.send('hi')
rc.addTrack()

```

#### WebRTC Pros & Cons

##### Pros

+ P2p is great! low latency for high bandwidth content
+ Standardized API I don't have to build my own

##### Cons

+ Maintaining STUN & TURN servers
+ Peer 2 Peer fails apart in case of multiple participants(discord case)

#### More WebRTC stuff

##### Media API

+ getuserMedia to access microphone, video camera
+ RTCPConnection.addTrack(stream)
+ https://www.html5rocks.com/en/tutorials/webrtc/basics/

#### OnIceCandidate and add IceCandidate

+ To maintain the connection as new candidate come and go
+ onICeCandidate tells user there is a new candidate after the SDP has already been created
+ The candidate is signaled and sent to the other party
+ The other party uses addiceCandidate to add it to its SDP

#### Set custom TURN and STUN Server
#### Create your own STUN & TURN server

+ coturn open source project
> https://github.com/coturn/coturn

#### Public STUN Servers

+ stun1.1.google.com:19302
+ stun2.1.google.com:19302
+ stun3.1.google.com:19302
+ stun4.1.google.com:19302
+ stun.stunprotocol.org.3478




## Many ways to HTTPS

### HTTPS over TCP With TLS 1.2
### HTTPS over TCP With TLS 1.3
### HTTPS over QUIC(HTTP/3)
### HTTPS over TFO(TCP Fast Open) with TLS 1.3
### HTTPS over TCP with TLS 1.3 0RTT
### HTTPS over QUIC(HTTP/3) 0RTT

> https://blog.cloudflare.com/even-faster-connection-establishment-with-quic-0-rtt-resumption/



> websocket ping and pong 

## Backend Execution patterns

## Proxying and Load Balancing


