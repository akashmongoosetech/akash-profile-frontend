import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, Percent, Calendar, Info, TrendingUp } from 'lucide-react';

/**
 * EMICalculator Component
 * 
 * A fully functional EMI (Equated Monthly Installment) calculator.
 * Features:
 * - Correct EMI formula implementation
 * - Real-time calculation
 * - Detailed breakdown showing principal, interest, and total
 * - Input validation
 * - Professional UI with visualizations
 */

const EMICalculator: React.FC = () => {
  // State for loan inputs
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('10.5');
  const [loanTenure, setLoanTenure] = useState<string>('3');

  // Validation errors state
  const [errors, setErrors] = useState<{
    loanAmount?: string;
    interestRate?: string;
    loanTenure?: string;
  }>({});

  // Validate inputs
  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const tenure = parseInt(loanTenure);

    if (!loanAmount || isNaN(amount)) {
      newErrors.loanAmount = 'Please enter a valid loan amount';
    } else if (amount < 50000) {
      newErrors.loanAmount = 'Minimum loan amount is ₹50,000';
    } else if (amount > 100000000) {
      newErrors.loanAmount = 'Maximum loan amount is ₹10,00,00,000';
    }

    if (!interestRate || isNaN(rate)) {
      newErrors.interestRate = 'Please enter a valid interest rate';
    } else if (rate <= 0) {
      newErrors.interestRate = 'Interest rate must be greater than 0';
    } else if (rate > 50) {
      newErrors.interestRate = 'Interest rate cannot exceed 50%';
    }

    if (!loanTenure || isNaN(tenure)) {
      newErrors.loanTenure = 'Please enter a valid tenure';
    } else if (tenure < 1) {
      newErrors.loanTenure = 'Minimum tenure is 1 year';
    } else if (tenure > 30) {
      newErrors.loanTenure = 'Maximum tenure is 30 years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate EMI using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
  // Where: P = Principal, R = Monthly interest rate, N = Number of monthly installments
  const emiCalculation = useMemo(() => {
    const principal = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const years = parseInt(loanTenure) || 0;

    if (principal <= 0 || annualRate <= 0 || years <= 0) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalAmount: principal,
        isValid: false
      };
    }

    // Convert annual rate to monthly rate
    const monthlyRate = (annualRate / 12) / 100;
    
    // Convert years to months
    const numberOfMonths = years * 12;

    // Calculate EMI using the formula
    let emi: number;
    if (monthlyRate === 0) {
      // If interest rate is 0, simple division
      emi = principal / numberOfMonths;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, numberOfMonths);
      emi = (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);
    }

    const totalPayment = emi * numberOfMonths;
    const totalInterest = totalPayment - principal;

    return {
      emi: Math.round(emi * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      principalAmount: principal,
      numberOfMonths,
      monthlyRate,
      isValid: true
    };
  }, [loanAmount, interestRate, loanTenure]);

  // Format currency (Indian Rupee)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format large numbers with commas
  const formatNumber = (num: string): string => {
    const value = num.replace(/[^0-9]/g, '');
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle input change with formatting
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLoanAmount(value);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow decimal numbers only
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInterestRate(value);
    }
  };

  const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLoanTenure(value);
  };

  // Calculate percentage for progress bars
  const getInterestPercentage = () => {
    if (emiCalculation.totalPayment === 0) return 0;
    return (emiCalculation.totalInterest / emiCalculation.totalPayment) * 100;
  };

  const getPrincipalPercentage = () => {
    if (emiCalculation.totalPayment === 0) return 0;
    return (emiCalculation.principalAmount / emiCalculation.totalPayment) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            EMI Calculator
          </h1>
          <p className="text-gray-400 text-lg">
            Calculate your monthly loan installments instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-6">
                Loan Details
              </h3>
              
              {/* Loan Amount */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="text"
                    value={formatNumber(loanAmount)}
                    onChange={handleLoanAmountChange}
                    onBlur={validateInputs}
                    placeholder="Enter loan amount"
                    className={`w-full h-14 pl-8 pr-4 bg-gray-700/50 border-2 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors ${
                      errors.loanAmount ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>
                {errors.loanAmount && (
                  <p className="text-red-400 text-sm mt-2">{errors.loanAmount}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Range: ₹50,000 - ₹10,00,00,000
                </p>
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Interest Rate (per annum)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interestRate}
                    onChange={handleInterestRateChange}
                    onBlur={validateInputs}
                    placeholder="Enter interest rate"
                    className={`w-full h-14 pl-4 pr-12 bg-gray-700/50 border-2 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors ${
                      errors.interestRate ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
                {errors.interestRate && (
                  <p className="text-red-400 text-sm mt-2">{errors.interestRate}</p>
                )}
                <div className="flex gap-2 mt-2">
                  {[8, 10, 12, 15].map(rate => (
                    <button
                      key={rate}
                      onClick={() => setInterestRate(rate.toString())}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        interestRate === rate.toString()
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Tenure */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Loan Tenure
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={loanTenure}
                    onChange={handleTenureChange}
                    onBlur={validateInputs}
                    className={`w-24 h-14 pl-4 pr-4 bg-gray-700/50 border-2 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors ${
                      errors.loanTenure ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <span className="text-gray-400 text-lg">years</span>
                </div>
                {errors.loanTenure && (
                  <p className="text-red-400 text-sm mt-2">{errors.loanTenure}</p>
                )}
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 5, 10, 15, 20].map(years => (
                    <button
                      key={years}
                      onClick={() => setLoanTenure(years.toString())}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        loanTenure === years.toString()
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {years}Y
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Formula Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">EMI Formula</h4>
                  <p className="text-blue-200/70 text-sm">
                    EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
                  </p>
                  <p className="text-blue-200/60 text-xs mt-1">
                    Where P = Principal, R = Monthly interest rate, N = Number of installments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Monthly EMI Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6" />
                <span className="text-white/80 font-medium">Monthly EMI</span>
              </div>
              <div className="text-5xl font-bold mb-2">
                {formatCurrency(emiCalculation.emi)}
              </div>
              <div className="text-green-200">
                {emiCalculation.numberOfMonths || 0} monthly payments
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-6">
                Payment Breakdown
              </h3>

              {/* Visual Bar */}
              <div className="mb-6">
                <div className="h-8 bg-gray-700 rounded-lg overflow-hidden flex">
                  <div 
                    className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${getPrincipalPercentage()}%` }}
                  >
                    {getPrincipalPercentage() > 15 && 'Principal'}
                  </div>
                  <div 
                    className="bg-amber-500 h-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${getInterestPercentage()}%` }}
                  >
                    {getInterestPercentage() > 15 && 'Interest'}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-blue-400">Principal: {getPrincipalPercentage().toFixed(1)}%</span>
                  <span className="text-amber-400">Interest: {getInterestPercentage().toFixed(1)}%</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* Principal */}
                <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Principal Amount</div>
                      <div className="text-gray-500 text-xs">Loan amount borrowed</div>
                    </div>
                  </div>
                  <div className="text-white font-bold text-lg">
                    {formatCurrency(emiCalculation.principalAmount)}
                  </div>
                </div>

                {/* Interest */}
                <div className="flex justify-between items-center p-4 bg-amber-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Percent className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Total Interest</div>
                      <div className="text-gray-500 text-xs">
                        {parseFloat(interestRate)}% for {loanTenure} years
                      </div>
                    </div>
                  </div>
                  <div className="text-white font-bold text-lg">
                    {formatCurrency(emiCalculation.totalInterest)}
                  </div>
                </div>

                {/* Total Payment */}
                <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl border-2 border-green-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Total Payment</div>
                      <div className="text-gray-500 text-xs">Principal + Interest</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold text-xl">
                    {formatCurrency(emiCalculation.totalPayment)}
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Summary */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h4 className="text-white font-semibold mb-4">Quick Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Monthly Rate</div>
                  <div className="text-white font-bold text-xl">
                    {((parseFloat(interestRate) || 0) / 12).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Total Payments</div>
                  <div className="text-white font-bold text-xl">
                    {emiCalculation.numberOfMonths || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
