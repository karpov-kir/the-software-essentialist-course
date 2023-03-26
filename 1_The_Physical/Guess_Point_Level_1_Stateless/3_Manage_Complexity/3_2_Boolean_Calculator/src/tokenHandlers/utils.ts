export class LinkedListNode<T> {
  next: LinkedListNode<T> | undefined;
  previous: LinkedListNode<T> | undefined;

  constructor(public value: T) {}
}
