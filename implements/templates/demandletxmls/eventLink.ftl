<xml>
<#if (event?exists)>
	<#list event.row as events>
		<row>
			<#if (events.url?exists)>
				<url>${events.url}</url>		
			</#if>
			<#if (events.name?exists)>
				<name>${events.name}</name>
			</#if>
		</row>
	</#list>
</#if>
</xml>