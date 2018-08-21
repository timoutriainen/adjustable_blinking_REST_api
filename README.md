# adjustable_blinking_REST_api
REST API for controlling Linux kernel driver for blinking a LED on a Raspberry Pi

## Installation

### Setup node.js on Raspberry Pi
https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/

### Clone this repository
git clone https://github.com/timoutriainen/adjustable_blinking_REST_api adjustable_blinking_REST_api 

### Do npm install
adjustable_blinking_REST_api>npm install

### Install the driver
https://github.com/timoutriainen/adjustable_blinking

## Usage

### Run API
adjustable_blinking_REST_api>node .

### Make REST requests
Use Postman or Insomnia to issue the below requests

POST <your_server_ip>:3000/blink/start

POST <your_server_ip>:3000/blink/stop

POST <your_server_ip>:3000/blink/delay 

Provide new delay value in the request body in application/json format:
{
	"value": 1000
}

GET <your_server_ip>:3000/blink/delay
