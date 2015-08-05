/**
 * Created by zhaimeiling on 2015/8/4.
 */
;(function($,win){
    var ernieObj;
    $.fn.ernie = function (opt) {
        var setting= $.extend({},$.fn.ernie.defaultData,opt);
        return this.each(function () {
            ernieObj=new ernieFn($(this),setting);
        })
    }
    $.fn.ernie.defaultData={
        circleTime:1000,//转一周时间
        autoStart:false,//是否默认旋转
        clockDemo:false,//是否为时钟模型
        hourId:'#hour',
        minuteId:'#fz',
        ernieComplete: function () {
            
        }//抽奖完成回调事件
    }
    //时钟模型初始化
    function ernieFn($this,setting) {
        this.$this=$this;
        this.setting=setting;
        this.stopClockIter=null;
        this.stopRotate=-1;//停止标志位
        if(this.setting.autoStart)this.start();
    }
    ernieFn.prototype={
        start:function(deg){
            var _this=this;
            if(_this.setting.clockDemo){//时钟模式
                _this.stopClockIter=setInterval(function () {
                    var t=new Date();
                    var hh= t.getHours();
                    var mm= t.getMinutes();
                    var ss= t.getSeconds();
                    _this.rotate(_this.$this,ss*6);
                    _this.rotate($(_this.setting.minuteId),mm*6);
                    _this.rotate($(_this.setting.hourId),hh/12*360+mm/2);
                },1000);
            }else{//摇奖模式
                var sogouInter;
                if(navigator.userAgent.toLowerCase().indexOf('sogoumse')>0){//sogou浏览器下出发重绘 不然不转动 至于怎么不让用户感觉到自己想办法把。。。呵呵
                    sogouInter=setInterval(function () {
                        _this.$this.toggleClass('ernie-reflow');
                    },1)
                }
                _this.$this.addClass('rotate-ernie');//开始旋转
                var stopInter=setInterval(function () {//不断检测stopRotate值，当不为-1时，停止旋转
                    if(_this.stopRotate!=-1){
                        clearInterval(stopInter);
                        _this.$this.removeClass('rotate-ernie');
                        var anim = CSSAnimations.create({
                            '0%': { transform: 'rotate(0deg)' },
                            '0%': {'-webkit-transform': 'rotate(0deg)' },
                            '100%': { transform: 'rotate('+_this.stopRotate+'deg)'},
                            '100%': { '-webkit-transform': 'rotate('+_this.stopRotate+'deg)'}
                        });
                        _this.$this.css({
                            'animation-name': anim.name,
                            'animation-duration': '2s',
                            'animation-iteration-count':'1',
                            'animation-fill-mode':'forwards',
                            '-webkit-animation-name': anim.name,
                            '-webkit-animation-duration': '2s',
                            '-webkit-animation-iteration-count':'1',
                            '-webkit-animation-fill-mode':'forwards'
                        });
                        setTimeout(function() {
                            CSSAnimations.remove(anim.name);
                            _this.$this.attr('style','');
                            console.log(_this.stopRotate);
                            _this.$this.css({'transform':'rotate('+_this.stopRotate+'deg)','-webkit-transform':'rotate('+_this.stopRotate+'deg)'})
                            if(sogouInter){clearInterval(sogouInter);}
                            _this.stopRotate=-1;
                            _this.setting.ernieComplete();
                        },2000);
                    }
                },800*2);
            }
        },
        rotate: function (obj,rotate) {
            rotate='rotate('+rotate+'deg)';
            obj.css({'transform':rotate,'-webkit-transform':rotate});
        },
        stop: function (deg) {
            var _this=this;
            if(_this.setting.clockDemo){//时钟停止
                clearInterval(_this.stopClockIter);
            }else{//摇奖停止
                _this.stopRotate=deg+360;
            }
        }
    }
    $.each(['start','stop'], function (key,val) {
        $.fn.ernie[val]= function () {
            if(!ernieObj)return false;
            ernieObj[val].apply(ernieObj,[].slice.call(arguments,0));
        }
    })
})(Zepto||jQuery,window)
