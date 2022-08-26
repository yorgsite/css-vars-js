
const CssVars=(function(){

	const CV=new (class{
		constructor(){
			this.map=new Map();
		}
		getSelector(selector,vars,prefix){
			if(!selector||typeof(selector)!=='string'){
				throw('\nCssVars Error:\nInvalid selector "'+selector+'".');
			}
			let sel,
			key=selector+'<prefix>'+prefix;
			if(this.map.has(key)){
				sel=this.map.get(key);
			}else{
				sel=new CssVarsSelector(selector,prefix);
				this.map.set(key,sel);
			}
			sel.vars=vars;
			return sel;
		}
		getRules(selector,filter=(sel,src)=>sel===src){
			const ssl=document.styleSheets,result=[];
			for(let i=0;i<ssl.length;i++){
				let rules=ssl[i].cssRules;
				for(let j=0;j<rules.length;j++){
					let sel=rules[j].selectorText.split(' > ').join('>');
					console.log('sel=',sel);
					if (filter(selector,sel)) {
						result.push(rules[j]);
					}
				}
			}
			return result;
		}
		getChildrenRules(selector){
			let result=this.getRules(selector,(s,v)=>v.indexOf(s)===0);
			console.log('result=',result);
			return result;
		}
		getRulesRecursive(selector,levels){
			let result=[];
			(levels?this.getSelectorsRecursive(selector,levels):[selector])
			.forEach(sel=>{
				result=result.concat(this.getRules(sel));
			});
			return result;
		}
		getSelectorsRecursive(selector,levels){
			levels=typeof(levels)==='number'?levels:(levels?Infinity:0);
			let sel='',sellist=[],result;
			let l=selector.split(/(\s+|[>:\s\.\[])/g).filter(v=>v);//.reduce((p,c)=>{},[]);
			for(let i=0;i<l.length;i+=2){
				if(sel){
					sel+=l[i-1]+l[i];
				}else{
					sel+=l[i];
					if(['.'].includes(l[i])){
						i++;
						sel+=l[i];
					}
				}
				if(sel)sellist.push(sel);
			}
			sellist.reverse();
			sellist=sellist.slice(0,levels+1);
			return sellist;
		}
	})();
	
	class CssVar{
		constructor(rule,prop){
			this.rule=rule;
			this.prop=prop;
			this.name=prop.substr(2);
		}
		
		get value(){
			return this.rule.style.getPropertyValue(this.prop);
		}
		set value(v){
			this.rule.style.setProperty(this.prop,v);
		}
	}
	
	class CssVarsSelector{
		constructor(selector,prefix){
			this._selector=selector;
			this._prefix=prefix;
			this._sheet=null;
			this._rule=null;
			this._ruleId=-1;
			this._vars=null;
			this._css=null;
			this._varsio={};
		}

		get sheet(){
			if(!this._sheet){
				if (document.styleSheets.length == 0) {
					let style=document.createElement('style');
					style.appendChild(document.createTextNode(""));
					document.documentElement.appendChild(style);
				}
				this._sheet=document.styleSheets[document.styleSheets.length - 1];
			}
			return this._sheet;
		}

		get rule(){
			if(!this._rule){
				let sheet=this.sheet;
				this._ruleId=sheet.cssRules.length;
				sheet.insertRule(this._selector + "{\n\n}", this._ruleId);
				this._rule=sheet.cssRules[sheet.cssRules.length - 1];	
			}
			return this._rule;
		}

		get vars(){
			if(!this._vars){
				this._vars=this.getProxy('getVar','setVar');
			}
			return this._vars;
		}
		set vars(v){
			this.setProxy('vars',v);
		}

		get css(){
			if(!this._css){
				this._css=this.getProxy('getCss','setCss');
			}
			return this._css;
		}
		set css(v){
			this.setProxy('css',v);
		}

		get ownVarNames(){
			let style=this.rule.style,names=[];
			for(let i=0;i<style.length;i++)names.push(style[i].substr(2));
			return names;
		}
		get varNames(){
			return Object.keys(this._varsio);
		}
		get ownVarsObj(){
			return this.varNamesToObj(this.ownVarNames);
		}
		get varsObj(){
			return this.varNamesToObj(this.varNames);
		}
		getProxy(get,set){
			let _get=(p)=>this[get](p);
			let _set=(p,v)=>this[set](p,v);
			return new Proxy({},{
				get:(tgt,prop)=>_get(prop),
				set:(tgt,prop,val)=>{
					_set(prop,val);
					return true;
				}
			});
		}
		setProxy(key,data){
			if(typeof(data)==='object'){
				let vars=this[key];
				for(let k in data){
					vars[k]=data[k];
				}
			}
		}
		varNamesToObj(names){
			let obj={};
			names.forEach(prop=>{
				obj[prop]=this.getVar(prop);
			});
			return obj;
		}
		importVars(recursive=true,override=false){
			// let vars=[];
			let rules=CV.getRulesRecursive(this._selector,recursive);
			rules.forEach(rul=>{
				for(let i=0;i<rul.style.length;i++){
					if(rul.style[i].indexOf('--')===0){
						let cv=new CssVar(rul,rul.style[i]);
						let key=this._prefix?cv.name:cv.prop;
						if(this._varsio[key]&&!override){
							this.delete(prop);
						}
						// vars.push(cv);
						this._varsio[key]=cv;
					}
				}
			});
			// console.log('importVars',vars);
		}
		kickDown(){
			console.log('kickDown');
			CV.getChildrenRules(this._selector);
		}

		getCss(prop){
			return this.rule.style[prop];
		}
		setCss(prop,value){
			this.rule.style[prop]=value;
		}
		getVar(prop){
			return this._varsio[prop]?this._varsio[prop].value:undefined;
		}
		setVar(prop,val){
			if(prop&&typeof(prop)==='string'){
				if(!this._varsio.hasOwnProperty(prop)){
					this._varsio[prop]=new CssVar(this.rule,this._prefix+prop);
				}
				this._varsio[prop].value=val;
			}else{
				throw('\nCssVars Error:\nInvalid var name "'+prop+'".')
			}
		}
		delete(prop){
			if(prop instanceof Array){
				this.delete(prop);
			}else{
				this.style.removeProperty(this._prefix+prop);
				if(this._varsio.hasOwnProperty(prop)){
					delete this._varsio[prop];
				}
			}
		}
		clear(){
			this.delete(this.ownVarNames);
		}
		destroy(){
			if(this._rule){
				this.clear();
				this._sheet.deleteRule(this._ruleId);
				this._rule=null;
				this._ruleId=-1;
				this._vars=null;
				this._data=null;
			}
		}
	
	}
	
	class CssVars{
		/**
		* Css vars manager from js.
		Use to dymamicly get/set css vars.

		* **NB** : If you use shadow dom or shadow emulation (with [Angular](https://angular.io/) for exemple), 
		* it is recommended **NOT** to declare vars in your component css
		* because they may override your **CssVars** instance declarations.
		* <u>Exemple : </u>
		<code>
		let varz=new CssVars('.divs>div:nth-child(odd)',{
			background:'#ff0000',// create --background var
			height:'100px'// create --height var
		});
		// ...
		</code>
		* 
		* @param {string} selector css selector . NB: All instances of the same selector Shares the same css rules
		* @param {Record<string,string>[]} vars initial css var set
		* @param {string} [prefix] style property var prefix (default='--')
		You can set to '' if you want to handle the prefix yourself.
		*/
		constructor(selector,vars=null,prefix='--'){
			this._priv=CV.getSelector(selector,vars,prefix);
		}
		/**
		* Returns a proxy to get/set css var
		* <u>Exemple : </u>
		<code>
		// ...
		let prop=varz.vars.background; // get current value
		varz.vars.background='#00ff00'; // change value
		</code>
		* @returns {Proxy}
		*/
		get vars(){
			return this._priv.vars;
		}

		/**
		* adds/change var values (see **ownVarsObj** to backup values)
		* <u>Exemple : </u>
		<code>
		// ...
		varz.vars={
			background:'#0000ff',// change/create --background var
			height:'50px'// change/create --height var
		};
		</code>
		* @value {Record<string,string>[]} 
		*/
		set vars(v){
			this._priv.vars=v;
		}

		// experimental
		get css(){
			return this._priv.css;
		}
		// experimental
		set css(v){
			this._priv.css=v;
		}

		/** local rule var names
		@value {string[]} 
		*/
		get ownVarNames(){
			return this._priv.ownVarNames;
		}

		/** local and imported rules var names
		@value {string[]} 
		*/
		get varNames(){
			return this._priv.varNames;
		}
		
		/**
		* An object mapping of local css vars values
		* Useful foc backup and copy.
		* <u>Exemple : </u> 
		<code>
			// assumes varz2 have a different selector.
			// Create new CssVars instance.
			let varz2=new CssVars('.divs>div:nth-child(even)',varz.ownVarsObj);
			// Copy in other CssVars instance.
			varz2.vars=varz.ownVarsObj;
		</code>

		* @value {Record<string,string>[]} 
		*/
		get ownVarsObj(){
			return this.varNamesToObj(this.ownVarNames);
		}

		/**
		* An object mapping of local and imported css vars
		* @value {Record<string,string>[]} 
		*/
		get varsObj(){
			return this._priv.varsObj;
		}

		/**
		* get css var value
		* @param {string} varName 
		* @return {string}
		*/
		getVar(varName){
			return this._priv.getVar(varName);
		}

		/**
		* set css var value
		* @param {string} varName 
		* @param {string} value 
		*/
		setVar(varName,value){
			return this._priv.setVar(varName,value);
		}

		/**
		* Import other css vars under this selector.
		* @param {boolean|number} recursive (default=true)
		Import vars from parent rules when true or >0.
		if `number` scan parent selectors **recursive** steps back.
		if `boolean` scan parent selectors to the bottom
		* @param {boolean} override (default=false)
		Override imported css vars locally if **true**.
		If **false**, imported css vars will override yours.
		* @return {CssVars}
		*/
		importVars(recursive=true){
			this._priv.importVars(recursive);
			return this;
		}
		/**
		* Overrides children rules vars.
		* If required, **importVars** should be called before
		* @return {CssVars}
		*/
		kickDown(){
			this._priv.kickDown();
			return this;
		}

		/**
		* Delete css var
		* @param {string[]|string} varName : the name(s) of the cssvar to remove.
		*/
		delete(varName){
			this._priv.delete(varName);
		}

		/**
		* Delete every local css vars
		*/
		clear(){
			this._priv.clear();
		}

		/**
		* Delete every local css vars and destroy selector rule.
		NB : Affects every CssVars instances sharing the same selector
		*/
		destroy(){
			this._priv.destroy();
		}

	}
	return CssVars;
})();

try{
	module.exports={CssVars};
}catch(e){}
