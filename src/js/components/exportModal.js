/**
 * FestivaPlan AI - Export & Persistence Modal
 * Handles JSON backup, file restore, and print-ready run-sheet generation.
 */

import { eventState } from '../state.js';

export function setupExportModal() {
  const modal = document.querySelector('#modal-export');
  const openBtn = document.querySelector('#btn-open-export-modal');
  const closeBtn = document.querySelector('#btn-close-export-modal');
  const dialogCloseBtn = document.querySelector('#btn-close-export-dialog');
  const btnExportJson = document.querySelector('#btn-export-json');
  const fileInputJson = document.querySelector('#file-import-json');
  const btnPrintRunSheet = document.querySelector('#btn-print-modal-runsheet');

  if (!modal) return;

  if (openBtn) openBtn.addEventListener('click', () => modal.showModal());
  if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
  if (dialogCloseBtn) dialogCloseBtn.addEventListener('click', () => modal.close());

  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const state = eventState.getState();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${state.title.replace(/\s+/g, '_')}_FestivaPlan.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      modal.close();
      showToast('📥 Event backup exported as JSON.');
    });
  }

  if (fileInputJson) {
    fileInputJson.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed && parsed.totalBudget && parsed.budgetItems) {
            eventState.updateEventDetails(parsed);
            modal.close();
            showToast('✅ Restored event plan successfully from backup!');
            window.location.reload();
          } else {
            alert('Invalid FestivaPlan JSON format.');
          }
        } catch (err) {
          alert('Could not parse file. Ensure it is valid JSON.');
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnPrintRunSheet) {
    btnPrintRunSheet.addEventListener('click', () => {
      modal.close();
      window.print();
    });
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'festiva-toast animate-slide-up';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
