// --------------------
// Functional code
// --------------------

namespace Utilities
{
	/**
	 * @param min Minimum target float value.
	 * @param max Maximum target float value.
	 * @param alpha Float value between 0 and 1.
	 * @returns Linear interpolated value between min and max based on given alpha.
	 */
	export function interpolateLinear(min: number, max: number, alpha: number): number
	{
		if (alpha < 0 || alpha > 1)
		{
			throw new Error('Invalid given value (' + alpha + '), has to be between 0 and 1');
		}
		return min + (max - min) * alpha;
	}

	/**
	 * @param min Minimum target int value.
	 * @param max Maximum target int value.
	 * @param alpha Float value between 0 and 1.
	 * @returns Linear interpolated integer value between min and max based on given alpha.
	 */
	export function interpolateLinearInt(min: number, max: number, alpha: number): number
	{
	if (alpha < 0 || alpha > 1)
	{
		throw new Error('Invalid given value (' + alpha + '), has to be between 0 and 1');
	}
		return min + Math.floor((max - min + 1) * alpha);
	}

	/**
	 * @param min Minimum target float value.
	 * @param max Maximum target float value.
	 * @param alpha Float value between 0 and 1.
	 * @returns Cosine interpolated value between min and max based on given alpha.
	 */
	export function interpolateCosine(min: number, max: number, alpha: number): number
	{
		if (alpha < 0 || alpha > 1)
		{
			throw new Error('Invalid given value (' + alpha + '), has to be between 0 and 1');
		}
		alpha = (1 - Math.cos(alpha * Math.PI)) * 0.5;
		return min + (max - min) * alpha;
	}

	/**
	 * @param min Minimum target float value.
	 * @param max Maximum target float value.
	 * @param alpha Float value between 0 and 1.
	 * @param sampleA First sampling point.
	 * @param sampleB Second sampling point.
	 * @returns Cubic interpolated value between min and max based on given alpha and sampling points.
	 */
	export function interpolateCubic(min: number, max: number, alpha: number, sampleA: number, sampleB: number): number
	{
	if (alpha < 0 || alpha > 1)
	{
		throw new Error('Invalid given value (' + alpha + '), has to be between 0 and 1');
	}
	let f = (sampleB - max) - (sampleA - min);
	return f * Math.pow(alpha, 3) + ((sampleA - min) - f) * Math.pow(alpha, 2) + (max - min) * alpha + min;
	}

	/**
	 * Throws an exception if the absolute of this value is smaller than given epsilon, else returns the value.
	 */
	export function divByZeroProt(value: number, epsilon = 0.0000001): number
	{
		if (Math.abs(value) <= epsilon)
		{
			throw new Error('Invalid divisor value (' + value + ')');
		}
		return value;
	}

	/**
	 * @param min Minimum target number.
	 * @param max Maximum target number.
	 * @param value Source number.
	 * @returns Clipped number between min and max.
	 */
	export function clip(value: number, min: number, max: number): number
	{
		return Math.max(min, Math.min(value, max));
	}

	/**
	 * @param pos Target position [x, y].
	 * @returns True if given pos is inside given rect coordinates.
	 */
	export function isInRect(pos: number[], minX: number, minY: number, maxX: number, maxY: number): boolean
	{
		return !(pos[0] < minX || pos[1] < minY || pos[0] >= maxX || pos[1] >= maxY)
	}
}