/**
 * Andrew Yu
 * 4/26/2022
 * Section AH Marina and Allan
 * This is the Set.js that provides the behavior to the set.css and set.html
 * files, it implements a variety of functions, including determing whether
 * a set of cards is a set, toggling between menu views, generating random
 * attributes, and implementing a timer system through out the game
 */

"use strict";
let timerId;
let remainingSeconds;
/**
  *overall function
  */
(function () {
  window.addEventListener("load", init);

 /**
  * sets up java for when page loads to run certain functions
  *mostly relating to doing certain events when specific buttons r clicked
  */
  function init() {
    id("start-btn").addEventListener("click", function () {
      toggleViews();
      startTimer();
      generateBoard(easyOrHard());
    });

    id("back-btn").addEventListener("click", function () {
      toggleViews();
      destroyAll();
    });

    id("refresh-btn").addEventListener("click", function () {
      id("board").innerHTML = "";
      generateBoard(easyOrHard());
    })
  }

 /**
  * this function is like the hulk, it destroys everything
  * (actually it resets the board and set count and timer
  * and then disables the refresh button)
  */
  function destroyAll() {
    id("board").innerHTML = "";
    id("set-count").textContent = 0;
    clearInterval(timerId);
    id("refresh-btn").disabled = false;
  }

 /**
  * sets up java for when page loads to run certain functions
  * mostly relating to doing certain events when specific buttons r clicked
  */
  function toggleViews() {
    let element = document.getElementById("menu-view");
    element.classList.toggle("hidden");
    let element = document.getElementById("game-view");
    element.classList.toggle("hidden");
  }

 /**
  * determines the difficulty based on what the user chooses in the menu
  * and to be used in other methods
  * @returns {boolean} - the difficulty, false for hard and true for easy
  */
  function easyOrHard() {
    let difficulty = false;
    let value = qs("input:checked").value;
    if (value === "easy") {
      difficulty = true;
    }
    return difficulty;
  }

 /**
  * creates a board of cards, 9 cards for easy board 12 cards for normal
  * @param {boolean} id - boolean determing whether it is easy or not
  */
  function generateBoard(isEasy) {
    if (isEasy) {
      for (let i = 0; i < 9; i++) {
        id("board").appendChild(generateUniqueCard(isEasy));
      }
    } else {
      for (let i = 0; i < 12; i++) {
        id("board").appendChild(generateUniqueCard(isEasy));
      }
    }
  }

 /**
  * generates a series of 3 attributes including style color and shape as
  * well as a count which is the amount of objects.
  * @param {boolean} isEasy - the difficulty
  * @return {array} finalArray - array containing the 4 styles
  */
  function generateRandomAttributes(isEasy) {
    let array = Array(4).fill().map(() => Math.floor(3 * Math.random()));
    let styles = ["outline", "solid", "striped"];
    let colors = ["green", "purple", "red"];
    let shape = ["diamond", "oval", "squiggle"];
    let count = [1, 2, 3];
    let combinedArray = [styles, shape, colors, count];
    let finalArray = Array(4);
    for (let i = 0; i < array.length; i++) {
      let value = array[i];
      let whichElement = combinedArray[i];
      finalArray[i] = whichElement[value];
    }
    if (isEasy === true) {
      finalArray[0] = "solid";
    }
    return finalArray;
  }

/**
   * ggenerates a card that is unique in all atributes compared to the other
   * cards
   * @param {boolean} isEasy - the difficulty choosen by the user
   * @returns {object} - a card that is a div
   */
  function generateUniqueCard(isEasy) {
    let cardArray = generateRandomAttributes(isEasy);
    let cardName = cardArray[0] + "-" + cardArray[1] + "-" + cardArray[2]
      + "-" + cardArray[3];
    while (id(cardName) !== null) {
      cardArray = generateRandomAttributes(isEasy);
      cardName = cardArray[0] + "-" + cardArray[1] + "-" + cardArray[2]
        + "-" + cardArray[3];
    }
    let card = gen("div");
    let count = cardArray[3];
    for (let i = 0; i < count; i++) {
      let img = gen("img");
      img.src = "img/" + cardArray[0] + "-" + cardArray[1] + "-" + cardArray[2]
        + ".png";
      img.alt = cardName;
      card.appendChild(img);
    }
    card.id = cardName;
    card.classList.add("card");
    card.addEventListener("click", cardSelected);
    return card;
  }

  /**
   * creates a change in the card when the user selects it, tells the user
   * whether or not their choosen 3 cards create a set or not and will
   * increase the score accordingly
   */
   function cardSelected() {
    this.classList.toggle("selected");
    let selected = qsa("#board .selected");
    let amount = selected.length;
    if (amount === 3) {
      for (let i = 0; i < amount; i++) {
        selected[i].classList.toggle("selected");
      }
      if (isASet(selected) === true) {
        for (let i = 0; i < amount; i++) {
          let difficulty = easyOrHard();
          let newCard = generateUniqueCard(difficulty);
          selected[i].replaceWith(newCard);
          newCard.classList.add("hide-imgs");
          let paragraph = document.createElement("p");
          paragraph.textContent = "SET!";
          newCard.appendChild(paragraph);
          setTimeout(function () {
            newCard.removeChild(paragraph);
            newCard.classList.remove("hide-imgs");
          }, 1000);
        }
        let count = parseInt(id("set-count").textContent) + 1;
        console.log("This is the current count: " + count);
        id("set-count").textContent = count;
      }
      else {
        for (let i = 0; i < amount; i++) {
          selected[i].classList.add("hide-imgs");
          let paragraph = document.createElement("p");
          paragraph.textContent = "Not a Set";
          selected[i].appendChild(paragraph);
          setTimeout(function () {
            selected[i].removeChild(paragraph);
            selected[i].classList.remove("hide-imgs");
          }, 1000);
        }
      }
    }
  }

/**
  * starts the timer and formats it and updates the total amount of
  * seconds based off the user choice
  */
  function startTimer() {
    let totalString = qs('select').value
    remainingSeconds = Number(totalString);
    let minutes = remainingSeconds / 60;
    id('time').textContent = '0' + minutes + ':00';
    timerId = setInterval(advanceTimer, 1000);
  }

/**
  * moves the timer forwards and ends the game when the
  * timer reaches zero, displaying this time in human format
  */
  function advanceTimer() {
    let timer = id("time");
    remainingSeconds = remainingSeconds - 1;
    let minute = Math.floor(remainingSeconds / 60);
    let second = remainingSeconds % 60;
    timer.textContent = "0" + minute + ":" + second;
    if (second < 10) {
      timer.textContent = "0" + minute + ":0" + second;
    }
    if (remainingSeconds === 0) {
      endGame();
    }
  }

 /**
  * how the game ends, disabling buttons and ensures that no cards
  * can be clicked
  */
  function endGame() {
    id("refresh-btn").disabled = true
    clearInterval(timerId);
    id("time").textContent = "00:00";
    let selections = qsa("#board .card")
    let length = selections.length;
    for (let i = 0; i < length; i++) {
      selections[i].removeEventListener("click", cardSelected);
      selections[i].classList.remove("selected");
    }
  }

 /**
  * Checks to see if the three selected cards make up a valid set. This is done by comparing each
  * of the type of attribute against the other two cards. If each four attributes for each card are
  * either all the same or all different, then the cards make a set. If not, they do not make a set
  * @param {DOMList} selected - list of all selected cards to check if a set.
  * @return {boolean} true if valid set false otherwise.
  */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let diff = attributes[0][i] !== attributes[1][i] &&
        attributes[1][i] !== attributes[2][i] &&
        attributes[0][i] !== attributes[2][i];
      let same = attributes[0][i] === attributes[1][i] &&
        attributes[1][i] === attributes[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
  }

/**
  * Returns the element that has the ID attribute with the specified value.
  * @param {string} id - element ID.
  * @returns {object} - DOM object associated with id.
  */
  function id(id) {
    return document.getElementById(id);
  }

 /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

 /**
  * Returns first element matching selector.
  * @param {string} selector - CSS query selector.
  * @returns {object} - array of the querySelector returns.
  */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

 /**
  * generates a specific tag name
  * @param {string} tagName - name of tag to be generateds.
  * @returns {object} - a created tag of specified tagname
  */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();