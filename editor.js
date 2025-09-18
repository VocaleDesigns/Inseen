const editor = document.getElementById('editor');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const readingTime = document.getElementById('reading-time');
const toolbarButtons = document.querySelectorAll('.toolbar .icon-btn');
const fontOptions = document.querySelectorAll('[data-font]');
const sizeOptions = document.querySelectorAll('[data-size]');

let typewriterMode = false;
let darkMode = false;

// Toolbar functionality
toolbarButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');

    switch(action){
      case 'bold': applyStyle('bold'); break;
      case 'italic': applyStyle('italic'); break;
      case 'underline': applyStyle('underline'); break;
      case 'h1': applyBlock('H1'); break;
      case 'h2': applyBlock('H2'); break;
      case 'blockquote': applyBlock('BLOCKQUOTE'); break;
      case 'code-block': applyBlock('PRE'); break;
      case 'align-left': applyAlign('left'); break;
      case 'align-center': applyAlign('center'); break;
      case 'align-right': applyAlign('right'); break;
      case 'typewriter-toggle': toggleTypewriterMode(); break;
      case 'dark-mode-toggle': toggleDarkMode(); break;
      case 'download': downloadContent(); break;
    }
  });
});

// Font & Size dropdown functionality
fontOptions.forEach(option => {
  option.addEventListener('click', () => {
    document.execCommand('fontName', false, option.getAttribute('data-font'));
  });
});

sizeOptions.forEach(option => {
  option.addEventListener('click', () => {
    document.execCommand('fontSize', false, 7); // workaround
    const selection = window.getSelection();
    if(selection.rangeCount > 0){
      const span = document.createElement('span');
      span.style.fontSize = option.getAttribute('data-size');
      span.textContent = selection.toString();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
    }
  });
});

// Apply inline styles
function applyStyle(style){ document.execCommand(style); }
function applyBlock(tag){ document.execCommand('formatBlock', false, tag); }
function applyAlign(direction){ document.execCommand('justify' + direction); }

// Typewriter mode
function toggleTypewriterMode(){
  typewriterMode = !typewriterMode;
  editor.classList.toggle('typewriter-mode', typewriterMode);
  if(typewriterMode){ editor.scrollTop = editor.scrollHeight / 2; }
}

// Dark mode
function toggleDarkMode(){
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
}

// Download editor content
function downloadContent(){
  const text = editor.innerText;
  const blob = new Blob([text], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'document.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Real-time stats and typewriter auto-scroll
editor.addEventListener('input', () => {
  const text = editor.innerText;
  const words = text.trim().split(/\s+/).filter(w => w.length>0).length;
  const chars = text.replace(/\s/g,'').length;
  const minutes = Math.ceil(words/200);
  wordCount.innerText = `Words: ${words}`;
  charCount.innerText = `Chars: ${chars}`;
  readingTime.innerText = `Reading: ${minutes} min`;

  if(typewriterMode){
    const sel = window.getSelection();
    if(sel.rangeCount){
      const caret = sel.getRangeAt(0).getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      if(caret.bottom > editorRect.bottom || caret.top < editorRect.top){
        editor.scrollTop += caret.bottom - editorRect.bottom + 20;
      }
    }
  }
});
