// 优化递归调用，避免因递归造成调用栈溢出

function tco(fn) {
    let flag = false,
        value = 0,
        args = [];
    
    return function callback() {
        args.push(arguments);
        if (!flag) {
            flag = true;
            while(args.length) {
                value = fn.apply(this, args.shift())
            }
            flag = false;
            return value;
        }
       
    }
}

const sum = tco(function(x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1)
    }else {
        return x;
    }
})

var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}

foo() // 3
x // 1