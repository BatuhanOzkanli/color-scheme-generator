const seedColorInput = document.getElementById('seed-color')
const modeSelect = document.getElementById('mode-select')
const getSchemeBtn = document.getElementById('get-scheme-btn')
const paletteContainer = document.getElementById('palette-container')

getSchemeBtn.addEventListener('click', fetchColorScheme)

async function fetchColorScheme() {
    let seedColor = seedColorInput.value;
    const mode = modeSelect.value;
    
    seedColor = seedColor.substring(1)
    
    const apiUrl = `https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${mode}&count=5`
    
    try {
        const response = await fetch(apiUrl)
        
        const data = await response.json()
        
        if (data.colors) {
            renderColors(data.colors)
        }
    }
    catch (error) {
        console.error("Error fetching color scheme:", error)
        alert("Failed to get color scheme. Please try again.")
    }
    
}

function renderColors(colorsArray) {
    let html = ''
    
    colorsArray.forEach(color => {
        const hexValue = color.hex.value
        
        html += `
            <div class="color-col">
                <div class="color-swatch" style="background-color: ${hexValue};"></div>
                <div class="hex-code" onclick="copyToClipboard('${hexValue}', this)">
                    <div class="mini-swatch" style="background-color: ${hexValue};"></div>
                    <span class="hex-text">${hexValue}</span> 
                </div>
            </div>
        `
    })
    
    paletteContainer.innerHTML = html
}

function copyToClipboard(hex, element) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex)
            .then(() => {
                showFeedback(element, hex)
            })
            .catch(err => {
                console.warn("Clipboard blocked. Selecting text instead.")
                selectTextForCopy(element)
            })
    }
    else {
        selectTextForCopy(element)
    }
}

function selectTextForCopy(element) {
    const textSpan = element.querySelector('.hex-text')
    
    const range = document.createRange()
    range.selectNodeContents(textSpan)
    
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
}
 
        
function showFeedback(element, originalHex) {
    const textSpan = element.querySelector('.hex-text')
    textSpan.innerText = "Copied!"
            
    setTimeout(() => {
    textSpan.innerText = originalHex
    }, 1000)
}