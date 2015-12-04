(function() {

  'use strict';

  var elementID = {
    slideshow : 'simpleslides',
    slide : 'slide',
    counter : 'counter',
    navigation : 'navigation',
    next : 'next',
    previous : 'previous',
    current : 'current'
  },
  labels = {
    next : '&rarr;',
    previous : '&larr;',
    separator : ' / '
  };

  var $slideshow = document.getElementById( elementID.slideshow );
  var $slides = $slideshow.getElementsByTagName('div');

  $slides.foreach(function(elem){
    elem.className = elementID.slide;
  });

  var $firstSlide = $slides[0];
  var $currentSlide = $firstSlide;
  var $lastSlide = $slides[$slides.length - 1];
  var $navigation = document.createElement('div');
  $navigation.id = elementID.navigation;

  // make sure the last slide doesn't page break while printing.
  var headElement = document.getElementsByTagName('head')[0];
  var printStyleFix = document.createElement('style');
  printStyleFix.innerHTML = '.slide:nth-child(' + $slides.length + ') { page-break-after: auto }';
  headElement.appendChild(printStyleFix);

  // remove non-div children (like html comments which wp wraps in <p> tags)
  $slideshow.children.foreach(function(elem){
    if ( elem.tagName !== 'div' ) {
      elem.remove();
    }
  });

  // create navigational arrows and counter
  var $next = document.createElement('a');
  $next.href = '#';
  $next.id = elementID.next;
  $next.innerHTML = labels.next;

  var $previous = document.createElement('a');
  $previous.href = '#';
  $previous.id = elementID.previous;
  $previous.innerHTML = labels.previous;

  var $counter = document.createElement('div');
  $counter.id = elementID.counter;

  // add navigational arrows and counter to the presentation
  $navigation.append([ $next, $previous]);
  $slideshow.append([ $navigation, $counter ]);


  /*** FUNCTIONS ***/

  var updateCounter = function() {
    // updates the counter
    $counter.innerHTML = slidePointer.current + labels.separator + slidePointer.last;
  };

  var updateURL = function() {
    // updates slide state
    var currentURL = document.location.toString();

    if (currentURL.indexOf('#') !== 1){
      currentURL = currentURL.substr(0,currentURL.indexOf('#'));
    }

    // TODO bbq --- $.bbq.pushState({ slide: slidePointer.current });
  };

  var hideCurrentSlide = function() {
    // hide the current slide
    if ( $currentSlide ) {
      $currentSlide.hide().removeClass(elementID.current);
    }
  };

  var nextSlide = function() {
    // hide current slide
    hideCurrentSlide();

    // get the next slide
    var nextSlide = $currentSlide.next();

    // not the last slide => go to the next one and increment the counter
    if ( slidePointer.current !== slidePointer.last ) {
      nextSlide.show().addClass(elementID.current);
      $currentSlide = nextSlide;
      slidePointer.current++;
    }
    else {
      // is the last slide => go back to the first slide and reset the counter.
      $firstSlide.show().addClass(elementID.current);
      $currentSlide = $firstSlide;
      slidePointer.current = 1;
    }

    // update counter
    updateCounter();

    // update url
    updateURL();

    // fire slide event
    fireSlideEvent();
  };

  var previousSlide = function() {
    // hide current slide
    hideCurrentSlide();

    // get the previous slide
    var prevSlide = $currentSlide.prev();

    // If not the first slide, go to the previous one and decrement the counter
    if ( slidePointer.current !== 1 ) {
      prevSlide.show().addClass(elementID.current);
      $currentSlide = prevSlide;
      slidePointer.current--;
    }
    else {
      // This must be the first slide, so go back to the last slide and set the counter.
      $lastSlide.show().addClass(elementID.current);
      $currentSlide = $lastSlide;
      slidePointer.current = slidePointer.last;
    }

    // update counter
    updateCounter();

    // update URL
    updateURL();

    // fire slide event
    fireSlideEvent();
  };

  /*var goToSlide = function(slideNumber) {
    // hide current slide
    hideCurrentSlide();
    var moveToSlide = slideNumber-1;

    $currentSlide = $slides.eq(moveToSlide);
    $currentSlide.show().addClass(elementID.current);
    slidePointer.current = slideNumber;

    // update counter
    updateCounter();
  }; TODO bbq */

  var fireSlideEvent = function(slide) {
    var slideEvent = new window.CustomEvent('slidechanged', {
      detail: { slide: slide || $currentSlide }
    });
    window.dispatchEvent(slideEvent);
  };

  /*** INIT SLIDESHOW ***/ // ALL GOOD!

  // Initially hide all slides
  $slides.style.display = 'hidden';

  // The first slide is number first, last is slides length
  var slidePointer = {
    current : 1,
    last : $slides.length
  };

  // The first slide is the first slide, so make visible and set the counter...
  $currentSlide = $firstSlide;
  $currentSlide.style.display = 'block';
  $currentSlide.className = elementID.current;
  updateCounter();

  // TODO - BBQ WAS HERE


  /*** EVENTS ***/ // ALL GOOD!

  // "next" arrow clicked => next slide
  $next.onclick = function(e){
    e.preventDefault();
    nextSlide();
  };

  // "previous" arrow clicked => previous slide
  $previous.onclick = function(e){
    e.preventDefault();
    previousSlide();
  };

  // Add keyboard shortcuts for changing slides
  window.onkeydown = function(e){
    if (e.which === 39) {
      // right key pressed => next slide
      nextSlide();
      return false;
    }
    else if (e.which === 37) {
        // left or l key pressed => previous slide
        previousSlide();
        return false;
      }
  };

})();
