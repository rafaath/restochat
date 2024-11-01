import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Clock,
  Utensils,
  Heart,
  Award,
  Leaf,
  Diamond,
  Share2,
  BookmarkPlus,
  Info,
  Sparkles,
  ChevronDown,
  Timer,
  Users,
  Flame,
  TrendingUp,
  AlertCircle,
  Crown,
} from "lucide-react";

// Helper Components
const StatusTag = ({ type = "premium", theme = "light" }) => {
  const config = {
    premium: {
      icon: Diamond,
      text: "Premium",
      bg:
        theme === "light"
          ? "bg-gradient-to-r from-slate-50 to-white"
          : "bg-gradient-to-r from-slate-900 to-slate-800",
      glow: "bg-violet-500/10",
      accent: "bg-violet-500",
      border:
        theme === "light" ? "border-violet-500/20" : "border-violet-400/20",
      textColor: theme === "light" ? "text-violet-500" : "text-violet-400",
      iconColor: theme === "light" ? "text-violet-600" : "text-violet-400",
    },
    vip: {
      icon: Award,
      text: "VIP",
      bg:
        theme === "light"
          ? "bg-gradient-to-r from-slate-50 to-white"
          : "bg-gradient-to-r from-slate-900 to-slate-800",
      glow: "bg-amber-500/10",
      accent: "bg-amber-500",
      border: theme === "light" ? "border-amber-500/20" : "border-amber-400/20",
      textColor: theme === "light" ? "text-amber-500" : "text-amber-400",
      iconColor: theme === "light" ? "text-amber-600" : "text-amber-400",
    },
    elite: {
      icon: Crown,
      text: "Elite",
      bg:
        theme === "light"
          ? "bg-gradient-to-r from-slate-50 to-white"
          : "bg-gradient-to-r from-slate-900 to-slate-800",
      glow: "bg-sky-500/10",
      accent: "bg-sky-500",
      border: theme === "light" ? "border-sky-500/20" : "border-sky-400/20",
      textColor: theme === "light" ? "text-sky-500" : "text-sky-400",
      iconColor: theme === "light" ? "text-sky-600" : "text-sky-400",
    },
  };

  const {
    icon: Icon,
    text,
    bg,
    glow,
    accent,
    border,
    textColor,
    iconColor,
  } = config[type];

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className={`
        absolute -inset-1 opacity-0 group-hover:opacity-100
        rounded-lg blur-md transition-all duration-500
        ${glow}
      `}
      />

      {/* Main container */}
      <div
        className={`
        relative inline-flex items-center gap-2
        px-3 py-1.5
        rounded-lg ${bg}
        border ${border}
        shadow-sm
        transition-all duration-300
        hover:shadow-lg
        group-hover:border-opacity-50
      `}
      >
        {/* Left accent line */}
        <div
          className={`
          absolute left-0 top-[6px] bottom-[6px] w-[2px]
          rounded-full ${accent} opacity-30
          group-hover:opacity-60 transition-opacity duration-300
        `}
        />

        <Icon
          className={`
            w-4 h-4 ${iconColor}
            transition-all duration-300
            group-hover:scale-110
          `}
          strokeWidth={2.5}
        />

        <span
          className={`
          text-sm font-medium ${textColor}
          tracking-wide
          transition-colors duration-300
        `}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

const TabButton = ({ id, label, icon: Icon, isActive, onClick, theme }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors
      ${isActive
        ? theme === "light"
          ? "text-blue-600"
          : "text-blue-400"
        : theme === "light"
          ? "text-gray-600 hover:text-gray-900"
          : "text-gray-400 hover:text-gray-200"
      }`}
  >
    <Icon size={14} className="flex-shrink-0" />
    <span className="truncate">{label}</span>
    {isActive && (
      <motion.div
        layoutId="combo-details-modal-tab-indicator"
        className={`absolute bottom-0 left-0 right-0 h-0.5
          ${theme === "light" ? "bg-blue-600" : "bg-blue-400"}`}
      />
    )}
  </button>
);

const NutritionBadge = ({ label, value, icon: Icon, theme }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    className={`flex items-center gap-3 p-4 rounded-xl transition-all
      ${theme === "light"
        ? "bg-gradient-to-br from-blue-50 to-blue-100/50"
        : "bg-gradient-to-br from-blue-900/20 to-blue-800/20"
      }`}
  >
    <div
      className={`p-2 rounded-lg ${theme === "light" ? "bg-blue-100" : "bg-blue-800/40"
        }`}
    >
      <Icon
        size={18}
        className={theme === "light" ? "text-blue-700" : "text-blue-300"}
      />
    </div>
    <div>
      <p
        className={`text-xs font-medium mb-0.5 ${theme === "light" ? "text-blue-600" : "text-blue-300"
          }`}
      >
        {label}
      </p>
      <p
        className={`text-sm font-semibold ${theme === "light" ? "text-blue-800" : "text-blue-100"
          }`}
      >
        {value}
      </p>
    </div>
  </motion.div>
);

// Update just the ComboItemCard component with refined hover effects
const ComboItemCard = ({ item, theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className={`group relative overflow-hidden rounded-xl transition-all duration-300
      ${theme === "light"
        ? "bg-white hover:bg-gray-50 hover:shadow-lg hover:ring-1 hover:ring-gray-200"
        : "bg-gray-800/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 hover:ring-1 hover:ring-gray-700"
      }`}
  >
    <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl">
      <img
        src={item.image_link}
        alt={item.name_of_item}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
      />
      {/* Subtle gradient overlay that's always present but intensifies on hover */}
      <div
        className={`absolute inset-0 transition-opacity duration-300
        ${theme === "light"
            ? "bg-gradient-to-t from-gray-900/20 via-gray-900/5 to-transparent opacity-0 group-hover:opacity-100"
            : "bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-50 group-hover:opacity-100"
          }`}
      />
    </div>

    {/* Veg/Non-veg indicator with enhanced styling */}
    <div
      className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105
      ${item.veg_or_non_veg === "veg"
          ? "border-green-500 bg-green-50 dark:bg-green-500/20"
          : "border-red-500 bg-red-50 dark:bg-red-500/20"
        }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {item.veg_or_non_veg === "veg" ? (
          <Leaf
            size={12}
            className={theme === "light" ? "text-green-600" : "text-green-400"}
          />
        ) : (
          <Utensils
            size={12}
            className={theme === "light" ? "text-red-600" : "text-red-400"}
          />
        )}
      </div>
    </div>

    {/* Content with refined spacing and hover effects */}
    <div className="p-4 space-y-3 relative">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h4
            className={`font-medium text-base mb-1 transition-colors
            ${theme === "light"
                ? "text-gray-900 group-hover:text-gray-700"
                : "text-gray-100 group-hover:text-white"
              }`}
          >
            {item.name_of_item}
          </h4>
          <p
            className={`text-sm line-clamp-2 transition-colors
            ${theme === "light"
                ? "text-gray-600 group-hover:text-gray-700"
                : "text-gray-400 group-hover:text-gray-300"
              }`}
          >
            {item.description}
          </p>
        </div>
        <span
          className={`text-lg font-semibold flex-shrink-0 transition-colors
          ${theme === "light"
              ? "text-gray-900 group-hover:text-gray-800"
              : "text-gray-100 group-hover:text-white"
            }`}
        >
          ₹{item.cost}
        </span>
      </div>

      {/* Tags with enhanced hover effects */}
      <div className="flex flex-wrap gap-2 mt-3">
        {item.rating && (
          <span
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300
            ${theme === "light"
                ? "bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 group-hover:text-yellow-900"
                : "bg-yellow-900/20 text-yellow-200 group-hover:bg-yellow-900/30"
              }`}
          >
            <Star size={12} className="mr-1" fill="currentColor" />
            {item.rating}
          </span>
        )}

        {item.spiciness !== "not spicy" && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300
            ${theme === "light"
                ? "bg-red-100 text-red-800 group-hover:bg-red-200 group-hover:text-red-900"
                : "bg-red-900/20 text-red-200 group-hover:bg-red-900/30"
              }`}
          >
            {item.spiciness}
          </span>
        )}

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300
          ${theme === "light"
              ? "bg-purple-100 text-purple-800 group-hover:bg-purple-200 group-hover:text-purple-900"
              : "bg-purple-900/20 text-purple-200 group-hover:bg-purple-900/30"
            }`}
        >
          {item.meal_course_type}
        </span>
      </div>
    </div>
  </motion.div>
);

const ComboDetailsModal = ({ isOpen, onClose, combo, theme = "light" }) => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLiked, setIsLiked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef(null);
  const scrollPositions = useRef({
    overview: 0,
    nutrition: 0,
    details: 0,
  });

  // All hooks must be before any conditional returns
  useEffect(() => {
    const preventOverscroll = (e) => {
      const element = contentRef.current;
      if (!element) return;

      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrollingUp = e.touches[0].clientY > lastScrollTop.current;
      const scrollingDown = e.touches[0].clientY < lastScrollTop.current;

      // Prevent overscroll when at the top or bottom
      if ((scrollingUp && scrollTop <= 0) ||
        (scrollingDown && scrollTop + clientHeight >= scrollHeight)) {
        e.preventDefault();
      }

      lastScrollTop.current = e.touches[0].clientY;
    };

    const handleTouchStart = (e) => {
      lastScrollTop.current = e.touches[0].clientY;
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('touchstart', handleTouchStart, { passive: true });
      content.addEventListener('touchmove', preventOverscroll, { passive: false });

      return () => {
        content.removeEventListener('touchstart', handleTouchStart);
        content.removeEventListener('touchmove', preventOverscroll);
      };
    }
  }, []);

  // Reset scroll positions effect
  useEffect(() => {
    if (!isOpen) {
      scrollPositions.current = {
        overview: 0,
        nutrition: 0,
        details: 0,
      };
      setIsScrolled(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const scrollTop = contentRef.current?.scrollTop || 0;
        const threshold = 100;
        const hysteresis = 20;

        scrollPositions.current[activeSection] = scrollTop;

        if (!isScrolled && scrollTop > threshold + hysteresis) {
          setIsScrolled(true);
        } else if (isScrolled && scrollTop < threshold - hysteresis) {
          setIsScrolled(false);
        }
      }, 10);
    };

    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      };
    }
  }, [isScrolled, activeSection]);

  const handleSectionChange = (section) => {
    if (contentRef.current) {
      scrollPositions.current[activeSection] = contentRef.current.scrollTop;
    }

    setActiveSection(section);

    requestAnimationFrame(() => {
      if (contentRef.current) {
        if (isScrolled) {
          contentRef.current.scrollTop = Math.max(
            120,
            scrollPositions.current[section]
          );
        } else {
          contentRef.current.scrollTop = Math.min(
            80,
            scrollPositions.current[section]
          );
        }
      }
    });
  };

  // Single conditional return after all hooks
  if (!isOpen || !combo) return null;

  const headerHeight = isScrolled ? 104 : 0;
  const heroHeight = isScrolled ? 0 : 384;
  const topSpacing = headerHeight;
  const discountPercentage = combo.discount_pct || 0;
  const heroImage = combo.combo_items[0]?.image_link;
  const tabs = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "nutrition", label: "Nutrition", icon: Flame },
    { id: "details", label: "Details", icon: Info },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overscroll-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overscroll-none ${theme === "light" ? "bg-white" : "bg-gray-900"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={contentRef}
              className="h-full overflow-y-auto overflow-x-hidden overscroll-none touch-pan-y will-change-scroll no-scrollbar"
              style={{
                height: "calc(100vh - 4rem)",
                scrollPaddingTop: topSpacing,
                overscrollBehavior: "none",
                WebkitOverflowScrolling: "touch",
                position: "relative", // Add this
                isolation: "isolate",  // Add this
              }}
            >
              {/* Hero Section */}
              <motion.div
                className="relative touch-none"
                animate={{
                  height: heroHeight,
                  marginBottom: isScrolled ? 0 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: isScrolled ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={heroImage}
                    alt={combo.combo_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Status Tag */}
                  <div className="absolute top-6 left-6 z-20">
                    {combo.combo_type === "premium" && (
                      <StatusTag type="premium" theme={theme} />
                    )}
                    {combo.combo_type === "vip" && (
                      <StatusTag type="vip" theme={theme} />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all
                        ${isLiked
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                    >
                      <Heart
                        size={20}
                        className={isLiked ? "fill-current" : ""}
                      />
                    </button>
                    <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Hero Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold text-white">
                        {combo.combo_name}
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-white">
                          ₹{combo.discounted_cost}
                        </span>
                        {discountPercentage > 0 && (
                          <>
                            <span className="text-sm line-through text-white/60">
                              ₹{combo.cost}
                            </span>
                            <div className="flex items-center gap-2 bg-green-500 px-4 py-1.5 rounded-full">
                              <Sparkles size={16} className="text-white" />
                              <span className="text-sm font-semibold text-white">
                                Save {discountPercentage}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Sticky Header */}
              <motion.div
                className={`sticky top-0 z-30 transform ${theme === "light" ? "bg-white" : "bg-gray-900"
                  }`}
                animate={{
                  translateY: isScrolled ? 0 : -headerHeight,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Compact Header */}
                <motion.div
                  className={`border-b ${theme === "light" ? "border-gray-200" : "border-gray-700"
                    }`}
                  animate={{ height: isScrolled ? "4.5rem" : 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="relative h-full">
                    {/* Background with subtle gradient */}
                    <div
                      className={`absolute inset-0 ${theme === "light"
                        ? "bg-gradient-to-r from-white via-gray-50/50 to-white"
                        : "bg-gradient-to-r from-gray-900 via-gray-800/50 to-gray-900"
                        }`}
                    />

                    {/* Content */}
                    <div className="relative h-full px-6 flex items-center justify-between">
                      {/* Left side: Title and Price */}
                      <div className="flex items-center gap-6 min-w-0 flex-1">
                        {/* Veg/Non-veg indicator */}
                        {combo.combo_items.some(
                          (item) => item.veg_or_non_veg === "veg"
                        ) && (
                            <div
                              className={`hidden sm:flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2
            ${theme === "light"
                                  ? "border-green-500 bg-green-50"
                                  : "border-green-400 bg-green-900/20"
                                }`}
                            >
                              <Leaf
                                size={12}
                                className={
                                  theme === "light"
                                    ? "text-green-500"
                                    : "text-green-400"
                                }
                              />
                            </div>
                          )}

                        {/* Title and Subtitle */}
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`text-base font-semibold truncate ${theme === "light"
                              ? "text-gray-900"
                              : "text-gray-100"
                              }`}
                          >
                            {combo.combo_name}
                          </h3>
                          <div className="flex items-center gap-3 mt-0.5">
                            {/* Price info */}
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-sm font-bold ${theme === "light"
                                  ? "text-gray-900"
                                  : "text-gray-100"
                                  }`}
                              >
                                ₹{combo.discounted_cost}
                              </span>
                              {combo.discount_pct > 0 && (
                                <>
                                  <span
                                    className={`text-xs line-through ${theme === "light"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                      }`}
                                  >
                                    ₹{combo.cost}
                                  </span>
                                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                    {combo.discount_pct}% off
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Divider */}
                            <span
                              className={`hidden sm:inline-block h-4 w-px ${theme === "light"
                                ? "bg-gray-200"
                                : "bg-gray-700"
                                }`}
                            />

                            {/* Additional info badges */}
                            <div className="hidden sm:flex items-center gap-2">
                              {combo.combo_type === "premium" && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${theme === "light"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-amber-900/20 text-amber-200"
                                    }`}
                                >
                                  <Award size={10} className="flex-shrink-0" />
                                  Premium
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                ${theme === "light"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-blue-900/20 text-blue-200"
                                  }`}
                              >
                                <Users size={10} className="flex-shrink-0" />
                                2-3 People
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {/* Additional actions that appear on larger screens */}
                        <motion.div
                          className="hidden sm:flex items-center gap-2 mr-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <button
                            className={`p-2 rounded-full transition-colors ${theme === "light"
                              ? "hover:bg-gray-100 text-gray-600"
                              : "hover:bg-gray-800 text-gray-300"
                              }`}
                          >
                            <Share2 size={18} />
                          </button>
                          <button
                            className={`p-2 rounded-full transition-colors ${theme === "light"
                              ? "hover:bg-gray-100 text-gray-600"
                              : "hover:bg-gray-800 text-gray-300"
                              }`}
                          >
                            <BookmarkPlus size={18} />
                          </button>
                        </motion.div>

                        {/* Primary actions */}
                        <button
                          onClick={() => setIsLiked(!isLiked)}
                          className={`p-2 rounded-full transition-colors ${isLiked
                            ? "bg-red-500 text-white"
                            : theme === "light"
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                          <Heart
                            size={18}
                            className={isLiked ? "fill-current" : ""}
                          />
                        </button>
                        <button
                          onClick={onClose}
                          className={`p-2 rounded-full transition-colors ${theme === "light"
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation */}
                <div
                  className={`border-b ${theme === "light" ? "border-gray-200" : "border-gray-700"
                    }`}
                >
                  <div className="flex justify-between px-4 sm:px-6">
                    <div className="flex -mb-px space-x-2 sm:space-x-4">
                      {tabs.map(({ id, label, icon }) => (
                        <TabButton
                          key={id}
                          id={id}
                          label={label}
                          icon={icon}
                          isActive={activeSection === id}
                          onClick={() => handleSectionChange(id)}
                          theme={theme}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <div
                className={`p-8 transition-all duration-300`}
                style={{
                  paddingTop: isScrolled ? `${topSpacing + 24}px` : "32px",
                  marginTop: isScrolled ? 0 : 0,
                }}
              >
                <AnimatePresence mode="wait">
                  {activeSection === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* <NutritionBadge
                          label="Best Selling"
                          value={`${
                            combo.combo_items[0]?.number_of_people_rated ||
                            "100"
                          }+ orders`}
                          icon={TrendingUp}
                          theme={theme}
                        /> */}
                        <NutritionBadge
                          label="Preparation Time"
                          value={`${Math.max(
                            ...combo.combo_items.map(
                              (item) => parseInt(item.preparation_time) || 20
                            )
                          )} mins`}
                          icon={Timer}
                          theme={theme}
                        />
                        <NutritionBadge
                          label="Ideal For"
                          value="2-3 People"
                          icon={Users}
                          theme={theme}
                        />
                      </div>

                      {/* Combo Items Grid */}
                      <div className="space-y-4">
                        <h3
                          className={`text-2xl font-semibold ${theme === "light"
                            ? "text-gray-900"
                            : "text-gray-100"
                            }`}
                        >
                          What's Included
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {combo.combo_items.map((item) => (
                            <ComboItemCard
                              key={item.item_id}
                              item={item}
                              theme={theme}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Cuisines and Categories */}
                      <div className="space-y-4">
                        <h3
                          className={`text-2xl font-semibold ${theme === "light"
                            ? "text-gray-900"
                            : "text-gray-100"
                            }`}
                        >
                          Cuisines & Categories
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {Array.from(
                            new Set(
                              combo.combo_items.map((item) => item.cuisine)
                            )
                          ).map((cuisine) => (
                            <motion.span
                              key={cuisine}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-full text-sm font-medium 
        ${theme === "light"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-purple-900/20 text-purple-200"
                                }`}
                            >
                              {cuisine.charAt(0).toUpperCase() +
                                cuisine.slice(1)}
                            </motion.span>
                          ))}
                          {Array.from(
                            new Set(
                              combo.combo_items.map(
                                (item) => item.meal_course_type
                              )
                            )
                          ).map((type) => (
                            <motion.span
                              key={type}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-full text-sm font-medium 
        ${theme === "light"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-blue-900/20 text-blue-200"
                                }`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "nutrition" && (
                    <motion.div
                      key="nutrition"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      {/* Nutrition Overview */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                          <div className="absolute inset-0 bg-blue-200 dark:bg-blue-700 opacity-20 rounded-full" />
                        </div>

                        <h3
                          className={`text-2xl font-semibold mb-6 relative z-10 ${theme === "light"
                            ? "text-gray-900"
                            : "text-gray-100"
                            }`}
                        >
                          Nutrition Overview
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                          {[
                            {
                              label: "Protein",
                              items: combo.combo_items.map(
                                (item) => item.protein
                              ),
                            },
                            {
                              label: "Carbs",
                              items: combo.combo_items.map(
                                (item) => item.carbohydrates
                              ),
                            },
                            {
                              label: "Fat",
                              items: combo.combo_items.map((item) => item.fat),
                            },
                            {
                              label: "Fiber",
                              items: combo.combo_items.map(
                                (item) => item.fiber
                              ),
                            },
                          ].map(({ label, items }) => {
                            const level = items.includes("high")
                              ? "high"
                              : items.includes("medium")
                                ? "medium"
                                : "low";
                            return (
                              <div
                                key={label}
                                className={`p-4 rounded-xl ${theme === "light" ? "bg-white" : "bg-gray-800"
                                  } backdrop-blur-sm`}
                              >
                                <p
                                  className={`text-sm font-medium mb-1 ${theme === "light"
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                    }`}
                                >
                                  {label}
                                </p>
                                <p
                                  className={`text-lg font-semibold capitalize ${level === "high"
                                    ? "text-red-600 dark:text-red-400"
                                    : level === "medium"
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-green-600 dark:text-green-400"
                                    }`}
                                >
                                  {level}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detailed Nutrition Per Item */}
                      {/* Update just the Detailed Nutrition Per Item section */}
                      <div className="space-y-6">
                        <h3
                          className={`text-2xl font-semibold ${theme === "light"
                            ? "text-gray-900"
                            : "text-gray-100"
                            }`}
                        >
                          Detailed Nutrition Information
                        </h3>

                        {combo.combo_items.map((item) => (
                          <motion.div
                            key={item.item_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2 }}
                            className={`p-6 rounded-xl ${theme === "light"
                              ? "bg-gray-50 hover:bg-gray-100"
                              : "bg-gray-800/50 hover:bg-gray-800"
                              } transition-all duration-300`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <h4
                                className={`text-lg font-semibold ${theme === "light"
                                  ? "text-gray-900"
                                  : "text-gray-100"
                                  }`}
                              >
                                {item.name_of_item}
                              </h4>
                              {/* Enhanced dietary type badge */}
                              <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
          ${item.veg_or_non_veg === "veg"
                                    ? theme === "light"
                                      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20"
                                      : "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
                                    : theme === "light"
                                      ? "bg-red-100 text-red-700 ring-1 ring-red-600/20"
                                      : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                                  }`}
                              >
                                {item.veg_or_non_veg === "veg" ? (
                                  <>
                                    <Leaf size={14} className="flex-shrink-0" />
                                    <span>Vegetarian</span>
                                  </>
                                ) : (
                                  <>
                                    <Utensils
                                      size={14}
                                      className="flex-shrink-0"
                                    />
                                    <span>Non-vegetarian</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {[
                                { label: "Energy", value: item.energy },
                                { label: "Protein", value: item.protein },
                                { label: "Carbs", value: item.carbohydrates },
                                { label: "Fat", value: item.fat },
                                { label: "Fiber", value: item.fiber },
                                { label: "Sugar", value: item.sugar_content },
                              ].map(({ label, value }) => (
                                <div
                                  key={label}
                                  className={`p-3 rounded-lg ${theme === "light"
                                    ? "bg-white"
                                    : "bg-gray-700"
                                    }`}
                                >
                                  <p
                                    className={`text-xs font-medium ${theme === "light"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                      }`}
                                  >
                                    {label}
                                  </p>
                                  <p
                                    className={`text-sm font-semibold mt-1 capitalize ${theme === "light"
                                      ? "text-gray-900"
                                      : "text-gray-100"
                                      }`}
                                  >
                                    {value || "N/A"}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Health Tags with enhanced styling */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              {item.health_concious_option === "yes" && (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            ${theme === "light"
                                      ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                                      : "bg-green-500/20 text-green-300 ring-1 ring-green-500/30"
                                    }`}
                                >
                                  <Heart size={14} className="flex-shrink-0" />
                                  Health Conscious
                                </span>
                              )}
                              {item.is_keto_friendly === "yes" && (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            ${theme === "light"
                                      ? "bg-purple-100 text-purple-700 ring-1 ring-purple-600/20"
                                      : "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30"
                                    }`}
                                >
                                  <Flame size={14} className="flex-shrink-0" />
                                  Keto Friendly
                                </span>
                              )}
                              {item.is_low_gi === "yes" && (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            ${theme === "light"
                                      ? "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20"
                                      : "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
                                    }`}
                                >
                                  <TrendingUp
                                    size={14}
                                    className="flex-shrink-0"
                                  />
                                  Low GI
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Rest of the component remains the same */}

                      {/* Allergen Information */}
                      <div
                        className={`p-6 rounded-2xl ${theme === "light" ? "bg-amber-50" : "bg-amber-900/20"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle
                            className={
                              theme === "light"
                                ? "text-amber-600"
                                : "text-amber-400"
                            }
                          />
                          <h3
                            className={`text-lg font-semibold ${theme === "light"
                              ? "text-amber-800"
                              : "text-amber-200"
                              }`}
                          >
                            Allergen Information
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {combo.combo_items.map(
                            (item) =>
                              item.allergens_present &&
                              item.allergens_present !== "not applicable" && (
                                <div
                                  key={item.item_id}
                                  className="flex items-start gap-2"
                                >
                                  <span
                                    className={`text-sm ${theme === "light"
                                      ? "text-amber-800"
                                      : "text-amber-200"
                                      }`}
                                  >
                                    {item.name_of_item}:
                                  </span>
                                  <span
                                    className={`text-sm font-medium ${theme === "light"
                                      ? "text-amber-900"
                                      : "text-amber-100"
                                      }`}
                                  >
                                    Contains {item.allergens_present}
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      {/* Dietary Preferences */}
                      <div
                        className={`p-6 rounded-2xl ${theme === "light"
                          ? "bg-gradient-to-br from-gray-50 to-gray-100/50"
                          : "bg-gradient-to-br from-gray-800/50 to-gray-700/50"
                          }`}
                      >
                        <h3
                          className={`text-2xl font-semibold mb-6 ${theme === "light"
                            ? "text-gray-900"
                            : "text-gray-100"
                            }`}
                        >
                          Dietary Information
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {[
                            {
                              label: "Vegetarian Options",
                              value: combo.combo_items.some(
                                (item) => item.veg_or_non_veg === "veg"
                              ),
                            },
                            {
                              label: "Vegan Options",
                              value: combo.combo_items.some(
                                (item) => item.is_vegan === "yes"
                              ),
                            },
                            {
                              label: "Gluten Free",
                              value: combo.combo_items.every(
                                (item) => item.is_gluten_free === "yes"
                              ),
                            },
                            {
                              label: "Dairy Free",
                              value: combo.combo_items.every(
                                (item) => item.is_dairy_free === "yes"
                              ),
                            },
                            {
                              label: "Keto Friendly",
                              value: combo.combo_items.every(
                                (item) => item.is_keto_friendly === "yes"
                              ),
                            },
                            {
                              label: "Health Conscious",
                              value: combo.combo_items.every(
                                (item) => item.health_concious_option === "yes"
                              ),
                            },
                          ].map(({ label, value }) => (
                            <div
                              key={label}
                              className={`p-4 rounded-xl ${theme === "light" ? "bg-white" : "bg-gray-800"
                                }`}
                            >
                              <p
                                className={`text-sm font-medium ${theme === "light"
                                  ? "text-gray-600"
                                  : "text-gray-400"
                                  }`}
                              >
                                {label}
                              </p>
                              <p
                                className={`text-lg font-semibold mt-1 ${value
                                  ? theme === "light"
                                    ? "text-green-600"
                                    : "text-green-400"
                                  : theme === "light"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                  }`}
                              >
                                {value ? "Yes" : "No"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preparation Details */}
                      <div className="space-y-6">
                        <h3
                          className={`text-2xl font-semibold ${theme === "light"
                            ? "text-gray-900"
                            : "text-gray-100"
                            }`}
                        >
                          Preparation Details
                        </h3>

                        {/* Preparation Time and Serving Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <motion.div
                            whileHover={{ y: -2 }}
                            className={`p-6 rounded-xl ${theme === "light"
                              ? "bg-gradient-to-br from-blue-50 to-blue-100/50"
                              : "bg-gradient-to-br from-blue-900/20 to-blue-800/20"
                              }`}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className={`p-2 rounded-lg ${theme === "light"
                                  ? "bg-blue-100"
                                  : "bg-blue-800/40"
                                  }`}
                              >
                                <Clock
                                  size={24}
                                  className={
                                    theme === "light"
                                      ? "text-blue-700"
                                      : "text-blue-300"
                                  }
                                />
                              </div>
                              <div>
                                <h4
                                  className={`font-medium ${theme === "light"
                                    ? "text-blue-900"
                                    : "text-blue-100"
                                    }`}
                                >
                                  Total Preparation Time
                                </h4>
                                <p
                                  className={`text-sm ${theme === "light"
                                    ? "text-blue-700"
                                    : "text-blue-300"
                                    }`}
                                >
                                  Includes cooking & plating
                                </p>
                              </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-3xl font-bold ${theme === "light"
                                  ? "text-blue-700"
                                  : "text-blue-300"
                                  }`}
                              >
                                {Math.max(
                                  ...combo.combo_items.map(
                                    (item) =>
                                      parseInt(item.preparation_time) || 20
                                  )
                                )}
                              </span>
                              <span
                                className={`text-lg ${theme === "light"
                                  ? "text-blue-600"
                                  : "text-blue-400"
                                  }`}
                              >
                                minutes
                              </span>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -2 }}
                            className={`p-6 rounded-xl ${theme === "light"
                              ? "bg-gradient-to-br from-purple-50 to-purple-100/50"
                              : "bg-gradient-to-br from-purple-900/20 to-purple-800/20"
                              }`}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className={`p-2 rounded-lg ${theme === "light"
                                  ? "bg-purple-100"
                                  : "bg-purple-800/40"
                                  }`}
                              >
                                <Users
                                  size={24}
                                  className={
                                    theme === "light"
                                      ? "text-purple-700"
                                      : "text-purple-300"
                                  }
                                />
                              </div>
                              <div>
                                <h4
                                  className={`font-medium ${theme === "light"
                                    ? "text-purple-900"
                                    : "text-purple-100"
                                    }`}
                                >
                                  Recommended Serving
                                </h4>
                                <p
                                  className={`text-sm ${theme === "light"
                                    ? "text-purple-700"
                                    : "text-purple-300"
                                    }`}
                                >
                                  Perfect portion size
                                </p>
                              </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-3xl font-bold ${theme === "light"
                                  ? "text-purple-700"
                                  : "text-purple-300"
                                  }`}
                              >
                                2-3
                              </span>
                              <span
                                className={`text-lg ${theme === "light"
                                  ? "text-purple-600"
                                  : "text-purple-400"
                                  }`}
                              >
                                people
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Meal Course Flow */}
                        <div className="mt-8">
                          <h4
                            className={`text-xl font-semibold mb-6 ${theme === "light"
                              ? "text-gray-900"
                              : "text-gray-100"
                              }`}
                          >
                            Recommended Serving Order
                          </h4>
                          <div className="relative">
                            <div
                              className={`absolute left-6 top-0 bottom-0 w-0.5 ${theme === "light"
                                ? "bg-gray-200"
                                : "bg-gray-700"
                                }`}
                            />
                            {combo.combo_items.map((item, index) => (
                              <motion.div
                                key={item.item_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex items-start gap-6 pb-8"
                              >
                                <div
                                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${theme === "light"
                                    ? "bg-white shadow-md"
                                    : "bg-gray-800"
                                    }`}
                                >
                                  <span
                                    className={`text-lg font-semibold ${theme === "light"
                                      ? "text-gray-900"
                                      : "text-gray-100"
                                      }`}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                                <div
                                  className={`flex-1 p-6 rounded-xl ${theme === "light"
                                    ? "bg-gray-50"
                                    : "bg-gray-800/50"
                                    }`}
                                >
                                  <h5
                                    className={`text-lg font-medium mb-2 ${theme === "light"
                                      ? "text-gray-900"
                                      : "text-gray-100"
                                      }`}
                                  >
                                    {item.name_of_item}
                                  </h5>
                                  <p
                                    className={`text-sm ${theme === "light"
                                      ? "text-gray-600"
                                      : "text-gray-400"
                                      }`}
                                  >
                                    {item.meal_course_type}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "light"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-blue-900/20 text-blue-200"
                                        }`}
                                    >
                                      {item.cuisine}
                                    </span>
                                    {item.spiciness !== "not spicy" && (
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "light"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-red-900/20 text-red-200"
                                          }`}
                                      >
                                        {item.spiciness}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Bottom Action Bar */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`sticky bottom-0 p-6 border-t backdrop-blur-md z-20 ${
                theme === 'light'
                  ? 'bg-white/90 border-gray-200'
                  : 'bg-gray-900/90 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between gap-6 max-w-3xl mx-auto">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className={`text-2xl font-bold ${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                    }`}>
                      ₹{combo.discounted_cost}
                    </span>
                    {combo.discount_pct > 0 && (
                      <span className={`text-sm line-through ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ₹{combo.cost}
                      </span>
                    )}
                  </div>
                  {combo.discount_pct > 0 && (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Save {combo.discount_pct}% today
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-xl ${
                      theme === 'light'
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <BookmarkPlus size={24} className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'} />
                  </motion.button>
                </div>
              </div>
            </motion.div> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComboDetailsModal;
