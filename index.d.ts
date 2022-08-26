	
export class CssVars {
	constructor(group: string,vars?:Record<string,string>|null,prefix?:string);
	get vars():Record<string,string>;
	set vars(v:Record<string,string>);
	get css():Record<string,string>;
	set css(v:Record<string,string>);
	get ownVarNames():Array<string>;
	get varNames():Array<string>;
	get ownVarsObj():Record<string,string>;
	get varsObj():Record<string,string>;
	getVar(varName:string):string;
	setVar(varName:string,value:string):string;
	importVars(recursive?:boolean|number):CssVars;
	kickDown():CssVars;
	delete(varName:string[]|string);
	clear():void;
	destroy():void;
}
