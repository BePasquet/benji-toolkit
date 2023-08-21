import {
  BinaryTreeNode,
  buildBinaryTree,
  inOrderTraversal,
  treeFind,
  treeFindNext,
  treeFindPrevious,
} from './binary-tree-node';

describe('BinaryTreeNode', () => {
  describe('inOrderTraversal', () => {
    it('Should traverse a tree in order', () => {
      const a = new BinaryTreeNode('A');
      const b = new BinaryTreeNode('B');
      const c = new BinaryTreeNode('C');
      const d = new BinaryTreeNode('D');
      const e = new BinaryTreeNode('E');
      b.left = a;
      a.parent = b;
      b.right = c;
      c.parent = b;
      d.left = b;
      b.parent = d;
      d.right = e;
      e.parent = d;

      const elements: string[] = [];
      inOrderTraversal(d, (node) => elements.push(node.value));
      const expected = ['A', 'B', 'C', 'D', 'E'];
      expect(elements).toEqual(expected);
    });

    it('Should traverse a tree with one element', (done) => {
      const a = new BinaryTreeNode('A');
      inOrderTraversal(a, (node) => expect(node.value).toBe('A'));
      done();
    });
  });

  describe('buildTree', () => {
    it('Should build a tree from an array', () => {
      const elements = [1, 2, 3, 4, 5, 6];
      const tree = buildBinaryTree(elements);

      const expected: number[] = [];
      inOrderTraversal(tree, (node) => expected.push(node.value));
      expect(expected).toEqual(elements);
    });

    it('Should nor build a tree from an empty array', () => {
      const tree = buildBinaryTree([]);
      expect(tree).toBe(null);
    });
  });

  describe('subtreeFind', () => {
    it('Should find an element when it exist', () => {
      const a = new BinaryTreeNode({ key: 1 });
      const b = new BinaryTreeNode({ key: 2 });
      const c = new BinaryTreeNode({ key: 3 });
      const d = new BinaryTreeNode({ key: 4 });
      const e = new BinaryTreeNode({ key: 5 });
      b.left = a;
      a.parent = b;
      b.right = c;
      c.parent = b;
      d.left = b;
      b.parent = d;
      d.right = e;
      e.parent = d;

      const result = treeFind(d, 1);

      expect(result).toEqual(a);
    });

    it("Should not find an element when it doesn't exist", () => {
      const a = new BinaryTreeNode({ key: 1 });
      const b = new BinaryTreeNode({ key: 2 });
      const c = new BinaryTreeNode({ key: 3 });
      const d = new BinaryTreeNode({ key: 4 });
      const e = new BinaryTreeNode({ key: 5 });
      b.left = a;
      a.parent = b;
      b.right = c;
      c.parent = b;
      d.left = b;
      b.parent = d;
      d.right = e;
      e.parent = d;

      const result = treeFind(d, 6);

      expect(result).toBe(null);
    });
  });

  describe('treeFindNext', () => {
    it('Should find the next element of an specified key when it exist and has right child', () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindNext(node, 4);

      expect(result?.value).toEqual({ key: 5 });
    });

    it("Should find the next element of an specified key when it exist and doesn't have right child", () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindNext(node, 3);

      expect(result?.value).toEqual({ key: 4 });
    });

    it("Should not find the next element of an specified key when it doesn't exist", () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindNext(node, 6);

      expect(result).toBe(null);
    });

    it("Should not find the next element of an specified key when key doesn't exist", () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindNext(node, 7);

      expect(result).toBe(null);
    });
  });

  describe('treeFindPrevious', () => {
    it('Should find the previous element of an specified key when it exist and has left child', () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindPrevious(node, 4);

      expect(result?.value).toEqual({ key: 3 });
    });

    it("Should find the previous element of an specified key when it exist and doesn't have left child", () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindPrevious(node, 3);

      expect(result?.value).toEqual({ key: 2 });
    });

    it("Should not find the next element of an specified key when it doesn't exist", () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindPrevious(node, 1);

      expect(result).toBe(null);
    });

    it("Should not find the next element of an specified key when key doesn't exist", () => {
      const node = buildBinaryTree([
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
      ]);

      const result = treeFindPrevious(node, 7);

      expect(result).toBe(null);
    });
  });
});
