// editor.js - Functionality for Immersive Text Editor

const editor = document.getElementById('editor');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const readingTime = document.getElementById('reading-time');
const toolbarButtons = document.querySelectorAll('.toolbar button');

let typewriterMode = false;
let darkMode = false;

// Toolbar functionality
toolbarButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');

    switch(action) {
      case 'bold': document.execCommand('bold'); break;
      case 'italic': document.execCommand('italic'); break;
      case 'underline': document.execCommand('underline'); break;
      case 'h1': document.execCommand('formatBlock', false, 'H1'); break;
      case 'h2': document.execCommand('formatBlock', false, 'H2'); break;
      case 'unordered-list': document.execCommand('insertUnorderedList'); break;
      case 'ordered-list': document.execCommand('insertOrderedList'); break;
      case 'blockquote': document.execCommand('formatBlock', false, 'BLOCKQUOTE'); break;
      case 'code-block': document.execCommand('formatBlock', false, 'PRE'); break;
      case 'typewriter-toggle': toggleTypewriterMode(); break;
      case 'dark-mode-toggle': toggleDarkMode(); break;
      case 'download': downloadContent(); break;
    }
  });
});

// Typewriter mode toggle
function toggleTypewriterMode() {
  typewriterMode = !typewriterMode;
  if(typewriterMode){
    editor.classList.add('typewriter-mode');
    editor.scrollTop = editor.scrollHeight / 2;
  } else {
    editor.classList.remove('typewriter-mode');
  }
}

// Dark mode toggle
function toggleDarkMode(){
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
}

// Download content as TXT
function downloadContent(){
  const text = editor.innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'document.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Real-time word/char/reading time
editor.addEventListener('input', () => {
  const text = editor.innerText;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const chars = text.replace(/\s/g, '').length;
  const minutes = Math.ceil(words / 200); // 200 WPM average reading
  wordCount.innerText = `Words: ${words}`;
  charCount.innerText = `Chars: ${chars}`;
  readingTime.innerText = `Reading: ${minutes} min`;

  // Auto-scroll for typewriter mode
  if(typewriterMode){
    const caret = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const editorRect = editor.getBoundingClientRect();
    if(caret.bottom > editorRect.bottom || caret.top < editorRect.top){
      editor.scrollTop += caret.bottom - editorRect.bottom + 20;
    }
  }
});
