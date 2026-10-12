import { useState, useEffect } from "react";
import ErpLayout from "../components/ErpLayout.jsx";
import OverviewView from "../components/OverviewView.jsx";
import StudentsView from "../components/StudentsView.jsx";
import BatchesView from "../components/BatchesView.jsx";
import FeesView from "../components/FeesView.jsx";
import AttendanceView from "../components/AttendanceView.jsx";
import CertificatesView from "../components/CertificatesView.jsx";
import OmnichannelInboxView from "../components/OmnichannelInboxView.jsx";
import AddStudentModal from "../components/AddStudentModal.jsx";
import StudentProfileDrawer from "../components/StudentProfileDrawer.jsx";

import {
  fetchErpStats,
  fetchStudents,
  fetchStudentById,
  fetchBatches,
  fetchPayments,
  createStudent,
  updateStudent,
  deleteStudent,
  addStudentNote,
  createBatch,
  deleteBatch,
  recordStudentPayment,
  syncCrmEnrolledLeads,
  fetchAcademyCourses,
  unlockCourseAccess,
  revokeCourseAccess
} from "../utils/api.js";

export default function ErpDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    completedStudents: 0,
    batchesCount: 0,
    financials: { totalRevenue: 0, totalPaid: 0, totalPending: 0 }
  });

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [payments, setPayments] = useState([]);
  const [academyCourses, setAcademyCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, studentsRes, batchesRes, paymentsRes, coursesRes] = await Promise.all([
        fetchErpStats().catch(() => ({ stats: {} })),
        fetchStudents({
          search: searchQuery,
          course: selectedCourse,
          status: selectedStatus,
          paymentStatus: selectedPaymentStatus
        }).catch(() => ({ students: [] })),
        fetchBatches().catch(() => ({ batches: [] })),
        fetchPayments().catch(() => ({ payments: [] })),
        fetchAcademyCourses().catch(() => ({ courses: [] }))
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (studentsRes.students) setStudents(studentsRes.students);
      if (batchesRes.batches) setBatches(batchesRes.batches);
      if (paymentsRes.payments) setPayments(paymentsRes.payments);
      if (coursesRes.courses) setAcademyCourses(coursesRes.courses);
    } catch (err) {
      console.error("Failed to load ERP dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCourse, selectedStatus, selectedPaymentStatus]);

  // Handle Sync from CRM
  const handleSyncCrm = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      const res = await syncCrmEnrolledLeads();
      setSyncMessage(res.message || "CRM Leads synchronized successfully.");
      await loadData();
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (err) {
      setSyncMessage(`Sync failed: ${err.message}`);
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setSyncing(false);
    }
  };

  // Student Actions
  const handleAddStudent = async (studentData) => {
    await createStudent(studentData);
    await loadData();
  };

  const handleUpdateStudent = async (id, updates) => {
    const res = await updateStudent(id, updates);
    if (res.student && selectedStudent?._id === id) {
      setSelectedStudent(res.student);
    }
    await loadData();
  };

  const handleDeleteStudent = async (id) => {
    await deleteStudent(id);
    if (selectedStudent?._id === id) {
      setSelectedStudent(null);
    }
    await loadData();
  };

  const handleAddNote = async (id, noteText) => {
    const res = await addStudentNote(id, noteText);
    if (res.notes && selectedStudent?._id === id) {
      setSelectedStudent({ ...selectedStudent, notes: res.notes });
    }
    await loadData();
  };

  // Unified Student Selection (loads full payments history and duplicate profiles)
  const handleSelectStudent = async (st) => {
    setSelectedStudent(st);
    try {
      const res = await fetchStudentById(st._id);
      if (res && res.student) {
        setSelectedStudent({
          ...res.student,
          payments: res.payments || [],
          linkedProfiles: res.linkedProfiles || [],
          attendance: res.attendance || res.student.attendanceStats || null
        });
      }
    } catch (e) {
      console.error("Error loading student unified details:", e);
    }
  };

  // Payment Actions
  const handleRecordPayment = async (paymentData) => {
    await recordStudentPayment(paymentData);
    await loadData();
    if (selectedStudent) {
      try {
        const res = await fetchStudentById(selectedStudent._id);
        if (res && res.student) {
          setSelectedStudent({
            ...res.student,
            payments: res.payments || [],
            linkedProfiles: res.linkedProfiles || []
          });
        }
      } catch (e) {
        console.error("Error refreshing student after payment:", e);
      }
    }
  };

  // Batch Actions
  const handleCreateBatch = async (batchData) => {
    await createBatch(batchData);
    await loadData();
  };

  const handleDeleteBatch = async (id) => {
    await deleteBatch(id);
    await loadData();
  };

  // LMS Course Unlock Actions
  const handleUnlockCourse = async (studentId, courseId) => {
    const res = await unlockCourseAccess(studentId, courseId);
    if (res && selectedStudent?._id === studentId) {
      setSelectedStudent((prev) => ({
        ...prev,
        ...(res.student || {}),
        unlockedCourses: res.unlockedCourses || prev?.unlockedCourses || [],
        feeDetails: res.feeDetails || res.student?.feeDetails || prev?.feeDetails
      }));
    }
    await loadData();
  };

  const handleRevokeCourse = async (studentId, courseId) => {
    const res = await revokeCourseAccess(studentId, courseId);
    if (res && selectedStudent?._id === studentId) {
      setSelectedStudent((prev) => ({
        ...prev,
        ...(res.student || {}),
        unlockedCourses: res.unlockedCourses || prev?.unlockedCourses || [],
        feeDetails: res.feeDetails || res.student?.feeDetails || prev?.feeDetails
      }));
    }
    await loadData();
  };

  return (
    <ErpLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenAddModal={() => setIsAddModalOpen(true)}
      onSyncCrm={handleSyncCrm}
      syncing={syncing}
      stats={stats}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="mb-4 p-3.5 bg-official/20 border border-official/40 text-zinc-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-between animate-fade-in">
          <span>{syncMessage}</span>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-zinc-950/60 hover:text-zinc-950 text-xs cursor-pointer font-normal"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main View Router */}
      {activeTab === "overview" && (
        <OverviewView
          stats={stats}
          students={students}
          batches={batches}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onSyncCrm={handleSyncCrm}
          setActiveTab={setActiveTab}
          onSelectStudent={handleSelectStudent}
        />
      )}

      {activeTab === "students" && (
        <StudentsView
          students={students}
          loading={loading}
          onSelectStudent={handleSelectStudent}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onSyncCrm={handleSyncCrm}
          batches={batches}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPaymentStatus={selectedPaymentStatus}
          setSelectedPaymentStatus={setSelectedPaymentStatus}
        />
      )}

      {activeTab === "batches" && (
        <BatchesView
          batches={batches}
          onCreateBatch={handleCreateBatch}
          onDeleteBatch={handleDeleteBatch}
          onSelectStudent={handleSelectStudent}
        />
      )}

      {activeTab === "fees" && (
        <FeesView
          payments={payments}
          financials={stats.financials || {}}
          students={students}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {activeTab === "attendance" && (
        <AttendanceView
          batches={batches}
          students={students}
          onAttendanceSaved={loadData}
        />
      )}

      {activeTab === "certificates" && (
        <CertificatesView students={students} />
      )}

      {activeTab === "omnichannel" && (
        <OmnichannelInboxView />
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudent={handleAddStudent}
        batches={batches}
        courses={academyCourses}
      />

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onUpdateStudent={handleUpdateStudent}
        onRecordPayment={handleRecordPayment}
        onDeleteStudent={handleDeleteStudent}
        onAddNote={handleAddNote}
        batches={batches}
        academyCourses={academyCourses}
        onUnlockCourse={handleUnlockCourse}
        onRevokeCourse={handleRevokeCourse}
      />
    </ErpLayout>
  );
}
