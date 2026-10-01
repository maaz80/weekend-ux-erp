import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiCheck, HiOutlineSearch } from "react-icons/hi";

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "-- Select --",
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  searchable = false,
  autoSearchThreshold = 8,
  icon = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to { value, label, disabled, subtitle }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { value: opt, label: String(opt), disabled: false };
    }
    return {
      value: opt.value !== undefined ? opt.value : opt.id || "",
      label: opt.label !== undefined ? opt.label : opt.name || opt.title || String(opt.value || ""),
      disabled: Boolean(opt.disabled),
      subtitle: opt.subtitle || null,
      badge: opt.badge || null
    };
  });

  // Current selected option
  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const shouldShowSearch =
    searchable || normalizedOptions.length >= autoSearchThreshold;

  const filteredOptions = shouldShowSearch && searchQuery.trim()
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : normalizedOptions;

  const handleSelect = (opt) => {
    if (opt.disabled) return;
    onChange(opt.value, opt);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left w-full ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs bg-slate-50 border rounded-xl font-medium transition-all cursor-pointer text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed select-none ${
          isOpen
            ? "bg-white border-official ring-2 ring-official/25 shadow-xs"
            : "border-slate-200 hover:bg-white hover:border-slate-300"
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0 text-left">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span
            className={`truncate ${
              !selectedOption ? "text-slate-400 font-normal" : "text-slate-800 font-medium"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <HiChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-zinc-950" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 min-w-[200px] animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
        >
          {/* Optional Search Filter */}
          {shouldShowSearch && (
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <HiOutlineSearch className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-official transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto overscroll-contain">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-xs text-slate-400 text-center italic">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={`${opt.value}-${idx}`}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors ${
                      opt.disabled
                        ? "opacity-40 cursor-not-allowed bg-slate-50/50 text-slate-400"
                        : isSelected
                        ? "bg-official/20 text-zinc-950 font-bold border-l-3 border-official cursor-pointer"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{opt.label}</div>
                      {opt.subtitle && (
                        <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                          {opt.subtitle}
                        </div>
                      )}
                    </div>
                    {opt.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <HiCheck className="w-4 h-4 text-zinc-950 shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
