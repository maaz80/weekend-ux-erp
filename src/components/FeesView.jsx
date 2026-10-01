import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import {
  HiOutlineCurrencyRupee,
  HiOutlineCreditCard,
  HiOutlinePlusCircle,
  HiOutlineSearch,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineX
} from "react-icons/hi";

export default function FeesView({
  payments = [],
  financials = {},
  students = [],
  onRecordPayment
}) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");

  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    paymentMode: "UPI",
    transactionId: "",
    notes: "",
    receivedBy: "Counselor"
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredPayments = payments.filter((p) => {
    const student = p.student || {};
    const matchesSearch =
      !search ||
      (student.name && student.name.toLowerCase().includes(search.toLowerCase())) ||
      (student.studentId && student.studentId.toLowerCase().includes(search.toLowerCase())) ||
      (p.receiptNo && p.receiptNo.toLowerCase().includes(search.toLowerCase()));

    const matchesMode = modeFilter === "all" || p.paymentMode === modeFilter;
    return matchesSearch && matchesMode;
  });

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amount) return;
    try {
      setSubmitting(true);
      await onRecordPayment(formData);
      setShowModal(false);
      setFormData({
        studentId: "",
        amount: "",
        paymentMode: "UPI",
        transactionId: "",
        notes: "",
        receivedBy: "Counselor"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = financials.totalRevenue || 0;
  const totalPaid = financials.totalPaid || 0;
  const totalPending = financials.totalPending || 0;
  const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projected Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Total Course Revenue</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</h3>
          <p className="text-[11px] text-slate-500 mt-1">From all student enrollments</p>
        </div>

        {/* Fees Collected */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600">Total Fees Collected</p>
          <h3 className="text-xl font-bold text-emerald-700 mt-1">₹{totalPaid.toLocaleString("en-IN")}</h3>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-rose-500">Outstanding Pending Balance</p>
          <h3 className="text-xl font-bold text-rose-600 mt-1">₹{totalPending.toLocaleString("en-IN")}</h3>
          <p className="text-[11px] text-rose-400 mt-1">Installments due for collection</p>
        </div>

        {/* Collection Ratio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Collection Efficiency</p>
            <h3 className="text-xl font-bold text-zinc-950 mt-1">{collectionRate}%</h3>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-3 py-2 bg-official hover:bg-official/90 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <HiOutlinePlusCircle className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <HiOutlineSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, ID or receipt #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-44">
          <CustomDropdown
            value={modeFilter}
            onChange={setModeFilter}
            options={[
              { value: "all", label: "All Modes" },
              { value: "UPI", label: "UPI" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cash", label: "Cash" },
              { value: "Card", label: "Card" }
            ]}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <HiOutlineDocumentText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Payment Transactions</h3>
            <p className="text-xs text-slate-400">Record a fee installment to generate a payment receipt.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Mode / Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const st = p.student || {};
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-950">
                        {p.receiptNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{st.name || "Student"}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{st.studentId}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {st.course || "UI/UX"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-600 text-sm">
                          ₹{Number(p.amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {p.paymentMode}
                        </span>
                        {p.transactionId && (
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-32">
                            {p.transactionId}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(p.paymentDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {p.receivedBy || "Counselor"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm">Record Fee Installment</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Student</label>
                <CustomDropdown
                  value={formData.studentId}
                  onChange={(val) => setFormData({ ...formData, studentId: val })}
                  placeholder="-- Choose Student --"
                  searchable={true}
                  options={[
                    { value: "", label: "-- Choose Student --" },
                    ...students.map((st) => ({
                      value: st._id,
                      label: `${st.name} (${st.studentId}) — Due: ₹${(st.feeDetails?.balance || 0).toLocaleString("en-IN")}`
                    }))
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 15000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
                  <CustomDropdown
                    value={formData.paymentMode}
                    onChange={(val) => setFormData({ ...formData, paymentMode: val })}
                    options={[
                      { value: "UPI", label: "UPI / GPay" },
                      { value: "Bank Transfer", label: "Bank Transfer (NEFT/IMPS)" },
                      { value: "Cash", label: "Cash" },
                      { value: "Card", label: "Card" }
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  placeholder="Optional reference number"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. 1st installment paid"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-zinc-950 bg-official hover:bg-official/90 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Recording..." : "Confirm & Save Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
