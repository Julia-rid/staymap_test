export function generateMockMeshes(centerLat, centerLng, sizeInKm, countX, countY, prefectureId) {
    const meshes = [];
    // 1 degree latitude is approx 111km
    const latDegreeKm = 111;
    const lngDegreeKm = 111 * Math.cos((centerLat * Math.PI) / 180);

    const latStep = sizeInKm / latDegreeKm;
    const lngStep = sizeInKm / lngDegreeKm;

    const startLat = centerLat - (countY / 2) * latStep;
    const startLng = centerLng - (countX / 2) * lngStep;

    // Use the prefecture ID to deterministically vary data
    const seedMultiplier = parseInt(prefectureId) || 12;

    for (let i = 0; i < countX; i++) {
        for (let j = 0; j < countY; j++) {
            const lat = startLat + j * latStep;
            const lng = startLng + i * lngStep;

            const distFromCenter = Math.sqrt(
                Math.pow((i - countX / 2), 2) + Math.pow((j - countY / 2), 2)
            );

            // Realistic dropoff (Gaussian-like) from the center station
            const peakRadius = (countX / 4);
            let baseVal = 1000 * Math.exp(-(distFromCenter * distFromCenter) / (peakRadius * peakRadius));

            // Add slight organic noise
            const noise = (Math.sin(lat * 12345 + lng * 67890 + seedMultiplier) + 1) / 2;
            baseVal = baseVal * (0.7 + 0.6 * noise);

            const multiplier = sizeInKm === 5 ? 10 : 1;
            const basePopulation = Math.floor(Math.max(10, baseVal * multiplier));

            // Calculate V3 new mock demographic breakdowns
            const popMale = Math.floor(basePopulation * (0.45 + noise * 0.1)); // 45-55%
            const popFemale = basePopulation - popMale;

            const age10s = Math.floor(basePopulation * 0.1);
            const age20s = Math.floor(basePopulation * (0.15 + noise * 0.1));
            const age30s = Math.floor(basePopulation * 0.2);
            const age40s = Math.floor(basePopulation * 0.2);
            const age50s = Math.floor(basePopulation * 0.15);
            const age60sPlus = basePopulation - (age10s + age20s + age30s + age40s + age50s);

            const getIntensity = (val, thresholds) => {
                if (val > thresholds[0]) return 'high';
                if (val > thresholds[1]) return 'med';
                return 'low';
            };

            meshes.push({
                id: `mesh-${prefectureId}-${sizeInKm}-${i}-${j}`, // Unique per pref
                lat: lat,
                lng: lng,
                bounds: [
                    [lat, lng],
                    [lat + latStep, lng + lngStep]
                ],
                data: {
                    total: basePopulation,
                    gender: { male: popMale, female: popFemale },
                    age: { '10s': age10s, '20s': age20s, '30s': age30s, '40s': age40s, '50s': age50s, '60s_plus': age60sPlus }
                },
                intensity: {
                    total: getIntensity(basePopulation, [500 * multiplier, 150 * multiplier])
                }
            });
        }
    }

    return meshes;
}

export function getColorForIntensity(intensityStr) {
    // Brand colors: Yellow -> Red -> Purple
    switch (intensityStr) {
        case 'high': return 'var(--heat-high)'; // Purple
        case 'med': return 'var(--heat-med)';   // Red
        case 'low': return 'var(--heat-low)';   // Yellow
        default: return 'transparent';
    }
}
