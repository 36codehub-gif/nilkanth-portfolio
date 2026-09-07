const canvas =
  document.getElementById("mainCanvas");

const ctx =
  canvas.getContext("2d");

const imageInput =
  document.getElementById("imageInput");

const canvasArea =
  document.getElementById("canvasArea");

const emptyState =
  document.getElementById("emptyState");

const textContainer =
  document.getElementById("textContainer");

const addTextBtn =
  document.getElementById("addTextBtn");

const fontFamily =
  document.getElementById("fontFamily");

const fontSize =
  document.getElementById("fontSize");

const fontColor =
  document.getElementById("fontColor");

const opacity =
  document.getElementById("opacity");

const boldBtn =
  document.getElementById("boldBtn");

const italicBtn =
  document.getElementById("italicBtn");

const deleteBtn =
  document.getElementById("deleteBtn");

const downloadBtn =
  document.getElementById("downloadBtn");


let image = null;

let texts = [];

let selectedText = null;

let dragData = null;


/* =================================
   IMAGE UPLOAD
================================= */

imageInput.addEventListener(
  "change",
  function () {

    const file = this.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = function (event) {

      image = new Image();

      image.onload = function () {

        canvas.width =
          image.naturalWidth;

        canvas.height =
          image.naturalHeight;

        canvasArea.hidden = false;

        emptyState.style.display =
          "none";

        texts = [];

        selectedText = null;

        render();
      };

      image.src =
        event.target.result;
    };

    reader.readAsDataURL(file);
  }
);


/* =================================
   ADD TEXT
================================= */

addTextBtn.addEventListener(
  "click",
  function () {

    if (!image) {

      alert(
        "Pehle photo upload karo."
      );

      return;
    }

    const newText = {

      id: Date.now(),

      content:
        "Double click to edit",

      x:
        canvas.width / 2,

      y:
        canvas.height / 2,

      fontSize:
        Number(fontSize.value),

      fontFamily:
        fontFamily.value,

      color:
        fontColor.value,

      opacity:
        Number(opacity.value),

      bold: false,

      italic: false
    };

    texts.push(newText);

    selectedText =
      newText;

    render();
  }
);


/* =================================
   RENDER
================================= */

function render() {

  if (!image) return;

  /*
    Draw original image
  */

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height
  );


  /*
    Clear HTML text layers
  */

  textContainer.innerHTML = "";


  /*
    Create each text layer
  */

  texts.forEach(function (text) {

    const div =
      document.createElement("div");

    div.className =
      "text-layer";


    if (
      selectedText &&
      selectedText.id === text.id
    ) {
      div.classList.add(
        "selected"
      );
    }


    div.dataset.id =
      text.id;


    div.textContent =
      text.content;


    /*
      Position
    */

    div.style.left =
      text.x + "px";

    div.style.top =
      text.y + "px";


    /*
      Font
    */

    div.style.fontFamily =
      text.fontFamily;

    div.style.fontSize =
      text.fontSize + "px";

    div.style.color =
      text.color;

    div.style.opacity =
      text.opacity;


    div.style.fontWeight =
      text.bold
        ? "bold"
        : "normal";


    div.style.fontStyle =
      text.italic
        ? "italic"
        : "normal";


    /*
      Select
    */

    div.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();

        selectedText =
          text;

        loadControls();

        render();
      }
    );


    /*
      Double click edit
    */

    div.addEventListener(
      "dblclick",
      function (event) {

        event.stopPropagation();

        const value =
          prompt(
            "Text edit karo:",
            text.content
          );

        if (value !== null) {

          text.content =
            value;

          selectedText =
            text;

          render();
        }
      }
    );


    /*
      Mouse drag
    */

    div.addEventListener(
      "mousedown",
      startDrag
    );


    /*
      Touch drag
    */

    div.addEventListener(
      "touchstart",
      startDrag,
      {
        passive: false
      }
    );


    textContainer.appendChild(
      div
    );

  });
}


/* =================================
   GET POINTER POSITION
================================= */

function getPointerPosition(event) {

  const rect =
    canvas.getBoundingClientRect();

  let clientX;
  let clientY;


  if (
    event.touches &&
    event.touches.length > 0
  ) {

    clientX =
      event.touches[0].clientX;

    clientY =
      event.touches[0].clientY;

  } else {

    clientX =
      event.clientX;

    clientY =
      event.clientY;
  }


  return {

    x:
      (clientX - rect.left) *
      (canvas.width / rect.width),

    y:
      (clientY - rect.top) *
      (canvas.height / rect.height)
  };
}


/* =================================
   START DRAG
================================= */

function startDrag(event) {

  event.preventDefault();

  event.stopPropagation();


  const id =
    Number(
      this.dataset.id
    );


  const text =
    texts.find(
      function (item) {

        return item.id === id;
      }
    );


  if (!text) return;


  selectedText =
    text;


  const position =
    getPointerPosition(
      event
    );


  dragData = {

    text: text,

    offsetX:
      position.x - text.x,

    offsetY:
      position.y - text.y
  };


  document.addEventListener(
    "mousemove",
    dragMove
  );

  document.addEventListener(
    "mouseup",
    stopDrag
  );

  document.addEventListener(
    "touchmove",
    dragMove,
    {
      passive: false
    }
  );

  document.addEventListener(
    "touchend",
    stopDrag
  );


  render();
}


/* =================================
   DRAG MOVE
================================= */

function dragMove(event) {

  if (!dragData) return;

  event.preventDefault();


  const position =
    getPointerPosition(
      event
    );


  dragData.text.x =
    position.x -
    dragData.offsetX;


  dragData.text.y =
    position.y -
    dragData.offsetY;


  render();
}


/* =================================
   STOP DRAG
================================= */

function stopDrag() {

  dragData = null;


  document.removeEventListener(
    "mousemove",
    dragMove
  );

  document.removeEventListener(
    "mouseup",
    stopDrag
  );

  document.removeEventListener(
    "touchmove",
    dragMove
  );

  document.removeEventListener(
    "touchend",
    stopDrag
  );
}


/* =================================
   LOAD CONTROLS
================================= */

function loadControls() {

  if (!selectedText) return;


  fontFamily.value =
    selectedText.fontFamily;


  fontSize.value =
    selectedText.fontSize;


  fontColor.value =
    selectedText.color;


  opacity.value =
    selectedText.opacity;
}


/* =================================
   UPDATE TEXT
================================= */

function updateSelected() {

  if (!selectedText) return;


  selectedText.fontFamily =
    fontFamily.value;


  selectedText.fontSize =
    Number(fontSize.value);


  selectedText.color =
    fontColor.value;


  selectedText.opacity =
    Number(opacity.value);


  render();
}


/* =================================
   FONT CONTROLS
================================= */

fontFamily.addEventListener(
  "change",
  updateSelected
);

fontSize.addEventListener(
  "input",
  updateSelected
);

fontColor.addEventListener(
  "input",
  updateSelected
);

opacity.addEventListener(
  "input",
  updateSelected
);


/* =================================
   BOLD
================================= */

boldBtn.addEventListener(
  "click",
  function () {

    if (!selectedText) return;

    selectedText.bold =
      !selectedText.bold;

    render();
  }
);


/* =================================
   ITALIC
================================= */

italicBtn.addEventListener(
  "click",
  function () {

    if (!selectedText) return;

    selectedText.italic =
      !selectedText.italic;

    render();
  }
);


/* =================================
   DELETE
================================= */

deleteBtn.addEventListener(
  "click",
  function () {

    if (!selectedText) return;


    texts =
      texts.filter(
        function (text) {

          return (
            text.id !==
            selectedText.id
          );
        }
      );


    selectedText = null;

    render();
  }
);


/* =================================
   DELETE KEY
================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Delete" &&
      selectedText
    ) {

      deleteBtn.click();
    }
  }
);


/* =================================
   DESELECT
================================= */

canvasArea.addEventListener(
  "click",
  function () {

    selectedText = null;

    render();
  }
);


/* =================================
   DOWNLOAD
================================= */

downloadBtn.addEventListener(
  "click",
  function () {

    if (!image) {

      alert(
        "Pehle photo upload karo."
      );

      return;
    }


    /*
      Create final canvas
    */

    const output =
      document.createElement(
        "canvas"
      );


    output.width =
      canvas.width;

    output.height =
      canvas.height;


    const outputCtx =
      output.getContext(
        "2d"
      );


    /*
      Draw image
    */

    outputCtx.drawImage(
      image,
      0,
      0,
      output.width,
      output.height
    );


    /*
      Draw text
    */

    texts.forEach(
      function (text) {

        outputCtx.save();


        outputCtx.globalAlpha =
          text.opacity;


        let font = "";


        if (text.italic) {
          font += "italic ";
        }


        if (text.bold) {
          font += "bold ";
        }


        font +=
          text.fontSize +
          "px " +
          text.fontFamily;


        outputCtx.font =
          font;


        outputCtx.fillStyle =
          text.color;


        outputCtx.textAlign =
          "center";


        outputCtx.textBaseline =
          "middle";


        outputCtx.fillText(
          text.content,
          text.x,
          text.y
        );


        outputCtx.restore();
      }
    );


    /*
      Download
    */

    const link =
      document.createElement(
        "a"
      );


    link.download =
      "edited-photo.png";


    link.href =
      output.toDataURL(
        "image/png"
      );


    link.click();

  }
);
