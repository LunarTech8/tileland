// --------------------
// Functional code
// --------------------

class ListNode<T>
{
	public data: T;
	public prev: ListNode<T>;
	public next: ListNode<T>;

	constructor(data: T, prev = null, next = null)
	{
		this.data = data;
		this.prev = prev;
		this.next = next;
	}
}

class LinkedList<T> implements IterableIterator<T>
{
	private head: ListNode<T>;
	private tail: ListNode<T>;

	constructor(head = null)
	{
		this.head = head;
		this.tail = head;
	}

	public next(): IteratorResult<T>
	{
		var currentNode = this.head;  // TODO: check if this works properly
		if (currentNode != null)
		{
			let retVal = { value: currentNode.data, done: false };
			currentNode = currentNode.next;
			return retVal;
		}
		else
		{
			return { value: null, done: true };
		}
	}

	[Symbol.iterator](): IterableIterator<T>
	{
		return this;
	}

	public get(index: number): T
	{
		let targetNode = this.head;
		for (let i = 0; i < index; i++)
		{
			targetNode = targetNode.next;
		}
		return targetNode.data;
	}

	public push(data: T)
	{
		this.tail.next = new ListNode(data, this.tail);
		this.tail = this.tail.next;
	}

	public add(data: T)
	{
		this.push(data);
	}

	public pop(): T
	{
		let lastNode = this.tail;
		this.tail = this.tail.prev;
		this.tail.next = null;
		return lastNode.data;
	}

	public peek(): T
	{
		return this.tail.data;
	}

	public size(): number
	{
		let count = 0;
		let node = this.head;
		while (node)
		{
			count++;
			node = node.next;
		}
		return count;
	}

	public clear()
	{
		this.head = null;
		this.tail = null;
	}
}