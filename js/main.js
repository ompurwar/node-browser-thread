// https://stackoverflow.com/questions/11909934/how-to-pass-functions-to-javascript-web-worker
if (window.Worker) {
    let counter = 0;
    console.log('worker thread supported');
    const __thread = new Worker('./js/thread.js');

    setInterval(async function () {
        let data = { _counter: counter++ };
        try {
            let result = await ExecuteThread(data, log);
            console.log(`hello ${counter} | result ${result}`)
        } catch (error) {
            console.log(error);
        }
    }, 100)
    function log(data) {
        for (let index = 0; index < 10; index++) {
            console.log(data._counter);
        }
        return data._counter;
    }
    function ExecuteThread(data, func) {
        return new Promise((resolve, reject) => {
            const thread = Thread(data, func)
            function onResult(event) {
                if (event.data.uuid == thread.fun.name) {
                    console.log(event.data.result, '=========[pass]========');
                    resolve(event.data.result);
                } else {
                    console.log(event.data.result, '==========[failed]=======');
                    reject()
                }
            }

            __thread.postMessage(thread);
            __thread.onmessage = onResult
        })
    }

    function Thread(data, fn) {
        //From function to string, with its name, arguments and its body
        var name = fn.name
        fn = fn.toString()
        let uuid = GetUUID();
        return {
            data: data,
            fun: {
                name: `${uuid}_${name}`,
                args: fn.substring(fn.indexOf("(") + 1, fn.indexOf(")")),
                body: fn.substring(fn.indexOf("{") + 1, fn.lastIndexOf("}"))
            }
        };
    }

}

function GetUUID() { return parseInt((Math.random(1200) * 10000000) + Date.now()).toString('16'); }