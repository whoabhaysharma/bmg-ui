import { Activity, User } from "lucide-react"

// --- 3. Mock Dashboard Content (To show scrolling) ---
function DashboardContent() {
    return (
        <div className="px-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-zinc-100">
                    <p className="text-zinc-400 text-xs font-medium mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-zinc-800">₹42.5k</h3>
                    <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
                        ↑ 12% <span className="text-zinc-300 font-normal">vs last week</span>
                    </p>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-zinc-100">
                    <p className="text-zinc-400 text-xs font-medium mb-1">Active Members</p>
                    <h3 className="text-2xl font-bold text-zinc-800">148</h3>
                    <p className="text-zinc-500 text-xs mt-2 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span> Live now
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl shadow-zinc-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Manage Gym</h3>
                        <p className="text-zinc-400 text-sm">Quick access tools</p>
                    </div>
                    <div className="p-2 bg-zinc-800 rounded-full">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                </div>
                <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-zinc-800 py-3 rounded-xl text-sm font-medium hover:bg-zinc-700 transition">Add Member</button>
                    <button className="flex-1 bg-white text-zinc-900 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition">Check-in</button>
                </div>
            </div>

             {/* Recent List */}
             <div>
                <h3 className="font-bold text-zinc-800 text-lg mb-4">Recent Activity</h3>
                <div className="space-y-3 pb-32"> 
                    {[1,2,3,4,5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-50 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-800 text-sm">New Signup</p>
                                    <p className="text-zinc-400 text-xs">2 mins ago</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-zinc-800">+ ₹2,500</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardContent