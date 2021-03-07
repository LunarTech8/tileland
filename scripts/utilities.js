// --------------------
// Functional code
// --------------------

var Utilities = {};

/**
 * @param value Float value between 0 and 1.
 * @param min Minimal target int value.
 * @param max Maximal target int value.
 * @returns A scaled int value between min and max based on given value.
 */
Utilities.scaleToInt = function(value, min, max)
{
    return Math.floor(value * (max - min + 1)) + min;
}

Utilities.interpolateLinear = function(start, stop, p)
{
	return start + (stop - start) * p;
}

/**
 * Throws an exception if the absolute of this value is smaller than given epsilon, else returns the value.
 */
 Utilities.divByZeroProt = function(number, epsilon = 0.0000001)
{
	if (Math.abs(number) <= epsilon)
	{
		throw new Error('Invalid divisor value (' + number + ')');
	}
	return number;
}