import React, { useState } from 'react';
import { Plus, Minus, Loader2, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Food Delivery', 'Payments & Fintech', 'Quick Commerce', 
  'Shopping & D2C', 'Health & Fitness', 'Learning & EdTech', 'Other'
];

const ACTION_TYPES = [
  'Create account', 'Verify identity (OTP/KYC)', 'Grant permission', 
  'Enter personal details', 'Connect payment method', 'See first value', 
  'Social or referral action', 'Complete a tutorial'
];

export default function FormPanel({ onDiagnose, isDiagnosing }) {
  const [category, setCategory] = useState('');
  const [stepCount, setStepCount] = useState(3);
  const [steps, setSteps] = useState([
    { name: '', type: '', dropoff: '' },
    { name: '', type: '', dropoff: '' },
    { name: '', type: '', dropoff: '' }
  ]);
  const [timeToValue, setTimeToValue] = useState('');
  const [d1Retention, setD1Retention] = useState('');
  const [context, setContext] = useState('');
  const [errors, setErrors] = useState({});

  const updateStepCount = (newCount) => {
    if (newCount < 2 || newCount > 8) return;
    setStepCount(newCount);
    setSteps(prev => {
      if (newCount > prev.length) {
        return [...prev, ...Array(newCount - prev.length).fill({ name: '', type: '', dropoff: '' })];
      }
      return prev.slice(0, newCount);
    });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
    // Clear targeted error
    if (errors[`step_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`step_${index}_${field}`]: null }));
    }
  };

  const loadSwiggySample = () => {
    setCategory('Food Delivery');
    setStepCount(5);
    setSteps([
      { name: 'Download & open app', type: 'See first value', dropoff: 15 },
      { name: 'Allow location access', type: 'Grant permission', dropoff: 71 },
      { name: 'Create account', type: 'Create account', dropoff: 38 },
      { name: 'Browse restaurants', type: 'See first value', dropoff: 22 },
      { name: 'Add to cart & checkout', type: 'Connect payment method', dropoff: 45 }
    ]);
    setTimeToValue(47);
    setD1Retention(22);
    setContext('Recent change: moved sign-up to step 3 from step 1. \nLocation permission drop-off was 68% before, now 71%.');
    setErrors({});
  };

  const loadPhonePeSample = () => {
    setCategory('Payments & Fintech');
    setStepCount(4);
    setSteps([
      { name: 'Download & open app', type: 'See first value', dropoff: 12 },
      { name: 'Enter mobile number', type: 'Enter personal details', dropoff: 28 },
      { name: 'Verify OTP', type: 'Verify identity (OTP/KYC)', dropoff: 64 },
      { name: 'Link bank account', type: 'Connect payment method', dropoff: 57 }
    ]);
    setTimeToValue(85);
    setD1Retention(21);
    setContext('OTP delivery failure rate is ~8% on certain telecom networks. Users who skip bank linking rarely return within 7 days.');
    setErrors({});
  };

  const loadHealthSample = () => {
    setCategory('Health & Fitness');
    setStepCount(5);
    setSteps([
      { name: 'Open app', type: 'See first value', dropoff: 10 },
      { name: 'Allow notifications', type: 'Grant permission', dropoff: 58 },
      { name: 'Allow health data access', type: 'Grant permission', dropoff: 62 },
      { name: 'Set fitness goal', type: 'Enter personal details', dropoff: 34 },
      { name: 'See personalised plan', type: 'See first value', dropoff: 19 }
    ]);
    setTimeToValue(110);
    setD1Retention(17);
    setContext('Two back-to-back permission prompts before user sees any value. No explanation of what the app does before asking for data access.');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!category || typeof category !== 'string' || !category.trim()) {
      newErrors.category = "This field is required.";
    }
    steps.forEach((step, idx) => {
      if (!step.name || !step.name.trim()) newErrors[`step_${idx}_name`] = "This field is required.";
      if (!step.type) newErrors[`step_${idx}_type`] = "This field is required.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onDiagnose({
      category, stepCount, steps, timeToValue, d1Retention, context
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '560px', margin: '0 auto' }}>
      <div className="form-header">
        <h1 className="form-title">
          <Sparkles color="var(--primary-green)" size={24} />
          Onboarding Friction Finder
        </h1>
        <p className="form-subtitle">Diagnose why users drop off — and what to fix first</p>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-out' }}>
        
        <div className="form-group">
          <label className="form-label">
            <span>App Category <span style={{ color: 'var(--danger-red)' }}>*</span></span>
          </label>
          <select 
            className="form-select" 
            value={category} 
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors(prev => ({...prev, category: null}));
            }}
            style={errors.category ? { borderColor: 'var(--danger-red)' } : {}}
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <div style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>{errors.category}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Number of onboarding steps
            <div className="step-counter-ctl">
              <button 
                type="button" 
                className="step-btn"
                onClick={() => updateStepCount(stepCount - 1)}
                disabled={stepCount <= 2}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontWeight: 600, width: '1.25rem', textAlign: 'center' }}>{stepCount}</span>
              <button 
                type="button" 
                className="step-btn"
                onClick={() => updateStepCount(stepCount + 1)}
                disabled={stepCount >= 8}
              >
                <Plus size={16} />
              </button>
            </div>
          </label>
          
          <div>
            {steps.map((step, idx) => (
              <div key={idx} className="step-row">
                <div className="step-col step-col-name">
                  <label>Step {idx + 1} Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Allow location"
                    value={step.name}
                    onChange={(e) => updateStep(idx, 'name', e.target.value)}
                    style={errors[`step_${idx}_name`] ? { borderColor: 'var(--danger-red)' } : {}}
                  />
                  {errors[`step_${idx}_name`] && <div style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>{errors[`step_${idx}_name`]}</div>}
                </div>
                <div className="step-col step-col-action">
                  <label>Action Type</label>
                  <select 
                    className="form-select" 
                    value={step.type}
                    onChange={(e) => updateStep(idx, 'type', e.target.value)}
                    style={errors[`step_${idx}_type`] ? { borderColor: 'var(--danger-red)' } : {}}
                  >
                    <option value="" disabled>Select...</option>
                    {ACTION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors[`step_${idx}_type`] && <div style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>{errors[`step_${idx}_type`]}</div>}
                </div>
                <div className="step-col step-col-drop">
                  <label>Drop-off %</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0" max="100"
                    placeholder="0"
                    value={step.dropoff}
                    onFocus={(e) => { e.target.select(); }}
                    onBlur={() => { if (step.dropoff === '' || step.dropoff === null) updateStep(idx, 'dropoff', '0') }}
                    onChange={(e) => updateStep(idx, 'dropoff', e.target.value)}
                  />
                  <div className="dropoff-bar-bg">
                    <div 
                      className="dropoff-bar-fill"
                      style={{
                        width: `${Number(step.dropoff) || 0}%`,
                        backgroundColor: `hsl(${120 - ((Number(step.dropoff) || 0) * 1.2)}, 70%, 45%)`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="form-label">Time to first value (seconds)</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="How many seconds until user sees something useful?" 
            value={timeToValue}
            onChange={(e) => setTimeToValue(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Current D1 retention % 
            <span className="form-label-hint">(optional)</span>
          </label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="Leave blank if unknown" 
            value={d1Retention}
            onChange={(e) => setD1Retention(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Any known context
            <span className="form-label-hint">(optional)</span>
          </label>
          <textarea 
            className="form-textarea" 
            rows={3} 
            maxLength={300}
            placeholder="Recent changes? Known bugs? User feedback?"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          ></textarea>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
            {context.length}/300
          </div>
        </div>

        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isDiagnosing}
          >
            {isDiagnosing ? (
              <>
                <Loader2 size={20} className="lucide lucide-loader-2" style={{ animation: 'spin 1s linear infinite' }} /> 
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                Analyzing Funnel...
              </>
            ) : (
              'Diagnose My Funnel'
            )}
          </button>
        </div>
        
        <div style={{ paddingBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={loadSwiggySample}
            className="sample-link"
          >
            🍕 Swiggy Sample
          </button>
          <button
            type="button"
            onClick={loadPhonePeSample}
            className="sample-link"
          >
            💳 PhonePe Sample
          </button>
          <button
            type="button"
            onClick={loadHealthSample}
            className="sample-link"
          >
            🏃 Health App Sample
          </button>
        </div>
      </form>
    </div>
  );
}
