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
	<link rel="stylesheet" href="/media/global/global.css" type="text/css" />
	<!--[if IE]><link rel="stylesheet" type="text/css" href="/media/global/iestyles.css" /><![endif]-->
	<!--[if lt IE 7]><link rel="stylesheet" type="text/css" href="/media/global/ie6styles.css" /><![endif]-->
	<script type="text/javascript" src="/ipui/protoculous-packer.js"></script>
	<script type="text/javascript" src="/ipui/ipui-packer.js"></script>
</head>

<body id="blank-template">

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
			
</body>

<script src="http://www.google-analytics.com/urchin.js" type="text/javascript"></script>
<script type="text/javascript">
	_uacct = (function() {return cc[getCountry()]; })();
	urchinTracker();
</script>

</html>
