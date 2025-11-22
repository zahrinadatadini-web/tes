// Persists editable fields, images, sosmed links and audio to localStorage.
// Keys used in localStorage:
// fullName, instansi, mataPelajaran, profilePhoto, headerBg, pengalamanOrganisasiProfesi,
// kegiatanPendampingan, kumpulanKarya, prestasiPenghargaan, tentang, sosmed (JSON), profileAudio
document.addEventListener('DOMContentLoaded', () => {
  const ls = window.localStorage;

  // Tabs
  const tabs = Array.from(document.querySelectorAll('.tab'));
  function activate(target, tabEl){
    tabs.forEach(t=>t.classList.remove('active'));
    tabEl && tabEl.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p=>{
      if(p.id===target){ p.classList.remove('hidden'); p.setAttribute('aria-hidden','false')}
      else { p.classList.add('hidden'); p.setAttribute('aria-hidden','true')}
    });
  }
  tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.target, tab)));
  const initialHash = (location.hash || '#beranda').replace('#','');
  const initialTab = tabs.find(t=>t.dataset.target===initialHash) || tabs[0];
  activate(initialTab.dataset.target, initialTab);

  // Utility: read file as dataURL
  function readFileAsDataURL(file){ return new Promise((res,rej)=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.onerror=rej; fr.readAsDataURL(file); })}

  // Load profile basics
  function loadProfile(){
    const fullName = ls.getItem('fullName'); if(fullName) document.getElementById('full-name').textContent = fullName;
    const inst = ls.getItem('instansi'); if(inst) document.getElementById('instansi').textContent = inst;
    const mata = ls.getItem('mataPelajaran'); if(mata) document.getElementById('mata-pelajaran').textContent = mata;
    const photo = ls.getItem('profilePhoto'); if(photo) document.getElementById('profile-photo').src = photo;
    // load editable sections text
    const keys = [
      {key:'kegiatanPengembanganDiri', sel:'#kegiatan-pengembangan-diri .editable'},
      {key:'pengalamanOrganisasiProfesi', sel:'#pengalaman-organisasi-profesi .editable'},
      {key:'kegiatanPendampingan', sel:'#kegiatan-pendampingan .editable'},
      {key:'kumpulanKarya', sel:'#kumpulan-karya .editable'},
      {key:'prestasiPenghargaan', sel:'#prestasi-penghargaan .editable'},
      {key:'tentang', sel:'#tentang .editable'}
    ];
    keys.forEach(k=>{
      const v = ls.getItem(k.key);
      if(v && document.querySelector(k.sel)) document.querySelector(k.sel).innerHTML = v;
    });
    // load slider images
    loadSliderState('pengalamanFotos','#pengalaman-organisasi-profesi');
    loadSliderState('pendampinganFotos','#kegiatan-pendampingan');
    // load youtube karya
    const yt = ls.getItem('karyaYouTube');
    if(yt) setKaryaYoutube(yt);
    // load sosmed
    const sos = ls.getItem('sosmed');
    if(sos){
      try{
        const o = JSON.parse(sos);
        if(o.youtube && document.getElementById('link-youtube')) { document.getElementById('link-youtube').href = o.youtube }
      }catch(e){}
    }
  }

  // Save text fields
  document.getElementById('full-name').addEventListener('input', e=> ls.setItem('fullName', e.target.textContent.trim()));
  document.getElementById('instansi').addEventListener('input', e=> ls.setItem('instansi', e.target.textContent.trim()));
  document.getElementById('mata-pelajaran').addEventListener('input', e=> ls.setItem('mataPelajaran', e.target.textContent.trim()));

  // Save editable sections autosave
  const editableSections = Array.from(document.querySelectorAll('.editable'));
  editableSections.forEach(el=>{
    const key = el.dataset.key;
    if(!key) return;
    el.addEventListener('input', () => {
      ls.setItem(key, el.innerHTML);
    });
  });

  // Profile photo/background handlers (kept basic)
  const photoFile = document.getElementById('photo-file');
  photoFile.addEventListener('change', async (e)=>{
    const f = e.target.files && e.target.files[0]; if(!f) return;
    const data = await readFileAsDataURL(f);
    document.getElementById('profile-photo').src = data;
    ls.setItem('profilePhoto', data);
  });

  // --- SLIDER LOGIC ---
  // each slider identified by localStorage key, and has container selector
  function loadSliderState(storageKey, containerSelector){
    const el = document.querySelector(`${containerSelector} .slider-wrap`);
    if(!el) return;
    const imgs = JSON.parse(ls.getItem(storageKey) || '[]');
    setupSlider(el, imgs, storageKey);
  }

  function setupSlider(wrapper, imagesArray, storageKey){
    // wrapper contains .slider .slider-photo, prev/next buttons, file input and counter
    const sliderPhoto = wrapper.querySelector('.slider-photo');
    const prevBtn = wrapper.querySelector('.slider-btn.prev');
    const nextBtn = wrapper.querySelector('.slider-btn.next');
    const counter = wrapper.querySelector('.slider-counter');
    const fileInput = wrapper.querySelector('input[type="file"]');
    // state
    let idx = 0;
    let imgs = Array.isArray(imagesArray) ? imagesArray : [];
    function refresh(){
      if(imgs.length === 0){
        sliderPhoto.src = '';
        sliderPhoto.alt = 'Belum ada foto';
        counter.textContent = 'Belum ada foto. Tambah foto untuk menampilkan.';
        wrapper.querySelector('.slider-frame').classList.add('empty');
      } else {
        sliderPhoto.src = imgs[idx];
        sliderPhoto.alt = `Foto ${idx+1} dari ${imgs.length}`;
        counter.textContent = `${idx+1} / ${imgs.length}`;
        wrapper.querySelector('.slider-frame').classList.remove('empty');
      }
    }
    // navigation
    prevBtn.addEventListener('click', ()=>{ if(imgs.length===0) return; idx = (idx-1+imgs.length)%imgs.length; refresh()});
    nextBtn.addEventListener('click', ()=>{ if(imgs.length===0) return; idx = (idx+1)%imgs.length; refresh()});
    // add files
    fileInput && fileInput.addEventListener('change', async (e)=>{
      const files = Array.from(e.target.files || []);
      for(const f of files){
        try{
          const data = await readFileAsDataURL(f);
          imgs.push(data);
        }catch(err){ console.error('Baca file gagal', err) }
      }
      ls.setItem(storageKey, JSON.stringify(imgs));
      idx = imgs.length - 1; // show last added
      refresh();
      // clear input so same file can be reselected if needed
      fileInput.value = '';
    });
    // initial set
    refresh();
    // expose a small API in DOM for external use if necessary
    wrapper._sliderState = {imgs, refresh};
  }

  // find slider wrappers and initialize empty ones too
  document.querySelectorAll('.slider-wrap').forEach(wrap=>{
    const key = wrap.dataset.key;
    const stored = JSON.parse(ls.getItem(key) || '[]');
    setupSlider(wrap, stored, key);
  });

  // --- KUMPULAN KARYA YOUTUBE THUMBNAIL ---
  function getYouTubeID(url){
    if(!url) return null;
    try{
      const u = new URL(url);
      if(u.hostname.includes('youtu.be')){
        return u.pathname.slice(1);
      }
      if(u.hostname.includes('youtube.com')){
        return u.searchParams.get('v');
      }
    }catch(e){
      // maybe raw id?
    }
    // fallback: try regex
    const m = url.match(/([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function getYouTubeThumbUrl(id){
    if(!id) return null;
    // try high-res first (maxresdefault), fall back to hqdefault in case not available
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  function setKaryaYoutube(url){
    const id = getYouTubeID(url);
    if(!id) return;
    const thumbUrl = getYouTubeThumbUrl(id);
    const img = document.getElementById('karya-youtube-img');
    const container = document.getElementById('karya-youtube-thumb');
    const anchor = document.getElementById('karya-youtube-link');
    // set link to watch
    anchor.href = `https://www.youtube.com/watch?v=${id}`;
    // attempt to load maxres thumbnail; if fails, fallback to hqdefault
    img.src = thumbUrl;
    img.onerror = () => { img.onerror = null; img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; };
    container.classList.remove('hidden');
    // persist
    ls.setItem('karyaYouTube', url);
  }

  document.getElementById('save-karya-youtube').addEventListener('click', ()=>{
    const url = document.getElementById('karya-youtube-url').value.trim();
    if(!url) return alert('Masukkan URL YouTube terlebih dahulu.');
    setKaryaYoutube(url);
  });

  // --- SOSMED editor (simple) ---
  const editSosBtn = document.getElementById('edit-sosmed');
  const sosForm = document.getElementById('sosmed-form');
  editSosBtn && editSosBtn.addEventListener('click', ()=> sosForm.classList.toggle('hidden'));

  document.getElementById('save-sosmed').addEventListener('click', ()=>{
    const o = {
      youtube: document.getElementById('in-youtube').value.trim(),
      tiktok: document.getElementById('in-tiktok').value.trim(),
      instagram: document.getElementById('in-ig').value.trim(),
      email: document.getElementById('in-email').value.trim()
    };
    ls.setItem('sosmed', JSON.stringify(o));
    if(o.youtube) document.getElementById('link-youtube').href = o.youtube;
    sosForm.classList.add('hidden');
  });
  document.getElementById('cancel-sosmed').addEventListener('click', ()=> sosForm.classList.add('hidden'));

  // --- Audio controls (basic) ---
  const audioFile = document.getElementById('audio-file');
  const audioEl = document.getElementById('profile-audio');
  audioFile.addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; if(!f) return;
    const data = await readFileAsDataURL(f);
    const src = data;
    // set source element
    const sourceEl = document.getElementById('audio-source');
    if(sourceEl) sourceEl.src = src;
    audioEl.load();
    ls.setItem('profileAudio', src);
  });
  document.getElementById('audio-reset').addEventListener('click', ()=>{
    ls.removeItem('profileAudio');
    // fallback to original file source (song.mp3)
    const sourceEl = document.getElementById('audio-source');
    if(sourceEl) sourceEl.src = 'song.mp3';
    audioEl.load();
  });

  // Header reset
  document.getElementById('reset-header').addEventListener('click', ()=>{
    ls.removeItem('profilePhoto');
    document.getElementById('profile-photo').src = 'avatar.svg';
  });

  // initialize
  loadProfile();
});
