/* ==========================================================================
   anihive teaching workspace — interactive components
   Progressive enhancement only: every block stays readable with JS disabled.

   1) [data-quiz]  — single-choice retrieval practice with instant feedback.
      <div class="quiz" data-quiz>
        <p class="q">Question?</p>
        <div class="opts">
          <button data-correct>Right answer</button>
          <button>Wrong answer</button>
        </div>
        <p class="why" hidden>Explanation shown after the first click.</p>
      </div>

   2) [data-check] — checklist whose state survives a reload (localStorage,
      keyed by page + item index). Wrapped in try/catch: a browser with site
      data blocked still renders working checkboxes.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 1. quizzes ------------------------------------------------- */

  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var buttons = Array.prototype.slice.call(quiz.querySelectorAll(".opts button"));
    var why = quiz.querySelector(".why");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (quiz.dataset.answered) return;
        quiz.dataset.answered = "1";

        var isCorrect = button.hasAttribute("data-correct");

        buttons.forEach(function (other) {
          other.disabled = true;
          if (other.hasAttribute("data-correct")) other.classList.add("is-right");
        });
        if (!isCorrect) button.classList.add("is-wrong");

        if (why) why.hidden = false;
      });
    });
  });

  /* ---------- 2. persistent checklists ----------------------------------- */

  var pageKey = "teach:" + (location.pathname.split("/").pop() || "index");

  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(pageKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeStore(state) {
    try {
      localStorage.setItem(pageKey, JSON.stringify(state));
    } catch (error) {
      /* private window, blocked site data — the checkbox still works in-page */
    }
  }

  var saved = readStore();

  document.querySelectorAll("[data-check]").forEach(function (list, listIndex) {
    list.querySelectorAll("li").forEach(function (item, itemIndex) {
      var id = listIndex + ":" + itemIndex;
      var box = document.createElement("input");
      box.type = "checkbox";
      box.checked = saved[id] === true;

      var label = document.createElement("label");
      var text = document.createElement("span");
      while (item.firstChild) text.appendChild(item.firstChild);

      label.appendChild(box);
      label.appendChild(text);
      label.style.display = "flex";
      label.style.gap = "0.6rem";
      label.style.alignItems = "flex-start";
      label.style.cursor = "pointer";
      item.appendChild(label);

      box.addEventListener("change", function () {
        var state = readStore();
        state[id] = box.checked;
        writeStore(state);
      });
    });
  });
})();
