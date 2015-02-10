define(['http://code.jquery.com/jquery-2.1.3.min.js', '/src/WebApp.js'], function($, WebApp) {
	$ = jQuery;
	WebApp.registerApp(
		"MyApp", 
		WebApp.makeApplication, 
		{
			rootViewController: "MyTabsCtrl"
		}
	);

	WebApp.registerViewController(
		"MyTabsCtrl",
		WebApp.makeTabsViewController,
		{
			template: "templates/tabsView.html",
			didLoad: function() {
				var that = this;
				that.divTabs = $("<div>").addClass("tabs").addClass("tabs-icon-top");
				$(that.contentElement).after(that.divTabs);
				that.tabs.forEach(function(tab, idx) {
					var $a = $("<a>").addClass("tab-item");
					if(tab.icon.length > 0) {
						$a.append('<i class="icon ion-' + tab.icon +'"></i>');
					}
					$a.append(tab.label);
					$a.appendTo(that.divTabs);
					$a.click(that, function(event) {
						event.data.select(idx);
					});
				});
				that.select(0);
			},
			willUnselect: function(idx) {
				$(this.tabs[idx].viewController.element).hide();
			},
			willSelect: function(idx) {
			},
			didSelect: function(idx) {
				$(this.tabs[idx].viewController.element).show();
				$(">a.active", this.divTabs).removeClass("active");
				$(">a:nth-child(" + (idx+1) +")", this.divTabs).addClass("active");
			}
		}
	);

	WebApp.registerViewController(
		"MyTabsCtrl2",
		WebApp.makeTabsViewController,
		{
			template: "templates/tabsView2.html",
			didLoad: function() {
				var that = this;
				that.divTabs = $("<div>").addClass("tabs").addClass("tabs-icon-top");
				$(that.contentElement).after(that.divTabs);
				that.tabs.forEach(function(tab, idx) {
					var $a = $("<a>").addClass("tab-item");
					if(tab.icon.length > 0) {
						$a.append('<i class="icon ion-' + tab.icon +'"></i>');
					}
					$a.append(tab.label);
					$a.appendTo(that.divTabs);
					$a.click(that, function(event) {
						event.data.select(idx);
					});
				});
				$(that.contentElement).addClass("has-tabs scroll-content");
				that.select(0);
			},
			willUnselect: function(idx) {
				$(this.tabs[idx].element).hide();
			},
			willSelect: function(idx) {
			
			},
			didSelect: function(idx) {
				$(this.tabs[idx].element).show();
				$(">a.active", this.divTabs).removeClass("active");
				$(">a:nth-child(" + (idx+1) +")", this.divTabs).addClass("active");
			}
		}
	);

	WebApp.registerViewController(
		"MyNavCtrl",
		WebApp.makeNavigationViewController,
		{
			template: "templates/navView.html",
			timeBeforeUnloadingView: 1000,
			didLoad: function() {
				$(this.contentElement).addClass("scroll-content has-header");
				$(this.uiElements.back).click(this, function(event) {
					event.data.pop();
				});
				$(this.uiElements.next).click(this, function(event) {
					event.data.push(
						WebApp.createViewController("MainViewController")
					);
				});
			},
			willPush: function(vc) {
				this.oldTop = this.top();
			},
			didPush: function() {
				var that = this;
				var top = this.top();
				var theTop = $(top.element);
				theTop.css("transition", "");
				theTop.css("background-color","white");
				if(that.oldTop) {
					theTop.css("left", "100%");
					theTop.css("right", "-100%");
					setTimeout(function(){
						theTop.css("transition", "left 0.3s, right 0.3s");
						theTop.css("right", "0");
						theTop.css("left", "0");
					}, 100);
				} else {
					theTop.css("right", "0");
					theTop.css("left", "0");				
				}
			},
			willPop: function(vc) {
				var thePop = $(vc.element);
				thePop.css("transition", "left 0.3s, right 0.3s");
				thePop.css("left","100%");
				thePop.css("right","-100%");
			},
			didChangeTop: function() {
				$(this.uiElements.back).attr("disabled", this.history.length<=1);
			}
		}
	);

	WebApp.registerViewController(
		"MainViewController", 
		WebApp.makeViewController, 
		{
			template: "templates/mainView.html",
			willLoad: function() {
				var that = this;
				that.ts = Date.now();
			},
			didLoad: function() {
				var that = this;
				$(that.element).addClass("padding").addClass("scroll-content");
				var nvc = that.navigationViewController;
				if(nvc) {
					$(that.uiElements.go).click(that, function(event) {
						event.data.navigationViewController.push(
							WebApp.createViewController("MainViewController")
						);
					});
					$(that.uiElements.back).click(that, function(event) {
						event.data.navigationViewController.pop();
					});
					$(that.uiElements.home).click(that, function(event) {
						while(event.data.navigationViewController.history.length > 1) {
							event.data.navigationViewController.pop();
						}					
					});
					$(that.uiElements.back).attr("disabled", nvc.history.length<=1);
				} else {
					$(that.uiElements.go).attr("disabled", true);
					$(that.uiElements.back).attr("disabled", true);
					$(that.uiElements.home).attr("disabled", true);
				}
			},
			didAppear: function() {
				var that = this;
				var nvc = that.navigationViewController;
				if(nvc) {
					$(nvc.uiElements.title).text(that.ts);
				}
			}
		}
	);

	WebApp.registerViewController(
		"MainViewController2", 
		WebApp.makeViewController,
		{
			template: "templates/mainView2.html",
			didLoad: function() {
				$(this.element).addClass("scroll-content padding");
				if(this.navigationViewController) {
					$(this.navigationViewController.uiElements.title).setText("Main view 2");
				}
				$(this.uiElements.openModal).click(function() {
					var that = $(this);
					that.attr("disabled", true);
					var modalVC = WebApp.createViewController(
						"MyModalCtrl", 
						{
							willClose : function() {
								that.attr("disabled", false);
							}
						});
					modalVC.open();
				});
			}
		}
	);

	WebApp.registerViewController(
		"MainViewController3", 
		WebApp.makeViewController,
		{
			template: "templates/mainView3.html",
			didLoad: function() {
				$(this.element).addClass("scroll-content padding");
			}
		}
	);

	WebApp.registerViewController(
		"MyModalCtrl", 
		WebApp.makeModalViewController,
		{
			template: "templates/modal.html",
			open: function() {
				this.willOpen();
				this.loadView($("<div>").get(0));
				this.didOpen();
			},
			close: function() {
				var that = this;
				that.willClose();
				$(that.element)
				.css("top", "150%");

				setTimeout(function() {
					that.didClose();
					that.unloadView();
				}, 1000);
			},
			willLoad: function() {
				$(this.element)
				.addClass("scroll-content padding")
				.css("position", "fixed")
				.css("top", "100%")
				.css("transition", "top 0.5s")
				.css("background-color","white")
				.css("z-index", 5)
				.css("width", "100%")
				.css("height", "100%");

				$("body").append(this.element);
			},
			didLoad: function() {
				var that = this;
				$(that.uiElements.close).click(that, function(event){
					event.data.close();				
				});
				setTimeout(function(){
					$(that.element).css("top","0");
				}, 100);
			}
		}
	);

	$(function() {
		var myApp = WebApp.apps["MyApp"].maker(WebApp.apps["MyApp"].options);
		myApp.launch();
	});
});

