/**
* Simple Slides 3.0
* a simple jQuery plugin to turn your HTML into slides
* @author Jenn Schiffer
*
* The MIT License (MIT)
* 
* Copyright (c) 2013 Jenn Schiffer
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/


(function($) {
	
	var pluginName = "simpleslides";

	var DOM = {
		$document : $(document),
	};
	
	var ID = {
		slide : 'slide',
		counter : 'counter',
		navigation : 'navigation',
		next : 'next',
		previous : 'previous',
		current : 'current'
	};
	
	var labels = {
		next : '&rarr;',
		previous : '&larr;',
		separator : ' / '
	};
		
	var methods = {

		init : function () {
			
			var $this = $(this).addClass(pluginName);
			var $slides = $this.children().addClass(ID.slide);
			
			$this.append($('<div>').attr('id',ID.next).addClass(ID.navigation).html(labels.next));
			$this.append($('<div>').attr('id',ID.previous).addClass(ID.navigation).html(labels.previous));
			$this.append($('<div>').attr('id',ID.counter));

			var $navigation = $('.'+ID.navigation);
			var $next = $('#'+ID.next);
			var $prev = $('#'+ID.previous);
			var $counter = $('#'+ID.counter);
			var $firstSlide = $slides.first();
			var $lastSlide = $slides.last();
			var $currentSlide = $firstSlide;
			var thisSlidePointer = 1;
			var lastSlidePointer = $slides.length;
									
			var data = {
				$slideshow : $this,
				$slides : $slides,
				$next : $next,
				$prev : $prev,
				$counter : $counter,
				$currentSlide : $currentSlide,
				$firstSlide : $firstSlide,
				$lastSlide : $lastSlide,
				thisSlidePointer : thisSlidePointer,
				lastSlidePointer : lastSlidePointer
			};
			
			var css = {
				slide : { 
					'position' : 'absolute',
					'top' : '0',
					'left' : '0',
					'height' : '100%',
					'width' : '100%',
					'padding' : '20px'
				},
				navigation : {
					'position' : 'absolute',
					'bottom' : '10px',
					'z-index' : '1000',
					'cursor' : 'pointer'
				},
				next : { 
					'right' : '10px'
				},
				prev : { 
					'left' : '10px'
				},
				counter: { 
					'position' : 'absolute',
					'top' : '10px',
					'right' : '10px',
					'display' : 'inline-block'
				}
			};
			
			$slides.css(css.slide);
			$navigation.css(css.navigation);
			$next.css(css.next);
			$prev.css(css.prev);
			$counter.css(css.counter);
			
			$slides.hide();
			$currentSlide.show().addClass(ID.current);

								
			$this.data(pluginName, data);
			
			initUIEvents($this);
	
			methods.updateCounter.call($this);
		},
	
		updateCounter : function() {
			var $this = $(this);
			var data = $this.data(pluginName);

			data.$counter.text(data.thisSlidePointer + labels.separator + data.lastSlidePointer);
		},
		
		hideCurrentSlide : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			
			data.$currentSlide.fadeOut().removeClass(ID.current);
		},
		
		nextSlide : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			
			var nextSlide = data.$currentSlide.next();
			
			methods.hideCurrentSlide.call($this);
			
			if ( data.thisSlidePointer != data.lastSlidePointer ) {
				nextSlide.fadeIn().addClass(ID.current);
				data.$currentSlide = nextSlide;
				data.thisSlidePointer++;
			}
			else {
				data.$firstSlide.fadeIn().addClass(ID.current);
				data.$currentSlide = data.$firstSlide;
				data.thisSlidePointer = 1;
			}
			
			methods.updateCounter.call($this);
		},
		
		previousSlide : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			
			var prevSlide = data.$currentSlide.prev();

			methods.hideCurrentSlide.call($this);
			
			if ( data.thisSlidePointer != 1 ) {
				prevSlide.fadeIn().addClass(ID.current);
				data.$currentSlide = prevSlide;
				data.thisSlidePointer--;
			}
			else {
				data.$lastSlide.fadeIn().addClass(ID.current);
				data.$currentSlide = data.$lastSlide;
				data.thisSlidePointer = data.lastSlidePointer;
			}
			
			methods.updateCounter.call($this);	
		}

	};


    /** MODULE DEFINITION **/

 	$.fn[pluginName] = function(method) {
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this,arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };
        
    
    /** EVENTS **/
	
	var initUIEvents = function ($this) { 

		$('#' + ID.next).click( function() { 
			$this[pluginName]('nextSlide')
		});

		$('#' + ID.previous).click( function() { 
			$this[pluginName]('previousSlide')
		});

		DOM.$document.keydown(function(e){
			if (e.which == 39) { 
				$this[pluginName]('nextSlide');
				return false;
			}
			else if (e.which == 37) {
					$this[pluginName]('previousSlide');
					return false;
				}
		});

    }
	

})( jQuery );