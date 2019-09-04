/* https://leetcode.com/problems/two-sum/ */

export function twoSum(nums: number[], target: number): number[] {
    if (!nums || nums.length < 2) return null;

    let i = nums.length - 1;
    let matchCache = {};

    while(i >= 0) {
        let num = nums[i];
        let wanting = target - num;

        if (matchCache.hasOwnProperty(num)) {
            return [i, matchCache[num]]
        }
        matchCache[wanting] = i;
        i --;
    }
    return  null;
}