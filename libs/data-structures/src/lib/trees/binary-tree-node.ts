import { SetElement } from '../set';

export class BinaryTreeNode<T> {
  constructor(
    public value: T,
    public left: BinaryTreeNode<T> | null = null,
    public right: BinaryTreeNode<T> | null = null,
    public parent: BinaryTreeNode<T> | null = null
  ) {}
}

export function buildBinaryTreePrivate<T>(
  elements: T[],
  start = 0,
  end = elements.length - 1
): BinaryTreeNode<T> | null {
  if (start > end) {
    return null;
  }

  const mid = Math.floor((start + end) / 2);
  const element = elements[mid];
  const node = new BinaryTreeNode(element);
  node.left = buildBinaryTreePrivate(elements, start, mid - 1);

  if (node.left) {
    node.left.parent = node;
  }

  node.right = buildBinaryTreePrivate(elements, mid + 1, end);

  if (node.right) {
    node.right.parent = node;
  }

  return node;
}

export function buildBinaryTree<T>(elements: T[]): BinaryTreeNode<T> | null {
  return buildBinaryTreePrivate(elements);
}

export class BinaryTree<T> {
  constructor(public root: BinaryTreeNode<T> | null = null) {}
}

export function inOrderTraversal<T>(
  node: BinaryTreeNode<T> | null,
  visit: (node: BinaryTreeNode<T>) => void
): void {
  if (!node) {
    return;
  }

  inOrderTraversal(node.left, visit);
  visit(node);
  inOrderTraversal(node.right, visit);
}

export function treeFind<T extends SetElement>(
  node: BinaryTreeNode<T> | null,
  key: number
): BinaryTreeNode<T> | null {
  if (!node) {
    return null;
  }

  if (node.value.key === key) {
    return node;
  }

  const nextNode = key < node.value.key ? node.left : node.right;
  return treeFind(nextNode, key);
}

export function treeFindFirst<T>(
  node: BinaryTreeNode<T>
): BinaryTreeNode<T> | null {
  return !node.left ? node : treeFindFirst(node.left);
}

export function treeFindLast<T>(
  node: BinaryTreeNode<T>
): BinaryTreeNode<T> | null {
  return !node.right ? node : treeFindLast(node.right);
}

export function findFirstBranching<T>(
  node: BinaryTreeNode<T> | null,
  branch: 'left' | 'right'
): BinaryTreeNode<T> | null {
  if (!node) {
    return null;
  }

  if (node.parent?.[branch] === node) {
    return node.parent;
  }

  return findFirstBranching(node.parent, branch);
}

export function treeSuccessor<T>(
  node: BinaryTreeNode<T>
): BinaryTreeNode<T> | null {
  return node.right
    ? treeFindFirst(node.right)
    : findFirstBranching(node, 'left');
}

export function treePredecessor<T>(
  node: BinaryTreeNode<T>
): BinaryTreeNode<T> | null {
  return node.left
    ? treeFindLast(node.left)
    : findFirstBranching(node, 'right');
}

export function treeFindNext<T extends SetElement>(
  node: BinaryTreeNode<T> | null,
  key: number
): BinaryTreeNode<T> | null {
  if (!node) {
    return null;
  }

  if (node.value.key === key) {
    return treeSuccessor(node);
  }

  return key < node.value.key
    ? treeFindNext(node.left, key)
    : treeFindNext(node.right, key);
}

export function treeFindPrevious<T extends SetElement>(
  node: BinaryTreeNode<T> | null,
  key: number
): BinaryTreeNode<T> | null {
  if (!node) {
    return null;
  }

  if (node.value.key === key) {
    return treePredecessor(node);
  }

  return key < node.value.key
    ? treeFindPrevious(node.left, key)
    : treeFindPrevious(node.right, key);
}

export function treeSetInsert<T extends SetElement>(
  node: BinaryTreeNode<T> | null,
  element: T
): void {
  if (!node) {
    return;
  }

  if (node.value.key === element.key) {
    node.value = element;
    return;
  }

  if (element.key < node.value.key) {
    // There are no more smaller keys items
    if (!node.left) {
      const newNode = new BinaryTreeNode(element);
      node.left = newNode;
      newNode.parent = node;
    } else {
      return treeSetInsert(node.left, element);
    }
  } else {
    // There are no more bigger keys items
    if (!node.right) {
      const newNode = new BinaryTreeNode(element);
      node.right = newNode;
      newNode.parent = node;
    } else {
      return treeSetInsert(node.right, element);
    }
  }
}

export function treeDelete<T>(
  node: BinaryTreeNode<T>
): BinaryTreeNode<T> | null {
  if (!node) {
    return null;
  }

  // Is a leaf
  if (!node.left && !node.right) {
    if (node.parent) {
      const side = node.parent.left === node ? 'left' : 'right';
      node.parent[side] = null;
    }

    return node;
  }

  if (node.left) {
    const other = treePredecessor(node);

    if (other) {
      const value = other?.value;
      other.value = node.value;
      node.value = value;
      return treeDelete(other);
    } else {
      return null;
    }
  } else {
    const other = treeSuccessor(node);

    if (other) {
      const value = other?.value;
      other.value = node.value;
      node.value = value;
      return treeDelete(other);
    } else {
      return null;
    }
  }
}
