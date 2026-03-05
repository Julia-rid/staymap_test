import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Play } from 'lucide-react';

export default function TimeSlider() {
    const months = [
        '2026年1月', '2026年2月', '2026年3月', '2026年4月',
        '2026年5月', '2026年6月', '2026年7月', '2026年8月',
        '2026年9月', '2026年10月', '2026年11月', '2026年12月'
    ];

    return (
        <div style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 'var(--z-overlay)',
            width: '800px',
            maxWidth: '90vw',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            {/* Instruction Toast */}
            <div style={{ alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.4rem 1rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '500', backdropFilter: 'blur(4px)' }}>
                ※お見積りは 1時間 / 1日 / 1か月 単位で取得できます
            </div>

            {/* Main Slider Panel */}
            <div className="panel" style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <button className="btn btn-outline" style={{ borderRadius: '50%', padding: '0.75rem', width: '40px', height: '40px' }}>
                    <Play size={16} fill="currentColor" />
                </button>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                        <span>2026年1月</span>
                        <span>2026年12月</span>
                    </div>

                    <div style={{ position: 'relative', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px' }}>
                        <div style={{ position: 'absolute', left: 0, width: '8.33%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                        <div style={{ position: 'absolute', left: '8.33%', top: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', backgroundColor: 'white', border: '2px solid var(--primary)', borderRadius: '50%', cursor: 'grab', boxShadow: 'var(--shadow-sm)' }}></div>
                    </div>

                    <div style={{ textAlign: 'center', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        2026年1月
                    </div>
                </div>
            </div>
        </div>
    );
}
