import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Plus,
  SlidersHorizontal,
  Type,
  Mic,
  ArrowUp,
  FileText,
} from "lucide-react";
import "./PromptBox.css";

interface PromptBoxProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const PromptBox = ({ onSubmit, isLoading }: PromptBoxProps) => {
  const [showUpgrade, setShowUpgrade] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((prompt.trim() || selectedFile) && !isLoading) {
      onSubmit(prompt.trim());
      setPrompt("");
      clearFile();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // reset back to single line explicitly
      }
    }
  };

  return (
    <div className="promptbox-wrapper">
      <div className="promptbox-container">
        {showUpgrade && (
          <div className="promptbox-upgrade-banner">
            <div className="promptbox-upgrade-text">
              <Sparkles size={16} color="var(--color-text-dark)" />
              <span>
                <strong>Upgrade</strong> for best quality & speed
              </span>
            </div>
            <button
              className="promptbox-close"
              onClick={() => setShowUpgrade(false)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="promptbox-input-area">
          {selectedFile && (
            <div
              className={`promptbox-file-preview ${previewUrl ? "has-image" : ""}`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="promptbox-image-thumb"
                />
              ) : (
                <FileText size={16} color="var(--color-text-dark)" />
              )}
              <span className="promptbox-file-name">{selectedFile.name}</span>
              <button className="promptbox-file-remove" onClick={clearFile}>
                <X size={14} color="var(--color-text-muted)" />
              </button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            className="promptbox-textarea"
            placeholder="Ask template.net"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />

          <div className="promptbox-toolbar">
            <div className="promptbox-toolbar-left">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button className="toolbar-btn" onClick={handlePlusClick}>
                <Plus size={20} color="var(--color-text-dark)" />
              </button>
              <button className="toolbar-btn text-btn">
                <SlidersHorizontal size={18} color="var(--color-text-dark)" />
                <span>Tools</span>
              </button>

              <button className="toolbar-btn active-tool">
                <Type size={16} color="var(--color-surface-white)" />
              </button>
            </div>

            <div className="promptbox-toolbar-right">
              <button className="toolbar-btn">
                <Mic size={20} color="var(--color-text-dark)" />
              </button>
              <button
                className={`toolbar-submit-btn ${(prompt.trim() || selectedFile) && !isLoading ? "active" : ""}`}
                onClick={handleSubmit}
                disabled={(!prompt.trim() && !selectedFile) || isLoading}
              >
                <ArrowUp size={20} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBox;
