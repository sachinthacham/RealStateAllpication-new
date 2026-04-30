import { Crown, Check, X, Star } from 'lucide-react';

export default function MembershipPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Membership</h1>

      {/* Current Membership Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-800">Regular Member</h2>
            </div>
            <p className="text-gray-600">Free membership with basic features</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Regular', price: 'Free', features: ['5 active ads', 'Basic support', 'Standard listing'] },
          { title: 'Premium', price: 'Rs 999/month', popular: true, features: ['50 active ads', 'Priority support', 'Featured listings', 'Analytics dashboard'] },
          { title: 'Business', price: 'Rs 2,499/month', features: ['Unlimited ads', '24/7 support', 'Agent badge', 'Advanced analytics', 'API access'] },
        ].map((plan) => (
          <div key={plan.title} className={`border rounded-xl p-6 ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
            {plan.popular && (
              <div className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
            <div className="text-3xl font-bold mb-4">{plan.price}</div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
              {plan.title === 'Regular' ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}