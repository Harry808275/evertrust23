'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Eye,
  MousePointer
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  variants: {
    id: string;
    name: string;
    description: string;
    traffic: number; // percentage
    conversions: number;
    impressions: number;
    conversionRate: number;
  }[];
  element: string;
  metric: 'conversion_rate' | 'click_through_rate' | 'revenue_per_user' | 'session_duration';
  confidence: number;
  winner?: string;
}

export default function ABTesting() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [activeTest, setActiveTest] = useState<ABTest | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample A/B tests for demonstration
  useEffect(() => {
    const sampleTests: ABTest[] = [
      {
        id: '1',
        name: 'Product Page CTA Button',
        description: 'Testing different CTA button colors and text',
        status: 'active',
        startDate: '2024-01-15',
        variants: [
          {
            id: '1a',
            name: 'Control - Blue Button',
            description: 'Original blue "Add to Cart" button',
            traffic: 50,
            conversions: 45,
            impressions: 1000,
            conversionRate: 4.5
          },
          {
            id: '1b',
            name: 'Variant A - Green Button',
            description: 'Green "Buy Now" button',
            traffic: 50,
            conversions: 52,
            impressions: 1000,
            conversionRate: 5.2
          }
        ],
        element: 'product_cta_button',
        metric: 'conversion_rate',
        confidence: 85.2
      },
      {
        id: '2',
        name: 'Homepage Hero Section',
        description: 'Testing different hero images and copy',
        status: 'paused',
        startDate: '2024-01-10',
        endDate: '2024-01-20',
        variants: [
          {
            id: '2a',
            name: 'Control - Lifestyle Image',
            description: 'Original lifestyle-focused hero image',
            traffic: 50,
            conversions: 38,
            impressions: 800,
            conversionRate: 4.75
          },
          {
            id: '2b',
            name: 'Variant A - Product Focus',
            description: 'Product-focused hero with clear CTA',
            traffic: 50,
            conversions: 42,
            impressions: 800,
            conversionRate: 5.25
          }
        ],
        element: 'homepage_hero',
        metric: 'conversion_rate',
        confidence: 78.5
      }
    ];

    setTests(sampleTests);
  }, []);

  const createTest = (testData: Omit<ABTest, 'id' | 'status' | 'startDate' | 'confidence'>) => {
    const newTest: ABTest = {
      ...testData,
      id: Date.now().toString(),
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      confidence: 0
    };

    setTests([...tests, newTest]);
    setShowCreateForm(false);
  };

  const toggleTestStatus = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: test.status === 'active' ? 'paused' : 'active' }
        : test
    ));
  };

  const completeTest = (testId: string, winnerId: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            status: 'completed', 
            endDate: new Date().toISOString().split('T')[0],
            winner: winnerId
          }
        : test
    ));
  };

  const getStatisticalSignificance = (variantA: ABTest['variants'][0], variantB: ABTest['variants'][0]) => {
    // Simplified statistical significance calculation
    const n1 = variantA.impressions;
    const n2 = variantB.impressions;
    const p1 = variantA.conversionRate / 100;
    const p2 = variantB.conversionRate / 100;
    
    const pooledP = (n1 * p1 + n2 * p2) / (n1 + n2);
    const standardError = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
    const zScore = Math.abs(p1 - p2) / standardError;
    
    // 95% confidence interval (z = 1.96)
    return zScore > 1.96;
  };

  const calculateConfidence = (test: ABTest) => {
    if (test.variants.length < 2) return 0;
    
    const [variantA, variantB] = test.variants;
    const isSignificant = getStatisticalSignificance(variantA, variantB);
    
    if (isSignificant) {
      const difference = Math.abs(variantA.conversionRate - variantB.conversionRate);
      return Math.min(95, Math.max(80, 80 + (difference * 2)));
    }
    
    return Math.max(0, 80 - (test.variants[0].impressions / 100));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TestTube className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">A/B Testing Dashboard</h2>
            <p className="text-gray-600">Optimize conversion rates through systematic testing</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Create Test</span>
        </button>
      </div>

      {/* Test Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <Play className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.filter(t => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Improvement</p>
              <p className="text-2xl font-bold text-gray-900">+12.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.reduce((sum, test) => sum + test.variants.reduce((s, v) => s + v.impressions, 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Tests</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tests.filter(t => t.status === 'active').map((test) => (
            <div key={test.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{test.name}</h4>
                  <p className="text-sm text-gray-600">{test.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">Element: {test.element}</span>
                    <span className="text-xs text-gray-500">Metric: {test.metric.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-500">Started: {new Date(test.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleTestStatus(test.id)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    test.confidence > 90 ? 'bg-green-100 text-green-800' :
                    test.confidence > 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {test.confidence.toFixed(1)}% Confidence
                  </div>
                </div>
              </div>

              {/* Variants Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {test.variants.map((variant) => (
                  <div key={variant.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{variant.name}</h5>
                      <span className="text-sm text-gray-600">{variant.traffic}% traffic</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{variant.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{variant.conversionRate}%</p>
                        <p className="text-xs text-gray-600">Conv. Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{variant.conversions}</p>
                        <p className="text-xs text-gray-600">Conversions</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">{variant.impressions}</p>
                        <p className="text-xs text-gray-600">Impressions</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Actions */}
              {test.confidence > 90 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Statistical significance reached! Ready to declare a winner.
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {test.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => completeTest(test.id, variant.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Declare Winner
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completed Tests */}
      {tests.filter(t => t.status === 'completed').length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Completed Tests</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {tests.filter(t => t.status === 'completed').map((test) => {
              const winner = test.variants.find(v => v.id === test.winner);
              return (
                <div key={test.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{test.name}</h4>
                      <p className="text-sm text-gray-600">{test.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(test.startDate).toLocaleDateString()} - {test.endDate && new Date(test.endDate).toLocaleDateString()}
                        </span>
                        {winner && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Winner: {winner.name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setTests(tests.filter(t => t.id !== test.id))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Test Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New A/B Test</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createTest({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                element: formData.get('element') as string,
                metric: formData.get('metric') as ABTest['metric'],
                variants: [
                  {
                    id: 'control',
                    name: 'Control',
                    description: 'Original version',
                    traffic: 50,
                    conversions: 0,
                    impressions: 0,
                    conversionRate: 0
                  },
                  {
                    id: 'variant',
                    name: 'Variant A',
                    description: 'Test version',
                    traffic: 50,
                    conversions: 0,
                    impressions: 0,
                    conversionRate: 0
                  }
                ]
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Product Page CTA Button"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none"
                    placeholder="What are you testing and why?"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Element</label>
                    <input
                      type="text"
                      name="element"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., product_cta_button"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Metric</label>
                    <select
                      name="metric"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none"
                    >
                      <option value="conversion_rate">Conversion Rate</option>
                      <option value="click_through_rate">Click Through Rate</option>
                      <option value="revenue_per_user">Revenue per User</option>
                      <option value="session_duration">Session Duration</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

