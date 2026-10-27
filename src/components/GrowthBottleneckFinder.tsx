import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

type ArchetypeType = 'demand_capture' | 'attribution_distortion' | 'data_fragmentation' | 'insight_blind_spot';

interface Question {
  id: number;
  question: string;
  answers: { label: string; weights: Record<ArchetypeType, number>; }[];
}

interface ArchetypeResult {
  name: string;
  title: string;
  explanation: string;
  symptoms: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "How confident are you that your marketing platforms report revenue accurately compared to your store or backend?",
    answers: [
      { label: "Very confident", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Mostly confident but small differences exist", weights: { demand_capture: 0, attribution_distortion: 1, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Numbers differ but we haven't investigated", weights: { demand_capture: 0, attribution_distortion: 2, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "We've never checked", weights: { demand_capture: 0, attribution_distortion: 3, data_fragmentation: 0, insight_blind_spot: 0 } },
    ]
  },
  {
    id: 2,
    question: "How connected are your marketing and customer data systems?",
    answers: [
      { label: "Fully integrated and unified", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Mostly connected with some gaps", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 1, insight_blind_spot: 0 } },
      { label: "Several systems operate independently", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 2, insight_blind_spot: 0 } },
      { label: "Data is largely siloed", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 3, insight_blind_spot: 0 } },
    ]
  },
  {
    id: 3,
    question: "Do you know what percentage of your revenue comes from repeat customers?",
    answers: [
      { label: "Yes, tracked clearly", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Rough estimate", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 1, insight_blind_spot: 0 } },
      { label: "Not tracked consistently", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 2, insight_blind_spot: 0 } },
      { label: "No idea", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 3, insight_blind_spot: 0 } },
    ]
  },
  {
    id: 4,
    question: "How often do you discover new actionable insights from your marketing data?",
    answers: [
      { label: "Weekly", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Monthly", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 1 } },
      { label: "Occasionally", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 2 } },
      { label: "Rarely or never", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 3 } },
    ]
  },
  {
    id: 5,
    question: "Have you checked whether any campaigns are losing potential traffic due to budget caps or impression share loss?",
    answers: [
      { label: "Yes, monitored regularly", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Checked occasionally", weights: { demand_capture: 1, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Aware but rarely reviewed", weights: { demand_capture: 2, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Never checked", weights: { demand_capture: 3, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
    ]
  },
  {
    id: 6,
    question: "When marketing performance changes unexpectedly, how quickly can you identify the cause?",
    answers: [
      { label: "Within hours", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Within a day", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 1 } },
      { label: "Takes several days", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 2 } },
      { label: "Hard to diagnose", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 3 } },
    ]
  },
  {
    id: 7,
    question: "Can you clearly see how different channels contribute to conversions across the customer journey?",
    answers: [
      { label: "Yes clearly", weights: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Somewhat", weights: { demand_capture: 0, attribution_distortion: 1, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "Limited visibility", weights: { demand_capture: 0, attribution_distortion: 2, data_fragmentation: 0, insight_blind_spot: 0 } },
      { label: "No", weights: { demand_capture: 0, attribution_distortion: 3, data_fragmentation: 0, insight_blind_spot: 0 } },
    ]
  },
];

const archetypes: Record<ArchetypeType, ArchetypeResult> = {
  demand_capture: {
    name: 'Demand Capture Bottleneck',
    title: 'Demand Capture Bottleneck',
    explanation: 'Your answers suggest that your marketing channels may not be capturing the full available demand. This typically happens when campaign budgets are capped, impression share is limited, or scaling constraints prevent you from reaching your full potential audience.',
    symptoms: ['Campaign budgets frequently hit daily caps', 'Low impression share on high-performing campaigns', 'Limited reach despite profitable performance', 'Scaling constraints preventing growth']
  },
  attribution_distortion: {
    name: 'Attribution Distortion',
    title: 'Attribution Distortion',
    explanation: 'Your answers suggest that marketing platforms may be misrepresenting performance due to attribution overlap or reporting discrepancies. When multiple platforms claim credit for the same conversion, it becomes difficult to understand true channel performance and allocate budget effectively.',
    symptoms: ["Platform-reported revenue doesn't match store revenue", 'Inflated ROAS numbers across channels', 'Unexplained spikes in direct traffic', 'Difficulty validating marketing performance']
  },
  data_fragmentation: {
    name: 'Data Fragmentation',
    title: 'Data Fragmentation',
    explanation: "Your answers suggest that marketing and customer data may be scattered across systems, preventing useful insights. When data is siloed, companies often miss valuable patterns about channel performance, customer behavior, and revenue attribution.",
    symptoms: ['Disconnected reporting across different tools', 'Manual data exports and spreadsheet work', 'Limited visibility across the full customer journey', 'Difficulty connecting ad spend to actual revenue']
  },
  insight_blind_spot: {
    name: 'Insight Blind Spot',
    title: 'Insight Blind Spot',
    explanation: "Your answers suggest that while data may be collected, actionable insights are rarely extracted from it. Many businesses discover they're sitting on valuable data but lack the processes or expertise to turn it into growth decisions.",
    symptoms: ['Dashboards exist but are rarely reviewed', 'Slow diagnosis when problems occur', 'Decisions driven by intuition rather than data', 'Opportunities missed due to delayed insights']
  }
};

export default function GrowthBottleneckFinder() {
  const [step, setStep] = useState<'landing' | 'questionnaire' | 'results'>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', monthlyRevenue: '', mainChannels: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const calculateScores = () => {
    const scores: Record<ArchetypeType, number> = { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 };
    answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex >= 0) {
        const weights = questions[questionIndex].answers[answerIndex].weights;
        (Object.keys(weights) as ArchetypeType[]).forEach(key => { scores[key] += weights[key]; });
      }
    });
    return scores;
  };

  const getBottlenecks = () => {
    const scores = calculateScores();
    const sortedArchetypes = (Object.keys(scores) as ArchetypeType[]).sort((a, b) => scores[b] - scores[a]);
    return { primary: sortedArchetypes[0], secondary: sortedArchetypes[1], scores };
  };

  const handleNext = () => {
    if (selectedAnswer >= 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(newAnswers[currentQuestion + 1]);
      } else {
        setStep('results');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    } else {
      setStep('landing');
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const { primary, secondary, scores } = getBottlenecks();
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "3dd4b3e3-fb4b-424c-b393-43fd28ca6ebb",
          subject: "Growth Bottleneck Finder - New Lead",
          from_name: "Growth Bottleneck Finder",
          name: formData.name,
          email: formData.email,
          monthly_revenue: formData.monthlyRevenue,
          main_channels: formData.mainChannels,
          primary_bottleneck: archetypes[primary].name,
          secondary_bottleneck: archetypes[secondary].name,
          scores: JSON.stringify(scores),
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nMonthly Revenue: ${formData.monthlyRevenue}\nMain Channels: ${formData.mainChannels}\n\nPrimary Bottleneck: ${archetypes[primary].name}\nSecondary Signal: ${archetypes[secondary].name}`,
        }),
      });
      setFormSubmitted(true);
    } catch { setFormSubmitted(true); }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const { primary, secondary, scores } = step === 'results' ? getBottlenecks() : { primary: 'demand_capture' as ArchetypeType, secondary: 'attribution_distortion' as ArchetypeType, scores: { demand_capture: 0, attribution_distortion: 0, data_fragmentation: 0, insight_blind_spot: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {step === 'landing' && (
          <Card className="border-2">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-4xl font-bold">Find Your Hidden Growth Bottleneck in 5 Minutes</CardTitle>
              <CardDescription className="text-lg">Answer a few questions about your marketing setup and discover the one constraint most likely limiting growth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/50 p-6 rounded-lg">
                <p className="text-muted-foreground text-center">Many companies unknowingly lose growth due to data fragmentation, attribution distortion, or demand capture issues.</p>
              </div>
              <Button onClick={() => { setStep('questionnaire'); setCurrentQuestion(0); setSelectedAnswer(-1); }} size="lg" className="w-full text-lg py-6">Start Diagnostic</Button>
              <p className="text-center text-sm text-muted-foreground">7 questions • 3-5 minutes • Free instant results</p>
            </CardContent>
          </Card>
        )}

        {step === 'questionnaire' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-2">Question {currentQuestion + 1} of {questions.length}</div>
                <Progress value={progress} />
              </div>
            </div>
            <Card className="border-2">
              <CardHeader><CardTitle className="text-2xl">{questions[currentQuestion].question}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedAnswer.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                  <div className="space-y-3">
                    {questions[currentQuestion].answers.map((answer, index) => (
                      <div key={index} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => setSelectedAnswer(index)}>
                        <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                        <Label htmlFor={`answer-${index}`} className="flex-1 cursor-pointer text-base">{answer.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                <Button onClick={handleNext} disabled={selectedAnswer < 0} size="lg" className="w-full">
                  {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader className="text-center space-y-4">
                <div className="text-sm font-semibold text-primary">YOUR LIKELY GROWTH BOTTLENECK</div>
                <CardTitle className="text-3xl">{archetypes[primary].title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{archetypes[primary].explanation}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Common symptoms include:</h3>
                  <ul className="space-y-2">
                    {archetypes[primary].symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Score Breakdown</CardTitle>
                <CardDescription>See how your answers mapped across all four growth bottleneck archetypes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(Object.keys(scores) as ArchetypeType[]).sort((a, b) => scores[b] - scores[a]).map((archetype) => {
                  const maxScore = archetype === 'demand_capture' ? 3 : 6;
                  const percentage = (scores[archetype] / maxScore) * 100;
                  const isPrimary = archetype === primary;
                  return (
                    <div key={archetype} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isPrimary ? 'text-primary' : ''}`}>{archetypes[archetype].name}</span>
                          {isPrimary && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Primary</span>}
                        </div>
                        <span className="text-sm text-muted-foreground">{scores[archetype]} / {maxScore}</span>
                      </div>
                      <Progress value={percentage} className={isPrimary ? 'h-3' : 'h-2'} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {!showLeadForm && !formSubmitted && (
              <Card>
                <CardContent className="pt-6 text-center space-y-4">
                  <h3 className="text-xl font-semibold">Want to validate this in your business?</h3>
                  <p className="text-muted-foreground">Share three numbers and I can usually confirm this bottleneck quickly.</p>
                  <Button onClick={() => setShowLeadForm(true)} size="lg" className="w-full">Get a Quick Validation</Button>
                </CardContent>
              </Card>
            )}

            {showLeadForm && !formSubmitted && (
              <Card>
                <CardHeader>
                  <CardTitle>Get Your Quick Validation</CardTitle>
                  <CardDescription>Tell us a bit about your business and we'll provide a personalized validation</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitLead} className="space-y-4">
                    <div><Label htmlFor="name">Name *</Label><Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                    <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                    <div><Label htmlFor="revenue">Monthly Revenue Range *</Label><Input id="revenue" required placeholder="e.g., $50k-$100k" value={formData.monthlyRevenue} onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })} /></div>
                    <div><Label htmlFor="channels">Main Marketing Channels *</Label><Input id="channels" required placeholder="e.g., Facebook, Google, Email" value={formData.mainChannels} onChange={(e) => setFormData({ ...formData, mainChannels: e.target.value })} /></div>
                    <Button type="submit" size="lg" className="w-full">Submit for Validation</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {formSubmitted && (
              <Card className="border-2 border-green-500">
                <CardContent className="pt-6 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold">Thank you!</h3>
                  <p className="text-muted-foreground">We'll review your information and reach out shortly with a personalized validation.</p>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              <Button variant="outline" onClick={() => { setStep('landing'); setCurrentQuestion(0); setAnswers(Array(questions.length).fill(-1)); setSelectedAnswer(-1); setShowLeadForm(false); setFormSubmitted(false); }}>
                Retake Diagnostic
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
