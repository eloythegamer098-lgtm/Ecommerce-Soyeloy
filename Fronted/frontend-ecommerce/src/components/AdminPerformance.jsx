import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

export const AdminPerformance = ({ data }) => {
    return (
        <div className="admin-data-section glass-panel">
            <div className="section-header">
                <h3>ANÁLISIS DE RENDIMIENTO</h3>
                <span className="text-muted">Ingresos generados por período</span>
            </div>
            
            <div className="chart-container" style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                        <Tooltip 
                            contentStyle={{ background: '#020617', border: '1px solid #a855f7', borderRadius: '8px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="ventas" 
                            stroke="#a855f7" 
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
