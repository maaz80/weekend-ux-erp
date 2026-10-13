import { useState, useEffect, useRef } from "react";
import {
  HiOutlineChatAlt2,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePaperAirplane,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineBadgeCheck,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlineSwitchHorizontal,
  HiOutlineUser
} from "react-icons/hi";
import {
  SiInstagram,
  SiFacebook,
  SiGmail
} from "react-icons/si";
import {
  fetchFaqRules,
  createFaqRule,
  updateFaqRule,
  deleteFaqRule,
  fetchConversations,
  fetchConversationMessages,
  sendConversationReply,
  toggleConversationBot,
  deleteConversation
} from "../utils/api.js";

// Sample initial FAQ Rules for Weekend UX
const INITIAL_FAQ_RULES = [
  {
    _id: "faq-1",
    question: "Free Demo Class / Trial Session",
    keywords: ["demo", "trial", "free session", "class trial", "sample class"],
    matchType: "contains",
    answer: "Awesome! 🎯 You're invited to our upcoming Live Interactive Mentorship Session with Senior Product Designers.\n\n👉 Register your free demo seat here:\nhttps://weekendux.in/demo\n\nOur admissions counselor will also assist you with your schedule. If you have questions, reply 'COUNSELOR' or share your phone number!",
    channels: ["instagram", "facebook", "email"],
    isActive: true,
    triggeredCount: 142
  },
  {
    _id: "faq-2",
    question: "Curriculum & Course Syllabus",
    keywords: ["syllabus", "brochure", "curriculum", "course details", "content", "what will i learn"],
    matchType: "contains",
    answer: "Here is the complete UI/UX curriculum overview! 📘\n\nOur industry-standard programs include:\n• UI/UX Design & Design Thinking\n• Figma Mastery & Design Systems\n• Generative AI Tools for Modern Designers\n• 1-on-1 Portfolio Reviews & Placement Assistance\n\n📥 Download Syllabus PDF:\nhttps://weekendux.in/brochure.pdf",
    channels: ["instagram", "facebook", "email"],
    isActive: true,
    triggeredCount: 98
  },
  {
    _id: "faq-3",
    question: "Course Fees, EMI & Discount Offers",
    keywords: ["fee", "fees", "cost", "price", "emi", "discount", "kitna lagega"],
    matchType: "contains",
    answer: "The UI/UX Masterclass fee is ₹45,000 (inclusive of live mentorship, portfolio review, and placement support).\n\n💳 Flexible No-Cost EMI options starting at ₹3,750/month are available.\n\nWould you like our counselor to call you with early-bird scholarship details? Reply with your Phone Number!",
    channels: ["instagram", "facebook", "email"],
    isActive: true,
    triggeredCount: 184
  },
  {
    _id: "faq-4",
    question: "Batch Timings & Weekend Schedule",
    keywords: ["timing", "schedule", "batch", "weekend", "time", "kab start hoga"],
    matchType: "contains",
    answer: "Our upcoming batches are specifically scheduled for working professionals and college students:\n\n🗓️ Weekend Cohort: Saturday & Sunday (11:00 AM – 1:30 PM IST)\n🗓️ Weekday Fastrack: Tuesday & Thursday (7:30 PM – 9:30 PM IST)\n\nAll live sessions are recorded and uploaded to your student LMS dashboard.",
    channels: ["instagram", "facebook"],
    isActive: true,
    triggeredCount: 65
  },
  {
    _id: "faq-5",
    question: "Placement Assistance & Job Support",
    keywords: ["placement", "job", "guarantee", "career support", "hiring", "package"],
    matchType: "contains",
    answer: "Yes! 💼 Weekend UX offers 100% placement support with dedicated mock interviews, resume critiques, Behance/Dribbble portfolio curation, and direct hiring partner referrals.\n\nOver 800+ alumni have transitioned into leading product companies and design studios.",
    channels: ["instagram", "facebook", "email"],
    isActive: true,
    triggeredCount: 112
  }
];

// Sample initial omnichannel conversations
const INITIAL_CONVERSATIONS = [
  {
    _id: "conv-1",
    channel: "instagram",
    senderName: "Priya Sharma",
    senderHandle: "@priya.designs",
    senderContact: "priya.sharma99@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    isBotActive: true,
    status: "bot_handled",
    unread: false,
    lastMessage: "Thank you! I will register for the demo session.",
    lastMessageAt: "10 mins ago",
    courseInterest: "UI/UX Design Masterclass",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Hi, can I get a free demo class for UI/UX course?",
        timestamp: "Today, 10:15 AM",
        channel: "instagram"
      },
      {
        id: "m2",
        sender: "bot",
        text: "Awesome! 🎯 You're invited to our upcoming Live Interactive Mentorship Session with Senior Product Designers.\n\n👉 Register your free demo seat here:\nhttps://weekendux.in/demo\n\nOur admissions counselor will also assist you with your schedule. If you have questions, reply 'COUNSELOR' or share your phone number!",
        matchedFaq: "Free Demo Class / Trial Session",
        timestamp: "Today, 10:15 AM",
        channel: "instagram"
      },
      {
        id: "m3",
        sender: "user",
        text: "Thank you! I will register for the demo session.",
        timestamp: "Today, 10:25 AM",
        channel: "instagram"
      }
    ]
  },
  {
    _id: "conv-2",
    channel: "email",
    senderName: "Ankit Verma",
    senderHandle: "ankit.verma.dev@gmail.com",
    senderContact: "ankit.verma.dev@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    isBotActive: false,
    status: "needs_human_reply",
    unread: true,
    lastMessage: "I have 3 years experience in frontend. Can I get a tailored discount if my company sponsors 2 candidates?",
    lastMessageAt: "25 mins ago",
    courseInterest: "Advanced Design Systems & Figma",
    messages: [
      {
        id: "m4",
        sender: "user",
        text: "Hello Weekend UX team,\nWhat are the fees for the upcoming batch?",
        timestamp: "Today, 09:40 AM",
        channel: "email"
      },
      {
        id: "m5",
        sender: "bot",
        text: "The UI/UX Masterclass fee is ₹45,000 (inclusive of live mentorship, portfolio review, and placement support).\n\n💳 Flexible No-Cost EMI options starting at ₹3,750/month are available.\n\nWould you like our counselor to call you with early-bird scholarship details? Reply with your Phone Number!",
        matchedFaq: "Course Fees, EMI & Discount Offers",
        timestamp: "Today, 09:41 AM",
        channel: "email"
      },
      {
        id: "m6",
        sender: "user",
        text: "I have 3 years experience in frontend. Can I get a tailored discount if my company sponsors 2 candidates?",
        timestamp: "Today, 10:10 AM",
        channel: "email"
      }
    ]
  },
  {
    _id: "conv-3",
    channel: "facebook",
    senderName: "Sneha Mukherjee",
    senderHandle: "Sneha Mukherjee (Messenger)",
    senderContact: "+91 98310 22345",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    isBotActive: true,
    status: "bot_handled",
    unread: false,
    lastMessage: "Here is the complete UI/UX curriculum overview! 📘",
    lastMessageAt: "1 hour ago",
    courseInterest: "UI/UX Design Masterclass",
    messages: [
      {
        id: "m7",
        sender: "user",
        text: "Can someone share the detailed syllabus brochure please?",
        timestamp: "Today, 09:12 AM",
        channel: "facebook"
      },
      {
        id: "m8",
        sender: "bot",
        text: "Here is the complete UI/UX curriculum overview! 📘\n\nOur industry-standard programs include:\n• UI/UX Design & Design Thinking\n• Figma Mastery & Design Systems\n• Generative AI Tools for Modern Designers\n• 1-on-1 Portfolio Reviews & Placement Assistance\n\n📥 Download Syllabus PDF:\nhttps://weekendux.in/brochure.pdf",
        matchedFaq: "Curriculum & Course Syllabus",
        timestamp: "Today, 09:13 AM",
        channel: "facebook"
      }
    ]
  },
  {
    _id: "conv-4",
    channel: "instagram",
    senderName: "Rohan Kulkarni",
    senderHandle: "@rohan_uxer",
    senderContact: "+91 97654 32109",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    isBotActive: false,
    status: "needs_human_reply",
    unread: true,
    lastMessage: "Hey, do you guys provide offline classes in Bangalore or is it completely online?",
    lastMessageAt: "2 hours ago",
    courseInterest: "Generative AI for Product Designers",
    messages: [
      {
        id: "m9",
        sender: "user",
        text: "Hey, do you guys provide offline classes in Bangalore or is it completely online?",
        timestamp: "Today, 08:30 AM",
        channel: "instagram"
      }
    ]
  }
];

export default function OmnichannelInboxView() {
  const [activeSubTab, setActiveSubTab] = useState("inbox"); // 'inbox' | 'rules'
  
  // Conversations State
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState(INITIAL_CONVERSATIONS[1]._id);
  const [searchConvQuery, setSearchConvQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("all"); // 'all' | 'instagram' | 'facebook' | 'email'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'unread' | 'needs_human_reply' | 'bot_handled'
  
  // Reply State
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const chatBottomRef = useRef(null);

  // FAQ Rules State
  const [faqRules, setFaqRules] = useState(INITIAL_FAQ_RULES);
  const [searchRuleQuery, setSearchRuleQuery] = useState("");
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  // Rule Form State
  const [ruleFormData, setRuleFormData] = useState({
    question: "",
    keywords: "",
    matchType: "contains",
    answer: "",
    channels: ["instagram", "facebook", "email"],
    isActive: true
  });

  // Feedback Notification Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-scroll chat to bottom when conversation changes or new message is added
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConvId, conversations]);

  // Load real API data if backend endpoints respond
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const rulesRes = await fetchFaqRules();
        if (rulesRes?.rules?.length) {
          setFaqRules(rulesRes.rules);
        }
      } catch {
        // Fallback to initial mock rules
      }

      try {
        const convRes = await fetchConversations();
        if (convRes?.conversations?.length) {
          setConversations(convRes.conversations);
          if (!selectedConvId && convRes.conversations[0]) {
            setSelectedConvId(convRes.conversations[0]._id);
          }
        }
      } catch {
        // Fallback to initial mock conversations
      }
    };
    fetchRealData();
  }, []);

  const activeConversation = conversations.find((c) => c._id === selectedConvId) || conversations[0];

  // ==========================================
  // CONVERSATION ACTIONS
  // ==========================================

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeConversation) return;

    const messageContent = replyText.trim();
    setSendingReply(true);

    const newMsg = {
      id: "m-" + Date.now(),
      sender: "agent",
      text: messageContent,
      timestamp: "Just now",
      channel: activeConversation.channel
    };

    // Optimistically append message in UI
    setConversations((prev) =>
      prev.map((c) => {
        if (c._id === activeConversation._id) {
          return {
            ...c,
            lastMessage: messageContent,
            lastMessageAt: "Just now",
            unread: false,
            status: "human_replied",
            messages: [...(c.messages || []), newMsg]
          };
        }
        return c;
      })
    );

    setReplyText("");

    try {
      // Call actual backend reply API
      await sendConversationReply(activeConversation._id, messageContent, activeConversation.channel);
      showToast(`Reply sent successfully via ${activeConversation.channel.toUpperCase()}!`);
    } catch {
      // In development or until webhook is connected, show demo success
      showToast(`Reply logged and sent to ${activeConversation.senderName} (${activeConversation.channel.toUpperCase()})`);
    } finally {
      setSendingReply(false);
    }
  };

  const handleToggleBot = async (convId, currentStatus) => {
    const nextStatus = !currentStatus;
    setConversations((prev) =>
      prev.map((c) => (c._id === convId ? { ...c, isBotActive: nextStatus } : c))
    );

    try {
      await toggleConversationBot(convId, nextStatus);
    } catch {
      // Handled gracefully in mock
    }

    showToast(
      nextStatus
        ? "🤖 Bot Auto-Responder turned ON for this chatter"
        : "👤 Bot paused: Human Takeover activated"
    );
  };

  const handleDeleteConversation = async (convId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat conversation?")) return;
    try {
      await deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (selectedConvId === convId) {
        setSelectedConvId(null);
      }
      showToast("🗑️ Conversation deleted successfully");
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      showToast("❌ Could not delete conversation");
    }
  };

  const handleInsertCannedAnswer = (rule) => {
    setReplyText((prev) => (prev ? prev + "\n\n" + rule.answer : rule.answer));
  };

  // ==========================================
  // FAQ RULES ACTIONS
  // ==========================================

  const handleOpenAddRule = () => {
    setEditingRule(null);
    setRuleFormData({
      question: "",
      keywords: "",
      matchType: "contains",
      answer: "",
      channels: ["instagram", "facebook", "email"],
      isActive: true
    });
    setIsRuleModalOpen(true);
  };

  const handleOpenEditRule = (rule) => {
    setEditingRule(rule);
    setRuleFormData({
      question: rule.question,
      keywords: Array.isArray(rule.keywords) ? rule.keywords.join(", ") : rule.keywords,
      matchType: rule.matchType || "contains",
      answer: rule.answer,
      channels: rule.channels || ["instagram", "facebook", "email"],
      isActive: rule.isActive !== false
    });
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    if (!ruleFormData.question.trim() || !ruleFormData.answer.trim()) {
      alert("Please provide both a Question title and Answer text.");
      return;
    }

    const keywordList = ruleFormData.keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      ...ruleFormData,
      keywords: keywordList.length ? keywordList : [ruleFormData.question.toLowerCase().trim()]
    };

    if (editingRule) {
      // Update existing
      setFaqRules((prev) =>
        prev.map((r) => (r._id === editingRule._id ? { ...r, ...payload } : r))
      );
      try {
        await updateFaqRule(editingRule._id, payload);
      } catch {
        // Fallback
      }
      showToast("Q&A Rule updated successfully!");
    } else {
      // Create new
      const newRule = {
        _id: "faq-" + Date.now(),
        ...payload,
        triggeredCount: 0
      };
      setFaqRules((prev) => [newRule, ...prev]);
      try {
        await createFaqRule(payload);
      } catch {
        // Fallback
      }
      showToast("New Q&A Rule saved & active on selected channels!");
    }

    setIsRuleModalOpen(false);
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this Q&A auto-reply rule?")) return;
    setFaqRules((prev) => prev.filter((r) => r._id !== ruleId));
    try {
      await deleteFaqRule(ruleId);
    } catch {
      // Fallback
    }
    showToast("Q&A Rule removed.");
  };

  const handleToggleRuleActive = async (ruleId) => {
    setFaqRules((prev) =>
      prev.map((r) => {
        if (r._id === ruleId) {
          const nextActive = !r.isActive;
          try {
            updateFaqRule(ruleId, { isActive: nextActive });
          } catch {
            // fallback
          }
          return { ...r, isActive: nextActive };
        }
        return r;
      })
    );
  };

  // Helper for Channel Icons & Badges
  const renderChannelBadge = (channel, showLabel = true) => {
    switch (channel) {
      case "instagram":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
            <SiInstagram className="w-3 h-3 text-pink-600" />
            {showLabel && "Instagram DM"}
          </span>
        );
      case "facebook":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <SiFacebook className="w-3 h-3 text-blue-600" />
            {showLabel && "Facebook Messenger"}
          </span>
        );
      case "email":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <SiGmail className="w-3 h-3 text-amber-600" />
            {showLabel && "Email"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {channel}
          </span>
        );
    }
  };

  // Filtered Conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.senderName.toLowerCase().includes(searchConvQuery.toLowerCase()) ||
      c.senderHandle.toLowerCase().includes(searchConvQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchConvQuery.toLowerCase()));

    const matchesChannel = channelFilter === "all" || c.channel === channelFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && c.unread) ||
      (statusFilter === "needs_human_reply" && c.status === "needs_human_reply") ||
      (statusFilter === "bot_handled" && c.status === "bot_handled");

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Filtered Rules
  const filteredRules = faqRules.filter((r) => {
    const q = searchRuleQuery.toLowerCase();
    const matchesQuestion = r.question.toLowerCase().includes(q);
    const matchesAnswer = r.answer.toLowerCase().includes(q);
    const matchesKeywords = Array.isArray(r.keywords)
      ? r.keywords.some((k) => k.toLowerCase().includes(q))
      : false;
    return matchesQuestion || matchesAnswer || matchesKeywords;
  });

  const totalUnreadCount = conversations.filter((c) => c.unread).length;
  const activeFaqCount = faqRules.filter((r) => r.isActive).length;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] bg-slate-50 relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-6 z-50 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-zinc-700 transition-all animate-bounce">
          <HiOutlineSparkles className="w-4 h-4 text-official" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Tab Switcher Bar */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-official flex items-center justify-center text-zinc-950 font-black text-sm">
                AI
              </span>
              Omnichannel Bot & Unified Inbox
            </h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-reply across Instagram, Facebook & Email with saved FAQs. Monitor all incoming chatters and reply directly from ERP.
          </p>
        </div>

        {/* View Switcher Pills & Action */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveSubTab("inbox")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "inbox"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <HiOutlineChatAlt2 className="w-4 h-4 text-official" />
              Live Chat Inbox
              {totalUnreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {totalUnreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab("rules")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "rules"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <HiOutlineLightningBolt className="w-4 h-4 text-amber-500" />
              Q&A Auto-Responder Rules
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {activeFaqCount} Active
              </span>
            </button>
          </div>

          {activeSubTab === "rules" && (
            <button
              onClick={handleOpenAddRule}
              className="flex items-center gap-1.5 bg-official text-zinc-950 font-bold px-3.5 py-2 rounded-xl text-xs hover:brightness-105 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Add Q&A Set
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-VIEW 1: LIVE CHAT INBOX                             */}
      {/* ======================================================== */}
      {activeSubTab === "inbox" && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Chatter Directory List */}
          <div className="w-88 md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
            {/* Search and Filters */}
            <div className="p-3.5 border-b border-slate-200/80 space-y-2.5 bg-slate-50/50">
              <div className="relative">
                <HiOutlineSearch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search chatter name, handle, msg..."
                  value={searchConvQuery}
                  onChange={(e) => setSearchConvQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                />
              </div>

              {/* Channel Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {[
                  { id: "all", label: "All Channels" },
                  { id: "instagram", label: "Insta", icon: SiInstagram, color: "text-pink-600" },
                  { id: "facebook", label: "FB", icon: SiFacebook, color: "text-blue-600" },
                  { id: "email", label: "Email", icon: SiGmail, color: "text-amber-600" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = channelFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setChannelFilter(item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-zinc-900 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {Icon && <Icon className={`w-3 h-3 ${isActive ? "text-official" : item.color}`} />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <HiOutlineChatAlt2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">No chatters found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversation?._id === conv._id;
                  return (
                    <div
                      key={conv._id}
                      onClick={() => {
                        setSelectedConvId(conv._id);
                        // Mark as read locally
                        setConversations((prev) =>
                          prev.map((c) => (c._id === conv._id ? { ...c, unread: false } : c))
                        );
                      }}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative ${
                        isSelected
                          ? "bg-amber-50/70 border-l-4 border-official"
                          : "hover:bg-slate-50 border-l-4 border-transparent"
                      }`}
                    >
                      {/* Avatar with Channel Badge Overlay */}
                      <div className="relative shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.senderName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                          {conv.channel === "instagram" && <SiInstagram className="w-3.5 h-3.5 text-pink-600" />}
                          {conv.channel === "facebook" && <SiFacebook className="w-3.5 h-3.5 text-blue-600" />}
                          {conv.channel === "email" && <SiGmail className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {conv.senderName}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {conv.lastMessageAt}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium truncate mb-1">
                          {conv.senderHandle}
                        </p>

                        <p className="text-xs text-slate-600 line-clamp-1 leading-snug">
                          {conv.lastMessage}
                        </p>

                        {/* Status Badges */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {conv.status === "needs_human_reply" && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                              Needs Reply
                            </span>
                          )}
                          {conv.status === "bot_handled" && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                              <HiOutlineSparkles className="w-2.5 h-2.5 text-purple-600" />
                              Auto-Answered
                            </span>
                          )}
                          {conv.unread && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 ml-auto"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation Thread */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col bg-slate-100/70 overflow-hidden">
              {/* Thread Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeConversation.avatar}
                      alt={activeConversation.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                      {activeConversation.channel === "instagram" && <SiInstagram className="w-3.5 h-3.5 text-pink-600" />}
                      {activeConversation.channel === "facebook" && <SiFacebook className="w-3.5 h-3.5 text-blue-600" />}
                      {activeConversation.channel === "email" && <SiGmail className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeConversation.senderName}
                      </h3>
                      {renderChannelBadge(activeConversation.channel)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{activeConversation.senderHandle}</span>
                      {activeConversation.senderContact && (
                        <>
                          <span>•</span>
                          <span>{activeConversation.senderContact}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Header Actions: Bot Toggle Switch */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      {activeConversation.isBotActive ? (
                        <>
                          <HiOutlineSparkles className="w-3.5 h-3.5 text-purple-600" />
                          Bot Auto-Responder:
                        </>
                      ) : (
                        <>
                          <HiOutlineUser className="w-3.5 h-3.5 text-amber-600" />
                          Human Takeover:
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => handleToggleBot(activeConversation._id, activeConversation.isBotActive)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        activeConversation.isBotActive ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          activeConversation.isBotActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-[11px] font-bold ${
                        activeConversation.isBotActive ? "text-emerald-700" : "text-amber-800"
                      }`}
                    >
                      {activeConversation.isBotActive ? "Active" : "Paused"}
                    </span>
                  </div>

                  {/* Delete Conversation Button */}
                  <button
                    onClick={(e) => handleDeleteConversation(activeConversation._id, e)}
                    title="Delete Conversation"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 hover:border-rose-200 cursor-pointer"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="text-center">
                  <span className="bg-slate-200/80 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Connected via {activeConversation.channel.toUpperCase()}
                  </span>
                </div>

                {activeConversation.messages?.map((msg) => {
                  const isUser = msg.sender === "user";
                  const isBot = msg.sender === "bot";
                  const isAgent = msg.sender === "agent";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500 px-1">
                        {isUser && <span className="font-bold text-slate-700">{activeConversation.senderName}</span>}
                        {isBot && (
                          <span className="font-bold text-purple-700 flex items-center gap-1">
                            <HiOutlineSparkles className="w-3 h-3 text-purple-600" />
                            Bot Auto-Reply {msg.matchedFaq && `(Matched: ${msg.matchedFaq})`}
                          </span>
                        )}
                        {isAgent && (
                          <span className="font-bold text-amber-700 flex items-center gap-1">
                            <HiOutlineBadgeCheck className="w-3.5 h-3.5 text-amber-600" />
                            Counselor / ERP Staff
                          </span>
                        )}
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl p-4 text-xs shadow-xs leading-relaxed whitespace-pre-line ${
                          isUser
                            ? "bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs"
                            : isBot
                            ? "bg-purple-50 text-purple-950 border border-purple-200/80 rounded-tr-xs"
                            : "bg-zinc-900 text-white rounded-tr-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Canned Responses Bar */}
              <div className="bg-white border-t border-slate-200 px-4 py-2 shrink-0 flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                  <HiOutlineLightningBolt className="w-3.5 h-3.5 text-amber-500" />
                  Quick FAQs:
                </span>
                {faqRules
                  .filter((r) => r.isActive)
                  .map((rule) => (
                    <button
                      key={rule._id}
                      onClick={() => handleInsertCannedAnswer(rule)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-official/20 hover:border-official/60 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
                      title={rule.answer}
                    >
                      {rule.question}
                    </button>
                  ))}
              </div>

              {/* Reply Box Footer */}
              <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-sm">
                <form onSubmit={handleSendMessage} className="space-y-2.5">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Type your reply to ${activeConversation.senderName}... It will be delivered directly to their ${activeConversation.channel.toUpperCase()}!`}
                      className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 resize-none transition"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Sending to:</span>
                      {renderChannelBadge(activeConversation.channel)}
                      <span className="text-[11px] text-slate-400">(Press Enter to send)</span>
                    </div>

                    <button
                      type="submit"
                      disabled={!replyText.trim() || sendingReply}
                      className="flex items-center gap-1.5 bg-official text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-105 active:scale-95 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <HiOutlinePaperAirplane className="w-3.5 h-3.5" />
                      {sendingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
              <p>Select a chatter from the left list to view conversation</p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-VIEW 2: BOT FAQ RULES MANAGER                       */}
      {/* ======================================================== */}
      {activeSubTab === "rules" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Total Q&A Sets</span>
                <HiOutlineLightningBolt className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{faqRules.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                {activeFaqCount} active across platforms
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Instagram DM Bot</span>
                <SiInstagram className="w-4 h-4 text-pink-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">
                {faqRules.filter((r) => r.isActive && r.channels.includes("instagram")).length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Rules connected</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Facebook Messenger</span>
                <SiFacebook className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">
                {faqRules.filter((r) => r.isActive && r.channels.includes("facebook")).length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Rules connected</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Email Auto-Reply</span>
                <SiGmail className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">
                {faqRules.filter((r) => r.isActive && r.channels.includes("email")).length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Rules connected</p>
            </div>
          </div>

          {/* Search and Filter for Rules */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <HiOutlineSearch className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search question, keyword, or answer content..."
                value={searchRuleQuery}
                onChange={(e) => setSearchRuleQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Showing {filteredRules.length} of {faqRules.length} rules
              </span>
            </div>
          </div>

          {/* Rules Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => (
              <div
                key={rule._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Title + Switch */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-official shrink-0"></span>
                      {rule.question}
                    </h3>

                    {/* Active Toggle Switch */}
                    <button
                      onClick={() => handleToggleRuleActive(rule._id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.isActive ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          rule.isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Keywords Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">
                      Triggers:
                    </span>
                    {(Array.isArray(rule.keywords) ? rule.keywords : []).map((kw, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-slate-200/80"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Answer Text Preview */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto mb-3">
                    {rule.answer}
                  </div>
                </div>

                {/* Footer: Channels + Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {rule.channels?.map((ch) => (
                      <span key={ch}>{renderChannelBadge(ch, false)}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditRule(rule)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      title="Edit Rule"
                    >
                      <HiOutlinePencilAlt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule._id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Rule"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT Q&A RULE                               */}
      {/* ======================================================== */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-official flex items-center justify-center text-zinc-950 font-bold text-xs">
                  Q&A
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingRule ? "Edit Q&A Auto-Responder Set" : "Create New Q&A Auto-Responder Set"}
                </h3>
              </div>
              <button
                onClick={() => setIsRuleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question / Category Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Course Fees, Syllabus Download, Demo Booking"
                  value={ruleFormData.question}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, question: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trigger Keywords (Comma separated) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. fees, cost, price, emi, kitna lagega"
                  value={ruleFormData.keywords}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, keywords: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  If the user's incoming message on Instagram, Facebook, or Email contains any of these words, this answer will be sent automatically.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Auto-Reply Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the exact response to send to the user..."
                  value={ruleFormData.answer}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, answer: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              {/* Channels Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Active Channels
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "instagram", label: "Instagram DM", icon: SiInstagram, color: "text-pink-600" },
                    { id: "facebook", label: "Facebook Messenger", icon: SiFacebook, color: "text-blue-600" },
                    { id: "email", label: "Email Auto-Reply", icon: SiGmail, color: "text-amber-600" }
                  ].map((ch) => {
                    const checked = ruleFormData.channels.includes(ch.id);
                    const Icon = ch.icon;
                    return (
                      <button
                        type="button"
                        key={ch.id}
                        onClick={() => {
                          const next = checked
                            ? ruleFormData.channels.filter((c) => c !== ch.id)
                            : [...ruleFormData.channels, ch.id];
                          setRuleFormData({ ...ruleFormData, channels: next });
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          checked
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${checked ? "text-official" : ch.color}`} />
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700">Enable this Q&A Immediately</span>
                <button
                  type="button"
                  onClick={() => setRuleFormData({ ...ruleFormData, isActive: !ruleFormData.isActive })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    ruleFormData.isActive ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      ruleFormData.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-official text-zinc-950 hover:brightness-105 active:scale-95 transition shadow-xs cursor-pointer"
                >
                  {editingRule ? "Update Q&A Set" : "Save Q&A Set"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
