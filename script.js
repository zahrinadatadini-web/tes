// Persists editable fields, images, sosmed links and images to localStorage.
// Keys used in localStorage:
// fullName, instansi, mataPelajaran, profilePhoto, headerBg, pengalamanOrganisasiProfesi,
// kegiatanPendampingan, kumpulanKarya, prestasiPenghargaan, tentang, sosmed (JSON)
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

  // RENDER SOSMED LIST
  function renderSosmedList(sos){
    const container = document.getElementById('sosmed-list');
    container.innerHTML = '';
    if(!sos) sos = {};
    const items = [];
    if(sos.youtube) items.push({key:'youtube',label:'YouTube',href: sos.youtube,svg: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#FF0000" d="M23.5 6.2a3 3 0 00-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8z"></path><path fill="#fff" d="M10 15.5l5.5-3.5L10 8.5v7z"></path></svg>`});
    if(sos.tiktok) items.push({key:'tiktok',label:'TikTok',href: sos.tiktok,svg: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#000" d="M9 3v10.2A4.8 4.8 0 1014.8 9V6h3.2A6 6 0 0110 3z"></path></svg>`});
    if(sos.instagram) items.push({key:'instagram',label:'Instagram',href: sos.instagram,svg: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#E1306C" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zM18.5 6a1 1 0 11-1 1 1 1 0 011-1z"></path></svg>`});
    if(sos.email) items.push({key:'email',label:sos.email,href: `mailto:${sos.email}`,svg: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#0b5fa8" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`});
    if(items.length === 0){const li = document.createElement('li');li.className = 'sosmed-empty';li.textContent = 'Belum ada tautan sosial media. Klik "Edit Sosmed" untuk menambah.';container.appendChild(li);return}
    items.forEach(it => {const a = document.createElement('a');a.className = 'sosmed-item';a.href = it.href || '#';a.target = '_blank';a.rel = 'noopener';a.innerHTML = `${it.svg}<span class="sosmed-label">${it.label}</span>`;container.appendChild(a);});
  }

  // Load profile basics
  function loadProfile(){
    const fullName = ls.getItem('fullName'); if(fullName) document.getElementById('full-name').textContent = fullName;
    const inst = ls.getItem('instansi'); if(inst) document.getElementById('instansi').textContent = inst;
    const mata = ls.getItem('mataPelajaran'); if(mata) document.getElementById('mata-pelajaran').textContent = mata;
    const photo = ls.getItem('profilePhoto'); if(photo) document.getElementById('profile-photo').src = photo;
    const keys = [{key:'kegiatanPengembanganDiri', sel:'#kegiatan-pengembangan-diri .editable'},{key:'pengalamanOrganisasiProfesi', sel:'#pengalaman-organisasi-profesi .editable'},{key:'kegiatanPendampingan', sel:'#kegiatan-pendampingan .editable'},{key:'kumpulanKarya', sel:'#kumpulan-karya .editable'},{key:'prestasiPenghargaan', sel:'#prestasi-penghargaan .editable'},{key:'tentang', sel:'#tentang .editable'}];
    keys.forEach(k=>{const v = ls.getItem(k.key); if(v && document.querySelector(k.sel)) document.querySelector(k.sel).innerHTML = v;});
    loadSliderState && loadSliderState('pengalamanFotos','#pengalaman-organisasi-profesi');
    loadSliderState && loadSliderState('pendampinganFotos','#kegiatan-pendampingan');
    const sos = JSON.parse(ls.getItem('sosmed') || '{}');
    if(sos.youtube) document.getElementById('in-youtube').value = sos.youtube;
    if(sos.tiktok) document.getElementById('in-tiktok').value = sos.tiktok;
    if(sos.instagram) document.getElementById('in-ig').value = sos.instagram;
    if(sos.email) document.getElementById('in-email').value = sos.email;
    renderSosmedList(sos);
    const yt = ls.getItem('karyaYouTube'); if(yt) setKaryaYoutube && setKaryaYoutube(yt);
  }

  // Save text fields
  document.getElementById('full-name').addEventListener('input', e=> ls.setItem('fullName', e.target.textContent.trim()));
  document.getElementById('instansi').addEventListener('input', e=> ls.setItem('instansi', e.target.textContent.trim()));
  document.getElementById('mata-pelajaran').addEventListener('input', e=> ls.setItem('mataPelajaran', e.target.textContent.trim()));

  const editableSections = Array.from(document.querySelectorAll('.editable'));
  editableSections.forEach(el=>{const key = el.dataset.key; if(!key) return; el.addEventListener('input', () => { ls.setItem(key, el.innerHTML); });});

  const photoFile = document.getElementById('photo-file');
  photoFile.addEventListener('change', async (e)=>{ const f = e.target.files && e.target.files[0]; if(!f) return; const data = await readFileAsDataURL(f); document.getElementById('profile-photo').src = data; ls.setItem('profilePhoto', data); });

  const editSosBtn = document.getElementById('edit-sosmed');
  const sosForm = document.getElementById('sosmed-form');
  editSosBtn && editSosBtn.addEventListener('click', ()=> sosForm.classList.toggle('hidden'));

  document.getElementById('save-sosmed').addEventListener('click', ()=>{ const o = { youtube: document.getElementById('in-youtube').value.trim(), tiktok: document.getElementById('in-tiktok').value.trim(), instagram: document.getElementById('in-ig').value.trim(), email: document.getElementById('in-email').value.trim() }; ls.setItem('sosmed', JSON.stringify(o)); renderSosmedList(o); sosForm.classList.add('hidden'); });
  document.getElementById('cancel-sosmed').addEventListener('click', ()=> sosForm.classList.add('hidden'));

  document.getElementById('reset-header').addEventListener('click', ()=>{ ls.removeItem('profilePhoto'); document.getElementById('profile-photo').src = 'avatar.svg'; });

  loadProfile();
});
