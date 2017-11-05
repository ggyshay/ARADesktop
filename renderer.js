const {
  ipcRenderer
} = require('electron')
const $ = require('jquery');
const path = require('path')

$('#openBTN').on('click', () => {
  ipcRenderer.send('openFile', () => {
  })
})

ipcRenderer.on('fileData', (event, data) => { //received 'fileData' event

  let child = document.getElementById("fileRef");
  while (child) { //remove all displyed files
    child.parentNode.removeChild(child);
    child = document.getElementById("fileRef");
  }

  function appendfileRef(name, wd, ext) { //file icon creator
    let para = document.createElement("div");
    let node = document.createTextNode(name.substring(0, name.length - 4).substring(0, 10));
    para.appendChild(node);
    para.setAttribute("id", "fileRef");
    para.setAttribute("ext", ext);
    para.addEventListener("click", function() {
      if (swap.pad) {
        swap.setFile(wd + "/" + para.innerHTML + para.getAttribute("ext")); //only sets the file in swap if swap has a pad
        swap.swapFile(); //swap operation
      }
    })
    document.getElementById('fileDisplay').appendChild(para);
  }

  if (data.dWdir) { //if it is a data object this will not be undefined
    for (let i = 0; i < data.dFiles.length; i++) {
      let ext = path.extname(data.dFiles[i]);//get file extension
      if (ext == ".mp3" || ext == ".ogg" || ext == ".wav") { //aceitar mp3, ogg, wav
        appendfileRef(data.dFiles[i], data.dWdir, ext);
      }
    }
  } else { //this is a single file
    console.log("COME HERE TO FIX THIS SHIT YOU LAZY FUCK")
    appendfileRef(data); //this is completely wrong
  }
});
