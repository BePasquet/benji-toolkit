// function findRemainingBalls(direction: number[], strength: number[]): number[] {
//   if (!direction.length || !strength.length) {
//     return [];
//   }

//   const result = [0];

//   for (let i = 1; i < direction.length; i++) {
//     const prevDirection = direction[result.length - 1];
//     const currentDirection = direction[i];
//     const prevStrength = strength[result.length - 1];
//     const currentStrength = strength[i];

//     const collide = prevDirection + currentDirection === 0;

//     if (collide) {
//       if (prevStrength === currentStrength) {
//         result.pop();
//       }

//       if (currentStrength > prevStrength) {
//         result.pop();
//         result.push(i);
//       }
//     } else {
//       result.push(i);
//     }
//   }

//   return result;
// }

// console.log(findRemainingBalls([1, -1], [2, 1]));
