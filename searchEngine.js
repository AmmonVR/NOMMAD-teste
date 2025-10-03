// Search + Geo Filter Engine (no module bundler needed)
(function(){
  // Stopwords comuns em PT-BR para evitar matches irrelevantes (ex.: "de", "da", "do")
  const STOPWORDS = new Set([
    'a','o','os','as','um','uma','uns','umas',
    'de','da','do','das','dos','d','d\'','d’',
    'e','ou','com','sem','por','para','pra','pro','per',
    'no','na','nos','nas','em','num','numa','nuns','numas',
    'ao','aos','à','às','que','se','sobre','até','após','entre','contra'
  ]);

  const isStopword = (t) => !t || STOPWORDS.has(t);
  // Objeto global para armazenar dados carregados e indexados
  const SEARCH_DATA = {
    professionals: [], // Lista de profissionais
    index: new Map(),  // Índice invertido: token -> Set de IDs de profissionais
    synonyms: {},      // Dicionário de sinônimos
    loaded: false      // Flag para evitar recarregamento
  };

  // Função para normalizar strings: minúsculas, sem acentos, sem caracteres especiais
  function normalize(str){
    return String(str||'')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9çãõáéíóúâêôàü\s]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }

  // Carrega os dados dos profissionais e sinônimos dos arquivos JSON
  async function loadData(){
    if (SEARCH_DATA.loaded) return;
    const [pros, syns] = await Promise.all([
      fetch('./data/professionals.json').then(r=>r.json()), // Profissionais
      fetch('./data/synonyms.json').then(r=>r.json()).catch(()=> ({})) // Sinônimos (opcional)
    ]);
    SEARCH_DATA.professionals = pros;
    SEARCH_DATA.synonyms = syns;
    buildIndex(pros); // Monta o índice invertido
    SEARCH_DATA.loaded = true;
  }

  // Monta o índice invertido: para cada token, associa os IDs dos profissionais que o possuem
  function buildIndex(list){
    list.forEach(p => {
      const tokens = new Set();
      // Indexa palavras-chave
      (p.keywords||[]).forEach(k => normalize(k).split(' ').forEach(t=> { if (t && !isStopword(t)) tokens.add(t); }));
      // Indexa categoria
      normalize(p.categoria).split(' ').forEach(t=> { if (t && !isStopword(t)) tokens.add(t); });
      // Indexa nome
      normalize(p.nome).split(' ').forEach(t=> { if (t && !isStopword(t)) tokens.add(t); });
      // Para cada token, adiciona o ID do profissional ao índice
      tokens.forEach(tok => {
        if (!SEARCH_DATA.index.has(tok)) SEARCH_DATA.index.set(tok, new Set());
        SEARCH_DATA.index.get(tok).add(p.id);
      });
    });
  }

  // Expande tokens usando sinônimos (se existirem)
  function expandTokens(raw){
    const out = new Set();
    raw.forEach(t => {
      out.add(t); // Adiciona o próprio token
      const syns = SEARCH_DATA.synonyms[t];
      if (syns) syns.forEach(s => out.add(normalize(s))); // Adiciona sinônimos normalizados
    });
    return Array.from(out);
  }

  // Calcula score dos candidatos: mais tokens em comum = score maior
  function scoreCandidates(candidateIds, tokens){
    const scores = new Map();
    candidateIds.forEach(id => scores.set(id, 0));
    tokens.forEach(t => {
      const set = SEARCH_DATA.index.get(t);
      if (!set) return;
      set.forEach(id => scores.set(id, (scores.get(id)||0) + 1));
    });
    // Ordena por score decrescente e retorna os profissionais
    return Array.from(scores.entries())
      .sort((a,b)=> b[1]-a[1])
      .map(([id]) => SEARCH_DATA.professionals.find(p=>p.id===id));
  }

  // Calcula a distância entre dois pontos geográficos (fórmula de Haversine)
  function haversine(lat1,lng1,lat2,lng2){
    const R = 6371; // km
    const toRad = d => d * Math.PI/180;
    const dLat = toRad(lat2-lat1);
    const dLng = toRad(lng2-lng1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Filtra lista de profissionais por distância geográfica (raio em km)
  function geoFilter(list, center, radiusKm){
    if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng) || !radiusKm) return list;
    return list
      .map(p => {
        if (!p.localizacao) return null;
        const d = haversine(center.lat, center.lng, p.localizacao.lat, p.localizacao.lng);
        return {p, d};
      })
      .filter(x => x && x.d <= radiusKm) // Só dentro do raio
      .sort((a,b)=> a.d - b.d) // Mais próximos primeiro
      .map(x => ({ ...x.p, distanciaKm: x.d })); // Adiciona campo de distância
  }

  /**
   * Busca profissionais por texto e/ou localização
   * @param {string} query - Texto de busca
   * @param {object|null} geoCenter - {lat, lng} centro do raio
   * @param {number|null} geoRadiusKm - raio em km
   * @returns {Promise<Array>} lista de profissionais encontrados
   */
  async function searchProfessionals(query, geoCenter=null, geoRadiusKm=null){
    await loadData(); // Garante que os dados estão carregados
    const q = normalize(query||'');
    if (!q){
      // Se não há query mas há geo, retorna só geofiltrados rankeados por distância
      if (geoCenter && geoRadiusKm){
        return geoFilter(SEARCH_DATA.professionals, geoCenter, geoRadiusKm);
      }
      return [];
    }
    // Remove stopwords dos tokens da consulta
    const baseTokens = q.split(' ').filter(Boolean).filter(t => !isStopword(t));
    let tokens = expandTokens(baseTokens).filter(t => !isStopword(t));

    // Se a consulta tem apenas stopwords, evita resultados aleatórios
    if (tokens.length === 0){
      if (geoCenter && geoRadiusKm){
        return geoFilter(SEARCH_DATA.professionals, geoCenter, geoRadiusKm);
      }
      return [];
    }

    // Busca candidatos pelo índice
    const candidateIds = new Set();
    tokens.forEach(t => {
      const set = SEARCH_DATA.index.get(t);
      if (set) set.forEach(id => candidateIds.add(id));
    });

    // Se nenhum candidato direto, faz busca mais flexível (fuzzy)
    if (candidateIds.size === 0){
      SEARCH_DATA.professionals.forEach(p => {
        const blob = normalize(p.nome+' '+p.categoria+' '+(p.keywords||[]).join(' '));
        // Busca flexível somente com tokens não-stopwords
        if (tokens.some(t => blob.includes(t))) candidateIds.add(p.id);
      });
    }

    // Rankeia candidatos por score de tokens
    let ranked = scoreCandidates(candidateIds, tokens);
    if (geoCenter && geoRadiusKm){
      // Aplica filtro geográfico e ordena por proximidade
      const filtered = geoFilter(ranked, geoCenter, geoRadiusKm);
      return filtered;
    }
    return ranked;
  }

  // Expondo funções principais no escopo global para uso externo
  window.__searchEngine = { searchProfessionals, loadData };
})();
