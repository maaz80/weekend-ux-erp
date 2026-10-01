import { useState, useEffect } from "react";
import { HiOutlineX, HiOutlineUserAdd } from "react-icons/hi";
import CustomDropdown from "./CustomDropdown";

export default function AddStudentModal({ isOpen, onClose, onAddStudent, batches = [], courses = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "UI/UX Design Masterclass",
    batch: "",
    totalFee: 45000,
    discount: 0,
    address: "",
    education: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // When courses load or modal opens, initialize with first course and its price
  useEffect(() => {
    if (courses.length > 0) {
      const current = courses.find((c) => c.title === formData.course);
      if (!current) {
        const first = courses[0];
        setFormData((prev) => ({
          ...prev,
          course: first.title,
          totalFee: first.price && Number(first.price) > 0 ? Number(first.price) : 45000
        }));
      } else if (current.price && Number(current.price) > 0 && formData.totalFee === 45000) {
        setFormData((prev) => ({
          ...prev,
          totalFee: Number(current.price)
        }));
      }
    }
  }, [courses, isOpen]);

  const handleCourseChange = (selectedTitle) => {
    const matched = courses.find((c) => c.title === selectedTitle);
    const newPrice = matched && matched.price && Number(matched.price) > 0 ? Number(matched.price) : formData.totalFee;
    setFormData((prev) => ({
      ...prev,
      course: selectedTitle,
      totalFee: newPrice
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("Student Name and Phone number are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const finalFee = Math.max(0, Number(formData.totalFee) - Number(formData.discount));

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course,
        batch: formData.batch || null,
        feeDetails: {
          totalFee: Number(formData.totalFee),
          discount: Number(formData.discount),
          finalFee: finalFee,
          paidAmount: 0,
          balance: finalFee,
          paymentStatus: "Pending"
        },
        address: formData.address.trim(),
        education: formData.education.trim(),
        notes: formData.notes.trim()
      };

      await onAddStudent(payload);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to enroll student.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-official flex items-center justify-center text-zinc-950 font-bold text-sm shadow-xs">
              <HiOutlineUserAdd className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enroll New Student</h3>
              <p className="text-xs text-slate-400">Generate Student ID & Academic Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
              />
            </div>

            {/* Course */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-600">Course Program</label>
                {courses.length > 0 && (
                  <span className="text-[10px] text-emerald-600 font-bold">Catalog Linked</span>
                )}
              </div>
              <CustomDropdown
                value={formData.course}
                onChange={(val) => handleCourseChange(val)}
                options={
                  courses.length > 0
                    ? courses.map((c) => ({
                        value: c.title,
                        label: `${c.title} ${c.price ? `(₹${Number(c.price).toLocaleString("en-IN")})` : ""}`
                      }))
                    : [
                        { value: "UI/UX Design Masterclass", label: "UI/UX Design Masterclass" },
                        { value: "Advanced Figma & Design Systems", label: "Advanced Figma & Design Systems" },
                        { value: "Product Design & Case Study Mentorship", label: "Product Design & Case Study Mentorship" },
                        { value: "Motion Design & Micro-interactions", label: "Motion Design & Micro-interactions" }
                      ]
                }
              />
            </div>

            {/* Batch Allocation */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Batch / Cohort</label>
              <CustomDropdown
                value={formData.batch}
                onChange={(val) => setFormData({ ...formData, batch: val })}
                placeholder="Select Later (Unassigned)"
                options={[
                  { value: "", label: "Select Later (Unassigned)" },
                  ...batches.map((b) => ({
                    value: b._id,
                    label: `${b.name} (${b.batchCode})`
                  }))
                ]}
              />
            </div>

            {/* Education / Background */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Education / Occupation</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g. B.Tech / Working Professional"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
              />
            </div>

            {/* Total Fee */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-600">Total Fee (₹)</label>
                <span className="text-[10px] text-slate-400">Auto-filled</span>
              </div>
              <input
                type="number"
                value={formData.totalFee}
                onChange={(e) => setFormData({ ...formData, totalFee: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all font-semibold text-slate-900"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Scholarship / Discount (₹)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
              />
            </div>
          </div>

          {/* Fee Summary Box */}
          <div className="p-3 bg-official/10 border border-official/30 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Final Course Fee:</span>
            <span className="font-bold text-zinc-950 text-sm">
              ₹{Math.max(0, Number(formData.totalFee) - Number(formData.discount)).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">City / Location</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Bangalore, India"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all"
            />
          </div>

          {/* Initial Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Enrollment Note</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special remarks or background details..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-official transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-official hover:bg-official/90 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
