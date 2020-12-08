let multiplier = 0;
let traditional = false;
let speed = 0.5;
let currentQuestion = {}

var cram = null;
var time = 0;
var timeout;
class MultQ {
  constructor(mnFunc, name, type) {
    this.mnF = mnFunc;
    this._name = name || createError("multq didn't receive name.");
    this._type = type || "basic";
  }
  get question() {
    if (this._type == "basic") {
      let mns = this.mnF();
      this.n1 = mns[0];
      this.n2 = mns[1];
      return `${this.n1} × ${this.n2} = ——`;
    }
    else {
      createError("expected basic, received " + this._type)
    }
  }
  get name() {
    return `<h3 class="type">${this._name}</h3>`
  }

  static random(d) {
    let digits = d || 2
    return Math.round(Math.random() * Math.pow(10, digits))
  }
}

function setCram(cram) {
  if (!cram) {
    return createError("expected an index to cram, received nothing.")
  }
}

let questionTypes = [
  new MultQ(
    () => {
      return [MultQ.random(), MultQ.random()]
    },
    "2d×2d"
  ),
  new MultQ(
    () => { return [11, Math.floor(Math.random() * 88 + 12).toString()] },
    "11×2d"
  ),
  new MultQ(
    () => { return [101, MultQ.random()] },
    "101×2d"
  ),
  new MultQ(
    () => {
      let nTS = Math.floor(Math.random() * 100)
      return [nTS, nTS]
    },
    "^2"
  ),
  new MultQ(
    () => {
      return [25, MultQ.random()]
    },
    "25×2d"
  ),
  new MultQ(
    () => {
      return [MultQ.random(2), MultQ.random(1)]
    },
    "2d×1d"
  )
]

function randQuestion(arrI) {
  qI = cram || arrI;
  if (cram === 0) {
    qI = 0;
  }
  if (arrI > questionTypes.length - 1) return createError("requested questiontype index " + arrI + ", only " + questionTypes.length + " available.")
  let curQuestionType = questionTypes[qI] || questionTypes[Math.floor(Math.random() * questionTypes.length)];
  currentQuestion = {
    question: curQuestionType.question,
    name: curQuestionType.name,
    answer: curQuestionType.n1 * curQuestionType.n2
  }
  newQuestion(currentQuestion.question, currentQuestion.name)
}

$(document).ready(randQuestion())
function correct() {
  multiplier++;
  $("#background").html(`<h1 class="multiplier">${multiplier}x</h1>`);
  $(".answer").each(function() {
    $(this).addClass("correct")
  });
}

function incorrect() {
  multiplier = 0;
  $("#background").html(`<h1 class="wmultiplier">0x</h1>`);
  $(".answer").each(function() {
    $(this).addClass("incorrect")
  });
}

let listener = $("form").on('submit', e => {
  e.preventDefault();
  clearInterval(timeout);
  let values = [];
  $('.answer').each(function() {
    values.push($(this).val())
    $(this).addClass('waiting')
    $(this).prop('disabled', true)
    $(this).prop('style', "")
  })
  setTimeout(() => {
    let incorrect = false;
    for (let i in values) {
      console.log(currentQuestion['answer']);
      if (currentQuestion['answer'] != values[i]) {
        incorrect = true;
      }
    }
    if (incorrect) {
      multiplier = 0;
      $("#background").html(`<h1 class="wmultiplier">0x</h1>`);
      $(".answer").each(function() {
        $(this).addClass("incorrect")
      });
    }
    else {
      multiplier++;
      $("#background").html(`<h1 class="multiplier">${multiplier}x</h1>`);
      $(".answer").each(function() {
        $(this).addClass("correct")
      });
    }
    setTimeout(() => {
      randQuestion()
    }, 2500 * speed);
  }, 1000 * speed)
})
function newQuestion(template, bottom) {
  $("#bottom").fadeOut(250);
  $("#backgroundTime").fadeOut(250);
  $("#app").fadeOut(250, () => {
    clearInterval(timeout)
    time = 0;
    timeout = setInterval(() => {
      time += 1
      $("#backgroundTime").html((time / 10).toFixed(1));
    }, 100)
    $("#bottom").html(bottom);
    let formattedTemplate = `<p class="tq">${template}</p><input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;"tabindex="-1"/>`;
    formattedTemplate = formattedTemplate.split("——").join(`</p><input type="text" class="answer" autocomplete="off" maxlength="5" required><p class="tq">`);
    $("#inputForm").html(formattedTemplate);
    $("#app").fadeIn(250);
    $("#bottom").fadeIn(250);
    $("#backgroundTime").fadeIn(250);
  })
}
function createError(name) {
  let err = new Error(name)
  $(document.body).fadeOut(250, () => {
    $(document.body).html(`<h1 id="error">error.</h1><div style="display: block;"><p id="errMess">${err.message}</p><p>${err.stack}</p></div>`)
    $(document.body).fadeIn(250);
  })
  return err;
}