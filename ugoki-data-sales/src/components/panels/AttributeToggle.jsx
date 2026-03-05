import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Users, User, MapPin } from 'lucide-react';

export default function AttributeToggle() {
    const { activeAttribute, setActiveAttribute } = useAppContext();

    const attributes = [
        { id: 'total', label: '滞在人口', icon: <Users size={16} /> },
        { id: 'age', label: '年代', icon: <User size={16} /> },
        { id: 'gender', label: '性別', icon: <User size={16} /> },
        { id: 'residence', label: '居住地', icon: <MapPin size={16} /> },
    ];

    return (
        <div className="panel" style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            zIndex: 'var(--z-overlay)',
            display: 'flex',
            gap: '0.25rem',
            padding: '0.25rem'
        }}>
            {attributes.map(attr => {
                const isActive = activeAttribute === attr.id;
                return (
                    <button
                        key={attr.id}
                        onClick={() => setActiveAttribute(attr.id)}
                        className="btn"
                        style={{
                            backgroundColor: isActive ? 'var(--bg-panel-hover)' : 'transparent',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                            gap: '0.5rem',
                            border: isActive ? '1px solid var(--border)' : '1px solid transparent'
                        }}
                    >
                        {attr.icon}
                        {attr.label}
                    </button>
                );
            })}
        </div>
    );
}
