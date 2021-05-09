// --------------------
// Functional code
// --------------------

class ListNode<T>
{
	public data: T;
	public prev: ListNode<T>;
	public next: ListNode<T>;

	constructor(data: T, prev: ListNode<T>, next: ListNode<T>)
	{
		this.data = data;
		this.prev = prev;
		this.next = next;
	}
}

export class LinkedList<T> implements IterableIterator<T>
{
	private readonly head: ListNode<T>;
	private readonly tail: ListNode<T>;
	private iNode: ListNode<T>;

	constructor(data: T = null)
	{
		this.head = new ListNode<T>(null, null, null);
		this.tail = new ListNode<T>(null, null, null);
		if (data != null)
		{
			let newNode = new ListNode<T>(data, this.head, this.tail);
			this.head.next = newNode;
			this.tail.prev = newNode;
		}
		else
		{
			this.head.next = this.tail;
			this.tail.prev = this.head;
		}
	}

	public next(): IteratorResult<T>
	{
		if (this.iNode == this.tail)
		{
			return { value: null, done: true };
		}
		let data = this.iNode.data;
		this.iNode = this.iNode.next;
		return { value: data, done: false };
	}

	[Symbol.iterator](): IterableIterator<T>
	{
		this.iNode = this.head.next;
		return this;
	}

	public get(index: number): T
	{
		let targetNode = this.head.next;
		for (let i = 0; i < index; i++)
		{
			targetNode = targetNode.next;
		}
		return targetNode.data;
	}

	public push(data: T)
	{
		let newNode = new ListNode<T>(data, this.tail.prev, this.tail);
		this.tail.prev.next = newNode;
		this.tail.prev = newNode;
	}

	public add(data: T)
	{
		this.push(data);
	}

	public remove(data: T): boolean
	{
		let iNode = this.head;
		while (iNode.next != this.tail)
		{
			iNode = iNode.next;
			if (iNode.data == data)
			{
				iNode.prev.next = iNode.next;
				iNode.next.prev = iNode.prev;
				return true;
			}
		}
		return false;
	}

	public pop(): T
	{
		if (this.tail.prev == this.head)
		{
			return null;
		}
		let lastNode = this.tail.prev;
		lastNode.prev.next = this.tail;
		this.tail.prev = lastNode.prev;
		return lastNode.data;
	}

	public peek(): T
	{
		if (this.tail.prev == this.head)
		{
			return null;
		}
		return this.tail.prev.data;
	}

	public size(): number
	{
		let count = 0;
		for (let iNode = this.head.next; iNode != this.tail; count++)
		{
			iNode = iNode.next;
		}
		return count;
	}

	public clear()
	{
		this.head.next = this.tail;
		this.tail.prev = this.head;
	}
}