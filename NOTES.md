> Edge Engineer

## Backend Communication Design Patterns

### Request - Response

> classic, simple and everythere


Request Response Model

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







> sidecar pattern

## Protocols

## Many ways to HTTPS

## Backend Execution patterns

## Proxying and Load Balancing


