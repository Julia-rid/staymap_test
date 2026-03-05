import React, { useMemo, useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function QuoteBuilder() {
    const {
        setAppMode,
        activePrefecture,
        selectedMeshes,
        useManualMeshSelection, setUseManualMeshSelection,
        quotePeriod, setQuotePeriod,
        quoteAttributes, setQuoteAttributes,
        setQuoteResult
    } = useAppContext();

    const [isCollapsed, setIsCollapsed] = useState(false);

    const meshCount = selectedMeshes.length || 0;
    const basePricePerMesh = 1000;

    // Calculate duration multiplier based on granularity & dates (naive estimation for mockup)
    const durationMultiplier = useMemo(() => {
        const starts = new Date(quotePeriod.startDate);
        const ends = new Date(quotePeriod.endDate);
        let months = (ends.getFullYear() - starts.getFullYear()) * 12 + (ends.getMonth() - starts.getMonth()) + 1;
        if (isNaN(months) || months <= 0) months = 1;

        if (quotePeriod.granularity === 'month') return months;
        if (quotePeriod.granularity === 'week') return months * 4;
        if (quotePeriod.granularity === 'day') return months * 30; // abstract scale
        if (quotePeriod.hourlyOption) return months * 30 * 1.5; // Premium scaling for hourly option

        return months;
    }, [quotePeriod]);

    const totalPrice = useMemo(() => {
        let cost = meshCount * basePricePerMesh;

        // Base multipliers for options
        if (quoteAttributes.age) cost *= 1.20;       // +20%
        if (quoteAttributes.gender) cost *= 1.20;    // +20%
        if (quoteAttributes.residence) cost *= 1.30; // +30%

        cost *= durationMultiplier;

        // Volume discount for whole prefecture purchase (manual selection is OFF)
        if (!useManualMeshSelection) {
            cost *= 0.90; // 10% discount
        }

        return Math.floor(cost);
    }, [meshCount, durationMultiplier, quoteAttributes, useManualMeshSelection]);

    const handleGenerateQuote = () => {
        // Generate the record, but skip 'quote-result' and send straight to 'purchase-form'
        setQuoteResult({
            quoteNumber: `QT-${Math.floor(Math.random() * 1000000)}`,
            date: new Date().toLocaleDateString('ja-JP'),
            totalPrice: totalPrice,
            conditions: {
                meshCount,
                durationMultiplier,
                monthCount: durationMultiplier, // Display approx
                granularity: quotePeriod.granularity,
                attrs: quoteAttributes,
                meshes: selectedMeshes,
                mapCenter: activePrefecture.center
            }
        });
        setAppMode('purchase-form');
    };

    const handlePeriodChange = (e) => setQuotePeriod(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleOptionToggle = (key) => setQuoteAttributes(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div style={{
            position: 'absolute', right: 0, top: 0, bottom: isCollapsed ? 'auto' : 0,
            width: '450px', backgroundColor: 'var(--bg-panel)',
            zIndex: 1000, display: 'flex', flexDirection: 'column',
            boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
            borderLeft: '1px solid var(--border)',
        }}>
            {/* Header Bar */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: isCollapsed ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-panel-hover)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem', backgroundColor: 'white' }} onClick={() => setAppMode('explore')}>
                        <ArrowLeft size={18} />
                    </button>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '700' }}>お見積り条件設定</h2>
                </div>
                <button className="btn" style={{ padding: '0.4rem' }} onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronDown size={20} color="var(--text-muted)" /> : <ChevronUp size={20} color="var(--text-muted)" />}
                </button>
            </div>

            {/* Collapsible Content */}
            {!isCollapsed && (
                <>
                    {/* Scrollable Form */}
                    <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', minHeight: 0 }}>

                        {/* Mesh Selection Mode */}
                        <div style={{ backgroundColor: useManualMeshSelection ? 'white' : '#f0f9ff', padding: '1rem', borderRadius: 'var(--radius-md)', border: useManualMeshSelection ? '1px solid var(--border)' : '1px solid #bae6fd' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={useManualMeshSelection}
                                    onChange={(e) => setUseManualMeshSelection(e.target.checked)}
                                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                                />
                                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>500mメッシュごとに選択する</span>
                            </label>

                            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem' }}>
                                対象メッシュ: {meshCount} 件
                            </p>
                            {!useManualMeshSelection ? (
                                <p style={{ fontSize: '0.75rem', color: '#0ea5e9', marginTop: '0.25rem' }}>
                                    ※{activePrefecture.name}の全メッシュを選択中 (<strong>10%のボリュームディスカウント適用</strong>)
                                </p>
                            ) : (
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    ※地図上でクリックして追加/解除してください
                                </p>
                            )}
                        </div>

                        {/* 取得期間 (Time Period - Indexed Form) */}
                        <div>
                            <h3 style={{ fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '1rem' }}>取得期間</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                {/* 1. Date */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>1. 対象期間</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input type="date" name="startDate" value={quotePeriod.startDate} onChange={handlePeriodChange} className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} />
                                        <span style={{ color: 'var(--text-muted)' }}>〜</span>
                                        <input type="date" name="endDate" value={quotePeriod.endDate} onChange={handlePeriodChange} className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} />
                                    </div>
                                </div>

                                {/* 2. Time Range */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>2. 対象時間帯</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input type="time" name="startTime" value={quotePeriod.startTime} onChange={handlePeriodChange} className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} />
                                        <span style={{ color: 'var(--text-muted)' }}>〜</span>
                                        <input type="time" name="endTime" value={quotePeriod.endTime} onChange={handlePeriodChange} className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} />
                                    </div>
                                </div>

                                {/* 3. Granularity */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>3. 時間粒度</label>
                                    <select
                                        name="granularity"
                                        value={quotePeriod.granularity}
                                        onChange={handlePeriodChange}
                                        className="btn"
                                        style={{ border: '1px solid var(--border)', backgroundColor: 'white', display: 'block', width: '100%', textAlign: 'left', fontSize: '0.875rem' }}
                                    >
                                        <option value="day">日単位</option>
                                        <option value="week">週単位</option>
                                        <option value="month">月単位</option>
                                    </select>
                                </div>

                                {/* 4. Day Distinction */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>4. 平日/休日の区別</label>
                                    <select
                                        name="dayType"
                                        value={quotePeriod.dayType}
                                        onChange={handlePeriodChange}
                                        className="btn"
                                        style={{ border: '1px solid var(--border)', backgroundColor: 'white', display: 'block', width: '100%', textAlign: 'left', fontSize: '0.875rem' }}
                                    >
                                        <option value="weekday">平日のみ</option>
                                        <option value="weekend">休日のみ</option>
                                        <option value="all">区別しない</option>
                                    </select>
                                </div>

                                {/* 5. Hourly Option */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>5. 時間オプション</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', height: '36px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                            <input type="radio" name="hourlyOption" checked={quotePeriod.hourlyOption === true} onChange={() => setQuotePeriod(prev => ({ ...prev, hourlyOption: true }))} style={{ accentColor: 'var(--primary)' }} />
                                            有（1時間単位）
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                            <input type="radio" name="hourlyOption" checked={quotePeriod.hourlyOption === false} onChange={() => setQuotePeriod(prev => ({ ...prev, hourlyOption: false }))} style={{ accentColor: 'var(--primary)' }} />
                                            無
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* オプション追加 (Variables Form) */}
                        <div>
                            <h3 style={{ fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '1rem' }}>オプション追加</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={quoteAttributes.age} onChange={() => handleOptionToggle('age')} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }} />
                                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>年代別 (10代〜60代以上)</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={quoteAttributes.gender} onChange={() => handleOptionToggle('gender')} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }} />
                                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>性別 (男性/女性)</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={quoteAttributes.residence} onChange={() => handleOptionToggle('residence')} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }} />
                                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>居住地別</span>
                                </label>

                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Price Calculator Footer */}
            {!isCollapsed && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: '#fff', boxShadow: '0 -4px 6px -1px rgb(0 0 0 / 0.05)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>概算合計（税抜）</span>
                        <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em', lineHeight: 1 }}>
                            ¥{totalPrice.toLocaleString()}
                        </span>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }} onClick={handleGenerateQuote} disabled={meshCount === 0}>
                        <CheckCircle2 size={20} /> 正式な見積を依頼する
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>※クリック後、直接注文フォームへ遷移します</p>
                </div>
            )}

        </div>
    );
}
