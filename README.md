

# css-vars-js

#### A css custom properties js/ts handler.</br>

What are [css custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) ?

+ Scope limited to selector (and optionnaly selector parents).
+ Simple interaction with css vars via proxy.
+ Existing css vars importation.

Install
```
npm install css-vars-js
```

import in web page
``` html
<script src="path/to/css-vars-js/CssVars.js"></script>
```

import in Node
``` html
import {CssVars} from 'css-vars-js';
```

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
// import ... ;

// targets only '.divs>div' rule odd elements
let varz=new CssVars('.divs>div:nth-child(odd)',{
	background:'#ff0000',// create --background var
	height:'100px'// create --height var
})
// imports "border" var
.importVars(1);

let prop=varz.vars.background; // get --background current value for odd divs

varz.vars.background='#00ff00'; // change --background value for odd divs

varz.vars.border=5+'px'; // change --border value for odd and even divs
```


Do some theming :
``` javascript
// import ... ;
const themes={
	"A":{
		background:'#ff0000',
		height:'100px'
	},
	"B":{
		background:'#00ff00',
		height:'50px'
	}
};

// targets only declared rule odd elements
let varz=new CssVars('.divs>div:nth-child(odd)',themes.A);

varz.vars=themes.B;// change theme
```



<hr/>


<u>Learn more :</u>

+ CssVars **[API](CssVars.js.md)** documentation.
+ **[CssVars demo](https://yorgsite.github.io/css-vars-js/)**
+ **[demo source](index.html)**.
