"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, RotateCcw } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

type LineType = 'cmd' | 'sys' | 'success' | 'error' | 'info' | 'input' | 'table' | 'user' | 'warning';

type OutputLine = {
  id: string;
  text: string;
  type: LineType;
};

// INITIAL STATES FOR APPS
const initialBankState = { balance: 14500.00 };
const initialBetplayState = {
  teams: [
    { name: "Millonarios", pts: 0, gf: 0, gc: 0, gd: 0 },
    { name: "Atl. Nacional", pts: 0, gf: 0, gc: 0, gd: 0 },
    { name: "America", pts: 0, gf: 0, gc: 0, gd: 0 },
    { name: "Santa Fe", pts: 0, gf: 0, gc: 0, gd: 0 },
  ],
  matchday: 1
};
const FLIGHTS = [
  { id: "TF-104", origin: "BOG", dest: "MDE", seats: 42, price: 120 },
  { id: "TF-208", origin: "BOG", dest: "CTG", seats: 15, price: 180 },
  { id: "TF-901", origin: "MDE", dest: "BAQ", seats: 4, price: 150 },
];

const LOCALES = {
  en: {
    disclaimer: "Reduced simulation running in the browser. The complete project is in the repository.",
    guideTitle: "Runnable demo",
    guideText: "A JavaScript replica of the original project's logic. Type a command and press Enter.",
    commandsLabel: "Try",
    stackLabel: "Stack",
    repo: "View repository",
    restart: "Restart demo",
    close: "Close (Esc)",
    booting: "Loading sandbox environment...",
    dbConnected: "Connected to DB (sqlite3)... [OK]",
    buildSuccess: "Build succeeded. Database loaded.",
    bankWelcome: "WELCOME TO GLOBAL BANK",
    bankOpt1: "1. View Balance",
    bankOpt2: "2. Deposit Funds",
    bankOpt3: "3. Withdraw Funds",
    bankOpt4: "4. Exit",
    bankSelect: "Select an option (1-4):",
    bankBalance: "Your current balance is: $",
    bankDepPrompt: "Enter amount to deposit:",
    bankWithPrompt: "Enter amount to withdraw:",
    bankInvalidAmt: "Invalid amount. Please enter a valid number.",
    bankSuccessDep: "[SUCCESS] Deposited: $",
    bankSuccessWith: "[SUCCESS] Withdrawn: $",
    bankNewBal: "New Balance: $",
    bankInsF: "[ERROR] Insufficient funds. Balance: $",
    bankInvalidOpt: "Invalid option. Please enter 1, 2, 3, or 4.",
    bankExit: "Thank you for using Global Bank. Session closed.",
    airlineTitle: "AIRLINE RESERVATION SYSTEM",
    airlineHelpSys: "Type 'help' to see available commands.",
    airlineCommands: "COMMANDS:",
    airlineCmdList: "  list    - View all available flights",
    airlineCmdBook: "  book    - Start booking process",
    airlineCmdClear: "  clear   - Clear terminal",
    airlineTableH: "FLIGHT   | ORIGIN | DEST | SEATS | PRICE",
    airlineTableS: "---------+--------+------+-------+------",
    airlinePromptBook: "Enter Flight ID (e.g., TF-208):",
    airlineNotFoundCmd: "Command not found. Type 'help'.",
    airlineSelectedF: "Selected Flight",
    airlinePromptName: "Enter Passenger Name:",
    airlineNotFoundF: "Flight not found. Type 'list' to see flights.",
    airlineEmptyName: "Name cannot be empty. Enter Passenger Name:",
    airlineProcessing: "Processing payment and assigning seat...",
    airlineSuccess: "[SUCCESS] Booking confirmed for",
    airlineFlight: "Flight:",
    airlineMiles: "+ 500 Frequent Flyer Miles added to your account.",
    betplayTitle: "LIGA BETPLAY SIMULATOR",
    betplayHelp: "Commands: 'sim' (simulate match), 'table' (view standings), 'reset'.",
    betplayMatchday: "--- Matchday",
    betplaySaved: "Data saved. Type 'table' to view standings.",
    betplayTableH: "POS | TEAM          | PTS | GD | GF | GC",
    betplayTableS: "----+---------------+-----+----+----+---",
    betplayReset: "League reset successfully.",
    betplayNotFound: "Command not found. Use 'sim', 'table', 'reset', or 'clear'."
  },
  es: {
    disclaimer: "Simulación reducida que se ejecuta en el navegador. El proyecto completo está en el repositorio.",
    guideTitle: "Demo ejecutable",
    guideText: "Réplica en JavaScript de la lógica del proyecto original. Escribe un comando y pulsa Enter.",
    commandsLabel: "Prueba",
    stackLabel: "Stack",
    repo: "Ver repositorio",
    restart: "Reiniciar demo",
    close: "Cerrar (Esc)",
    booting: "Cargando entorno seguro...",
    dbConnected: "Conectado a BD (sqlite3)... [OK]",
    buildSuccess: "Compilación exitosa. Base de datos cargada.",
    bankWelcome: "BIENVENIDO A GLOBAL BANK",
    bankOpt1: "1. Ver Saldo",
    bankOpt2: "2. Consignar Fondos",
    bankOpt3: "3. Retirar Fondos",
    bankOpt4: "4. Salir",
    bankSelect: "Selecciona una opción (1-4):",
    bankBalance: "Tu saldo actual es: $",
    bankDepPrompt: "Ingresa la cantidad a consignar:",
    bankWithPrompt: "Ingresa la cantidad a retirar:",
    bankInvalidAmt: "Cantidad inválida. Ingresa un número válido.",
    bankSuccessDep: "[ÉXITO] Consignado: $",
    bankSuccessWith: "[ÉXITO] Retirado: $",
    bankNewBal: "Nuevo Saldo: $",
    bankInsF: "[ERROR] Fondos insuficientes. Saldo: $",
    bankInvalidOpt: "Opción inválida. Ingresa 1, 2, 3, o 4.",
    bankExit: "Gracias por usar Global Bank. Sesión cerrada.",
    airlineTitle: "SISTEMA DE RESERVAS DE AEROLÍNEA",
    airlineHelpSys: "Escribe 'help' para ver los comandos disponibles.",
    airlineCommands: "COMANDOS:",
    airlineCmdList: "  list    - Ver vuelos disponibles",
    airlineCmdBook: "  book    - Iniciar reserva de vuelo",
    airlineCmdClear: "  clear   - Limpiar terminal",
    airlineTableH: "VUELO    | ORIGEN | DEST | SILLAS | PRECIO",
    airlineTableS: "---------+--------+------+--------+-------",
    airlinePromptBook: "Ingresa el ID del Vuelo (ej., TF-208):",
    airlineNotFoundCmd: "Comando no encontrado. Escribe 'help'.",
    airlineSelectedF: "Vuelo seleccionado",
    airlinePromptName: "Ingresa Nombre del Pasajero:",
    airlineNotFoundF: "Vuelo no encontrado. Escribe 'list' para ver vuelos.",
    airlineEmptyName: "El nombre no puede estar vacío. Ingresa Nombre:",
    airlineProcessing: "Procesando pago y asignando silla...",
    airlineSuccess: "[ÉXITO] Reserva confirmada para",
    airlineFlight: "Vuelo:",
    airlineMiles: "+ 500 Millas de viajero frecuente agregadas a tu cuenta.",
    betplayTitle: "SIMULADOR LIGA BETPLAY",
    betplayHelp: "Comandos: 'sim' (simular fecha), 'table' (ver posiciones), 'reset'.",
    betplayMatchday: "--- Fecha",
    betplaySaved: "Datos guardados. Escribe 'table' para ver posiciones.",
    betplayTableH: "POS | EQUIPO        | PTS | DG | GF | GC",
    betplayTableS: "----+---------------+-----+----+----+---",
    betplayReset: "Liga reiniciada exitosamente.",
    betplayNotFound: "Comando no encontrado. Usa 'sim', 'table', 'reset' o 'clear'."
  }
};

/** Suggested input per demo, shown as chips beside the screen. */
const DEMO_COMMANDS: Record<string, string[]> = {
  banking: ["1", "2", "3", "4"],
  airline: ["help", "list", "book"],
  betplay: ["sim", "table", "reset"],
};

export default function TerminalModal({ demoId, onClose }: { demoId: string | null, onClose: () => void }) {
  const { lang, t: content } = useLanguage();
  const t = LOCALES[lang === 'es' ? 'es' : 'en'];

  // --- UI STATE ---
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // --- APP STATES ---
  const [appState, setAppState] = useState<string>("booting");
  const [bankData, setBankData] = useState(initialBankState);
  const [betData, setBetData] = useState(initialBetplayState);
  const [airlineData, setAirlineData] = useState({ selectedFlight: "" });

  const print = (text: string, type: LineType = 'info') => {
    setLines(prev => [...prev, { id: Math.random().toString(36).substring(7), text, type }]);
  };

  const clearTerminal = () => setLines([]);

  // Auto scroll
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, appState]); // Depend on lines and appState to scroll when new prompts appear

  // Keep input focused
  const handleTerminalClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  // --- BOOT SEQUENCE ---
  const handleRestart = () => {
    setAppState("rebooting"); // trigger useEffect
  };

  useEffect(() => {
    let isActive = true;

    const bootProject = async () => {
      clearTerminal();
      setIsTyping(true);
      setAppState("booting");
      
      // Reset Data
      setBankData(initialBankState);
      setBetData(initialBetplayState);
      setAirlineData({ selectedFlight: "" });

      const cmd = demoId === 'banking' ? 'python main.py' : 'dotnet run';
      if (!isActive) return;
      print(`> ${cmd}`, 'cmd');
      
      await new Promise(r => setTimeout(r, 600));
      if (!isActive) return;
      print(t.booting, "sys");
      
      await new Promise(r => setTimeout(r, 800));
      if (!isActive) return;
      
      if (demoId === 'banking') {
        print(t.dbConnected, "success");
        showBankMenu();
      } else if (demoId === 'airline') {
        print(t.buildSuccess, "success");
        print(`\n--- ${t.airlineTitle} ---`, "info");
        print(t.airlineHelpSys, "sys");
        setAppState("airline_menu");
      } else if (demoId === 'betplay') {
        print(t.buildSuccess, "success");
        print(`\n--- ${t.betplayTitle} ---`, "info");
        print(t.betplayHelp, "sys");
        setAppState("betplay_menu");
      }
      
      setIsTyping(false);
      if (inputRef.current) inputRef.current.focus();
    };

    if (demoId) {
      bootProject();
    }

    return () => {
      isActive = false;
    };
  }, [demoId, lang, appState === "rebooting"]); 

  // --- BANKING LOGIC ---
  const showBankMenu = () => {
    print("\n================================", "info");
    print(`    ${t.bankWelcome}      `, "success");
    print("================================", "info");
    print(t.bankOpt1, "info");
    print(t.bankOpt2, "info");
    print(t.bankOpt3, "info");
    print(t.bankOpt4, "info");
    print(t.bankSelect, "sys");
    setAppState("bank_menu");
  };

  const handleBankInput = (val: string) => {
    if (appState === "bank_menu") {
      switch (val) {
        case "1":
          print(`${t.bankBalance}${bankData.balance.toFixed(2)}`, "success");
          showBankMenu();
          break;
        case "2":
          print(t.bankDepPrompt, "sys");
          setAppState("bank_deposit");
          break;
        case "3":
          print(t.bankWithPrompt, "sys");
          setAppState("bank_withdraw");
          break;
        case "4":
          print(t.bankExit, "info");
          setAppState("halted");
          break;
        default:
          print(t.bankInvalidOpt, "error");
      }
    } else if (appState === "bank_deposit") {
      const amount = parseFloat(val);
      if (isNaN(amount) || amount <= 0) {
        print(t.bankInvalidAmt, "error");
        showBankMenu();
      } else {
        const newBal = bankData.balance + amount;
        setBankData({ balance: newBal });
        print(`${t.bankSuccessDep}${amount.toFixed(2)}`, "success");
        print(`${t.bankNewBal}${newBal.toFixed(2)}`, "info");
        showBankMenu();
      }
    } else if (appState === "bank_withdraw") {
      const amount = parseFloat(val);
      if (isNaN(amount) || amount <= 0) {
        print(t.bankInvalidAmt, "error");
        showBankMenu();
      } else if (amount > bankData.balance) {
        print(`${t.bankInsF}${bankData.balance.toFixed(2)}`, "error");
        showBankMenu();
      } else {
        const newBal = bankData.balance - amount;
        setBankData({ balance: newBal });
        print(`${t.bankSuccessWith}${amount.toFixed(2)}`, "success");
        print(`${t.bankNewBal}${newBal.toFixed(2)}`, "info");
        showBankMenu();
      }
    }
  };

  // --- AIRLINE LOGIC ---
  const handleAirlineInput = (val: string) => {
    const cmd = val.toLowerCase().trim();
    if (appState === "airline_menu") {
      if (cmd === 'help') {
        print(t.airlineCommands, "info");
        print(t.airlineCmdList, "info");
        print(t.airlineCmdBook, "info");
        print(t.airlineCmdClear, "info");
      } else if (cmd === 'list') {
        print(`\n${t.airlineTableH}`, "table");
        print(t.airlineTableS, "table");
        FLIGHTS.forEach(f => {
          print(`${f.id.padEnd(8)} | ${f.origin.padEnd(6)} | ${f.dest.padEnd(4)} | ${f.seats.toString().padEnd(6)} | $${f.price}`, "table");
        });
        print("\n", "info");
      } else if (cmd === 'book') {
        print(t.airlinePromptBook, "sys");
        setAppState("airline_book_id");
      } else if (cmd === 'clear') {
        clearTerminal();
      } else {
        print(t.airlineNotFoundCmd, "error");
      }
    } else if (appState === "airline_book_id") {
      const flight = FLIGHTS.find(f => f.id.toLowerCase() === val.toLowerCase());
      if (flight) {
        setAirlineData({ selectedFlight: flight.id });
        print(`${t.airlineSelectedF} ${flight.id} -> ${flight.dest}.`, "success");
        print(t.airlinePromptName, "sys");
        setAppState("airline_book_name");
      } else {
        print(t.airlineNotFoundF, "error");
        setAppState("airline_menu");
      }
    } else if (appState === "airline_book_name") {
      if (val.trim() === "") {
        print(t.airlineEmptyName, "sys");
        return;
      }
      setIsTyping(true);
      print(t.airlineProcessing, "sys");
      setTimeout(() => {
        print(`${t.airlineSuccess} ${val}!`, "success");
        print(`${t.airlineFlight} ${airlineData.selectedFlight}`, "info");
        print(t.airlineMiles, "success");
        setAppState("airline_menu");
        setIsTyping(false);
      }, 1000);
    }
  };

  // --- BETPLAY LOGIC ---
  const handleBetplayInput = (val: string) => {
    const cmd = val.toLowerCase().trim();
    if (cmd === 'sim') {
      const g1 = Math.floor(Math.random() * 4);
      const g2 = Math.floor(Math.random() * 4);
      const g3 = Math.floor(Math.random() * 4);
      const g4 = Math.floor(Math.random() * 4);
      
      print(`\n${t.betplayMatchday} ${betData.matchday} ---`, "info");
      print(`[FT] Millonarios ${g1} - ${g2} Atl. Nacional`, g1 > g2 ? "success" : g2 > g1 ? "error" : "info");
      print(`[FT] America     ${g3} - ${g4} Santa Fe`, g3 > g4 ? "success" : g4 > g3 ? "error" : "info");
      
      const newTeams = [...betData.teams];
      const updateTeam = (name: string, gf: number, gc: number) => {
        const team = newTeams.find(t => t.name === name)!;
        team.gf += gf; team.gc += gc; team.gd = team.gf - team.gc;
        if (gf > gc) team.pts += 3;
        else if (gf === gc) team.pts += 1;
      };
      
      updateTeam("Millonarios", g1, g2);
      updateTeam("Atl. Nacional", g2, g1);
      updateTeam("America", g3, g4);
      updateTeam("Santa Fe", g4, g3);
      
      setBetData({ teams: newTeams, matchday: betData.matchday + 1 });
      print(t.betplaySaved, "sys");
      
    } else if (cmd === 'table') {
      const sorted = [...betData.teams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
      print(`\n${t.betplayTableH}`, "table");
      print(t.betplayTableS, "table");
      sorted.forEach((team, i) => {
        print(` ${(i+1).toString().padEnd(2)} | ${team.name.padEnd(13)} |  ${team.pts.toString().padEnd(2)} | ${team.gd > 0 ? '+'+team.gd : team.gd.toString().padEnd(2)} | ${team.gf.toString().padEnd(2)} | ${team.gc}`, "table");
      });
      print("\n", "info");
    } else if (cmd === 'reset') {
      setBetData(initialBetplayState);
      print(t.betplayReset, "success");
    } else if (cmd === 'clear') {
      clearTerminal();
    } else {
      print(t.betplayNotFound, "error");
    }
  };

  // --- MASTER INPUT HANDLER ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = input.trim();
      if (appState !== "halted" && !isTyping) {
        print(`$ ${val}`, "user");
        setInput("");
        
        if (demoId === 'banking') handleBankInput(val);
        else if (demoId === 'airline') handleAirlineInput(val);
        else if (demoId === 'betplay') handleBetplayInput(val);
      }
    }
  };

  useEffect(() => {
    if (!demoId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [demoId, onClose]);

  if (!demoId) return null;

  const project = content.work.more.items.find((item) => item.demoId === demoId);
  const projectTitle = project?.name ?? demoId;
  const commands = DEMO_COMMANDS[demoId] ?? [];

  // Rendered on <body>: the deck's scenes are transformed, which would trap a fixed overlay under the header.
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-3 backdrop-blur-sm md:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${projectTitle}: ${t.guideTitle}`}
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="demo-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="demo-head">
            <p className="demo-kicker">
              <span className="demo-dot" aria-hidden="true" />
              {t.guideTitle}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={handleRestart} aria-label={t.restart} title={t.restart} className="demo-btn">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button type="button" onClick={onClose} aria-label={t.close} title={t.close} className="demo-btn">
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="demo-body">
            <aside className="demo-aside">
              <h3 className="demo-title">{projectTitle}</h3>
              {project && <p className="demo-text">{project.text}</p>}
              {project && (
                <dl className="demo-meta">
                  <dt>{t.stackLabel}</dt>
                  <dd>{project.stack}</dd>
                  <dt>{t.commandsLabel}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {commands.map((cmd) => (
                      <code key={cmd} className="demo-chip">
                        {cmd}
                      </code>
                    ))}
                  </dd>
                </dl>
              )}
              <p className="demo-note">{t.guideText} {t.disclaimer}</p>
              {project && (
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="demo-repo">
                  {t.repo} →
                </a>
              )}
            </aside>

            <div className="demo-screen" onClick={handleTerminalClick}>
              <p className="demo-path" aria-hidden="true">
                ~/{demoId} <span>$ run</span>
              </p>
              <div className="demo-lines" aria-live="polite">
                {lines.map((line) => (
                  <div key={line.id} className={`demo-line is-${line.type}`}>
                    {line.text || "\u00A0"}
                  </div>
                ))}

                {appState !== "halted" && !isTyping && (
                  <div className="demo-prompt">
                    <span className="demo-caret-sign" aria-hidden="true">
                      $
                    </span>
                    <span className="whitespace-pre">{input}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="demo-cursor"
                      aria-hidden="true"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      aria-label={t.commandsLabel}
                      className="absolute inset-0 h-full w-full cursor-default opacity-0"
                      autoFocus
                      spellCheck="false"
                      autoComplete="off"
                    />
                  </div>
                )}
                <div ref={terminalEndRef} className="h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
