<xml>
<#if (event?exists)>
	<#list event.row as events>
		<row>
			<#if (events.image_url?exists)>
				<image_url>${events.image_url}</image_url>
			</#if>
			<#if (events.name?exists)>
				<name>${events.name}</name>
			</#if>
			<#if (events.url?exists)>
				<url>${events.url}</url>	
			</#if>
			<#if (events.price?exists)>
				<price>${events.price}</price>	
			</#if>
		</row> 
	</#list>
</#if>
</xml> 
