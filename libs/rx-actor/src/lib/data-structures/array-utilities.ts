function merge(arrA: number[], arrB: number[]): number[] {
  const temp = [];

  while (arrA.length && arrB.length) {
    const smaller = arrA[0] < arrB[0] ? arrA.shift() : arrB.shift();
    temp.push(smaller);
  }

  const remaining = arrA.length ? arrA : arrB;
  return temp.concat(remaining) as number[];
}

export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.ceil(arr.length / 2);
  const left = mergeSort(arr.slice(0, middle));
  const right = mergeSort(arr.slice(middle));

  return merge(left, right);
}

function binarySearch(
  arr: number[],
  lookup: number,
  start = 0,
  end = arr.length
): boolean {
  if (start > end) {
    return false;
  }

  const middle = Math.ceil((start + end) / 2);

  if (arr[middle] === lookup) {
    return true;
  }

  return lookup < arr[middle]
    ? binarySearch(arr, lookup, start, middle - 1)
    : binarySearch(arr, lookup, middle + 1, end);
}

const result = mergeSort([2, 1, 10, 6, 0, 8, 11, 12]);

console.log(binarySearch(result, 10));
