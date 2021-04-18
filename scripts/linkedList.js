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

	[Symbol.iterator]()
	{
		let currentNode = this._head;
		let nextFunc = function()
		{
			if (currentNode != null)
			{
				let retVal = { value: currentNode, done: false };
				currentNode = currentNode.next;
				return retVal;
			}
			else
			{
				return { done: true }
			}
		};
		return { next: nextFunc() }
	}

	get(index)
	{
		let targetNode = this._head;
		for (let i = 0; i < index; i++)
		{
			targetNode = targetNode.next;
		}
		return targetNode;
	}

	push(data)
	{
		this._tail.next = new Node(data, this._tail);
		this._tail = this._tail.next;
	}

	add(data)
	{
		this.push(data);
	}

	pop()
	{
		let lastNode = this._tail;
		this._tail = this._tail.prev;
		this._tail.next = null;
		return lastNode;
	}

	peek()
	{
		return this._tail;
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