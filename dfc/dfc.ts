// 深度非递归遍历数形结构算法

let targetList;
let resultList;

for (let i = 0, j = targetList.length; i < j; i++) {
  
    let stack = [];
    stack.push(targetList[i]);

    while (stack.length) {
        let item = stack.shift();
        if (item.children && item.children.length) {
            let childrenItem = item.children;
            for (let k = 0, l = childrenItem.length; k < l; k++) {
                if (childrenItem[k].tag === 0) {
                    stack.push(childrenItem[k]);
                } else {
                    resultList.push(childrenItem[k]);
                }
            }
        }
    }
}