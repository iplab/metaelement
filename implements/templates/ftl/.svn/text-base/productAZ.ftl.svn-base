<#assign x = "<%"> 
<#assign y = "%>"> 
<#assign curModIndex = 0>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title><#if (page.title?exists)>${page.title}</#if></title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<meta name="keywords" content="<#if (page.keywords?exists)>${page.keywords}</#if>" />
	<meta name="description" content="<#if (page.description?exists)>${page.description}</#if>" />
	<meta name="dept" content="<#if (page.dept_name?exists)>${page.dept_name}</#if>" />
	<link rel="stylesheet" href="/media/global/global.css" type="text/css" />
	<!--[if IE]><link rel="stylesheet" type="text/css" href="/media/global/iestyles.css" /><![endif]-->
	<!--[if lt IE 7]><link rel="stylesheet" type="text/css" href="/media/global/ie6styles.css" /><![endif]-->
	<script type="text/javascript" src="/ipui/protoculous-packer.js"></script>
	<script type="text/javascript" src="/ipui/ipui-packer.js"></script>
</head>

<body<#if (page.dept_name?exists)> id="${page.dept_name}"</#if>>

<div id="container">
	<div id="header">
		<div id="accountbar">
			<ul>
				<li><a href="/ajax/layouts/shoppingcartLayout.html" class="icon-cart viewcart">Cart (<span id="ccMain">0</span>)</a>|</li>
				<li id="myaccount"></li>
				<li><a href="/my-account/track-order.html">Track Order</a>|</li>
				<li><a href="/help/index.html" class="helpusca">Help</a>|</li>
				<li><a href="/ajax/layouts/quick-shop.html" class="last demandlet-quickShop">Catalog Quickshop</a></li>
			</ul>
		</div>
		
		
		<div id="logo">
			<h1><a href="/" title="BBC Shop">BBC Shop</a></h1>
			<h2>Your purchase supports original BBC programming</h2>
		</div>
		<div id="signin">
			
		</div>
		<div id="main_navigation"></div>
	</div>
	<div id="toolbar" class="clearfix">
		<div id="breadcrumbs">
			<ul>
				<li><a href="/" class="first">Home</a></li>
				<#if (page.dept?exists) && (page.dept_name?exists)><#if page.dept != "Home"><li>&gt;<span class="current">${page.dept}</span></li></#if></#if>
			</ul>
		</div>
		
		<h2>FREE Shipping on orders over $100!</h2>
		<div id="search">
			<label for="searchfor">Search For:</label>
			<input id="searchfor" type="text" class="search-field" value="Keyword or Item #" onFocus="this.value=''" /> in 
			<select id="searchselect">
				<option value="">All Products</a>
			</select>
			<input src="/media/global/btn-go.gif" id="search-submit" value="Go" type="image" class="search-btn" />
		</div>
		<script>
		prepareSearch();
		</script>
	</div>
	<div id="wrapper" class="clearfix">
		<div id="leftcolumn">
			<h2>Browse:</h2>
			<div class="demandlet-localNav list"></div>
		</div>
		<div id="centercolumn">
			<h1 class="title" style="margin: 0 0 1px 0;">Products A - Z</h1>
			<div class="productsaz-container">
				<ul class="browseby">
					<li><span>Browse by:</span></li>
					<li><a href="products-a.html">A</a></li>
					<li><a href="products-b.html">B</a></li>
					<li><a href="products-c.html">C</a></li> 
					<li><a href="products-d.html">D</a></li>
					<li><a href="products-e.html">E</a></li>
					<li><a href="products-f.html">F</a></li>
					<li><a href="products-g.html">G</a></li>
					<li><a href="products-h.html">H</a></li>
					<li><a href="products-i.html">I</a></li>
					<li><a href="products-j.html">J</a></li>
					<li><a href="products-k.html">K</a></li>
					<li><a href="products-l.html">L</a></li>
					<li><a href="products-m.html">M</a></li>
					<li><a href="products-n.html">N</a></li>
					<li><a href="products-o.html">O</a></li>
					<li><a href="products-p.html">P</a></li>
					<li><a href="products-q.html">Q</a></li>
					<li><a href="products-r.html">R</a></li>
					<li><a href="products-s.html">S</a></li>
					<li><a href="products-t.html">T</a></li>
					<li><a href="products-u.html">U</a></li>
					<li><a href="products-v.html">V</a></li>
					<li><a href="products-w.html">W</a></li>
					<li><a href="products-x.html">X</a></li>
					<li><a href="products-y.html">Y</a></li>
					<li><a href="products-z.html">Z</a></li>
					<li><a href="products-0-9.html">0-9</a></li>
				</ul>
				
			<#if (page.character?exists)><h2>${page.character}</h2></#if>
				
				<ul class="letter">
				
						<#list page.product as products>
							<#if (products.title?exists)>
							<li><#if (products.page_name?exists)><a href="${products.page_name}">${products.title}</a></#if></li>
							</#if>
						</#list>
				
				</ul>
				
			</div>

		</div>
		<div id="rightcolumn">
			<!-- Custom Modules -->
			<#if (page.section_0?exists)>
				<#assign section=page.section_0?number>
				<#list page.moduleIncludes as moduleInclude>
					<#if moduleInclude_index < section>
						${x}@ include file="${moduleInclude}" ${y}
						<#assign curModIndex = curModIndex+1>
					</#if>  
				</#list>
			</#if>	
			<!-- /Custom Modules -->	
		</div>

	</div><!-- closes wrapper div -->

</div><!-- closes container div -->

<div id="footer">
	<!-- START CONTROLSCAN CODE -->
		<div id="cscan-seal">
			<a id="cscan_country" href="#" target="verify"><img border="0" oncontextmenu="alert('Copying Prohibited by Law - Trademark of ControlScan.com'); return false;" alt="Internet Security By ControlScan" /></a>
			<script>changeControlScans($('cscan_country'), 'noncheckout')</script>
		</div>
	<!-- STOP CONTROLSCAN CODE -->
	<h4>Order by Phone: 1-800-898-4921</h4>
	<ul>
		<li><a href="/help/other-about.html">About the BBC</a>|</li>
		<li><a href="/help/shipping-rates.html">Shipping Rates &amp; Policies</a>|</li>
		<li><a href="/help/return-policy.html">Return an Item</a>|</li>
		<li><a href="/help/privacy-notice.html">Privacy Notice</a>|</li>
		<li><a href="/help/contact-us.html">Customer Service</a>|</li>
		<li><a href="/help/index.html">Help/FAQ</a>|</li>
		<li><a href="/help/other-affiliate.html">Affiliate Network</a></li>
	</ul>
	<p>By using this web site, you accept the <a href="/help/privacy-notice.html">terms and conditions</a>. &copy;2007 BBC Worldwide Americas Inc.</p>
</div>

<script src="http://www.google-analytics.com/urchin.js" type="text/javascript"></script>
<script type="text/javascript">
	_uacct = (function() {return cc[getCountry()]; })();
	urchinTracker();
</script>


</body>
</html>