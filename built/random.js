// --------------------
// Functional code
// --------------------
var Random;
(function (Random) {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function smoothNoise(baseNoise, interpolation, octave) {
        // Check interpolation method:
        if (interpolation != 'Linear' && interpolation != 'Cosine') {
            throw new Error('Invalid interpolation method');
        }
        // Create smooth noise map:
        const width = baseNoise.sizeX;
        const height = baseNoise.sizeY;
        const smoothNoise = new Array2D(width, height);
        const samplePeriod = Math.pow(2, octave);
        const sampleFrequency = 1. / samplePeriod;
        for (let i = 0; i < width; i++) {
            // Calculate the horizontal sampling indices:
            const horizontalSampleA = Math.trunc(i / samplePeriod) * samplePeriod;
            const horizontalSampleB = Math.trunc((horizontalSampleA + samplePeriod) % width); // Wrap around
            let horizontalBlend = (i - horizontalSampleA) * sampleFrequency;
            if (interpolation == 'Cosine') {
                horizontalBlend = (1 - Math.cos(horizontalBlend * Math.PI)) * 0.5;
            }
            for (let j = 0; j < height; j++) {
                // Calculate the vertical sampling indices:
                const verticalSampleA = Math.trunc(j / samplePeriod) * samplePeriod;
                const verticalSampleB = Math.trunc((verticalSampleA + samplePeriod) % height); // Wrap around
                let verticalBlend = (j - verticalSampleA) * sampleFrequency;
                if (interpolation == 'Cosine') {
                    verticalBlend = (1 - Math.cos(verticalBlend * Math.PI)) * 0.5;
                }
                // Blend the top two corners:
                const top = Utilities.interpolateLinear(baseNoise.get(horizontalSampleA, verticalSampleA), baseNoise.get(horizontalSampleB, verticalSampleA), horizontalBlend);
                // Blend the bottom two corners:
                const bottom = Utilities.interpolateLinear(baseNoise.get(horizontalSampleA, verticalSampleB), baseNoise.get(horizontalSampleB, verticalSampleB), horizontalBlend);
                // Final blend:
                smoothNoise.set(i, j, Utilities.interpolateLinear(top, bottom, verticalBlend));
            }
        }
        return smoothNoise;
    }
    /** Generates random noise map of given size (width, height) with values between 0 and 1. */
    function generateRandomNoise(width, height) {
        const baseNoise = new Array2D(width, height);
        // Create base noise map:
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                baseNoise.set(i, j, Math.random());
            }
        }
        return baseNoise;
    }
    /**
     * Generates perlin noise map of given size (width, height) with values between 0 and 1.
     * High octave counts gernerate maps with bigger plateaus. Values below 2 will return an unsmoothed random noise map.
     * Persistance defines the smoothness of the map. Low values towards 0 give very smooth maps.
     * Available interpolations: Linear, Cosine
     * Available distributions: Default = "Bell shaped", Slope = "Half bell shaped, peak at 0", Uniform = "Evenly distributed, no peak"
     */
    function generatePerlinNoise(width, height, octaveCount, persistance = .5, interpolation = "Linear", distribution = "Default") {
        let perlinNoise;
        if (octaveCount > 1) {
            const baseNoise = generateRandomNoise(width, height);
            let amplitude = 1.;
            let totalAmplitude = 0.;
            // Blend noise together:
            perlinNoise = new Array2D(width, height);
            for (let octave = octaveCount - 1; octave >= 0; octave--) {
                const smoothedNoise = smoothNoise(baseNoise, interpolation, octave);
                amplitude *= persistance;
                totalAmplitude += amplitude;
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        if (octave == octaveCount - 1) {
                            perlinNoise.set(i, j, smoothedNoise.get(i, j) * amplitude);
                        }
                        else {
                            perlinNoise.set(i, j, perlinNoise.get(i, j) + smoothedNoise.get(i, j) * amplitude);
                        }
                    }
                }
            }
            // Normalisation:
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    perlinNoise.set(i, j, perlinNoise.get(i, j) / totalAmplitude);
                }
            }
        }
        else {
            perlinNoise = generateRandomNoise(width, height);
        }
        // Postprocessing:
        if (distribution == 'Default') // Standard bell shaped curve
         {
            return perlinNoise;
        }
        else if (distribution == 'Slope') // Half bell shaped curve with peak at 0
         {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    perlinNoise.set(i, j, Math.abs(perlinNoise.get(i, j) * 2 - 1));
                }
            }
        }
        else if (distribution == 'Uniform') // Horizontal curve with no peak
         {
            if (Math.trunc(width % 2) != 0) {
                throw new Error('width (=' + width + ') has to be even for Uniform distribution');
            }
            for (let i = 0; i < Math.trunc(width / 2); i++) {
                for (let j = 0; j < height; j++) {
                    // Reverse Box–Muller transformation:
                    const z1 = perlinNoise.get(i, j);
                    const z2 = perlinNoise.get(width - 1 - i, j);
                    perlinNoise.set(i, j, Math.exp(-0.5 * (z1 * z1 + z2 * z2)));
                    const acosInput = z1 / Utilities.divByZeroProt(z1 * z1 + z2 * z2);
                    if (Math.abs(acosInput) > 1) {
                        throw new Error('Acos only allows numbers between -1 and 1');
                    }
                    perlinNoise.set(width - 1 - i, j, Math.acos(acosInput) / (2 * Math.PI));
                }
            }
        }
        else {
            throw new Error('Invalid distribution method');
        }
        return perlinNoise;
    }
    Random.generatePerlinNoise = generatePerlinNoise;
})(Random || (Random = {}));
