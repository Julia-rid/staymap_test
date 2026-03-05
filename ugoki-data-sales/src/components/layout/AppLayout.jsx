import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Users, ExternalLink, ChevronDown } from 'lucide-react';
import { useAppContext, regions } from '../../store/AppContext';

export default function AppLayout() {
    const { activePrefecture, setActivePrefecture, setMapCenter, setMapZoom, setFocusedMeshId, setAppMode } = useAppContext();
    const [activeRegionMenu, setActiveRegionMenu] = useState(null);

    const handlePrefectureSelect = (pref) => {
        setActivePrefecture(pref);
        setMapCenter(pref.center);
        setMapZoom(10);
        setFocusedMeshId(null);
        setAppMode('explore');
        setActiveRegionMenu(null); // close dropdown
    };

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)', overflow: 'hidden' }}>

            {/* Top Header */}
            <header style={{
                position: 'relative',
                height: '60px',
                backgroundColor: 'var(--bg-panel)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                zIndex: 1100,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', color: 'var(--primary)' }}>
                        <Users size={24} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                        UgokiData Market
                    </span>
                </div>

                {/* Action Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a href="https://www.pacific.co.jp/digital_services/ugoki_toukei/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        全国うごき統計とは？ <ExternalLink size={14} />
                    </a>
                    <a href="https://ugokimap.jp/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', textDecoration: 'none' }}>
                        全国うごき統計を体験する <ExternalLink size={14} />
                    </a>
                    <a href="https://www.pacific.co.jp/inquiry/jinryu/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                        お問い合わせ <ExternalLink size={14} />
                    </a>
                </div>
            </header>

            {/* Region Sub-Header */}
            <div style={{
                position: 'relative',
                height: '48px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1.5rem',
                gap: '1.5rem',
                zIndex: 1050,
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>エリア選択</span>

                <div style={{ display: 'flex', gap: '0.5rem', height: '100%', alignItems: 'center' }}>
                    {regions.map(region => (
                        <div key={region.id} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                            <button
                                onClick={() => setActiveRegionMenu(activeRegionMenu === region.id ? null : region.id)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                                    padding: '0.5rem 0.75rem', fontSize: '0.875rem',
                                    fontWeight: activePrefecture && region.prefectures.find(p => p.id === activePrefecture.id) ? 'bold' : 'normal',
                                    color: activePrefecture && region.prefectures.find(p => p.id === activePrefecture.id) ? 'var(--primary)' : 'var(--text-main)',
                                    borderRadius: '4px'
                                }}
                            >
                                {region.name} <ChevronDown size={14} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeRegionMenu === region.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: '48px',
                                    left: 0,
                                    backgroundColor: 'white',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.25rem',
                                    padding: '0.75rem',
                                    minWidth: '240px',
                                    zIndex: 1000
                                }}>
                                    {region.prefectures.map(pref => (
                                        <button
                                            key={pref.id}
                                            onClick={() => handlePrefectureSelect(pref)}
                                            style={{
                                                background: activePrefecture?.id === pref.id ? '#eff6ff' : 'transparent',
                                                border: 'none',
                                                padding: '0.5rem',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                color: activePrefecture?.id === pref.id ? 'var(--primary)' : 'var(--text-main)',
                                                fontWeight: activePrefecture?.id === pref.id ? 'bold' : 'normal',
                                            }}
                                        >
                                            {pref.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                        現在表示中: {activePrefecture?.name}
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            <main style={{ flex: 1, position: 'relative' }}>
                <Outlet />
            </main>
        </div>
    );
}
