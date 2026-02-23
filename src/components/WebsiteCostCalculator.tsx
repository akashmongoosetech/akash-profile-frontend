import React, { useState, useMemo } from 'react';
import { Calculator, Check, Info, Sparkles } from 'lucide-react';

/**
 * WebsiteCostCalculator Component
 * 
 * A fully functional calculator for estimating website development costs.
 * Features:
 * - Dynamic pricing based on number of pages, design type, features, and hosting
 * - Real-time cost calculation
 * - Detailed cost breakdown
 * - Professional UI with animations
 */

// Design type pricing configuration (in INR)
const DESIGN_PRICES = {
  basic: { name: 'Basic', basePrice: 25000, pricePerPage: 2500, description: 'Simple, clean design with essential elements' },
  standard: { name: 'Standard', basePrice: 50000, pricePerPage: 5000, description: 'Professional design with custom layouts' },
  premium: { name: 'Premium', basePrice: 100000, pricePerPage: 10000, description: 'High-end design with advanced animations' }
};

// Feature pricing configuration (in INR)
const FEATURE_PRICES = {
  seo: { name: 'SEO Optimization', price: 15000, description: 'Search engine optimization setup' },
  blog: { name: 'Blog Functionality', price: 25000, description: 'CMS-powered blog with categories' },
  ecommerce: { name: 'E-commerce', price: 75000, description: 'Online store with payment integration' },
  adminPanel: { name: 'Admin Panel', price: 40000, description: 'Custom dashboard for content management' }
};

// Hosting pricing per year (in INR)
const HOSTING_PRICE_PER_YEAR = 6000;

interface CostBreakdown {
  design: number;
  pages: number;
  features: number;
  hosting: number;
  total: number;
}

const WebsiteCostCalculator: React.FC = () => {
  // State for form inputs
  const [numPages, setNumPages] = useState<number>(5);
  const [designType, setDesignType] = useState<keyof typeof DESIGN_PRICES>('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['seo']);
  const [hostingYears, setHostingYears] = useState<number>(1);

  // Calculate costs in real-time using useMemo for performance
  const costBreakdown = useMemo<CostBreakdown>(() => {
    const design = DESIGN_PRICES[designType].basePrice;
    const pages = DESIGN_PRICES[designType].pricePerPage * numPages;
    const features = selectedFeatures.reduce((total, feature) => {
      return total + (FEATURE_PRICES[feature as keyof typeof FEATURE_PRICES]?.price || 0);
    }, 0);
    const hosting = HOSTING_PRICE_PER_YEAR * hostingYears;
    const total = design + pages + features + hosting;

    return { design, pages, features, hosting, total };
  }, [numPages, designType, selectedFeatures, hostingYears]);

  // Toggle feature selection
  const toggleFeature = (featureKey: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureKey)
        ? prev.filter(f => f !== featureKey)
        : [...prev, featureKey]
    );
  };

  // Format currency (Indian Rupee)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get design color for UI
  const getDesignColor = () => {
    switch (designType) {
      case 'basic': return 'from-blue-500 to-cyan-500';
      case 'standard': return 'from-purple-500 to-pink-500';
      case 'premium': return 'from-amber-500 to-orange-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Website Cost Calculator
          </h1>
          <p className="text-gray-400 text-lg">
            Get an instant estimate for your website project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Number of Pages */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-3">
                Number of Pages
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={numPages}
                  onChange={(e) => setNumPages(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="w-16 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {numPages}
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Range: 1-50 pages
              </p>
            </div>

            {/* Design Type */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-4">
                Design Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.entries(DESIGN_PRICES) as [keyof typeof DESIGN_PRICES, typeof DESIGN_PRICES.basic][]).map(([key, design]) => (
                  <button
                    key={key}
                    onClick={() => setDesignType(key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      designType === key
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                    }`}
                  >
                    <div className={`text-lg font-bold mb-1 bg-gradient-to-r ${getDesignColor()} bg-clip-text text-transparent`}>
                      {design.name}
                    </div>
                    <div className="text-white font-semibold">
                      {formatCurrency(design.basePrice)}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {design.pricePerPage}/page
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                {DESIGN_PRICES[designType].description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-4">
                Additional Features
              </label>
              <div className="space-y-3">
                {(Object.entries(FEATURE_PRICES) as [keyof typeof FEATURE_PRICES, typeof FEATURE_PRICES.seo][]).map(([key, feature]) => (
                  <button
                    key={key}
                    onClick={() => toggleFeature(key)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${
                      selectedFeatures.includes(key)
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        selectedFeatures.includes(key) ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        {selectedFeatures.includes(key) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium">{feature.name}</div>
                        <div className="text-gray-400 text-xs">{feature.description}</div>
                      </div>
                    </div>
                    <div className="text-white font-semibold">
                      +{formatCurrency(feature.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hosting Duration */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-3">
                Hosting Duration
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={hostingYears}
                  onChange={(e) => setHostingYears(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="w-24 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {hostingYears} {hostingYears === 1 ? 'year' : 'years'}
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {formatCurrency(HOSTING_PRICE_PER_YEAR)}/year includes domain & SSL
              </p>
            </div>
          </div>

          {/* Cost Breakdown Section */}
          <div className="space-y-6">
            {/* Total Cost Card */}
            <div className={`bg-gradient-to-br ${getDesignColor()} rounded-2xl p-8 text-white`}>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <span className="text-white/80 font-medium">Estimated Total</span>
              </div>
              <div className="text-5xl font-bold mb-2">
                {formatCurrency(costBreakdown.total)}
              </div>
              <div className="text-white/70">
                One-time payment + {hostingYears} year hosting
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4">
                Cost Breakdown
              </h3>
              <div className="space-y-4">
                {/* Design Cost */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400">🎨</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{DESIGN_PRICES[designType].name} Design</div>
                      <div className="text-gray-500 text-xs">Base design cost</div>
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    {formatCurrency(costBreakdown.design)}
                  </div>
                </div>

                {/* Pages Cost */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">📄</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">Pages ({numPages})</div>
                      <div className="text-gray-500 text-xs">
                        {formatCurrency(DESIGN_PRICES[designType].pricePerPage)}/page × {numPages}
                      </div>
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    {formatCurrency(costBreakdown.pages)}
                  </div>
                </div>

                {/* Features Cost */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400">✨</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">Features ({selectedFeatures.length})</div>
                      <div className="text-gray-500 text-xs">
                        {selectedFeatures.length > 0 
                          ? selectedFeatures.map(f => FEATURE_PRICES[f as keyof typeof FEATURE_PRICES]?.name).join(', ')
                          : 'No features selected'}
                      </div>
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    {formatCurrency(costBreakdown.features)}
                  </div>
                </div>

                {/* Hosting Cost */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-400">🌐</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">Hosting ({hostingYears} {hostingYears === 1 ? 'year' : 'years'})</div>
                      <div className="text-gray-500 text-xs">
                        {formatCurrency(HOSTING_PRICE_PER_YEAR)}/year × {hostingYears}
                      </div>
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    {formatCurrency(costBreakdown.hosting)}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-white font-bold text-lg">Total</div>
                    <div className="text-white font-bold text-xl">
                      {formatCurrency(costBreakdown.total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> This is an estimate. Final pricing may vary based on specific requirements, 
                custom functionality, and ongoing maintenance needs. Contact us for a detailed quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCostCalculator;
