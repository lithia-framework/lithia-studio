"use client";

import Editor, { loader } from "@monaco-editor/react";
import type React from "react";
import { useCallback, useEffect } from "react";

// Theme configurations
const THEME_CONFIGS = {
  "studio-dark": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "string", foreground: "E6B800" },
      { token: "number", foreground: "4ECDC4" },
      { token: "keyword", foreground: "FF6B6B" },
      { token: "operator", foreground: "FFFFFF" },
      { token: "delimiter", foreground: "FFFFFF" },
      { token: "property", foreground: "74C0FC" },
      { token: "comment", foreground: "6C757D" },
    ],
    colors: {
      "editor.background": "#080e22",
      "editor.foreground": "#FFFFFF",
      "editorLineNumber.foreground": "#6C757D",
      "editor.selectionBackground": "#374151",
      "editor.inactiveSelectionBackground": "#374151",
      "editorCursor.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": "#020618",
      "editorError.foreground": "#FF6B6B",
      "editorError.border": "#FF6B6B",
      "editorError.background": "#FF6B6B20",
      "editorWarning.foreground": "#FFA500",
      "editorWarning.border": "#FFA500",
      "editorWarning.background": "#FFA50020",
      "editorInfo.foreground": "#74C0FC",
      "editorInfo.border": "#74C0FC",
      "editorInfo.background": "#74C0FC20",
      // Suggestions widget colors
      "editorSuggestWidget.background": "#080e22",
      "editorSuggestWidget.border": "rgba(255, 255, 255, 0.1)",
      "editorSuggestWidget.foreground": "#FFFFFF",
      "editorSuggestWidget.highlightForeground": "#2CFC81",
      "editorSuggestWidget.selectedBackground": "rgba(44, 252, 129, 0.1)",
      "editorSuggestWidget.selectedForeground": "#FFFFFF",
      "editorSuggestWidget.focusHighlightForeground": "#2CFC81",
      "editorSuggestWidget.selectedIconForeground": "#2CFC81",
      "editorSuggestWidget.selectedBorder": "rgba(44, 252, 129, 0.2)",
    },
  },
};

export type ThemeName = keyof typeof THEME_CONFIGS;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  wordWrap?: "on" | "off" | "wordWrapColumn" | "bounded";
  fontSize?: number;
  tabSize?: number;
  insertSpaces?: boolean;
  formatOnPaste?: boolean;
  formatOnType?: boolean;
  quickSuggestions?: boolean;
  showSuggestions?: boolean;
  stickyScroll?: boolean;
  contextMenu?: boolean;
  glyphMargin?: boolean;
  className?: string;
  theme?: ThemeName;
  folding?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "json",
  height = "200px",
  placeholder,
  readOnly = false,
  showLineNumbers = true,
  showMinimap = false,
  wordWrap = "on",
  fontSize = 14,
  tabSize = 2,
  insertSpaces = true,
  formatOnPaste = false,
  formatOnType = false,
  quickSuggestions = false,
  showSuggestions = true,
  stickyScroll = true,
  contextMenu = true,
  glyphMargin = true,
  className,
  theme = "studio-dark",
  folding = false,
}) => {
  useEffect(() => {
    const initializeMonaco = async () => {
      const monaco = await loader.init();

      Object.entries(THEME_CONFIGS).forEach(([themeName, themeConfig]) => {
        monaco.editor.defineTheme(themeName, themeConfig);
      });

      // Disable TypeScript validation completely
      if (language === "typescript" || language === "javascript") {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
          noSuggestionDiagnostics: true,
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          noLib: true,
          allowNonTsExtensions: true,
        });
      }

      monaco.editor.setTheme(theme);
    };

    initializeMonaco();
  }, [theme, language]);

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      const val = newValue || "";
      onChange(val);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <Editor
        height={height}
        defaultLanguage={language}
        value={value}
        onChange={handleChange}
        theme={theme}
        options={{
          readOnly,
          minimap: { enabled: showMinimap },
          scrollBeyondLastLine: false,
          fontSize,
          lineNumbers: showLineNumbers ? ("on" as const) : ("off" as const),
          wordWrap,
          automaticLayout: true,
          padding: { top: 8, bottom: 8 },
          renderLineHighlight: "none",
          tabSize,
          insertSpaces,
          placeholder,
          suggest: {
            showKeywords: showSuggestions,
            showSnippets: showSuggestions,
          },
          quickSuggestions,
          formatOnPaste,
          formatOnType,
          stickyScroll: { enabled: stickyScroll },
          contextmenu: contextMenu,
          glyphMargin,
          folding,
          renderValidationDecorations: "off",
          hover: {
            enabled: true,
            delay: 300,
            sticky: true,
          },
        }}
        onMount={(editor, monaco) => {
          editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            () => {}
          );
        }}
      />
    </div>
  );
};
