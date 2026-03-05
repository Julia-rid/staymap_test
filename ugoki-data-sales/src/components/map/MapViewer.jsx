import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from '../../store/AppContext';
import { generateMockMeshes, getColorForIntensity } from '../../utils/mockData';

function MapEvents({ onZoomEnd }) {
    const map = useMapEvents({
        zoomend: () => {
            onZoomEnd(map.getZoom(), map.getCenter());
        }
    });
    return null;
}

function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || map.getZoom(), { duration: 1.5 });
        }
    }, [center, map, zoom]);
    return null;
}

export default function MapViewer() {
    const {
        setMapZoom,
        activePrefecture,
        activeMeshSize, setActiveMeshSize,
        focusedMeshId, setFocusedMeshId,
        appMode,
        selectedMeshes, setSelectedMeshes,
        useManualMeshSelection
    } = useAppContext();

    const [meshes5km, setMeshes5km] = useState([]);
    const [meshes500m, setMeshes500m] = useState([]);

    useEffect(() => {
        // Generate data around the active prefecture's center
        const center = activePrefecture.center;
        const prefId = activePrefecture.id;
        setMeshes5km(generateMockMeshes(center[0], center[1], 5, 20, 20, prefId));
        setMeshes500m(generateMockMeshes(center[0], center[1], 0.5, 40, 40, prefId));
    }, [activePrefecture]);

    const handleZoomEnd = (newZoom) => {
        setMapZoom(newZoom);
        const threshold = 11;
        if (newZoom >= threshold && activeMeshSize !== '500m') setActiveMeshSize('500m');
        else if (newZoom < threshold && activeMeshSize !== '5km') setActiveMeshSize('5km');
    };

    const activeMeshes = activeMeshSize === '500m' ? meshes500m : meshes5km;

    // Auto-select all meshes when entering quote-build and auto mode is on
    useEffect(() => {
        if (appMode === 'quote-build' && !useManualMeshSelection) {
            setSelectedMeshes(activeMeshes);
        } else if (appMode === 'quote-build' && useManualMeshSelection && selectedMeshes.length === activeMeshes.length) {
            // Just switched to manual, clear the auto-populated full list
            setSelectedMeshes([]);
        }
    }, [appMode, useManualMeshSelection, activeMeshes, setSelectedMeshes]);

    const handleMeshClick = (mesh) => {
        if (appMode === 'explore') {
            setFocusedMeshId(mesh);
        } else if (appMode === 'quote-build') {
            if (!useManualMeshSelection) return; // Prevent clicking if in auto-select entire prefecture mode

            // Set focus so the info panel updates with the clicked mesh's charts
            setFocusedMeshId(mesh);

            setSelectedMeshes(prev => {
                const isSelected = prev.find(m => m.id === mesh.id);
                if (isSelected) {
                    return prev.filter(m => m.id !== mesh.id); // Deselect
                } else {
                    return [...prev, mesh]; // Select
                }
            });
        }
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'absolute', inset: 0, zIndex: 0 }}>
            <MapContainer
                center={activePrefecture.center}
                zoom={10}
                style={{ height: '100%', width: '100%', backgroundColor: 'var(--bg-dark)' }}
                zoomControl={false}
            >
                <ZoomControl position="bottomright" />
                {/* Light Map Tiles instead of dark */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <MapEvents onZoomEnd={handleZoomEnd} />
                <MapController center={activePrefecture.center} zoom={10} />

                {activeMeshes.map((mesh) => {
                    let meshColor = getColorForIntensity(mesh.intensity.total);
                    let strokeColor = meshColor;
                    let weight = 1;
                    let fillOpacity = 0.5;
                    let zIndexOffset = 0;

                    // Highlight selection in quote-build mode
                    const isSelected = selectedMeshes.some(m => m.id === mesh.id);
                    if (appMode === 'quote-build' && isSelected) {
                        strokeColor = '#2563eb'; // blue boundary for selected
                        weight = 2;
                        fillOpacity = 0.7;
                    } else if (appMode === 'quote-build' && selectedMeshes.length > 0) {
                        // Dim unselected meshes
                        fillOpacity = 0.1;
                        strokeColor = 'transparent';
                    }

                    // Active Click Focus in Explore Mode
                    if (appMode === 'explore' && focusedMeshId?.id === mesh.id) {
                        strokeColor = '#2563eb'; // Deep blue active border
                        weight = 4;
                        fillOpacity = 0.8;
                    }

                    return (
                        <Rectangle
                            key={mesh.id}
                            bounds={mesh.bounds}
                            pathOptions={{
                                color: strokeColor,
                                weight: weight,
                                fillColor: meshColor,
                                fillOpacity: fillOpacity
                            }}
                            eventHandlers={{ click: () => handleMeshClick(mesh) }}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
}
