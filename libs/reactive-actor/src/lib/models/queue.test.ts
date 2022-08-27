import { Queue } from './queue.model';
describe('Queue', () => {
  describe('enqueue', () => {
    it('Should enqueue elements', () => {
      const queue = new Queue<number>();
      const nums = [0, 1, 2, 3, 4, 5];
      nums.forEach((num) => queue.enqueue(num));
      nums.forEach((num) => expect(queue.dequeue()).toBe(num));
    });
  });
});
