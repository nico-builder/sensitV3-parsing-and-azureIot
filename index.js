module.exports = function (context, IoTHubMessages) {

    IoTHubMessages.forEach(message => {
        var payload,
            temperature,
            humidity,
            battery;


        payload = message.data;

        //temperture----------------------------------------
        // Calculate from payload
        var pay = payload.slice(3,6);
        var convertOfPayload = parseInt(pay,16);
        var mask = parseInt("001111111111",2);
        var x = convertOfPayload & mask;
        temperature = (x - 200) / 8;


        //humidity--------------------------------------------
        // Calculate from payload
        pay = payload.slice(6,8);
        convertOfPayload = parseInt(pay,16);
        var humidity = convertOfPayload / 2;

        //battery--------------------------------------------
        //Calculate from payload
        pay = payload.slice(0,2);
        convertOfPayload = parseInt(pay,16);
        mask = parseInt("11111000",2);
        x = convertOfPayload & mask;
        var battery = (x * 0.05) + 2.7;

        // create a well-formed object, to use in time series
        var obj = new Object();
        // date manipulation
        var today = new Date();

        obj.deviceId = message.device;
        obj.time = today.toISOString();
        obj.temperature = temperature;
        obj.humidity = humidity;
        obj.battery = battery;

        context.log(`Processed message: ${message}`);
        context.bindings.outputEventHubMessage = [];

        context.bindings.outputEventHubMessage.push(obj);

        context.log(JSON.stringify(context.bindings.outputEventHubMessage));
    });

    context.done();
};
