import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Download, CreditCard, FileText } from 'lucide-react';

export default function QuoteResult() {
    const { setAppMode, quoteResult } = useAppContext();

    if (!quoteResult) return null;

    return (
        <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: '#f3f4f6', zIndex: 600,
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            padding: '4rem 2rem', overflowY: 'auto'
        }}>

            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Success Header */}
                <div style={{ textAlign: 'center', position: 'relative' }}>
                    <button
                        onClick={() => setAppMode('explore')}
                        className="btn btn-outline"
                        style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'white', padding: '0.5rem 1rem' }}
                    >
                        マップへ戻る
                    </button>
                    <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '50%', color: '#16a34a', marginBottom: '1rem' }}>
                        <FileText size={32} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>見積書が作成されました</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>ご入力いただいた条件にて概算見積書を発行しました。</p>
                </div>

                {/* PDF Mockup Area */}
                <div className="panel" style={{ padding: '4rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '600px', position: 'relative' }}>

                    {/* PDF Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--text-main)', paddingBottom: '1rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '400', letterSpacing: '0.1em' }}>御見積書</h1>
                        <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                            <p>見積番号: <span style={{ fontWeight: '600' }}>{quoteResult.quoteNumber}</span></p>
                            <p>発行日: {quoteResult.date}</p>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <div style={{ fontSize: '1.125rem' }}>
                            <p style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', width: '250px' }}>御中</p>
                        </div>
                        <div style={{ fontSize: '0.875rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                            <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>株式会社UgokiData Marketing</p>
                            <p>〒100-0005<br />東京都千代田区丸の内1-1-1</p>
                        </div>
                    </div>

                    {/* Total */}
                    <div style={{ margin: '3rem 0', textAlign: 'center' }}>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>御見積金額（税抜）</p>
                        <p style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.025em', borderBottom: '3px double var(--text-main)', display: 'inline-block', padding: '0 2rem' }}>
                            ¥{quoteResult.totalPrice.toLocaleString()}
                        </p>
                    </div>

                    {/* Details Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginTop: '2rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>品目</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center' }}>数量</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center' }}>単位</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right' }}>金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 0.75rem' }}>
                                    滞在人口データ（500mメッシュ）<br />
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>期間：2024年1月 〜 2024年12月 ({quoteResult.conditions.monthCount}ヶ月)</span>
                                </td>
                                <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>{quoteResult.conditions.meshCount}</td>
                                <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>メッシュ</td>
                                <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>¥{quoteResult.totalPrice.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-outline" style={{ padding: '1rem 2rem', backgroundColor: 'white', display: 'flex', gap: '0.5rem' }}>
                        <Download size={20} /> 見積書をダウンロード
                    </button>
                    <button className="btn btn-primary" style={{ padding: '1rem 2rem', display: 'flex', gap: '0.5rem' }} onClick={() => setAppMode('purchase-form')}>
                        <CreditCard size={20} /> データ購入を依頼する
                    </button>
                </div>

                <button style={{ alignSelf: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setAppMode('quote-build')}>
                    条件を変更する
                </button>

            </div>
        </div>
    );
}
