[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=nccharles_API_rate_limiter)

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=nccharles_API_rate_limiter&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=nccharles_API_rate_limiter)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=nccharles_API_rate_limiter&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=nccharles_API_rate_limiter)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=nccharles_API_rate_limiter&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=nccharles_API_rate_limiter)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=nccharles_API_rate_limiter&metric=bugs)](https://sonarcloud.io/summary/new_code?id=nccharles_API_rate_limiter)
[![Coverage Status](https://coveralls.io/repos/github/nccharles/API_rate_limiter/badge.svg?branch=main)](https://coveralls.io/github/nccharles/API_rate_limiter?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# API rate limiter
API rate limiter is service for sending SMS and E-mail notifications. They are selling this service to different clients and each client has specific limits on the number of requests they can send in a month.

#### Technologies
This Project was created with:
- NodeJS - A javascript server-side engine
- Express Library - A library built on Node JS for building application program interface
- Travis CI - A continuous integration and testing platform
- Coveralls - A continuous integration and testing platform
- Code Climate - A continuous integration and testing platform
- Redis - A data structure store used as a database, cache and message broker
- SonarCloud - A continuous integration and testing platform

#### Tools and Modules
The tools and modules employed in this project are:
- Git
- npm
- Jest - A testing framework
- swaggerUI - A tool for documenting API

#### Development Setup
To start this project, install the required modules and dependencies locally using yarn:
##### Usage Example
##### git Clone this [Repository](git@github.com:nccharles/API_rate_limiter.git)
```
npm install
npm run dev // for development
npm run start // for production
npm run test // for testing
```

#### API URL
- https://rate-limiter-api.onrender.com/api/v3

#### API Documentation
-  https://rate-limiter-api.onrender.com/api-docs

#### User Access
**note** you should Set Client-Id in the header to test the endpoints or your IP will be used as a client id
example:
```
client-id: 748j-37s8-3j8s-3j8s
```
With the above header, you can test the endpoints

To test the email endpoint, use the following example:
```
{
    "to": "send@email.com",
    "message": "Hello World"
}
```

To test the sms endpoint, use the following example:
```
{
    "to": "+250788000000",
    "message": "Hello World"
}
```

#### How to get a local copy and Use
**Clone repository**
- copy the link to the project from github website
- create a folder on local machine
- cd in to the folder and call a git init
- git clone repository
- npm install to install development dependencies


#### Endpoints
| Verb | Endpoint                                           | Description      |
|------|----------------------------------------------------|------------------|
| GET  | https://rate-limiter-api.onrender.com/api/v3       | Welcome Endpoint |
| POST | https://rate-limiter-api.onrender.com/api/v3/sms   | send sms         |
| POST | https://rate-limiter-api.onrender.com/api/v3/email | send email       |
| POST | https://rate-limiter-api.onrender.com/api-docs     | API Documentation|

#### Running Tests
Tests are run by calling
```
npm run test
```
after installing and setting up testing suites:
- jest
##### Usage Example
```
  Testing endpoints
    ✓ should return 200 status code for the / route (2522 ms)                                                                                                      
    ✓ should return 200 status code for the /email route (996 ms)                                                                                                  
    ✓ should return 200 status code for the /sms route (847 ms)                                                                                                    
    ✓ should return 429 status code for too many requests (1176 ms)                                                                                                
    ✓ should return 429 status code for too many requests across the entire system (1043 ms)                                                                       
    ✓ should return 429 status code for too many requests from a specific client on a per-month basis (1006 ms)  
```
#### Contributor(s)
- Charles NDAYISABA

#### Author(s)
- Charles NDAYISABA