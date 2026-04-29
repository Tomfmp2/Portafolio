"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Database, Plane, Trophy,
  Folder, Clock, Play, X, Hash, RotateCcw,
  TerminalSquare
} from "lucide-react";

// --- TERMINAL SCRIPT TYPES ---
type ScriptLine = {
  delay: number;
  text: string;
  type: 'cmd' | 'sys' | 'success' | 'error' | 'info' | 'input' | 'table';
};

// --- MOCK DATA ---
const CATEGORIES = [
  { id: "banking", label: "Banking System", icon: Database, color: "text-emerald-400" },
  { id: "airline", label: "Airline Tickets", icon: Plane, color: "text-sky-400" },
  { id: "betplay", label: "BetPlay League", icon: Trophy, color: "text-amber-400" },
];

const PROJECTS_DATA: Record<string, any> = {
  banking: {
    title: "Banking System Simulator",
    description: "Sistema bancario interactivo desarrollado en Python. Permite gestionar cuentas, realizar depósitos, retiros y ver extractos.",
    tags: ["python", "cli", "finance"],
    history: [
      { id: 1, text: "Fixed deposit validation logic", date: "Oct 28 14:00", type: "system" },
      { id: 2, text: "Added user authentication mock", date: "Oct 27 09:15", type: "info" }
    ],
    instances: [
      { id: "bank-demo", name: "Interactive Demo", type: "demo" }
    ],
    script: [
      { delay: 800, text: "> python main.py", type: "cmd" },
      { delay: 600, text: "Loading Banking Core Modules...", type: "sys" },
      { delay: 400, text: "Connecting to local DB (sqlite3)... [OK]", type: "success" },
      { delay: 300, text: " ", type: "info" },
      { delay: 300, text: "========================================", type: "info" },
      { delay: 100, text: "       WELCOME TO GLOBAL BANK           ", type: "success" },
      { delay: 100, text: "========================================", type: "info" },
      { delay: 500, text: "1. View Balance", type: "info" },
      { delay: 100, text: "2. Deposit Funds", type: "info" },
      { delay: 100, text: "3. Withdraw Funds", type: "info" },
      { delay: 100, text: "4. Exit", type: "info" },
      { delay: 800, text: "> Select an option: 2", type: "input" },
      { delay: 500, text: "Enter amount to deposit: $500", type: "input" },
      { delay: 800, text: "Processing transaction...", type: "sys" },
      { delay: 1200, text: "[SUCCESS] $500.00 deposited successfully.", type: "success" },
      { delay: 400, text: "New Balance: $3,250.00", type: "success" },
      { delay: 800, text: "> Select an option: 4", type: "input" },
      { delay: 400, text: "Thank you for using Global Bank. Goodbye!", type: "info" }
    ]
  },
  airline: {
    title: "Airline Ticket System",
    description: "Consola en C# que gestiona reservas de vuelos, selección de asientos y un programa de fidelización de millas.",
    tags: ["c#", ".net", "system"],
    history: [
      { id: 4, text: "Implemented miles calculation algorithm", date: "Oct 26 18:45", type: "success" },
      { id: 5, text: "Added flight route database", date: "Oct 25 11:20", type: "info" }
    ],
    instances: [
      { id: "airline-demo", name: "Booking Demo", type: "demo" }
    ],
    script: [
      { delay: 600, text: "> dotnet run", type: "cmd" },
      { delay: 800, text: "Build succeeded.", type: "success" },
      { delay: 200, text: "0 Warning(s)", type: "sys" },
      { delay: 200, text: "0 Error(s)", type: "sys" },
      { delay: 600, text: "\n--- TFM AIRLINES RESERVATION SYSTEM ---", type: "info" },
      { delay: 500, text: "Fetching available flights...", type: "sys" },
      { delay: 800, text: "FLIGHT   | ORIGIN    | DESTINATION | SEATS | PRICE", type: "table" },
      { delay: 100, text: "TF-104   | BOG       | MDE         | 42    | $120", type: "table" },
      { delay: 100, text: "TF-208   | BOG       | CTG         | 15    | $180", type: "table" },
      { delay: 100, text: "TF-901   | MDE       | BAQ         |  4    | $150", type: "table" },
      { delay: 1200, text: "> Enter Flight Number to book: TF-208", type: "input" },
      { delay: 600, text: "Selected: Bogota (BOG) to Cartagena (CTG)", type: "info" },
      { delay: 800, text: "> Enter Passenger Name: Tomas Medina", type: "input" },
      { delay: 1500, text: "Reserving seat 14B...", type: "sys" },
      { delay: 600, text: "Payment processed successfully.", type: "success" },
      { delay: 400, text: "+ 500 Frequent Flyer Miles added to account.", type: "success" },
      { delay: 500, text: "Booking Confirmed! Have a safe flight.", type: "info" }
    ]
  },
  betplay: {
    title: "BetPlay League Simulator",
    description: "Simulador del torneo de fútbol colombiano. Genera resultados aleatorios ponderados, actualiza tablas y calcula estadísticas.",
    tags: ["c#", "cli", "sports"],
    history: [
      { id: 7, text: "Fixed goal difference sorting", date: "Oct 20 10:00", type: "success" },
      { id: 8, text: "Added match event generator (cards/fouls)", date: "Oct 19 14:22", type: "info" }
    ],
    instances: [
      { id: "betplay-demo", name: "League Simulator", type: "demo" }
    ],
    script: [
      { delay: 500, text: "> dotnet run", type: "cmd" },
      { delay: 700, text: "Build succeeded.", type: "success" },
      { delay: 500, text: "Loading Teams Database... [16 teams loaded]", type: "sys" },
      { delay: 600, text: "\n--- LIGA BETPLAY SIMULATOR ---", type: "info" },
      { delay: 400, text: "Simulating Matchday 1...", type: "sys" },
      { delay: 1200, text: "[MATCH] Millonarios 2 - 1 Atl. Nacional", type: "info" },
      { delay: 400, text: "   ⚽ 12' L. Castro (MIL)", type: "success" },
      { delay: 400, text: "   ⚽ 45' D. Pabón (NAC)", type: "success" },
      { delay: 400, text: "   ⚽ 89' D. Silva (MIL)", type: "success" },
      { delay: 800, text: "[MATCH] America de Cali 0 - 0 Santa Fe", type: "info" },
      { delay: 1000, text: "Updating League Table...", type: "sys" },
      { delay: 600, text: "\nPOS | TEAM            | PTS | GD", type: "table" },
      { delay: 100, text: " 1  | Millonarios     |  3  | +1", type: "table" },
      { delay: 100, text: " 2  | America         |  1  |  0", type: "table" },
      { delay: 100, text: " 3  | Santa Fe        |  1  |  0", type: "table" },
      { delay: 100, text: " 4  | Atl. Nacional   |  0  | -1", type: "table" },
      { delay: 800, text: "\nSimulation paused. Press any key to continue...", type: "info" }
    ]
  }
};

// --- COMPONENTS ---

const TypewriterLine = ({ line, onComplete }: { line: ScriptLine, onComplete: () => void }) => {
  const [text, setText] = useState("");
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (line.type === "cmd" || line.type === "input") {
      let i = 0;
      const typeChar = () => {
        if (i < line.text.length) {
          setText(line.text.substring(0, i + 1));
          i++;
          // Randomize typing speed for realism
          timeout = setTimeout(typeChar, Math.random() * 40 + 20); 
        } else {
          timeout = setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current();
          }, 300);
        }
      };
      timeout = setTimeout(typeChar, line.delay);
    } else {
      // System outputs instantly after delay
      timeout = setTimeout(() => {
        setText(line.text);
        if (onCompleteRef.current) onCompleteRef.current();
      }, line.delay);
    }
    
    return () => clearTimeout(timeout);
  }, [line]);

  if (!text && line.text !== " ") return null;

  // Determine text color based on line type
  let colorClass = "text-zinc-300";
  if (line.type === "success") colorClass = "text-emerald-400";
  if (line.type === "sys") colorClass = "text-zinc-500";
  if (line.type === "error") colorClass = "text-rose-500";
  if (line.type === "info") colorClass = "text-sky-300";
  if (line.type === "input") colorClass = "text-amber-300 font-bold";
  if (line.type === "table") colorClass = "text-zinc-400 whitespace-pre";

  return (
    <div className={`font-mono text-[13px] sm:text-sm leading-relaxed ${colorClass}`}>
      {text || "\u00A0"}
    </div>
  );
};

export default function TerminalDashboard() {
  const [activeCategory, setActiveCategory] = useState("banking");
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState<ScriptLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  
  const activeData = PROJECTS_DATA[activeCategory];
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  const handleRun = () => {
    setTerminalLines([]);
    setCurrentLineIndex(0);
    setIsRunning(true);
  };

  const handleRestart = () => {
    setTerminalLines([]);
    setCurrentLineIndex(0);
  };

  const handleLineComplete = () => {
    if (currentLineIndex < activeData.script.length) {
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (isRunning && currentLineIndex < activeData.script.length) {
      setTerminalLines(activeData.script.slice(0, currentLineIndex + 1));
    }
  }, [isRunning, currentLineIndex, activeData]);

  const closeTerminal = () => {
    setIsRunning(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-[#0d0d0d] rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden font-sans">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-zinc-800/80 relative z-10">
        <div className="flex items-center gap-3 mb-6 md:mb-0">
          <TerminalSquare className="w-8 h-8 text-rose-500" />
          <h1 className="text-2xl font-mono font-bold tracking-widest text-zinc-100 uppercase flex items-center gap-2">
            t_f_m <span className="text-zinc-600 text-sm">/ CLI_LAUNCHER</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => !isRunning && setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
                  isActive 
                    ? `bg-zinc-900 ${cat.color} shadow-sm border border-zinc-700/50` 
                    : "text-zinc-500 border border-transparent hover:text-zinc-300 hover:bg-zinc-900/50"
                } ${isRunning ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 min-h-[500px]">
        
        {/* LEFT PANEL: HISTORY & LOGS */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <span className="text-zinc-300 bg-zinc-800/80 px-2 py-1 rounded">Recently</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">From Command</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Check Again</span>
          </div>

          <div className="bg-[#111111] rounded-xl border border-zinc-800/80 overflow-hidden flex-1 shadow-inner">
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/40 border-b border-zinc-800/80">
              <Folder className="w-4 h-4 text-zinc-400" />
              <h2 className="font-mono text-xs text-zinc-300 uppercase tracking-widest">Notebook</h2>
            </div>
            
            <div className="p-4 flex flex-col gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  {activeData.history.map((item: any) => (
                    <div key={item.id} className="group flex items-start gap-4 p-2 -mx-2 rounded-lg hover:bg-zinc-800/40 transition-colors cursor-default">
                      <Hash className={`w-4 h-4 mt-1 flex-shrink-0 ${
                        item.type === 'success' ? 'text-emerald-500/70' :
                        item.type === 'info' ? 'text-sky-400/70' :
                        'text-zinc-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-300 text-sm truncate font-medium group-hover:text-white transition-colors">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 flex-shrink-0">
                        {item.date}
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors w-fit">
                    <span>↓</span> Load more ...
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INSTANCES & RUNNER */}
        <div className="w-full lg:w-[420px] flex flex-col gap-6">
          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <span className="text-zinc-300 bg-zinc-800/80 px-2 py-1 rounded">All</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="w-4 h-4 text-zinc-400" />
              <h2 className="font-mono text-xs text-zinc-300 uppercase tracking-widest">Projects</h2>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                {/* Main Project Card */}
                <div className="bg-[#111] border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition-colors shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <h3 className="font-mono text-sm font-bold text-zinc-100">{activeData.title}</h3>
                  </div>
                  
                  <p className="text-sm text-zinc-400 mb-5 line-clamp-3 leading-relaxed">
                    {activeData.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeData.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 text-[10px] font-mono tracking-wider uppercase bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {activeData.instances.map((instance: any) => (
                      <div key={instance.id} className="flex flex-col gap-3 p-4 rounded-lg bg-[#0a0a0a] border border-zinc-800/80">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-zinc-300">{instance.name}</span>
                          <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            Ready
                          </span>
                        </div>
                        <button 
                          onClick={handleRun}
                          className="w-full group relative overflow-hidden rounded bg-zinc-100 hover:bg-white text-black transition-all px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold"
                        >
                          <Play className="w-4 h-4" />
                          ▶ Run Demo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TERMINAL SIMULATION OVERLAY */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-0 z-50 p-4 md:p-8 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="w-full h-full max-w-4xl max-h-[650px] bg-[#050505] rounded-xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
              
              {/* Terminal Header */}
              <div className="h-12 bg-[#0f0f0f] border-b border-zinc-800 flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                  <Terminal className="w-3 h-3" />
                  root@{activeCategory}-env ~ /opt/projects/{activeCategory}
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleRestart}
                    title="Restart Demo"
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={closeTerminal}
                    title="Close"
                    className="text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Terminal Output Body */}
              <div className="flex-1 p-6 overflow-y-auto bg-transparent scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="font-mono text-xs sm:text-sm mb-6 space-y-1">
                  <p className="text-zinc-600">TFM Interactive Demo Environment [Version 2.0.1]</p>
                  <p className="text-zinc-600">(c) Tomas Felipe Medina. All rights reserved.</p>
                  <p className="text-zinc-600 mt-2">Loading virtual environment...</p>
                </div>
                
                <div className="space-y-1 pb-8">
                  {terminalLines.map((line, idx) => (
                    <TypewriterLine 
                      key={idx} 
                      line={line} 
                      onComplete={() => idx === currentLineIndex ? handleLineComplete() : null} 
                    />
                  ))}
                  
                  {/* Blinking Cursor at the end */}
                  {currentLineIndex >= activeData.script.length && (
                    <div className="flex items-center font-mono text-sm text-zinc-300 mt-2">
                      <span className="mr-2 text-rose-500">➜</span>
                      <span className="text-sky-400">/opt/projects/{activeCategory}</span>
                      <motion.div 
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-2.5 h-4 bg-zinc-400 ml-2"
                      />
                    </div>
                  )}
                  <div ref={terminalEndRef} className="h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
