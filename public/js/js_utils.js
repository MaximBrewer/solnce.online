/*==================================*/
/* The Pattern Engine Version 3.0   */
/* Copyright: FSG a.k.a ManiaC      */
/* Contact: imroot@maniacalipsis.ru */
/* License: GNU GPL v3              */
/*----------------------------------*/
/* Main JS utils useful for both    */
/* user and admin sides             */
/*==================================*/

/*===========================================================================================================*/
/* This file is part of The Pattern Engine.                                                                  */
/* The Pattern Engine is free software: you can redistribute it and/or modify it under the terms of the      */
/* GNU General Public License as published by the Free Software Foundation, either version 3 of the License. */
/* The Pattern Engine is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;           */
/* without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.                 */
/* See the GNU General Public License for more details.                                                      */
/* You should have received a copy of the GNU General Public License along with The Pattern Engine.          */
/* If not, see http://www.gnu.org/licenses/.                                                                 */
/*===========================================================================================================*/

/*---------------------------------------------------*/
/* Define site-specific scrpits into different files */
/*---------------------------------------------------*/

//------ common funcs for working with content sizes and positions ------//
function cursorToAbsolute(e_)
{
   //Function cursorToAbsolute returns coordinates relative to document body (considering a page scrolling). It may be used for both mouse and touch events in same way
   //TODO: this function is outdated
   return (e_.type&&e_.type.match(/^touch/i)) ? {X:e_.changedTouches[e_.changedTouches.length-1].clientX,Y:e_.changedTouches[e_.changedTouches.length-1].clientY} : {X:e_.clientX+getScrollLeft(),Y:e_.clientY+getScrollTop()};
}

function touchesToRelative(e_,node_)
{
   var res=[];
   var nodeRect=node_.getBoundingClientRect();
   
   var touches=e_.changedTouches;   //TODO: unchanged touches?
   for (var touch of touches)
      res.push({x:touch.clientX-nodeRect.x,y:touch.clientY-nodeRect.y});
   
   return res;
}

function cursorToRelative(e_,node_)
{
   var nodeRect=node_.getBoundingClientRect();
   return {x:e_.clientX-nodeRect.x,y:e_.clientY-nodeRect.y};
}

function getElementOffset(element_,fromElement_)
{
   var res={top:0,left:0};
   while (element_&&(element_!=fromElement_))
   {
      res.top+=element_.offsetTop;
      res.left+=element_.offsetLeft;
      
      element_=element_.offsetParent;
   }
   return res;
}

//------------------------------- Utilities for several common site elements ----------------------------------------//

//------- Functions for customized input elements -------//
function checkboxRepaint(e_)
{
   if (this.checked)
      this.parentNode.classList.add('checked');
   else
      this.parentNode.classList.remove('checked');
}

function initCheckbox(checkbox_)
{
   if (checkbox_)
   {
      checkbox_.repaint=checkboxRepaint;
      checkbox_.repaint();  //reflect initial state
      checkbox_.addEventListener('click',checkboxRepaint);
      checkbox_.addEventListener('focus',function(e_){this.parentNode.classList.add('focused');});
      checkbox_.addEventListener('blur' ,function(e_){this.parentNode.classList.remove('focused');});
   }
}

function initCheckboxes()
{
   var checkboxes=document.querySelectorAll('label.checkbox input[type=checkbox]');
   for (var checkbox of checkboxes)
      initCheckbox(checkbox);
}

function radioRepaint(e_)
{
   var radios=document.querySelectorAll('input[type=radio][name=\''+this.name+'\']');
   for (var radio of radios)
      radio.parentNode.classList.toggle('checked',radio.checked);
}

function initRadio(radio_)
{
   radio_.repaint=radioRepaint;
   radio_.parentNode.classList.toggle('checked',radio_.checked); //reflect initial state
   
   radio_.addEventListener('click',radioRepaint);
   
   radio_.addEventListener('focus',function(e_){this.parentNode.classList.add('focused');});
   radio_.addEventListener('blur' ,function(e_){this.parentNode.classList.remove('focused');});
}

function initRadios()
{
   var radios=document.querySelectorAll('.radio>input[type=radio]');
   for (var radio of radios)
      initRadio(radio);
}

function numericInputScroll(e_) //allows to change value of text input using a mouse wheel (for inputs, intended only for numeric values)
{
   //TODO: revision required
   var ort=mouseWheelOrt(e_);
   if (e_.target)
      {
         var max=e_.target.max;
         var min=e_.target.min||0;
         var inc=e_.target.step||1;
         
         if ((e_.target.value!==undefined)&&isFinite(e_.target.value)) //if target.value is numeric, then inc or dec it.
         {
            var new_val=Number(e_.target.value)+(ort*inc);
            new_val.toPrecision(3);
            
            if (max!==undefined)   //bound new value to limits
               if (new_val>max)
                  new_val=max;
            if (new_val<min)
               new_val=min;
            
            e_.target.value=new_val;         //assign new value
         }
         else
             e_.target.value=(ort>0) ? min : max||min;   //if target.value is not numeric, assign a numeric value.
         
         if (e_.preventDefault)
            e_.preventDefault();
         return false;
      }
   else 
       return true;
}

function mixed_input_scroll(e_) //allow to change numeric values of text input using mouse wheel, but not changes a NaN values
{
   //TODO: revision required
   var ort=mouseWheelOrt(e_);
   if (e_.target)
      {
         var max=e_.target.max;
         var min=e_.target.min||0;
         
         if ((e_.target.value===undefined)||(e_.target.value==''))	//if target has no value, assign min or max numeric value. Do nothing, if value is not numeric, nor empty string
            e_.target.value=(ort>0) ? min : max||min;
         else
             if (e_.target.value&&isFinite(e_.target.value))
                if (((e_.target.value==min)&&(ort<0))||                       //if target.value is min or max, then assign ''
                    ((e_.target.value==max)&&(ort>0)))
                   e_.target.value='';
                else
                    numeric_input_scroll(e_);                                 //if target.value is other numeric, then use numeric_input_scroll
         
         if (e_.preventDefault)
            e_.preventDefault();
         return false;
      }
   else 
       return true;
}

function toggle(val_,val1_,val2_)
{
   var res=val_;
   
   if (val_==val1_)
      res=val2_;
   else
      res=val1_;
   
   return res;
}

function InitNumericInputs()
{
   var numInputs=document.querySelectorAll('input[type=number],input[class~=number]');
   for (var inp of numInputs)
      inp.addEventListener('keypress',numericInputRestrict);
}

function numericInputRestrict(e_)
{
   if ((!(/^([0-9.,-]|Tab|Backspace|Del|Enter|Escape|Arrow.*|Page.*|Home|End|Insert)$/i.test(e_.key)||e_.ctrlKey||e_.altKey))||((e_.key=='.'||e_.key==',')&&(/[,.]/.test(this.value))))
      return cancelEvent(e_);
}

function switch_val(form_name_,input_name_,val1_,val2_,case_sensitive_)  //assigns val2_ to input's value if it is equal to val1_, Otherwise assigns val1_.
{
   //TODO: replace with "toggle"
   var input__=document.forms[form_name_][input_name_];
   var reg=new RegExp('^'+val1_+'$',(case_sensitive_ ? 'i' : ''));
   if (input__.value&&reg.test(input__.value))
      input__.value=val2_;
   else
       input__.value=val1_;
}

function forceKbLayout(e_,dest_)  //convert entering characters to target layout
{
   //console.log(e_);
   var char=e_.charCode; 
   char=String.fromCharCode(char);
   
   var input=e_.target;
   
   var L1='qwert`yuiop[]asdfghjkl;\'zxcvbnm,./QWERT~YUIOP{}ASDFGHJKL:"ZXCVBNM<>?@#$%^&', //complement latin characters on standard cyrillic keyboard keys
       L2='йцукеёнгшщзхъфывапролджэячсмитьбю.ЙЦУКЕЁНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,"№;%:?';  //cyrillic character set.
   var from_str,to_str,
       pos,res;
   
   switch (dest_)
         {
            case 'r':
            case 'R':
            case 'c':
            case 'C': {
                         from_str=L1;
                         to_str=L2;
                         break;
                      }
            case 'e':
            case 'E':
            case 'l':
            case 'L' : {
                          from_str=L2;
                          to_str=L1;
                          break;
                       }
            default: return true;
         }
    
   pos=from_str.indexOf(char);
   if (pos>-1)
      res=to_str[pos];
   else
       return true;
   
   var sel_start=(input.selectionDirection=="forward") ? input.selectionStart : input.selectionEnd   ;
   var sel_end  =(input.selectionDirection=="forward") ? input.selectionEnd   : input.selectionStart ;
   var sel_dir  = input.selectionDirection;
   
   input.value=input.value.substring(0,sel_start)+res+input.value.substring(sel_start);
   
   sel_start++;
   
   input.selectionStart=sel_start;
   input.selectionEnd  =sel_start;
   input.selectionDirection="forward";
   
   e_.preventDefault? e_.preventDefault() : e_.returnValue=false;
   return true;
}

//------- Cookie-based sorting controls -------//
function initSortingButtons(buttons_)
{
   if (buttons_)
   {
      for  (var i=0;i<buttons_.length;i++)
      {
         var reg=new RegExp('(^|; +)'+buttons_[i].dataset.cookie+'=([^,;]+,)*'+buttons_[i].dataset.key+'-'+buttons_[i].dataset.order+'(,[^,;]+)*(;|$)','i');
         if (reg.test(document.cookie))
            buttons_[i].classList.add('sel');
         
         buttons_[i].addEventListener("click",set_sort_order);
      }
   }
}

function set_sort_order(e_)
{
   //Get cookie value
   var thisOrder=this.dataset.key+'-'+this.dataset.order;
   
   var reg=new RegExp('(?:^|; +)'+this.dataset.cookie+'=([^;]*)(?:;|$)','i');
   var matches=reg.exec(document.cookie);
   var cookie=matches ? matches[1] : '';
   
   if (cookie&&e_.ctrlKey)
   {
      //Replace/remove same sorting key in list if Ctrl key pressed
      var sorts=cookie.split(',');
      console.log(sorts);
      var replace=true;
      reg=new RegExp('^'+this.dataset.key+'-(asc|desc)?$');
      for (var i=0;i<sorts.length;i++)
         if (reg.test(sorts[i]))
         {
            replace=(sorts[i]!=thisOrder);
            sorts.splice(i,1);
            i--;
         }
      
      if (replace)
         sorts.push(thisOrder);
      
      cookie=sorts.join(',');
   }
   else
      cookie=thisOrder; //Otherwise replace whole cookie value
   
   var exp_date=new Date;
   exp_date.setDate(exp_date.getDate() + (cookie!='' ? 31 : -1));
   document.cookie=this.dataset.cookie+'='+cookie+'; expires='+exp_date.toUTCString()+';'+(this.dataset.path ? 'path='+this.dataset.path : '');
   
   window.location.reload();
}

//------- Scrolling boxes handling -------//
function Scroller(node_)
{
   //properties
   this.root=null;      //root node.
   this.area=null;      //scrolling area node.
   this.content=null;   //content container node.
   this.buttons={left:null,right:null};   //nodes of left and right buttons.
   this.speed='33%';    //scrolling speed (affects scrolling by cklicking on buttons and by mouse wheel scrolling).
   this.cycled=false;   //allow to continue from the opposite end or stop scrolling when the end or the start has reached.
   this.treshold=10;    //corner positions detection treshold
   this.handle=['click','wheel','touch']; //default handled events. Full list: 'click' - clicking on button nodes; 'wheel' - mouse wheel scrolling; 'touch' - gragging by touch input device; 'drag' - like touch, but by main mouse button; 'middlebtn' - like touch, but by the middle mouse button.
   
   //methods
   this.scroll=function(ort_) //Scroll in left or right direction, using the speed parameter to get scrolling amount
   {
      if (ort_!=0)   //ort_ should be -1 or +1.
         this.scrollBy((ort_*parseFloat(this.speed))+mUnit(this.speed));
   }
   this.scrollBy=function(deltaX_,from_start_)  //Scroll on specified amount of pixels or percents.
   {
      var offset=toPixels(deltaX_,{subj:this.content,axis:'x'});
      //console.log('scroll by ',offset,'px (computed from ',deltaX_,') at ',this.root);
      var conStyle=window.getComputedStyle(this.content);
      var oldPos=(from_start_ ? 0 : -parseFloat(conStyle.marginLeft));
      var maxPos=Math.max(0,parseFloat(conStyle.width)-this.area.clientWidth);
      pos=oldPos+offset;
      
      if (this.cycled)
      {
         //Handle position out of range cases:
         if (pos<0)
            pos=oldPos>0 ? 0 : maxPos; //Step to beginning, then turn to the end.
         else if (pos>maxPos)
            pos=oldPos<maxPos ? maxPos : 0;  //Step to the end, then return to beginning.
      }
      else
         pos=Math.min(Math.max(0,pos),maxPos);
      
      this.content.style.marginLeft=(-pos)+'px';
      this.updateButtons();
   }
   this.scrollTo=function(target_)  //Scroll to the specific node.
   {
      var offset=0;
      for (var child of this.content.childNodes)
         if (child==target_)
         {
            offset=child.offsetLeft;
            break;
         }
      
      this.scrollBy(offset,true);
   }
   this.updateButtons=function()
   {
      var conStyle=window.getComputedStyle(this.content);
      
      if (this.buttons.left)
      {
         if (-parseFloat(conStyle.marginLeft)<=this.treshold)
            this.buttons.left.classList.add('disabled');
         else
            this.buttons.left.classList.remove('disabled');
      }
      if (this.buttons.right)
      {
         if ((parseFloat(conStyle.width)+parseFloat(conStyle.marginLeft)-this.area.clientWidth)<=this.treshold)
            this.buttons.right.classList.add('disabled');
         else
            this.buttons.right.classList.remove('disabled');
      }
   }
   this.recalcCuntentWidth=function()
   {
      var style=window.getComputedStyle(this.content);
      var w=parseFloat(style.paddingLeft)+parseFloat(style.paddingRight);
      for (var c=0;c<this.content.children.length;c++)
      {
         style=window.getComputedStyle(this.content.children[c]);
         w+=(this.content.children[c].offsetWidth+parseFloat(style.marginLeft)+parseFloat(style.marginRight));
      }
      this.content.style.width=w+'px';
   }
   this.init=function(node_)
   {
      if (node_)
      {
         this.root=node_;
         
         //Init params
         if (this.root.dataset.speed)
            this.speed=this.root.dataset.speed;
         if (this.root.dataset.cycled)
            this.cycled=toBool(this.root.dataset.cycled);
         if (this.root.dataset.handle)
            this.handle=this.root.dataset.handle.split(',');
         if (this.root.dataset.tr)
            this.treshold=parseInt(this.root.dataset.tr);
         
         //Init nodes:
         //root node
         this.root.classList.remove('inactive');   //class "inactive" may be used to alter scroller view/behavior while it isn't initialized.
         
         //scroling area
         this.area=this.root.querySelector('.area');
         this.area.scroller=this;  //back referrence
         
         //content container that scrolls into scroling area
         this.content=this.root.querySelector('.content');
         this.recalcCuntentWidth();
         
         //buttons
         var buttons=this.root.querySelectorAll('.button');
         for (var i=0;i<buttons.length;i++)
         {
            buttons[i].scroller=this;  //back referrence
            if (buttons[i].classList.contains('left'))
               this.buttons.left=buttons[i];
            else if (buttons[i].classList.contains('right'))
               this.buttons.right=buttons[i];
         }
         this.updateButtons();
         
         //Attach event handlers
         for (var i=0;i<this.handle.length;i++)
         {
            switch (this.handle[i])
            {
               case 'click':
               {
                  if (this.buttons.left)
                     this.buttons.left.addEventListener('click',function(e_){this.scroller.scroll(-1); return cancelEvent(e_);});
                  if (this.buttons.right)
                     this.buttons.right.addEventListener('click',function(e_){this.scroller.scroll(+1); return cancelEvent(e_);});
                  
                  break;
               }
               case 'wheel':
               {
                  this.area.addEventListener('wheel',function(e_){this.scroller.scroll(Math.sign(e_.deltaY)); return cancelEvent(e_);});
                  break;
               }
               case 'touch':
               {
                  break;
               }
               case 'drag':
               {
                  break;
               }
               case 'middlebtn':
               {
                  break;
               }
            }
         }
      }
   }
   
   //initialization
   this.init(node_);
}

function initScrollers(selector_)
{
   var scrollerNodes=document.body.querySelectorAll(selector_);
   //console.log(scrollerNodes);
   if (scrollerNodes)
      for (var i=0;i<scrollerNodes.length;i++)
         scrollerNodes[i].scroller=new Scroller(scrollerNodes[i]);
   
   return scrollerNodes;
}

//------- Slider -------//
function Slider(node_)
{
   //properties
   this.root=null;
   this.slides=[];
   this.largeView=null; //container for 
   this.controls=[];    //array of direct switching buttons e.g. bullits under slider
   this.buttons={left:null,right:null};   //nodes of prev and next buttons.
   //methods
   //initialization
   /*TODO*/
}

//------- Spoilers -------//
function Spoiler(node_)
{
   //private properties
   this.node=null;
   this.buttons=[];
   
   //public methods
   this.toggle=function(state_)
   {
      if (this.node)
         this.node.classList.toggle('unfolded'/*,state_*/);
   }
   
   //initialization
   this.init=function(node_)
   {
      this.node=node_;
      if (this.node)
      {
         //Find this spoiler's buttons, i.e. nodes having 'button' class and are direct cildren of this.node or it's descendants that not belongs to content node.
         this.buttons=[];
         for (var i=0;i<this.node.children.length;i++)
         {
            if (this.node.children[i].classList.contains('button'))
               this.buttons.push(this.node.children[i]);
            else
               if (!this.node.children[i].classList.contains('content'))
               {
                  var deepBtns=this.node.children[i].getElementsByClassName('button');
                  for (var k=0;k<deepBtns.length;k++)
                     this.buttons.push(deepBtns[k]);
               }
         }
         var sender=this;
         for (var i=0;i<this.buttons.length;i++)
            this.buttons[i].addEventListener('click',function(e_){sender.toggle(); return cancelEvent(e_);});
      }
   }
   this.init(node_);
}

function initSpoilers(selector_)
{
   var spoilerNodes=document.body.querySelectorAll(selector_);
   if (spoilerNodes)
      for (var i=0;i<spoilerNodes.length;i++)
         spoilerNodes[i].controller=new Spoiler(spoilerNodes[i]);
}

//------- Range bar -------//
class RangeBar
{
   constructor(node_,params_)
   {
      if (node_)
      {
         //private props
         this.__commitedVals=null;   //Temporary copy of values used to recalc original positions of indirectly moved sliders.
         this.__isVolatile=false;    //True while dragging of sliders.
         
         //protected props
         this._node=node_;
         this._trackAreaNode=(this._node.dataset.trackAreaSelector ? document.querySelector(this._node.dataset.trackAreaSelector) : null)||this._node.parentNode||this._node; //The node that will receive mouse and touch movement events (It's better to use more wide area than trackbar itself to get more smooth behaviour)
         this._inputs=(this._node.dataset.inputsSelector ? document.querySelectorAll(this._node.dataset.inputsSelector) : []);
         this._indicators=(this._node.dataset.indicatorssSelector ? document.querySelectorAll(this._node.dataset.indicatorssSelector) : []);
         this._axis=(((params_&&params_.axis)||this._node.dataset.axis||'').toLowerCase()=='y' ? 'y' : 'x');
         this._reversed=(params_&&params_.reversed)||toBool(this._node.dataset.reversed);
         this._precision=(params_&&params_.precision)||parseInt(this._node.dataset.precision)||0;
         this._min=(params_&&params_.min)||this._parseNum(this._node.dataset.min)||0;
         this._max=(params_&&params_.max)||this._parseNum(this._node.dataset.max)||255;
         this._values=null;
         this._defaultVals=null;    //Initial values for case of the form reset.
         this._grabbedIndx=-1;      //Index of grabbed value/slider.
         
         //Init range bar node
         var sender=this;
         this._node.parent=this;
         this._node.addEventListener('mousedown',function(e_){return sender._grabByMouse(e_);});
         document.body.addEventListener('mouseup',function(e_){return sender._releaseByMouse(e_);});     //Detect releasing of mouse button anywhere
         this._trackAreaNode.addEventListener('mousemove',function(e_){return sender._trackMouse(e_);});
         this._node.addEventListener('touchstart',function(e_){return sender._grabByTouch(e_);});
         document.body.addEventListener('touchend',function(e_){return sender._releaseByTouch(e_);});    //Detect releasing of touch anywhere
         document.body.addEventListener('touchcancel',function(e_){return sender._releaseByTouch(e_);});
         this._trackAreaNode.addEventListener('touchmove',function(e_){return sender._trackTouch(e_);});
         
         //Init associated inputs
         for (var input of this._inputs)
            input.addEventListener('input',function(e_){var indexMatch=/\[([0-9])\]$/.exec(this.name); sender.setValueAt(parseInt((indexMatch&&indexMatch[1])||this.dataset.rangeValIndex)||0,this.value);});
         
         //Obtain initial values
         if (params_&&params_.values)
            this._setValues(values);
         if (this._node.dataset.val)
            this._setValues(this._node.dataset.val.split(','));
         else if (this._inputs.length>0)
         {
            var values=[];
            for (var input of this._inputs)
               values.push(input.value); 
            this._setValues(values);   //Correctly set values.
         }
         else
            this._values=[this._min];
         
         //Copy initial values to defaults
         this._defaultVals=this._values.slice();
         
         this._updateInputs();   //Update inputs anyway in case of the forced changes of the values.
         this._repaint();
      }
   }
   
   //props methods
   get _isVolatile(){return this.__isVolatile;}
   set _isVolatile(new_val_)
   {
      if ((!this.__isVolatile)&&new_val_)
      {
         this.__commitedVals=this._values.slice();
      }
      else if (this.__isVolatile&&(!new_val_))
      {
         this.__commitedVals=null;
      }
      
      this.__isVolatile=new_val_;
   }
   
   //protected methods
   _parseNum(val_)
   {
      //Parse type-specific numeric value
      
      return (this._precision==0 ? parseInt(val_) : parseFloat(val_).toFixed(this._precision)); //NOTE: NaN.toFixed() will not throw an error.
   }
   
   _getRelValAt(indx_)
   {
      //Returns relative meaning of the value by index
      
      var res=null;
      
      if (typeof indx_=='undefined')
         indx_=0;
      
      if ((indx_>=0)&&(indx_<this._values.length))
      {
         res=this.absToRel(this._values[indx_]);
         if (this._reversed)
            res=1-res;
      }
      
      return res;
   }
   _getRelVals()
   {
      //Returns relative meanings of all values
      
      var res_arr=[];
      
      for (var i=0;i<this._values.length;i++)
         res_arr.push(this._getRelValAt(i));
      
      return res_arr;
   }
   
   _setValueAt(indx_,new_val_)
   {
      //Set a single value without repaint
      //NOTE: Don't mess with the public setValueAt()
      
      var res=null;
      
      new_val_=this._parseNum(new_val_);  //Convert value into the current format
      if (!(isNaN(indx_)||isNaN(new_val_)))
      {
         if (this._isVolatile)                           //While dragging a value, another values may be affected indirectly (stacked to the dragging one).
            this._values=this.__commitedVals.slice();    //Therefore they are has to be restored at each movement until the dragged value is released.
         
         if ((indx_>=0)&&(indx_<this._values.length))
         {
            //Limit new value to range bounds
            this._values[indx_]=Math.max(this._min,new_val_);
            this._values[indx_]=Math.min(this._values[indx_],this._max);
            
            //Stack previous values if they are greater
            for (var i=indx_-1;i>=0;i--)
               if (this._values[i]>this._values[indx_])
                  this._values[i]=this._values[indx_];
               
            //Stack next values if they are lesser
            for (var i=indx_+1;i<this._values.length;i++)
               if (this._values[i]<this._values[indx_])
                  this._values[i]=this._values[indx_];
            
            res=this._values[indx_];
         }
         else
            console.warn('RangeBar._setValueAt: Unable to set value: index out of range.');
      }
      else
         console.warn('RangeBar._setValueAt: Unable to set value: '+(isNaN(indx_) ? 'index is NaN' : '')+(isNaN(new_val_) ? 'value is NaN' : '')+'');
      
      return res;
   }
   
   _correctValues(values_)
   {
      //Limit values to the range boundaries and also arrange them by ascending.
      
      var min=this._min;                  //Limit 0th value bottom to the range min.
      for (var i=0;i<values_.length;i++)
      {
         values_[i]=this._parseNum(values_[i]); //Convert value into the current format
         
         if (isNaN(values_[i]))
            values_[i]=min;               //Stack the NaNs to the previous valid value.
         else if (values_[i]<min)
            values_[i]=min;               //Limit all the next values bottom bo the previous one.
         else if (values_[i]>this._max)
            values_[i]=this._max;         //And limit any value top to the range max.
         
         min=values_[i];
      }
      
      return values_;
   }
   
   _setValues(new_vals_)
   {
      //Set all the values without repaint.
      
      if (new_vals_ instanceof Array)
         this._values=this._correctValues(new_vals_);
      else
         console.error('RangeBar._setValues: Argument is not an array.');
      
      return this._values;
   }
   
   _repaint()  //overridable
   {
      //Repaint _node and _indicators according to actual values.
      
      var positions=[];
      
      for (var i=0;i<this._values.length;i++)
         positions.push((this._getRelValAt(i)*100)+'%');
      
      //Repaint range bar node background
      this._node.style['backgroundPosition'+this._axis.toUpperCase()]=positions.join(',');
      
      //Repaint _indicators
      var cnt=Math.min(this._indicators.length,this._values.length);
      for (var i=0;i<cnt;i++)
      {
         this._indicators[i].textContent=this._values[i];
         if (toBool(this._indicators[i].dataset.movable))
            this._indicators[i].style[this._axis=='x' ? 'left' : 'top']=positions[i];
      }
   }
   
   _updateInputs()
   {
      //Send current values to associated inputs.
      
      for (var i=0;i<this._inputs.length;i++)
         this._inputs[i].value=this._values[i];
   }
   
   _grabByMouse(e_)
   {
      //Pick a value by mouse down and prepare to change it by dragging.
      
      this._isVolatile=true;
      
      var pos=cursorToRelative(e_,this._node);
      this._grabbedIndx=this.getNearestIndex(pos);
      this._setValueAt(this._grabbedIndx,this.posToVal(pos));
      
      this._repaint();
      this._updateInputs();
      this.onInput&&this.onInput(e_,this._grabbedIndx);
      
      return cancelEvent(e_);
   }
   _releaseByMouse(e_)
   {
      //Stop dragging of value by mouse
      
      this._isVolatile=false;
   }
   _trackMouse(e_)
   {
      //Drag value by mouse
      
      if (this._isVolatile)
      {
         //console.log(e_);
         var pos=cursorToRelative(e_,this._node);
         this._setValueAt(this._grabbedIndx,this.posToVal(pos));
         
         this._repaint();
         this._updateInputs();
         this.onInput&&this.onInput(e_,this._grabbedIndx);
      
         return cancelEvent(e_);
      }
   }
   _grabByTouch(e_)
   {
      //Pick a value by touch and prepare to change it by dragging.
      
      this._isVolatile=true;
      
      var pos_arr=touchesToRelative(e_,this._node);
      this._grabbedIndx=this.getNearestIndex(pos_arr[0]);
      this._setValueAt(this._grabbedIndx,this.posToVal(pos_arr[0]));
      
      this._repaint();
      this._updateInputs();
      this.onInput&&this.onInput(e_,this._grabbedIndx);
      
      return cancelEvent(e_);
   }
   _releaseByTouch(e_)
   {
      //Stop dragging of value by touch
      
      if (e_.type=='touchcancel')
         this._values=this.__commitedVals;
      this._isVolatile=false;
   }
   _trackTouch(e_)
   {
      //Drag value by touch
      
      if (this._isVolatile)
      {
         var pos_arr=touchesToRelative(e_,this._node);
         this._setValueAt(this._grabbedIndx,this.posToVal(pos_arr[0]));
         
         this._repaint();
         this._updateInputs();
         this.onInput&&this.onInput(e_,this._grabbedIndx);
         
         return cancelEvent(e_);
      }
   }
   
   //public props
   get values()
   {
      return this._values.slice();  //Isolate protected prop.
   }
   set values(new_vals_)
   {
      this._setValues(new_vals_.slice());
      
      this._repaint();
      this._updateInputs();
      this.onChange&&this.onChange();
   }
   
   get defaults()
   {
      return this._defaultVals.slice();  //Isolate protected prop.
   }
   set defaults(new_vals_)
   {
      this._defaultVals=this._correctValues(new_vals_.slice());
   }
   
   get min(){return this._min;}
   set min(new_val_)
   {
      this._min=new_val_;
      if (this._min<this._max)
      {
         this._values=this._correctValues(this._values);
         this._defaultVals=this._correctValues(this._defaultVals);
         if (this.__commitedVals)
            this.__commitedVals=this._correctValues(this.__commitedVals);
         
         this._repaint();
         this._updateInputs();
         this.onChange&&this.onChange();
      }
   }
   
   get max(){return this._max;}
   set max(new_val_)
   {
      this._max=new_val_;
      if (this._min<this._max)
      {
         this._values=this._correctValues(this._values);
         this._defaultVals=this._correctValues(this._defaultVals);
         if (this.__commitedVals)
            this.__commitedVals=this._correctValues(this.__commitedVals);
         
         this._repaint();
         this._updateInputs();
         this.onChange&&this.onChange();
      }
   }
   
   //public methods
   absToRel(val_)
   {
      return (val_-this._min)/(this._max-this._min);
   }
   relToAbs(val_)
   {
      return (val_*(this._max-this._min)+this._min).toFixed(this._precision);
   }
   
   setValueAt(indx_,new_val_)
   {
      //Set a single value with repaint.
      
      var res=this._setValueAt(indx_,new_val_);
      
      if (res!==null)
      {
         this._repaint();
         this.onChange&&this.onChange(res,indx_);
      }
      
      return res;
   }
   
   getValueAt(indx_)
   {
      //Returns certain value by index (0th by default).
      
      var res=null;
      
      if (typeof indx_=='undefined')
         indx_=0;
      
      if ((indx_>=0)&&(indx_<this._values.length))
         res=this._values[indx_];
      
      return res;
   }
   
   posToVal(pos_)
   {
      //Convert given {x:val,y:val} position in pixels (by default) or percents position to the value in range bar scale.
      
      var unit=mUnit(pos_[this._axis]);
      var nodeSize=(this._axis=='y' ? this._node.offsetHeight : this._node.offsetWidth);
      return this.relToAbs(unit=='%' ? parseFloat(pos_[this._axis]) : parseInt(pos_[this._axis])/nodeSize);
   }
   
   getNearestIndex(pos_)
   {
      //Returns index of the value nearest to the given {x:val,y:val} position in pixels (by default) or percents.
      var res=0;
      
      //Convert position to the value in the range scale
      var val=this.posToVal(pos_);
      
      //Find the closest value amongst _values[]
      var minDist=Math.abs(this._values[0]-val);
      for (var i=1;i<this._values.length;i++)
      {
         var dist=Math.abs(this._values[i]-val);
         if (dist<minDist)
         {
            minDist=dist;
            res=i;
         }
      }
      
      return res;
   }
   
   reset()
   {
      this._setValues(this._defaultVals.slice());
      this._updateInputs();
      this._repaint();
      this.onChange&&this.onChange(res,indx_);
   }
}

function initRangeBars(selector_,params_)
{
   var res=[];
   
   var nodes=document.querySelectorAll(selector_);
   for (var node of nodes)
      res.push(new RangeBar(node,params_));
      
   return res;
}
//------- Modal dialogs functions -------//
function buildNodes(struct_)
{
   var res;
   if ((typeof struct_ == 'object')&&struct_.tagName)
   {
      //create element
      res=document.createElement(struct_.tagName);
      
      //init element
      if (res)
      {
         var child;
         for (var prop in struct_)
            switch (prop)
            {
               case 'tagName': {break;}
               case 'style':
               case 'dataset':
               {
                  for (var st in struct_[prop])
                      res[prop][st]=struct_[prop][st];
                  break;
               }
               case 'childNodes':
               {
                  for (var c=0;c<struct_.childNodes.length;c++)
                      if (child=buildNodes(struct_.childNodes[c]))
                         res.appendChild(child);
                  break;
               }
               default: res[prop]=struct_[prop];
            }
      }
   }
   else if (typeof struct_ == 'string')
   {
      res=document.createTextNode(struct_);
   }
   
   //return it
   return res;
}

function popupOpen(struct_)
{
   //Make popup and assigns to parent_ (or to document.body by default).
   var res=null;
   
   popupsClose();   //close previously opened popups.
   
   if (struct_)
   {
      res=buildNodes(struct_);  //create new popup's DOM structure
      if (res)
         document.body.appendChild(res);   //if DOM structure was built successfully, attach it to parent
   }
   
   return res;
}

function popupsClose()
{
   //Closes all popups (generrally - one), placed into parent_.
   var res=null;
   
   var oldPopups=document.body.querySelectorAll('.popup');
   if (oldPopups)
      for (var i=0;i<oldPopups.length;i++)
      {
         oldPopups[i].style.display='none';
         document.body.removeChild(oldPopups[i]);
      }
   
   return res;
}

//common popups structures//
function iframePopupStruct(link_,caption_)
{
   if (caption_===undefined)
      caption_='';
   
   var res={
              tagName:'div',
              className:'popup',
              childNodes:[
                            {
                               tagName:'div',
                               className:'window',
                               childNodes:[
                                             {
                                                tagName:'div',
                                                className:'title',
                                                childNodes:[
                                                              {tagName:'span',innerHTML:caption_},
                                                              {tagName:'div',className:'button close',onclick:function(){popupsClose()}},
                                                           ]
                                             },
                                             {
                                                tagName:'iframe',
                                                className:'container',
                                                src:link_
                                             }
                                          ]
                            }
                         ],
              onclick:function(){popupsClose()},
              onwheel:function(e_){return cancelEvent(e_);},
              onscroll:function(e_){return cancelEvent(e_);}
           };
   
   return res;
}

function imagePopupStruct(link_,caption_) //makes structure of window for displaying of enlarged image
{
   if (caption_===undefined)
      caption_='';
   
   var res={
              tagName:'div',
              className:'popup',
              childNodes:[
                            {
                               tagName:'div',
                               className:'window',
                               childNodes:[
                                             {
                                                tagName:'div',
                                                className:'title',
                                                childNodes:[
                                                              {tagName:'span',innerHTML:caption_},
                                                              {tagName:'div',className:'button close',onclick:function(){popupsClose()}},
                                                           ]
                                             },
                                             {
                                                tagName:'div',
                                                className:'container image',
                                                childNodes:[
                                                               {
                                                                  tagName:'img',
                                                                  src:link_
                                                               }
                                                           ]
                                             }
                                          ]
                            }
                         ],
              onclick:function(){popupsClose()},
           };
   
   return res;
}

function dialogPopupStruct(link_,caption_,ok_btn_value_,ok_action_,cancel_btn_value_,cancel_action_)  //makes dialog window with "ok" and "cancel" buttons
{
   var res={
              tagName:'div',
              className:'popup',
              childNodes:[
                            {
                               tagName:'div',
                               className:'window',
                               childNodes:[
                                             {
                                                tagName:'div',
                                                className:'title',
                                                childNodes:[
                                                              {tagName:'span',innerHTML:caption_},
                                                              {tagName:'div',className:'button close',onclick:function(){popupsClose()}},
                                                           ]
                                             },
                                             {
                                                tagName:'iframe',
                                                className:'container',
                                                src:link_
                                             },
                                             {
                                                tagName:'div',
                                                className:'panel',
                                                childNodes:[
                                                              {
                                                                 tagName:'input',
                                                                 type:'button',
                                                                 name:'cancel',
                                                                 value:cancel_btn_value_||'Cancel',
                                                                 className:'no',
                                                                 onclick:function(){popupsClose()}
                                                              },
                                                              {
                                                                 tagName:'input',
                                                                 type:'button',
                                                                 name:'ok',
                                                                 className:'ok',
                                                                 value:ok_btn_value_||'OK',
                                                                 onclick:ok_action_
                                                              }
                                                           ]
                                             }
                                          ]
                            }
                         ],
              onclick:function(){popupsClose()},
              popup_top_box:true //special property, which marks top box in popup DOM tree
           };
   
   return res;
}

//------- Dynamic DOM controller -------//
class SemiDynamicList
{
   //Manager of the DOM element lists, that are created statically on the server side and then should be managed by JS.
   //Parameters:
   // listNode_ - the DOM node that is a direct parent of the list items.
   // params_ - object with initialization parameters:
   //    itemNodePrototype - the DOM node that will serve as prototype of the new list nodes. But there are two another ways to obtain node prototype: 
   //       one of the listNode_'s children that have special css class (see protoClassName) will be extracted from listNode_ and used as prototype.
   //       If will be neither itemNodePrototype nor listNode_ child with protoClassName, then the first common item node will be cloned for the prototype. But this way may be used only for lists that are initially never may be empty.
   //    protoClassName - the special css class that marks a node as the prototype. While creating of a new list item by cloning of the prototype, this css class is removing.
   //    excludeBefore - number of the prefix _listNode children that aren't a list items. It may be e.g. row[s] with table header that mightn't be placed outside the listNode_.
   //    excludeAfter - number of the postfix _listNode children.
   //       NOTE: non-element nodes (like text nodes and comments) aren't counted at all. Thus meaningful text nodes mightn't be placed inside the listNode_, but on the other hand whitespaces will makes no harm to the list operationing.
   //    controllerParams - parameters for the Controller's constructor.
   //    Controller - JS class that controls refreshing of the item's data and its all other behavior.
   //       While the list initialization this class will be instantiated for the each child of the listNode_ except that which have protoClassName or excludingClassName. In this case controller should take all initialization data from its DOM node.
   //       While creating of a new item, Controller instantiated for the clone of the prototype node and then method update() is called with an actual data. To detect this case Controller's constructor may check node's className for existing of the protoClassName.
   //       NOTE: Controller may be a descendant of the SemiDynamicList class and form a tree-like structures.
   //       Controller's constructor arguments:
   //          item DOM node (mandatory) - node that it should control.
   //          common parameters (optional) - controller's constructor will be supplied with controllerParams property of SemiDynamicList params_.
   //          parent (optional) - SemiDynamicList will pass a backreference to itself here.
   //       Controller must implement following properties and methods:
   //          id - some unique simple-type value that identifies an item.
   //          domNode - referrence to DOM node that it controls. (SemiDynamicList doesn't keep references to the item nodes, but accessing them via controllers.)
   //          update(itemData_) - method that changes all item data including its ID. This method must update whole item state and repaint its DOM node. In other words this method turns a one item into another. This method is calling while list refreshing and creating of a new item.
   
   constructor(listNode_,params_,parent_)
   {
      if (listNode_&&params_)
      {
         //private props
         this._listNode=listNode_;      //Parent node of all the item nodes
         this._protoClassName='proto';  //Prototype node css class
         this._itemProtoNode=null;      //Prototype node itself.
         this._appendixStart=null;      //First extra node in this._listNode after the actual items. All new item nodes will be inserted before it (or to the end of list if it's null).
         this._Controller=null;         //Class of the item.
         this._controllerParams=null;   //Parameters for the Controller constructor
         this._items=[];                //Array of the items, represented by Controller instances.
         
         //Init params
         this._Controller=params_.Controller;
         this._controllerParams=params_.controllerParams;
         if (params_.protoClassName)
            this._protoClassName=params_.protoClassName;
         
         var start=params_.excludeBefore||0;
         var end=this._listNode.childElementCount-(params_.excludeAfter||0);
         if (end<this._listNode.childElementCount)
            this._appendixStart=this._listNode.children[end];
         
         if (params_.itemNodePrototype)                                                      //ItemNodePrototype has higest priority.
            this._itemProtoNode=params_.itemNodePrototype;
         else if (this._listNode.childElementCount>0&&this._listNode.children[start].classList.contains(this._protoClassName))   //Next try to find dedicated prototype node before nodes of the items.
         {
            this._itemProtoNode=this._listNode.children[start];
            start++;
         }
         else if (this._listNode.childElementCount>0)
            this._itemProtoNode=this._listNode.children[start].cloneNode(true);              //At last, clone any _listNode child except prefix and postfix nodes.
         
         //Init statically created item nodes
         for (var i=start;i<end;i++)
            this._items.push(new this._Controller(this._listNode.children[i],this._controllerParams,this)); //Create new controller instance for the statically created node.
      }
   }
   
   //public props
   get length(){return this._items.length;}
   
   //public methods
   itemIndexById(id_)
   {
      var res=false;
      
      if (this._listNode)
      {
         for (var i=0;i<this._items.length;i++)
            if (this._items[i].id==id_)
            {
               res=i;
               break;
            }
      }
      
      return res;
   }
   
   itemById(id_)
   {
      var indx=this.itemIndexById(id_);
      return (indx!==false ? this._items[indx] : null);
   }
   
   add(itemData_)
   {
      var item=null;
      
      var node=this._itemProtoNode.cloneNode(true);
      node.classList.remove(this._protoClassName);
      
      item=new this._Controller(node,this._controllerParams,this);
      item.update(itemData_);
      
      this._items.push(item);
      if (this._appendixStart)
         this._listNode.insertBefore(node,this._appendixStart);  //This avail to use empty blocks after the actual items for layout alignment.
      else
         this._listNode.appendChild(node);
      
      return item;
   }
   
   replace(itemData_)
   {
      var item=this.itemById(itemData_.id);
      if (item===null)
         item=this.add(itemData_);
      else
         item.update(itemData_);
      
      return item;
   }
   
   remove(index_)
   {
      if ((index_!==false)&&(index_>=0)&&(index_<this._items.length))
      {
         this._listNode.removeChild(this._items[index_].domNode);
         this._items.splice(index_,1);
      }
   }
   
   removeById(id_)
   {
      this.remove(this.itemIndexById(id_));
   }
   
   flush()
   {
      for (var item of this._items)
         this._listNode.removeChild(item.domNode);
      this._items=[];
   }
   
   updateAll(data_)
   {
      //this.flush();
      //for (var itemData of data_)
      //   this.add(itemData);
      var i=0;
      var end=Math.min(this._items.length,data_.length);
      while (i<end)
      {
         this._items.update(data_[i]);
         i++;
      }
      
      if (this._items.length<data_.length)
      {
         while (i<data_.length)
         {
            this.add(data[i]);
            i++;
         }
      }
      else
         while (this._items.length>data_.length)
            this.remove(i);
   }
}

//------- Horizontal scrolling patch -------//
function windowHorizontalScrollHandler(e_)
{
   if (e_&&e_.target&&(!e_.target.tagName.match(/input|select|option|textarea/i)))
      {
         var delta={X:0,Y:0};
         var cursor_offset=cursorToAbsolute(e_);
         var cursor_bottom=getClientHeight()-e_.clientY;
         var ort=mouseWheelOrt(e_);
         
         if (cursor_bottom<30)
            delta.X=-ort*32;
         else
             delta.Y=-ort*32;
         
         window.scrollBy(delta.X,delta.Y);

         e_.preventDefault&&e_.preventDefault();
         return false;
      }
   else
       return true;
}

function elementHorizontalScrollHandler(e_)
{
   if (e_&&e_.target&&((e_.target==this)||((e_.target.parentNode==this)&&e_.target.tagName.match(/option/i))||(!e_.target.tagName.match(/input|select|option/i))))
      {
         var delta={X:0,Y:0};
         var cursor_offset=cursorToAbsolute(e_);
         var cursor_bottom=getTop(this)+this.offsetHeight-cursor_offset.Y;
         var ort=mouseWheelOrt(e_);
         
         if (cursor_bottom<30)
            delta.X=-ort*32;
         else
             delta.Y=-ort*32;
         
         e_.target.scrollLeft+=(delta.X);
         e_.target.scrollTop+=(delta.Y);
         
         e_.preventDefault&&e_.preventDefault();
         e_.stopPropagation&&e_.stopPropagation();
         return false;
      }
   else
       return true;
}

//--------------------- Events handling ---------------------//
function cancelEvent(e_)
{
   //This function just groups all actions, needed to completely cancel a DOM event
   
   e_.preventDefault&&e_.preventDefault();
   e_.stopPropagation&&e_.stopPropagation();
   return false;
}

function mouseWheelOrt(e_)
{
   //Returns scrolling direction of mouse wheel
   
   var ort=0;
   if (e_.deltaY)
      ort=e_.deltaY;
   else if (e_.wheelDelta)
      ort=e_.wheelDelta;
   else if (e_.detail)
      ort=-e_.detail;
   
   return (ort!=0) ? ort/Math.abs(ort) : 0; //ort of whell delta
}

//--------------------- XHR ----------------------//
function reqServerGet(request_,success_callback_,fail_callback_)
{
   //Send request to server using GET
   
   var xhr=new XMLHttpRequest();
   xhr.addEventListener('load',function(e_){if(xhr.readyState === 4){if (xhr.status === 200)success_callback_(xhr.response); else fail_callback_(xhr);}});
   xhr.open('GET',request_);
   xhr.setRequestHeader('X-Requested-With','JSONHttpRequest');
   xhr.responseType='json';
   xhr.send();
}
function reqServerPost(url_,data_,success_callback_,fail_callback_)
{
   //Send data to server using POST
   
   var body=serializeUrlQuery(data_);
   
   var xhr=new XMLHttpRequest();
   xhr.addEventListener('load',function(e_){if(xhr.readyState === 4){if (xhr.status === 200)success_callback_(xhr.response); else fail_callback_(xhr);}});
   xhr.open('POST',url_);
   xhr.setRequestHeader('X-Requested-With','JSONHttpRequest');
   xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
   xhr.responseType='json';
   xhr.send(body);
}


//--------------------- Cookies ---------------------//
function getCookie(name_)
{
   var reg=new RegExp('(?:^|; +)'+name_+'=([^;]*)(?:;|$)','i');
   var matches=reg.exec(document.cookie);
   
   return (matches ? matches[1] : null);
}

function setCookie(name_,val_,expires_,path_)
{
   //Set/remove cookie.
   //If val_=='' or expires_ ==-1 - coookie with name name_ will be removed.
   
   if (expires_===undefined)
      expires_=31;
   if (path_===undefined)
      path_='/';
   
   var exp_date=new Date;
   exp_date.setDate(exp_date.getDate() + (val_!='' ? expires_ : -1));
   
   document.cookie=name_+'='+val_+(path_!='' ? '; path='+path_ : '')+'; expires='+exp_date.toUTCString();
}
//--------------------- Misc ---------------------//
function functionExists(func_)
{
   if (typeof func_=='string')
      return (typeof window[func_]=='function');
   else
      return (func_ instanceof Function)
}

function arraySearch(val_,array_,callback_)
{
   //Analog of array_search() in PHP.
   
   var res=false;
   
   if (array_ instanceof Array)
   {
      if (callback_ instanceof Function)
      {
         //Perform search using callback_ function
         for (var i=0;i<array_.length;i++)
            if (callback_(val_,array_[i]))
            {
               res=i;
               break;
            }
      }
      else
      {
         //Perform simple search
         for (var i=0;i<array_.length;i++)
            if (val_===array_[i])
            {
               res=i;
               break;
            }
      }
   }
   
   return res;
}

function HTMLSpecialChars(val_)
{
   //Analog of htmlspecialchars() in PHP.
   
   var map={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'};
   return val_.replace(/[&<>"]/g,function(ch_){return map[ch_];});
}

function HTMLSpecialCharsDecode(val_)
{
   //Analog of htmlspecialchars_decode() in PHP.
   
   var map={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"'};
   return val_.replace(/&(amp|lt|gt|quot);/g,function(ch_){return map[ch_];});
}

function serializeUrlQuery(url_query_,parent_)
{
   var res_arr=[];
   
   for (var key in url_query_)
   {
      full_key=(parent_!==undefined ? parent_+'['+encodeURIComponent(key)+']' : encodeURIComponent(key));
      res_arr.push(typeof url_query_[key]=='object' ? serializeUrlQuery(url_query_[key],full_key) : full_key+'='+encodeURIComponent(url_query_[key]));
   }
   
   return res_arr.join('&');
}

function toBool(val_)
{
   //Returns true if val_ may be understood as some variation of boolean true. Analog of to_bool() in /core/utils.php
   
   return (typeof val_=='boolean') ? val_ : /^(1|\+|on|ok|true|positive|y|yes|да)$/i.test(val_);   //All, what isn't True - false.
}

function isAnyBool(val_)
{
   //Detects can the val_ be considered a some kind of boolean. Analog of is_any_bool() in /core/utils.php.
   
   return (typeof val_=='boolean')||/^(1|\+|on|ok|true|y|yes|да|0|-|off|not ok|false|negative|n|no|нет)$/i.test(val_);
}

function parseCompleteFloat(val_)
{
   //Unlike standard parseFloat() this function returns NaN if number input was incomplete, i.e. a decimal point was left without any digits after.
   // Its useful for the "input" event listeners with correcting feedback: doing something like {var val=parseFloat(input.value); if(!isNaN(val)) input.value=val;} will makes the user unable to enter a decimal point.
   
   res=NaN;
   
   if (typeof val_ =='number')
      res=val_;
   else if ((val_.charAt(val_.length-1)!='.')&&(val_.charAt(val_.length-1)!=','))
      res=parseFloat(val_);
   
   return res;
}

function mUnit(size_)
{
   //Returns measuring unit from the single linear dimension value in CSS format.
   //NOTE: Tolerant to leading and trailing spaces.
   
   var matches=/^\s*-?\d*\.?\d*(em|%|px|vw|vh)\s*$/i.exec(size_);
   return matches ? matches[1].toLowerCase() : '';
}

function toPixels(size_,context_)
{
   var res=null;
   
   var val=parseFloat(size_);
   var unit=mUnit(size_);
   switch (unit)
   {
      case 'em':
      {
         //Optionally requires context_.subj
         var subj=((context_!==undefined)&&context_.subj) ? context_.subj : document.body;
         
         var fontSize=parseFloat(window.getComputedStyle(subj).fontSize);
         if (!isNaN(fontSize))
            res=fontSize*val;
         
         break;
      }
      case '%':
      {
         //Requires context_.subj and context_.axis
         
         if ((context_!==undefined)&&context_.subj)
         {
            var pNode=context_.subj.parentNode;
            if (pNode)
            {
               var pStyle=window.getComputedStyle(pNode);
               var pSize=NaN;
               switch (pStyle.position)
               {
                  case 'fixed':
                  {
                     pSize=context_.axis.toLowerCase()=='y'? window.innerHeight : window.innerWidth;
                     break;
                  }
                  case 'absolute':
                  {
                     pSize=context_.axis.toLowerCase()=='y'? pNode.clientHeight : pNode.clientWidth;
                     break;
                  }
                  default:
                  {
                     pSize=context_.axis.toLowerCase()=='y'? pNode.clientHeight-parseFloat(pStyle.paddingTop)-parseFloat(pStyle.paddingBottom) : pNode.clientWidth-parseFloat(pStyle.paddingLeft)-parseFloat(pStyle.paddingRight);
                  }
               }
               if (!isNaN(pSize))
                  res=val/100*pSize;
            }
         }
         break;
      }
      case 'vw':
      {
         res=val/100*window.innerWidth;
         break;
      }
      case 'vh':
      {
         res=val/100*window.innerHeight;
         break;
      }
      default:
      {
         res=val;
      }
   }
   
   return res;
}

function formatDate(format_,date_)
{
   //Analog for PHP's date()
   
   if (date_===undefined||!(date_ instanceof Date))
      date_=new Date();
   if (format_===undefined)
      format_='Y-m-d H:i:s';
   
   //TODO: format support is incomplete
   var res=format_;
   
   res=res.replace('Y',date_.getFullYear());
   res=res.replace('m',(date_.getMonth()+1).toString().padStart(2,'0'));
   res=res.replace('d',date_.getDate().toString().padStart(2,'0'));
   res=res.replace('H',date_.getHours().toString().padStart(2,'0'));
   res=res.replace('i',date_.getMinutes().toString().padStart(2,'0'));
   res=res.replace('s',date_.getSeconds().toString().padStart(2,'0'));
   
   return res;
}

function clone(obj_)
{
   //Clone object
   
   var res=null;
   
   if (obj_ instanceof Array)
   {
      res=[];
      for (var i=0;i<obj_.length;i++)
         res.push(clone(obj_[i]));
   }
   else if(typeof obj_=='object')
   {
      res={};
      for (var k in obj_)
         res[k]=clone(obj_[k]);
   }
   else
   {
      res=obj_;
   }
   
   return res;
}

function extend(Child_,Parent_)
{
   //WARNING: this function is obsolete and depreciated.
   console.log('Function extend() is obsolete and depreciated. Replace objects that using it with classes.');
   //This function makes correct inheritance relations between Parent_ constructor function and Child_ constructor function.
   //Example of use:
   //function ParentClass(){/*properties and methods*/}     //declare parent constructor
   //func ChildClass(){/*extended properties and methods*/} //declare child constructor
   //extend(ChildClass,ParentClass);                        //make ParentClass a parent of ChildClass
   //var child=new ChildClass();                            //create ChildClass instance
   //(child instanceof ChildClass)==true;                   //-inheritance chain correctly works for multiply nesting
   //(child instanceof ParentClass)==true;                  //-nested properties are not sharing between different instances of child class
   
   Child_.prototype = new Parent_();
   Child_.constructor.prototype = Child_;
   Child_.super/*class*/ = Parent_.prototype;
}

function include(src_,once_)
{
   var isDuplicate=false;
   if (once_)
      isDuplicate=(document.querySelector('script[src="'+src_+'"]')!==null);
   
   if (!isDuplicate)
   {
      var scriptNode=document.createElement('script');
      scriptNode.src=src_;
      document.head.appendChild(scriptNode);
   }
   
   return !isDuplicate;
}