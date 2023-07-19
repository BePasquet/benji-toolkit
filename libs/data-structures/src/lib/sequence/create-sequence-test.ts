import { SequenceConstructor } from './sequence-constructor.interface';

export function createSequenceTest(sequence: SequenceConstructor) {
  return () => {
    describe(sequence.name, () => {
      describe('build', () => {
        it('Should build a sequence of items from an iterable', () => {
          const arraySequence = new sequence();
          const iterable = [1, 2, 3, 4];
          arraySequence.build(iterable);

          const areValuesEqual = iterable.every(
            (x, index) => x === arraySequence.get(index)
          );

          expect(areValuesEqual).toBe(true);
        });

        it('Should build a sequence of items from an iterable, after a sequence is already stored', () => {
          const arraySequence = new sequence();
          const iterable = [1, 2, 3, 4];
          arraySequence.build(iterable);

          const currentIterable = [2, 3, 4];
          arraySequence.build(currentIterable);

          const areValuesEqual = currentIterable.every(
            (x, index) => x === arraySequence.get(index)
          );

          expect(areValuesEqual).toBe(true);
        });
      });

      describe('length', () => {
        it('Should return the number of element in the array sequence', () => {
          const arraySequence = new sequence();
          const iterable = [1, 2, 3, 4];
          arraySequence.build(iterable);
          expect(arraySequence.length).toBe(iterable.length);
        });

        it('Should return 0 when there is no elements in the array sequence', () => {
          const arraySequence = new sequence();

          expect(arraySequence.length).toBe(0);
        });
      });

      describe('get', () => {
        it('Should return the element at the position of the specified argument of get', () => {
          const arraySequence = new sequence();
          const iterable = [1, 2, 3, 4];
          arraySequence.build(iterable);
          expect(arraySequence.get(0)).toBe(1);
          expect(arraySequence.get(1)).toBe(2);
          expect(arraySequence.get(2)).toBe(3);
          expect(arraySequence.get(3)).toBe(4);
        });
      });

      describe('set', () => {
        it('Should overwrite an element at a specified position', () => {
          const arraySequence = new sequence();
          const iterable = [1, 2, 3, 4];
          arraySequence.build(iterable);
          const index = 2;
          const newValue = 10;
          arraySequence.setAt(index, newValue);
          expect(arraySequence.get(index)).toBe(newValue);
        });
      });
    });
  };
}
