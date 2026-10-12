'use strict';
const config = window.MULTIVUE_CONFIG || {};
function validDestination(value, allowLocal) {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (allowLocal && /^downloads\/[a-zA-Z0-9._-]+\.exe$/i.test(value)) return value;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
  catch { return null; }
}
const web = validDestination(config.webUrl, false);
const download = validDestination(config.downloadUrl, true);
const installer = config.installer;
const hasInstaller = installer && Array.isArray(installer.parts) && installer.parts.length > 0;
let busy = false;
async function downloadInstaller(event) {
  event.preventDefault();
  if (busy) return;
  const status = document.querySelector('#availability');
  if (location.protocol === 'file:') {
    status.textContent = 'Le téléchargement fonctionne après publication ou avec un serveur local.';
    status.scrollIntoView({block:'center'});
    return;
  }
  busy = true;
  const buttons = [...document.querySelectorAll('[data-destination="download"]')];
  const labels = buttons.map(b => b.textContent);
  let objectUrl;
  try {
    buttons.forEach(b => b.setAttribute('aria-disabled','true'));
    const chunks = [];
    let received = 0;
    for (const part of installer.parts) {
      const progress = Math.round(received / installer.size * 100);
      status.textContent = 'Préparation du téléchargement : ' + progress + ' %';
      buttons.forEach(b => b.textContent = 'Téléchargement… ' + progress + ' %');
      const response = await fetch(part.url);
      if (!response.ok) throw new Error('Fichier indisponible (' + response.status + ')');
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength !== part.size) throw new Error('Morceau incomplet');
      if (window.crypto && crypto.subtle) {
        const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2,'0')).join('');
        if (hash !== part.sha256) throw new Error('Vérification du fichier échouée');
      }
      chunks.push(bytes);
      received += bytes.byteLength;
    }
    if (received !== installer.size) throw new Error('Installateur incomplet');
    objectUrl = URL.createObjectURL(new Blob(chunks,{type:'application/octet-stream'}));
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = installer.name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    status.textContent = 'Installateur prêt. Choisissez où enregistrer le fichier si votre navigateur le demande.';
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  } catch (error) {
    status.textContent = 'Téléchargement interrompu. Vérifiez votre connexion puis réessayez. ' + error.message;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  } finally {
    busy = false;
    buttons.forEach((b,i) => { b.removeAttribute('aria-disabled'); b.textContent = labels[i]; });
  }
}
for (const link of document.querySelectorAll('[data-destination]')) {
  const isDownload = link.dataset.destination === 'download';
  const destination = isDownload ? download : web;
  if (isDownload && hasInstaller) {
    link.href = '#acces';
    link.addEventListener('click', downloadInstaller);
  } else if (destination) {
    link.href = destination;
    if (isDownload && destination.startsWith('downloads/')) link.download = destination.split('/').pop();
    if (!isDownload) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  } else {
    link.setAttribute('aria-disabled', 'true');
    link.title = isDownload ? 'Installateur non fourni' : 'Adresse du site non fournie';
    link.textContent = isDownload ? 'Téléchargement bientôt disponible' : 'Accès web bientôt disponible';
  }
}
document.querySelector('#availability').textContent = (!web || (!download && !hasInstaller))
  ? 'Certains accès ne sont pas encore disponibles.'
  : 'Choisissez le bouton correspondant à votre appareil.';
