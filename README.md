

# css-vars-js

#### A css vars js/ts handler.</br>

About [css vars](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

+ Scope limited to selector (and optionnaly selector parents).
+ Simple interaction with css vars via proxy.
+ Existing css vars importation.

<u>Exemple:</u>

css
``` css
.divs>div{
	/* ... */
	--border:5px;
	background-color: var(--background);
	height: var(--height);
	border: solid var(--border);
}

```
js
``` javascript
// targets only targeted rule odd elements
let varz=new CssVars('.divs>div:nth-child(odd)',{
	background:'#ff0000',// create --background var
	height:'100px'// create --height var
})
// imports border vars
.importVars(1);

let prop=varz.vars.background; // get --background current value for odd divs

varz.vars.background='#00ff00'; // change --background value for odd divs

varz.vars.border=5+'px'; // change --border value for odd and even divs
```

<hr/>


<u>Learn more :</u>

+ CssVars **[API](CssVars.js.md)** documentation.

+ Use exemple : **[CssVars demo](index.html)**.
