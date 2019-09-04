/* https://leetcode.com/problems/sort-colors/ */

export function sortColor (nums: number[]) {
    function exchange(target, x, y) {
        let t = target[x];
        target[x] = target[y];
        target[y] = t;
    }

    let lo = 0;
    let hi = nums.length - 1;

    let i = 0;

    while(i <= hi) {
        let val = nums[i];

        if (val === 0) {
            exchange(nums, lo++, i++)
        }else if (val === 2) {
            exchange(nums, i, hi--)
        }else {
            ++i;
        }
    }

    return nums;
}