<xml>
	<#if (event?exists)>
		<#list event.row as events>
			<row>
				<#if (events.name?exists)>
					<name>${events.name}</name>
				</#if>
				<#if (events.url?exists)>
					<url>${events.url}</url>
				</#if>
				<#if (events.price?exists)>
					<price>${events.price}</price>
				</#if>
				<#if (events.purchase_url?exists)>
					<purchase_url>${events.purchase_url}</purchase_url>
				</#if>
			</row>
		</#list>
	</#if>
</xml>