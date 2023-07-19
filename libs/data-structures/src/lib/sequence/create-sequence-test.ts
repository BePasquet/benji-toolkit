import { SequenceConstructor } from './sequence-constructor.interface';

export function runSequenceTest(sequence: SequenceConstructor) {
  describe(sequence.name, () => {
    describe('build', () => {
      it('Should build a sequence of items from an iterable', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        const areValuesEqual = iterable.every(
          (x, index) => x === sequenceInstance.getAt(index)
        );

        expect(areValuesEqual).toBe(true);
      });

      it('Should build a sequence of items from an iterable, after a sequence is already stored', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        const currentIterable = [2, 3, 4];
        sequenceInstance.build(currentIterable);

        const areValuesEqual = currentIterable.every(
          (x, index) => x === sequenceInstance.getAt(index)
        );

        expect(areValuesEqual).toBe(true);
      });
    });

    describe('length', () => {
      it('Should return the number of element in the sequence', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);
        expect(sequenceInstance.length).toBe(iterable.length);
      });

      it('Should return 0 when there is no elements in the sequence', () => {
        const sequenceInstance = new sequence();

        expect(sequenceInstance.length).toBe(0);
      });
    });

    describe('getAt', () => {
      it('Should return the element at the specified index', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);
        expect(sequenceInstance.getAt(0)).toBe(1);
        expect(sequenceInstance.getAt(1)).toBe(2);
        expect(sequenceInstance.getAt(2)).toBe(3);
        expect(sequenceInstance.getAt(3)).toBe(4);
      });

      it('Should return null when there are no elements on the sequence', () => {
        const sequenceInstance = new sequence();
        expect(sequenceInstance.getAt(0)).toBe(null);
      });

      it('Should return null when the index on the sequence does not exist', () => {
        const sequenceInstance = new sequence();
        const iterable = [1];
        sequenceInstance.build(iterable);
        expect(sequenceInstance.getAt(1)).toBe(null);
      });
    });

    describe('setAt', () => {
      it('Should overwrite an element at a specified index', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);
        const index = 2;
        const newValue = 10;
        sequenceInstance.setAt(index, newValue);
        expect(sequenceInstance.getAt(index)).toBe(newValue);
      });

      it('Should not change the sequence when the index on the sequence does not exist', () => {
        const sequenceInstance = new sequence();
        const iterable = [1];
        sequenceInstance.build(iterable);

        const index = 10;
        const newValue = 10;
        sequenceInstance.setAt(index, newValue);

        const isTheSame = iterable.every(
          (element, index) => sequenceInstance.getAt(index) === element
        );

        expect(isTheSame).toBe(true);
        expect(sequenceInstance.length).toBe(1);
      });
    });

    describe('insertAt', () => {
      it('Should insert an element on the specified index and move current elements', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        sequenceInstance.insertAt(1, 10);
        expect(sequenceInstance.getAt(0)).toBe(1);
        expect(sequenceInstance.getAt(1)).toBe(10);
        expect(sequenceInstance.getAt(2)).toBe(2);
        expect(sequenceInstance.getAt(3)).toBe(3);
        expect(sequenceInstance.getAt(4)).toBe(4);
      });

      it('Should not change the sequence when the index on the sequence does not exist', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        sequenceInstance.insertAt(10, 10);
        expect(sequenceInstance.getAt(0)).toBe(1);
        expect(sequenceInstance.getAt(1)).toBe(2);
        expect(sequenceInstance.getAt(2)).toBe(3);
        expect(sequenceInstance.getAt(3)).toBe(4);
        expect(sequenceInstance.length).toBe(4);
      });
    });

    describe('deleteAt', () => {
      it('Should delete an element on the specified index and move current elements', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        const element = sequenceInstance.deleteAt(1);
        expect(sequenceInstance.getAt(0)).toBe(1);
        expect(sequenceInstance.getAt(1)).toBe(3);
        expect(sequenceInstance.getAt(2)).toBe(4);
        expect(element).toBe(2);
      });

      it('Should not change the sequence when the index on the sequence does not exist', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        sequenceInstance.deleteAt(10);
        expect(sequenceInstance.getAt(0)).toBe(1);
        expect(sequenceInstance.getAt(1)).toBe(2);
        expect(sequenceInstance.getAt(2)).toBe(3);
        expect(sequenceInstance.getAt(3)).toBe(4);
        expect(sequenceInstance.length).toBe(4);
      });

      it('Should return null when there is no elements in the sequence', () => {
        const sequenceInstance = new sequence();

        const element = sequenceInstance.deleteAt(0);
        expect(element).toBe(null);
      });
    });

    describe('insertFirst', () => {
      it('Should insert an element at the beginning of a sequence and move current elements', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        sequenceInstance.insertFirst(10);
        expect(sequenceInstance.getAt(0)).toBe(10);
        expect(sequenceInstance.getAt(1)).toBe(1);
        expect(sequenceInstance.getAt(2)).toBe(2);
        expect(sequenceInstance.getAt(3)).toBe(3);
        expect(sequenceInstance.getAt(4)).toBe(4);
      });
    });

    describe('deleteFirst', () => {
      it('Should delete the element at the beginning of a sequence and move current elements', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        const element = sequenceInstance.deleteFirst();
        expect(sequenceInstance.getAt(0)).toBe(2);
        expect(sequenceInstance.getAt(1)).toBe(3);
        expect(sequenceInstance.getAt(2)).toBe(4);
        expect(element).toBe(1);
      });

      it('Should return null when there is no elements in the sequence', () => {
        const sequenceInstance = new sequence();

        const element = sequenceInstance.deleteFirst();
        expect(element).toBe(null);
      });
    });

    describe('insertLast', () => {
      it('Should insert an element at the end of a sequence and move current elements', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        sequenceInstance.insertLast(10);
        expect(sequenceInstance.getAt(0)).toBe(1);
        expect(sequenceInstance.getAt(1)).toBe(2);
        expect(sequenceInstance.getAt(2)).toBe(3);
        expect(sequenceInstance.getAt(3)).toBe(4);
        expect(sequenceInstance.getAt(4)).toBe(10);
      });
    });

    describe('deleteLast', () => {
      it('Should delete the element at the end of a sequence and move current elements', () => {
        const sequenceInstance = new sequence();
        const iterable = [1, 2, 3, 4];
        sequenceInstance.build(iterable);

        const element = sequenceInstance.deleteLast();
        expect(sequenceInstance.getAt(0)).toBe(1);
        expect(sequenceInstance.getAt(1)).toBe(2);
        expect(sequenceInstance.getAt(2)).toBe(3);
        expect(element).toBe(4);
      });
    });
  });
}
