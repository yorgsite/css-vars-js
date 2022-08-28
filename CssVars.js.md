 
# CssVars.js
 
 
<hr/>
 
+ `class` [CssVars](#tgt_CssVars)
  + getter [vars](#tgt_vars)
  + setter [vars](#tgt_vars)
  + getter [ownVarNames](#tgt_ownVarNames)
  + getter [varNames](#tgt_varNames)
  + getter [ownVarsObj](#tgt_ownVarsObj)
  + getter [varsObj](#tgt_varsObj)
  + method [getVar](#tgt_getVar)
  + method [setVar](#tgt_setVar)
  + method [importVars](#tgt_importVars)
  + method [kickDown](#tgt_kickDown)
  + method [delete](#tgt_delete)
  + method [clear](#tgt_clear)
  + method [destroy](#tgt_destroy)
 
<hr/>
 
## <a name="tgt_CssVars"></a> `class` **CssVars**
 
 Css vars manager from js.<br/>
Use to dymamicly get/set css vars.<br/>
<br/>
 **NB** : If you use shadow dom or shadow emulation (with [Angular](https://angular.io/) for exemple), <br/>
 it is recommended **NOT** to declare vars in your component css<br/>
 because they may override your **CssVars** instance declarations.<br/>
 <u>Exemple : </u>
```

let varz=new CssVars('.divs>div:nth-child(odd)',{
	background:'#ff0000',// create --background var
	height:'100px'// create --height var
});
// ...

```
 
+ param `string` **selector**  css selector . NB: All instances of the same selector Shares the same css rules
 
+ param `Record<string,string>[]` **vars**  initial css var set
 
+ param `string` **prefix** ] style property var prefix (default='--')<br/>
You can set to '' if you want to handle the prefix yourself.
<hr/>
 
### <a name="tgt_vars"></a> getter `Proxy` **vars** 
 
 Returns a proxy to get/set css var<br/>
 <u>Exemple : </u>
```

// ...
let prop=varz.vars.background; // get current value
varz.vars.background='#00ff00'; // change value

```
<hr/>
 
### <a name="tgt_vars"></a> setter `Record<string,string>[]` **vars** 
 
 adds/change var values (see **ownVarsObj** to backup values)<br/>
 <u>Exemple : </u>
```

// ...
varz.vars={
	background:'#0000ff',// change/create --background var
	height:'50px'// change/create --height var
};

```
<hr/>
 
### <a name="tgt_ownVarNames"></a> getter `string[]` **ownVarNames** 
 
local rule var names
<hr/>
 
### <a name="tgt_varNames"></a> getter `string[]` **varNames** 
 
local and imported rules var names
<hr/>
 
### <a name="tgt_ownVarsObj"></a> getter `Record<string,string>[]` **ownVarsObj** 
 
 An object mapping of local css vars values<br/>
 Useful foc backup and copy.<br/>
 <u>Exemple : </u> 
```

	// assumes varz2 have a different selector.
	// Create new CssVars instance.
	let varz2=new CssVars('.divs>div:nth-child(even)',varz.ownVarsObj);
	// Copy in other CssVars instance.
	varz2.vars=varz.ownVarsObj;

```
<hr/>
 
### <a name="tgt_varsObj"></a> getter `Record<string,string>[]` **varsObj** 
 
An object mapping of local and imported css vars
<hr/>
 
### <a name="tgt_getVar"></a> method **getVar**
 
get css var value
 
+ param `string` **varName** 
 
+ return `string` 
<hr/>
 
### <a name="tgt_setVar"></a> method **setVar**
 
set css var value
 
+ param `string` **varName** 
 
+ param `string` **value** 
<hr/>
 
### <a name="tgt_importVars"></a> method **importVars**
 
 Import other css vars under this selector.
 
+ param `boolean|number` **recursive**  (default=true)<br/>
Import vars from parent rules when true or >0.<br/>
if `number` scan parent selectors **recursive** steps back.<br/>
if `boolean` scan parent selectors to the bottom
 
+ param `boolean` **override**  (default=false)<br/>
Override imported css vars locally if **true**.<br/>
If **false**, deeper imported css vars will override yours.
 
+ return `CssVars` 
<hr/>
 
### <a name="tgt_kickDown"></a> method **kickDown**
 
Overrides children rules vars.<br/>
If required, **importVars** should be called before.<br/>
Does not work o, shadow dom
 
+ return `CssVars` 
<hr/>
 
### <a name="tgt_delete"></a> method **delete**
 
Delete css var
 
+ param `string[]|string` **varName**  : the name(s) of the cssvar to remove.
<hr/>
 
### <a name="tgt_clear"></a> method **clear**
 
Delete every local css vars
<hr/>
 
### <a name="tgt_destroy"></a> method **destroy**
 
 Delete every local css vars and destroy selector rule.<br/>
NB : Affects every CssVars instances sharing the same selector
<hr/>