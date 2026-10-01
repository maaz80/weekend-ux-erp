import {
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineCurrencyRupee,
  HiOutlineUserAdd,
  HiOutlineRefresh,
  HiOutlinePlusCircle,
  HiOutlineArrowRight
} from "react-icons/hi";

export default function OverviewView({
  stats = {},
  students = [],
  batches = [],
  onOpenAddModal,
  onSyncCrm,
  setActiveTab,
  onSelectStudent
}) {
  const fin = stats.financials || {};
  const totalRev = fin.totalRevenue || 0;
  const totalPaid = fin.totalPaid || 0;
  const totalPending = fin.totalPending || 0;
  const collectionRate = totalRev > 0 ? Math.round((totalPaid / totalRev) * 100) : 0;

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Weekend UX Operations & ERP Hub
            </h1>
            <span className="bg-official/20 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-full border border-official/40">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management for enrolled students, weekend batches, and course fee collections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSyncCrm}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold cursor-pointer transition-all active:scale-95"
          >
            <HiOutlineRefresh className="w-4 h-4 text-slate-500" />
            <span>Sync CRM Leads</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-official hover:bg-official/90 text-zinc-950 text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <HiOutlineUserAdd className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Enrolled</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalStudents || 0}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {stats.activeStudents || 0} Active Learners
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-official/20 text-zinc-950 flex items-center justify-center font-bold">
            <HiOutlineAcademicCap className="w-6 h-6" />
          </div>
        </div>

        {/* Batches Count */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Active Cohorts</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.batchesCount || 0}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Weekend Live Sessions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <HiOutlineUserGroup className="w-6 h-6" />
          </div>
        </div>

        {/* Total Fee Collected */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600">Fees Collected</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">
              ₹{totalPaid.toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">{collectionRate}% Collection Rate</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <HiOutlineCurrencyRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Outstanding Pending Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-500">Balance Pending</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              ₹{totalPending.toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] text-rose-400 mt-1">Pending Installments</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <HiOutlineCurrencyRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Split: Recent Students + Active Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Enrollments</h3>
            <button
              onClick={() => setActiveTab("students")}
              className="text-xs font-semibold text-official hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {students.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No students enrolled yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.slice(0, 5).map((st) => (
                <div
                  key={st._id}
                  onClick={() => onSelectStudent(st)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-official font-bold text-xs flex items-center justify-center">
                      {st.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{st.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {st.studentId} • {st.course.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      st.feeDetails?.paymentStatus === "Paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {st.feeDetails?.paymentStatus || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cohort Batches Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Current Cohort Batches</h3>
            <button
              onClick={() => setActiveTab("batches")}
              className="text-xs font-semibold text-official hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Batches</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {batches.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No cohorts created yet.</p>
          ) : (
            <div className="space-y-3">
              {batches.slice(0, 4).map((b) => (
                <div
                  key={b._id}
                  className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 text-xs">{b.name}</p>
                      <span className="text-[10px] font-bold bg-official/20 text-zinc-950 px-2 py-0.2 rounded border border-official/30">
                        {b.batchCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{b.schedule}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{b.studentCount || 0} Students</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
