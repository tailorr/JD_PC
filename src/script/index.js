$(function() {
	//Top Banner
	$('.banner-close').click(function() {
		$('.m-banner').animate({
			'opacity': '0',
			'height': '0'
		});
	});

	$('.ad-bg').hover(function() {
		$('.mask').animate({
			'width': $('.mask').parent().outerWidth()
		}, 500)
	}, function() {
		$('.mask').animate({
			'width': 0
		}, 200)
	});

	//Top Bar/sideBar
	sideBar();
	
	var down = true;
	$(window).on('scroll resize', function() {
		if ($(this).scrollTop() >= $('.m-seckill').offset().top - $('.m-topbar').outerHeight() && down) {
			$('.m-topbar').animate({
				'top': 0
			}, 400);
			down = false;
		}
		if ($(this).scrollTop() < $('.m-seckill').offset().top - $('.m-topbar').outerHeight() && !down) {
			$('.m-topbar').animate({
				'top': -50
			}, 100);
			down = true;
		}
		sideBar();
	});

	$(window).on('scroll',sideBarActive);

	$('.sidebar-item').click(function() {
		$(window).off('scroll',sideBarActive);
		$('.sidebar-item').removeClass('active');
		$(this).addClass('active');
		$('html,body').animate({
			'scrollTop': ($('.m-enjoy').eq($(this).index()).offset().top - $('.m-topbar').outerHeight())
		}, function() {
			$(window).on('scroll',sideBarActive);

			if ($('.water-fall-wrap').offset().top + $('.water-fall-wrap').outerHeight() < $(window).scrollTop() + $(window).height() && page < 3) {
				page++;
				picLoad();
			}

		})

	});

	centerVertical('.m-sidebar-right-middle');
	$(window).on('resize', function() {
		centerVertical('.m-sidebar-right-middle');
	});

	backToTop('.back-to-top');

	//Drop Menu
	var dropMenu = new DropMenu('#city', {
		'callback': function() {
			$('.city-list').find('a').on({
				'mouseover': function() {
					if ($(this).attr('class') == 'inner-active') {
						return;
					}
					$('.city-list').find('a').removeClass('hover');
					$(this).addClass('hover');
				},
				'click': function() {
					$('.city-list').find('a').removeClass('inner-active').removeClass('hover');
					$(this).addClass('inner-active');
					$('.city-name').html($(this).text());
				},
				'mouseout': function() {
					$('.city-list').find('a').removeClass('hover');
				}
			});
		}
	});
	var dropMenu = new DropMenu('#my-jd');
	var dropMenu = new DropMenu('#my-customer');
	var dropMenu = new DropMenu('#my-navigation');
	var dropMenu = new DropMenu('#left-list');
	var dropMenu = new DropMenu('#shopping-cart');

	//Picture Carousel
	var picCarousel = new PicCarousel('#pic-carousel');

	//Skip
	linkSkip();

	//图片移动
	pictureShake('.shake-vertical', {
		'attr': 'top',
		'dir': 'minus',
		'dis': 5
	});

	pictureShake('.shake-horizontal-wider', {
		'attr': 'left',
		'dir': 'plus',
		'dis': 20
	});

	pictureShake('.shake-horizontal', {
		'attr': 'left',
		'dir': 'minus',
		'dis': 10
	});

	rightMenu();

	countDown('#countdown');

	//Mouse follow
	mouseFollow('.middle-header', {
		callback: function(index) {
			$.ajax({
				method: 'get',
				dataType: 'json',
				url: "data/data.json",
				success: function(data) {
					var str = '';
					for (var i = 0; i < data.Promotion[0].content.length; i++) {
						str += '<li><a href="#">' + data.Promotion[index].content[i] + '</a></li>';
						$('.Promotion-notice').html(str);
					}
				}
			});
		}
	});

	mouseFollow('.rank', {
		callback: function(index) {
			$.ajax({
				method: 'get',
				dataType: 'json',
				url: "data/data.json",
				success: function(data) {
					var str = '';
					for (var i = 0; i < data.Rank[0].src.length; i++) {
						str += '<li class="bottom-border right-border"><a href="#"><img class="rank-thumbnail" src="' + data.Rank[index].src[i] + '"><p>' + data.Rank[index].description[i] + '</p></a></li>';
					}
					$('.rank-list').html(str);
				}
			});
		}
	});


	picLoad(); //第一页图片初始化
	var page = 0;
	$(window).on('scroll', function() {
		if ($('.water-fall-wrap').offset().top + $('.water-fall-wrap').outerHeight() < $(window).scrollTop() + $(window).height() && page < 3) {
			page++;
			picLoad();
		}
		lazyLoad('.water-fall-wrap');
	});

	$('.sidebar-item').last().click(function() {
		// $(window).on('scroll', function() {
			lazyLoad('.water-fall-wrap');
		// });
	});
})

//图片延迟加载
function lazyLoad(className) {
	var obj = $(className);
	var aImg = obj.find('img');
	aImg.each(function(index) {
		if (aImg.eq(index).offset().top < $(window).scrollTop() + $(window).height()) {
			setTimeout(function() {
				aImg.eq(index).attr('src', aImg.eq(index).attr('xsrc')).animate({
					'opacity': 1
				}, 100)
			}, 200)
		}
	})
}

function picLoad() {
	$.ajax({
		method: 'get',
		dataType: 'json',
		url: 'data/picList.json',
		success: function(data) {
			var aLi = $('.fall-list').find('li');
			for (var i = 0; i < data.list.length; i++) {
				var short = getShortLi('.fall-list');
				$oDiv = $('<div>');
				aLi.eq(short).append($oDiv);
				$oA = $('<a>');
				$oDiv.append($oA);
				$oImg = $('<img>')
				$oImg.attr({
					'src': data.src,
					'xsrc': data.list[i].xsrc
				})
				$oA.append($oImg);
				$oA.append('<p class="describe">' + data.list[i].describe + '</p>');
				$oA.append('<p class="price">' + data.list[i].price + '</p>');
			}
		}
	})
}

//图片移动
function pictureShake(className, opt) {
	var obj = $(className);
	var opt = opt || {};
	var ahover = obj.find('a');
	var elm = null;
	ahover.each(function(index) {
		ahover[index].moved = false;
		ahover[index].original = 0;
		ahover[index].target = 0;
	})

	if (opt.dir == 'plus') {
		opt.dis = opt.dis;
	}
	if (opt.dir == 'minus') {
		opt.dis = -opt.dis;
	}
	ahover.hover(function() {
		elm = $(this).find('img') || $(this).find('.item-inner');
		if (!this.moved) {
			this.moved = true;
			this.original = parseInt(elm.position()[opt.attr]);
			this.target = parseInt(opt.dis) + this.original;
		}
		nowPosition = {};
		attr = opt.attr;
		nowPosition[attr] = this.target;
		elm.animate(nowPosition, 200);
	}, function() {
		nowPosition[attr] = this.original;
		elm.stop(true);
		elm.animate(nowPosition, 200);
	})
}

//右侧边菜单
function rightMenu() {
	$('.sidebar-right-item').each(function(index) {
		$('.sidebar-right-item').eq(index).hover(function() {
			obj = $(this);
			clearTimeout(obj.timer);
			obj.addClass('active-outer');
			$('.item-inner').eq(index).css('background', '#8e090c');
			obj.timer = setTimeout(function() {
				obj.css('border-radius', 0)
				$('.item-inner').eq(index).animate({
					'left': -$('.item-inner').outerWidth()
				}, 300);
			}, 200)
		}, function() {
			clearTimeout(obj.timer);
			$('.item-inner').eq(index).css('background', '#7a6e6e');
			obj.removeClass('active-outer');
			obj.timer = setTimeout(function() {
				obj.css('border-radius', '3px 0 0 3px')
				$('.item-inner').eq(index).animate({
					'left': 0
				}, 300);
			}, 200)
		})
	})
}

//sideBar
function sideBar() {
	centerVertical('.m-sidebar');
	if ($(this).scrollTop() >= $('.enjoy-quality').offset().top - $(window).height() / 2) {

		$('.m-sidebar').animate({
			'opacity': 1
		}, 50);

		$('.m-sidebar-right ').animate({
			'opacity': 1
		}, 50);
	} else {
		$('.m-sidebar').animate({
			'opacity': 0
		}, 5);
		$('.m-sidebar-right ').animate({
			'opacity': 0
		}, 5);
	}
}

//左侧边点击滚动
function sideBarActive() {
	$('.sidebar-item').each(function(index) {
		if ($('.sidebar-item').eq(index).offset().top >= $('.m-enjoy').eq(index).offset().top) {
			$('.sidebar-item').removeClass('active');
			$('.sidebar-item').eq($(this).index()).addClass('active');
		}
	})
}

//元素自动居中
function centerVertical(className) {
	var obj = $(className);
	var top = ($(window).height() - obj.outerHeight()) / 2;
	obj.css({
		'top': top
	});
}

//回到顶部
function backToTop(className) {
	var obj = $(className);
	obj.click(function() {
		$('html,body').animate({
			'scrollTop': 0
		});
	})
}

//linkSkip
function linkSkip() {
	$('.active-header').find('.slide').on('mouseenter', jump);
	$('#close').hover(function() {
		$(this).css({
			'background': 'url(bg/active-close.png) #ddd no-repeat center center',
			'background-position': '0 -15px'
		});
	}, function() {
		$(this).css({
			'background-position': '0 0'
		});
	});
	$('#close').click(function() {
		$('.forbid').off('mouseenter');
		$('.active-header').find('.slide-bar').hide();
		$('.active-content').hide().css('top', 100);
		$('.bottom-list').find('i').slideDown(100);
	});
	$('.forbid').mouseleave(function() {
		$('.forbid').on('mouseenter', jump);
	});

	function jump() {
		$('.bottom-list').find('i').slideUp(300);
		$('.active-content').show().animate({
			'top': 24
		}, 400);
		$('.active-header').find('.slide-bar').show().css('left', $(this).position().left);
	}
}

//mouseFollow
function mouseFollow(className, opt) {
	var obj = $(className);
	var opt = opt || {};
	var slideBar = obj.find('.slide-bar');
	var src = obj.find('.slide');
	src.each(function(index) {
		$(this).mouseenter(function() {
			slideBar.stop(true, true);
			var target = parseInt($(this).position().left);
			opt.speed = opt.speed ? opt.speed : 5;
			slideBar.animate({
				left: target
			}, 300);
			if (opt.callback) {
				opt.callback(index);
			}
		})
	})
}

//倒计时
function countDown(id) {
	time();
	function time() {
		var timer = $(id),
			str = '',
			ms = (new Date('May 12,2018 17:18:32')) - (new Date()),
			hour = Math.floor(ms / 1000 % 86400 / 3600),
			minute = Math.floor(ms / 1000 % 86400 % 3600 / 60),
			second = Math.floor(ms / 1000 % 60);
		hour = checkTime(hour);
		minute = checkTime(minute);
		second = checkTime(second);
		str = '<span class="countdown-bg">' + hour + '</span><span class="no-bg">:</span><span class="countdown-bg">' + minute + '</span><span class="no-bg">:</span><span class="countdown-bg">' + second + '</span>';
		timer.html(str);
	}
	setInterval(time, 1000);

	function checkTime(i) {
		if (i < 10) i = '0' + i;
		return i;
	}
}

//Drop Menu
//基于JQ的延迟显示/隐藏菜单组件
function DropMenu(id, opt) {
	this.obj = $(id);
	this.timer = null;
	this.setting = {
		active: 'active',
		callback: function() {}
	}
	$.extend(this.setting, opt); //解决多个参数传参数量&顺序问题
	this.init();
}
DropMenu.prototype = {
	'constructor': DropMenu,
	init: function() {
		var self = this;
		this.obj.children().eq(0).hover(function() {
			clearTimeout(self.timer);
			$(this).addClass(self.setting.active);
			self.obj.children().eq(1).show();
		}, function() {
			self.timer = setTimeout(function() {
				self.obj.children().eq(0).removeClass(self.setting.active)
				self.obj.children().eq(1).hide();
			}, 50)
		});
		this.obj.children().eq(1).hover(function() {
			clearTimeout(self.timer);
			self.obj.children().eq(1).show();
		}, function() {
			self.timer = setTimeout(function() {
				self.obj.children().eq(0).removeClass(self.setting.active)
				self.obj.children().eq(1).hide();
			}, 50)
		});
		//显示后自定义其它效果
		this.setting.callback();
	}
}

//Picture Carousel
//基于JQ的图片轮播组件
function PicCarousel(id, opt) {
	this.obj = $(id);
	this.timer = null;
	this.num = 0;
	//默认参数
	this.defaults = {
		button: true,
		createFocusPoint: true
	};

	//传参处理
	$.extend(this.defaults, opt || {});
	this.init();
}

PicCarousel.prototype = {
	'constructor': PicCarousel,
	//初始化
	init: function() {
		var self = this;
		this.obj.children('.pic-list').children().css({
			'z-index': 0,
			'opacity': 0
		});
		this.obj.children('.pic-list').children().eq(this.num).css({
			'z-index': 1,
			'opacity': 1
		});

		this.autoPlay();
		if (this.defaults.createFocusPoint) this.createFocusPoint();
		if (this.defaults.button) this.createButton();

		//鼠标移入移出事件
		this.obj.hover(function() {
				clearInterval(self.timer);
			},
			function() {
				self.autoPlay();
			}
		)
	},

	//创建焦点 && 添加焦点点击事件
	createFocusPoint: function() {
		var self = this;
		this.obj.append('<ul class="list-dot"></ul>');
		this.obj.children('.pic-list').children().each(function() {
			self.obj.children('.list-dot').html(self.obj.children('.list-dot').html() + '<li>');
		});

		this.obj.children('.list-dot').children().eq(this.num).css({
			'background': '#db192a'
		});
		this.obj.children('.pic-list').children().each(function(index) {
			self.obj.children('.list-dot').children().eq(index).click(function() {
				self.num = index;
				self.change();
			});
		});
	},

	//创建左右按钮
	createButton: function() {
		var self = this;
		this.obj.append('<span class="pre"><</span><span class="next">></span>');
		this.obj.hover(function() {
			self.obj.find('span').css('opacity', '1');
		}, function() {
			self.obj.find('span').css('opacity', '0');
		});
		this.obj.find('span').hover(function() {
			$(this).css('background', 'rgba(0,0,0,0.5)');
		}, function() {
			$(this).css('background', 'rgba(0,0,0,0.2)');
		});
		$('.next').click(function() {
			self.num++;
			self.change();
		});
		$('.pre').click(function() {
			self.num--;
			self.change();
		});
	},

	//自动切换
	autoPlay: function() {
		var self = this;
		this.timer = setInterval(function() {
			self.num++;
			self.change();
		}, 3000)
	},

	//图片切换
	change: function() {
		this.num %= this.obj.children('.pic-list').children().size();
		this.obj.children('.pic-list').children().css('z-index', 0).animate({
			'opacity': 0.1
		}, 0);
		this.obj.children('.pic-list').children().eq(this.num).css('z-index', 1).animate({
			'opacity': 1
		}, 500);
		this.obj.children('.list-dot').children().css('background', '#fff');
		this.obj.children('.list-dot').children().eq(this.num).css({
			'background': '#db192a'
		});
	}
}

function getShortLi(className) {
	var index = 0;
	var aLi = $(className).find('li');
	var liHeight = aLi.eq(index).outerHeight();
	for (var i = 1; i < aLi.length; i++) {
		if (aLi.eq(i).outerHeight() < liHeight) {
			index = i;
			liHeight = aLi.eq(i).outerHeight();
		}
	}
	return index;
}