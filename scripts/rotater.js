function goFullscreen(){var e=$("#slide-container").get(0),t=e.webkitRequestFullscreen||e.requestFullscreen;t.call(e)}function accelerate(e){return Math.pow(e,3)}function decelerate(e){return 1-Math.pow(1-e,3)}function FormSlide(e,t,n){this.$container=e,this.scene=t,this.info=n,this.theme=this.info.theme||this.scene.theme,this.instantiate()}function startScene(){stopScene(),g_slides=[];for(var e=0;e<g_scene.slideInfos.length;e++){var t=$.extend({},g_scene.slideInfos[e]);g_debug&&(t.duration*=.25);var n=new FormSlide($("#slide-container"),g_scene,t);g_slides.push(n)}g_currentSlideIndex=-1,nextSlide()}function stopScene(){g_slides.length&&$("#slide-container").css("background-color",g_slides[0].theme.colorbg);for(var e=0;e<g_slides.length;e++)g_slides[e].resetAnimation();g_slides=[],g_nextSlideTimeout&&(window.clearTimeout(g_nextSlideTimeout),g_nextSlideTimeout=0),g_transitionEndTimeout&&(window.clearTimeout(g_transitionEndTimeout),g_transitionEndTimeout=0),$("#slide-container").empty()}function nextSlide(){++g_currentSlideIndex,g_currentSlideIndex>=g_slides.length&&(g_currentSlideIndex=0);var e=g_slides[g_currentSlideIndex];$("#slide-container").css("background-color",e.theme.colorbg),e.prepareToShow(),$(".slide").css("z-index",0).css("opacity",0).removeClass("active"),e.$el.addClass("active").addClass("transition").css("z-index",1),setTimeout(function(){e.$el.css("opacity",1)},0),g_transitionEndTimeout=window.setTimeout(function(){e.play(),$(".slide:not(.active)").css("opacity",0),g_transitionEndTimeout=0},TRANSITION_TIME),g_nextSlideTimeout&&window.clearTimeout(g_nextSlideTimeout),g_nextSlideTimeout=window.setTimeout(nextSlide,e.info.duration+TRANSITION_TIME)}function showMenu(){var e=$("#menu-container");$("<h1>").text("Rotater Menu").appendTo(e);var t=[];for(var n in SCENES){var i=SCENES[n];i.id=n,t.push(i)}t.sort(function(e,t){return e.order-t.order});for(var a=0;a<t.length;a++){var i=t[a],r=$("<div>").addClass("item").appendTo(e);i.newGroup&&r.addClass("newgroup"),$("<a>").attr("href","?"+i.id).text(i.title).appendTo(r)}e.show(),$("#full-screen-button").hide()}var PRE_SHAPES_IN_TIME=g_debug?100:500,PRE_SHAPES_OUT_TIME=PRE_SHAPES_IN_TIME,TRANSITION_TIME=1e3,DRAW_STATES={NONE:0,DRAWING_FORWARD:1,DRAWING_REVERSE:2},g_debug=document.location.search.indexOf("_debug")>0,g_sceneName=document.location.search.replace(/^\?/,"").replace(/_debug/,""),g_scene=SCENES[g_sceneName],g_slides=[],g_currentSlideIndex,g_nextSlideTimeout,g_transitionEndTimeout;document.fullscreenEnabled||document.webkitFullscreenEnabled||$("#full-screen-button").hide(),$("#full-screen-button").click(function(){goFullscreen()}),$(document).on("keydown",function(e){if(g_sceneName){var t=String.fromCharCode(e.keyCode).toLowerCase();"s"==t?startScene():"e"==t?stopScene():"f"==t&&goFullscreen()}}),FormSlide.prototype.instantiate=function(){this.$el=$("<div>").addClass("slide").css("background-color",this.theme.colorbg).appendTo(this.$container),this.formFaceInstance=this.createFormFaceInstance_(),this.formFaceInstance.setTime(0),this.formFaceInstance.draw(),this.$el.append(this.formFaceInstance.getCanvas())},FormSlide.prototype.createFormFaceInstance_=function(){var e=this.info.text;this.info.textFn&&(e=this.info.textFn());var t={theme:this.theme,letterHeight:144,padding:36,densityMultiplier:window.devicePixelRatio};if(this.info.instanceOptions)for(var n in this.info.instanceOptions)t[n]=this.info.instanceOptions[n];return g_debug&&(t.animGlyphDuration=250,t.animGlyphAverageDelay=20),formFace.createInstance(e,t)},FormSlide.prototype.prepareToShow=function(){this.info.textFn&&(this.formFaceInstance=this.createFormFaceInstance_(),this.formFaceInstance.setTime(0),this.formFaceInstance.draw(),this.$el.empty().append(this.formFaceInstance.getCanvas()))},FormSlide.prototype.play=function(){this.resetAnimation();var e=this;this.playOriginTime=Number(new Date),this.drawStartTime=0,this.drawState=DRAW_STATES.NONE,this.drawTimeoutHandle=0,this.drawAnimationFrameHandle=0;var t=function(){var n;switch(e.drawState){case DRAW_STATES.NONE:n=PRE_SHAPES_IN_TIME,e.formFaceInstance.setTime(0),e.formFaceInstance.draw(),e.drawState=DRAW_STATES.DRAWING_FORWARD,e.drawStartTime=Number(new Date)+n,e.formFaceInstance.setAnimInterpolator(accelerate),e.drawTimeoutHandle=window.setTimeout(t,n);break;case DRAW_STATES.DRAWING_FORWARD:var i=Number(new Date)-e.drawStartTime;e.formFaceInstance.setTime(i),e.formFaceInstance.draw(),i<e.formFaceInstance.getEndTime()?e.drawAnimationFrameHandle=requestAnimationFrame(t):(n=e.playOriginTime+e.info.duration-e.formFaceInstance.getEndTime()-PRE_SHAPES_OUT_TIME-Number(new Date),e.drawState=DRAW_STATES.DRAWING_REVERSE,e.drawStartTime=Number(new Date)+n,e.formFaceInstance.setAnimInterpolator(decelerate),e.drawTimeoutHandle=window.setTimeout(t,n));break;case DRAW_STATES.DRAWING_REVERSE:var i=e.formFaceInstance.getEndTime()-(Number(new Date)-e.drawStartTime);e.formFaceInstance.setTime(i),e.formFaceInstance.draw(),i>0?e.drawAnimationFrameHandle=requestAnimationFrame(t):(e.drawState=DRAW_STATES.NONE,e.drawTimeoutHandle=0)}};t()},FormSlide.prototype.resetAnimation=function(){this.drawTimeoutHandle&&window.clearTimeout(this.drawTimeoutHandle),this.drawAnimationFrameHandle&&window.cancelAnimationFrame(this.drawAnimationFrameHandle)},g_sceneName?startScene():showMenu();