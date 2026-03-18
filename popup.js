(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Inyectamos el content.js
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });

  // Se cierra solo al instante
  window.close();
})();