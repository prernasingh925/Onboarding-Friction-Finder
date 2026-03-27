import React, { useState } from 'react';
import FormPanel from './components/FormPanel';
import OutputPanel from './components/OutputPanel';

function App() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDiagnose = async (formData) => {
    setStatus('loading');
    setErrorMsg('');
    
    // Construct steps string
    const stepsDataStr = formData.steps.map((s, i) => 
      `Step ${i+1}: ${s.name} | Action type: ${s.type} | Drop-off: ${s.dropoff}%`
    ).join('\n');
    
    const systemPrompt = `You are an expert product manager and UX researcher. Analyze the following onboarding funnel data and diagnose the user drop-off.
App Category: ${formData.category}
Number of steps: ${formData.stepCount}
Time to first value: ${formData.timeToValue || "not provided"}
D1 retention: ${formData.d1Retention || "not provided"}
Additional context: ${formData.context || "none"}

Steps data:
${stepsDataStr}

Important Rules:
- When writing the friction_story, always include the unit when referencing time to first value — write "X seconds" not just the number X. Example: "time to first value of 90 seconds" not "time to first value of 90".
- Category D1 retention benchmarks: Food Delivery: 28-35%, Payments & Fintech: 25-32%, Quick Commerce: 30-38%, Shopping & D2C: 20-28%, Health & Fitness: 18-25%, Learning & EdTech: 15-22%, Other: 20-30%.
- HEALTHY FUNNEL RULE: If the D1 retention provided is at least 10 percentage points above the upper end of the category benchmark, OR if no single step has drop-off above 50% AND all steps have drop-off below 40%, the funnel is performing well. In this case: set funnelScore.score to 7-9 (not Critical), set funnelScore.severity to "Good" or "Optimise", label brokenStep.title as "Highest Friction Point" (not "Broken Step"), open the frictionStory with a sentence acknowledging the funnel is performing above category benchmark before identifying the improvement area, and use action verbs like "Optimise", "Improve", or "Accelerate" in experiment titles — NOT "Fix", "Remove", or "Defer".
- CRITICAL FUNNEL RULE: Only use severity "Critical" and score 1-4 when D1 retention is below the category benchmark OR when one or more steps have drop-off above 60%.

Provide your analysis in the following strict JSON format, without markdown or extra text:
{
  "funnelScore": { "score": 3, "severity": "Critical", "context": "Food delivery apps typically achieve D1 retention of 28-35%. Your funnel has 2 critical friction points." },
  "brokenStep": { "title": "Step 2: Allow Location Access", "badges": ["Ask Before Give", "Critical severity"] },
  "frictionStory": "Your onboarding asks for location access at step 2, before the user has seen a single restaurant. With 71% drop-off here, users haven't received any value yet — the permission request feels invasive.",
  "experiments": [
    { "title": "Defer Permission", "hypothesis": "If we ask for location only when user taps find nearby cafes, completion will rise.", "testMethod": "A/B test removing step 2 entirely vs control.", "primaryMetric": "Step 3 Arrival", "risk": "Low" },
    { "title": "Value Primer", "hypothesis": "If we explain why we need location before the OS prompt, users will accept.", "testMethod": "Add intermediary primer screen before the native prompt.", "primaryMetric": "Opt-in Rate", "risk": "Medium" }
  ]
}`;

    const payload = {
      contents: [{
        parts: [{ text: systemPrompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Production Server Error: " + text.substring(0, 100) + "... (Make sure your Vercel deployment is finished building!)");
      }
      
      if (!res.ok || data.error) {
        // Enforce specific 429 logic
        if (res.status === 429 || data.error?.code === 429) {
          throw new Error("High demand right now — please retry in a few seconds.");
        }
        throw new Error(data.error?.message || data.error || "API Route Failed.");
      }

      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        // Intercept block reasons (like safety) or complete payload absence and rewrite fallback
        throw new Error("Please enter onboarding funnel data for a consumer app.");
      }
      
      // Clean up markdown block if Gemini included it despite instructions
      let cleanText = textResponse.replace(/^```json/im, "").replace(/```$/im, "").trim();
      
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
        // Schema check for basic structural validity. If the model outputted random JSON, fail to the fallback message.
        if (!parsed.funnelScore || !parsed.brokenStep || !parsed.frictionStory || !parsed.experiments) {
          throw new Error("Schema failure");
        }
      } catch (err) {
        // If it isn't JSON or doesn't match the expected layout, override error as requested
        throw new Error("Please enter onboarding funnel data for a consumer app.");
      }
      
      setResults(parsed);
      setStatus('success');
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message);
      setStatus('error');
    }
  };

  return (
    <div className="app-container">
      <div className="panel-left">
        <FormPanel onDiagnose={handleDiagnose} isDiagnosing={status === 'loading'} />
      </div>
      <div className="panel-right">
        <OutputPanel status={status} results={results} errorMsg={errorMsg} />
      </div>
    </div>
  );
}

export default App;
