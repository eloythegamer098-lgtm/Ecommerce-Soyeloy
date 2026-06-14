import { Info } from "lucide-react";

export const AdminStatsCard = ({ title, value, icon, description, trend, trendValue, colorClass }) => {
    return (
        <div className={`stat-card glass-panel interactive ${colorClass}`}>
            <div className="stat-header">
                <span className="stat-label">{title}</span>
                <div className="stat-icon-wrapper">{icon}</div>
            </div>
            
            <div className="stat-main">
                <span className={`stat-value ${colorClass === 'green' ? 'text-gradient-green' : ''}`}>
                    {value}
                </span>
                {trendValue && (
                    <span className={`trend ${trend}`}>
                        {trend === 'up' ? '▲' : '▼'} {trendValue}
                    </span>
                )}
            </div>

            <div className="stat-didactic">
                <Info size={12} className="info-icon" />
                <p>{description}</p>
            </div>
            
            <div className="card-shine"></div>
        </div>
    );
};
