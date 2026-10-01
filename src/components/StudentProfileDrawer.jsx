import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import {
  HiOutlineX,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineLockOpen,
  HiOutlineLockClosed,
  HiOutlineKey,
  HiOutlineCheckCircle,
  HiOutlineClipboardCheck
} from "react-icons/hi";

export default function StudentProfileDrawer({
  student,
  isOpen,
  onClose,
  onUpdateStudent,
  onRecordPayment,
  onDeleteStudent,
  onAddNote,
  batches = [],
  academyCourses = [],
  onUnlockCourse,
  onRevokeCourse
}) {
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [recording, setRecording] = useState(false);
  const [selectedCourseToUnlock, setSelectedCourseToUnlock] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockSuccessMsg, setUnlockSuccessMsg] = useState("");
  const [unlockErrorMsg, setUnlockErrorMsg] = useState("");

  if (!isOpen || !student) return null;

  const fee = student.feeDetails || {};
  const paidPercent = fee.finalFee > 0 ? Math.min(Math.round((fee.paidAmount / fee.finalFee) * 100), 100) : 0;
  const attendance = student.attendance || student.attendanceStats || { totalSessions: 0, attendedSessions: 0, percentage: 0 };
  const attHistory = student.attendance?.history || [];

  const handleStatusChange = async (newStatus) => {
    await onUpdateStudent(student._id, { status: newStatus });
  };

  const handleBatchChange = async (batchId) => {
    await onUpdateStudent(student._id, { batch: batchId || null });
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      setAddingNote(true);
      await onAddNote(student._id, newNote);
      setNewNote("");
    } finally {
      setAddingNote(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) return;
    try {
      setRecording(true);
      await onRecordPayment({
        studentId: student._id,
        amount: Number(paymentAmount),
        paymentMode,
        transactionId,
        notes: paymentNotes
      });
      setPaymentAmount("");
      setTransactionId("");
      setPaymentNotes("");
      setShowPaymentForm(false);
    } finally {
      setRecording(false);
    }
  };

  const handleUnlockCourse = async (e) => {
    e.preventDefault();
    if (!selectedCourseToUnlock) return;
    try {
      setUnlocking(true);
      setUnlockErrorMsg("");
      setUnlockSuccessMsg("");
      await onUnlockCourse(student._id, selectedCourseToUnlock);
      setUnlockSuccessMsg("LMS Course unlocked successfully!");
      setSelectedCourseToUnlock("");
      setTimeout(() => setUnlockSuccessMsg(""), 4000);
    } catch (err) {
      setUnlockErrorMsg(err.message || "Failed to unlock course");
      setTimeout(() => setUnlockErrorMsg(""), 5000);
    } finally {
      setUnlocking(false);
    }
  };

  const handleRevokeCourse = async (courseId) => {
    if (window.confirm("Revoke website LMS course access for this student?")) {
      try {
        setUnlockErrorMsg("");
        await onRevokeCourse(student._id, courseId);
        setUnlockSuccessMsg("LMS Course access revoked.");
        setTimeout(() => setUnlockSuccessMsg(""), 3500);
      } catch (err) {
        setUnlockErrorMsg(err.message || "Failed to revoke course access");
        setTimeout(() => setUnlockErrorMsg(""), 5000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-left">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-official/20 text-zinc-950 font-bold text-xs px-2.5 py-0.5 rounded-full border border-official/40">
                  {student.studentId}
                </span>
                {student.isDuplicate && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Duplicate
                  </span>
                )}
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    student.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : student.status === "Completed"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {student.status}
                </span>
                {(attendance.totalSessions || 0) > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      (attendance.percentage || 0) >= 75
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : (attendance.percentage || 0) >= 50
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    📊 {attendance.percentage}% Attendance
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{student.name}</h2>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <p className="text-xs text-slate-500 font-medium">{student.course}</p>
                {(student.unlockedCourses || []).length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🟢 {(student.unlockedCourses || []).length} LMS Course(s) Active
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Contact & Batch */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <HiOutlinePhone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${student.phone}`} className="hover:text-official hover:underline font-medium">
                  {student.phone}
                </a>
              </div>
              {student.email && (
                <div className="flex items-center gap-2.5 text-slate-700">
                  <HiOutlineMail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${student.email}`} className="hover:text-official hover:underline truncate">
                    {student.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-slate-700">
                <HiOutlineCalendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Enrolled: {new Date(student.enrollmentDate || student.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>

            {/* Duplicate Linked Profiles Banner */}
            {student.linkedProfiles && student.linkedProfiles.length > 0 && (
              <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Unified Student Record (Duplicate Linked)</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Shares contact details with:{" "}
                  {student.linkedProfiles.map((lp, idx) => (
                    <span key={idx} className="font-semibold text-amber-900">
                      {lp.name} ({lp.studentId} - {lp.course}){idx < student.linkedProfiles.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  . All fee receipts and LMS course unlocks are unified across both profiles.
                </p>
              </div>
            )}

            {/* Enrolled Course Display */}
            {/* <div className="p-3.5 bg-official/10 border border-official/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-950/70 uppercase tracking-wider block">
                  Enrolled Course Program
                </span>
                <p className="font-bold text-zinc-950 text-xs mt-0.5">{student.course}</p>
              </div>
              <span className="text-[10px] font-bold bg-white text-zinc-950 px-2 py-0.5 rounded-md border border-official/40 shadow-2xs">
                Curriculum
              </span>
            </div> */}

            {/* Batch Allocation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <HiOutlineAcademicCap className="w-4 h-4 text-slate-400" />
                  <span>Assigned Batch Cohort (Live Class Schedule)</span>
                </label>
                {student.batch ? (
                  <button
                    onClick={() => handleBatchChange("")}
                    className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                  >
                    Unassign
                  </button>
                ) : null}
              </div>
              <CustomDropdown
                value={student.batch?._id || student.batch || ""}
                onChange={(val) => handleBatchChange(val)}
                placeholder="Unassigned (No Batch Cohort Selected)"
                options={[
                  { value: "", label: "Unassigned (No Batch Cohort Selected)" },
                  ...batches.map((b) => {
                    const firstWord = (student.course || "").split(" ")[0].toLowerCase();
                    const isMatch = b.course && b.course.toLowerCase().includes(firstWord);
                    return {
                      value: b._id,
                      label: `${b.name} — ${b.schedule} ${isMatch ? "★ [Matching Course]" : `(${b.course})`}`
                    };
                  })
                ]}
              />
              <p className="text-[10px] text-slate-400">
                Note: <strong>Course</strong> is what they study (e.g. {student.course}). <strong>Batch Cohort</strong> is their live class timing (e.g. Weekend Sat-Sun).
              </p>
            </div>

            {/* Academic Status Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Student Status</label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-center">
                {["Active", "Completed", "On-Hold", "Dropped"].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      student.status === st
                        ? "bg-white text-zinc-950 font-bold shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Class Attendance & Participation Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-official/20 text-zinc-950 flex items-center justify-center font-bold">
                    <HiOutlineClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Class Attendance Tracker</span>
                    <span className="text-[10px] text-slate-400">Live Weekend Design Sessions</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    (attendance.percentage || 0) >= 75
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : (attendance.percentage || 0) >= 50
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : (attendance.totalSessions || 0) === 0
                      ? "bg-slate-100 text-slate-500 border border-slate-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {(attendance.totalSessions || 0) === 0
                    ? "No Sessions Yet"
                    : `${attendance.percentage || 0}% Attended`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>
                    Attended {attendance.attendedSessions || 0} of {attendance.totalSessions || 0} session(s)
                  </span>
                  <span className="font-bold text-slate-700">{attendance.percentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      (attendance.percentage || 0) >= 75
                        ? "bg-emerald-500"
                        : (attendance.percentage || 0) >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(attendance.percentage || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Attendance Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Total Classes</p>
                  <p className="font-bold text-slate-700">{attendance.totalSessions || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Present / Attended</p>
                  <p className="font-bold text-emerald-600">{attendance.attendedSessions || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Missed / Absent</p>
                  <p className="font-bold text-rose-600">
                    {Math.max((attendance.totalSessions || 0) - (attendance.attendedSessions || 0), 0)}
                  </p>
                </div>
              </div>

              {/* Session History Log if available */}
              {attHistory.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span>Recent Sessions Log</span>
                    <span className="text-[10px] text-slate-400 font-mono">{attHistory.length} record(s)</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {attHistory.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-800 text-[11px] truncate">
                            {s.topic || "Weekend Session"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {s.date ? new Date(s.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : ""}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            s.status === "Present"
                              ? "bg-emerald-100 text-emerald-800"
                              : s.status === "Late"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Financials & Fee Balance Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HiOutlineCurrencyRupee className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Fee Ledger</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    fee.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : fee.paymentStatus === "Partial"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {fee.paymentStatus || "Pending"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Paid: ₹{(fee.paidAmount || 0).toLocaleString("en-IN")}</span>
                  <span>{paidPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Total Fee</p>
                  <p className="font-semibold text-slate-700">₹{(fee.finalFee || 0).toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Paid</p>
                  <p className="font-semibold text-emerald-600">₹{(fee.paidAmount || 0).toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Balance Due</p>
                  <p className="font-bold text-rose-600">₹{(fee.balance || 0).toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Payment Receipts History */}
              {student.payments && student.payments.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span>Payment Receipts</span>
                    <span className="text-[10px] text-slate-400 font-mono">{student.payments.length} receipt(s)</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {student.payments.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-mono font-bold text-slate-800 text-[11px]">{p.receiptNo}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(p.paymentDate || p.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}{" "}
                            • {p.paymentMode}
                          </p>
                        </div>
                        <span className="font-bold text-emerald-600 text-xs">
                          ₹{(Number(p.amount) || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Record Payment Toggle */}
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-official/20 hover:bg-official/30 border border-official/40 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  <span>Record Fee Installment</span>
                </button>
              ) : (
                <form onSubmit={handleRecordPayment} className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">New Payment</span>
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      required
                      placeholder="Amount (₹)"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-official"
                    />
                    <CustomDropdown
                      value={paymentMode}
                      onChange={setPaymentMode}
                      options={[
                        { value: "UPI", label: "UPI / GPay" },
                        { value: "Bank Transfer", label: "Bank Transfer" },
                        { value: "Cash", label: "Cash" },
                        { value: "Card", label: "Card" }
                      ]}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Transaction ID / Reference (optional)"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-official"
                  />
                  <button
                    type="submit"
                    disabled={recording}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {recording ? "Recording..." : `Confirm ₹${paymentAmount || 0} Payment`}
                  </button>
                </form>
              )}
            </div>

            {/* LMS Website Course Access & Unlock Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <HiOutlineLockOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">LMS Website Course Access</span>
                    <span className="text-[10px] text-slate-400">Recorded Videos, Lessons & Portal Curriculum</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {(student.unlockedCourses || []).length} Active Course(s)
                </span>
              </div>

              {unlockSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 animate-fade-in">
                  <HiOutlineCheckCircle className="w-4 h-4 shrink-0" />
                  <span>{unlockSuccessMsg}</span>
                </div>
              )}

              {/* List of currently unlocked courses */}
              {(student.unlockedCourses || []).length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Currently Unlocked Courses ({(student.unlockedCourses || []).length})
                  </span>
                  {student.unlockedCourses.map((uc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gradient-to-r from-emerald-50/70 to-slate-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs transition-all shadow-2xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-emerald-600 font-bold text-sm">✓</span>
                          <p className="font-bold text-slate-900 truncate">{uc.courseTitle || "Course"}</p>
                          {uc.price ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-zinc-950 border border-slate-200 shadow-2xs">
                              ₹{Number(uc.price).toLocaleString("en-IN")}
                            </span>
                          ) : null}
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            ACTIVE ACCESS
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Access Granted: {new Date(uc.unlockedAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} • {uc.unlockedBy || "Counselor"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRevokeCourse(uc.courseId || uc.courseSlug)}
                        className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-transparent hover:border-rose-200 transition-all cursor-pointer shrink-0"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                  <p className="text-xs text-slate-400 italic">No website LMS courses unlocked yet for this student.</p>
                </div>
              )}

              {/* Unlock Additional Course Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-800 block">
                    Unlock Course on LMS Portal:
                  </label>
                  <span className="text-[10px] font-medium text-slate-400">Website Dashboard Access</span>
                </div>

                {unlockErrorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                    <HiOutlineX className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{unlockErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUnlockCourse} className="space-y-3">
                  <div className="w-full">
                    <CustomDropdown
                      value={selectedCourseToUnlock}
                      onChange={setSelectedCourseToUnlock}
                      placeholder="-- Choose Course to Unlock --"
                      options={[
                        { value: "", label: "-- Choose Course to Unlock --" },
                        ...academyCourses.map((c) => {
                          const isAlreadyUnlocked = (student.unlockedCourses || []).some(
                            (uc) =>
                              (uc.courseId && uc.courseId === c._id) ||
                              (uc.courseSlug && uc.courseSlug === c.slug) ||
                              (uc.courseTitle && uc.courseTitle.toLowerCase().replace(/[^a-z0-9]/g, "") === (c.title || "").toLowerCase().replace(/[^a-z0-9]/g, ""))
                          );
                          return {
                            value: c._id,
                            label: isAlreadyUnlocked
                              ? `✓ ${c.title} (Already Unlocked)`
                              : `${c.title} ${c.price ? `(₹${Number(c.price).toLocaleString("en-IN")})` : ""}`,
                            disabled: isAlreadyUnlocked
                          };
                        })
                      ]}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={unlocking || !selectedCourseToUnlock}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-official hover:bg-official/90 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <HiOutlineKey className="w-4 h-4" />
                    <span>
                      {unlocking
                        ? "Unlocking Access & Updating LMS..."
                        : selectedCourseToUnlock
                        ? "Unlock & Save Access on Website LMS"
                        : "Select a Course Above to Unlock"}
                    </span>
                  </button>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Clicking <strong>"Unlock & Save Access"</strong> activates website LMS access for this student and records it in their ERP profile.
                  </p>
                </form>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Academic & Counselor Notes
              </h4>
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add academic remarks or feedback..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  {addingNote ? "Adding..." : "Add Note"}
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2 pt-2">
                {student.notes && student.notes.length > 0 ? (
                  student.notes.map((n, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                      <p className="text-slate-800">{n.text}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{n.author || "Counselor"}</span>
                        <span>{new Date(n.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">No notes added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Delete Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove ${student.name} from ERP records?`)) {
                  onDeleteStudent(student._id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              <HiOutlineTrash className="w-4 h-4" />
              <span>Delete Student Record</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
