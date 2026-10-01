import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import {
  HiOutlineBadgeCheck,
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineAcademicCap,
  HiOutlinePrinter
} from "react-icons/hi";

export default function CertificatesView({ students = [] }) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [grade, setGrade] = useState("A+ (Distinction)");
  const [issuedList, setIssuedList] = useState([]);
  const [previewCert, setPreviewCert] = useState(null);

  const eligibleStudents = students.filter(
    (s) => s.status === "Completed" || s.feeDetails?.paymentStatus === "Paid"
  );

  const handleIssueCertificate = (e) => {
    e.preventDefault();
    const st = students.find((s) => s._id === selectedStudentId);
    if (!st) return;

    const certId = `WUX-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert = {
      certId,
      studentName: st.name,
      studentId: st.studentId,
      course: st.course,
      issueDate: new Date().toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      grade
    };

    setIssuedList([newCert, ...issuedList]);
    setPreviewCert(newCert);
    setSelectedStudentId("");
  };

  const handlePrintCertificate = () => {
    if (!previewCert) return;

    const printFrame = document.createElement("iframe");
    printFrame.name = "print_frame";
    printFrame.style.position = "absolute";
    printFrame.style.top = "-9999px";
    printFrame.style.left = "-9999px";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow || printFrame.contentDocument.document || printFrame.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title> </title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            @page {
              size: 297mm 210mm;
              margin: 0 !important;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: 'Poppins', sans-serif;
            }
            html, body {
              width: 297mm;
              height: 210mm;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              box-sizing: border-box;
              padding: 10mm 14mm;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .cert-card {
              width: 100%;
              height: 100%;
              border: 3.5px solid #FFD400;
              border-radius: 24px;
              padding: 36px 50px;
              position: relative;
              background: #ffffff;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
              overflow: hidden;
              page-break-inside: avoid;
            }
            .accent-blob {
              position: absolute;
              top: 0;
              right: 0;
              width: 150px;
              height: 150px;
              background: rgba(255, 212, 0, 0.14);
              border-bottom-left-radius: 100%;
              pointer-events: none;
            }
            .cert-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1.5px solid #f1f5f9;
              padding-bottom: 20px;
            }
            .brand-box {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .brand-logo {
              width: 44px;
              height: 44px;
              background: #FFD400;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 20px;
              color: #09090b;
            }
            .brand-name {
              font-size: 18px;
              font-weight: 800;
              color: #09090b;
              letter-spacing: -0.5px;
            }
            .brand-sub {
              font-size: 11px;
              color: #64748b;
              font-weight: 500;
            }
            .cert-id-tag {
              font-family: monospace;
              font-size: 12px;
              font-weight: 700;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              color: #334155;
              padding: 5px 12px;
              border-radius: 8px;
            }
            .cert-center {
              text-align: center;
              padding: 36px 20px;
            }
            .cert-label {
              font-size: 13px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 3.5px;
              margin-bottom: 14px;
            }
            .cert-recipient {
              font-size: 38px;
              font-weight: 900;
              color: #09090b;
              margin-bottom: 16px;
              letter-spacing: -0.5px;
            }
            .cert-statement {
              font-size: 15px;
              line-height: 1.7;
              color: #475569;
              max-width: 650px;
              margin: 0 auto;
            }
            .strong-text {
              font-weight: 800;
              color: #09090b;
            }
            .grade-text {
              font-weight: 800;
              color: #059669;
            }
            .cert-bottom {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              border-top: 1.5px solid #f1f5f9;
              padding-top: 24px;
            }
            .col-label {
              font-size: 11px;
              color: #94a3b8;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 3px;
            }
            .col-value {
              font-size: 13px;
              font-weight: 700;
              color: #334155;
            }
            .verified-tag {
              font-size: 13px;
              font-weight: 700;
              color: #059669;
              display: flex;
              align-items: center;
              gap: 6px;
            }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="accent-blob"></div>
            <div class="cert-header">
              <div class="brand-box">
                <div class="brand-logo">W</div>
                <div>
                  <div class="brand-name">WEEKEND UX</div>
                  <div class="brand-sub">Design Academy & Mentorship</div>
                </div>
              </div>
              <div class="cert-id-tag">${previewCert.certId}</div>
            </div>

            <div class="cert-center">
              <div class="cert-label">Certificate of Completion</div>
              <div class="cert-recipient">${previewCert.studentName}</div>
              <p class="cert-statement">
                Has successfully completed the comprehensive mentorship program in
                <span class="strong-text">${previewCert.course}</span> with a grade of
                <span class="grade-text">${previewCert.grade}</span>.
              </p>
            </div>

            <div class="cert-bottom">
              <div>
                <div class="col-label">Date of Issue</div>
                <div class="col-value">${previewCert.issueDate}</div>
              </div>
              <div style="text-align: right;">
                <div class="col-label">Verification Status</div>
                <div class="verified-tag">✓ Verified Academic Credential</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    frameDoc.document.close();
    printFrame.contentWindow.focus();
    setTimeout(() => {
      printFrame.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 400);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Certificate Credential Issuance</h2>
          <p className="text-xs text-slate-400">Issue verifiable certificates upon course completion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to issue */}
        <div className="no-print bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Issue Certificate
          </h3>
          <form onSubmit={handleIssueCertificate} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select Eligible Student
              </label>
              <CustomDropdown
                value={selectedStudentId}
                onChange={setSelectedStudentId}
                placeholder="-- Choose Student --"
                searchable={true}
                options={[
                  { value: "", label: "-- Choose Student --" },
                  ...students.map((st) => ({
                    value: st._id,
                    label: `${st.name} (${st.studentId}) — ${st.status}`
                  }))
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Performance Grade</label>
              <CustomDropdown
                value={grade}
                onChange={setGrade}
                options={[
                  { value: "A+ (Distinction)", label: "A+ (Distinction)" },
                  { value: "A (Excellent)", label: "A (Excellent)" },
                  { value: "B+ (Very Good)", label: "B+ (Very Good)" },
                  { value: "Completed with Merit", label: "Completed with Merit" }
                ]}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedStudentId}
              className="w-full py-2.5 bg-official hover:bg-official/90 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              Generate Certificate
            </button>
          </form>
        </div>

        {/* Certificate Live Preview */}
        <div className="lg:col-span-2">
          {previewCert ? (
            <div
              id="printable-certificate"
              className="bg-white border-2 border-official rounded-3xl p-8 shadow-md relative overflow-hidden space-y-4"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-official/10 rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-official flex items-center justify-center font-bold text-zinc-950 text-sm">
                    W
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">WEEKEND UX</h4>
                    <p className="text-[10px] text-slate-400">Design Academy & Mentorship</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {previewCert.certId}
                  </span>
                </div>
              </div>

              <div className="py-6 text-center space-y-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Certificate of Completion
                </p>
                <h2 className="text-2xl font-extrabold text-slate-900">{previewCert.studentName}</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto pt-1">
                  Has successfully completed the comprehensive mentorship program in{" "}
                  <span className="font-bold text-zinc-950">{previewCert.course}</span> with a grade of{" "}
                  <span className="font-bold text-emerald-600">{previewCert.grade}</span>.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <div>
                  <p className="text-[10px] text-slate-400">Date of Issue</p>
                  <p className="font-semibold text-slate-700">{previewCert.issueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Verification Status</p>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                    <HiOutlineBadgeCheck className="w-4 h-4" /> Verified Academic Credential
                  </span>
                </div>
              </div>

              <div className="no-print pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <HiOutlinePrinter className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2 h-full flex flex-col items-center justify-center">
              <HiOutlineBadgeCheck className="w-12 h-12 text-slate-300" />
              <h4 className="font-bold text-slate-800 text-sm">No Certificate Selected for Preview</h4>
              <p className="text-xs text-slate-400">
                Select an eligible student from the left panel to issue and preview their credential.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
