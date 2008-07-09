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

<body>

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
	<div id="toolbar" class="clearfix" style="padding-top: 14px;">
		
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
		<div id="centercolumn">
			<div id="flashcontent-home"><p>For a complete experience, this site requires the Adobe Flash Player&#151;please download from: <a href="http://www.adobe.com/products/flashplayer/" target="_blank">http://www.adobe.com/products/flashplayer/</a></p></div>
			<!-- Custom Modules -->
			<#if (page.section_1?exists)>
				<#assign section=page.section_1?number+section>
				<#list page.moduleIncludes as moduleInclude>
					<#if (curModIndex < section) && (moduleInclude_index = curModIndex)>
						${x}@ include file="${moduleInclude}" ${y}
						<#assign curModIndex = curModIndex+1>
					</#if>  
				</#list>
			</#if>	
			<!-- /Custom Modules -->
		</div>
		<div id="rightcolumn">
			<!-- Custom Modules -->
			<#if (page.section_2?exists)>
				<#assign section=page.section_2?number+section>
				<#list page.moduleIncludes as moduleInclude>
					<#if (curModIndex < section) && (moduleInclude_index = curModIndex)>
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

	<script type="text/javascript">
		var so = new SWFObject("/media/home/bbca_shop_home.swf", "Home Flash", "555", "335", "8", "");
		so.addVariable("xml", "/media/home/flash_home.xml");
		so.addParam("quality", "high");
		so.addParam("wmode", "transparent");
		so.write("flashcontent-home");
	</script>
	
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript"></script>
<script type="text/javascript">
	_uacct = (function() {return cc[getCountry()]; })();
	urchinTracker();
</script>

</body>
</html>