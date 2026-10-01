import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import {
  HiOutlineUserGroup,
  HiOutlinePlusCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineX,
  HiOutlineExternalLink,
  HiOutlineTrash
} from "react-icons/hi";

export default function BatchesView({
  batches = [],
  onCreateBatch,
  onDeleteBatch,
  onSelectStudent
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchRoster, setBatchRoster] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    course: "UI/UX Design Masterclass",
    mentorName: "Head Mentor",
    mentorEmail: "",
    schedule: "Sat - Sun (11:00 AM - 1:30 PM)",
    startDate: new Date().toISOString().split("T")[0],
    maxCapacity: 20,
    meetingLink: "",
    classroomUrl: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpenRoster = async (batch) => {
    setSelectedBatch(batch);
    setLoadingRoster(true);
    try {
      const res = await fetch(`http://localhost:5000/api/erp/batches/${batch._id}`);
      const data = await res.json();
      if (data.success && data.batch) {
        setBatchRoster(data.batch.students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      setSubmitting(true);
      await onCreateBatch(formData);
      setShowCreateModal(false);
      setFormData({
        name: "",
        course: "UI/UX Design Masterclass",
        mentorName: "Head Mentor",
        mentorEmail: "",
        schedule: "Sat - Sun (11:00 AM - 1:30 PM)",
        startDate: new Date().toISOString().split("T")[0],
        maxCapacity: 20,
        meetingLink: "",
        classroomUrl: "",
        notes: ""
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Batches & Cohorts Management</h2>
          <p className="text-xs text-slate-400">Organize live weekend classes, schedules, and mentor assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-official hover:bg-official/90 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <HiOutlinePlusCircle className="w-4 h-4" />
          <span>Create New Cohort</span>
        </button>
      </div>

      {/* Batches Grid */}
      {batches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-official/20 text-zinc-950 flex items-center justify-center mx-auto text-xl font-bold">
            <HiOutlineUserGroup className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No Batches Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first batch cohort to group students, set weekend timings, and track rosters.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-official text-zinc-950 font-bold text-xs rounded-xl hover:bg-official/90 transition-all cursor-pointer"
          >
            Create First Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="bg-official/20 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-full border border-official/40">
                    {batch.batchCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      batch.status === "Ongoing"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{batch.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{batch.course}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <HiOutlineClock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{batch.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Starts: {new Date(batch.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineUser className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Mentor: {batch.mentorName}</span>
                  </div>
                </div>
              </div>

              {/* Footer actions & student count */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">{batch.studentCount || 0}</span>
                  <span className="text-[11px] text-slate-400 ml-1">/ {batch.maxCapacity || 20} Students</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenRoster(batch)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    View Roster
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete batch ${batch.name}? Students will be unassigned.`)) {
                        onDeleteBatch(batch._id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm">Create Cohort Batch</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Batch Cohort Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UI/UX Weekend Cohort 15"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Course</label>
                  <CustomDropdown
                    value={formData.course}
                    onChange={(val) => setFormData({ ...formData, course: val })}
                    options={[
                      { value: "UI/UX Design Masterclass", label: "UI/UX Design Masterclass" },
                      { value: "Advanced Figma & Design Systems", label: "Advanced Figma" },
                      { value: "Product Design & Case Study Mentorship", label: "Product Design" }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Schedule Timing</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="Sat-Sun 11AM-1:30PM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mentor Name</label>
                  <input
                    type="text"
                    value={formData.mentorName}
                    onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <CustomDropdown
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={[
                      { value: "Upcoming", label: "Upcoming" },
                      { value: "Ongoing", label: "Ongoing" },
                      { value: "Completed", label: "Completed" }
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Meeting / Classroom URL</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-zinc-950 bg-official hover:bg-official/90 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Cohort"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Roster Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedBatch.name} — Student Roster
                </h3>
                <p className="text-xs text-slate-400">{selectedBatch.schedule} • {batchRoster.length} Enrolled</p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingRoster ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading student roster...</div>
              ) : batchRoster.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No students assigned to this cohort yet. Assign students from the Students Directory!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {batchRoster.map((st) => (
                    <div
                      key={st._id}
                      onClick={() => {
                        setSelectedBatch(null);
                        onSelectStudent(st);
                      }}
                      className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-official font-bold text-xs flex items-center justify-center">
                          {st.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{st.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{st.studentId} • {st.phone}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        {st.status || "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
