/**
 * Based upun an idea from Nicolas Zackas 
 * @author Tom Cool
 * @version 0.1
 * 
 * A linked list implementation in JavaScript.
 * @class LinkedList
 * @constructor
 * @this {LinkedList}
 */
function LinkedList() {
	'use strict';
	/**
	 * The number of items in the list.
	 * @property _length
	 * @type int
	 * @private
	 */
	this._length = 0;

	/**
	 * Pointer to first item in the list.
	 * @property _head
	 * @type Object
	 * @private
	 */
	this._head = null;
};

/**
 * Create a new item object to place data in
 * @class LinkedList.Node
 * @constructor
 * @param {variant} data The data to add to the list
 * @this {LinkedList.Node}
 */
LinkedList.Node = function LinkedListNode(data) {
	'use strict';
	/**
	 * The data to add to the list
	 * @property data
	 * @type Variant
	 * @private
	 */
	this.data = data;
	
	/**
	 * Pointer to next item in the list.
	 * @property _head
	 * @type Object
	 * @private
	 */
	this.next = null;
	
	/**
	 * Pointer to previous item in the list.
	 * @property _head
	 * @type Object
	 * @private
	 */
	this.prev = null;
};

LinkedList.prototype = {

	//restore constructor
	constructor : LinkedList,

	/**
	 * Appends some data to the end of the list. This method traverses
	 * the existing list and places the value at the end in a new item.
	 * @param {variant} data The data to add to the list.
	 * @this {LinkedList}
	 * @return {Void}
	 * @method add
	 */
	add : function(data) {
		'use strict';
		//create a new item object, place data in
		var node = new LinkedList.Node(data);
		console.log(node)
		//used to traverse the structure
		var current;

		//special case: no items in the list yet
		if (this._head === null) {
			this._head = node;
		} else {
			current = this._head;

			while (current.next) {
				current = current.next;
			}

			current.next = node;
		}

		//don't forget to update the count
		this._length += 1;

	},

	/**
	 * Retrieves the data in the given position in the list.
	 * @param {int} index The zero-based index of the item whose value should be returned.
	 * @this {LinkedList}
	 * @return {variant} The value in the "data" portion of the given item or null if the item doesn't exist.
	 * @method item
	 */
	item : function(index) {
		'use strict';
		//check for out-of-bounds values
		if (index > -1 && index < this._length) {
			var current = this._head, 
				i = 0;

			while ((i += 1) < index) {
				current = current.next;
			};

			return current.data;
		} else {
			return null;
		};
	},

	/**
	 * Removes the item from the given location in the list.
	 * @param {int} index The zero-based index of the item to remove.
	 * @this {LinkedList}
	 * @return {variant} The data in the given position in the list or null if the item doesn't exist.
	 * @method remove
	 */
	remove : function(index) {
		'use strict';
		//check for out-of-bounds values
		if (index > -1 && index < this._length) {

			var current = this._head, previous, i = 0;

			//special case: removing first item
			if (index === 0) {
				this._head = current.next;
			} else {

				//find the right location
				while ((i += 1) < index) {
					previous = current;
					current = current.next;
				};

				//skip over the item to remove
				previous.next = current.next;
			};

			//decrement the length
			this._length -= 1;

			//return the value
			return current.data;

		} else {
			return null;
		}

	},

	/**
	 * Returns the number of items in the list.
	 * @return {int} The number of items in the list.
	 * @method size
	 */
	size : function() {
		'use strict';
		return this._length;
	},

	/**
	 * Converts the list into an array.
	 * @return {Array} An array containing all of the data in the list.
	 * @method toArray
	 */
	toArray : function() {
		'use strict';
		var result = [], 
			current = this._head;

		while (current) {
			result.push(current.data);
			current = current.next;
		};
		return result;
	},

	/**
	 * Converts the list into a string representation.
	 * @return {String} A string representation of the list.
	 * @method toString
	 */
	toString : function() {
		'use strict';
		return this.toArray().toString();
	}
}; 


/**
 * A linked list implementation in JavaScript.
 * @class DoublyLinkedList
 * @constructor
 */
LinkedList.Doubly = function LinkedListDoubly() {
	'use strict';
    /**
     * Pointer to first item in the list.
     * @property _head
     * @type Object
     * @private
     */
    this._head = null;
    
    /**
     * Pointer to last item in the list.
     * @property _tail
     * @type Object
     * @private
     */    
    this._tail = null;
    
    /**
     * The number of items in the list.
     * @property _length
     * @type int
     * @private
     */    
    this._length = 0;
}

/**
 * Extend Doubly with Linkedlist, to inherit it's prototype
 */
LinkedList.Doubly.extends(LinkedList);

    
/**
 * Appends some data to the end of the list. This method traverses
 * the existing list and places the value at the end in a new item.
 * @override
 * @this {LinkedList.Doubly}
 * @param {variant} data The data to add to the list.
 * @return {Void}
 * @method add
 */
LinkedList.Doubly.prototype.add = function (data){
    'use strict';
    //create a new item object, place data in
    var node = new LinkedList.Node(data);
    //special case: no items in the list yet
    if (this._length == 0) {
        this._head = node;
        this._tail = node;
    } else {
        //attach to the tail node
        this._tail.next = node;
        node.prev = this._tail;
        this._tail = node;
    }        
    
    //don't forget to update the count
    this._length++;

};
    
/**
 * Removes the item from the given location in the list.
 * @param {int} index The zero-based index of the item to remove.
 * @override
 * @this {LinkedList.Doubly}
 * @return {variant} The data in the given position in the list or null if the item doesn't exist.
 * @method remove
 */
LinkedList.Doubly.prototype.remove = function(index) {
    
    //check for out-of-bounds values
    if (index > -1 && index < this._length){
    
        var current = this._head,
            i = 0;
            
        //special case: removing first item
        if (index === 0) {
            this._head = current.next;
            /*
             * If there's only one item in the list and you remove it,
             * then this._head will be null. In that case, you should
             * also set this._tail to be null to effectively destroy
             * the list. Otherwise, set the previous pointer on the new
             * this._head to be null.
             */
            if (!this._head){
                this._tail = null;
            } else {
                this._head.prev = null;
            };
   
        //special case: removing last item
        } else if (index === this._length - 1) {
            current = this._tail;
            this._tail = current.prev;
            this._tail.next = null;
        } else {
    
            //find the right location
            while (i++ < index){
                current = current.next;            
            };
        
            //skip over the item to remove
            current.prev.next = current.next;
        };
    
        //decrement the length
        this._length--;
    
        //return the value
        return current.data;            
    
    } else {
        return null;
    };
};