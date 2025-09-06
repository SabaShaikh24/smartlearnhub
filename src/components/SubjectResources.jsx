import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Youtube } from "lucide-react";

// eslint-disable-next-line no-unused-vars
const ExpandableSection = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="w-full flex items-center justify-between bg-white shadow-md 
                   px-4 py-3 rounded-2xl hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Icon className="w-5 h-5 text-blue-500" />
          {title}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`} 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-2 bg-gray-50 rounded-xl shadow-inner p-4"
            role="region"
            aria-label={title}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SubjectResources({ notes = [], youtube = [], loading = false, error = "" }) {
  return (
    <div className="space-y-4">
      {/* Notes Section */}
      <ExpandableSection title="Notes" icon={FileText}>
        {loading ? (
          <p role="status" aria-live="polite" className="text-gray-500">
               Loading notes...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : notes.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {notes.map((note) => (
              <li key={note.id || note.title}>
                <a
                  href={note.link}
                  aria-label={`Open note: ${note.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {note.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notes available</p>
        )}
      </ExpandableSection>

      {/* YouTube Section */}
      <ExpandableSection title="YouTube Resources" icon={Youtube}>
        {loading ? (
          <p className="text-gray-500">Loading YouTube links...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : youtube.length > 0 ? (
          <div className="space-y-2">
            {youtube.map((yt) => (
              <a
                key={yt.id || yt.title}
                href={yt.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-md bg-red-100 hover:bg-red-200 
                           transition text-red-600 font-medium"
              >
                🔗 {yt.title}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No YouTube links</p>
        )}
      </ExpandableSection>
    </div>
  );
}
