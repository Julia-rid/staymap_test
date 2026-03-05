import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext();

export const regions = [
  { id: 'hokkaido', name: '北海道', prefectures: [{ id: '01', name: '北海道', center: [43.0642, 141.3469] }] },
  {
    id: 'tohoku', name: '東北', prefectures: [
      { id: '02', name: '青森県', center: [40.8244, 140.7400] },
      { id: '03', name: '岩手県', center: [39.7036, 141.1525] },
      { id: '04', name: '宮城県', center: [38.2682, 140.8694] },
      { id: '05', name: '秋田県', center: [39.7186, 140.1025] },
      { id: '06', name: '山形県', center: [38.2404, 140.3633] },
      { id: '07', name: '福島県', center: [37.7503, 140.4675] }
    ]
  },
  {
    id: 'kanto', name: '関東', prefectures: [
      { id: '08', name: '茨城県', center: [36.3414, 140.4468] },
      { id: '09', name: '栃木県', center: [36.5658, 139.8836] },
      { id: '10', name: '群馬県', center: [36.3911, 139.0608] },
      { id: '11', name: '埼玉県', center: [35.8569, 139.6489] },
      { id: '12', name: '千葉県', center: [35.6047, 140.1233] },
      { id: '13', name: '東京都', center: [35.6895, 139.6917] },
      { id: '14', name: '神奈川県', center: [35.4478, 139.6425] }
    ]
  },
  {
    id: 'chubu', name: '中部', prefectures: [
      { id: '15', name: '新潟県', center: [37.9022, 139.0236] },
      { id: '16', name: '富山県', center: [36.6953, 137.2113] },
      { id: '17', name: '石川県', center: [36.5944, 136.6256] },
      { id: '18', name: '福井県', center: [36.0641, 136.2219] },
      { id: '19', name: '山梨県', center: [35.6639, 138.5683] },
      { id: '20', name: '長野県', center: [36.6513, 138.1810] },
      { id: '21', name: '岐阜県', center: [35.3912, 136.7222] },
      { id: '22', name: '静岡県', center: [34.9769, 138.3831] },
      { id: '23', name: '愛知県', center: [35.1802, 136.9066] }
    ]
  },
  {
    id: 'kinki', name: '近畿', prefectures: [
      { id: '24', name: '三重県', center: [34.7303, 136.5086] },
      { id: '25', name: '滋賀県', center: [35.0045, 135.8686] },
      { id: '26', name: '京都府', center: [35.0116, 135.7680] },
      { id: '27', name: '大阪府', center: [34.6937, 135.5022] },
      { id: '28', name: '兵庫県', center: [34.6913, 135.1830] },
      { id: '29', name: '奈良県', center: [34.6851, 135.8048] },
      { id: '30', name: '和歌山県', center: [34.2260, 135.1675] }
    ]
  },
  {
    id: 'chugoku', name: '中国', prefectures: [
      { id: '31', name: '鳥取県', center: [35.5011, 134.2351] },
      { id: '32', name: '島根県', center: [35.4723, 133.0505] },
      { id: '33', name: '岡山県', center: [34.6618, 133.9344] },
      { id: '34', name: '広島県', center: [34.3963, 132.4594] },
      { id: '35', name: '山口県', center: [34.1858, 131.4714] }
    ]
  },
  {
    id: 'shikoku', name: '四国', prefectures: [
      { id: '36', name: '徳島県', center: [34.0657, 134.5594] },
      { id: '37', name: '香川県', center: [34.3401, 134.0433] },
      { id: '38', name: '愛媛県', center: [33.8416, 132.7661] },
      { id: '39', name: '高知県', center: [33.5597, 133.5311] }
    ]
  },
  {
    id: 'kyushu', name: '九州・沖縄', prefectures: [
      { id: '40', name: '福岡県', center: [33.6064, 130.4181] },
      { id: '41', name: '佐賀県', center: [33.2494, 130.2988] },
      { id: '42', name: '長崎県', center: [32.7448, 129.8736] },
      { id: '43', name: '熊本県', center: [32.7898, 130.7417] },
      { id: '44', name: '大分県', center: [33.2382, 131.6126] },
      { id: '45', name: '宮崎県', center: [31.9111, 131.4239] },
      { id: '46', name: '鹿児島県', center: [31.5602, 130.5581] },
      { id: '47', name: '沖縄県', center: [26.2124, 127.6809] }
    ]
  }
];


export function AppProvider({ children }) {
  // Modes: 'explore', 'quote-build', 'purchase-form'
  const [appMode, setAppMode] = useState('explore');

  // Active Prefecture for Map
  const [activePrefecture, setActivePrefecture] = useState(regions[2].prefectures[5]); // Default Tokyo

  // Selected meshes (Array of mesh objects for multi-select)
  const [selectedMeshes, setSelectedMeshes] = useState([]);

  // Using explicit selections?
  const [useManualMeshSelection, setUseManualMeshSelection] = useState(false);

  // Search parameters for quote (Ordered 1-5 for UI)
  const [quotePeriod, setQuotePeriod] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    startTime: '00:00',
    endTime: '24:00',
    granularity: 'month', // hour, day, week, month
    dayType: 'all', // all, weekday, weekend
    hourlyOption: false // true/false
  });

  const [quoteAttributes, setQuoteAttributes] = useState({
    age: false,
    gender: false,
    residence: false
  });

  const [sampleFilterPattern, setSampleFilterPattern] = useState('total');

  // Map state
  const [mapZoom, setMapZoom] = useState(10);
  const [mapCenter, setMapCenter] = useState(activePrefecture.center);
  const [activeMeshSize, setActiveMeshSize] = useState('500m');

  // Selected mesh for details panel in 'explore' mode
  const [focusedMeshId, setFocusedMeshId] = useState(null);

  // Quote result data (retained just for passing to form)
  const [quoteResult, setQuoteResult] = useState(null);

  const value = useMemo(() => ({
    appMode, setAppMode,
    activePrefecture, setActivePrefecture,
    selectedMeshes, setSelectedMeshes,
    useManualMeshSelection, setUseManualMeshSelection,
    quotePeriod, setQuotePeriod,
    quoteAttributes, setQuoteAttributes,
    sampleFilterPattern, setSampleFilterPattern,
    mapZoom, setMapZoom,
    mapCenter, setMapCenter,
    activeMeshSize, setActiveMeshSize,
    focusedMeshId, setFocusedMeshId,
    quoteResult, setQuoteResult
  }), [
    appMode,
    activePrefecture,
    selectedMeshes,
    useManualMeshSelection,
    quotePeriod,
    quoteAttributes,
    sampleFilterPattern,
    mapZoom,
    mapCenter,
    activeMeshSize,
    focusedMeshId,
    quoteResult
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
