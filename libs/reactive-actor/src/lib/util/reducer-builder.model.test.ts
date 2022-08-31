import { createEvent } from './create-event';
import { identity } from './identity';
import { ReducerBuilder } from './reducer-builder.model';

describe('Reducer Builder Model', () => {
  describe('addCase', () => {
    it('Should add a reducer with a case for an event creator', () => {
      const builder = new ReducerBuilder();
      const start = createEvent('Start');

      builder.addCase(start, identity);

      expect(builder.reducers.get(start.type)).toEqual(identity);
    });

    it('Should add a reducer with cases for multiple event creators', () => {
      const builder = new ReducerBuilder();
      const start = createEvent('Start');
      const replay = createEvent('Replay');

      builder.addCase([start, replay], identity);

      expect(builder.reducers.get(start.type)).toEqual(identity);
      expect(builder.reducers.get(replay.type)).toEqual(identity);
    });

    it('Should add a reducer with a case for a string', () => {
      const builder = new ReducerBuilder();
      const type = 'Start';

      builder.addCase(type, identity);

      expect(builder.reducers.get(type)).toEqual(identity);
    });

    it('Should add a reducer with a case for multiple strings', () => {
      const builder = new ReducerBuilder();
      const startType = 'Start';
      const replayType = 'Replay';

      builder.addCase([startType, replayType], identity);

      expect(builder.reducers.get(startType)).toEqual(identity);
      expect(builder.reducers.get(replayType)).toEqual(identity);
    });
  });

  describe('reducers', () => {
    it('Should return a copy of the current reducers', () => {
      const builder = new ReducerBuilder();
      const start = createEvent('Start');
      const replay = createEvent('Replay');

      builder.addCase([start, replay], identity);

      const expected = new Map([
        [start.type, identity],
        [replay.type, identity],
      ]);
      expect(builder.reducers).toEqual(expected);
    });

    it('Should return an empty map when no reducers has been added', () => {
      const builder = new ReducerBuilder();
      expect(builder.reducers).toEqual(new Map());
    });
  });
});
