import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineUserAdd,
  HiOutlineRefresh,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineEye,
  HiOutlineCreditCard,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineClipboardCheck,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineCheckCircle
} from "react-icons/hi";

export default function StudentsView({
  students = [],
  loading,
  onSelectStudent,
  onOpenAddModal,
  onSyncCrm,
  batches = [],
  searchQuery,
  setSearchQuery,
  selectedCourse,
  setSelectedCourse,
  selectedStatus,
  setSelectedStatus,
  selectedPaymentStatus,
  setSelectedPaymentStatus
}) {
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'list'

  return (
    <div className="space-y-5 animate-fade-in font-sans">
      {/* Top Controls: Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <HiOutlineSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
          />
        </div>

        {/* Filter Dropdowns & Enroll CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Course filter */}
          <div className="w-44">
            <CustomDropdown
              value={selectedCourse}
              onChange={setSelectedCourse}
              options={[
                { value: "all", label: "All Courses" },
                { value: "UI/UX Design Masterclass", label: "UI/UX Masterclass" },
                { value: "Advanced Figma & Design Systems", label: "Advanced Figma" },
                { value: "Product Design & Case Study Mentorship", label: "Product Design" },
                { value: "Motion Design & Micro-interactions", label: "Motion Design" }
              ]}
            />
          </div>

          {/* Academic Status filter */}
          <div className="w-36">
            <CustomDropdown
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Active", label: "Active" },
                { value: "Completed", label: "Completed" },
                { value: "On-Hold", label: "On-Hold" },
                { value: "Dropped", label: "Dropped" }
              ]}
            />
          </div>

          {/* Fee Payment filter */}
          <div className="w-36">
            <CustomDropdown
              value={selectedPaymentStatus}
              onChange={setSelectedPaymentStatus}
              options={[
                { value: "all", label: "All Fee Status" },
                { value: "Paid", label: "Fully Paid" },
                { value: "Partial", label: "Partial Dues" },
                { value: "Pending", label: "Pending" }
              ]}
            />
          </div>

          {/* Enroll Student Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-official hover:bg-official/90 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <HiOutlineUserAdd className="w-4 h-4" />
            <span>Enroll</span>
          </button>
        </div>
      </div>

      {/* Directory Sub-Header: Total Counter & View Mode Switcher */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Enrolled Students
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {students.length}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "cards"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HiOutlineViewGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HiOutlineViewList className="w-3.5 h-3.5" />
            <span>Spacious Rows</span>
          </button>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-official border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading Student Records...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs py-20 px-4 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-official/20 text-zinc-950 flex items-center justify-center mx-auto text-xl font-bold">
            <HiOutlineAcademicCap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No Student Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Enroll your first student manually or import enrolled leads directly from the Weekend UX CRM.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-official text-zinc-950 font-bold text-xs rounded-xl hover:bg-official/90 transition-all cursor-pointer"
            >
              Enroll New Student
            </button>
            <button
              onClick={onSyncCrm}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Import from CRM
            </button>
          </div>
        </div>
      ) : viewMode === "cards" ? (
        /* ========================================================================= */
        /* MODE 1: SPACIOUS STUDENT CARDS (Grid View with Generous Height & Hierarchy) */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {students.map((student) => {
            const fee = student.feeDetails || {};
            const att = student.attendanceStats || {};
            const hasAtt = (att.totalSessions || 0) > 0;

            return (
              <div
                key={student._id}
                onClick={() => onSelectStudent(student)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group space-y-4"
              >
                {/* 1. Card Top: Identity & Status */}
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 text-official font-bold text-base flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-zinc-950">
                            {student.name}
                          </h4>
                          {student.isDuplicate && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                              Duplicate
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono font-medium block">
                          {student.studentId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                        student.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : student.status === "Completed"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : student.status === "On-Hold"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* 2. Course & Batch Info Box */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-800">
                      <HiOutlineAcademicCap className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold truncate">{student.course}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <HiOutlineClock className="w-4 h-4 text-slate-400 shrink-0" />
                      {student.batch ? (
                        <span className="truncate">
                          <strong className="text-slate-800">{student.batch.name}</strong> •{" "}
                          {student.batch.schedule || "Weekend Live"}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No Batch Cohort Assigned</span>
                      )}
                    </div>
                  </div>

                  {/* 3. Metrics Grid: Attendance & Fee Ledger */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Attendance Meter */}
                    <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-1.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Attendance
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                            hasAtt && att.percentage >= 75
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : hasAtt && att.percentage >= 50
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : hasAtt
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {hasAtt ? `${att.percentage}%` : "No Sessions"}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700">
                        {hasAtt ? `${att.attendedSessions}/${att.totalSessions} Sessions` : "Not recorded yet"}
                      </p>
                      {hasAtt ? (
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              att.percentage >= 75
                                ? "bg-emerald-500"
                                : att.percentage >= 50
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(att.percentage, 100)}%` }}
                          />
                        </div>
                      ) : (
                        <div className="w-full bg-slate-200/60 rounded-full h-1.5" />
                      )}
                    </div>

                    {/* Fee Ledger */}
                    <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-1.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Fee Ledger
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                            fee.paymentStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : fee.paymentStatus === "Partial"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {fee.paymentStatus || "Pending"}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700">
                        Paid:{" "}
                        <span className="text-emerald-600 font-bold">
                          ₹{(fee.paidAmount || 0).toLocaleString("en-IN")}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Due:{" "}
                        <span
                          className={
                            fee.balance > 0 ? "font-bold text-rose-600" : "font-semibold text-slate-600"
                          }
                        >
                          ₹{(fee.balance || 0).toLocaleString("en-IN")}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* 4. Contact Details */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <HiOutlinePhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{student.phone}</span>
                    </div>
                    {student.email && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-40">
                        <HiOutlineMail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Card Bottom: LMS Badge & Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {(student.unlockedCourses || []).length > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        🟢 {(student.unlockedCourses || []).length} LMS Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Website LMS Locked</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student);
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <HiOutlineEye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: SPACIOUS ROW CARDS (Multi-Tier Row Cards with Height & Alignment) */
        /* ========================================================================= */
        <div className="space-y-3">
          {students.map((student) => {
            const fee = student.feeDetails || {};
            const att = student.attendanceStats || {};
            const hasAtt = (att.totalSessions || 0) > 0;

            return (
              <div
                key={student._id}
                onClick={() => onSelectStudent(student)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all p-4.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 cursor-pointer group"
              >
                {/* 1. Identity */}
                <div className="flex items-center gap-3 xl:w-72 shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-official font-bold text-base flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-zinc-950">
                        {student.name}
                      </h4>
                      {student.isDuplicate && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                          Duplicate
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400 font-mono font-medium">
                        {student.studentId}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                          student.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : student.status === "Completed"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Program & Batch */}
                <div className="xl:w-64 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <HiOutlineAcademicCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{student.course}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <HiOutlineClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {student.batch ? (
                      <span className="truncate">
                        <strong>{student.batch.name}</strong> ({student.batch.schedule || "Weekend"})
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">No Batch Assigned</span>
                    )}
                  </div>
                </div>

                {/* 3. Attendance Meter */}
                <div className="xl:w-48 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Attendance
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        hasAtt && att.percentage >= 75
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : hasAtt && att.percentage >= 50
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : hasAtt
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-400 border-slate-200"
                      }`}
                    >
                      {hasAtt ? `${att.percentage}% Attended` : "No sessions"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        hasAtt && att.percentage >= 75
                          ? "bg-emerald-500"
                          : hasAtt && att.percentage >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(att.percentage || 0, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-right">
                    {hasAtt ? `${att.attendedSessions}/${att.totalSessions} sessions` : "Not recorded"}
                  </p>
                </div>

                {/* 4. Fee Ledger */}
                <div className="xl:w-48 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Fee Status
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
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
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Paid:</span>
                    <span className="font-bold text-emerald-600 text-xs">
                      ₹{(fee.paidAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Due:</span>
                    <span className={fee.balance > 0 ? "font-bold text-rose-600" : "text-slate-600"}>
                      ₹{(fee.balance || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* 5. Contact & Action */}
                <div className="flex items-center justify-between xl:justify-end gap-4 xl:w-56 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                  <div className="space-y-0.5 text-xs text-left xl:text-right">
                    <p className="font-semibold text-slate-700">{student.phone}</p>
                    {student.email && (
                      <p className="text-[11px] text-slate-400 truncate max-w-36">{student.email}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student);
                    }}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
                  >
                    <HiOutlineEye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
