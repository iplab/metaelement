<#assign x = "<%"> 
<#assign y = "%>"> 
<#assign curModIndex = 0>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title><#if (product.name?exists)>${product.name}</#if></title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<meta name="keywords" content="" />
	<meta name="description" content="" />
	<meta name="product_id" content="<#if (product.product_id?exists)>${product.product_id}</#if>" />
	<meta name="item_number" content="<#if (product.item_number?exists)>${product.item_number}</#if>" />
	<#--><meta name="more_genre_id" content="<#if (product.show_more_genre_id?exists)>${product.show_more_genre_id}</#if>" />
	<meta name="more_genre_count" content="<#if (product.show_more_count?exists)>${product.show_more_count}</#if>" />
	<meta name="genre_type" content="<#if (product.show_more_description?exists)>${product.show_more_description}</#if>" />
	<meta name="show_more_genre_description /genre_type" content="<#if (product.primary_genre?exists)>${product.primary_genre}</#if>" />-->
	<meta name="more_genre_id" content="<#if (product.primary_genre_id?exists)>${product.primary_genre_id}</#if>" />
	<meta name="more_genre_count" content="5" /> 
	<meta name="genre_type" content="<#if (product.primary_genre?exists)>${product.primary_genre}</#if>" /> 
	<meta name="product_tags" content="<#if (product.tags?exists)>${product.tags}</#if>" />
	<link rel="stylesheet" href="/media/global/global.css" type="text/css" />
	<!--[if IE]><link rel="stylesheet" type="text/css" href="/media/global/iestyles.css" /><![endif]-->
	<!--[if lt IE 7]><link rel="stylesheet" type="text/css" href="/media/global/ie6styles.css" /><![endif]-->
	<script type="text/javascript" src="/ipui/protoculous-packer.js"></script>
	<script type="text/javascript" src="/ipui/ipui-packer.js"></script>
</head>

<body<#if (product.primary_dept_name?exists)> id="${product.primary_dept_name}"</#if>>

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
				<#if (product.primary_dept?exists)  && (product.primary_dept_name?exists)><li>&gt;<a href="/${product.primary_dept_name}">${product.primary_dept}</a></li></#if>
				<#if (product.name?exists)><li>&gt;<span class="current">${product.name}</span></li></#if>
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
			<div class="demandlet-relProducts list"></div>
			<div class="demandlet-relTags list"></div>
			<div class="demandlet-moreGenre list"></div>
		</div>
		<div id="centercolumn">
			<div id="productdetail" class="clearfix">
				<!--<div class="awardwinner">Award Winner</div>-->
				<div class="left">
					<img src="<#if (product.image?exists)>${product.image}</#if>" alt="" />
					<div class="demandlet-assets"></div>
				</div>
				<div class="right">
					<h2><#if (product.name?exists)>${product.name}</#if></h2>
					<p class="description"><#if (product.description?exists)>${product.description}</#if></p>
					<p><strong>Item Number: <#if (product.item_number?exists)>${product.item_number}</#if></strong></p>
					<div class="demandlet-buyStatus"></div>
				</div>
				<ul class="useroptions">
					<li><a href="#" onclick="newWindow('/sendtofriend.html','sendFriend',315,400,false,false,true);this.blur();return false;" class="last">Send to a Friend</a></li>
				</ul>
			</div>
			<div class="demandlet-recipeBox"></div>
		</div>
		<div id="rightcolumn">
			<div class="demandlet-recProducts"></div>
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