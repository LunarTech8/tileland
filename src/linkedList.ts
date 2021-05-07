// --------------------
// Functional code
// --------------------

class ListNode<T>
{
	public data: T;
	public prev: ListNode<T>;
	public next: ListNode<T>;

	constructor(data: T, prev: ListNode<T> = null, next: ListNode<T> = null)
	{
		this.data = data;
		this.prev = prev;
		this.next = next;
	}
}

export class LinkedList<T> implements IterableIterator<T>
{
	private head: ListNode<T>;
	private tail: ListNode<T>;
	private iNode: ListNode<T>;

	constructor(data: T = null)
	{
		if (data != null)
		{
			this.head = new ListNode<T>(data);
		}
		else
		{
			this.head = null;
		}
		this.tail = this.head;
	}

	public next(): IteratorResult<T>
	{
		if (this.iNode != null)
		{
			let data = this.iNode.data;
			this.iNode = this.iNode.next;
			return { value: data, done: false };
		}
		else
		{
			return { value: null, done: true };
		}
	}

	[Symbol.iterator](): IterableIterator<T>
	{
		this.iNode = this.head;
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
		if (this.tail != null)
		{
			this.tail.next = new ListNode<T>(data, this.tail);
			this.tail = this.tail.next;
		}
		else
		{
			this.head = new ListNode<T>(data);
			this.tail = this.head;
		}
	}

	public add(data: T)
	{
		this.push(data);
	}

	public pop(): T
	{
		let lastNode = this.tail;
		this.tail = this.tail.prev;
		if (this.tail != null)
		{
			this.tail.next = null;
		}
		return lastNode.data;
	}

	public peek(): T
	{
		if (this.tail != null)
		{
			return this.tail.data;
		}
		else
		{
			return null;
		}
	}

	public size(): number
	{
		let count = 0;
		let node = this.head;
		while (node != null)
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