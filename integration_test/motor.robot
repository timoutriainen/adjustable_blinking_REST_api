*** settings ***
Library  REST  http://169.254.248.101:3000

*** Variables ***
${speed_255}=   { "speed": 255}
${speed_200}=   { "speed": 200 }
${speed_175}=   { "speed": 175 }
${speed_0}=   { "speed": 0 }

*** test cases ***
getSpeed
    GET  /motor/speed
    Object  response body
    Output
    Integer  response body speed  0  

runBasicCommands
    POST  /motor/speed  ${speed_200}
    POST  /motor/rotation  { "rotation": "right" }
    Sleep   2s   Wait for a reply
    POST  /motor/speed  ${speed_255}
    POST  /motor/rotation  { "rotation": "left" }
    Sleep   1s   Wait for a reply
    POST  /motor/speed  ${speed_175}
    Sleep   2s   Wait for a reply
    POST  /motor/speed  ${speed_200}
    POST  /motor/rotation  { "rotation": "right" }
    Sleep   1s   Wait for a reply
    POST  /motor/speed  ${speed_175}
    POST  /motor/rotation  { "rotation": "left" }
    Sleep   2s   Wait for a reply
    POST  /motor/speed  ${speed_175}
    Sleep   2s   Wait for a reply

setSpeedToZero
    POST    /motor/speed    ${speed_0}

loopTest
    :FOR   ${INDEX}    IN RANGE    175   255
    \   Log   ${INDEX}
    \   POST    /motor/speed    { "speed": ${INDEX}}
    \   Sleep   0.05s    Wait for a moment ...
    POST    /motor/speed    ${speed_0}
