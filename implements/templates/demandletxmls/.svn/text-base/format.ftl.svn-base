<xml>
	<#if (product?exists)>
		<#list product.formats as format>
			<row>
				<#if (format.format_id?exists)>
					<format_id>${format.format_id}</format_id>
				</#if>
				<#if (format.name?exists)>
					<name>${format.name}</name>
				</#if>
			</row>
		</#list>
	</#if>	
</xml>
