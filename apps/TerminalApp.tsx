import React, { useState, useEffect, useRef } from 'react';

const MAX_COMMAND_LENGTH = 1000;

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to Joeyconnects.os', 'Type "help" for available commands.']);
  const [currentLine, setCurrentLine] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    if (cmd.length > MAX_COMMAND_LENGTH) {
      setHistory([...history, `> ${escapeHtml(cmd.substring(0, 50))}...`, 'Error: Command too long']);
      return;
    }

    const trimmed = cmd.trim();
    const trimmedLower = trimmed.toLowerCase();
    const newHistory = [...history, `> ${escapeHtml(cmd)}`];

    switch (trimmedLower) {
      case 'help':
        newHistory.push('Available commands: help, clear, whoami, date, echo [text]');
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        newHistory.push('guest_user@hacker_os');
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      default:
        if (trimmedLower.startsWith('echo ')) {
           newHistory.push(escapeHtml(trimmed.substring(5)));
        } else if (trimmed !== '') {
           newHistory.push(`Command not found: ${escapeHtml(trimmed)}`);
        }
    }
    setHistory(newHistory);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentLine);
      setCurrentLine('');
    }
  };

  return (
    <div className="h-full bg-ph-black text-green-400 p-4 font-mono text-sm overflow-auto" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((line, i) => (
        <div key={`terminal-line-${i}`} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />
      ))}
      <div className="flex">
        <span className="mr-2 text-ph-orange">$</span>
        <input
          id="term-input"
          className="bg-transparent border-none outline-none flex-1 text-green-400 font-mono"
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};