import { HashTable } from './hash-table';
describe('HashTable', () => {
  it('Should insert an element and increment length', () => {
    const table = new HashTable();
    const element = { key: 1 };
    table.insert(element);
    expect(table.length).toBe(1);
    expect(table.find(element.key)).toEqual(element);
  });

  it('Should insert an element with a large key and increment length', () => {
    const table = new HashTable();
    const element = { key: 3 * Math.pow(10, 12) };
    table.insert(element);
    expect(table.length).toBe(1);
    expect(table.find(element.key)).toEqual(element);
  });

  it('Should delete an element and decrement length', () => {
    const table = new HashTable();
    const element = { key: 1 };
    table.insert(element);
    table.delete(1);
    expect(table.length).toBe(0);
    expect(table.find(element.key)).toBe(null);
  });

  it('Should find an element when it exist', () => {
    const table = new HashTable();
    const elements = Array(1000)
      .fill(null)
      .map((_, i) => ({ key: i }));

    elements.forEach((element) => table.insert(element));
    const element = table.find(9);

    expect(element).toEqual({ key: 9 });
  });

  it("Should return null when trying to find an element that doesn't exist", () => {
    const table = new HashTable();
    const elements = Array(10)
      .fill(null)
      .map((_, i) => ({ key: i + 1 }));

    elements.forEach((element) => table.insert(element));

    const element = table.find(300);
    expect(element).toBe(null);
  });
});
