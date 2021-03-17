// --------------------
// Functional code
// --------------------

var Utilities = {};

/**
 * @param min Minimum target float value.
 * @param max Maximum target float value.
 * @param value Float value between 0 and 1.
 * @returns Linear interpolated value between min and max based on given value.
 */
Utilities.interpolateLinear = function(min, max, value)
{
	if (value < 0 || value > 1)
	{
		throw new Error('Invalid given value (' + value + '), has to be between 0 and 1');
	}
	return min + (max - min) * value;
}

/**
 * @param min Minimum target int value.
 * @param max Maximum target int value.
 * @param value Float value between 0 and 1.
 * @returns Linear interpolated integer value between min and max based on given value.
 */
 Utilities.interpolateLinearInt = function(min, max, value)
 {
	if (value < 0 || value > 1)
	{
		throw new Error('Invalid given value (' + value + '), has to be between 0 and 1');
	}
	 return min + Math.floor((max - min + 1) * value);
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

/**
 * @param min Minimum target number.
 * @param max Maximum target number.
 * @param number Source number.
 * @returns Clipped number between min and max.
 */
Utilities.clip = function(number, min, max)
{
	return Math.max(min, Math.min(number, max));
}