import { getErpToken } from "./auth.js";

const BASE_URL = import.meta.env.VITE_ERP_API_URL || "http://localhost:5000/api/erp";

const fetchWithAuth = async (url, options = {}) => {
  const token = getErpToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// ERP Stats
export const fetchErpStats = async () => {
  return await fetchWithAuth(`${BASE_URL}/stats`);
};

// Students API
export const fetchStudents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchWithAuth(`${BASE_URL}/students${query ? `?${query}` : ""}`);
};

export const fetchStudentById = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/students/${id}`);
};

export const createStudent = async (studentData) => {
  return await fetchWithAuth(`${BASE_URL}/students`, {
    method: "POST",
    body: JSON.stringify(studentData)
  });
};

export const updateStudent = async (id, updates) => {
  return await fetchWithAuth(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates)
  });
};

export const deleteStudent = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/students/${id}`, {
    method: "DELETE"
  });
};

export const addStudentNote = async (id, noteText, author = "Admin") => {
  return await fetchWithAuth(`${BASE_URL}/students/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ text: noteText, author })
  });
};

// CRM Import Bridge
export const syncCrmEnrolledLeads = async () => {
  return await fetchWithAuth(`${BASE_URL}/crm-import`, {
    method: "POST"
  });
};

// Batches API
export const fetchBatches = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchWithAuth(`${BASE_URL}/batches${query ? `?${query}` : ""}`);
};

export const fetchBatchById = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/batches/${id}`);
};

export const createBatch = async (batchData) => {
  return await fetchWithAuth(`${BASE_URL}/batches`, {
    method: "POST",
    body: JSON.stringify(batchData)
  });
};

export const updateBatch = async (id, updates) => {
  return await fetchWithAuth(`${BASE_URL}/batches/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates)
  });
};

export const deleteBatch = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/batches/${id}`, {
    method: "DELETE"
  });
};

// Payments & Fees API
export const fetchPayments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchWithAuth(`${BASE_URL}/payments${query ? `?${query}` : ""}`);
};

export const recordStudentPayment = async (paymentData) => {
  return await fetchWithAuth(`${BASE_URL}/payments`, {
    method: "POST",
    body: JSON.stringify(paymentData)
  });
};

// Academy Courses & LMS Unlock API
export const fetchAcademyCourses = async () => {
  return await fetchWithAuth(`${BASE_URL}/academy-courses`);
};

export const unlockCourseAccess = async (studentId, courseId, unlockedBy = "Counselor") => {
  return await fetchWithAuth(`${BASE_URL}/students/${studentId}/unlock-course`, {
    method: "POST",
    body: JSON.stringify({ courseId, unlockedBy })
  });
};

export const revokeCourseAccess = async (studentId, courseId, revokedBy = "Counselor") => {
  return await fetchWithAuth(`${BASE_URL}/students/${studentId}/revoke-course`, {
    method: "POST",
    body: JSON.stringify({ courseId, revokedBy })
  });
};

// Attendance Tracking API
export const saveSessionAttendance = async (attendanceData) => {
  return await fetchWithAuth(`${BASE_URL}/attendance`, {
    method: "POST",
    body: JSON.stringify(attendanceData)
  });
};

export const fetchBatchAttendanceByDate = async (batchId, dateStr) => {
  return await fetchWithAuth(`${BASE_URL}/attendance/by-date?batchId=${batchId}&dateStr=${dateStr}`);
};

export const fetchBatchAttendanceHistory = async (batchId, limit = 20) => {
  return await fetchWithAuth(`${BASE_URL}/attendance/history?batchId=${batchId}&limit=${limit}`);
};

export const fetchStudentAttendance = async (studentId) => {
  return await fetchWithAuth(`${BASE_URL}/students/${studentId}/attendance`);
};

// ==========================================
// Omnichannel Q&A Rules & Unified Inbox APIs
// ==========================================
export const fetchFaqRules = async () => {
  return await fetchWithAuth(`${BASE_URL}/faq-rules`);
};

export const createFaqRule = async (ruleData) => {
  return await fetchWithAuth(`${BASE_URL}/faq-rules`, {
    method: "POST",
    body: JSON.stringify(ruleData)
  });
};

export const updateFaqRule = async (id, ruleData) => {
  return await fetchWithAuth(`${BASE_URL}/faq-rules/${id}`, {
    method: "PUT",
    body: JSON.stringify(ruleData)
  });
};

export const deleteFaqRule = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/faq-rules/${id}`, {
    method: "DELETE"
  });
};

export const fetchConversations = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchWithAuth(`${BASE_URL}/conversations${query ? `?${query}` : ""}`);
};

export const fetchConversationMessages = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/conversations/${id}/messages`);
};

export const sendConversationReply = async (id, replyText, channel) => {
  return await fetchWithAuth(`${BASE_URL}/conversations/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ message: replyText, channel })
  });
};

export const toggleConversationBot = async (id, isBotActive) => {
  return await fetchWithAuth(`${BASE_URL}/conversations/${id}/toggle-bot`, {
    method: "PUT",
    body: JSON.stringify({ isBotActive })
  });
};

export const deleteConversation = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/conversations/${id}`, {
    method: "DELETE"
  });
};

