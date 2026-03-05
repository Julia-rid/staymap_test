import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export default function MeshInfoPanel() {
    const {
        focusedMeshId, setFocusedMeshId,
        appMode, setAppMode, setSelectedMeshes
    } = useAppContext();

    const [isCollapsed, setIsCollapsed] = useState(false);

    // 1. 24-hour Line Chart (0-100%)
    const hourlyData = useMemo(() => {
        if (!focusedMeshId) return [];
        const base = focusedMeshId.data.total;

        // Generate pseudo-random 24h distribution based on mesh total population
        const data = [];
        for (let i = 0; i < 24; i++) {
            // Create a wave pattern (e.g. peaks at commute hours 8 and 18)
            let val = 10 + 20 * Math.sin(Math.PI * (i - 8) / 12) + 20 * Math.sin(Math.PI * (i - 18) / 12);

            // Add some noise based on data total to keep it pseudo-random but deterministic per mesh
            const noise = ((base * (i + 1)) % 25);
            val = Math.max(0, Math.min(100, val + noise));

            data.push({
                name: `${i}時`,
                val: Math.floor(val)
            });
        }
        return data;
    }, [focusedMeshId]);

    // 2. Gender Ratio Stacked Bar
    const genderData = useMemo(() => {
        if (!focusedMeshId) return [];
        const { male, female } = focusedMeshId.data.gender;
        const total = male + female;
        return [{
            name: '性別',
            男性: Math.round((male / total) * 100),
            女性: Math.round((female / total) * 100)
        }];
    }, [focusedMeshId]);

    // 3. Age Ratio Stacked Bar
    const ageData = useMemo(() => {
        if (!focusedMeshId) return [];
        const age = focusedMeshId.data.age;
        const total = age['10s'] + age['20s'] + age['30s'] + age['40s'] + age['50s'] + age['60s_plus'];
        return [{
            name: '年代',
            '10代': Math.round((age['10s'] / total) * 100),
            '20代': Math.round((age['20s'] / total) * 100),
            '30代': Math.round((age['30s'] / total) * 100),
            '40代': Math.round((age['40s'] / total) * 100),
            '50代': Math.round((age['50s'] / total) * 100),
            '60代+': Math.round((age['60s_plus'] / total) * 100)
        }];
    }, [focusedMeshId]);

    if (!focusedMeshId) return null;

    const handleCreateQuote = () => {
        // When Quote Builder is opened from Explore, default behavior will auto-select all meshes
        // based on the AppContext effect we added.
        setAppMode('quote-build');
    };

    const isQuoteMode = appMode === 'quote-build';

    return (
        <div className="panel" style={{
            position: 'absolute',
            right: isQuoteMode ? 'auto' : 0,
            left: isQuoteMode ? 0 : 'auto',
            top: 0,
            bottom: isCollapsed ? 'auto' : 0,
            width: '420px',
            zIndex: 'var(--z-overlay)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-panel)',
            borderRight: isQuoteMode ? '1px solid var(--border)' : 'none',
            borderLeft: !isQuoteMode ? '1px solid var(--border)' : 'none',
            boxShadow: isQuoteMode ? '4px 0 15px rgba(0,0,0,0.1)' : '-4px 0 15px rgba(0,0,0,0.1)',
        }}>
            {/* Header */}
            <div style={{ padding: '1.25rem', borderBottom: isCollapsed ? 'none' : '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>メッシュ滞在人口推計</h3>
                    {!isCollapsed && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>※お見積りは1時間/1日/週/月単位で対応可能です</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="btn"
                        style={{ padding: '0.25rem' }}
                    >
                        {isCollapsed ? <ChevronDown size={20} color="var(--text-muted)" /> : <ChevronUp size={20} color="var(--text-muted)" />}
                    </button>
                    <button
                        onClick={() => setFocusedMeshId(null)}
                        className="btn"
                        style={{ padding: '0.25rem' }}
                    >
                        <X size={20} color="var(--text-muted)" />
                    </button>
                </div>
            </div>

            {/* Collapsible Content */}
            {!isCollapsed && (
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', minHeight: 0, flex: 1 }}>

                    {/* 24h Line Chart */}
                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>時間帯別 平均移動割合 (24h)</h4>
                        <div style={{ height: '220px', width: '100%', marginLeft: '-20px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={hourlyData}>
                                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                                    <YAxis domain={[0, 100]} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip formatter={(value) => `${value}%`} />
                                    <Line type="monotone" dataKey="val" stroke="var(--primary)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Demographics Area */}
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            属性別割合
                        </p>

                        {/* Gender Stacked Bar */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>性別</h5>
                            <div style={{ height: '60px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={genderData} layout="vertical" barSize={20} stackOffset="expand">
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" hide />
                                        <Tooltip formatter={(value) => `${value}%`} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                        <Bar dataKey="男性" stackId="a" fill="#3b82f6" />
                                        <Bar dataKey="女性" stackId="a" fill="#ef4444" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Age Stacked Bar */}
                        <div>
                            <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>年代別</h5>
                            <div style={{ height: '80px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageData} layout="vertical" barSize={20} stackOffset="expand">
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" hide />
                                        <Tooltip formatter={(value) => `${value}%`} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
                                        <Bar dataKey="10代" stackId="a" fill="#fcd34d" />
                                        <Bar dataKey="20代" stackId="a" fill="#f59e0b" />
                                        <Bar dataKey="30代" stackId="a" fill="#d97706" />
                                        <Bar dataKey="40代" stackId="a" fill="#10b981" />
                                        <Bar dataKey="50代" stackId="a" fill="#059669" />
                                        <Bar dataKey="60代+" stackId="a" fill="#8b5cf6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer CTA - Hide if in quote mode already */}
            {!isQuoteMode && !isCollapsed && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-panel-hover)', borderBottomLeftRadius: 'inherit', borderBottomRightRadius: 'inherit', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', textAlign: 'center', marginBottom: '1rem' }}>
                        より広域なエリアでの詳細な見積を作成
                    </p>
                    <button
                        onClick={handleCreateQuote}
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '1.125rem', padding: '1rem', fontWeight: 'bold' }}
                    >
                        見積を作成
                    </button>
                </div>
            )}
        </div>
    );
}
