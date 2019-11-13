var isPalindrome = function(x) {
    if(x >= 0){
            let c = x;
            let b;
            for (b = 0; c !== 0; c = c / 10 >> 0) {
                b = b * 10 + c % 10
            }
            return b === x
        }else {
            return false
        }
};