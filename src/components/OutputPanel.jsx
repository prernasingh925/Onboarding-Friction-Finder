import React from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, MousePointerClick } from 'lucide-react';

export default function OutputPanel({ status, results, errorMsg }) {
  if (status === 'idle') {
    return (
      <div className="output-idle text-center">
        <p className="output-idle-text" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          Your diagnosis will appear here
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="output-idle text-center">
        <div style={{ padding: '1.5rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '1rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease-out' }}>
          <AlertCircle color="#DC2626" size={32} />
          <p style={{ color: '#991B1B', fontWeight: 600, maxWidth: '280px', lineHeight: 1.5 }}>
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="output-container" style={{ marginTop: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
        <div className="output-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton skeleton-h-10"></div>
          <div className="skeleton skeleton-h-24"></div>
          <div className="skeleton skeleton-h-32"></div>
          <div className="experiments-grid">
            <div className="skeleton skeleton-h-40"></div>
            <div className="skeleton skeleton-h-40"></div>
          </div>
        </div>
      </div>
    );
  }

  // Success state using JSON
  if (status === 'success' && results) {
    return (
      <div className="output-container" style={{ marginTop: '2rem' }}>
        
        {/* Card 1: Funnel Score */}
        <div className="output-card" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-green)', margin: 0 }}>
              Funnel Score
            </h2>
            <span className={`badge ${results.funnelScore?.score <= 4 ? 'badge-red' : 'badge-amber'}`}>
              <AlertCircle size={14} /> {results.funnelScore?.severity}
            </span>
          </div>
          <div className="score-display">
            <span className="score-number">{results.funnelScore?.score}</span>
            <span className="score-total">/10</span>
          </div>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', marginTop: '0.75rem', lineHeight: 1.5 }}>
            <span dangerouslySetInnerHTML={{ __html: results.funnelScore?.context || '' }}></span>
          </p>
        </div>

        {/* Card 2: Broken Step */}
        <div className="output-card step-broken" style={{ animationDelay: '0.2s', padding: '1.25rem 1.5rem', backgroundColor: '#FEF2F2' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0' }}>
            <ArrowRight color="var(--danger-red)" size={18} />
            {results.brokenStep?.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(results.brokenStep?.badges || [])
              .filter(b => !b.toLowerCase().includes("value precedes"))
              .slice(0, 2)
              .map((b, i) => (
             <span key={i} className={i === 0 ? "badge badge-amber" : "badge badge-red"}>
               {i === 0 ? <AlertTriangle size={14} /> : <AlertCircle size={14} />} {b}
             </span>
            ))}
          </div>
        </div>

        {/* Card 3: Friction Story */}
        <div className="friction-story" style={{ animation: 'slideUp 0.5s ease-out forwards', opacity: 0, animationDelay: '0.3s' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--dark-green)', margin: '0 0 1rem 0' }}>
            Friction Story
          </h3>
          <p>
            "{results.frictionStory}"
          </p>
        </div>

        {/* Card 4: Experiments */}
        <div style={{ animation: 'slideUp 0.5s ease-out forwards', opacity: 0, animationDelay: '0.4s' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--dark-green)', marginBottom: '1rem' }}>
            Recommended Experiments
          </h3>
          
          <div className="experiments-grid">
            {(results.experiments || []).map((exp, idx) => (
            <div key={idx} className={`experiment-box ${idx === 0 ? 'exp-green' : 'exp-blue'}`}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'white', padding: '0.375rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <MousePointerClick size={16} color={idx === 0 ? "var(--primary-green)" : "var(--blue-primary)"} />
                </div>
                <h4 style={{ fontWeight: 800, color: idx === 0 ? '#064e3b' : '#1e3a8a', fontSize: '1rem', margin: 0, marginTop: '2px' }}>{exp.title}</h4>
              </div>
              
              <div style={{ marginTop: '0.5rem' }}>
                <span className="exp-label">Hypothesis</span>
                <p className="exp-text">{exp.hypothesis}</p>
                
                <span className="exp-label" style={{ marginTop: '0.75rem' }}>Test Method</span>
                <p className="exp-text">{exp.testMethod}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${idx === 0 ? 'rgba(22, 163, 74, 0.2)' : 'rgba(37, 99, 235, 0.2)'}` }}>
                   <div>
                     <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: idx === 0 ? '#15803d' : '#1d4ed8' }}>Primary Metric</span>
                     <span style={{ color: idx === 0 ? '#064e3b' : '#1e3a8a', fontWeight: 600, fontSize: '0.875rem' }}>{exp.primaryMetric}</span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: idx === 0 ? '#15803d' : '#1d4ed8' }}>Risk</span>
                     <span style={{ color: idx === 0 ? '#064e3b' : '#1e3a8a', fontWeight: 600, fontSize: '0.875rem' }}>{exp.risk}</span>
                   </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
        
      </div>
    );
  }

  return null;
}
