(function ($) {
    $.fn.cross = function (options) {
        return this.each(function (i) { 
            var $$ = $(this);
            
            var target = $$.css('backgroundImage').replace(/^url|[\(\)'"]/g, '');

            $$.wrap('<span style="position: relative;"></span>')
                .parent()
                .prepend('<img>')
                .find(':first-child')
                .attr('src', target);

            if ($.browser.msie || $.browser.mozilla) {
                $$.css({
                    'position' : 'absolute', 
                    'left' : 0,
                    'background' : '',
                    'top' : this.offsetTop
                });
            } else if ($.browser.opera && $.browser.version < 9.5) {
                   
                $$.css({
                    'position' : 'absolute', 
                    'left' : 0,
                    'background' : '',
                    'top' : "0"
                });
            } else { // Safari
                $$.css({
                    'position' : 'absolute', 
                    'left' : 0,
                    'background' : ''
                });
            }
            $$.hover(function () {
                $$.stop().animate({
                    opacity: 0
                }, 250);
            }, function () {
                $$.stop().animate({
                    opacity: 1
                }, 250);
            });
        });
    };
    
})(jQuery);

$(window).bind('load', function () {
    $('img.fade').cross();
});