const button = document.getElementById('turn-off')

button.addEventListener('click', async () => {
  const message = { action: 'toggle' }

  const tabs = await chrome.tabs.query({})

  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, message)
  }

})
