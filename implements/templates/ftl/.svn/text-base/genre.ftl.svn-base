<#assign x = "<%"> 
<#assign y = "%>"> 
<#assign curModIndex = 0>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title><#if (genre.name?exists)>${genre.name}</#if></title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<meta name="category_id" content="<#if (genre.category_id?exists)>${genre.category_id}</#if>" />
	<meta name="genre_id" content="<#if (genre.genre_id?exists)>${genre.genre_id}</#if>" />
	<meta name="genre_type" content="<#if (genre.name?exists)>${genre.name}</#if>" />
	<meta name="dept" content="<#if (genre.primary_dept_name?exists)>${genre.primary_dept_name}</#if>" />
	<link rel="stylesheet" href="/media/global/global.css" type="text/css" />
	<!--[if IE]><link rel="stylesheet" type="text/css" href="/media/global/iestyles.css" /><![endif]-->
	<!--[if lt IE 7]><link rel="stylesheet" type="text/css" href="/media/global/ie6styles.css" /><![endif]-->
	<script type="text/javascript" src="/ipui/protoculous-packer.js"></script>
	<script type="text/javascript" src="/ipui/ipui-packer.js"></script>
</head>

<body<#if (genre.primary_dept_name?exists)> id="${genre.primary_dept_name}"</#if>>

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
				<#if (genre.primary_dept?exists) && (genre.primary_dept_name?exists)><li>&gt;<a href="/${genre.primary_dept_name}">${genre.primary_dept}</a></li></#if>
				<#if (genre.name?exists) && (genre.name != 'Magazines')><li>&gt;<span class="current">${genre.name}</span></li></#if>
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
			<#if (genre.name?exists)><h1 class="title" style="margin: 0;">${genre.name}</h1></#if>
			<div class="demandlet-genreProducts" <#if (genre.count?exists)>cols="${genre.count}"</#if>></div>
		</div>
		<div id="rightcolumn">
			<!-- Custom Modules -->
			<#if (genre.section_0?exists)>
				<#assign section=genre.section_0?number>
				<#list genre.moduleIncludes as moduleInclude>
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