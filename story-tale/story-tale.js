/**
 * Created with JetBrains PhpStorm.
 * User: rusuandreirobert
 * Date: 03/12/13
 * Time: 08:32
 * Effect Recommended Appear List :
 *    'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight'
 * Effect Appear list :
 *    'fadeInUp', 'fadeInRight', 'fadeInDown', 'fadeInLeft',
 *    'fadeInUpBig', 'fadeInRightBig', 'fadeInDownBig', 'fadeInLeftBig'
 *    'bounceInUp', 'bounceInRight', 'bounceInDown', 'bounceInLeft'
 *    'flipInX', 'flipInY'
 *    'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight'
 */
var StoryTale = {

  containerObject             : {},
  containerPanels             : [],
  namespace                   : 'storytale',
  displayEffect               : ['rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight'],

  Init : function(container, displayEffect) {
    this.namespace = this.namespace + '-' +  parseInt(Math.random() * 1000);

    this.containerObject = container;
    this.displayEffect   = displayEffect;

    this._handleItemGroups();
    this.setContainerPanels();
    this.loadPanels();
  },

  _handleItemGroups : function() {
    this.containerObject.find("[data-story-tale-item-group]").each(function(){
      var attribute = (jQuery(this).attr('data-story-tale-item-group') != "" ?
          'data-story-tale-quick data-story-tale-container="' + jQuery(this).attr('data-story-tale-item-group') + '"' :
          'data-story-tale-quick data-story-tale-container');

      var html   = jQuery(this).html().trim(),
          pieces = html.split(" "),
          newHTML= "";

      for(var i = 0; i < pieces.length; i++)
        newHTML += '<span ' + attribute + ' style="display:inline-block;">' + pieces[i] + '</span>' + ' ';

      jQuery(this).html(newHTML);
    });
  },

  setContainerPanels : function() {
    var objectInstance = this;

    this.containerPanels = this.containerObject.find('[data-story-tale-item], [data-story-tale-container]');

    this.containerPanels.each(function(){
      if(typeof jQuery(this).attr('data-story-tale-item') != "undefined") {
        var html    = jQuery(this).html(),
            newHTML = '';

        for(var i = 0; i < html.length; i++)
          newHTML += '<span style="opacity: 0.0;display: inline-block;">' + (html[i] == " " ? '&nbsp;' : html[i]) + '</span>';

        jQuery(this).html(newHTML);
      } else {
        jQuery(this).css('opacity', '0.0');
      }
    });
  },

  loadPanels   : function() {
    var objectInstance = this;

    jQuery(window).bind('scroll.' + this.namespace, function(){
      objectInstance._handleDisplay();
    });

    objectInstance._handleDisplay();
  },

  _handleDisplay : function() {
    var currentScrollTop        = jQuery(window).scrollTop() + window.innerHeight,
        objectInstance          = this,
        panel                   = this.containerPanels.not('.story-tale-served').first();

    if(panel.length == 0) {
      jQuery(window).unbind('scroll.' + this.namespace);
      return;
    }

    if( !panel.hasClass('story-tale-served')
        && !panel.hasClass('story-tale-serving')
        && currentScrollTop >= panel.offset().top
        && currentScrollTop <= ( panel.offset().top + (panel.height() * 0.7) + jQuery(window).height())) {

      if(typeof panel.attr('data-story-tale-item') == "undefined") {
        panel.addClass('story-tale-serving');

        var effect = panel.attr('data-story-tale-container') == '' ? objectInstance.displayEffect : panel.attr('data-story-tale-container').split(',');

        panel.css('opacity', '1').addClass('animated ' + objectInstance._getRandomEffect(effect));

        if(panel.is('[data-story-tale-quick]')) {
          panel.removeClass('story-tale-serving').addClass('story-tale-served');
          objectInstance._handleDisplay();
        } else {
          setTimeout(function(){
            panel.removeClass('story-tale-serving').addClass('story-tale-served');
            objectInstance._handleDisplay();
          }, 1000);
        }

        return;
      }

      if(!(panel.find('> span').not('.story-tale-served').length > 0)) {
        panel.addClass('story-tale-served');
        return;
      }

      panel.addClass('story-tale-serving');

      panel.find('> span').each(function(){

        var effect = panel.attr('data-story-tale-item') == '' ? objectInstance.displayEffect : panel.attr('data-story-tale-item').split(',');

        jQuery(this).css('opacity', 1).addClass('story-tale-served animated ' + objectInstance._getRandomEffect(effect));
      }).promise().done(function() {
        if(panel.is('[data-story-tale-quick]')) {
          panel.removeClass('story-tale-serving').addClass('story-tale-served');
          objectInstance._handleDisplay();
        } else {
          setTimeout(function(){
            panel.removeClass('story-tale-serving').addClass('story-tale-served');
            objectInstance._handleDisplay();
          }, 1000);
        }
      });

    }
  },

  _getRandomEffect : function(effect) {
    return (effect instanceof Array ? effect[ Math.floor( Math.random() * effect.length )] : effect);
  }

};

jQuery(document).ready(function(){
  jQuery('[data-story-tale]').each(function(){
    var objectInstance = jQuery.extend(1, {}, StoryTale),
        effects        = jQuery(this).attr('data-story-tale');

    objectInstance.Init(jQuery(this), effects.split(','));
  });
});