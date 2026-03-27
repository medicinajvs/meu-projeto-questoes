import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Heart, 
  Bell, 
  LayoutGrid, 
  Mic, 
  BookOpen, 
  FileQuestion, 
  FileText, 
  BarChart2, 
  Trophy, 
  MonitorPlay, 
  Users, 
  Check, 
  X,
  SlidersHorizontal,
  ArrowRight,
  MessageCircle,
  Video,
  Menu,
  Filter,
  PieChart,
  ArrowLeft,
  Printer,
  Clock,
  ZoomIn,
  ZoomOut,
  Flag,
  Target,
  EyeOff,
  BookMarked,
  BarChart,
  CheckCircle2,
  XCircle,
  Info,
  Save,
  AlertTriangle,
  Send,
  ThumbsUp
} from 'lucide-react';

const supabaseUrl = 'https://asagaorjnpjbfanwcnpb.supabase.co';
const supabaseKey = 'sb_publishable_LRV5dUrdlyi3pPZPQz7Bbw_ctO9zP1O';

// --- Estilos Globais Injetados ---
const GlobalStyles = () => (
  <style>{`
    html, body, #root { width: 100%; max-width: 100%; overflow-x: hidden; margin: 0; padding: 0; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* --- ESTILOS DE IMPRESSÃO (PDF) --- */
    /* --- ESTILOS DE IMPRESSÃO (PDF) --- */
    @media print {
      @page { 
        size: A4 landscape; /* <--- O segredo está aqui: força a página deitada */
        margin: 20mm; 
      }
      
      body * { visibility: hidden; }
      #printable-study-area, #printable-study-area * { visibility: visible; }
      
      #printable-study-area { 
        position: relative !important; left: 0; top: 0; width: 100%; 
        padding: 0 !important; margin: 0; background: white; 
      }
      
      aside, header, .no-print, .fixed { display: none !important; }
      
      html, body, #root, main, .overflow-y-auto, .h-screen, .flex-1 {
        height: auto !important; min-height: auto !important;
        overflow: visible !important; position: relative !important; display: block !important;
      }

      /* Esta classe garante o respiro nas laterais (padding: 40px) e mantém a borda suave igual a imagem */
      .print-break-inside-avoid {
        page-break-inside: auto !important; break-inside: auto !important;
        margin-top: 0 !important; margin-bottom: 40px !important;
        padding: 40px !important; 
        border: 1px solid #e5e7eb !important; border-radius: 12px !important;
        box-shadow: none !important;
      }

      /* Impede que alternativas sejam cortadas na metade ao mudar de página */
      .space-y-3 > div, .space-y-4 > div { page-break-inside: avoid !important; break-inside: avoid !important; }

      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
      .print-only { display: block !important; }
    }
  `}</style>
);

// --- Dados Mockados Expandidos (Simulando um Banco de Dados) ---
const MOCK_QUESTIONS = [
  {
    id: 1045,
    banca: "CESPE / CEBRASPE",
    orgao: "SES DF",
    ano: "2023",
    cargo: "Médico - Cirurgia Geral",
    enunciado: "Paciente de 35 anos, vítima de colisão auto x auto, dá entrada na emergência com PA 80x50 mmHg, FC 120 bpm. Ao exame: murmúrio vesicular abolido à direita e hipertimpanismo à percussão. Qual a conduta imediata?",
    alternativas: [
      "Toracotomia de emergência",
      "Drenagem torácica em selo d'água",
      "Punção de alívio no 2º espaço intercostal",
      "Intubação orotraqueal e ventilação mecânica",
      "Toracocentese guiada por ultrassom"
    ],
    gabarito: 2,
    tipo: 'multiplaEscolha',
    situacao: 'naoResolvi',
    assunto: 'Cirurgia - Trauma',
    regiao: 'Centro-Oeste',
    finalidade: 'Concurso Público',
    professor: 'Prof. Carlos',
    comentarios: 12,
    temVideo: true,
    dificuldade: 'Média',
    anulada: false,
    acertos_comunidade: 650,
    erros_comunidade: 350,
    desatualizada: false,
    forum: [
      { user: "Ana Paula", text: "Galera, não confundam com drenagem! A punção de alívio salva a vida na hora, a drenagem é o passo DEFINITIVO logo depois.", likes: 45 }
    ]
  },
  {
    id: 2891,
    banca: "FGV",
    orgao: "SUS SP",
    ano: "2024",
    cargo: "Residência Médica",
    enunciado: "Em relação à fisiopatologia da pancreatite aguda, a ativação enzimática precoce ocorre principalmente em qual organela celular?",
    alternativas: [
      "Mitocôndria",
      "Retículo endoplasmático rugoso",
      "Lisossomos",
      "Complexo de Golgi",
      "Núcleo"
    ],
    gabarito: 2,
    tipo: 'multiplaEscolha',
    situacao: 'errei',
    assunto: 'Gastroenterologia',
    regiao: 'Sudeste',
    finalidade: 'Residência Médica',
    professor: 'Prof. João',
    comentarios: 5,
    temVideo: false,
    dificuldade: 'Difícil',
    anulada: false,
    acertos_comunidade: 32,
    erros_comunidade: 168,
    desatualizada: false,
    forum: [
      { user: "Dr. Roberto", text: "Questão clássica de rodapé de livro. Teoria da colocalização lisossomal.", likes: 12 }
    ]
  },
  {
    id: 3002,
    banca: "FCC",
    orgao: "TRT",
    ano: "2022",
    cargo: "Analista Judiciário",
    enunciado: "Julgue o item: Considere que um servidor público tenha praticado ato de improbidade administrativa. Segundo a lei vigente, a indisponibilidade de bens poderá recair sobre o patrimônio do investigado, para garantir o ressarcimento integral.",
    alternativas: [
      "Certo",
      "Errado"
    ],
    gabarito: 0,
    tipo: 'certoErrado',
    situacao: 'acertei',
    assunto: 'Direito Administrativo - Lei 8.429',
    regiao: 'Nacional',
    finalidade: 'Concurso Público',
    professor: 'Profa. Ana',
    comentarios: 28,
    temVideo: true,
    dificuldade: 'Fácil',
    anulada: false,
    acertos_comunidade: 850,
    erros_comunidade: 150,
    desatualizada: true,
    forum: [
      { user: "Concurseiro_99", text: "Atenção: A nova lei de improbidade alterou alguns detalhes, mas a indisponibilidade para ressarcimento continua válida.", likes: 88 }
    ]
  },
  {
    id: 4015,
    banca: "VUNESP",
    orgao: "USP",
    ano: "2024",
    cargo: "Residência Médica",
    enunciado: "Gestante primigesta, 32 semanas, dá entrada no pronto atendimento com cefaleia intensa e escotomas cintilantes. Pressão arterial 160x110 mmHg. A conduta medicamentosa inicial mais apropriada é:",
    alternativas: [
      "Hidralazina IV e Sulfato de Magnésio IV",
      "Nifedipina VO e Diazepam IV",
      "Metildopa VO e Fenitoína IV",
      "Sulfato de Magnésio IV exclusivamente",
      "Parto cesárea de emergência"
    ],
    gabarito: 0,
    tipo: 'multiplaEscolha',
    situacao: 'naoResolvi',
    assunto: 'Ginecologia e Obst.',
    regiao: 'Sudeste',
    finalidade: 'Residência Médica',
    professor: 'Prof. João',
    comentarios: 42,
    temVideo: true,
    dificuldade: 'Média',
    anulada: false,
    acertos_comunidade: 550,
    erros_comunidade: 450,
    desatualizada: false,
    forum: [
      { user: "Mariana Med", text: "Sulfato de Magnésio sempre para prevenção de eclâmpsia (convulsão) e Hidralazina para controle pressórico agudo.", likes: 105 }
    ]
  },
  {
    id: 5991,
    banca: "Enares",
    orgao: "Enares",
    ano: "2023",
    cargo: "Residência Médica",
    enunciado: "Uma criança de 4 anos é trazida à UBS pela mãe com queixa de tosse persistente há 3 semanas, associada a febre baixa vespertina e sudorese noturna. O RX de tórax evidencia adenopatia hilar direita. Qual o diagnóstico mais provável e a conduta recomendada?",
    alternativas: [
      "Pneumonia bacteriana atípica - Azitromicina",
      "Tuberculose pulmonar primária - Iniciar esquema RIP",
      "Asma descompensada - Corticoide inalatório",
      "Coqueluche - Claritromicina",
      "Corpo estranho - Broncoscopia"
    ],
    gabarito: 1,
    tipo: 'multiplaEscolha',
    situacao: 'naoResolvi',
    assunto: 'Pediatria - Infectologia',
    regiao: 'Nacional',
    finalidade: 'Residência Médica',
    professor: 'Prof. Maria',
    comentarios: 89,
    temVideo: true,
    dificuldade: 'Fácil',
    anulada: false,
    acertos_comunidade: 780,
    erros_comunidade: 220,
    desatualizada: false,
    forum: []
  }
];

// --- Componentes Reutilizáveis ---

const SidebarItem = ({ icon: Icon, active = false }) => (
  <div className={`w-full flex justify-center items-center py-4 cursor-pointer transition-colors ${active ? 'bg-blue-900 border-l-4 border-blue-400' : 'text-gray-400 hover:text-white'}`}>
    <Icon size={24} className={active ? 'text-white' : ''} />
  </div>
);

const ToggleRow = ({ label, checked, onChange }) => (
  <div 
    className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
    onClick={onChange}
  >
    <div className="flex items-center">
      <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors mr-3 shrink-0 ${checked ? 'bg-emerald-500' : 'bg-gray-200 border border-gray-300'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
      <span className="text-sm text-gray-700 leading-tight">{label}</span>
    </div>
  </div>
);

const ActiveTag = ({ label, onRemove }) => (
  <div className="flex items-center bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 transition-all hover:bg-blue-200">
    <span>{label}</span>
    <X size={14} className="ml-2 cursor-pointer hover:text-blue-900 shrink-0" onClick={onRemove} />
  </div>
);

const TagListItem = ({ title, category, onRemove }) => (
  <div className="flex items-center mb-2 mr-2">
    <div className="flex items-center bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full text-sm shadow-sm cursor-pointer hover:bg-gray-50 transition">
      <span className="font-bold text-gray-400 mr-2 text-xs uppercase hidden sm:inline">{category}:</span> 
      <span className="truncate max-w-[150px] sm:max-w-none font-medium">{title}</span>
      <X size={14} className="ml-2 text-gray-400 hover:text-red-500 shrink-0" onClick={onRemove} />
    </div>
  </div>
);

// --- Componente: Dropdown de Filtro Inteligente (com Hierarquia) ---
const TopFilterDropdown = ({ label, categoryKey, options, selectedValues, onToggleItem, isOpen, onToggleOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [alignRight, setAlignRight] = useState(false);
  const containerRef = useRef(null);
  const hasSelection = selectedValues.length > 0;
  
  // Agrupamento Dinâmico Inteligente
  const groupedOptions = useMemo(() => {
    const groups = {};
    const filtered = options.filter(opt => opt.value.toLowerCase().includes(searchTerm.toLowerCase()));
    
    filtered.forEach(opt => {
      // Se o valor possui " - ", nós o tratamos como hierarquia
      if (opt.value.includes(' - ')) {
        const parts = opt.value.split(' - ');
        const mainCat = parts[0].trim();
        const subCat = parts.slice(1).join(' - ').trim();
        
        if (!groups[mainCat]) {
          groups[mainCat] = { count: 0, items: [], isHierarchy: true };
        }
        
        groups[mainCat].items.push({ 
          originalValue: opt.value, 
          label: subCat, 
          count: opt.count 
        });
        groups[mainCat].count += opt.count;
      } else {
        // Item direto, sem subcategorias
        const mainCat = opt.value;
        if (!groups[mainCat]) {
          groups[mainCat] = { count: 0, items: [], isHierarchy: false };
        }
        groups[mainCat].items.push({ 
          originalValue: opt.value, 
          label: opt.value, 
          count: opt.count 
        });
        groups[mainCat].count += opt.count;
      }
    });

    return Object.keys(groups).sort().map(key => ({
      name: key,
      isHierarchy: groups[key].isHierarchy,
      count: groups[key].count,
      items: groups[key].items.sort((a, b) => a.label.localeCompare(b.label))
    }));
  }, [options, searchTerm]);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (window.innerWidth - rect.left < 300) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    if (val) {
      // Expandir automaticamente os grupos se o usuário estiver digitando
      const allExpanded = {};
      options.forEach(opt => {
        if (opt.value.includes(' - ')) {
          allExpanded[opt.value.split(' - ')[0].trim()] = true;
        }
      });
      setExpandedGroups(allExpanded);
    } else {
      setExpandedGroups({});
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };
  
  return (
    <div ref={containerRef} className="relative shrink-0">
      <div
        onClick={(e) => {
          if(!isOpen) setSearchTerm(''); 
          onToggleOpen();
        }}
        className={`flex items-center space-x-2 cursor-pointer whitespace-nowrap px-3 sm:px-4 py-2 border rounded-md transition-colors select-none ${
          hasSelection 
            ? 'bg-blue-50 border-blue-300 text-blue-800 font-medium' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400'
        }`}
      >
        <div className={`w-4 h-4 border rounded flex items-center justify-center shrink-0 transition-colors ${hasSelection ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
          {hasSelection ? <Check size={12} className="text-white" /> : <Check size={12} className="text-gray-300 opacity-50" />}
        </div>
        <span className="text-sm">{label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-[85vw] max-w-[320px] sm:w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-[80] flex flex-col max-h-[450px] animate-in fade-in slide-in-from-top-2 ${alignRight ? 'right-0' : 'left-0'}`}>
          <div className="p-3 border-b border-gray-100 shrink-0 bg-gray-50 rounded-t-xl">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm">
              <Search size={16} className="text-gray-400 mr-2" />
              <input 
                type="text"
                placeholder={`Pesquisar ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={handleSearch}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
            {groupedOptions.length > 0 ? (
              groupedOptions.map(group => {
                // Renderização para item direto (sem hierarquia)
                if (!group.isHierarchy) {
                  const item = group.items[0];
                  return (
                    <div 
                      key={item.originalValue} 
                      onClick={() => onToggleItem(categoryKey, item.originalValue)} 
                      className="flex items-center px-3 py-2.5 hover:bg-blue-50/50 rounded-lg cursor-pointer transition-colors mb-1"
                    >
                      <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center shrink-0 transition-colors ${selectedValues.includes(item.originalValue) ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                         {selectedValues.includes(item.originalValue) && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm ${selectedValues.includes(item.originalValue) ? 'font-bold text-blue-800' : 'text-gray-600'}`}>
                        {item.label} <span className="text-xs text-gray-400 font-normal ml-1">({item.count})</span>
                      </span>
                    </div>
                  );
                }

                // Renderização para agrupamentos (sanfona/accordion)
                const isGroupExpanded = expandedGroups[group.name];
                return (
                  <div key={group.name} className="mb-1 border border-gray-100 rounded-lg overflow-hidden bg-white">
                    <div 
                      className="flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => toggleGroup(group.name)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden pr-2">
                         <ChevronDown size={14} className={`transition-transform text-gray-500 shrink-0 ${isGroupExpanded ? 'rotate-180' : '-rotate-90'}`} />
                         <span className="font-bold text-sm text-gray-700 truncate" title={group.name}>{group.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shrink-0 shadow-sm">
                        {group.count}
                      </span>
                    </div>
                    
                    {isGroupExpanded && (
                      <div className="pl-4 pr-1 py-1.5 space-y-0.5 bg-white border-t border-gray-100">
                        {group.items.map(item => (
                           <div 
                             key={item.originalValue} 
                             onClick={() => onToggleItem(categoryKey, item.originalValue)} 
                             className="flex items-center px-2 py-2 hover:bg-blue-50/50 rounded-lg cursor-pointer transition-colors"
                           >
                             <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center shrink-0 transition-colors ${selectedValues.includes(item.originalValue) ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                {selectedValues.includes(item.originalValue) && <Check size={12} className="text-white" />}
                             </div>
                             <span className={`text-sm flex-1 ${selectedValues.includes(item.originalValue) ? 'font-bold text-blue-800' : 'text-gray-600'}`}>
                               {item.label} <span className="text-xs text-gray-400 font-normal ml-1">({item.count})</span>
                             </span>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500 flex flex-col items-center">
                <Search size={24} className="text-gray-300 mb-2" /> Nenhum resultado.
              </div>
            )}
          </div>
          
          {hasSelection && (
            <div className="p-3 border-t border-gray-100 bg-blue-50 text-center shrink-0 rounded-b-xl">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">{selectedValues.length} selecionado(s)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Componente: Barra de Resumo (Stats) ---
const StatsProgress = ({ label, count, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <div className="mb-4 group">
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="text-gray-700 font-medium truncate pr-2 group-hover:text-blue-700 transition-colors">{label}</span>
        <span className="text-gray-500 text-xs shrink-0 font-bold bg-gray-100 px-2 py-0.5 rounded">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

// --- Componente Interativo: Card de Estudo (Modo Resolução - Profissional) ---
const StudyQuestionCard = ({ questao, index, fontSizeClass, isBookmarked, onToggleBookmark, onReportError, onOpenForum }) => {
  const [selectedAlt, setSelectedAlt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [eliminated, setEliminated] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Estado local para atualizar estatísticas dinamicamente
  const [stats, setStats] = useState({
    acertos: questao.acertos_comunidade || 0,
    erros: questao.erros_comunidade || 0
  });

  const alternativasSeguras = Array.isArray(questao.alternativas) ? questao.alternativas : [];
  const numComentarios = questao.comentarios || 0;
  const totalRespostas = stats.acertos + stats.erros;
  const porcentagemAcertos = totalRespostas > 0 ? Math.round((stats.acertos / totalRespostas) * 100) : 0;

  // Função para simular o registro da resposta no banco de dados (Supabase)
  const registrarRespostaNoBanco = async (isCorrect) => {
    // Aqui você colocaria o código real para atualizar a tabela do Supabase.
    /*
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/incrementar_estatistica`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ 
          p_questao_id: questao.id, 
          p_acertou: isCorrect 
        })
      });
    } catch (error) {
      console.error("Erro ao registrar estatística no Supabase", error);
    }
    */
  };

  const handleAnswer = (idx) => {
    if(!isAnswered) {
      const acertou = idx === questao.gabarito;
      
      setSelectedAlt(idx);
      setIsAnswered(true);
      setShowExplanation(true);
      
      // Atualiza a estatística local dinamicamente para o usuário visualizar
      setStats(prev => ({ 
        acertos: prev.acertos + (acertou ? 1 : 0), 
        erros: prev.erros + (!acertou ? 1 : 0) 
      }));
      
      // Dispara a chamada de banco de dados
      registrarRespostaNoBanco(acertou);
    }
  };

  const toggleEliminate = (e, idx) => {
    e.stopPropagation();
    if(!isAnswered) {
      if(eliminated.includes(idx)) {
        setEliminated(prev => prev.filter(i => i !== idx));
      } else {
        setEliminated(prev => [...prev, idx]);
      }
    }
  };

  const getLetterStyle = (idx) => {
    if (!isAnswered) {
      if (eliminated.includes(idx)) return "border-gray-200 text-gray-300 bg-gray-50";
      return selectedAlt === idx 
        ? "border-blue-600 bg-blue-600 text-white" 
        : "border-gray-400 text-gray-600 group-hover:border-blue-500 group-hover:text-blue-500 bg-white";
    }
    if (idx === questao.gabarito) return "border-emerald-500 bg-emerald-500 text-white shadow-sm !print:bg-emerald-500 !print:border-emerald-500 !print:text-white";
    if (selectedAlt === idx && idx !== questao.gabarito) return "border-red-500 bg-red-500 text-white !print:bg-red-500 !print:text-white";
    return "border-gray-200 text-gray-300 bg-gray-50";
  };

  const getBgStyle = (idx) => {
    if (!isAnswered) {
      if (eliminated.includes(idx)) return "bg-gray-50/50 opacity-60";
      return selectedAlt === idx ? "bg-blue-50/50 border-blue-200" : "hover:bg-gray-50 border-gray-100";
    }
    if (idx === questao.gabarito) return "bg-emerald-50/40 border-emerald-200";
    if (selectedAlt === idx && idx !== questao.gabarito) return "bg-red-50/40 border-red-200";
    return "bg-white opacity-50 border-transparent";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 shadow-sm print-break-inside-avoid print-shadow-none relative transition-all hover:shadow-md">
      
      {/* Header Impressão PDF (Visível Apenas no PDF gerado) */}
      {/* Header Impressão PDF (Estilo Limpo) */}
      <div className="hidden print-only mb-8"> {/* <--- Mudei para mb-8 para dar mais respiro antes do texto */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-black">Questão {index + 1}</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[11px] font-bold border border-gray-200 shadow-sm">
            {questao.assunto ? questao.assunto.split(' - ')[0] : "Geral"}
          </span>
        </div>
      </div>

      {/* Etiqueta de Questão e Ações Rápidas */}
      {/* CABEÇALHO DA QUESTÃO (Design exato da Imagem) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="bg-[#203b82] text-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
            QUESTÃO {index + 1}
          </div>
          
          <div className="text-[#2563eb] font-semibold text-sm sm:text-base">
            {questao.assunto || "Medicina Preventiva - Violência Infantil"}
          </div>
          
          <div className="text-gray-400 font-bold tracking-[0.2em] hidden sm:block">
            - - -
          </div>
          
          <div className="text-gray-500 bg-gray-50 px-2 py-1 rounded text-[11px] font-bold font-mono border border-gray-200">
            ID: {questao.id}
          </div>
        </div>
        
        {/* Botões de Ação Escuros (Ocultos no PDF) */}
        {/* Botões de Ação com Cores Suaves (Alinhado com Texto) */}
        {/* Botões de Ação Escuros (Corrigidos para aparecerem os ícones) */}
        {/* Botões de Ação com o Azul Específico da Imagem */}
        {/* Botões de Ação Escuros com Ícones Brancos Forçados */}
        {/* Botões de Ação Escuros com SVGs Nativos (Garante que os ícones apareçam) */}
        {/* Botões de Ação Escuros (Correção Definitiva dos Ícones) */}
        {/* Botões de Ação Escuros (Forçando a cor com !important do Tailwind) */}
        {/* Botões de Ação Escuros (Corrigido com text-white para revelar os ícones) */}
        {/* Botões de Ação Escuros (Forçado com Estilo Nativo à prova de falhas) */}
        {/* Botões de Ação - Apenas os Símbolos (Sem fundo) */}
        <div className="flex items-center gap-4 no-print">
          <button 
            onClick={onToggleBookmark} 
            className="transition-transform hover:scale-110"
            title="Marcar para Revisão"
            style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '8px' }}
          >
            {/* Símbolo do Marcador */}
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ fill: isBookmarked ? '#f97316' : 'none', stroke: isBookmarked ? '#f97316' : '#203b82', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block', position: 'relative' }}>
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
            </svg>
          </button>
          
          <button 
            onClick={() => onReportError(questao)} 
            className="transition-transform hover:scale-110"
            title="Reportar erro"
            style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '8px' }}
          >
            {/* Símbolo da Bandeira */}
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ fill: 'none', stroke: '#203b82', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block', position: 'relative' }}>
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" x2="4" y1="22" y2="15"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* ENUNCIADO (Justificado e com bastante respiro) */}
      <div className={`mb-10 text-gray-800 leading-[1.8] font-serif text-justify ${fontSizeClass}`}>
        {questao.enunciado}
      </div>

      {/* Alternativas */}
      <div className="space-y-3 mb-6">
        {alternativasSeguras.map((alt, idx) => (
          <div 
            key={idx} 
            onClick={() => handleAnswer(idx)} 
            className={`flex items-start p-3 sm:p-4 rounded-xl cursor-pointer group transition-all border ${getBgStyle(idx)}`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold mr-4 shrink-0 transition-all ${getLetterStyle(idx)}`}>
              {String.fromCharCode(65 + idx)}
            </div>
            
            <span className={`text-gray-700 font-medium pt-1 flex-1 ${fontSizeClass} ${eliminated.includes(idx) && !isAnswered ? 'line-through text-gray-400' : ''}`}>
              {alt}
            </span>
            
            {/* Botão de Riscar Alternativa (Apenas se não foi respondido) */}
            {!isAnswered && (
              <button 
                onClick={(e) => toggleEliminate(e, idx)} 
                className={`p-1.5 rounded-md ml-2 shrink-0 transition-opacity opacity-0 group-hover:opacity-100 no-print ${eliminated.includes(idx) ? 'bg-gray-200 text-gray-600 opacity-100' : 'text-gray-400 hover:bg-gray-200'}`}
                title={eliminated.includes(idx) ? "Restaurar alternativa" : "Riscar alternativa"}
              >
                <EyeOff size={18} />
              </button>
            )}
            
            {/* Ícones Visuais de Certo/Errado para a interface e para o PDF */}
            {isAnswered && idx === questao.gabarito && <CheckCircle2 className="text-emerald-500 ml-2 shrink-0 no-print" size={24} />}
            {isAnswered && selectedAlt === idx && idx !== questao.gabarito && <XCircle className="text-red-500 ml-2 shrink-0 no-print" size={24} />}
          </div>
        ))}
      </div>

      {/* Painel de Resolução e Comentários (Após responder) */}
      {isAnswered && showExplanation && (
        <div className="mt-6 border border-blue-100 bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 shadow-sm no-print animate-in fade-in">
          <div className="flex items-center mb-4">
            <div className={`w-2 h-6 rounded-full mr-3 ${selectedAlt === questao.gabarito ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <h4 className="text-lg font-bold text-gray-800">
              {selectedAlt === questao.gabarito ? 'Resposta Correta!' : 'Resposta Incorreta'}
            </h4>
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed mb-6 bg-white p-4 rounded-lg border border-gray-100">
            <p className="font-bold text-gray-900 mb-2 flex items-center"><Info size={16} className="text-blue-500 mr-2"/> Comentário do Professor:</p>
            A alternativa correta é a letra <strong>{String.fromCharCode(65 + questao.gabarito)}</strong>. Esta é a conduta padrão ouro segundo as diretrizes mais recentes.
          </div>
          
          <div className="flex items-center gap-6 bg-white px-4 py-3 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase flex items-center"><BarChart size={14} className="mr-2"/> Estatísticas:</span>
            <div className="flex-1 h-2 bg-red-200 rounded-full flex overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000 ease-out" style={{ width: `${porcentagemAcertos}%` }}></div>
            </div>
            <div className="flex flex-col text-right shrink-0">
              <span className="text-xs font-bold text-emerald-600">{porcentagemAcertos}% Acertos</span>
            </div>
          </div>
        </div>
      )}

      {/* Ferramentas do Aluno (Fórum, Vídeo, Refazer) */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onOpenForum(questao)} 
            className="flex items-center text-sm text-gray-600 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-colors border border-gray-200 hover:border-blue-200"
          >
            <MessageCircle size={16} className="mr-2 text-blue-400" /> Fórum da Comunidade ({numComentarios})
          </button>
          {questao.temVideo && (
             <button className="flex items-center text-sm text-gray-600 hover:text-purple-700 bg-gray-50 hover:bg-purple-50 px-3 py-2 rounded-lg font-medium transition-colors border border-gray-200 hover:border-purple-200">
               <Video size={16} className="mr-2 text-purple-400" /> Ver Aula
             </button>
          )}
        </div>
        
        {isAnswered && (
          <button 
            onClick={() => { 
              setIsAnswered(false); 
              setSelectedAlt(null); 
              setEliminated([]); 
              setShowExplanation(false); 
            }} 
            className="px-6 py-2.5 rounded-lg text-white text-sm font-bold transition-all hover:opacity-80 active:scale-95 shadow-md uppercase tracking-wider"
            style={{ backgroundColor: '#203b82' }}
          >
            Refazer Questão
          </button>
        )}
      </div>
    </div>
  );
};


// --- APLICAÇÃO PRINCIPAL COMPONENTE ---
export default function App() {
  const [questionsBank, setQuestionsBank] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Estados de View ---
  const [currentView, setCurrentView] = useState('filters'); // 'filters' | 'solve'
  const [searchTerm, setSearchTerm] = useState("");
  const [showSideFilters, setShowSideFilters] = useState(false); 
  const [activeDropdown, setActiveDropdown] = useState(null); 
  
  // --- Estados do Modo de Estudo e Ferramentas ---
  const [fontSize, setFontSize] = useState('text-base');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  
  // --- Modais e Interações ---
  const [saveListStatus, setSaveListStatus] = useState('idle'); // idle, saving, success
  const [reportModalData, setReportModalData] = useState(null);
  const [forumModalData, setForumModalData] = useState(null);

  // --- Filtros Rápidos (Sidebar) ---
  const initialToggles = { 
    certoErrado: true, 
    multiplaEscolha: true, 
    discursivas: false, 
    jaResolvi: false, 
    naoResolvi: true, 
    acertei: false, 
    errei: false 
  };
  const [toggles, setToggles] = useState(initialToggles);

  // --- Filtros Categoriais (Barra Superior) ---
  const initialTopFilters = { 
    assunto: [], instituicao: [], ano: [], regiao: [], finalidade: [], professor: [], banca: [] 
  };
  const [topFilters, setTopFilters] = useState(initialTopFilters);

  // --- Filtros Avançados (Modal) ---
  const initialAdvancedFilters = { 
    dificuldade: [], 
    apenasComVideo: false, 
    apenasComComentarios: false, 
    excluirAnuladas: true, 
    tamanhoEnunciado: 'todos', // todos, curto, longo
    taxaAcertoMinima: 0, // Porcentagem
    excluirDesatualizadas: true 
  };
  const [advancedFilters, setAdvancedFilters] = useState(initialAdvancedFilters);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  // --- Fetch Data (Supabase Integrado) ---
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/questoes?select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP do Supabase: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          const dadosComStatus = data.map(q => ({
            ...q,
            situacao: 'naoResolvi'
          }));
          setQuestionsBank(dadosComStatus);
        } else {
          setQuestionsBank(MOCK_QUESTIONS.map(q => ({ ...q, situacao: 'naoResolvi' })));
        }
      } catch (err) {
        console.error("Erro ao buscar no Supabase:", err);
        setQuestionsBank(MOCK_QUESTIONS.map(q => ({ ...q, situacao: 'naoResolvi' })));
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // --- Extração Dinâmica para Filtros Superiores (Com Contagem) ---
  const dynamicFilters = useMemo(() => {
    const buildOptions = (key) => {
      const counts = {};
      questionsBank.forEach(q => { 
        const val = key === 'instituicao' ? q.orgao : q[key]; 
        if (val) counts[val] = (counts[val] || 0) + 1; 
      });
      return Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => key === 'ano' ? b.value.localeCompare(a.value) : a.value.localeCompare(b.value));
    };
    
    return { 
      assunto: buildOptions('assunto'), 
      instituicao: buildOptions('instituicao'), 
      ano: buildOptions('ano'), 
      regiao: buildOptions('regiao'), 
      finalidade: buildOptions('finalidade'), 
      professor: buildOptions('professor'), 
      banca: buildOptions('banca') 
    };
  }, [questionsBank]);

  // --- Manipuladores de Estado de Filtros ---
  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]);
  };

  const toggleTopFilterOption = (categoryKey, value) => {
    setTopFilters(prev => ({ 
      ...prev, 
      [categoryKey]: prev[categoryKey].includes(value) 
        ? prev[categoryKey].filter(v => v !== value) 
        : [...prev[categoryKey], value] 
    }));
  };

  const resetFilters = () => { 
    setToggles(initialToggles); 
    setSearchTerm(""); 
    setTopFilters(initialTopFilters); 
    setAdvancedFilters(initialAdvancedFilters); 
    setActiveDropdown(null); 
    setShowOnlyBookmarked(false); 
  };

  // --- Manipulador do Timer ---
  useEffect(() => {
    let interval;
    if (currentView === 'solve' && isTimerRunning) {
      interval = setInterval(() => setTimer(p => p + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [currentView, isTimerRunning]);

  const formatTimer = (s) => {
    return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  };

  // --- Motor de Filtragem Principal Integrado ---
  const filteredQuestions = useMemo(() => {
    let list = questionsBank.filter(q => {
      // 1. Busca por Texto (Enunciado, Órgão, Banca)
      const txt = (q.enunciado || "").toLowerCase(); 
      const org = (q.orgao || "").toLowerCase(); 
      const bc = (q.banca || "").toLowerCase();
      const srch = searchTerm.toLowerCase();
      const textMatch = txt.includes(srch) || org.includes(srch) || bc.includes(srch);
      
      // 2. Filtros Rápidos Laterais (Tipo e Situação)
      const typeMatch = (toggles.certoErrado && q.tipo === 'certoErrado') || 
                        (toggles.multiplaEscolha && q.tipo === 'multiplaEscolha') || 
                        (!toggles.certoErrado && !toggles.multiplaEscolha);
      
      const sitMatch = (toggles.jaResolvi && q.situacao !== 'naoResolvi') || 
                       (toggles.naoResolvi && q.situacao === 'naoResolvi') || 
                       (toggles.acertei && q.situacao === 'acertei') || 
                       (toggles.errei && q.situacao === 'errei') || 
                       (!toggles.jaResolvi && !toggles.naoResolvi && !toggles.acertei && !toggles.errei);
      
      // 3. Filtros Categoriais Superiores
      const topMatch = ['assunto', 'instituicao', 'ano', 'regiao', 'finalidade', 'professor', 'banca'].every(key => {
        const val = key === 'instituicao' ? q.orgao : q[key];
        return topFilters[key].length === 0 || topFilters[key].includes(val);
      });

      // 4. Filtros Avançados (Modal)
      const difMatch = advancedFilters.dificuldade.length === 0 || advancedFilters.dificuldade.includes(q.dificuldade);
      const vidMatch = !advancedFilters.apenasComVideo || q.temVideo;
      const comMatch = !advancedFilters.apenasComComentarios || (q.comentarios && q.comentarios > 0);
      const anulMatch = !advancedFilters.excluirAnuladas || !q.anulada;
      const desatualMatch = !advancedFilters.excluirDesatualizadas || !q.desatualizada;
      
      // Filtro de Tamanho do Enunciado
      let tamMatch = true;
      if (advancedFilters.tamanhoEnunciado === 'curto') {
        tamMatch = (q.enunciado || "").length < 200;
      } else if (advancedFilters.tamanhoEnunciado === 'longo') {
        tamMatch = (q.enunciado || "").length >= 200;
      }

      // Filtro de Taxa de Acerto da Comunidade
      const acertos = q.acertos_comunidade || 0; 
      const erros = q.erros_comunidade || 0; 
      const total = acertos + erros;
      const taxa = total > 0 ? (acertos / total) * 100 : 0;
      const taxaMatch = advancedFilters.taxaAcertoMinima === 0 || taxa >= advancedFilters.taxaAcertoMinima;

      return textMatch && typeMatch && sitMatch && topMatch && difMatch && vidMatch && comMatch && anulMatch && desatualMatch && tamMatch && taxaMatch;
    });

    // Filtro Exclusivo de Revisão (Ativado apenas no Modo de Estudo)
    if (showOnlyBookmarked) {
      list = list.filter(q => bookmarkedIds.includes(q.id));
    }

    return list;
  }, [searchTerm, toggles, topFilters, advancedFilters, questionsBank, showOnlyBookmarked, bookmarkedIds]);

  // --- Cálculos de Estatísticas Dinâmicas para o Dashboard ---
  const stats = useMemo(() => {
    const total = filteredQuestions.length;
    let globAcertos = 0; 
    let globErros = 0;

    const countBy = (key) => {
      const counts = {};
      filteredQuestions.forEach(q => { 
        if(q[key]) {
          counts[q[key]] = (counts[q[key]] || 0) + 1; 
        }
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    };

    // Calcular a taxa de acerto global teórica para esse conjunto de questões
    filteredQuestions.forEach(q => { 
      globAcertos += (q.acertos_comunidade || 0); 
      globErros += (q.erros_comunidade || 0); 
    });
    
    const taxaGlobal = (globAcertos + globErros) > 0 
      ? Math.round((globAcertos / (globAcertos + globErros)) * 100) 
      : 0;

    return {
      total,
      assuntos: countBy('assunto'),
      bancas: countBy('banca'),
      anos: countBy('ano'),
      tipos: countBy('tipo'),
      taxaGlobal
    };
  }, [filteredQuestions]);

  // --- Função para Feedback de Salvar Lista ---
  const handleSaveList = () => {
    setSaveListStatus('saving');
    // Simula uma chamada para o banco de dados para salvar os metadados do filtro atual
    setTimeout(() => {
      setSaveListStatus('success');
      setTimeout(() => setSaveListStatus('idle'), 3000);
    }, 1000);
  };

  // --- Função para Impressão do Caderno ---
  const handlePrintPDF = () => {
    window.print();
  };

  // --- Renderização de Loading Inicial ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-slate-50 text-blue-600 font-bold text-lg flex-col">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        Carregando banco de questões...
      </div>
    );
  }

  // --- Renderização Principal da Aplicação ---
  return (
    <div className="flex w-full h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      <GlobalStyles />
      
      {/* Overlay Escuro para fechar Dropdowns ativas */}
      {activeDropdown && <div className="fixed inset-0 z-50" onClick={() => setActiveDropdown(null)} />}
      
      {/* --- Sidebar Lateral Ícones --- */}
      <aside className={`hidden md:flex w-16 bg-white border-r border-gray-200 flex-col items-center py-4 z-40 shadow-sm fixed h-full left-0 top-0 transition-transform ${currentView === 'solve' ? '-translate-x-full no-print' : ''}`}>
        <div className="mb-8 text-blue-900 font-bold text-2xl cursor-pointer">EM</div>
        <SidebarItem icon={LayoutGrid} /> 
        <SidebarItem icon={Mic} /> 
        <SidebarItem icon={BookOpen} />
        <SidebarItem icon={FileQuestion} active={true} /> 
        <SidebarItem icon={BarChart2} /> 
        <SidebarItem icon={Users} />
      </aside>

      {/* --- Área Principal de Conteúdo --- */}
      <main className={`flex-1 min-w-0 flex flex-col w-full h-screen overflow-hidden transition-all duration-300 ${currentView === 'filters' ? 'md:ml-16' : 'ml-0'}`} id="printable-study-area">
        
        {/* --- HEADER GERAL (Apenas View: Filtros) --- */}
        {currentView === 'filters' && (
          <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between shadow-sm z-20 shrink-0">
            <div className="flex items-center w-full max-w-4xl">
              <Menu size={24} className="md:hidden mr-3 text-gray-600 cursor-pointer shrink-0" onClick={() => setShowSideFilters(true)} />
              <h1 className="text-xl sm:text-2xl font-bold text-blue-900 mr-4 sm:mr-8 shrink-0">Questões</h1>
              
              <div className="flex-1 min-w-0 relative">
                <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all">
                  <button className="hidden sm:flex items-center px-3 py-2 text-gray-600 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors shrink-0">
                    <span className="text-sm mr-2 font-medium">Casts</span>
                    <ChevronDown size={14} />
                  </button>
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2 outline-none text-sm text-gray-700 placeholder-gray-400" 
                    placeholder="Busque por trecho da questão, banca ou órgão..." 
                  />
                  <button className="p-2 text-gray-400 hover:text-blue-600 shrink-0">
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-6 ml-4 shrink-0">
              <button className="hidden lg:flex items-center text-gray-500 hover:text-blue-600">
                <span className="text-sm font-medium mr-2">Favoritos</span>
                <Heart size={20} />
              </button>
              <div className="relative cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">1</div>
                <Bell size={22} className="text-gray-400" />
              </div>
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer text-sm shadow-sm">K</div>
            </div>
          </header>
        )}

        {/* --- VIEW: FILTROS E DASHBOARD --- */}
        {currentView === 'filters' && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-slate-50">
            
            {/* Barra Horizontal de Filtros Superiores */}
            <div className="bg-white px-4 sm:px-8 pt-5 pb-3 border-b border-gray-200 shrink-0 relative z-[60] shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Filtre questões de acordo com seu objetivo</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4 sm:mb-6">Crie o seu caderno ideal selecionando os critérios abaixo</p>
              
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap w-full pb-1 xl:pb-0">
                  <button onClick={() => setShowSideFilters(true)} className="lg:hidden flex items-center shrink-0 text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg font-bold text-sm mr-2 shadow-sm">
                    <Filter size={16} className="mr-2" /> Filtros
                  </button>
                  
                  <TopFilterDropdown label="Especialidade / Assunto" categoryKey="assunto" options={dynamicFilters.assunto} selectedValues={topFilters.assunto} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'assunto'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'assunto' ? null : 'assunto')} />
                  <TopFilterDropdown label="Instituição" categoryKey="instituicao" options={dynamicFilters.instituicao} selectedValues={topFilters.instituicao} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'instituicao'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'instituicao' ? null : 'instituicao')} />
                  <TopFilterDropdown label="Ano" categoryKey="ano" options={dynamicFilters.ano} selectedValues={topFilters.ano} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'ano'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'ano' ? null : 'ano')} />
                  <TopFilterDropdown label="Região" categoryKey="regiao" options={dynamicFilters.regiao} selectedValues={topFilters.regiao} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'regiao'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'regiao' ? null : 'regiao')} />
                  <TopFilterDropdown label="Finalidade" categoryKey="finalidade" options={dynamicFilters.finalidade} selectedValues={topFilters.finalidade} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'finalidade'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'finalidade' ? null : 'finalidade')} />
                  <TopFilterDropdown label="Professor" categoryKey="professor" options={dynamicFilters.professor} selectedValues={topFilters.professor} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'professor'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'professor' ? null : 'professor')} />
                  <TopFilterDropdown label="Banca" categoryKey="banca" options={dynamicFilters.banca} selectedValues={topFilters.banca} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'banca'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'banca' ? null : 'banca')} />
                </div>
                
                <div onClick={() => setIsAdvancedModalOpen(true)} className="flex items-center text-blue-700 cursor-pointer bg-white border border-gray-200 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 xl:border-transparent xl:hover:border-blue-200 font-bold shadow-sm">
                  <SlidersHorizontal size={18} className="mr-2" /> 
                  <span className="text-sm">Filtros avançados</span>
                  {(advancedFilters.dificuldade.length > 0 || advancedFilters.apenasComVideo || advancedFilters.taxaAcertoMinima > 0) && (
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full ml-3 border border-gray-200 shadow-sm"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden w-full relative">
              {/* Menu Lateral Mobile Overlay */}
              {showSideFilters && <div className="fixed inset-0 bg-black/50 z-[65] lg:hidden backdrop-blur-sm" onClick={() => setShowSideFilters(false)} />}

              {/* Sidebar de Filtros Rápidos Esquerda */}
              <div className={`fixed lg:static inset-y-0 left-0 z-[70] lg:z-[40] w-[280px] lg:w-[320px] shrink-0 border-r border-gray-200 bg-white overflow-y-auto custom-scrollbar flex flex-col transform transition-transform duration-300 ease-in-out ${showSideFilters ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 h-full`}>
                <div className="p-5 bg-gradient-to-r from-gray-50 to-white text-blue-900 text-sm font-bold border-b border-gray-200 flex justify-between items-center uppercase tracking-wide">
                  <span>Critérios de Busca</span> 
                  <X size={20} className="lg:hidden text-gray-400 cursor-pointer" onClick={() => setShowSideFilters(false)} />
                </div>
                
                <div className="border-b border-gray-100">
                  <div className="flex justify-between items-center px-5 py-4"><h3 className="text-sm font-bold text-gray-800">Tipo de questão</h3></div>
                  <ToggleRow label="Certo/Errado" checked={toggles.certoErrado} onChange={() => setToggles(p => ({...p, certoErrado: !p.certoErrado}))} />
                  <ToggleRow label="Múltipla escolha" checked={toggles.multiplaEscolha} onChange={() => setToggles(p => ({...p, multiplaEscolha: !p.multiplaEscolha}))} />
                </div>
                
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center px-5 py-4"><h3 className="text-sm font-bold text-gray-800">Situação</h3></div>
                  <ToggleRow label="Questões que já resolvi" checked={toggles.jaResolvi} onChange={() => setToggles(p => ({...p, jaResolvi: !p.jaResolvi}))} />
                  <ToggleRow label="Questões que não resolvi" checked={toggles.naoResolvi} onChange={() => setToggles(p => ({...p, naoResolvi: !p.naoResolvi}))} />
                  <ToggleRow label="Questões que acertei" checked={toggles.acertei} onChange={() => setToggles(p => ({...p, acertei: !p.acertei}))} />
                  <ToggleRow label="Questões que errei" checked={toggles.errei} onChange={() => setToggles(p => ({...p, errei: !p.errei}))} />
                </div>
              </div>

              {/* Dashboard Central de Estatísticas */}
              <div className="flex-1 min-w-0 bg-slate-100 flex flex-col h-full overflow-hidden w-full relative z-[10]">
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                  
                  {/* Banner Principal de Performance */}
                  <div className="mb-6 p-6 sm:p-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-2xl text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Target size={120} />
                    </div>
                    <div className="relative z-10 flex-1">
                      <h2 className="text-2xl sm:text-3xl font-black flex items-center mb-2 tracking-tight">
                        <PieChart className="mr-3 text-blue-300" size={32} /> 
                        Painel do Caderno
                      </h2>
                      <p className="text-blue-200 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                        Analise o panorama das <strong>{stats.total} questões</strong> encontradas com os filtros atuais antes de iniciar a sua sessão.
                      </p>
                    </div>
                    
                    {stats.total > 0 && (
                      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 shrink-0">
                        <div className="w-14 h-14 rounded-full border-4 border-blue-400 flex items-center justify-center text-xl font-black">
                          {stats.taxaGlobal}%
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-0.5">Performance</p>
                          <p className="text-sm font-medium">Acertos da Comunidade</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Etiquetas Ativas de Filtro */}
                  <div className="mb-8 flex flex-wrap gap-2">
                    {['certoErrado','multiplaEscolha','jaResolvi','naoResolvi','acertei','errei'].filter(k=>toggles[k]).map(k => (
                      <ActiveTag key={k} label={k} onRemove={() => setToggles(p => ({...p, [k]: false}))} />
                    ))}
                    {Object.entries(topFilters).map(([cat, values]) => values.map(val => (
                      <TagListItem key={`${cat}-${val}`} category={cat} title={val} onRemove={() => toggleTopFilterOption(cat, val)} />
                    )))}
                  </div>

                  {/* --- NOVA SEÇÃO: DESEMPENHO GLOBAL DO USUÁRIO --- */}
                  <div className="mb-12">
                    <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
                      <Target className="mr-3 text-[#203b82]" size={24} /> Seu Desempenho Geral
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      
                      {/* 1. Gráfico de Calor (Constância - Estilo GitHub) */}
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 xl:col-span-3 overflow-hidden flex flex-col xl:flex-row gap-6">
                        
                        {/* Lado Esquerdo: O Gráfico Expandido */}
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-gray-800 flex items-center">
                              <Target className="text-orange-500 mr-2" size={20}/> Constância de Estudos
                            </h3>
                            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200 shadow-sm xl:hidden">
                              🔥 14 dias!
                            </span>
                          </div>
                          <div className="flex gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                            {/* Ajustado para 35 semanas para preencher melhor a tela */}
                            {Array.from({ length: 35 }).map((_, col) => (
                              <div key={col} className="flex flex-col gap-1.5 shrink-0">
                                {Array.from({ length: 7 }).map((_, row) => {
                                  const isActive = Math.random() > 0.4;
                                  const intensity = isActive ? Math.floor(Math.random() * 3) + 1 : 0;
                                  const colors = ['bg-gray-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600'];
                                  return <div key={`heat-${col}-${row}`} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-colors hover:ring-2 hover:ring-blue-400 cursor-pointer ${colors[intensity]}`} title={`${intensity * 15} questões resolvidas`}></div>;
                                })}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Lado Direito: Estatísticas de Constância preenchendo o vazio */}
                        <div className="xl:w-64 flex flex-col justify-center gap-3 shrink-0 border-t xl:border-t-0 xl:border-l border-gray-100 pt-5 xl:pt-0 xl:pl-6">
                          <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-orange-800">Ofensiva Atual</span>
                            <span className="text-lg font-black text-orange-600 flex items-center">🔥 14</span>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-blue-800">Maior Ofensiva</span>
                            <span className="text-lg font-black text-blue-600 flex items-center"><Trophy size={16} className="mr-1"/> 42</span>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-600">Total (Este Ano)</span>
                            <span className="text-lg font-black text-gray-800">1.248</span>
                          </div>
                        </div>

                      </div>

                      {/* 2. Funil de Desempenho */}
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center">
                          <Filter className="text-purple-500 mr-2" size={20}/> Funil de Retenção
                        </h3>
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-full bg-emerald-50 rounded-xl p-3 border border-emerald-200 relative overflow-hidden flex justify-between items-center group shadow-sm">
                            <div className="absolute left-0 top-0 bottom-0 bg-emerald-200 w-[68%] z-0 transition-all opacity-40"></div>
                            <span className="relative z-10 text-emerald-900 text-sm font-bold">Certas de 1ª tentativa</span>
                            <span className="relative z-10 text-emerald-700 font-black text-lg">68%</span>
                          </div>
                          <div className="w-[85%] bg-blue-50 rounded-xl p-3 border border-blue-200 relative overflow-hidden flex justify-between items-center shadow-sm">
                            <div className="absolute left-0 top-0 bottom-0 bg-blue-200 w-[20%] z-0 transition-all opacity-40"></div>
                            <span className="relative z-10 text-blue-900 text-sm font-bold">Certas pós-revisão</span>
                            <span className="relative z-10 text-blue-700 font-black text-lg">20%</span>
                          </div>
                          <div className="w-[70%] bg-red-50 rounded-xl p-3 border border-red-200 relative overflow-hidden flex justify-between items-center shadow-sm">
                            <div className="absolute left-0 top-0 bottom-0 bg-red-200 w-[12%] z-0 transition-all opacity-40"></div>
                            <span className="relative z-10 text-red-900 text-sm font-bold">Erradas / Gargalos</span>
                            <span className="relative z-10 text-red-700 font-black text-lg">12%</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Termômetro: Pontos Fortes e Fracos */}
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center">
                          <BarChart2 className="text-[#203b82] mr-2" size={20}/> Termômetro Temático
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center"><CheckCircle2 size={14} className="mr-1 text-emerald-500"/> Mandando Bem</span>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                              <span className="text-sm font-bold text-gray-700 truncate mr-2">Cirurgia (2025)</span>
                              <span className="text-sm font-black text-emerald-600 shrink-0">88%</span>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                              <span className="text-sm font-bold text-gray-700 truncate mr-2">Clínica Médica (2025)</span>
                              <span className="text-sm font-black text-emerald-600 shrink-0">82%</span>
                            </div>
                          </div>
                          <div className="border-t border-gray-100 pt-3">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center"><XCircle size={14} className="mr-1 text-red-500"/> Precisa Revisar</span>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                              <span className="text-sm font-bold text-gray-700 truncate mr-2">Pediatria (2025)</span>
                              <span className="text-sm font-black text-red-500 shrink-0">45%</span>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                              <span className="text-sm font-bold text-gray-700 truncate mr-2">Ginecologia e Obstetrícia (2025)</span>
                              <span className="text-sm font-black text-red-500 shrink-0">52%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Tempo & Calculadora de Aprovação */}
                      <div className="grid grid-rows-2 gap-6">
                        {/* Comparativo de Tempo */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center relative overflow-hidden group">
                          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                            <Clock className="text-blue-400 mr-2" size={16}/> Tempo Médio / Questão
                          </h3>
                          <div className="flex items-end gap-3 z-10">
                            <span className="text-3xl font-black text-gray-800">1m 12s</span>
                            <span className="flex items-center text-sm font-bold text-emerald-500 mb-1 bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle2 size={14} className="mr-1"/> 15% mais rápido
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 z-10">Performance excelente para o Revalida.</p>
                          {/* Mini gráfico de linha ao fundo (Visual) */}
                          <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-10 group-hover:opacity-20 transition-opacity" viewBox="0 0 100 40">
                            <path d="M0 40 L20 30 L40 35 L60 20 L80 25 L100 10 L100 40 Z" fill="#3b82f6" />
                            <path d="M0 40 L20 30 L40 35 L60 20 L80 25 L100 10" fill="none" stroke="#2563eb" strokeWidth="2" />
                          </svg>
                        </div>

                        {/* Calculadora de Aprovação */}
                        <div className="bg-gradient-to-br from-[#203b82] to-blue-900 rounded-2xl shadow-md border border-blue-700 p-5 text-white relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transform rotate-12">
                            <Target size={90} />
                          </div>
                          <h3 className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-2 flex items-center relative z-10">
                            <Trophy className="text-yellow-400 mr-2" size={16}/> Calculadora de Aprovação
                          </h3>
                          <div className="relative z-10 mt-1">
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-2xl font-black">74% <span className="text-[10px] font-medium text-blue-200 tracking-widest uppercase ml-1">Atual</span></span>
                              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Corte: 80%</span>
                            </div>
                            <div className="w-full bg-blue-950/50 rounded-full h-2.5 overflow-hidden mt-2 border border-blue-800/50">
                              <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full relative" style={{ width: '74%' }}>
                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 blur-[1px]"></div>
                              </div>
                            </div>
                            <p className="text-[11px] text-blue-100 mt-3 font-medium leading-tight">
                              Faltam apenas <strong>+6%</strong> para a margem de segurança. Foco em Preventiva (2025)!
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* --- SEPARADOR VISUAL PARA O RAIO-X DO CADERNO --- */}
                  <h2 className="text-xl font-black text-gray-800 mb-6 mt-8 flex items-center border-t border-gray-200 pt-8">
                    <FileQuestion className="mr-3 text-[#203b82]" size={24} /> Raio-X do Filtro Atual
                  </h2>

                  {/* Grid de Estatísticas Detalhadas */}
                  {stats.total > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                      
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 xl:col-span-2">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center">
                          <BookOpen className="text-blue-600 mr-2" size={20}/> 
                          Distribuição de Assuntos
                        </h3>
                        <div className="space-y-4">
                          {stats.assuntos.map(([nome, qtd]) => (
                            <StatsProgress key={nome||'Geral'} label={nome||'Geral'} count={qtd} total={stats.total} />
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center">
                          <LayoutGrid className="text-blue-600 mr-2" size={20}/> 
                          Principais Bancas
                        </h3>
                        <div className="space-y-4">
                          {stats.bancas.map(([nome, qtd]) => (
                            <StatsProgress key={nome||'N/D'} label={nome||'N/D'} count={qtd} total={stats.total} />
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center">
                          <Clock className="text-blue-600 mr-2" size={20}/> 
                          Distribuição por Anos
                        </h3>
                        <div className="space-y-4">
                          {stats.anos.map(([nome, qtd]) => (
                            <StatsProgress key={nome||'N/D'} label={nome||'N/D'} count={qtd} total={stats.total} />
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 xl:col-span-2">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center">
                          <Trophy className="text-blue-600 mr-2" size={20}/> 
                          Tipos de Questão
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           {stats.tipos.map(([nome, qtd]) => (
                             <div key={nome} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                               <span className="font-bold text-gray-600">{nome === 'certoErrado' ? 'Certo/Errado' : 'Múltipla Escolha'}</span>
                               <span className="text-xl font-black text-blue-700">{qtd}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                      <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileQuestion size={40} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-700">Nenhuma questão encontrada</h3>
                      <p className="text-gray-500 mt-2 font-medium">Tente reduzir a quantidade de filtros.</p>
                      <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        Limpar Filtros
                      </button>
                    </div>
                  )}
                </div>

                {/* BOTÕES DE AÇÃO INFERIORES DO DASHBOARD */}
                <div className="bg-white border-t border-gray-200 p-4 sm:p-5 flex justify-between items-center shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-20 shrink-0 w-full relative">
                  <button onClick={resetFilters} className="text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 hover:text-red-500 text-sm px-5 py-2.5 rounded-xl transition-colors uppercase tracking-wide border border-transparent">
                    Limpar Tudo
                  </button>
                  <div className="flex gap-3">
                    
                    {/* Botão Dinâmico de Guardar Lista */}
                    <button 
                      onClick={handleSaveList} 
                      disabled={saveListStatus !== 'idle'}
                      className={`hidden sm:flex items-center px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm border-2
                        ${saveListStatus === 'idle' ? 'bg-white border-blue-600 text-blue-700 hover:bg-blue-50' : 
                          saveListStatus === 'saving' ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-wait' : 
                          'bg-emerald-500 border-emerald-500 text-white'}`}
                    >
                      {saveListStatus === 'idle' && <><Save size={16} className="mr-2" /> Guardar Lista</>}
                      {saveListStatus === 'saving' && 'Guardando...'}
                      {saveListStatus === 'success' && <><CheckCircle2 size={16} className="mr-2" /> Lista Salva!</>}
                    </button>
                    
                    {/* Botão de Iniciar Resolução */}
                    <button 
                      onClick={() => { setCurrentView('solve'); setIsTimerRunning(true); }} 
                      disabled={stats.total === 0} 
                      className={`px-8 py-3 rounded-xl font-black flex items-center justify-center transition-all text-sm uppercase tracking-wider 
                        ${stats.total > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:-translate-y-0.5 border border-transparent' : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-transparent'}`}
                    >
                      Resolver Caderno {stats.total > 0 && `(${stats.total})`} 
                      {stats.total > 0 && <ArrowRight size={18} className="ml-2" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: MODO RESOLUÇÃO (ESTUDO E PDF) --- */}
        {currentView === 'solve' && (
          <div className="flex flex-col flex-1 min-h-0 bg-slate-100">
            
            <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm shrink-0 no-print z-10 sticky top-0 gap-4">
              
              <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                <button onClick={() => setCurrentView('filters')} className="flex items-center text-gray-600 hover:text-blue-700 transition-colors bg-gray-50 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-sm border border-gray-200">
                  <ArrowLeft size={16} className="mr-2" /> 
                  <span className="hidden sm:inline">Painel</span>
                </button>
                
                <div className="flex items-center text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="font-black text-blue-700 mr-1.5">{filteredQuestions.length}</span> questões
                </div>
                
                {/* Botão de Visualizar Apenas Questões para Revisão */}
                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
                <button 
                  onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                  className={`flex items-center text-sm font-bold px-3 py-1.5 rounded-lg border transition-all ${showOnlyBookmarked ? 'bg-orange-100 border-orange-300 text-orange-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <BookMarked size={16} className="mr-2" fill={showOnlyBookmarked ? "currentColor" : "none"} /> 
                  Apenas Revisão ({bookmarkedIds.length})
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
                {/* Cronômetro (Mantido intacto) */}
                <div className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-200 shadow-sm rounded-lg" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                  <Clock size={18} className={isTimerRunning ? "text-blue-600 animate-pulse" : "text-gray-400"} />
                  <span className="font-mono text-sm font-bold text-gray-700 w-[60px] text-center">{formatTimer(timer)}</span>
                </div>
                
                {/* Botão Gerar PDF (Atualizado para azul e texto branco) */}
                <button 
                  onClick={handlePrintPDF} 
                  className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg shadow-md hover:opacity-80 active:scale-95 font-bold text-sm transition-all uppercase tracking-wider" 
                  style={{ backgroundColor: '#203b82' }} 
                  title="Gerar PDF de alta qualidade"
                >
                  <Printer size={18} color="white" /> 
                  <span className="hidden sm:inline">Gerar PDF</span>
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 md:p-12 scroll-smooth">
              <div className="max-w-4xl mx-auto w-full pb-32">
                
                {/* Capa do PDF Refinada e Dinâmica */}
                <div className="hidden print-only mb-12 pb-6 border-b-2 border-gray-800">
                  <div className="flex justify-between items-end">
                    <div>
                      <h1 className="text-3xl font-black uppercase text-gray-900 mb-2">Caderno de Estudo</h1>
                      <p className="text-gray-600 font-bold">Resumo Estratégico & Metas</p>
                      <div className="mt-4 text-xs text-gray-500 max-w-md">
                        <strong>Filtros Aplicados:</strong> {Object.values(topFilters).flat().join(', ') || 'Geral (Sem restrições)'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Gerado em: {new Date().toLocaleDateString()}</p>
                      <p className="text-gray-800 font-black text-xl mt-1">{filteredQuestions.length} Questões</p>
                    </div>
                  </div>
                </div>

                {/* Renderização das Questões com Estados Interativos */}
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q, i) => (
                    <StudyQuestionCard 
                      key={q.id} 
                      questao={q} 
                      index={i} 
                      fontSizeClass={fontSize} 
                      isBookmarked={bookmarkedIds.includes(q.id)} 
                      onToggleBookmark={() => toggleBookmark(q.id)}
                      onReportError={setReportModalData}
                      onOpenForum={setForumModalData}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-500 font-medium">
                    Nenhuma questão encontrada com os critérios atuais ou filtro de revisão.
                  </div>
                )}

              {/* --- GABARITO OFICIAL (Apenas no PDF) --- */}
                {filteredQuestions.length > 0 && (
                  <div className="hidden print-only" style={{ pageBreakBefore: 'always', paddingTop: '20px' }}>
                    <h2 className="text-3xl font-black uppercase text-gray-900 mb-8 border-b-2 border-gray-800 pb-4">
                      Gabarito Oficial
                    </h2>
                    <div className="grid grid-cols-5 gap-y-6 gap-x-4">
                      {filteredQuestions.map((q, i) => (
                        <div key={q.id} className="text-base font-bold flex items-center">
                          <span className="text-gray-500 w-8 text-right mr-3">{i + 1}.</span>
                          <span className="text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-md border border-blue-200 shadow-sm">
                            {String.fromCharCode(65 + q.gabarito)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL GLOBAL: FILTROS AVANÇADOS --- */}
        {isAdvancedModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-full flex flex-col">
              
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 shrink-0 bg-gray-50 rounded-t-2xl">
                <div className="flex items-center">
                  <SlidersHorizontal size={24} className="text-blue-700 mr-3 hidden sm:block" />
                  <h2 className="text-lg sm:text-xl font-black text-gray-800">Filtros Avançados</h2>
                </div>
                <button onClick={() => setIsAdvancedModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white shadow-sm hover:shadow p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                
                {/* Filtro: Taxa de Acerto Mínima */}
                <section>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Mínimo de Acerto (Comunidade)</h3>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <input 
                      type="range" 
                      min="0" 
                      max="90" 
                      step="10" 
                      value={advancedFilters.taxaAcertoMinima} 
                      onChange={(e) => setAdvancedFilters(p => ({...p, taxaAcertoMinima: parseInt(e.target.value)}))} 
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer mb-3" 
                    />
                    <div className="flex justify-between text-sm font-bold text-blue-800">
                      <span>Todas (0%)</span>
                      <span>{advancedFilters.taxaAcertoMinima > 0 ? `> ${advancedFilters.taxaAcertoMinima}%` : ''}</span>
                      <span>90%</span>
                    </div>
                  </div>
                </section>

                {/* Filtro: Tamanho do Enunciado */}
                <section>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Tamanho do Enunciado</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['todos', 'curto', 'longo'].map(tam => (
                      <div 
                        key={tam} 
                        onClick={() => setAdvancedFilters(p => ({...p, tamanhoEnunciado: tam}))} 
                        className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-bold capitalize ${advancedFilters.tamanhoEnunciado === tam ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
                      >
                        {tam}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Filtro: Nível de Dificuldade */}
                <section>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Nível de Dificuldade</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Fácil', 'Média', 'Difícil'].map(nvl => (
                      <div 
                        key={nvl} 
                        onClick={() => setAdvancedFilters(p => ({...p, dificuldade: p.dificuldade.includes(nvl) ? p.dificuldade.filter(v=>v!==nvl) : [...p.dificuldade, nvl]}))} 
                        className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all font-bold ${advancedFilters.dificuldade.includes(nvl) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
                      >
                        {nvl}
                      </div>
                    ))}
                  </div>
                </section>
                
                {/* Filtro: Exclusões de Conteúdo e Vídeo */}
                <section>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Recursos & Exclusões</h3>
                  <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    {[
                      { key: 'apenasComVideo', label: 'Apenas com vídeo de resolução' },
                      { key: 'excluirAnuladas', label: 'Ocultar questões anuladas' },
                      { key: 'excluirDesatualizadas', label: 'Ocultar questões desatualizadas' }
                    ].map(item => (
                      <label key={item.key} className="flex items-center cursor-pointer group">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${advancedFilters[item.key] ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                          {advancedFilters[item.key] && <Check size={16} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
              
              <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl shrink-0">
                <button onClick={() => setAdvancedFilters(initialAdvancedFilters)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl uppercase text-sm">Restaurar</button>
                <button onClick={() => setIsAdvancedModalOpen(false)} className="px-8 py-3 bg-blue-700 text-white rounded-xl font-black shadow-md uppercase text-sm">Aplicar</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL GLOBAL: REPORTAR ERRO --- */}
        {reportModalData && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
              
              <div className="bg-red-50 p-5 border-b border-red-100 flex items-center justify-between">
                <div className="flex items-center text-red-700 font-black text-lg">
                  <AlertTriangle className="mr-3" /> Reportar Problema
                </div>
                <button onClick={() => setReportModalData(null)} className="text-red-400 hover:text-red-700">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <p className="text-sm text-gray-600">Ajude-nos a melhorar. O que há de errado com a questão <strong>ID: {reportModalData.id}</strong>?</p>
                
                <div className="space-y-3">
                  {[
                    'Gabarito Incorreto', 
                    'Enunciado Incompleto / Errado', 
                    'Questão Desatualizada', 
                    'Filtros Incorretos (Assunto, Banca, etc)', 
                    'Vídeo / Comentário com Erro'
                  ].map(motivo => (
                    <label key={motivo} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
                      <input type="radio" name="errorReason" className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500" />
                      <span className="text-sm font-bold text-gray-700">{motivo}</span>
                    </label>
                  ))}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Detalhes (Opcional)</label>
                  <textarea 
                    rows="3" 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none resize-none" 
                    placeholder="Explique brevemente o erro encontrado..."
                  ></textarea>
                </div>
                
                <button 
                  onClick={() => setReportModalData(null)} 
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl uppercase text-sm tracking-widest shadow-md"
                >
                  Enviar Relatório
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL GLOBAL / LATERAL: FÓRUM DA QUESTÃO --- */}
        {forumModalData && (
          <div className="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={() => setForumModalData(null)}>
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform translate-x-0 transition-transform" onClick={e => e.stopPropagation()}>
              
              <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-blue-50">
                <div className="font-black text-blue-900 flex items-center">
                  <MessageCircle className="mr-3" /> Fórum da Questão {forumModalData.id}
                </div>
                <button onClick={() => setForumModalData(null)} className="p-2 text-gray-500 hover:bg-blue-100 rounded-full">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50">
                {forumModalData.forum && forumModalData.forum.length > 0 ? (
                  forumModalData.forum.map((cmt, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-blue-800 text-sm flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs mr-2">
                            {cmt.user.charAt(0)}
                          </div>
                          {cmt.user}
                        </span>
                        <span className="text-xs text-gray-400">Há 2 dias</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{cmt.text}</p>
                      <div className="flex gap-4 border-t border-gray-100 pt-3">
                        <button className="text-xs font-bold text-gray-500 flex items-center hover:text-blue-600">
                          <ThumbsUp size={14} className="mr-1.5"/> {cmt.likes} Útil
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <MessageCircle size={40} className="mx-auto mb-4 text-gray-300"/>
                    Nenhum comentário ainda. Seja o primeiro a ajudar!
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-200">
                  <input type="text" placeholder="Adicione seu comentário..." className="flex-1 p-3 text-sm outline-none bg-transparent" />
                  <button className="p-3 text-blue-600 hover:bg-blue-50 font-bold">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}