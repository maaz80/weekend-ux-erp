import { useState, useEffect } from "react";
import CustomDropdown from "./CustomDropdown";
import {
  saveSessionAttendance,
  fetchBatchAttendanceByDate,
  fetchBatchAttendanceHistory
} from "../utils/api";
import {
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineCheckCircle
} from "react-icons/hi";

export default function AttendanceView({ batches = [], students = [], onAttendanceSaved }) {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?._id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [topic, setTopic] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Sync selectedBatchId if batches change and no selection yet
  useEffect(() => {
    if (!selectedBatchId && batches.length > 0) {
      setSelectedBatchId(batches[0]._id);
    }
  }, [batches, selectedBatchId]);

  const batchStudents = students.filter(
    (s) => (s.batch?._id || s.batch) === selectedBatchId
  );

  // Load existing attendance for selected batch and date
  useEffect(() => {
    if (!selectedBatchId || !selectedDate) return;

    let isCurrent = true;
    const loadBatchDateAttendance = async () => {
      setLoadingRecord(true);
      setErrorMsg("");
      try {
        const res = await fetchBatchAttendanceByDate(selectedBatchId, selectedDate);
        if (!isCurrent) return;

        if (res.attendance) {
          setTopic(res.attendance.topic || "");
          const records = {};
          (res.attendance.records || res.attendance.students || []).forEach((st) => {
            const sid = st.student?._id || st.student;
            if (sid) {
              records[sid] = st.status;
            }
          });
          setAttendanceRecords(records);
        } else {
          // If no existing record saved, default all to "Present"
          setTopic("");
          const initial = {};
          batchStudents.forEach((st) => {
            initial[st._id] = "Present";
          });
          setAttendanceRecords(initial);
        }
      } catch (err) {
        console.error("Failed to fetch batch attendance:", err);
      } finally {
        if (isCurrent) setLoadingRecord(false);
      }
    };

    loadBatchDateAttendance();

    return () => {
      isCurrent = false;
    };
  }, [selectedBatchId, selectedDate]);

  // Load history of past sessions for this batch
  const loadHistory = async () => {
    if (!selectedBatchId) return;
    setLoadingHistory(true);
    try {
      const res = await fetchBatchAttendanceHistory(selectedBatchId, 10);
      setHistory(res.history || []);
    } catch (err) {
      console.error("Failed to load attendance history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedBatchId]);

  const handleMark = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAll = (status) => {
    const updated = {};
    batchStudents.forEach((s) => {
      updated[s._id] = status;
    });
    setAttendanceRecords(updated);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!selectedBatchId) {
      setErrorMsg("Please select a batch first.");
      return;
    }
    if (batchStudents.length === 0) {
      setErrorMsg("No students in this batch to save attendance for.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");
      setSaveSuccessMsg("");

      const recordsPayload = batchStudents.map((st) => ({
        studentId: st._id,
        status: attendanceRecords[st._id] || "Present"
      }));

      const res = await saveSessionAttendance({
        batchId: selectedBatchId,
        date: selectedDate,
        topic,
        students: recordsPayload
      });

      setSaveSuccessMsg("Attendance successfully saved & student stats updated!");
      setTimeout(() => setSaveSuccessMsg(""), 4000);

      // Refresh history and parent data
      await loadHistory();
      if (onAttendanceSaved) {
        await onAttendanceSaved();
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to save session attendance.");
    } finally {
      setSaving(false);
    }
  };

  // Live Counts for selected date
  const presentCount = batchStudents.filter(
    (s) => (attendanceRecords[s._id] || "Present") === "Present"
  ).length;
  const absentCount = batchStudents.filter(
    (s) => attendanceRecords[s._id] === "Absent"
  ).length;
  const lateCount = batchStudents.filter(
    (s) => attendanceRecords[s._id] === "Late"
  ).length;

  const currentBatch = batches.find((b) => b._id === selectedBatchId);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <HiOutlineClipboardCheck className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Session Attendance Tracker</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track student live class attendance and automatically compute individual attendance percentages.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-fade-in flex items-center gap-2 shadow-2xs">
            <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-fade-in flex items-center gap-2">
            <HiOutlineX className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Cohort & Date Selectors */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Cohort Batch</label>
            <CustomDropdown
              value={selectedBatchId}
              onChange={setSelectedBatchId}
              placeholder="-- Choose Batch --"
              options={[
                { value: "", label: "-- Choose Batch --" },
                ...batches.map((b) => ({
                  value: b._id,
                  label: `${b.name} (${b.schedule || "Weekend"})`
                }))
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Session Topic / Agenda</label>
            <input
              type="text"
              placeholder="e.g. Design Systems & Auto-layout"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
            />
          </div>
        </div>

        {/* Live Attendance Stats Header */}
        {selectedBatchId && batchStudents.length > 0 && (
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-slate-700">
                Enrolled Students: <strong className="text-slate-900">{batchStudents.length}</strong>
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Present: {presentCount} ({batchStudents.length > 0 ? Math.round((presentCount / batchStudents.length) * 100) : 0}%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200/60">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Absent: {absentCount}
              </span>
              {lateCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Late: {lateCount}
                </span>
              )}
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => markAll("Present")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => markAll("Absent")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Mark All Absent
              </button>
            </div>
          </div>
        )}

        {/* Student Roster Table for marking attendance */}
        <div className="pt-1">
          {loadingRecord ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-official border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading attendance record...</p>
            </div>
          ) : !selectedBatchId ? (
            <p className="text-xs text-slate-400 text-center py-8">Please choose a cohort batch above to mark attendance.</p>
          ) : batchStudents.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
              <HiOutlineUserGroup className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                No students assigned to <strong>{currentBatch?.name || "this cohort"}</strong> yet.
              </p>
              <p className="text-[11px] text-slate-400">
                Go to the Students Directory tab to assign students to this batch cohort.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveAttendance} className="space-y-4">
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Overall Attendance</th>
                      <th className="py-3 px-4 text-center">Session Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batchStudents.map((st) => {
                      const currentStatus = attendanceRecords[st._id] || "Present";
                      const overall = st.attendanceStats || {};
                      const hasStats = (overall.totalSessions || 0) > 0;

                      return (
                        <tr key={st._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{st.name}</span>
                              {st.isDuplicate && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                  Duplicate
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">{st.studentId}</td>
                          <td className="py-3 px-4">
                            {hasStats ? (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    overall.percentage >= 75
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : overall.percentage >= 50
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}
                                >
                                  {overall.percentage}%
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({overall.attendedSessions}/{overall.totalSessions} sessions)
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No sessions yet</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              {[
                                { status: "Present", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
                                { status: "Absent", color: "bg-rose-600 hover:bg-rose-700 text-white" },
                                { status: "Late", color: "bg-amber-500 hover:bg-amber-600 text-white" }
                              ].map(({ status, color }) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => handleMark(st._id, status)}
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                    currentStatus === status
                                      ? `${color} shadow-xs font-bold scale-102`
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-slate-400">
                  Tip: Attendance stats are automatically updated across all student profiles immediately upon saving.
                </p>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-official hover:bg-official/90 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Attendance...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineClipboardCheck className="w-4 h-4" />
                      <span>Save Attendance Log</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Past Attendance Sessions for this Cohort */}
      {selectedBatchId && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recent Session History — {currentBatch?.name || "Batch"}
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {history.length} Session(s) Recorded
            </span>
          </div>

          {loadingHistory ? (
            <p className="text-xs text-slate-400 py-4 text-center">Loading session history...</p>
          ) : history.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              No sessions recorded for this cohort yet. Mark attendance above to record the first session!
            </p>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Topic / Agenda</th>
                    <th className="py-2.5 px-4 text-center">Present</th>
                    <th className="py-2.5 px-4 text-center">Absent</th>
                    <th className="py-2.5 px-4 text-center">Attendance %</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((h) => (
                    <tr key={h._id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-semibold text-slate-800 font-mono">
                        {h.dateStr || new Date(h.date).toISOString().split("T")[0]}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {h.topic || <span className="text-slate-400 italic">No topic</span>}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-600">
                        {h.presentCount || 0}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-rose-600">
                        {h.absentCount || 0}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            (h.percentage || 0) >= 75
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : (h.percentage || 0) >= 50
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {h.percentage || 0}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(h.dateStr || new Date(h.date).toISOString().split("T")[0]);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-[11px] font-semibold text-slate-600 hover:text-official hover:underline cursor-pointer"
                        >
                          Edit Session
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
