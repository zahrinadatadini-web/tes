// Persists editable fields, images, sosmed links and audio to localStorage.
// Keys used in localStorage:
// fullName, instansi, mataPelajaran, profilePhoto, headerBg, kegiatanPengembanganDiri, pengalamanOrganisasiProfesi,
// kegiatanPendampingan, kumpulanKarya, prestasiPenghargaan, tentang, sosmed (JSON), profileAudio

document.addEventListener('DOMContentLoaded', () => {
  const ls = window.localStorage;

  // Elements
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.tab-panel'));

  const editableEls = Array.from(document.querySelectorAll('[contenteditable][data-key], #full-name, #instansi, #mata-pelajaran, [data-key="tentang"]'));
  const profilePhoto = document.getElementById('profile-photo');
  const photoFile = document.getElementById('photo-file');
  const bgFile = document.getElementById('bg-file');
  const headerEl = document.getElementById('profile-header');
  const resetHeaderBtn = document.getElementById('reset-header');

  const audioEl = document.getElementById('profile-audio');
  const audioFile = document.getElementById('audio-file');
  const audioReset = document.getElementById('audio-reset');
  const audioSource = document.getElementById('audio-source');

  const editSosmedBtn = document.getElementById('edit-sosmed');
  const sosmedForm = document.getElementById('sosmed-form');
  const inYoutube = document.getElementById('in-youtube');
  const inTiktok = document.getElementById('in-tiktok');
  const inIg = document.getElementById('in-ig');
  const inEmail = document.getElementById('in-email');
  const saveSosmedBtn = document.getElementById('save-sosmed');
  const cancelSosmedBtn = document.getElementById('cancel-sosmed');

  const linkYoutube = document.getElementById('link-youtube');
  const linkTiktok = document.getElementById('link-tiktok');
  const linkIg = document.getElementById('link-ig');
  const linkEmail = document.getElementById('link-email');

  // Tab logic
  function activate(targetId, clickedTab) {
    panels.forEach(p => {
      const isTarget = p.id === targetId;
      p.classList.toggle('hidden', !isTarget);
      p.setAttribute('aria-hidden', String(!isTarget));
    });
    tabs.forEach(t => {
      const isActive = t === clickedTab;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });
    if (history.replaceState) {
      history.replaceState(null, '', '#' + targetId);
    } else {
      location.hash = targetId;
    }
  }
  tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.target, tab)));
  const hash = (location.hash || '#beranda').replace('#', '');
  const initial = tabs.find(t => t.dataset.target === hash) || tabs[0];
  activate(initial.dataset.target, initial);

  // Utility: read file as dataURL and return Promise
  function readFileAsDataURL(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  // Load saved fields
  function loadProfile() {
    const fullName = ls.getItem('fullName');
    if (fullName) document.getElementById('full-name').textContent = fullName;

    const inst = ls.getItem('instansi');
    if (inst) document.getElementById('instansi').textContent = inst;

    const mata = ls.getItem('mataPelajaran');
    if (mata) document.getElementById('mata-pelajaran').textContent = mata;

    // content sections
    const keys = [
      {key:'kegiatanPengembanganDiri', sel:'#kegiatan-pengembangan-diri .editable'},
      {key:'pengalamanOrganisasiProfesi', sel:'#pengalaman-organisasi-profesi .editable'},
      {key:'kegiatanPendampingan', sel:'#kegiatan-pendampingan .editable'},
      {key:'kumpulanKarya', sel:'#kumpulan-karya .editable'},
      {key:'prestasiPenghargaan', sel:'#prestasi-penghargaan .editable'},
      {key:'tentang', sel:'#tentang .editable'}
    ];
    keys.forEach(k => {
      const v = ls.getItem(k.key);
      if (v !== null) {
        const el = document.querySelector(k.sel);
        if (el) el.innerHTML = v;
      }
    });

    // profile photo
    const photoData = ls.getItem('profilePhoto');
    if (photoData) profilePhoto.src = photoData;

    // header background
    const bgData = ls.getItem('headerBg');
    if (bgData) headerEl.style.backgroundImage = `url(${bgData})`;

    // sosmed
    const sosmed = JSON.parse(ls.getItem('sosmed') || '{}');
    if (sosmed.youtube) linkYoutube.href = sosmed.youtube;
    if (sosmed.tiktok) linkTiktok.href = sosmed.tiktok;
    if (sosmed.instagram) linkIg.href = sosmed.instagram;
    if (sosmed.email) linkEmail.href = `mailto:${sosmed.email}`;

    // audio
    const audioData = ls.getItem('profileAudio');
    if (audioData) {
      audioEl.src = audioData;
      audioEl.load();
    } else if (audioSource && audioSource.src) {
      // keep default provided in DOM
    }
  }

  // Save simple text fields when they change
  // Full name, instansi, mataPelajaran
  document.getElementById('full-name').addEventListener('input', e => ls.setItem('fullName', e.target.textContent.trim()));
  document.getElementById('instansi').addEventListener('input', e => ls.setItem('instansi', e.target.textContent.trim()));
  document.getElementById('mata-pelajaran').addEventListener('input', e => ls.setItem('mataPelajaran', e.target.textContent.trim()));

  // Save editable sections on input (autosave)
  const editableSections = Array.from(document.querySelectorAll('.editable'));
  editableSections.forEach(el => {
    const key = el.dataset.key;
    if (!key) return;
    el.addEventListener('input', () => {
      // save innerHTML so formatting/line breaks preserved
      ls.setItem(key, el.innerHTML);
    });
  });

  // Image upload handlers (profile photo)
  photoFile.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    try {
      const data = await readFileAsDataURL(f);
      profilePhoto.src = data;
      ls.setItem('profilePhoto', data);
    } catch (err) {
      console.error('Error reading photo', err);
    }
    photoFile.value = '';
  });

  // Header background upload
  bgFile.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    try {
      const data = await readFileAsDataURL(f);
      headerEl.style.backgroundImage = `url(${data})`;
      ls.setItem('headerBg', data);
    } catch (err) {
      console.error('Error reading background', err);
    }
    bgFile.value = '';
  });

  resetHeaderBtn.addEventListener('click', () => {
    ls.removeItem('profilePhoto');
    ls.removeItem('headerBg');
    profilePhoto.src = 'avatar.svg';
    headerEl.style.backgroundImage = '';
  });

  // Audio: read as dataURL and save (note: localStorage size limits)
  audioFile.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    try {
      const data = await readFileAsDataURL(f);
      audioEl.src = data;
      audioEl.load();
      ls.setItem('profileAudio', data);
    } catch (err) {
      console.error('Error reading audio', err);
      alert('Gagal membaca file audio. Pastikan ukuran tidak terlalu besar.');
    }
    audioFile.value = '';
  });

  audioReset.addEventListener('click', () => {
    ls.removeItem('profileAudio');
    // restore default if present
    const defaultSrc = audioSource && audioSource.src ? audioSource.src : '';
    if (defaultSrc) {
      audioEl.src = defaultSrc;
      audioEl.load();
    } else {
      audioEl.removeAttribute('src');
      audioEl.load();
    }
  });

  // Sosmed edit flow
  editSosmedBtn.addEventListener('click', () => {
    sosmedForm.classList.toggle('hidden');
    // prefill with current values
    const sosmed = JSON.parse(ls.getItem('sosmed') || '{}');
    inYoutube.value = sosmed.youtube || '';
    inTiktok.value = sosmed.tiktok || '';
    inIg.value = sosmed.instagram || '';
    inEmail.value = sosmed.email || '';
  });

  cancelSosmedBtn.addEventListener('click', () => {
    sosmedForm.classList.add('hidden');
  });

  saveSosmedBtn.addEventListener('click', () => {
    const obj = {
      youtube: inYoutube.value.trim(),
      tiktok: inTiktok.value.trim(),
      instagram: inIg.value.trim(),
      email: inEmail.value.trim()
    };
    ls.setItem('sosmed', JSON.stringify(obj));
    // apply
    linkYoutube.href = obj.youtube || '#';
    linkTiktok.href = obj.tiktok || '#';
    linkIg.href = obj.instagram || '#';
    linkEmail.href = obj.email ? `mailto:${obj.email}` : 'mailto:';
    sosmedForm.classList.add('hidden');
  });

  // Smooth scroll for subnav anchors
  const subnavLinks = Array.from(document.querySelectorAll('.beranda-subnav a'));
  subnavLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const id = a.getAttribute('href').replace('#', '');
      const el = document.getElementById(id);
      if (!el) return;
      const berandaTab = tabs.find(t => t.dataset.target === 'beranda');
      if (berandaTab) activate('beranda', berandaTab);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // initial load
  loadProfile();

  // accessibility: save content on blur too (for browsers that don't send input)
  editableEls.forEach(el => {
    el.addEventListener('blur', () => {
      // If it has data-key, save innerHTML; else save textContent for name/instansi/mataPelajaran
      const k = el.dataset.key;
      if (k) ls.setItem(k, el.innerHTML);
      else {
        if (el.id === 'full-name') ls.setItem('fullName', el.textContent.trim());
        if (el.id === 'instansi') ls.setItem('instansi', el.textContent.trim());
        if (el.id === 'mata-pelajaran') ls.setItem('mataPelajaran', el.textContent.trim());
      }
    });
  });

  // Inform user if localStorage is near full (best-effort)
  try {
    // try writing a small test key and removing it
    ls.setItem('__ls_test', '1');
    ls.removeItem('__ls_test');
  } catch (e) {
    console.warn('localStorage tidak tersedia atau penuh', e);
  }
});