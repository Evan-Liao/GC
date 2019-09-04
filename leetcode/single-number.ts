/* https://leetcode.com/problems/single-number/ */

export function singleNumber(nums: number[]) {
    let result =  nums[0];

    for (let i = 0; i < nums.length; i ++) {
        result ^= nums[i]
    }
    return result;
}