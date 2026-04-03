import React, { useState, useMemo, useRef, useEffect } from 'react';
// Adicione isto junto com as outras importações no topo do arquivo:
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// Tiramos o PDFDownloadLink e colocamos o 'pdf' no lugar
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
  ThumbsUp,
  Sun,
  Moon,
  Settings2,
  Star,
  Keyboard,
  List as ListIcon,
  Type
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

    /* --- CORREÇÃO DAS SETINHAS PRETAS DO INPUT DE NÚMERO --- */
    input[type="number"] {
      color-scheme: light; 
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      background-color: #eff6ff !important; /* Cor exata do fundo blue-50 */
      cursor: pointer;
    }

      /* Transforma o card em texto corrido para o PDF fluir perfeitamente */
      .print-break-inside-avoid {
        display: block !important;
        page-break-inside: avoid !important; /* Evita cortar a questão no meio da página */
        break-inside: avoid !important;
        margin: 0 0 25px 0 !important;
        padding: 0 0 15px 0 !important; 
        border: none !important; 
        border-bottom: 1px solid #94a3b8 !important; /* Linha fina e elegante separando as questões */
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      /* Garante que o container principal também não use flexbox na impressão */
      #printable-study-area, .print-break-inside-avoid * {
        float: none !important;
      }

      /* Impede cortes no meio do texto e alternativas */
      .enunciado-print, .space-y-3 > div, .space-y-4 > div { 
        page-break-inside: avoid !important; break-inside: avoid !important; 
      }
      .header-questao-print, .capa-print {
        page-break-after: avoid !important; break-after: avoid !important;
      }

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

// --- ESTILOS DO PDF (REACT-PDF) ---
const pdfStyles = StyleSheet.create({
  page: { paddingTop: 30, paddingBottom: 60, paddingHorizontal: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333', backgroundColor: '#FFFFFF' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEEEEE', paddingBottom: 10, marginBottom: 20 },
  headerLeft: { fontSize: 16, fontWeight: 'bold', color: '#203b82' },
  headerRight: { textAlign: 'right' },
  headerTitle: { fontSize: 14, fontWeight: 'bold', color: '#444' },
  headerSubtitle: { fontSize: 8, color: '#888', marginTop: 2 },
  questionBlock: { marginBottom: 20, wrap: false },
  questionHeader: { fontSize: 11, fontWeight: 'bold', color: '#203b82', marginBottom: 5 },
  questionText: { fontSize: 10, lineHeight: 1.5, marginBottom: 10, textAlign: 'justify' },
  optionBlock: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, padding: 4, backgroundColor: '#F8FAFC', borderRadius: 4 },
  optionLabelContainer: { width: 18, height: 18, backgroundColor: '#E2E8F0', borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  optionLabel: { fontSize: 8, fontWeight: 'bold', color: '#334155' },
  optionText: { flex: 1, fontSize: 10, lineHeight: 1.3, marginTop: 2 },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#EEEEEE', paddingTop: 10 },
  footerText: { fontSize: 8, color: '#888' },
  pageNumber: { fontSize: 8, color: '#888' },
  gabaritoTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 15, textAlign: 'center', color: '#203b82' },
  gabaritoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  gabaritoItem: { width: '16%', flexDirection: 'row', borderWidth: 1, borderColor: '#E2E8F0', margin: 2 },
  gabaritoNum: { width: '50%', backgroundColor: '#F1F5F9', padding: 5, textAlign: 'center', fontSize: 9, fontWeight: 'bold' },
  gabaritoAns: { width: '50%', padding: 5, textAlign: 'center', fontSize: 9, fontWeight: 'bold', color: '#203b82' }
});

// --- TEMPLATE UNIVERSAL DO PDF ---
// Ele recebe as 'questoes' filtradas direto do motor do React
const TemplateProvaPDF = ({ questoes, titulo = "Caderno de Questões", usuario = "Aluno" }) => (
  <Document>
    <Page style={pdfStyles.page} wrap>
      {/* Cabeçalho */}
      <View style={pdfStyles.headerContainer} fixed>
        <Text style={pdfStyles.headerLeft}>Medicina JVS</Text>
        <View style={pdfStyles.headerRight}>
          <Text style={pdfStyles.headerTitle}>{titulo}</Text>
          <Text style={pdfStyles.headerSubtitle}>Gerado em {new Date().toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      {/* Loop de Questões */}
      {questoes.map((q, index) => (
        <View key={q.id} style={pdfStyles.questionBlock} wrap={false}>
          <Text style={pdfStyles.questionHeader}>QUESTÃO {index + 1} (ID: {q.id}) {q.assunto ? `- ${q.assunto}` : ''}</Text>
          <Text style={pdfStyles.questionText}>{q.enunciado}</Text>
          
          {/* Mapeamento das alternativas (Lendo array de strings do nosso banco) */}
          {Array.isArray(q.alternativas) && q.alternativas.map((alt, idx) => (
            <View key={idx} style={pdfStyles.optionBlock}>
              <View style={pdfStyles.optionLabelContainer}>
                {/* Converte index 0,1,2 para A,B,C... */}
                <Text style={pdfStyles.optionLabel}>{String.fromCharCode(65 + idx)}</Text>
              </View>
              <Text style={pdfStyles.optionText}>{alt}</Text>
            </View>
          ))}
        </View>
      ))}

      {/* Gabarito Final */}
      <View break>
        <Text style={pdfStyles.gabaritoTitle}>GABARITO OFICIAL</Text>
        <View style={pdfStyles.gabaritoGrid}>
          {questoes.map((q, index) => (
            <View key={`gab-${q.id}`} style={pdfStyles.gabaritoItem}>
              <Text style={pdfStyles.gabaritoNum}>{index + 1}</Text>
              {/* Nosso banco salva o gabarito como um número. Convertendo para letra: */}
              <Text style={pdfStyles.gabaritoAns}>
                {q.gabarito !== undefined && q.gabarito !== null ? String.fromCharCode(65 + q.gabarito) : '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Rodapé Dinâmico */}
      <View style={pdfStyles.footer} fixed>
        <Text style={pdfStyles.footerText}>Uso exclusivo - Usuário: {usuario}</Text>
        <Text style={pdfStyles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

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

// --- Componente Interativo: Card de Estudo ---
const StudyQuestionCard = ({ questao, index, fontSizeClass, isBookmarked, onToggleBookmark, onReportError, onOpenForum, onAnswerSubmit, isActive, interactionData, forceShowNotes, onInteractionChange, isSelectedForPrint, onTogglePrintSelection }) => {
  const [selectedAlt, setSelectedAlt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [eliminated, setEliminated] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const [startTime] = useState(Date.now());
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [saveNoteStatus, setSaveNoteStatus] = useState('idle'); // idle, saving, success

  // Força a aba de notas a fechar sempre que o usuário pular para outra questão
  useEffect(() => {
    setIsNotesOpen(false);
  }, [questao.id]);

  useEffect(() => {
    if (interactionData) {
      if (interactionData.nota) setNote(interactionData.nota);
      if (interactionData.avaliacao) setRating(interactionData.avaliacao);
    }
  }, [interactionData]);

  // 2. Controla a abertura da aba via Barra Flutuante
  useEffect(() => {
    if (isActive) setIsNotesOpen(forceShowNotes);
  }, [forceShowNotes, isActive]);
  
  const [stats, setStats] = useState({
    acertos: questao.acertos_comunidade || 0,
    erros: questao.erros_comunidade || 0
  });

  const alternativasSeguras = Array.isArray(questao.alternativas) ? questao.alternativas : [];
  const numComentarios = questao.comentarios || 0;
  const totalRespostas = stats.acertos + stats.erros;
  const porcentagemAcertos = totalRespostas > 0 ? Math.round((stats.acertos / totalRespostas) * 100) : 0;

  // --- INTEGRAÇÃO SUPABASE: SALVAR NOTAS E ESTRELAS ---
  const saveInteractions = async (newRating, newNote) => {
    const finalRating = newRating ?? rating;
    const finalNote = newNote ?? note;
    try {
      // O parâmetro on_conflict=user_id,questao_id força a edição da nota/estrela em vez de duplicar!
      await fetch(`${supabaseUrl}/rest/v1/interacoes_usuario?on_conflict=user_id,questao_id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ user_id: "default_user", questao_id: questao.id.toString(), avaliacao: finalRating, nota: finalNote })
      });
      // Sincroniza a memória da tela instantaneamente
      if (onInteractionChange) onInteractionChange(questao.id.toString(), finalRating, finalNote);
    } catch (e) { console.error("Erro ao salvar interação:", e); }
  };

  const handleRating = (r) => {
    setRating(r);
    saveInteractions(r, null);
  };

  // Botão Manual de Salvar Anotação
  const handleSaveNoteManual = async () => {
    setSaveNoteStatus('saving');
    await saveInteractions(null, note);
    setSaveNoteStatus('success');
    setTimeout(() => setSaveNoteStatus('idle'), 2000);
  };

  const handleDeleteNote = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta anotação?')) return;
    setSaveNoteStatus('saving');
    setNote('');
    await saveInteractions(null, ''); 
    setSaveNoteStatus('idle');
    setIsNotesOpen(false); 
  };

  // --- INTEGRAÇÃO SUPABASE: SALVAR RESPOSTA ---
  const registrarRespostaNoBanco = async (isCorrect, timeSpent) => {
    try {
      await fetch(`${supabaseUrl}/rest/v1/historico_respostas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: "default_user", // Mudar para userId do Firebase no futuro
          questao_id: questao.id.toString(),
          acertou: isCorrect,
          assunto_referencia: questao.assunto,
          tempo_segundos: timeSpent
        })
      });
    } catch (error) { console.error("Erro Supabase:", error); }
  };

  const handleAnswer = (idx) => {
    if(!isAnswered) {
      const acertou = idx === questao.gabarito;
      setSelectedAlt(idx);
      setIsAnswered(true);
      setShowExplanation(true);

      setStats(prev => ({ 
        acertos: prev.acertos + (acertou ? 1 : 0), 
        erros: prev.erros + (!acertou ? 1 : 0) 
      }));

      // Calcula o tempo gasto
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      registrarRespostaNoBanco(acertou, timeSpent);

      if (onAnswerSubmit) {
        onAnswerSubmit(questao.id, acertou, questao.assunto, timeSpent);
      }
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

  // Mágica dos Atalhos de Teclado
  useEffect(() => {
    if (!isActive) return; // Só escuta atalho se este card for o visível na tela
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;
      const key = e.key.toUpperCase();
      if (['A', '1'].includes(key)) handleAnswer(0);
      if (['B', '2'].includes(key)) handleAnswer(1);
      if (['C', '3'].includes(key)) handleAnswer(2);
      if (['D', '4'].includes(key)) handleAnswer(3);
      if (['E', '5'].includes(key)) handleAnswer(4);
      if (key === 'ESCAPE') {
        if(!isAnswered) { setSelectedAlt(null); setEliminated([]); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isAnswered, alternativasSeguras.length]);

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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 shadow-sm print-break-inside-avoid relative transition-all hover:shadow-md block print:p-0 print:border-none print:shadow-none print:bg-transparent print:mb-4">
      
      <div className="flex flex-col gap-3 mb-6 print:mb-3 header-questao-print">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 print:gap-2">
            <div className="bg-[#203b82] text-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-md uppercase tracking-wider inline-block print:bg-gray-200 print:text-black print:border print:border-gray-400 print:px-3 print:py-1 print:text-xs">
              QUESTÃO {index + 1}
            </div>
            
            {/* Avaliação - Oculta na impressão */}
            <div className="flex items-center gap-1 text-gray-500 print:hidden">
              <span className="text-sm font-medium mr-1">Avalie essa questão</span>
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  size={18} 
                  onClick={() => handleRating(star)}
                  className={`cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'hover:text-yellow-400 hover:fill-yellow-400'}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 no-print shrink-0">
            {/* NOVO BOTÃO: SELECIONAR PARA IMPRESSÃO */}
            <button onClick={onTogglePrintSelection} className={`transition-transform hover:scale-110 flex items-center p-2 rounded-lg border ${isSelectedForPrint ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-[#f8fafc] border-[#e2e8f0] text-gray-400 hover:text-blue-500'}`} title="Selecionar para Imprimir">
              <Printer size={18} />
              {isSelectedForPrint && <Check size={14} className="ml-1" />}
            </button>
            <button onClick={onToggleBookmark} className="transition-transform hover:scale-110" title="Marcar para Revisão" style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ fill: isBookmarked ? '#f97316' : 'none', stroke: isBookmarked ? '#f97316' : '#203b82', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block' }}>
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
            </button>
            <button onClick={() => onReportError(questao)} className="transition-transform hover:scale-110" title="Reportar erro" style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ fill: 'none', stroke: '#203b82', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block' }}>
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" x2="4" y1="22" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:gap-2">
          <div className="text-[#2563eb] font-semibold text-sm sm:text-base leading-snug print:text-black print:text-sm">
            {questao.assunto || "Medicina Preventiva - Violência Infantil"}
          </div>
          <div className="text-gray-300 font-bold tracking-[0.2em] hidden sm:block print:hidden">- - -</div>
          <div className="inline-block text-gray-500 bg-gray-50 px-2 py-1 rounded text-[11px] font-bold font-mono border border-gray-200 print:bg-transparent print:border-none print:p-0 print:text-gray-600">
            ID: {questao.id}
          </div>
        </div>
      </div>

      <div className={`mb-8 text-gray-800 leading-[1.8] font-serif text-justify ${fontSizeClass} print:text-black print:text-[13px] print:leading-normal print:mb-3 enunciado-print`}>
        {questao.enunciado}
      </div>

      <div className="space-y-3 mb-6 print:space-y-1 print:mb-2">
        {alternativasSeguras.map((alt, idx) => (
          <div key={idx} onClick={() => handleAnswer(idx)} className={`flex items-start p-3 sm:p-4 rounded-xl cursor-pointer group transition-all border print:border-none print:p-1 print:bg-transparent ${getBgStyle(idx)}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold mr-4 shrink-0 transition-all print:w-6 print:h-6 print:text-xs print:border-gray-800 print:text-black print:bg-transparent print:mr-3 ${getLetterStyle(idx)}`}>
              {String.fromCharCode(65 + idx)}
            </div>
            
            <span className={`text-gray-700 font-medium pt-1 flex-1 ${fontSizeClass} print:text-black print:pt-0 print:text-[13px] ${eliminated.includes(idx) && !isAnswered ? 'line-through text-gray-400 print:no-underline print:text-black' : ''}`}>
              {alt}
            </span>
            
            {!isAnswered && (
              <button onClick={(e) => toggleEliminate(e, idx)} className={`p-1.5 rounded-md ml-2 shrink-0 transition-opacity opacity-0 group-hover:opacity-100 no-print ${eliminated.includes(idx) ? 'bg-gray-200 text-gray-600 opacity-100' : 'text-gray-400 hover:bg-gray-200'}`} title={eliminated.includes(idx) ? "Restaurar alternativa" : "Riscar alternativa"}>
                <EyeOff size={18} />
              </button>
            )}
            
            {isAnswered && idx === questao.gabarito && <CheckCircle2 className="text-emerald-500 ml-2 shrink-0 no-print" size={24} />}
            {isAnswered && selectedAlt === idx && idx !== questao.gabarito && <XCircle className="text-red-500 ml-2 shrink-0 no-print" size={24} />}
          </div>
        ))}
      </div>

      {isAnswered && showExplanation && (
        <div className="mt-6 border border-blue-100 bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 shadow-sm no-print animate-in fade-in">
          <div className="flex items-center mb-4">
            <div className={`w-2 h-6 rounded-full mr-3 ${selectedAlt === questao.gabarito ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <h4 className="text-lg font-bold text-gray-800">
              {selectedAlt === questao.gabarito ? 'Resposta Correta!' : 'Resposta Incorreta'}
            </h4>
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed mb-6 bg-white p-4 rounded-lg border border-gray-100">
            <p className="font-bold text-gray-900 mb-2 flex items-center"><Info size={16} className="text-blue-500 mr-2"/> Comentário / Explicação:</p>
            {questao.explicacao ? (
              <span className="whitespace-pre-wrap">{questao.explicacao}</span>
            ) : (
              <span className="italic text-gray-500">
                A alternativa correta é a letra <strong>{String.fromCharCode(65 + questao.gabarito)}</strong>. O professor ainda não adicionou um comentário detalhado para esta questão.
              </span>
            )}
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

      {/* ÁREA DE ANOTAÇÕES VINCULADA AO CARD (COM LIXEIRA) */}
      {isNotesOpen && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-3 text-yellow-800 font-bold text-sm">
            <div className="flex items-center"><FileText size={16} className="mr-2"/> Minhas Anotações Particulares</div>
            <div className="flex gap-2">
              <button onClick={handleDeleteNote} className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 transition-colors p-1.5 rounded-md flex items-center" title="Excluir Anotação"><XCircle size={16}/></button>
              <button onClick={() => setIsNotesOpen(false)} className="text-yellow-600 hover:text-red-600 transition-colors bg-yellow-100/50 hover:bg-yellow-200 p-1 rounded-md" title="Ocultar Aba"><X size={16}/></button>
            </div>
          </div>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white border border-yellow-300 rounded-lg p-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-yellow-500 resize-none min-h-[100px] custom-scrollbar mb-2 shadow-inner"
            placeholder="Digite aqui seu mnemônico, resumo ou dúvida..."
          ></textarea>
          <div className="flex justify-end">
            <button onClick={handleSaveNoteManual} disabled={saveNoteStatus !== 'idle'} className={`text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center font-bold transition-transform hover:scale-105 ${saveNoteStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'}`}>
              {saveNoteStatus === 'idle' && <><Save size={14} className="mr-2"/> Salvar Anotação</>}
              {saveNoteStatus === 'saving' && 'Salvando...'}
              {saveNoteStatus === 'success' && <><CheckCircle2 size={14} className="mr-2"/> Salvo!</>}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap gap-2">
          {/* Só mostra se tiver nota salva. Pra criar nova vazia, use a barra flutuante */}
          {!isNotesOpen && note && note.length > 0 && (
            <button onClick={() => setIsNotesOpen(true)} className="flex items-center text-sm px-4 py-2 rounded-lg font-bold border bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 transition-colors shadow-sm">
              <FileText size={16} className="mr-2 text-yellow-600" /> Ver Anotação ({note.length > 15 ? note.substring(0,15)+'...' : note})
            </button>
          )}
          <button onClick={() => onOpenForum(questao)} className="flex items-center text-sm text-gray-600 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-colors border border-gray-200 hover:border-blue-200">
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

const MedicalLoader = () => {
  return (
    // O container usa "fixed inset-0" para cobrir a tela inteira enquanto carrega
    <div className="fixed inset-0 bg-slate-50 flex flex-col justify-center items-center z-50">
      
      {/* Estilos embutidos específicos para a animação do SVG e pulso do texto */}
      <style>
        {`
          .ecg-line {
            fill: none;
            stroke: #E53935; /* Cor vermelha típica da área da saúde */
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: heartbeat 2s linear infinite;
          }
          
          /* Faz a linha traçar e apagar continuamente */
          @keyframes heartbeat {
            0% { stroke-dashoffset: 200; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -200; }
          }
          
          .animate-pulse-slow {
            animation: pulse-text 1.5s ease-in-out infinite;
          }
          
          /* Faz o texto piscar suavemente */
          @keyframes pulse-text {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>

      {/* SVG do Eletrocardiograma */}
      <div className="w-48 mb-6">
        <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-md">
          <polyline 
            className="ecg-line"
            points="0,25 20,25 25,15 30,45 40,5 50,45 55,25 75,25 80,20 85,30 90,25 100,25" 
          />
        </svg>
      </div>
      
      {/* Textos de feedback para o utilizador */}
      <h2 className="text-xl font-bold text-gray-800 animate-pulse-slow mb-2">
        A preparar o seu plantão...
      </h2>
      <p className="text-sm text-gray-500">A carregar o banco de questões médicas</p>
      
    </div>
  );
};

/**
 * Componente Reutilizável de Modal de Alerta
 */
export const ModalAlerta = ({ 
  isOpen, 
  onClose, 
  titulo, 
  children, 
  textoBotao = "OK",
  icone 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#2d2d30] border border-gray-700 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700/50 bg-[#37373a]">
          {icone || (
            <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          <h3 className="text-lg font-bold text-white tracking-wide">
            {titulo}
          </h3>
        </div>
        <div className="px-5 py-6 text-gray-300 text-sm leading-relaxed space-y-3">
          {children}
        </div>
        <div className="px-5 py-4 flex justify-end bg-[#252527]">
          <button
            onClick={onClose}
            className="bg-[#00c4cc] hover:bg-[#00a8af] text-gray-900 font-bold px-8 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00c4cc] focus:ring-offset-2 focus:ring-offset-[#252527]"
          >
            {textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (ModuloQuestoes) ---
// Ele agora aceita 'userId' como propriedade (que virá do login do Firebase no site principal)
export default function ModuloQuestoes({ userId = "default_user" }) {
  // --- Estado Global de Alertas Customizados ---
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, titulo: '', mensagem: '' });
  const customAlert = (titulo, mensagem) => setAlertConfig({ isOpen: true, titulo, mensagem });
  const closeCustomAlert = () => setAlertConfig({ isOpen: false, titulo: '', mensagem: '' });
  // Define uma chave única para o LocalStorage baseada no usuário logado
  const STORAGE_KEY = `historico_questoes_${userId}`;
  
  // --- Banco de Dados Simulado (Fallback) ---
  const [questionsBank, setQuestionsBank] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Estados de View ---
  const [currentView, setCurrentView] = useState('filters'); // 'filters' | 'solve'
  const [searchTerm, setSearchTerm] = useState("");
  const [showSideFilters, setShowSideFilters] = useState(false); 
  const [activeDropdown, setActiveDropdown] = useState(null); 
  
  const [fontSize, setFontSize] = useState('text-base');
  const [timer, setTimer] = useState(0);

  // --- NOVOS ESTADOS (Carrossel, Barra Flutuante e Modais) ---
  // --- NOVOS ESTADOS (Carrossel, Barra Flutuante e Modais) ---
  const [solveCountInput, setSolveCountInput] = useState("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const [showNotesArea, setShowNotesArea] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listTab, setListTab] = useState('grade'); // 'grade' ou 'enunciados'
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Controle de Tema

  const [isPrinting, setIsPrinting] = useState(false); // Controle de Impressão (Desoculta o DOM)
  
  // --- Lógica de Geração Imperativa de PDF ---
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    // Define a base: as selecionadas manualmente ou todas as ativas
    let baseQuestoes = selectedForPrint.length > 0 
      ? activeQuestions.filter(q => selectedForPrint.includes(q.id))
      : activeQuestions;

    // TRAVA DE SEGURANÇA: MÁXIMO 150 QUESTÕES
    const MAX_QUESTOES_PDF = 150;
    const questoesParaImprimir = baseQuestoes.slice(0, MAX_QUESTOES_PDF);

    if (baseQuestoes.length > MAX_QUESTOES_PDF) {
      customAlert('Atenção ao Limite', `Você tem ${baseQuestoes.length} questões na fila, mas para evitar travamentos, limitamos a ${MAX_QUESTOES_PDF} questões por PDF.\n\nGerando o PDF das ${MAX_QUESTOES_PDF} primeiras...`);
    } else if (selectedForPrint.length > 0) {
      // Pequeno aviso visual opcional de que está imprimindo a seleção
      console.log(`Gerando PDF com ${selectedForPrint.length} questões selecionadas.`);
    }

    setIsGeneratingPDF(true);
    try {
      const doc = <TemplateProvaPDF questoes={questoesParaImprimir} titulo={`Caderno de Estudos - ${questoesParaImprimir.length} questões`} usuario={userId} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Caderno_MedicinaJVS_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Opcional: Limpa a seleção após baixar o PDF
      setSelectedForPrint([]);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      customAlert('Erro de Geração', 'Erro ao montar o PDF. Tente com um número menor de questões.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // --- ESTADO: Histórico e Interações (Nuvem) ---
  
  // --- ESTADO: Histórico e Interações (Nuvem) ---
  const [solvedHistory, setSolvedHistory] = useState([]);
  const [savedInteractions, setSavedInteractions] = useState([]);
  const [isAllNotesModalOpen, setIsAllNotesModalOpen] = useState(false); // Controle da nova Central de Anotações

  // Puxa o Histórico e as Anotações do Supabase ao carregar
  useEffect(() => {
    async function loadUserData() {
      try {
        // 1. Puxa Histórico
        const resHist = await fetch(`${supabaseUrl}/rest/v1/historico_respostas?user_id=eq.${userId}&select=*`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });
        if(resHist.ok) {
          const data = await resHist.json();
          setSolvedHistory(data.map(h => ({
            questionId: h.questao_id, correct: h.acertou, subject: h.assunto_referencia, timeSpent: h.tempo_segundos || 0, date: h.criado_em
          })));
        }

        // 2. Puxa Anotações e Estrelas
        const resInt = await fetch(`${supabaseUrl}/rest/v1/interacoes_usuario?user_id=eq.${userId}&select=*`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });
        if(resInt.ok) {
          const intData = await resInt.json();
          setSavedInteractions(intData);
        }
      } catch (e) { console.error("Erro ao carregar dados do usuário:", e); }
    }
    if(!isLoading) loadUserData();
  }, [userId, isLoading]);
  
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  // --- NOVO: Estado para seleção de impressão ---
  const [selectedForPrint, setSelectedForPrint] = useState([]);
  const togglePrintSelection = (id) => {
    setSelectedForPrint(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };
  
  // --- Estados de Paginação ---
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  
  const [saveListStatus, setSaveListStatus] = useState('idle'); 
  const [reportModalData, setReportModalData] = useState(null);
  const [forumModalData, setForumModalData] = useState(null);
  
  // Variáveis para o novo Modal de Salvar Caderno Personalizado
  const [isSaveListModalOpen, setIsSaveListModalOpen] = useState(false);
  const [customListName, setCustomListName] = useState('');

  // --- Lógica de "Meus Cadernos" (Salvos) ---
  const [isSavedListsModalOpen, setIsSavedListsModalOpen] = useState(false);
  const [savedLists, setSavedLists] = useState([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  const fetchSavedLists = async () => {
    setIsLoadingLists(true);
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/cadernos_salvos?user_id=eq.${userId}&order=criado_em.desc`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      if (res.ok) setSavedLists(await res.json());
    } catch (e) { console.error("Erro ao buscar cadernos:", e); }
    finally { setIsLoadingLists(false); }
  };

  useEffect(() => {
    if (isSavedListsModalOpen) fetchSavedLists();
  }, [isSavedListsModalOpen]);

  const handleLoadSavedList = (list) => {
    if(list.filtros) {
      setToggles(list.filtros.toggles || initialToggles);
      setTopFilters(list.filtros.topFilters || initialTopFilters);
      setAdvancedFilters(list.filtros.advancedFilters || initialAdvancedFilters);
      setSolveCountInput(list.filtros.quantidadeLimite?.toString() || "");
    }
    setIsSavedListsModalOpen(false);
  };

  const handleDeleteSavedList = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este caderno definitivamente?")) return;
    try {
      await fetch(`${supabaseUrl}/rest/v1/cadernos_salvos?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      setSavedLists(prev => prev.filter(l => l.id !== id));
    } catch (e) { console.error("Erro ao deletar:", e); }
  };

  const handleRenameSavedList = async (id, currentName) => {
    const newName = window.prompt("Digite o novo nome para este caderno:", currentName);
    if (!newName || newName.trim() === "" || newName === currentName) return;
    try {
      await fetch(`${supabaseUrl}/rest/v1/cadernos_salvos?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=representation' },
        body: JSON.stringify({ nome: newName.trim() })
      });
      setSavedLists(prev => prev.map(l => l.id === id ? { ...l, nome: newName.trim() } : l));
    } catch (e) { console.error("Erro ao renomear:", e); }
  };
  
  // --- Novos Estados (Pausa Bonita e Sessão de Leitura de Notas) ---
  const [sessionSummary, setSessionSummary] = useState(null);
  const [noteReviewQuestion, setNoteReviewQuestion] = useState(null);

  // --- Estados Reais do Fórum ---

  // --- Estados Reais do Fórum ---
  // --- Estados Reais do Fórum ---
  const [forumComments, setForumComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null); // Necessário para as respostas

  // Busca comentários quando abre o modal do Fórum
  useEffect(() => {
    if (forumModalData) {
      const fetchComments = async () => {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/comentarios_forum?questao_id=eq.${forumModalData.id}&order=criado_em.asc`, {
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
          });
          if (res.ok) setForumComments(await res.json());
        } catch (e) { console.error("Erro Fórum:", e); }
      };
      fetchComments();
    } else {
      setForumComments([]);
      setNewCommentText('');
      setReplyingToCommentId(null);
    }
  }, [forumModalData]);

  // Enviar novo comentário
  // Enviar novo comentário ou resposta
  const handlePostComment = async () => {
    if (!newCommentText.trim() || !forumModalData) return;
    setIsSubmittingComment(true);
    
    try {
      // Monta o pacote de dados EXATAMENTE como a sua tabela exige
      const novoComentario = { 
        questao_id: forumModalData.id.toString(), 
        user_id: userId, 
        user_name: "Você", 
        texto_comentario: newCommentText, // <--- AQUI ESTÁ O SEGREDO! Mudamos de 'texto' para 'texto_comentario'
        parent_id: replyingToCommentId || null
      };

      const res = await fetch(`${supabaseUrl}/rest/v1/comentarios_forum`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'apikey': supabaseKey, 
          'Authorization': `Bearer ${supabaseKey}`, 
          'Prefer': 'return=representation' // Pede pro Supabase devolver o item salvo
        },
        body: JSON.stringify(novoComentario)
      });

      // SE DER ERRO NO BANCO, ELE VAI GRITAR AQUI NA TELA:
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro detalhado do Supabase:", errorData);
        customAlert('Erro ao Salvar', `Erro ao salvar no banco de dados!\nMotivo: ${errorData.message || JSON.stringify(errorData)}`);
        setIsSubmittingComment(false);
        return; // Para a execução aqui, não desenha na tela
      }

      // Se deu sucesso, coloca na tela!
      const posted = await res.json();
      setForumComments(prev => [...prev, ...posted]);
      setNewCommentText('');
      setReplyingToCommentId(null);

    } catch (e) { 
      console.error("Erro de conexão:", e); 
      customAlert('Falha de Conexão', 'Falha na conexão com a internet ou com o Supabase.');
    } 
    finally { 
      setIsSubmittingComment(false); 
    }
  };

  // --- Dar "Útil" em um comentário ---
  const handleLikeComment = async (commentId, currentLikes) => {
    // 1. Atualização Otimista: aumenta o número na tela imediatamente para o usuário não sentir lentidão
    setForumComments(prev => prev.map(cmt => 
      cmt.id === commentId ? { ...cmt, likes: (cmt.likes || 0) + 1 } : cmt
    ));

    try {
      // 2. Envia a atualização silenciosa para o banco de dados
      const res = await fetch(`${supabaseUrl}/rest/v1/comentarios_forum?id=eq.${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ likes: (currentLikes || 0) + 1 })
      });

      if (!res.ok) throw new Error("Falha ao registrar curtida");
    } catch (e) {
      console.error("Erro ao dar like:", e);
      // Se a internet cair ou o banco falhar, desfazemos o +1 discretamente
      setForumComments(prev => prev.map(cmt => 
        cmt.id === commentId ? { ...cmt, likes: currentLikes } : cmt
      ));
    }
  };

  const initialToggles = { certoErrado: true, multiplaEscolha: true, discursivas: true, jaResolvi: false, naoResolvi: true, acertei: false, errei: false };
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
    excluirAnuladas: false, // AGORA NÃO ESCONDE MAIS ANULADAS
    tamanhoEnunciado: 'todos', 
    taxaAcertoMinima: 0, 
    excluirDesatualizadas: false // AGORA NÃO ESCONDE MAIS DESATUALIZADAS
  };
  const [advancedFilters, setAdvancedFilters] = useState(initialAdvancedFilters);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  // --- Fetch Data (Supabase Integrado com Paginação Automática Estável) ---
  useEffect(() => {
    async function fetchQuestions() {
      try {
        let allQuestions = [];
        let offset = 0;
        const limit = 1000;
        let hasMore = true;

        while (hasMore) {
          // A MÁGICA 1: &order=id.asc obriga o Supabase a não embaralhar as questões entre as páginas!
          const response = await fetch(`${supabaseUrl}/rest/v1/questoes?select=*&order=id.asc&limit=${limit}&offset=${offset}`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });

          if (!response.ok) throw new Error(`Erro HTTP do Supabase: ${response.status}`);

          const data = await response.json();
          
          if (data && data.length > 0) {
            allQuestions = [...allQuestions, ...data];
            offset += limit;
            if (data.length < limit) hasMore = false;
          } else {
            hasMore = false;
          }
        }
        
        if (allQuestions.length > 0) {
          const dadosComStatus = allQuestions.map(q => {
            // A MÁGICA 2: Normalizador Rígido Exato
            let tipoCorreto = 'multiplaEscolha'; 
            if (q.tipo) {
              const str = String(q.tipo).trim().toLowerCase(); 
              // Usa '===' em vez de '.includes' para evitar que roube questões de múltipla escolha que tenham a palavra "certo" ou "discursiva" no meio.
              if (str === 'discursiva' || str === 'discursivas' || str === 'aberta') {
                tipoCorreto = 'discursiva'; 
              } else if (str === 'certo/errado' || str === 'certo e errado' || str === 'ce') {
                tipoCorreto = 'certoErrado';
              }
            }
            return { ...q, tipo: tipoCorreto, situacao: 'naoResolvi' };
          });
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
                        (toggles.discursivas && q.tipo === 'discursiva') || // Match singular do banco
                        (!toggles.certoErrado && !toggles.multiplaEscolha && !toggles.discursivas);
      
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

      // Retorna a lista completa para o Dashboard exibir as estatísticas reais (ex: 2000 questões)
      return list;
    }, [searchTerm, toggles, topFilters, advancedFilters, questionsBank, showOnlyBookmarked, bookmarkedIds]);

  // Sempre que os filtros mudarem, a paginação volta para a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredQuestions.length]);

  // --- MEMÓRIA DE SESSÃO INTELIGENTE (AGORA NO LUGAR CERTO) ---
  const sessionHash = useMemo(() => {
    if (!filteredQuestions || filteredQuestions.length === 0) return null;
    return filteredQuestions.map(q => q.id).join(',').substring(0, 40);
  }, [filteredQuestions]);

  useEffect(() => {
    if (sessionHash) {
      const savedIndex = localStorage.getItem(`idx_${STORAGE_KEY}_${sessionHash}`);
      if (savedIndex) setCurrentQIndex(parseInt(savedIndex));
    }
  }, [sessionHash, STORAGE_KEY]);

  useEffect(() => {
    if (sessionHash && currentQIndex > 0) {
      localStorage.setItem(`idx_${STORAGE_KEY}_${sessionHash}`, currentQIndex.toString());
    }
  }, [currentQIndex, sessionHash, STORAGE_KEY]);
  // -------------------------------------------------------------

  // Cálculos de Paginação (Fatiando a lista)
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

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

  // --- ESTATÍSTICAS DINÂMICAS (Para o Dashboard Real do Usuário) ---
  const dynamicStats = useMemo(() => {
    const totalSolved = solvedHistory.length;
    
    // Retorno seguro (Prevenção de Tela Preta caso o usuário não tenha resolvido nada ainda)
    if (totalSolved === 0) {
      return {
        totalSolved: 0, totalEsteAno: 0, currentStreak: 0, maxStreak: 0, heatmapData: {},
        globalSuccessRate: 0, topSubjects: [], bottomSubjects: [], averageTime: "--m --s",
        funnel: { certas1: 0, certasRev: 0, erradas: 0 }
      };
    }

    // 1. Constância e Mapa de Calor
    const heatmapData = solvedHistory.reduce((acc, entry) => {
      const dateKey = new Date(entry.date).toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(heatmapData).sort((a, b) => b.localeCompare(a));
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split('T')[0];

    // Calcula a Maior Ofensiva de todos os tempos
    const allDatesAsc = [...sortedDates].reverse();
    for (let i = 0; i < allDatesAsc.length; i++) {
      if (i === 0) { tempStreak = 1; maxStreak = 1; continue; }
      const d1 = new Date(allDatesAsc[i-1]);
      const d2 = new Date(allDatesAsc[i]);
      if ((d2 - d1) / (1000 * 60 * 60 * 24) === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // Calcula a Ofensiva Atual
    if (sortedDates.length > 0 && sortedDates[0] === today) {
      currentStreak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const d1 = new Date(sortedDates[i]);
        const d2 = new Date(sortedDates[i + 1]);
        if ((d1 - d2) / (1000 * 60 * 60 * 24) === 1) currentStreak++;
        else break;
      }
    }

    // Total Este Ano
    const currentYear = new Date().getFullYear();
    const totalEsteAno = solvedHistory.filter(q => new Date(q.date).getFullYear() === currentYear).length;

    // 2. Funil de Retenção (Agrupando tentativas na mesma questão)
    const attemptsByQuestion = solvedHistory.reduce((acc, entry) => {
      if (!acc[entry.questionId]) acc[entry.questionId] = [];
      acc[entry.questionId].push(entry.correct);
      return acc;
    }, {});

    let certasPrimeira = 0;
    let certasPosRevisao = 0;
    let erradasGargalo = 0;
    const totalUniq = Object.keys(attemptsByQuestion).length;

    Object.values(attemptsByQuestion).forEach(attempts => {
      if (attempts[0] === true) {
        certasPrimeira++;
      } else if (attempts.includes(true)) {
        certasPosRevisao++;
      } else {
        erradasGargalo++;
      }
    });

    const pCertas1 = totalUniq > 0 ? Math.round((certasPrimeira / totalUniq) * 100) : 0;
    const pCertasRev = totalUniq > 0 ? Math.round((certasPosRevisao / totalUniq) * 100) : 0;
    const pErradas = totalUniq > 0 ? Math.round((erradasGargalo / totalUniq) * 100) : 0;
    const globalSuccessRate = totalUniq > 0 ? Math.round(((certasPrimeira + certasPosRevisao) / totalUniq) * 100) : 0;

    // 3. Termômetro Temático
    const performanceBySubject = solvedHistory.reduce((acc, entry) => {
      const subjectKey = entry.subject ? entry.subject.split(' - ')[0] : 'Geral';
      if (!acc[subjectKey]) acc[subjectKey] = { total: 0, correct: 0 };
      acc[subjectKey].total++;
      if (entry.correct) acc[subjectKey].correct++;
      return acc;
    }, {});

    const subjectList = Object.entries(performanceBySubject)
      .map(([name, data]) => ({ name, percentage: Math.round((data.correct / data.total) * 100), total: data.total }))
      .sort((a, b) => b.percentage - a.percentage);

    const topSubjects = subjectList.filter(s => s.percentage >= 80).slice(0, 3);
    const bottomSubjects = subjectList.filter(s => s.percentage < 80).slice(0, 3);

    // 4. Tempo Médio Calculado Real a partir do Supabase
    const totalSeconds = solvedHistory.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0);
    const avgSeconds = totalSolved > 0 ? Math.round(totalSeconds / totalSolved) : 0;
    const calculatedAverageTime = totalSolved > 0 ? `${Math.floor(avgSeconds / 60)}m ${(avgSeconds % 60).toString().padStart(2, '0')}s` : "--m --s";

    return {
      totalSolved, totalEsteAno, currentStreak, maxStreak, heatmapData,
      globalSuccessRate, topSubjects, bottomSubjects, averageTime: calculatedAverageTime,
      funnel: { certas1: pCertas1, certasRev: pCertasRev, erradas: pErradas }
    };
  }, [solvedHistory]);

  // --- Função Real de Salvar Novo Caderno no Supabase ---
  const handleSaveList = async () => {
    if (!customListName.trim()) return;
    setSaveListStatus('saving');
    try {
      await fetch(`${supabaseUrl}/rest/v1/cadernos_salvos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          user_id: userId,
          nome: customListName.trim(),
          filtros: { 
            toggles, 
            topFilters, 
            advancedFilters, 
            // Trava dura de 1000 ao enviar pro banco de dados
            quantidadeLimite: Math.min(parseInt(solveCountInput) || stats.total, 1000) 
          }
        })
      });
      setSaveListStatus('success');
      setIsSaveListModalOpen(false); // Fecha o modal após salvar
      setCustomListName(''); // Reseta o nome para a próxima vez
      setTimeout(() => setSaveListStatus('idle'), 3000);
    } catch (e) {
      console.error(e);
      setSaveListStatus('idle');
    }
  };

  // --- LÓGICA DO CARROSSEL (COM TRAVA DE 1000 QUESTÕES) ---
  const requestedQ = parseInt(solveCountInput) || filteredQuestions.length;
  const maxQ = Math.min(requestedQ, 1000); // Trava dura matemática
  const activeQuestions = filteredQuestions.slice(0, maxQ);

  const nextQ = () => { setCurrentQIndex(p => Math.min(activeQuestions.length - 1, p + 1)); setShowNotesArea(false); };
  const prevQ = () => { setCurrentQIndex(p => Math.max(0, p - 1)); setShowNotesArea(false); };

  // Navegação por teclado (Setas)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentView !== 'solve') return;
      if (isListModalOpen || isShortcutsModalOpen) return;
      if (e.key === 'ArrowRight') nextQ();
      if (e.key === 'ArrowLeft') prevQ();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, isListModalOpen, isShortcutsModalOpen, activeQuestions.length]);

  // Controles de Fonte da Barra Flutuante
  const increaseFont = () => {
    if(fontSize === 'text-sm') setFontSize('text-base');
    else if(fontSize === 'text-base') setFontSize('text-lg');
    else if(fontSize === 'text-lg') setFontSize('text-xl');
  };
  const decreaseFont = () => {
    if(fontSize === 'text-xl') setFontSize('text-lg');
    else if(fontSize === 'text-lg') setFontSize('text-base');
    else if(fontSize === 'text-base') setFontSize('text-sm');
  };

  // --- Renderização de Loading Inicial ---
  if (isLoading) {
    return <MedicalLoader />;
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
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center text-gray-500 hover:text-blue-600 transition-colors" title="Alternar Modo Escuro">
                  {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
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
                  
                  <TopFilterDropdown label="Especialidade" categoryKey="assunto" options={dynamicFilters.assunto} selectedValues={topFilters.assunto} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'assunto'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'assunto' ? null : 'assunto')} />
                  <TopFilterDropdown label="Instituição" categoryKey="instituicao" options={dynamicFilters.instituicao} selectedValues={topFilters.instituicao} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'instituicao'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'instituicao' ? null : 'instituicao')} />
                  <TopFilterDropdown label="Ano" categoryKey="ano" options={dynamicFilters.ano} selectedValues={topFilters.ano} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'ano'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'ano' ? null : 'ano')} />
                  <TopFilterDropdown label="Região" categoryKey="regiao" options={dynamicFilters.regiao} selectedValues={topFilters.regiao} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'regiao'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'regiao' ? null : 'regiao')} />
                  <TopFilterDropdown label="Finalidade" categoryKey="finalidade" options={dynamicFilters.finalidade} selectedValues={topFilters.finalidade} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'finalidade'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'finalidade' ? null : 'finalidade')} />
                  <TopFilterDropdown label="Professor" categoryKey="professor" options={dynamicFilters.professor} selectedValues={topFilters.professor} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'professor'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'professor' ? null : 'professor')} />
                  <TopFilterDropdown label="Banca" categoryKey="banca" options={dynamicFilters.banca} selectedValues={topFilters.banca} onToggleItem={toggleTopFilterOption} isOpen={activeDropdown === 'banca'} onToggleOpen={() => setActiveDropdown(activeDropdown === 'banca' ? null : 'banca')} />
                </div>
                
                <div className="flex items-center gap-3 shrink-0 mt-3 xl:mt-0">
                  {/* Botão para abrir os Cadernos Salvos */}
                  <button onClick={() => setIsSavedListsModalOpen(true)} className="hidden xl:flex items-center text-[#203b82] hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
                    <BookMarked size={16} className="mr-2" /> Meus Cadernos
                  </button>

                  <button onClick={() => setIsAllNotesModalOpen(true)} className="hidden xl:flex items-center text-yellow-700 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
                    <FileText size={16} className="mr-2" /> Central de Notas
                  </button>

                  
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
                  <div className="flex items-center gap-2">
                    <button onClick={resetFilters} className="text-[10px] font-black bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-2.5 py-1.5 rounded border border-red-200 transition-colors shadow-sm cursor-pointer tracking-widest">
                      LIMPAR TUDO
                    </button>
                    <X size={20} className="lg:hidden text-gray-400 cursor-pointer" onClick={() => setShowSideFilters(false)} />
                  </div>
                </div>
                
                <div className="border-b border-gray-100">
                  <div className="flex justify-between items-center px-5 py-4"><h3 className="text-sm font-bold text-gray-800">Tipo de questão</h3></div>
                  <ToggleRow label="Certo/Errado" checked={toggles.certoErrado} onChange={() => setToggles(p => ({...p, certoErrado: !p.certoErrado}))} />
                  <ToggleRow label="Múltipla escolha" checked={toggles.multiplaEscolha} onChange={() => setToggles(p => ({...p, multiplaEscolha: !p.multiplaEscolha}))} />
                  <ToggleRow label="Discursivas" checked={toggles.discursivas} onChange={() => setToggles(p => ({...p, discursivas: !p.discursivas}))} />
                </div>
                
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center px-5 py-4">
                    <h3 className="text-sm font-bold text-gray-800">Situação</h3>
                    <button onClick={() => setIsAdvancedModalOpen(true)} className="flex items-center text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-md transition-colors border border-blue-200 shadow-sm relative cursor-pointer uppercase tracking-wider">
                      <SlidersHorizontal size={14} className="mr-1.5" />
                      Avançados
                      {(advancedFilters.dificuldade.length > 0 || advancedFilters.apenasComVideo || advancedFilters.taxaAcertoMinima > 0 || advancedFilters.tamanhoEnunciado !== 'todos') && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm"></div>
                      )}
                    </button>
                  </div>
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
                        Analisando <strong>{stats.total} questões</strong> filtradas <span className="text-white bg-blue-950/50 px-2 py-0.5 rounded-md text-xs ml-1">(de um total de {questionsBank.length} baixadas do banco)</span>.
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

                  {/* --- NOVA SEÇÃO: DESEMPENHO GLOBAL DO USUÁRIO (CONECTADA AO HISTÓRICO REAL) --- */}
                  <div className="mb-12">
                    <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
                      <Target className="mr-3 text-[#203b82]" size={24} /> Seu Desempenho Geral
                    </h2>
                    
                    {/* Exibição Condicional: Se não houver histórico, mostra uma mensagem de placeholder */}
                    {dynamicStats.totalSolved === 0 ? (
                      <div className="bg-blue-50/50 p-8 rounded-2xl border-2 border-dashed border-blue-200 text-center shadow-sm">
                        <Target size={40} className="text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-800 mb-2">Seu Dashboard Ganhará Vida!</h3>
                        <p className="text-gray-600 max-w-md mx-auto">Comece a resolver questões no Modo de Resolução. Seus acertos, erros e constância aparecerão aqui automaticamente.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        
                        {/* 1. Gráfico de Calor e Constância Real */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 xl:col-span-3 overflow-hidden flex flex-col xl:flex-row gap-6">
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-black text-gray-800 flex items-center">
                                <Target className="text-orange-500 mr-2" size={20}/> Constância de Estudos
                              </h3>
                              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200 shadow-sm xl:hidden">
                                🔥 {dynamicStats.currentStreak} dias
                              </span>
                            </div>
                            {/* Renderização do Mapa de Calor (GitHub Style) */}
                            <div className="flex gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                              {[...Array(35)].map((_, colIndex) => {
                                const col = 34 - colIndex; // Renderiza da semana mais antiga para a mais nova
                                return (
                                  <div key={col} className="flex flex-col gap-1.5 shrink-0">
                                    {[...Array(7)].map((_, row) => {
                                      const cellDate = new Date();
                                      cellDate.setDate(cellDate.getDate() - (col * 7) - row);
                                      const dateKey = cellDate.toISOString().split('T')[0];
                                      const count = dynamicStats.heatmapData[dateKey] || 0;
                                      
                                      // Intensidade do verde baseado no volume
                                      let intensity = 0;
                                      if (count > 0 && count < 5) intensity = 1;
                                      else if (count >= 5 && count < 15) intensity = 2;
                                      else if (count >= 15) intensity = 3;
                                      
                                      const colors = ['bg-gray-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600'];
                                      return (
                                        <div 
                                          key={`heat-${col}-${row}`} 
                                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-colors hover:ring-2 hover:ring-blue-400 cursor-pointer ${colors[intensity]}`} 
                                          title={count > 0 ? `${count} questões em ${cellDate.toLocaleDateString('pt-BR')}` : `Nenhuma questão`}
                                        ></div>
                                      );
                                    }).reverse()} {/* Inverte o dia da semana para segunda-feira ficar no topo */}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Resumo de Ofensivas */}
                          <div className="xl:w-64 flex flex-col justify-center gap-3 shrink-0 border-t xl:border-t-0 xl:border-l border-gray-100 pt-5 xl:pt-0 xl:pl-6">
                            <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 flex items-center justify-between">
                              <span className="text-sm font-bold text-orange-800">Ofensiva Atual</span>
                              <span className="text-lg font-black text-orange-600 flex items-center">🔥 {dynamicStats.currentStreak}</span>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center justify-between">
                              <span className="text-sm font-bold text-blue-800">Maior Ofensiva</span>
                              <span className="text-lg font-black text-blue-600 flex items-center"><Trophy size={16} className="mr-1"/> {dynamicStats.maxStreak}</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-600">Total (Este Ano)</span>
                              <span className="text-lg font-black text-gray-800">{dynamicStats.totalEsteAno}</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Funil de Desempenho Real (3 Etapas) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                          <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center">
                            <Filter className="text-purple-500 mr-2" size={20}/> Funil de Retenção
                          </h3>
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-full bg-emerald-50 rounded-xl p-3 border border-emerald-200 relative overflow-hidden flex justify-between items-center group shadow-sm">
                              {/* Barra de progresso ao fundo (w-full com overlay parcial) */}
                              <div className="absolute left-0 top-0 bottom-0 bg-emerald-200 z-0 transition-all opacity-40" style={{ width: `${dynamicStats.funnel.certas1}%` }}></div>
                              <span className="relative z-10 text-emerald-900 text-sm font-bold">Certas de 1ª tentativa</span>
                              <span className="relative z-10 text-emerald-700 font-black text-lg">{dynamicStats.funnel.certas1}%</span>
                            </div>
                            <div className="w-[85%] bg-blue-50 rounded-xl p-3 border border-blue-200 relative overflow-hidden flex justify-between items-center shadow-sm">
                              <div className="absolute left-0 top-0 bottom-0 bg-blue-200 z-0 transition-all opacity-40" style={{ width: `${dynamicStats.funnel.certasRev}%` }}></div>
                              <span className="relative z-10 text-blue-900 text-sm font-bold">Certas pós-revisão</span>
                              <span className="relative z-10 text-blue-700 font-black text-lg">{dynamicStats.funnel.certasRev}%</span>
                            </div>
                            <div className="w-[70%] bg-red-50 rounded-xl p-3 border border-red-200 relative overflow-hidden flex justify-between items-center shadow-sm">
                              <div className="absolute left-0 top-0 bottom-0 bg-red-200 z-0 transition-all opacity-40" style={{ width: `${dynamicStats.funnel.erradas}%` }}></div>
                              <span className="relative z-10 text-red-900 text-sm font-bold">Erradas / Gargalos</span>
                              <span className="relative z-10 text-red-700 font-black text-lg">{dynamicStats.funnel.erradas}%</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Termômetro Temático Dinâmico (Pontos Fortes e Fracos) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                          <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center">
                            <BarChart2 className="text-[#203b82] mr-2" size={20}/> Termômetro Temático
                          </h3>
                          <div className="space-y-4">
                            {/* Renderização de Pontos Fortes (Cima) */}
                            {dynamicStats.topSubjects.length > 0 ? (
                              <div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center"><CheckCircle2 size={14} className="mr-1 text-emerald-500"/> Mandando Bem</span>
                                {dynamicStats.topSubjects.map(s => (
                                  <div key={s.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                    <span className="text-sm font-bold text-gray-700 truncate mr-2">{s.name}</span>
                                    <span className="text-sm font-black text-emerald-600 shrink-0">{s.percentage}%</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs italic text-gray-500 text-center py-2 border border-dashed border-gray-100 rounded-lg">Foque em Preventive para ativar.</div>
                            )}
                            
                            {/* Renderização de Pontos Fracos (Baixo) */}
                            {dynamicStats.bottomSubjects.length > 0 && (
                              <div className="border-t border-gray-100 pt-3">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center"><XCircle size={14} className="mr-1 text-red-500"/> Precisa Revisar</span>
                                {dynamicStats.bottomSubjects.map(s => (
                                  <div key={s.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                    <span className="text-sm font-bold text-gray-700 truncate mr-2">{s.name}</span>
                                    <span className="text-sm font-black text-red-500 shrink-0">{s.percentage}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 4. Tempo & Calculadora Dinâmica */}
                        <div className="grid grid-rows-2 gap-6">
                          {/* Tempo Médio */}
                          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center relative overflow-hidden group">
                            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                              <Clock className="text-blue-400 mr-2" size={16}/> Tempo Médio / Questão
                            </h3>
                            <div className="flex items-end gap-3 z-10">
                              <span className="text-3xl font-black text-gray-800">{dynamicStats.averageTime}</span>
                            </div>
                            <p className="text-[10px] text-emerald-500 mt-2 z-10 font-bold flex items-center"><CheckCircle2 size={12} className="mr-1"/> Calculado do seu histórico real.</p>
                            <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-10 group-hover:opacity-20 transition-opacity" viewBox="0 0 100 40">
                              <path d="M0 40 L20 30 L40 35 L60 20 L80 25 L100 10 L100 40 Z" fill="#3b82f6" />
                              <path d="M0 40 L20 30 L40 35 L60 20 L80 25 L100 10" fill="none" stroke="#2563eb" strokeWidth="2" />
                            </svg>
                          </div>

                          {/* Calculadora de Aprovação Dinâmica */}
                          <div className="bg-gradient-to-br from-[#203b82] to-blue-900 rounded-2xl shadow-md border border-blue-700 p-5 text-white relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transform rotate-12"><Target size={90} /></div>
                            <h3 className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-2 flex items-center relative z-10">
                              <Trophy className="text-yellow-400 mr-2" size={16}/> Calculadora de Aprovação
                            </h3>
                            <div className="relative z-10 mt-1">
                              <div className="flex justify-between items-end mb-1">
                                <span className="text-2xl font-black">{dynamicStats.globalSuccessRate}% <span className="text-[10px] font-medium text-blue-200 tracking-widest uppercase ml-1">Atual</span></span>
                                <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Corte: 80%</span>
                              </div>
                              {/* Barra de Progresso da Calculadora */}
                              <div className="w-full bg-blue-950/50 rounded-full h-2.5 overflow-hidden mt-2 border border-blue-800/50">
                                <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full relative" style={{ width: `${Math.min(dynamicStats.globalSuccessRate, 100)}%` }}>
                                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 blur-[1px]"></div>
                                </div>
                              </div>
                              {/* Feedback Dinâmico da Margem de Segurança */}
                              <p className="text-[11px] text-blue-100 mt-3 font-medium leading-tight">
                                {dynamicStats.globalSuccessRate >= 80 ? <strong>🔥 Margem de segurança atingida!</strong> : <>Faltam apenas <strong>+{80 - dynamicStats.globalSuccessRate}%</strong> para a margem de segurança!</>}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
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
                           {stats.tipos.map(([nome, qtd]) => {
                             // Blindagem visual: traduz a variável técnica para o português perfeito
                             let labelExibicao = 'Múltipla Escolha';
                             if (nome === 'certoErrado') labelExibicao = 'Certo/Errado';
                             if (nome === 'discursiva' || nome === 'discursivas') labelExibicao = 'Discursivas';
                             
                             return (
                               <div key={nome} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                 <span className="font-bold text-gray-600">{labelExibicao}</span>
                                 <span className="text-xl font-black text-blue-700">{qtd}</span>
                               </div>
                             );
                           })}
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

                {/* BOTÕES DE AÇÃO INFERIORES DO DASHBOARD (Centralizado Simétrico) */}
                <div className="bg-white border-t border-gray-200 p-4 sm:p-5 flex justify-center items-center shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-20 shrink-0 w-full relative">
                  
                  {/* Agrupamento Centralizado com espaçamento (gap) uniforme */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-3 sm:gap-4 w-full max-w-max">
                    
                    {/* Guardar Lista */}
                    <button 
                      onClick={() => setIsSaveListModalOpen(true)} 
                      disabled={saveListStatus !== 'idle' || stats.total === 0}
                      className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm border-2 whitespace-nowrap
                        ${saveListStatus === 'idle' ? 'bg-white border-blue-600 text-blue-700 hover:bg-blue-50' : 
                          saveListStatus === 'saving' ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-wait' : 
                          'bg-emerald-500 border-emerald-500 text-white'}`}
                    >
                      {saveListStatus === 'idle' && <><Save size={16} className="mr-2" /> Guardar Lista</>}
                      {saveListStatus === 'saving' && 'Guardando...'}
                      {saveListStatus === 'success' && <><CheckCircle2 size={16} className="mr-2" /> Lista Salva!</>}
                    </button>
                    
                    {/* Revisão (Favoritos) */}
                    <button 
                      onClick={() => { setShowOnlyBookmarked(!showOnlyBookmarked); setCurrentView('filters'); }} 
                      className={`flex items-center transition-colors px-5 py-2.5 border rounded-xl shadow-sm text-sm font-bold whitespace-nowrap 
                        ${showOnlyBookmarked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Heart size={18} className={`mr-2 ${showOnlyBookmarked ? 'fill-red-500 text-red-500' : ''}`} /> Revisão ({bookmarkedIds.length})
                    </button>
                    
                    {/* Seletor de Quantidade (Estudar) */}
                    <div className="flex items-center bg-blue-50 border border-blue-200 rounded-xl p-1.5 shadow-sm whitespace-nowrap">
                      <span className="text-blue-800 text-sm px-3 font-bold hidden sm:inline">Estudar</span>
                      <input 
                        type="number" 
                        min="1"
                        max="1000"
                        className="bg-[#eff6ff] text-blue-900 font-black w-20 px-2 text-center rounded border border-blue-300 p-1.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={Math.min(stats.total, 1000)} 
                        value={solveCountInput} 
                        onChange={e => {
                          let val = e.target.value;
                          if (parseInt(val) > 1000) val = "1000"; 
                          setSolveCountInput(val);
                        }} 
                      />
                      <div className="flex flex-col justify-center px-3">
                        <span className="text-blue-600 font-bold text-sm leading-none">/ {stats.total}</span>
                        <span className="text-blue-400 font-medium text-[10px] leading-none mt-1">(Máx 1000)</span>
                      </div>
                    </div>

                    {/* Resolver Caderno */}
                    <button 
                      onClick={() => { setCurrentQIndex(0); setCurrentView('solve'); setIsTimerRunning(true); setShowFloatingBar(true); }} 
                      disabled={stats.total === 0} 
                      className={`px-8 py-3 rounded-xl font-black flex items-center justify-center transition-all text-sm uppercase tracking-wider whitespace-nowrap
                        ${stats.total > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:-translate-y-0.5 border border-transparent' : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-transparent'}`}
                    >
                      Resolver Caderno {stats.total > 0 && `(${solveCountInput ? Math.min(parseInt(solveCountInput), stats.total, 1000) : Math.min(stats.total, 1000)})`} 
                      {stats.total > 0 && <ArrowRight size={18} className="ml-2" />}
                    </button>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: MODO RESOLUÇÃO (CARROSSEL OTIMIZADO) --- */}
        {currentView === 'solve' && (
          <div className="flex flex-col flex-1 min-h-0 bg-slate-50 text-slate-800">
            
            {/* Header Superior (Claro) */}
            <header className="bg-slate-50 border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm shrink-0 no-print z-10">
              <div className="flex items-center gap-4">
                {/* Botão Voltar com Resumo do Timer da Sessão */}
                <button onClick={() => {
                  // O seu código deve ficar parecido com isto:
                  customAlert('🏁 Sessão Pausada', `Tempo de foco contínuo: ${formatTimer(timer)}\nSeu progresso na bateria foi salvo.`);
                  setTimer(0); // <--- Adicione esta linha exata para zerar o cronômetro
                  setCurrentView('home'); // (ou a variável que você usa para voltar ao menu)
                }} className="flex items-center text-white rounded-full px-5 py-2 transition-transform hover:scale-105 shadow-sm font-bold text-sm" style={{ backgroundColor: '#203b82' }}>
                  <ArrowLeft size={18} className="mr-1.5" />
                  <span className="hidden sm:inline">Painel</span>
                </button>
                
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                
                <div className="flex flex-col">
                  <span className="text-blue-900 font-bold text-lg leading-tight">Questão {(currentQIndex + 1).toString().padStart(2, '0')}/{activeQuestions.length}</span>
                  <span className="text-gray-500 text-xs font-medium cursor-pointer flex items-center hover:text-blue-600 transition-colors" onClick={() => setIsListModalOpen(true)}>
                    <ListIcon size={12} className="mr-1"/> Ver lista
                  </span>
                </div>
              </div>

              {/* Botões de Ação (Com o Azul #203b82) */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={() => setIsShortcutsModalOpen(true)} className="hidden sm:flex p-2 text-white rounded-lg transition-transform hover:scale-105 shadow-sm" style={{ backgroundColor: '#203b82' }} title="Atalhos do teclado">
                  <Keyboard size={18} />
                </button>
                
                <div className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-white rounded-lg shadow-sm transition-transform hover:scale-105" style={{ backgroundColor: '#203b82' }} onClick={() => setIsTimerRunning(!isTimerRunning)}>
                  <Clock size={18} className={isTimerRunning ? "animate-pulse" : ""} />
                  <span className="font-mono text-sm font-bold w-[50px] text-center">{formatTimer(timer)}</span>
                </div>

                {/* NOVO BOTÃO QUE GERA O PDF SOB DEMANDA */}
                <button 
                  onClick={handleGeneratePDF} 
                  disabled={isGeneratingPDF || activeQuestions.length === 0}
                  className="relative p-2 text-white rounded-lg transition-transform hover:scale-105 shadow-sm flex items-center justify-center min-w-[36px] min-h-[36px] disabled:opacity-50 disabled:cursor-not-allowed" 
                  style={{ backgroundColor: '#203b82' }} 
                  title="Baixar PDF Profissional"
                >
                  {isGeneratingPDF ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Printer size={18} />}
                  {selectedForPrint.length > 0 && !isGeneratingPDF && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-in zoom-in">
                      {selectedForPrint.length}
                    </div>
                  )}
                </button>
              </div>
            </header>

            {/* Área Principal: Carrossel */}
            <div id="questions-scroll-container" className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 flex justify-center scroll-smooth relative">
              
              {/* Setas Laterais 100% integradas ao fundo da página (Invisíveis até o hover) */}
              <button 
                onClick={prevQ} 
                disabled={currentQIndex === 0} 
                className={`fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full z-20 transition-all bg-transparent border-transparent ${currentQIndex === 0 ? 'text-gray-300 cursor-not-allowed opacity-30' : 'text-gray-400 hover:text-blue-700 hover:bg-white shadow-none hover:shadow-md'}`}
              >
                <ArrowLeft size={36} strokeWidth={1.5} />
              </button>
              
              <button 
                onClick={nextQ} 
                disabled={currentQIndex === activeQuestions.length - 1} 
                className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full z-20 transition-all bg-transparent border-transparent ${currentQIndex === activeQuestions.length - 1 ? 'text-gray-300 cursor-not-allowed opacity-30' : 'text-gray-400 hover:text-blue-700 hover:bg-white shadow-none hover:shadow-md'}`}
              >
                <ArrowRight size={36} strokeWidth={1.5} />
              </button>

              <div className="max-w-4xl w-full pb-24 mt-4">
                {activeQuestions.length > 0 ? (
                  isPrinting ? (
                    // MODO IMPRESSÃO: Renderiza todas as questões na tela instantaneamente para gerar o PDF
                    activeQuestions.map((q, i) => (
                      <div key={`print-${q.id}`} className="mb-10 print-break-inside-avoid">
                        <StudyQuestionCard questao={q} index={i} fontSizeClass="text-sm" />
                      </div>
                    ))
                  ) : (
                    // MODO TELA (PERFORMANCE): Renderiza *Apenas* as adjacentes (Impede o navegador de travar)
                    activeQuestions.map((q, i) => {
                      // Se a questão estiver longe do índice atual, nem renderiza ela no DOM! Isso acaba com a lentidão.
                      if (i < currentQIndex - 2 || i > currentQIndex + 2) return null;
                      
                      return (
                        <div key={q.id} className={i === currentQIndex ? 'block animate-in fade-in slide-in-from-bottom-4 duration-300' : 'hidden'}>
                          <StudyQuestionCard 
                            questao={q} index={i} fontSizeClass={fontSize} 
                            isActive={i === currentQIndex}
                            forceShowNotes={showNotesArea && i === currentQIndex}
                            interactionData={savedInteractions.find(int => int.questao_id === q.id.toString())}
                            isBookmarked={bookmarkedIds.includes(q.id)} onToggleBookmark={() => toggleBookmark(q.id)}
                            /* DUAS LINHAS NOVAS AQUI: */
                            isSelectedForPrint={selectedForPrint.includes(q.id)} 
                            onTogglePrintSelection={() => togglePrintSelection(q.id)}
                            /* ----------------------- */
                            onReportError={setReportModalData} onOpenForum={setForumModalData}
                            onAnswerSubmit={(qId, isCorrect, subject, timeSpent) => {
                              setSolvedHistory(prev => [...prev, { 
                                questionId: qId, correct: isCorrect, subject: subject, timeSpent: timeSpent, date: new Date().toISOString() 
                              }]);
                            }}
                          />
                        </div>
                      )
                    })
                  )
                ) : (
                  <div className="text-center py-20 text-gray-500 font-bold">Nenhuma questão no caderno.</div>
                )}
              </div>
            </div>

            {/* Barra Flutuante de Ferramentas Escura (Contraste Bonito) */}
            {showFloatingBar ? (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-gray-700 text-gray-300 px-6 py-3 rounded-full flex items-center gap-5 shadow-2xl z-50 animate-in slide-in-from-bottom-10">
                <button onClick={() => setShowNotesArea(!showNotesArea)} className={`flex items-center gap-2 font-medium text-sm transition-colors ${showNotesArea ? 'text-blue-400' : 'hover:text-white'}`}>
                  <FileText size={18}/> Anotações
                </button>
                <div className="w-px h-5 bg-gray-600"></div>
                <button onClick={increaseFont} className="hover:text-white font-bold flex items-center text-sm" title="Aumentar Fonte">
                  A<span className="text-xs ml-0.5 mt-1">↑</span>
                </button>
                <button onClick={decreaseFont} className="hover:text-white font-bold flex items-center text-sm" title="Diminuir Fonte">
                  A<span className="text-xs ml-0.5 mt-1">↓</span>
                </button>
                <div className="w-px h-5 bg-gray-600"></div>
                <button onClick={() => setShowFloatingBar(false)} className="hover:text-red-400 transition-colors" title="Fechar barra">
                  <X size={20}/>
                </button>
              </div>
            ) : (
              // Botão de Reabrir a Barra (Pequeno e Discreto)
              <button onClick={() => setShowFloatingBar(true)} className="fixed bottom-6 right-6 bg-[#1e293b] text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 border border-gray-700 animate-in fade-in" title="Reabrir Ferramentas">
                <Settings2 size={24} />
              </button>
            )}

            {/* Modal de Atalhos */}
            {isShortcutsModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsShortcutsModalOpen(false)}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-black text-slate-800 flex items-center"><Keyboard className="mr-3 text-blue-600"/> Atalhos do teclado</h2>
                    <button onClick={() => setIsShortcutsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                  </div>
                  <div className="p-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex gap-4">
                      <Info className="text-emerald-600 shrink-0 mt-0.5" size={20}/>
                      <div>
                        <h4 className="text-emerald-800 font-bold text-sm mb-1">Aumente sua eficiência</h4>
                        <p className="text-emerald-700/80 text-sm leading-relaxed">Configuramos atalhos no teclado para que você possa navegar e responder durante os estudos de forma muito mais rápida.</p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2"><kbd className="bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 font-mono shadow-sm">←</kbd><kbd className="bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 font-mono shadow-sm">→</kbd></div>
                        <span className="text-sm font-medium text-gray-600">Navegue entre as questões (Avançar/Voltar)</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2"><kbd className="bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 font-mono shadow-sm">1 a 5</kbd><span className="text-gray-400 mx-1 text-sm mt-1">ou</span><kbd className="bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 font-mono shadow-sm">A a E</kbd></div>
                        <span className="text-sm font-medium text-gray-600">Selecione uma das alternativas.</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <kbd className="bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 font-mono shadow-sm">ESC</kbd>
                        <span className="text-sm font-medium text-gray-600">Desmarcar alternativa selecionada ou Fechar Modais.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de Lista de Questões */}
            {isListModalOpen && (
              <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-sm bg-white border-l border-gray-200 shadow-2xl flex flex-col animate-in slide-in-from-right-full">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-lg font-black text-slate-800 flex items-center"><ListIcon className="mr-2 text-blue-600" size={20}/> Lista de Questões</h2>
                  <button onClick={() => setIsListModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-full shadow-sm border border-gray-200"><X size={20}/></button>
                </div>
                
                {/* Abas de Navegação (Estilo Azul Oficial e Centralizado) */}
                <div className="flex justify-center items-center px-4 pt-2 pb-4 border-b border-gray-200 gap-4 bg-slate-50">
                  <button 
                    onClick={() => setListTab('grade')} 
                    className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 border ${listTab === 'grade' ? 'bg-[#203b82] text-white border-[#203b82] shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-[#203b82]'}`}
                  >
                    <LayoutGrid size={16}/> Grade
                  </button>
                  <button 
                    onClick={() => setListTab('enunciados')} 
                    className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 border ${listTab === 'enunciados' ? 'bg-[#203b82] text-white border-[#203b82] shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-[#203b82]'}`}
                  >
                    <Type size={16}/> Enunciados
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
                  {listTab === 'grade' ? (
                    <div className="grid grid-cols-5 gap-2.5">
                      {activeQuestions.map((q, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setCurrentQIndex(i); setIsListModalOpen(false); }}
                          className={`aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all ${i === currentQIndex ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 ring-offset-2' : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeQuestions.map((q, i) => (
                        <div 
                          key={i}
                          onClick={() => { setCurrentQIndex(i); setIsListModalOpen(false); }}
                          className={`p-4 rounded-xl cursor-pointer transition-all border shadow-sm ${i === currentQIndex ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                        >
                          <h4 className={`font-black text-sm mb-1 ${i === currentQIndex ? 'text-blue-800' : 'text-slate-700'}`}>Questão {i + 1}</h4>
                          <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">{q.enunciado}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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
                <button onClick={() => setAdvancedFilters(initialAdvancedFilters)} className="px-6 py-3 bg-[#203b82] hover:bg-blue-900 text-white font-bold rounded-xl uppercase text-sm shadow-sm transition-colors">Restaurar</button>
                <button onClick={() => setIsAdvancedModalOpen(false)} className="px-8 py-3 bg-blue-700 text-white rounded-xl font-black shadow-md uppercase text-sm transition-colors">Aplicar</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL GLOBAL: REPORTAR ERRO --- */}
        {reportModalData && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
              
              <div className="bg-slate-50 p-5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center text-[#203b82] font-black text-lg">
                  <AlertTriangle className="mr-3 text-red-500" /> Reportar Problema da Questão
                </div>
                <button onClick={() => setReportModalData(null)} className="p-2 bg-[#203b82] text-white hover:bg-blue-900 rounded-xl transition-colors shadow-sm">
                  <X size={18}/>
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
                    <label key={motivo} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors bg-white group">
                      {/* Escondemos o input original e usamos a classe 'peer' do Tailwind para observar o estado */}
                      <input type="radio" name="errorReason" value={motivo} className="hidden peer" />
                      
                      {/* Nossa bolinha customizada: Fica azul quando o 'peer' (input acima) estiver checado */}
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-[#203b82] peer-checked:bg-[#203b82] mr-3 flex items-center justify-center transition-colors shrink-0">
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      
                      <span className="text-sm font-bold text-gray-700 peer-checked:text-[#203b82] transition-colors">{motivo}</span>
                    </label>
                  ))}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Detalhes (Opcional)</label>
                  <textarea id="erroDetalhes" rows="3" className="w-full bg-slate-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#203b82] outline-none resize-none" placeholder="Explique brevemente..."></textarea>
                </div>
                
                <button 
                  onClick={async () => {
                    const motivo = document.querySelector('input[name="errorReason"]:checked')?.value || 'Não especificado';
                    const detalhes = document.getElementById('erroDetalhes')?.value || '';
                    try {
                      await fetch(`${supabaseUrl}/rest/v1/reportes_erro`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }, body: JSON.stringify({ user_id: userId, questao_id: reportModalData.id.toString(), motivo, detalhes }) });
                      customAlert('Relatório Enviado', 'Relatório enviado para a equipe de moderação! Muito obrigado.');
                    } catch(e) { console.error(e); customAlert('Erro de Conexão', 'Erro ao conectar com o banco de dados.'); }
                    setReportModalData(null); 
                  }} 
                  className="w-full py-3 bg-[#203b82] hover:bg-blue-900 text-white font-black rounded-xl uppercase text-sm tracking-widest shadow-md transition-colors"
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
                {/* Botão de Fechar Azul Padrão */}
                <button onClick={() => setForumModalData(null)} className="p-2 text-white bg-[#203b82] hover:bg-blue-900 rounded-xl transition-colors shadow-sm">
                  <X size={18}/>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50">
                {forumComments && forumComments.length > 0 ? (
                  forumComments.map((cmt, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-in fade-in">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-blue-800 text-sm flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs mr-2 font-black uppercase">
                            {(cmt.user_name || "U").charAt(0)}
                          </div>
                          {cmt.user_name || "Usuário"}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(cmt.criado_em).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{cmt.texto_comentario || cmt.texto}</p>
                      <div className="flex gap-4 border-t border-gray-100 pt-3">
                      {/* NOVO CÓDIGO DO BOTÃO CURTIR ABAIXO */}
                      <button 
                        onClick={() => handleLikeComment(cmt.id, cmt.likes)}
                        className="flex items-center text-xs font-bold text-white bg-[#203b82] hover:bg-blue-900 px-3 py-2 rounded-lg transition-transform active:scale-95 shadow-sm"
                      >
                        <ThumbsUp size={14} className="mr-1.5" style={{ color: 'white' }} /> {cmt.likes || 0} Útil
                      </button>
                    </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <MessageCircle size={40} className="mx-auto mb-4 text-gray-300"/>
                    <p className="font-medium">Nenhum comentário ainda.</p>
                    <p className="text-sm">Seja o primeiro a ajudar a comunidade!</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-400 transition-all bg-gray-50 p-1">
                  <input 
                    type="text" 
                    placeholder="Adicione seu comentário..." 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    className="flex-1 p-3 text-sm outline-none bg-transparent" 
                  />
                  {/* Botão de Enviar Azul Padrão */}
                  <button 
                    onClick={handlePostComment}
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className="p-3 text-white bg-[#203b82] hover:bg-blue-900 rounded-lg font-bold transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isSubmittingComment ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* --- MODAL GLOBAL: CENTRAL DE ANOTAÇÕES SALVAS --- */}
        {isAllNotesModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsAllNotesModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-yellow-50 p-5 border-b border-yellow-100 flex items-center justify-between shrink-0">
                <div className="flex items-center text-yellow-800 font-black text-lg">
                  <FileText className="mr-3" /> Minhas Anotações Salvas
                </div>
                <button onClick={() => setIsAllNotesModalOpen(false)} className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 p-1.5 rounded-full transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50">
                {savedInteractions.filter(i => i.nota && i.nota.trim() !== '').length > 0 ? (
                  savedInteractions.filter(i => i.nota && i.nota.trim() !== '').map((item, idx) => {
                    const questaoRef = questionsBank.find(q => q.id.toString() === item.questao_id);
                    
                    const handleClickIrParaQuestao = () => {
                      if (questaoRef) {
                        // Passa a questão e a nota para a tela exclusiva de revisão
                        setNoteReviewQuestion({ ...questaoRef, notaSalva: item.nota });
                        setIsAllNotesModalOpen(false); // Fecha o painel da central
                      } else {
                        customAlert('Questão Indisponível', 'A questão correspondente não foi encontrada no banco de dados atual.');
                      }
                    };

                    const handleExcluirNotaCentral = async (e) => {
                      e.stopPropagation(); // Evita navegar ao clicar na lixeira
                      if (!window.confirm('Excluir esta anotação permanentemente?')) return;
                      try {
                        await fetch(`${supabaseUrl}/rest/v1/interacoes_usuario`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'resolution=merge-duplicates' }, body: JSON.stringify({ user_id: userId, questao_id: item.questao_id, avaliacao: item.avaliacao || 0, nota: '' }) });
                        setSavedInteractions(prev => prev.map(int => int.questao_id === item.questao_id ? { ...int, nota: '' } : int));
                      } catch (err) { console.error(err); }
                    };

                    return (
                      <div key={idx} onClick={handleClickIrParaQuestao} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group relative">
                        <button onClick={handleExcluirNotaCentral} className="absolute top-4 right-4 p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all" title="Excluir Anotação">
                          <XCircle size={18} />
                        </button>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded">ID: {item.questao_id}</div>
                          <div className="text-xs text-gray-500">{questaoRef?.assunto || 'Assunto não especificado'}</div>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 italic border-l-2 border-gray-200 pl-3">
                          "{questaoRef?.enunciado || 'Enunciado da questão não encontrado no banco atual.'}"
                        </p>
                        <div className="bg-yellow-50/70 border border-yellow-200 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap font-medium">
                          {item.nota}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4"><FileText size={32} className="text-gray-400" /></div>
                    <h3 className="text-lg font-bold text-gray-700">Nenhuma anotação encontrada</h3>
                    <p className="text-gray-500 text-sm mt-1">Quando você salvar uma anotação, ela aparecerá aqui.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL NOVO: RESUMO DA SESSÃO (TIMER BONITO) --- */}
        {sessionSummary && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center">
              <div className="bg-[#203b82] p-8 text-white relative">
                <button onClick={() => setSessionSummary(null)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20}/></button>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/10">
                  <Clock size={36} className="text-white" />
                </div>
                <h2 className="text-2xl font-black mb-1">Sessão Pausada</h2>
                <p className="text-blue-200 text-sm">Seu progresso foi salvo na memória.</p>
              </div>
              <div className="p-8 space-y-4">
                <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Tempo de foco</span>
                  <span className="text-2xl font-black text-[#203b82]">{sessionSummary.time}</span>
                </div>
                <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Parou na Questão</span>
                  <span className="text-2xl font-black text-[#203b82]">{sessionSummary.q}</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button onClick={() => { setSessionSummary(null); setCurrentView('filters'); }} className="w-full py-4 bg-[#203b82] hover:bg-blue-900 text-white font-black rounded-xl uppercase text-sm tracking-widest shadow-lg transition-transform hover:scale-105">
                  Ir para o Painel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL NOVO: SESSÃO EXCLUSIVA DE LEITURA DE ANOTAÇÕES --- */}
        {noteReviewQuestion && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in" onClick={() => setNoteReviewQuestion(null)}>
            <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-yellow-50 p-4 sm:p-6 border-b border-yellow-200 flex items-center justify-between shrink-0">
                <div className="flex items-center text-yellow-800 font-black text-lg">
                  <FileText className="mr-3" /> Sessão de Revisão da Anotação
                </div>
                <button onClick={() => setNoteReviewQuestion(null)} className="p-2 bg-yellow-200/50 text-yellow-800 hover:bg-yellow-300 rounded-xl transition-colors">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                {/* Visualização limpa da questão */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-6 pointer-events-none">
                  <div className="flex justify-between items-center mb-8">
                    <div className="bg-[#203b82] text-white text-xs font-black px-3 py-1.5 rounded-md uppercase">ID: {noteReviewQuestion.id}</div>
                    <div className="text-blue-600 font-bold text-sm sm:text-base">{noteReviewQuestion.assunto}</div>
                  </div>
                  <div className="text-gray-800 leading-[1.8] font-serif text-justify text-base sm:text-lg mb-8">
                    {noteReviewQuestion.enunciado}
                  </div>
                  <div className="space-y-3 opacity-80">
                    {(Array.isArray(noteReviewQuestion.alternativas) ? noteReviewQuestion.alternativas : []).map((alt, idx) => (
                      <div key={idx} className={`flex items-start p-4 rounded-xl border ${idx === noteReviewQuestion.gabarito ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold mr-4 shrink-0 ${idx === noteReviewQuestion.gabarito ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 text-gray-500 bg-white'}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-gray-700 font-medium pt-1 flex-1 text-sm sm:text-base ${idx === noteReviewQuestion.gabarito ? 'text-emerald-900 font-bold' : ''}`}>{alt}</span>
                        {idx === noteReviewQuestion.gabarito && <CheckCircle2 className="text-emerald-500 ml-2 shrink-0" size={24} />}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Visualização da Anotação */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 sm:p-8 shadow-sm relative">
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-yellow-400 text-yellow-900 font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest shadow-sm">
                    Sua Anotação
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap font-medium text-base leading-relaxed mt-2">
                    {noteReviewQuestion.savedNote}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- NOVA TELA DEDICADA: REVISÃO DA QUESTÃO E ANOTAÇÃO --- */}
        {noteReviewQuestion && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setNoteReviewQuestion(null)}>
            <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              
              {/* Cabeçalho Amarelo Exclusivo para Leitura */}
              <div className="bg-yellow-50 p-5 border-b border-yellow-200 flex items-center justify-between shrink-0">
                <div className="flex items-center text-yellow-800 font-black text-lg">
                  <FileText className="mr-3" /> Modo Revisão de Anotação
                </div>
                <button onClick={() => setNoteReviewQuestion(null)} className="p-2 bg-yellow-200/50 text-yellow-800 hover:bg-yellow-300 rounded-xl transition-colors">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
                {/* Visualização Bloqueada da Questão (Sem eventos de clique, mostrando o Gabarito) */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-6 pointer-events-none">
                  <div className="flex justify-between items-center mb-6">
                    <div className="bg-[#203b82] text-white text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider">ID: {noteReviewQuestion.id}</div>
                    <div className="text-blue-600 font-bold text-sm">{noteReviewQuestion.assunto}</div>
                  </div>
                  <div className="text-gray-800 leading-[1.8] font-serif text-justify text-base mb-8">
                    {noteReviewQuestion.enunciado}
                  </div>
                  <div className="space-y-3 opacity-90">
                    {(Array.isArray(noteReviewQuestion.alternativas) ? noteReviewQuestion.alternativas : []).map((alt, idx) => (
                      <div key={idx} className={`flex items-start p-4 rounded-xl border ${idx === noteReviewQuestion.gabarito ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold mr-4 shrink-0 ${idx === noteReviewQuestion.gabarito ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 text-gray-500 bg-white'}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-gray-700 font-medium pt-1 flex-1 text-sm sm:text-base ${idx === noteReviewQuestion.gabarito ? 'text-emerald-900 font-bold' : ''}`}>{alt}</span>
                        {idx === noteReviewQuestion.gabarito && <CheckCircle2 className="text-emerald-500 ml-2 shrink-0" size={24} />}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Destaque da Anotação Salva do Usuário */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 sm:p-8 shadow-sm relative">
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-yellow-400 text-yellow-900 font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest shadow-sm">
                    Sua Anotação
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap font-medium text-base leading-relaxed mt-3">
                    {noteReviewQuestion.notaSalva}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL GLOBAL: SALVAR CADERNO COM NOME E RESUMO --- */}
        {isSaveListModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsSaveListModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              
              <div className="bg-blue-50 p-5 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center text-[#203b82] font-black text-lg">
                  <Save className="mr-3 text-blue-500" /> Guardar Caderno
                </div>
                <button onClick={() => setIsSaveListModalOpen(false)} className="p-2 bg-[#203b82] text-white hover:bg-blue-900 rounded-xl transition-colors shadow-sm">
                  <X size={18}/>
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome do Caderno</label>
                  <input 
                    type="text"
                    value={customListName}
                    onChange={e => setCustomListName(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#203b82] outline-none" 
                    placeholder="Ex: Revisão Reta Final Cirurgia 2024..."
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Resumo do Filtro Atual</h4>
                  <ul className="space-y-2 text-sm text-gray-700 font-medium">
                    <li className="flex justify-between border-b border-gray-200 pb-2"><span>Questões Encontradas:</span> <span className="text-blue-700 font-black">{stats.total}</span></li>
                    <li className="flex justify-between border-b border-gray-200 pb-2"><span>Limite para Estudo:</span> <span className="text-blue-700 font-black">{Math.min(parseInt(solveCountInput) || stats.total, 1000)}</span></li>
                    <li className="flex justify-between"><span>Data de Criação:</span> <span className="text-gray-500">{new Date().toLocaleDateString('pt-BR')}</span></li>
                  </ul>
                </div>
                
                <button 
                  onClick={handleSaveList} 
                  disabled={saveListStatus === 'saving' || !customListName.trim()}
                  className="w-full py-3 bg-[#203b82] hover:bg-blue-900 text-white font-black rounded-xl uppercase text-sm tracking-widest shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveListStatus === 'saving' ? 'Salvando...' : 'Salvar Caderno'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL GLOBAL: MEUS CADERNOS SALVOS --- */}
        {isSavedListsModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsSavedListsModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-blue-50 p-5 border-b border-blue-100 flex items-center justify-between shrink-0">
                <div className="flex items-center text-[#203b82] font-black text-lg">
                  <BookMarked className="mr-3" /> Meus Cadernos
                </div>
                <button onClick={() => setIsSavedListsModalOpen(false)} className="text-blue-600 hover:text-blue-900 bg-blue-100 p-1.5 rounded-full transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50">
                {isLoadingLists ? (
                  <div className="text-center py-10"><div className="w-8 h-8 border-4 border-blue-200 border-t-[#203b82] rounded-full animate-spin mx-auto"></div></div>
                ) : savedLists.length > 0 ? (
                  savedLists.map((list) => (
                    <div key={list.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group flex flex-col sm:flex-row justify-between gap-4 items-center">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-black text-gray-800 text-lg">{list.nome}</h3>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-gray-200">
                            {new Date(list.criado_em).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                          <span className="flex items-center"><Target size={14} className="mr-1 text-blue-500"/> {list.filtros?.quantidadeLimite || 'Todas'} questões alvo</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 mt-2 sm:mt-0">
                        <button onClick={() => handleRenameSavedList(list.id, list.nome)} className="p-2 bg-[#203b82] text-white hover:bg-blue-900 rounded-xl transition-colors shadow-sm" title="Renomear Caderno">
                          <Type size={18} />
                        </button>
                        <button onClick={() => handleDeleteSavedList(list.id)} className="p-2 bg-[#203b82] text-white hover:bg-blue-900 rounded-xl transition-colors shadow-sm" title="Excluir Caderno">
                          <XCircle size={18} />
                        </button>
                        <button onClick={() => handleLoadSavedList(list)} className="flex-1 sm:flex-none px-4 py-2 bg-[#203b82] text-white font-bold rounded-xl hover:bg-blue-900 shadow-sm transition-colors flex items-center justify-center">
                          <MonitorPlay size={16} className="mr-2"/> Carregar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 p-4 rounded-full mb-4"><BookMarked size={32} className="text-gray-400" /></div>
                    <h3 className="text-lg font-bold text-gray-700">Você ainda não tem cadernos salvos.</h3>
                    <p className="text-gray-500 text-sm mt-1">Crie um filtro no painel e clique em "Guardar Caderno".</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DE ALERTA GLOBAL DO SISTEMA --- */}
        <ModalAlerta
          isOpen={alertConfig.isOpen}
          onClose={closeCustomAlert}
          titulo={alertConfig.titulo}
        >
          {/* whitespace-pre-wrap permite que os \n nas mensagens quebrem linha visualmente */}
          <p className="whitespace-pre-wrap">{alertConfig.mensagem}</p>
        </ModalAlerta>

      </main>
    </div>
  );
}