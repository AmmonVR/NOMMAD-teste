// Search + Geo Filter Engine (no module bundler needed)
(function(){
  const SEARCH_DATA = {
    professionals: [],
    index: new Map(),
    synonyms: {},
    loaded: false
  };

  function normalize(str){
    return String(str||'')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9çãõáéíóúâêôàü\s]/g,' ')
  .replace(/\s+/g,' ')
  .trim();
  }

  async function loadData(){
    if (SEARCH_DATA.loaded) return;
    const [pros, syns] = await Promise.all([
      fetch('./data/professionals.json').then(r=>r.json()),
      fetch('./data/synonyms.json').then(r=>r.json()).catch(()=> ({}))
    ]);
    SEARCH_DATA.professionals = pros;
    SEARCH_DATA.synonyms = syns;
    buildIndex(pros);
    SEARCH_DATA.loaded = true;
  }

  function buildIndex(list){
    list.forEach(p => {
      const tokens = new Set();
      (p.keywords||[]).forEach(k => normalize(k).split(' ').forEach(t=> t && tokens.add(t)));
      normalize(p.categoria).split(' ').forEach(t=> t && tokens.add(t));
      normalize(p.nome).split(' ').forEach(t=> t && tokens.add(t));
      tokens.forEach(tok => {
        if (!SEARCH_DATA.index.has(tok)) SEARCH_DATA.index.set(tok, new Set());
        SEARCH_DATA.index.get(tok).add(p.id);
      });
    });
  }

  function expandTokens(raw){
    const out = new Set();
    raw.forEach(t => {
      out.add(t);
      const syns = SEARCH_DATA.synonyms[t];
      if (syns) syns.forEach(s => out.add(normalize(s)));
    });
    return Array.from(out);
  }

  function scoreCandidates(candidateIds, tokens){
    const scores = new Map();
    candidateIds.forEach(id => scores.set(id, 0));
    tokens.forEach(t => {
      const set = SEARCH_DATA.index.get(t);
      if (!set) return;
      set.forEach(id => scores.set(id, (scores.get(id)||0) + 1));
    });
    return Array.from(scores.entries())
      .sort((a,b)=> b[1]-a[1])
      .map(([id]) => SEARCH_DATA.professionals.find(p=>p.id===id));
  }

  function haversine(lat1,lng1,lat2,lng2){
    const R = 6371; // km
    const toRad = d => d * Math.PI/180;
    const dLat = toRad(lat2-lat1);
    const dLng = toRad(lng2-lng1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function geoFilter(list, center, radiusKm){
    if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng) || !radiusKm) return list;
    return list
      .map(p => {
        if (!p.localizacao) return null;
        const d = haversine(center.lat, center.lng, p.localizacao.lat, p.localizacao.lng);
        return {p, d};
      })
      .filter(x => x && x.d <= radiusKm)
      .sort((a,b)=> a.d - b.d)
      .map(x => ({ ...x.p, distanciaKm: x.d }));
  }

  async function searchProfessionals(query, geoCenter=null, geoRadiusKm=null){
    await loadData();
    const q = normalize(query||'');
    if (!q){
      // se não há query mas há geo, retorna só geofiltrados rankeados por distância
      if (geoCenter && geoRadiusKm){
        return geoFilter(SEARCH_DATA.professionals, geoCenter, geoRadiusKm);
      }
      return [];
    }
    const baseTokens = q.split(' ').filter(Boolean);
    const tokens = expandTokens(baseTokens);

    const candidateIds = new Set();
    tokens.forEach(t => {
      const set = SEARCH_DATA.index.get(t);
      if (set) set.forEach(id => candidateIds.add(id));
    });

    if (candidateIds.size === 0){
      SEARCH_DATA.professionals.forEach(p => {
        const blob = normalize(p.nome+' '+p.categoria+' '+(p.keywords||[]).join(' '));
        if (tokens.some(t => blob.includes(t))) candidateIds.add(p.id);
      });
    }

    let ranked = scoreCandidates(candidateIds, tokens);
    if (geoCenter && geoRadiusKm){
      // Aplica distância e mantém ordem ajustando (prioridade: dentro do raio e score + proximidade)
      const filtered = geoFilter(ranked, geoCenter, geoRadiusKm);
      return filtered;
    }
    return ranked;
  }

  // Expondo global
  window.__searchEngine = { searchProfessionals, loadData };
})();
