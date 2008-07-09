<#assign x = "<%"> 
<#assign y = "%>"> 
<#assign curModIndex = 0>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title><#if (closeup.title?exists)>${closeup.title}</#if></title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<meta name="keywords" content="<#if (closeup.keywords?exists)>${closeup.keywords}</#if>" />
	<meta name="description" content="<#if (closeup.description?exists)>${closeup.description}</#if>" />
	<meta name="dept" content="<#if (closeup.dept_name?exists)>${closeup.dept_name}</#if>" />
	<meta name="closeup_id" content="<#if (closeup.closeup_id?exists)>${closeup.closeup_id}</#if>" />
	<link rel="stylesheet" href="/media/global/global.css" type="text/css" />
	<!--[if IE]><link rel="stylesheet" type="text/css" href="/media/global/iestyles.css" /><![endif]-->
	<!--[if lt IE 7]><link rel="stylesheet" type="text/css" href="/media/global/ie6styles.css" /><![endif]-->
	<script type="text/javascript" src="/ipui/protoculous-packer.js"></script>
	<script type="text/javascript" src="/ipui/ipui-packer.js"></script>
</head>

<body<#if (closeup.dept_name?exists)> id="${closeup.dept_name}"</#if>>

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
				<#if (closeup.dept?exists && closeup.dept_name?exists)><li>&gt;<a href="/${closeup.dept_name}">${closeup.dept}</a></li></#if>
				<#if (closeup.type?exists && closeup.type_name?exists && closeup.dept_name?exists)><li>&gt;<a href="/${closeup.dept_name}/${closeup.type_name}">${closeup.type}</a></li></#if>
				<#if (closeup.title?exists)><li>&gt;<span class="current">${closeup.title}</span></li></#if>
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
			<div class="closeup-recipebox">
				<ul id="closeup-recipebox-list" class="tab-list clearfix">
				    <#assign index = 0>
				    <li class="current"><a href="#tab_${index}"><span>Feature Summary</span></a></li>
				    <#list closeup.tab as tabs>
				       	<#assign index = index + 1>
				    	<li><a href="#tab_${index}"><span>${tabs.name}</span></a></li>
				    </#list>
				</ul>
				<#assign index = 0>
				<div id="tab_${index}" class="featuresummary-box clearfix">
					<div class="left">
						<#if (closeup.image_url?exists)><img src="${closeup.image_url}" alt="Close-Up Image" /></#if>
					</div>
					<div class="right">
						<#if (closeup.title?exists)><h2>${closeup.title}</h2></#if>
						<#if (closeup.closeup_short_desc?exists)><div class="closeup-desc"><p>${closeup.closeup_short_desc}</p></div></#if>
					</div>
				</div>
				<#list closeup.tab as tabs>
					<#assign index = index + 1>
					<#if (tabs.content?exists)>
					<div id="tab_${index}" class="tab-list-box">
						${tabs.content}
					</div></#if>
				</#list>
			</div>
			<script>
				new Control.Tabs('closeup-recipebox-list', { setClassOnContainer: true, activeClassName:'current' });
			</script>
			
			<div class="demandlet-cuRelProducts"></div>
		
			
		</div>
		<div id="rightcolumn">
			<!-- Custom Modules -->
			<#if (closeup.section_0?exists)>
				<#assign section=closeup.section_0?number>
				<#list closeup.moduleIncludes as moduleInclude>
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