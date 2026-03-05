import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft, CheckCircle2, ChevronRight, ShoppingCart } from 'lucide-react';
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getColorForIntensity } from '../utils/mockData';

export default function PurchaseForm() {
    const { setAppMode, quoteResult } = useAppContext();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (!quoteResult) return null;

    if (isSubmitted) {
        return (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--bg-dark)', zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px' }}>
                    <CheckCircle2 size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>購入依頼を受け付けました</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        ご依頼内容を確認の上、担当者より1〜2営業日以内にご連絡いたします。また、ご登録のメールアドレスに受付完了メールを送信しました。
                    </p>
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setAppMode('explore')}>
                        地図に戻る
                    </button>
                </div>
            </div>
        );
    }

    // Prepare active options strings
    const activeOptions = [];
    if (quoteResult.conditions.attrs?.age) activeOptions.push('年代別');
    if (quoteResult.conditions.attrs?.gender) activeOptions.push('性別');
    if (quoteResult.conditions.attrs?.residence) activeOptions.push('居住地別');

    return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f3f4f6', zIndex: 700, display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setAppMode('quote-build')}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>データ購入依頼</h2>
                </div>
                <button className="btn btn-outline" onClick={() => setAppMode('explore')}>
                    マップへ戻る
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '3rem 2rem', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', gap: '3rem' }}>

                    {/* Form (Left) */}
                    <div style={{ flex: '1.5' }}>
                        <form onSubmit={handleSubmit} className="panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>お客様情報</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>会社名 <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>必須</span></label>
                                <input type="text" required placeholder="株式会社〇〇" className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', justifyContent: 'flex-start', padding: '0.75rem' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>氏名 <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>必須</span></label>
                                <input type="text" required placeholder="山田 太郎" className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', justifyContent: 'flex-start', padding: '0.75rem' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>メールアドレス <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>必須</span></label>
                                <input type="email" required placeholder="taro.yamada@example.com" className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', justifyContent: 'flex-start', padding: '0.75rem' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>電話番号 <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>必須</span></label>
                                <input type="tel" required placeholder="03-0000-0000" className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white', justifyContent: 'flex-start', padding: '0.75rem' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>利用目的 <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>必須</span></label>
                                <textarea required rows={4} placeholder="データの利用目的をご記入ください（例：新規オフィスビルの需要予測のため）" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }} />
                            </div>
                        </form>
                    </div>

                    {/* Summary (Right) */}
                    <div style={{ flex: '1' }}>
                        <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '0' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>ご依頼内容の確認</h3>

                            {/* Mini Map Receipt */}
                            {quoteResult.conditions.mapCenter && (
                                <div style={{ height: '220px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: '#e5e7eb' }}>
                                    <MapContainer
                                        center={quoteResult.conditions.mapCenter}
                                        zoom={10}
                                        style={{ height: '100%', width: '100%' }}
                                        zoomControl={false}
                                        dragging={false}
                                        scrollWheelZoom={false}
                                        doubleClickZoom={false}
                                        touchZoom={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                        />
                                        {quoteResult.conditions.meshes?.map((mesh) => (
                                            <Rectangle
                                                key={`receipt-${mesh.id}`}
                                                bounds={mesh.bounds}
                                                pathOptions={{
                                                    color: '#2563eb',
                                                    weight: 1,
                                                    fillColor: getColorForIntensity(mesh.intensity.total),
                                                    fillOpacity: 0.8
                                                }}
                                            />
                                        ))}
                                    </MapContainer>
                                </div>
                            )}

                            <div style={{ backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>見積番号</span>
                                    <span style={{ fontWeight: '600' }}>{quoteResult.quoteNumber}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>対象メッシュ</span>
                                    <span style={{ fontWeight: '600' }}>{quoteResult.conditions.meshCount}件</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>期間</span>
                                    <span style={{ fontWeight: '600' }}>{quoteResult.conditions.monthCount}ヶ月</span>
                                </div>
                                {activeOptions.length > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>追加オプション</span>
                                        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{activeOptions.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>合計金額（税抜）</span>
                                    <span style={{ fontSize: '2rem', fontWeight: '800' }}>¥{quoteResult.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{ padding: '1rem', fontSize: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                                onClick={() => document.querySelector('form').requestSubmit()}
                            >
                                <ShoppingCart size={20} /> 購入を依頼する
                            </button>

                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                ※ クリックしても決済は発生しません。担当者が内容を確認後、正式な契約手続きへと進みます。
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
