import React from 'react';
import { useAppContext } from '../store/AppContext';
import MapViewer from '../components/map/MapViewer';
import MeshInfoPanel from '../components/panels/MeshInfoPanel';

import QuoteBuilder from './QuoteBuilder';
import QuoteResult from './QuoteResult';
import PurchaseForm from './PurchaseForm';

export default function LandingPage() {
    const { appMode } = useAppContext();

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            {/* Map is always the background now, quote-build overlays it */}
            {(appMode === 'explore' || appMode === 'quote-build') && <MapViewer />}

            {appMode === 'explore' && <MeshInfoPanel />}

            {appMode === 'quote-build' && <QuoteBuilder />}
            {appMode === 'purchase-form' && <PurchaseForm />}
        </div>
    );
}
