const WebSocket = require('ws');
function start() {
    const ws = new WebSocket('wss://ws.smartbit.com.au/v1/blockchain', {
    origin: 'https://tom.place'
    });

    ws.on('open', function open() {
    console.log('connected');
    ws.send(JSON.stringify({type: "new-transaction"}));
    });

    ws.on('close', function close() {
    console.log('disconnected');
    start()
    });

    ws.on('error', function error() {
        console.log('error');
    });

    var epochTime = Math.floor(Date.now() / 60000)
    var counter = 0
    var segwitCounter = 0
    ws.on('message', function incoming(data) {
        let payload = JSON.parse(data).payload
        if (payload) {
            let nowTime = Math.floor(Date.now() / 60000)
            let inputs = payload.inputs
            let outputs = payload.outputs
            if (inputs && outputs) {
                let isSegwit = false
                inputs.forEach(element => {
                    if (element.witness)
                        isSegwit = true
                });

                if (nowTime != epochTime) {
                    console.log(new Date(epochTime*60000) + " ("+(counter/60).toFixed(2)+" t/s): " + segwitCounter + " Segwit / " + (counter-segwitCounter) + " Not Segwit ("+(100/counter*segwitCounter).toFixed(2)+"%)")
                    epochTime = nowTime
                    counter = 0
                    segwitCounter = 0
                }
                if (isSegwit) {
                    segwitCounter = segwitCounter + 1
                }
                counter = counter + 1
                
            }
        }
    });
};
start()