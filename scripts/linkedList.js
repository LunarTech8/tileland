class Node
{
	// --------------------
	// Functional code
	// --------------------

	data;
	prev;
	next;

	constructor(data, prev = null, next = null)
	{
		this.data = data;
		this.prev = prev;
		this.next = next;
	}
}

class LinkedList
{
	// --------------------
	// Functional code
	// --------------------

	_head;
	_tail;

	constructor(head = null)
	{
		this._head = head;
		this._tail = head;
	}

	push(data)
	{
		this._tail.next = new Node(data, this._tail);
		this._tail = this._tail.next;
	}

	pop()
	{
		let lastNode = this._tail;
		this._tail = this._tail.prev;
		this._tail.next = null;
		return lastNode;
	}

	size()
	{
		let count = 0;
		let node = this._head;
		while (node)
		{
			count++;
			node = node.next;
		}
		return count;
	}

	clear()
	{
		this._head = null;
		this._tail = null;
	}
}