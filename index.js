module.exports = scope;
scope.replace = replace;

function scope (css, parent) {
	if (!css) return css;

	if (!parent) return css;

  //replace with respect for any leading whitespace
	css = replace(css, function (m, $1, $2) {
		var leading = $1.match(/^\s*/)[0];
		$1 = $1.slice(leading.length);
		return leading + parent + ' ' + $1 + $2;
	});

	//regexp.escape
	let parentRe = parent.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

	//replace self-selectors
	css = css.replace(new RegExp('(' + parentRe + ')\\s*\\1(?=[\\s\\r\\n,{])', 'g'), '$1');

	//replace `:host` with parent
	css = css.replace(new RegExp('(' + parentRe + ')\\s*:host', 'g'), '$1');

	//revoke wrongly replaced @ statements, like @supports, @import, @media etc.
	css = css.replace(new RegExp('(' + parentRe + ')\\s*@', 'g'), '@');

	return css;
}

function replace (css, replacer) {
	//strip block comments
	css = css.replace(/\/\*([\s\S]*?)\*\//g, '');

	return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, replacer);
}
