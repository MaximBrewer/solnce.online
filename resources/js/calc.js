

export default class PlantCalc
{
   constructor(nodeSelector_,data_)
   {
      //private props
      this._initialized=false;
      this._data=data_;
      this._ages=[];
      this._nodeSelector=nodeSelector_;
      this._calcNode=document.querySelector(this._nodeSelector);
      this._calcForm=this._calcNode&&this._calcNode.querySelector('form');
      this._ageRadioGrps=null;
      this._plantsRadioGrp=null;
      this._ageIndicator=null;
      this._efficiencyIndicator=null;
      this._priceIndicator=null;
      this._fruitPriceIndicator=null;
      this._costIndicator=null;
      this._table=null;
      this._ageRadiosL=[];
      this._ageRadiosR=[];
      this._precision=2;
      
      //Get main node
      if (this._prepareData()&&this._calcNode&&this._calcForm)
      {
         this._ageRadioGrps=this._calcNode.querySelectorAll('.age_radiogroup');
         this._plantsRadioGrp=this._calcNode.querySelector('.plant_selector');
         this._ageIndicator=this._calcNode.querySelector('.age.indicator .value');
         this._efficiencyIndicator=this._calcNode.querySelector('.efficiency.indicator .value');;
         this._priceIndicator=this._calcNode.querySelector('.plant_price.single .value');
         this._fruitPriceIndicator=this._calcNode.querySelector('.fruit_price.single .value');
         this._costIndicator=this._calcNode.querySelector('.plant_price.summary .value');
         this._table=this._calcNode.querySelector('.pricing_list');
         
         
         var sender=this;
         //Init ages selector
         this._reinitAges();
         
         //Init plant selector
         //document.body.addEventListener('click',function(e_){sender._plantsRadioGrp.classList.remove('unfolded');});
         this._reinitPlants();
         
         //Init range bar
         this.qtyRange=new RangeBar(this._calcNode.querySelector('.range_bar'),{max:this._data.qtyMax});
         this.qtyRange.onInput=function(){sender.calc();};
         
         this._initialized=true;
         this.calc();
      }
      else
         console.error('PlantsCalc:'+(!this._calcNode ? ' Main calc node was not found by "'+this._nodeSelector+'".' : '')+(!this._data ? ' There is no html form found into main calc node.' : '')+(!this._data ? ' There is no source data.' : ''));
   }
   
   //private methods
   _prepareData()
   {
      var isDataOk=true;
      
      //Express test source data
      if (!this._data)
      {
         console.error('PlantsCalc: There is no data for calculations.');
         isDataOk=false;
      }
      else
      {
         if (!(this._data.plants&&(this._data.plants.length>0)))
         {
            console.error('PlantsCalc: There is no plants in source data.');
            isDataOk=false;
         }
         else 
            for (var plant of this._data.plants)
            {
               if (!(plant.prices&&(plant.prices.length>0)))
               {
                  console.error('PlantsCalc: There is no prices for plant "'+plant.name+'". Array of {age:_int_,val:_number_} required.');
                  isDataOk=false;
               }
               if (!(plant.productivity&&(plant.productivity.length>0)))
               {
                  plant.productivity={age:0,min:0,max:0};
                  console.warn('PlantsCalc: There is no productivity for plant "'+plant.name+'". Assumed to '+JSON.stringify(plant.productivity)+'.');
               }
               if (typeof plant.fruitPrice =='undefined')
               {
                  plant.fruitPrice=0;
                  console.warn('PlantsCalc: There is no fruitPrice for plant "'+plant.name+'". Assumed to '+plant.fruitPrice+'.');
               }
            }
         
         if (typeof this._data.planting =='undefined')
         {
            plant.planting=0;
            console.warn('PlantsCalc: There is no planting cost in source data. Assumed to '+plant.planting+'.');
         }
         if (!(this._data.maint&&(this._data.maint.length>0)))
         {
            this._data.maint=[{age:0,values:[{qty:1,val:0}]}];
            console.warn('PlantsCalc: There is no maint costs in source data. Assumed to '+JSON.stringify(this._data.maint)+'.');
         }
         if (!(this._data.maintExtraDiscounts&&(this._data.maintExtraDiscounts.length>0)))
         {
            this._data.maintExtraDiscounts=[{qty:0,val:0}];
            console.warn('PlantsCalc: There is no maint costs in source data. Assumed to '+JSON.stringify(this._data.maintExtraDiscounts)+'.');
         }
         if (!this._data.qtyMax)
         {
            this._data.qtyMax=100;
            console.warn('PlantsCalc: There is no max quantity parameter qtyMax in source data. Assumed to '+this._data.qtyMax+'.');
         }
         if (!(this._data.qtySteps&&(this._data.qtySteps.length>0)))
         {
            this._data.qtySteps=[1];
            var stepsCnt=5;
            for (var i=1;i<stepsCnt;i++)
               this._data.qtySteps.push(Math.ceil(this._data.qtyMax/stepsCnt*i));
            console.warn('PlantsCalc: There is no qtySteps in source data. Assumed to '+JSON.stringify(this._data.qtySteps)+'.');
         }
         if (typeof this._data.currencyScale =='undefined')
            plant.currencyScale=1;
         
         //Cache some data
         for (var price of this._data.plants[0].prices)
            this._ages.push(price.age);
      }
      
      return isDataOk;
   }
   
   _reinitAges()
   {
      //Init age selector
      
      if (this._ageRadioGrps.length>=2)
      {
         //Cleanup old selectors
         for (var node of this._ageRadioGrps)
            while (node.childNodes.length>0)
               node.removeChild(node.childNodes[0]);
         
         //Make new selectors
         for (var age of this._ages)
         {
            this._ageRadiosL.push(buildNodes({tagName:'label',className:'age radio',childNodes:[{tagName:'input',type:'radio',name:'agesL[]',value:age},''+age]}));
            this._ageRadiosR.push(buildNodes({tagName:'label',className:'age radio',childNodes:[{tagName:'input',type:'radio',name:'agesR[]',value:age},''+age]}));
            this._ageRadioGrps[0].appendChild(this._ageRadiosL[this._ageRadiosL.length-1]);
            this._ageRadioGrps[1].appendChild(this._ageRadiosR[this._ageRadiosR.length-1]);
         }
         
         //Assign event listeners
         var sender=this;
         for (var radio of this._calcForm.elements['agesL[]'])
         {
            initRadio(radio);
            radio.addEventListener('click',function(e_){sender._onAgeSelected(this);});
         }
         for (var radio of this._calcForm.elements['agesR[]'])
         {
            initRadio(radio);
            radio.addEventListener('click',function(e_){sender._onAgeSelected(this);});
         }
         
         //Select 1sh case
         this._calcForm.elements['agesL[]'][0].dispatchEvent(new Event('click'));
         this._calcForm.elements['agesR[]'][0].dispatchEvent(new Event('click')); //Hotfix
      }
      else
         console.error('PlantsCalc: There is no two containers for age radios was found into main node by selector ".age_radiogroup".');
   }
   
   _reinitPlants()
   {
      //Init plants selector
      if (this._data.plants&&this._plantsRadioGrp)
      {
         var listNode=this._plantsRadioGrp.querySelector('.list')||this._plantsRadioGrp;
         
         //Cleanup list
         while (listNode.childNodes.length>0)
            listNode.removeChild(listNode.childNodes[0]);
         
         //Make new list items
         var sender=this;
         for (var i in this._data.plants)
         {
            var option=buildNodes({tagName:'label',className:'option radio',childNodes:[{tagName:'input',type:'radio',name:'plants[]',value:i,checked:(i==0)},this._data.plants[i].name]});
            initRadio(option.childNodes[0]);
            option.childNodes[0].addEventListener('click',function(e_){sender._onPlantSelected(this);/* return cancelEvent(e_);*/});
            listNode.appendChild(option);
         }
      }
      else
         console.error('PlantsCalc: There is no container for plant name radios was found into main node by selector ".plant_selector".');
   }
   
   _renderTable(tableData_)
   {
      if (this._table)
      {
         var trs={
                    qty:'<TH COLSPAN="2">Количество деревьев</TH>',
                    maintPerPlant1stY:'<TH COLSPAN="2">Обслуживание 1-го дерева</TH>',
                    maintSum1stY:'<TH COLSPAN="2">Обслуживание 1-ый год</TH>',
                    maintTotal:'<TH COLSPAN="2">Обслуживание за весь период</TH>',
                    plantingSum:'<TH COLSPAN="2">Стоимость посадки</TH>',
                    fruitsIncomeMin:'<TH>Доход от плодов </TH><TH>мин.</TH>',
                    fruitsIncomeMax:'<TH>в год</TH><TH>мак.</TH>',
                    plantsIncome:'<TH COLSPAN="2">Доход от роста саженца</TH>',
                    summaryMin:'<TH>Итого</TH><TH>мин.</TH>',
                    summaryMax:'<TH></TH><TH>макс.</TH>',
                 };
         var precMult=Math.pow(10,this._precision);
         for (var col of tableData_)
            for (var key in trs)
               trs[key]+='<TD'+(col.selected ? ' CLASS="sel"' : '')+'>'+(Math.round(col[key]*precMult)/precMult)+'</TD>';
         
         var tableContents='';
            for (var key in trs)
               tableContents+='<TR><TD CLASS="padder"></TD>'+trs[key]+'<TD CLASS="padder"></TD></TR>\n';
         
         this._table.innerHTML=tableContents;
      }
   }
   
   _onAgeSelected(actuatedRadio_)
   {
      //Update radios on other side
      var targetName=(actuatedRadio_.name=='agesL[]' ? 'agesR[]' : 'agesL[]');
      this._calcForm.elements[targetName].value=actuatedRadio_.value;
      for (var radio of this._calcForm.elements[targetName]) 
         radio.repaint();
      
      //Update indicators
      if (this._ageIndicator)
         this._ageIndicator.textContent=actuatedRadio_.value;
      
      //Recalc
      this.calc();
   }
   
   _onPlantSelected(actuatedRadio_)
   {
      if (this._plantsRadioGrp.classList.contains('unfolded'))
      {
         this._plantsRadioGrp.classList.remove('unfolded');
         
         //Recalc
         this.calc();
      }
      else
         this._plantsRadioGrp.classList.add('unfolded');
   }
   
   _selectByLevel(prop_,level_,array_)
   {
      //Find an element of array_, having property prop_ not greater than given level_.
      
      var res=array_[0];
      
      for (var elem of array_)
         if (level_>=elem[prop_])
            res=elem;
         else
            break;
      
      return res;
   }
   
   _integralToLevel(prop_,level_,addendum_,array_)
   {
      var res=0;
      
      var lastI=0;
      for (var i=1;i<array_.length;i++)
         if (array_[i][prop_]<=level_)
         {
            res+=array_[lastI][addendum_]*(array_[i][prop_]-array_[lastI][prop_]);
            lastI=i;
         }
         else
            break;
      res+=array_[lastI][addendum_]*(level_+1-array_[lastI][prop_]);
      
      return res;
   }
   
   //public methods
   reinit(data_)
   {
      if (data_)
      {
         this._data=data_
         this._prepareData();
         this._reinitAges();
         this._reinitPlants();
      }
   }
   
   calc()
   {
      var res={price:0,maint:0,maintSum:0};
      
      if (this._initialized)
      {
         //Prepare
         var plant=this._data.plants[this._calcForm.elements['plants[]'].value]; //Get plant prices
         var age=parseInt(this._calcForm.elements['agesL[]'].value);
         var qty=parseInt(this._calcForm.elements.qty.value);
         
         var price=this._selectByLevel('age',age,plant.prices);
         var maints=plant.maint||this._data.maint;
         
         //Calc table
         var tableData=[];
         for (var qtyStep of this._data.qtySteps)
         {
            var col={qty:qtyStep,selected:false};
            
            if (qty>=qtyStep)
            {
               col.selected=true;
               if (tableData.length>0)
                  tableData[tableData.length-1].selected=false;
            }
            
            var maintExtraDiscByQty=this._selectByLevel('qty',qtyStep,this._data.maintExtraDiscounts).val;                                //Extra discount, a value deducting from maintenance cost of each tree.
            col.maintPerPlant1stY=this._selectByLevel('age',1,this._selectByLevel('qty',qtyStep,maints).values).val-maintExtraDiscByQty;  //Maintenance per plant at 1st year.
            col.maintSum1stY=col.maintPerPlant1stY*qtyStep;                                                                               //Maintenance of all plants at 1st year.
            var maintByQty=this._selectByLevel('qty',qtyStep,maints).values;                                                              //Variants of maintenance cost per plant for given quantity.
            col.maintTotal=(this._integralToLevel('age',age,'val',maintByQty)-maintExtraDiscByQty)*qtyStep;                               //Total maintenance of all plants during selected period of time.
            
            col.plantingSum=(plant.planting!=null ? plant.planting : this._data.planting)*qtyStep;                                        //Summary costs of planting.
            
            var prodMin=this._integralToLevel('age',age,'min',plant.productivity);     //Min and max amounts of fruits that may be harvested from 1 plant for selected period of time.
            var prodMax=this._integralToLevel('age',age,'max',plant.productivity);     //
            col.fruitsIncomeMin=plant.fruitPrice*prodMin*qtyStep;                      //Min and max expected income from selling of all harvests.
            col.fruitsIncomeMax=plant.fruitPrice*prodMax*qtyStep;                      //
            col.plantsIncome=price.val*qtyStep;                                        //Income from the plants themselves.
            
            col.summaryMin=col.fruitsIncomeMin+col.plantsIncome-col.maintTotal-this._data.planting*qtyStep;    //Min and max profit from all plants for selected period
            col.summaryMax=col.fruitsIncomeMax+col.plantsIncome-col.maintTotal-this._data.planting*qtyStep;    //
            
            tableData.push(col);
         }
         
         //Calc selected quantity
         res.price=price.val;
         var maintByQty=this._selectByLevel('qty',qty,maints).values;
         var maintExtraDiscByQty=this._selectByLevel('qty',plant.maintExtraDiscounts||qty,this._data.maintExtraDiscounts).val;
         res.maint=this._integralToLevel('age',age,'val',maintByQty)-maintExtraDiscByQty;
         res.maintSum=res.maint*qty;
         
         //Recalc prices
         if (this._data.currencyScale!=1)
         {
            var priceKeys=['maintPerPlant1stY','maintSum1stY','maintTotal','plantingSum','fruitsIncomeMin','fruitsIncomeMax','plantsIncome','summaryMin','summaryMax'];
            for (var col of tableData)
               for (var key of priceKeys)
                  col[key]*=this._data.currencyScale;
            
            for (var key in res)
               res[key]*=this._data.currencyScale;
         }
         
         //Repaint
         var precMult=Math.pow(10,this._precision);
         if (this._priceIndicator)
            this._priceIndicator.textContent=Math.round(res.price*precMult)/precMult;
         if (this._costIndicator)
            this._costIndicator.textContent=Math.round(res.maintSum*precMult)/precMult;
         if (this._fruitPriceIndicator)
            this._fruitPriceIndicator.textContent=Math.round(plant.fruitPrice*precMult)/precMult;
         if (this._efficiencyIndicator)
            this._efficiencyIndicator.textContent=Math.round(res.maint*precMult)/precMult;
         
         this._renderTable(tableData);
      }
      
      return res;
   }
}