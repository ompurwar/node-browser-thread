let queue =[];
let is_queue_under_process =  false;

onmessage = function (e) {
    console.log('Message received from main script');

    console.log(e.data)
    let thread = e.data;
    let foo = Function(thread.fun.args, thread.fun.body);
    
    postMessage({result:foo(thread.data),uuid:thread.fun.name})
}




//     var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
//     console.log('Posting message back to main script');
//     postMessage(workerResult);
// }