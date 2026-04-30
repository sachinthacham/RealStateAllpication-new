import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You don't have any ads yet.</h2>
          <p className="text-gray-600 mb-8">Click the Post an ad now button to post your ad.</p>
          
          <Link 
            href="/post-ad"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Post your ad now!
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Dashboard Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-800">0 Active Ads</h4>
            <p className="text-sm text-gray-600">No live ads currently</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-800">Member Since</h4>
            <p className="text-sm text-gray-600">January 2024</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-800">Account Status</h4>
            <p className="text-sm text-gray-600">Verified Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}