<xml>
	<#list product.row as productcontribs>
		<row>
			<#if (productcontribs.id?exists)>
				<id>${productcontribs.id}</id>
			</#if>
			<#if (productcontribs.name?exists)>
				<name>${productcontribs.name}</name>
			</#if>
			<#if (productcontribs.url?exists)>
				<url>${productcontribs.url}</url>
			</#if>			
		</row>
	</#list>
</xml>