import { tx, useLanguage } from '@react-quest/localization';
import Editor, { loader } from '@monaco-editor/react';
import { useContext, useEffect, useRef } from 'react';
import { AppearanceContext } from '../hooks/useAppearance';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import type * as Monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import * as typescript from 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = { getWorker(_, label) { return label === 'typescript' || label === 'javascript' ? new TypeScriptWorker() : new EditorWorker(); } };
loader.config({ monaco });

type Props = { value: string; readOnly: boolean; onChange: (value: string) => void; onRun: () => void };

export default function CodeEditor({ value, readOnly, onChange, onRun }: Props) {
  useLanguage();
  const appearance = useContext(AppearanceContext);
  const run = useRef(onRun);
  useEffect(() => { run.current = onRun; }, [onRun]);
  return <Editor height="100%" language="javascript" path="App.jsx" value={value} onChange={(next) => onChange(next ?? '')} loading={<span className="editor-loading">{tx("در حال آماده‌سازی ویرایشگر…")}</span>} beforeMount={(editor) => {
    editor.editor.defineTheme('react-quest-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#1b2927', 'editorLineNumber.foreground': '#536a5b', 'editorLineNumber.activeForeground': '#a4be93', 'editorCursor.foreground': '#cee1b5', 'editor.selectionBackground': '#3e5849' } });
    editor.editor.defineTheme('react-quest-light', { base: 'vs', inherit: true, rules: [], colors: { 'editor.background': '#f3f6f1', 'editor.foreground': '#293d36', 'editorLineNumber.foreground': '#78867c', 'editorCursor.foreground': '#365b47', 'editor.selectionBackground': '#cee0d4' } });
    (typescript as typeof Monaco.typescript).javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: true, noSyntaxValidation: false });
  }} theme={`react-quest-${appearance}`} onMount={(editor, api) => { editor.addCommand(api.KeyMod.CtrlCmd | api.KeyCode.Enter, () => run.current()); }} options={{ ariaLabel: tx('ویرایشگر کد React'), readOnly, minimap: { enabled: false }, fontSize: 14, fontFamily: 'Consolas, monospace', lineHeight: 25, padding: { top: 20 }, scrollBeyondLastLine: false, tabSize: 2, automaticLayout: true, wordWrap: 'on', renderLineHighlight: 'none', contextmenu: true, fixedOverflowWidgets: true }} />;
}
